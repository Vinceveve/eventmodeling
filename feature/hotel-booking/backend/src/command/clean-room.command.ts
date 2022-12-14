import { NatsJetStreamClient } from "nats-jetstream-transport";
import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { RoomEntity } from "../../../../../model/admin/room.entity";
import { bookingSubject } from "../../../../../model/booking/booking.stream";
import { RoomAvailableEvent } from "../../../../../model/booking/event/room-available.event";
import {
  cleanupStream,
  cleanupSubject,
} from "../../../../../model/cleanup/cleanup.stream";
import { RoomCleanedUpEvent } from "../../../../../model/cleanup/event/room-cleaned-up.event";
import { headers } from "nats";

export interface CleanRoomCommand {
  source: string;
  correlationId: string;
  data: {
    room: Pick<RoomEntity, "id">;
    date: Date;
  };
}

@Injectable()
export class CleanRoomCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private client: NatsJetStreamClient) {}

  async handle(command: CleanRoomCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];

    const data = {
      room: command.data.room,
    };
    const subject = cleanupSubject(command.data.room.id, day, correlationId);
    this.logger.debug(
      `Cleanup room ${command.data.room.id}  for day ${day} #${correlationId}`
    );
    const h = headers();
    h.set("Nats-Expected-Last-Subject-Sequence", "1");
    h.set("Nats-Expected-Stream", cleanupStream.name);
    await this.client
      .publish(
        subject,
        new RoomCleanedUpEvent(
          { ...data, date: new Date() },
          source,
          correlationId
        ),
        // The room must be booked this day
        {
          //headers: h,
          expect: {
            streamName: cleanupStream.name,
            lastSubjectSequence: 1,
          },
        }
      )
      .then(console.log)
      .catch((e) => {
        const error = `Can't cleanup room ${command.data.room.id} is it booked ? or already clean ? ${e.message}`;
        this.logger.error(`${error} #${correlationId}`);
        throw new ConflictException(error);
      });

    this.logger.debug(
      `Mark available room ${command.data.room.id} for day ${day} #${correlationId}`
    );
    return await this.client.publish(
      bookingSubject(command.data.room.id, day, correlationId),
      new RoomAvailableEvent(
        { ...data, date: new Date() },
        source,
        correlationId
      )
    );
  }
}
