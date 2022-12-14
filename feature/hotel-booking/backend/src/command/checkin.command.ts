import { NatsJetStreamClient } from "nats-jetstream-transport";
import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { GuestCheckedInEvent } from "../../../../../model/booking/event/guest-checked-in.event";
import {
  Availabilities,
  BookingEntity,
} from "../../../../../model/booking/entity/booking.entity";
import { bookingSubject } from "../../../../../model/booking/booking.stream";

export interface CheckinCommand {
  source: string;
  correlationId: string;
  data: BookingEntity;
}

// TODO move to cleanup service
@Injectable()
export class CheckinCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private client: NatsJetStreamClient) {}

  async handle(command: CheckinCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];

    const data = {
      ...command.data,
      availabity: Availabilities.occupied,
    };
    return await this.client
      .publish(
        bookingSubject(command.data.room.id, day, correlationId),
        new GuestCheckedInEvent(data, source, correlationId),
        // The room must be cleaned and availabe before checking in
        {
          msgID: `checkin-${correlationId}-${command.data.client.id}`,
          expect: { lastSubjectSequence: 2 },
        }
      )
      .catch((e) => {
        const error = `Can't checkin if room is not clean ${command.data.room.id} or room already checked in : ${e.message} #${correlationId}`;
        this.logger.error(error);
        throw new ConflictException(error);
      });
  }
}
