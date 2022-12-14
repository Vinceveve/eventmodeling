import {
  NatsJetStreamContext,
  NatsJetStreamConsumerOptions,
} from "nats-jetstream-transport";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";

import { BookingProjection } from "../projection/booking.projection";
import { RoomAvailableEvent } from "../../../../../model/booking/event/room-available.event";

import { GuestCheckedInEvent } from "../../../../../model/booking/event/guest-checked-in.event";
import { RoomBookedEvent } from "../../../../../model/booking/event/room-booked.event";
import { bookingStream } from "../../../../../model/booking/booking.stream";

@Controller()
export class ReadModelNatsController {
  constructor(private bookingState: BookingProjection) {}

  @EventPattern("BookingProjection", {
    description: "Maintain Booking read model state from events",
    subject: bookingStream.subjects[0],
    durable: "bookingState",
    deliverTo: "bookingState",
    manualAck: true,
  } as NatsJetStreamConsumerOptions)
  async roomProjection(
    @Payload()
    event: RoomBookedEvent | RoomAvailableEvent | GuestCheckedInEvent,
    @Ctx() context: NatsJetStreamContext
  ) {
    await this.bookingState.handle(event);

    context.message.ack();
  }
}
