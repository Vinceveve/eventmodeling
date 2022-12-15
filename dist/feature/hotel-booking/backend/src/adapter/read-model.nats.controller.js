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
exports.ReadModelNatsController = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const booking_projection_1 = require("../projection/booking.projection");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
let ReadModelNatsController = class ReadModelNatsController {
    bookingState;
    constructor(bookingState) {
        this.bookingState = bookingState;
    }
    async roomProjection(event, context) {
        await this.bookingState.handle(event);
        context.message.ack();
    }
};
__decorate([
    (0, microservices_1.EventPattern)("BookingProjection", {
        description: "Maintain Booking read model state from events",
        subject: booking_stream_1.bookingStream.subjects[0],
        durable: "bookingState",
        deliverTo: "bookingState",
        manualAck: true,
    }),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nats_jetstream_transport_1.NatsJetStreamContext]),
    __metadata("design:returntype", Promise)
], ReadModelNatsController.prototype, "roomProjection", null);
ReadModelNatsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [booking_projection_1.BookingProjection])
], ReadModelNatsController);
exports.ReadModelNatsController = ReadModelNatsController;
//# sourceMappingURL=read-model.nats.controller.js.map