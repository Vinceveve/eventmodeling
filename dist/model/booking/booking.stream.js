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
var BookingStream_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStream = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
let BookingStream = BookingStream_1 = class BookingStream {
    client;
    manager;
    static config = {
        name: "booking",
        description: "Booking domain with all its events",
        subjects: ["booking.>"],
    };
    constructor(client, manager) {
        this.client = client;
        this.manager = manager;
    }
    async emit(event, publishOptions) {
        const subject = BookingStream_1.buildsubject({
            roomId: event.data.room.id,
            day: event.data.date,
            eventType: event.type,
            correlationId: event.correlationId,
        });
        return await this.client.publish(subject, event, publishOptions);
    }
    async subjectExists(subject) {
        const stream = await this.manager.streams();
        const streamInfo = await stream.info(BookingStream_1.config.name, {
            subjects_filter: subject,
        });
        return streamInfo.state.subjects ? true : false;
    }
    static buildsubject({ roomId, day, event, eventType, correlationId, }) {
        if (!event && !eventType) {
            throw new Error("To generate a subject you should provide event or eventType");
        }
        let type;
        const hierarchy = [BookingStream_1.config.name, roomId, day];
        type = event ? event.type : eventType;
        type = type.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs) => (ofs ? "-" : "") + s.toLowerCase());
        hierarchy.push(type);
        const correlation = event ? event.correlationId : correlationId;
        hierarchy.push(correlation);
        return hierarchy.join(".");
    }
};
BookingStream = BookingStream_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamClient,
        nats_jetstream_transport_1.NatsJetStreamManager])
], BookingStream);
exports.BookingStream = BookingStream;
//# sourceMappingURL=booking.stream.js.map