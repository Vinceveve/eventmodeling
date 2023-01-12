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
exports.CheckinCommandHandler = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const nats_1 = require("nats");
const common_1 = require("@nestjs/common");
const guest_checked_in_event_1 = require("../../../../../model/booking/event/guest-checked-in.event");
const booking_entity_1 = require("../../../../../model/booking/entity/booking.entity");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
let CheckinCommandHandler = class CheckinCommandHandler {
    stream;
    keyStore;
    logger = new common_1.Logger(this.constructor.name);
    codec = (0, nats_1.JSONCodec)();
    constructor(stream, keyStore) {
        this.stream = stream;
        this.keyStore = keyStore;
    }
    async handle(command) {
        const source = this.constructor.name;
        const correlationId = command.correlationId;
        const isoDate = new Date(command.data.date);
        const day = isoDate.toISOString().split("T")[0];
        const roomId = command.data.room.id;
        const booking = await this.keyStore.assertBucket("booking");
        const key = `booking.${roomId}.${day}`;
        const state = await booking.get(key).then((entry) => {
            return entry
                ? this.codec.decode(entry.value)
                : {};
        });
        if (state.availability != booking_entity_1.Availabilities.available) {
            const error = `Can't checkin if room ${roomId} is not cleaned : current state is ${state.availability} #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        }
        return await this.stream
            .emit(new guest_checked_in_event_1.GuestCheckedInEvent({
            date: day,
            room: command.data.room,
            availability: booking_entity_1.Availabilities.occupied,
        }, source, correlationId), {
            expect: { lastSubjectSequence: 0 },
        })
            .catch((e) => {
            const error = `Can't checkin if room ${roomId} is already checked in : ${e.message} #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        });
    }
};
CheckinCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_stream_1.BookingStream,
        nats_jetstream_transport_1.NatsJetStreamKeyStore])
], CheckinCommandHandler);
exports.CheckinCommandHandler = CheckinCommandHandler;
//# sourceMappingURL=checkin.command.js.map