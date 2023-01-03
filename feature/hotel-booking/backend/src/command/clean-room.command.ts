import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { RoomEntity } from "../../../../../model/admin/room.entity";
import { BookingStream } from "../../../../../model/booking/booking.stream";
import { RoomAvailableEvent } from "../../../../../model/booking/event/room-available.event";
import { CleanupStream } from "../../../../../model/cleanup/cleanup.stream";
import { RoomCleanedUpEvent } from "../../../../../model/cleanup/event/room-cleaned-up.event";
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
    private stream: CleanupStream,
    private bookingStream: BookingStream
  ) {}

  async handle(command: CleanRoomCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const roomId = command.data.room.id;

    // Cleanup should have been scheduled or we don't do it
    // Meaning a subject should exists
    const subjectExists = await this.stream.subjectExists(
      CleanupStream.buildsubject({
        roomId,
        day,
        eventType: RoomCleaningScheduledEvent.type,
        correlationId,
      })
    );

    if (!subjectExists) {
      const error = `No cleanup was scheduled for room ${roomId} on ${day}, ignore #${correlationId}`;
      this.logger.error(error);
      throw new ConflictException(error);
    }

    this.logger.debug(
      `Cleanup room ${roomId} for day ${day} #${correlationId}`
    );
    // Only one cleanup per day and per room
    // Meaning subject should not exists and this event position should be the first on the subject
    await this.stream
      .emit(
        new RoomCleanedUpEvent(
          { room: command.data.room, date: day },
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
    return await this.bookingStream.emit(availableEvent);
  }
}
