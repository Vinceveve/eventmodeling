"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelBookingModule = void 0;
const common_1 = require("@nestjs/common");
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const book_room_command_1 = require("./command/book-room.command");
const guest_http_controller_1 = require("./adapter/guest.http.controller");
const read_model_nats_controller_1 = require("./adapter/read-model.nats.controller");
const booking_projection_1 = require("./projection/booking.projection");
const schedule_cleaning_command_1 = require("./command/schedule-cleaning.command");
const clean_room_command_1 = require("./command/clean-room.command");
const checkin_command_1 = require("./command/checkin.command");
const booking_availability_query_1 = require("./query/booking-availability.query");
const bot_nats_controller_1 = require("./adapter/bot.nats.controller");
const manager_http_controller_1 = require("./adapter/manager.http.controller");
let HotelBookingModule = class HotelBookingModule {
};
HotelBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nats_jetstream_transport_1.NatsJetStreamTransport.register({
                connectionOptions: {
                    servers: "127.0.0.1:4222",
                    name: "hotel-booking-publisher",
                },
            }),
        ],
        controllers: [
            guest_http_controller_1.GuestHttpController,
            manager_http_controller_1.ManagerHttpController,
            bot_nats_controller_1.BotNatsController,
            read_model_nats_controller_1.ReadModelNatsController,
        ],
        providers: [
            book_room_command_1.BookRoomCommandHandler,
            schedule_cleaning_command_1.ScheduleCleaningCommandHandler,
            clean_room_command_1.CleanRoomCommandHandler,
            checkin_command_1.CheckinCommandHandler,
            booking_availability_query_1.BookingAvailabilityQuery,
            booking_projection_1.BookingProjection,
        ],
    })
], HotelBookingModule);
exports.HotelBookingModule = HotelBookingModule;
//# sourceMappingURL=hotel-booking.module.js.map