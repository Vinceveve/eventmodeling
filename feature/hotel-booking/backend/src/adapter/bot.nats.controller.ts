import {
  NatsJetStreamContext,
  NatsJetStreamConsumerOptions,
} from "nats-jetstream-transport";
import { Controller } from "@nestjs/common";
import { EventPattern, Ctx, Payload } from "@nestjs/microservices";

import { ScheduleCleaningCommandHandler } from "../command/schedule-cleaning.command";
import { RoomBookedEvent } from "../../../../../model/booking/event/room-booked.event";
import { bookingStream } from "../../../../../model/booking/booking.stream";

@Controller()
export class BotNatsController {
  constructor(private scheduleCleaning: ScheduleCleaningCommandHandler) {}

  @EventPattern("ScheduleCleanup", {
    description: "Trigger cleaning side effect when room is booked",
    subject: bookingStream.subjects[0],
    deliverTo: "cleanupSaga",
    durable: "cleanupSaga",
    manualAck: true,
  } as NatsJetStreamConsumerOptions)
  async cleanup(
    @Payload() event: RoomBookedEvent,
    @Ctx() context: NatsJetStreamContext
  ) {
    if (event.type != "RoomBookedEvent") {
      context.message.ack();
      return;
    }
    await this.scheduleCleaning.handle({
      ...event,
      source: this.constructor.name,
    });
    context.message.ack();
  }
}
