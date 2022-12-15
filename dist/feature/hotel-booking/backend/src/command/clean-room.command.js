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
exports.CleanRoomCommandHandler = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
const room_available_event_1 = require("../../../../../model/booking/event/room-available.event");
const cleanup_stream_1 = require("../../../../../model/cleanup/cleanup.stream");
const room_cleaned_up_event_1 = require("../../../../../model/cleanup/event/room-cleaned-up.event");
const nats_1 = require("nats");
let CleanRoomCommandHandler = class CleanRoomCommandHandler {
    client;
    logger = new common_1.Logger(this.constructor.name);
    constructor(client) {
        this.client = client;
    }
    async handle(command) {
        const source = this.constructor.name;
        const correlationId = command.correlationId;
        const isoDate = new Date(command.data.date);
        const day = isoDate.toISOString().split("T")[0];
        const data = {
            room: command.data.room,
        };
        const subject = (0, cleanup_stream_1.cleanupSubject)(command.data.room.id, day, correlationId);
        this.logger.debug(`Cleanup room ${command.data.room.id}  for day ${day} #${correlationId}`);
        const h = (0, nats_1.headers)();
        h.set("Nats-Expected-Last-Subject-Sequence", "1");
        h.set("Nats-Expected-Stream", cleanup_stream_1.cleanupStream.name);
        await this.client
            .publish(subject, new room_cleaned_up_event_1.RoomCleanedUpEvent({ ...data, date: new Date() }, source, correlationId), {
            expect: {
                streamName: cleanup_stream_1.cleanupStream.name,
                lastSubjectSequence: 1,
            },
        })
            .then(console.log)
            .catch((e) => {
            const error = `Can't cleanup room ${command.data.room.id} is it booked ? or already clean ? ${e.message}`;
            this.logger.error(`${error} #${correlationId}`);
            throw new common_1.ConflictException(error);
        });
        this.logger.debug(`Mark available room ${command.data.room.id} for day ${day} #${correlationId}`);
        return await this.client.publish((0, booking_stream_1.bookingSubject)(command.data.room.id, day, correlationId), new room_available_event_1.RoomAvailableEvent({ ...data, date: new Date() }, source, correlationId));
    }
};
CleanRoomCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamClient])
], CleanRoomCommandHandler);
exports.CleanRoomCommandHandler = CleanRoomCommandHandler;
//# sourceMappingURL=clean-room.command.js.map