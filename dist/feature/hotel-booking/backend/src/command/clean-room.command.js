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
const common_1 = require("@nestjs/common");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
const room_available_event_1 = require("../../../../../model/booking/event/room-available.event");
const cleanup_stream_1 = require("../../../../../model/cleanup/cleanup.stream");
const room_cleaned_up_event_1 = require("../../../../../model/cleanup/event/room-cleaned-up.event");
const room_cleaning_scheduled_event_1 = require("../../../../../model/cleanup/event/room-cleaning-scheduled.event");
let CleanRoomCommandHandler = class CleanRoomCommandHandler {
    stream;
    bookingStream;
    logger = new common_1.Logger(this.constructor.name);
    constructor(stream, bookingStream) {
        this.stream = stream;
        this.bookingStream = bookingStream;
    }
    async handle(command) {
        const source = this.constructor.name;
        const correlationId = command.correlationId;
        const isoDate = new Date(command.data.date);
        const day = isoDate.toISOString().split("T")[0];
        const roomId = command.data.room.id;
        const subjectExists = await this.stream.subjectExists(cleanup_stream_1.CleanupStream.buildsubject({
            roomId,
            day,
            eventType: room_cleaning_scheduled_event_1.RoomCleaningScheduledEvent.type,
            correlationId,
        }));
        if (!subjectExists) {
            const error = `No cleanup was scheduled for room ${roomId} on ${day}, ignore #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        }
        this.logger.debug(`Cleanup room ${roomId} for day ${day} #${correlationId}`);
        await this.stream
            .emit(new room_cleaned_up_event_1.RoomCleanedUpEvent({ room: command.data.room, date: day }, source, correlationId), { expect: { lastSubjectSequence: 0 } })
            .catch((e) => {
            const error = `Can't cleanup room ${roomId} it's already clean ${e.message} #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        });
        this.logger.debug(`Mark room ${roomId} available for ${day} #${correlationId}`);
        const availableEvent = new room_available_event_1.RoomAvailableEvent({ room: command.data.room, date: day }, source, correlationId);
        return await this.bookingStream.emit(availableEvent);
    }
};
CleanRoomCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cleanup_stream_1.CleanupStream,
        booking_stream_1.BookingStream])
], CleanRoomCommandHandler);
exports.CleanRoomCommandHandler = CleanRoomCommandHandler;
//# sourceMappingURL=clean-room.command.js.map