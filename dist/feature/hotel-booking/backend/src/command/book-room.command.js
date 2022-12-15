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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoomCommandHandler = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
const room_booked_event_1 = require("../../../../../model/booking/event/room-booked.event");
let BookRoomCommandHandler = class BookRoomCommandHandler {
    client;
    logger = new common_1.Logger(this.constructor.name);
    constructor(client) {
        this.client = client;
    }
    async handle(command) {
        const correlationId = command.correlationId;
        const source = this.constructor.name;
        const isoDate = new Date(command.data.date);
        const day = isoDate.toISOString().split("T")[0];
        this.logger.debug(`Book room ${command.data.room.id} for day ${day} #${correlationId}`);
        const uniqueBookingSlug = `booked-${correlationId}`;
        return await this.client
            .publish((0, booking_stream_1.bookingSubject)(command.data.room.id, day, correlationId), new room_booked_event_1.RoomBookedEvent({ ...command.data, date: isoDate }, source, correlationId), { msgID: uniqueBookingSlug })
            .then((res) => {
            if (!res.duplicate) {
                return res;
            }
            const error = `${day} already booked room ${command.data.room.id}`;
            this.logger.error(`${error} #${correlationId}`);
            throw new common_1.ConflictException(error);
        });
    }
};
BookRoomCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamClient])
], BookRoomCommandHandler);
exports.BookRoomCommandHandler = BookRoomCommandHandler;
//# sourceMappingURL=book-room.command.js.map