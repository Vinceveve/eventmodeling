import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { PubAck } from "nats";
import { BookingStream } from "../../../../../model/booking/booking.stream";
import { RoomBookedEvent } from "../../../../../model/booking/event/room-booked.event";
import { BookingEntity } from "../../../../../model/booking/entity/booking.entity";

export interface BookRoomCommand {
  source?: string;
  correlationId?: string;
  data: BookingEntity;
}

@Injectable()
export class BookRoomCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private stream: BookingStream) {}

  async handle(command: BookRoomCommand) {
    const correlationId = command.correlationId;
    const source = this.constructor.name;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const roomId = command.data.room.id;
    this.logger.debug(
      `Book room ${command.data.room.id} for day ${day} #${correlationId}`
    );

    // Mark room booked if it's available
    const uniqueBookingSlug = `booked-${correlationId}`;
    return await this.stream
      .emit(
        new RoomBookedEvent(
          { ...command.data, date: day },
          source,
          correlationId
        ),
        // deduplication trick : booking slug is unique using message ID
        // dupe-window should be configured on stream, default 2mn
        { msgID: uniqueBookingSlug }
      )
      .then((res: PubAck) => {
        if (!res.duplicate) {
          return res;
        }
        const error = `${day} already booked room ${command.data.room.id}`;
        this.logger.error(`${error} #${correlationId}`);
        throw new ConflictException(error);
      });
  }
}
