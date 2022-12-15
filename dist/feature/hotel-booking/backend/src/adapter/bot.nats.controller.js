"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotNatsController = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const schedule_cleaning_command_1 = require("../command/schedule-cleaning.command");
const room_booked_event_1 = require("../../../../../model/booking/event/room-booked.event");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
let BotNatsController = class BotNatsController {
    scheduleCleaning;
    constructor(scheduleCleaning) {
        this.scheduleCleaning = scheduleCleaning;
    }
    async cleanup(event, context) {
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
};
__decorate([
    (0, microservices_1.EventPattern)("ScheduleCleanup", {
        description: "Trigger cleaning side effect when room is booked",
        subject: booking_stream_1.bookingStream.subjects[0],
        deliverTo: "cleanupSaga",
        durable: "cleanupSaga",
        manualAck: true,
    }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_booked_event_1.RoomBookedEvent,
        nats_jetstream_transport_1.NatsJetStreamContext]),
    __metadata("design:returntype", Promise)
], BotNatsController.prototype, "cleanup", null);
BotNatsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [schedule_cleaning_command_1.ScheduleCleaningCommandHandler])
], BotNatsController);
exports.BotNatsController = BotNatsController;
//# sourceMappingURL=bot.nats.controller.js.map