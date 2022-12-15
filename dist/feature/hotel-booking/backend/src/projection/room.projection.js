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
exports.BookingProjection = void 0;
const common_1 = require("@nestjs/common");
const nats_1 = require("nats");
const booking_entity_1 = require("../../../../../model/booking/entity/booking.entity");
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
let BookingProjection = class BookingProjection {
    keyStore;
    logger = new common_1.Logger(this.constructor.name);
    codec = (0, nats_1.JSONCodec)();
    constructor(keyStore) {
        this.keyStore = keyStore;
    }
    async handle(event) {
        const isoDate = new Date(event.data.date);
        const day = isoDate.toISOString().split("T")[0];
        const booking = await this.keyStore.assertBucket("booking");
        const key = `booking.${event.data.room.id}.${day}`;
        this.logger.log(`Handle state for key ${key} and event ${event.type} #${event.correlationId}`);
        const state = await booking.get(key).then((entry) => {
            return entry
                ? this.codec.decode(entry.value)
                : {};
        });
        const handler = this.handlers[event.type];
        const newState = handler(event, state);
        if (!newState) {
            await booking.delete(key);
            this.logger.log(`No state return, delete key ${key}`);
        }
        else if (!state) {
            this.logger.log(`Key ${key} does not exists, create it`);
            await booking.create(key, this.codec.encode(newState));
        }
        else if (state != newState) {
            this.logger.log(`State is different for ${key}, update it`);
            await booking.put(key, this.codec.encode(newState));
        }
        return newState;
    }
    handlers = {
        RoomBookedEvent: (event, state) => ({
            ...state,
            ...event.data,
            updatedAt: event.time,
            updatedBy: event.type,
            availability: booking_entity_1.Availabilities.booked,
        }),
        RoomAvailableEvent: (event, state) => ({
            ...state,
            updatedAt: event.time,
            updatedBy: event.type,
            availability: booking_entity_1.Availabilities.available,
        }),
        GuestCheckedInEvent: (event, state) => ({
            ...state,
            updatedAt: event.time,
            updatedBy: event.type,
            availability: booking_entity_1.Availabilities.occupied,
        }),
    };
};
BookingProjection = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamKeyStore])
], BookingProjection);
exports.BookingProjection = BookingProjection;
//# sourceMappingURL=room.projection.js.map