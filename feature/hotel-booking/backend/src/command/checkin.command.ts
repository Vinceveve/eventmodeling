import { NatsJetStreamKeyStore } from "nats-jetstream-transport";
import { JSONCodec } from "nats";
import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { GuestCheckedInEvent } from "../../../../../model/booking/event/guest-checked-in.event";
import {
  Availabilities,
  BookingEntity,
} from "../../../../../model/booking/entity/booking.entity";
import { BookingStream } from "../../../../../model/booking/booking.stream";

export interface CheckinCommand {
  source: string;
  correlationId: string;
  data: Partial<BookingEntity>;
}

@Injectable()
export class CheckinCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  private codec = JSONCodec();
  constructor(
    private stream: BookingStream,
    private keyStore: NatsJetStreamKeyStore
  ) {}

  async handle(command: CheckinCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const roomId = command.data.room.id;

    // The room must have been cleaned up before
    // state should be in available
    const booking = await this.keyStore.assertBucket("booking");
    const key = `booking.${roomId}.${day}`;
    const state = await booking.get(key).then((entry) => {
      return entry
        ? (this.codec.decode(entry.value) as Partial<BookingEntity>)
        : ({} as Partial<BookingEntity>);
    });
    if (state.availability != Availabilities.available) {
      const error = `Can't checkin if room ${roomId} is not cleaned : current state is ${state.availability} #${correlationId}`;
      this.logger.error(error);
      throw new ConflictException(error);
    }

    return await this.stream
      .emit(
        new GuestCheckedInEvent(
          {
            date: day,
            room: command.data.room,
            availability: Availabilities.occupied,
          },
          source,
          correlationId
        ),
        {
          // Only one checkin available per day
          expect: { lastSubjectSequence: 0 },
        }
      )
      .catch((e) => {
        const error = `Can't checkin if room ${roomId} is already checked in : ${e.message} #${correlationId}`;
        this.logger.error(error);
        throw new ConflictException(error);
      });
  }
}
