import { Module } from "@nestjs/common";
import { NatsJetStreamTransport } from "nats-jetstream-transport";
import { BookingStream } from "./booking/booking.stream";
import { CleanupStream } from "./cleanup/cleanup.stream";

@Module({
  imports: [
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: "127.0.0.1:4222",
        name: "hotel-booking-publisher",
      },
    }),
  ],
  providers: [BookingStream, CleanupStream],
})
export class ModelModule {}
