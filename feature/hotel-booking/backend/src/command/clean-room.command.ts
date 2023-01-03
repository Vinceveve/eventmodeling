import {
  NatsJetStreamClient,
  NatsJetStreamManager,
} from "nats-jetstream-transport";
import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { RoomEntity } from "../../../../../model/admin/room.entity";
import { BookingStream } from "../../../../../model/booking/booking.stream";
import { RoomAvailableEvent } from "../../../../../model/booking/event/room-available.event";
import { CleanupStream } from "../../../../../model/cleanup/cleanup.stream";
import { RoomCleanedUpEvent } from "../../../../../model/cleanup/event/room-cleaned-up.event";
import { Empty, NatsError } from "nats";
import { RoomCleaningScheduledEvent } from "../../../../../model/cleanup/event/room-cleaning-scheduled.event";

export interface CleanRoomCommand {
  source?: string;
  correlationId: string;
  data: {
    room: Pick<RoomEntity, "id">;
    date: string;
  };
}

@Injectable()
export class CleanRoomCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private client: NatsJetStreamClient,
    private manager: NatsJetStreamManager
  ) {}

  async handle(command: CleanRoomCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const roomId = command.data.room.id;

    // Cleanup should have been scheduled or we don't do it
    const subjects = await (
      await this.manager.streams()
    ).info(CleanupStream.stream, {
      subjects_filter: CleanupStream.buildsubject({
        roomId,
        day,
        eventType: RoomCleaningScheduledEvent.type,
        correlationId,
      }),
    });

    if (subjects.state.subjects.length == 0) {
      const error = `No cleanup was scheduled for room ${roomId} on ${day}, ignore #${correlationId}`;
      this.logger.error(error);
      throw new ConflictException(error);
    }

    this.logger.debug(
      `Cleanup room ${roomId} for day ${day} #${correlationId}`
    );
    // Only one cleanup per day and per room
    // Meaning subject should not exists and this event position should be the first on the subject
    await this.client
      .publish(
        CleanupStream.buildsubject({
          roomId,
          day,
          correlationId,
          eventType: RoomCleanedUpEvent.type,
        }),
        new RoomCleanedUpEvent(
          { room: command.data.room, date: new Date() },
          source,
          correlationId
        ),
        { expect: { lastSubjectSequence: 0 } }
      )
      .catch((e) => {
        const error = `Can't cleanup room ${roomId} it's already clean ${e.message} #${correlationId}`;
        this.logger.error(error);
        throw new ConflictException(error);
      });

    this.logger.debug(
      `Mark room ${roomId} available for ${day} #${correlationId}`
    );
    const availableEvent = new RoomAvailableEvent(
      { room: command.data.room, date: day },
      source,
      correlationId
    );
    return await this.client.publish(
      BookingStream.buildSubject({ roomId, day, event: availableEvent }),
      availableEvent
    );
  }
}
