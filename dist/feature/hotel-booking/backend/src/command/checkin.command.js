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
const common_1 = require("@nestjs/common");
const guest_checked_in_event_1 = require("../../../../../model/booking/event/guest-checked-in.event");
const booking_entity_1 = require("../../../../../model/booking/entity/booking.entity");
const booking_stream_1 = require("../../../../../model/booking/booking.stream");
let CheckinCommandHandler = class CheckinCommandHandler {
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
            ...command.data,
            availabity: booking_entity_1.Availabilities.occupied,
        };
        return await this.client
            .publish((0, booking_stream_1.bookingSubject)(command.data.room.id, day, correlationId), new guest_checked_in_event_1.GuestCheckedInEvent(data, source, correlationId), {
            msgID: `checkin-${correlationId}-${command.data.client.id}`,
            expect: { lastSubjectSequence: 2 },
        })
            .catch((e) => {
            const error = `Can't checkin if room is not clean ${command.data.room.id} or room already checked in : ${e.message} #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        });
    }
};
CheckinCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamClient])
], CheckinCommandHandler);
exports.CheckinCommandHandler = CheckinCommandHandler;
//# sourceMappingURL=checkin.command.js.map