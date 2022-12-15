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
exports.BookingAvailabilityQuery = void 0;
const common_1 = require("@nestjs/common");
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const nats_1 = require("nats");
let BookingAvailabilityQuery = class BookingAvailabilityQuery {
    keyStore;
    codec = (0, nats_1.JSONCodec)((key, value) => {
        console.log(value);
    });
    kv;
    constructor(keyStore) {
        this.keyStore = keyStore;
    }
    async handle(query) {
        return (await this.assertBucket())
            .get(`booking.${query.room.id}`)
            .then((entry) => this.codec.decode(entry.value));
    }
    async assertBucket() {
        if (!this.kv) {
            const kv = await this.keyStore.assertBucket(`room`, { history: 3 });
        }
        return this.kv;
    }
};
BookingAvailabilityQuery = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamKeyStore])
], BookingAvailabilityQuery);
exports.BookingAvailabilityQuery = BookingAvailabilityQuery;
//# sourceMappingURL=booking-availability.query.js.map