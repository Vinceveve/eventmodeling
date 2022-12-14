import { Module } from "@nestjs/common";
import { NatsJetStreamTransport } from "nats-jetstream-transport";
import { BookRoomCommandHandler } from "./command/book-room.command";
import { GuestHttpController } from "./adapter/guest.http.controller";
import { ReadModelNatsController } from "./adapter/read-model.nats.controller";
import { BookingProjection } from "./projection/booking.projection";
import { ScheduleCleaningCommandHandler } from "./command/schedule-cleaning.command";
import { CleanRoomCommandHandler } from "./command/clean-room.command";
import { CheckinCommandHandler } from "./command/checkin.command";
import { BookingAvailabilityQuery } from "./query/booking-availability.query";
import { BotNatsController } from "./adapter/bot.nats.controller";
import { ManagerHttpController } from "./adapter/manager.http.controller";

@Module({
  imports: [
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: "127.0.0.1:4222",
        name: "hotel-booking-publisher",
      },

      // TODO move stream config here ?
    }),
  ],
  controllers: [
    GuestHttpController,
    ManagerHttpController,
    BotNatsController,
    ReadModelNatsController,
  ],
  providers: [
    BookRoomCommandHandler,
    ScheduleCleaningCommandHandler,
    CleanRoomCommandHandler,
    CheckinCommandHandler,

    BookingAvailabilityQuery,

    BookingProjection,
  ],
})
export class HotelBookingModule {}
