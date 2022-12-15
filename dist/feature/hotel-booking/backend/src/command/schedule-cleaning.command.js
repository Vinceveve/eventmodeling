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
exports.ScheduleCleaningCommandHandler = void 0;
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const common_1 = require("@nestjs/common");
const room_cleaning_scheduled_event_1 = require("../../../../../model/cleanup/event/room-cleaning-scheduled.event");
const cleanup_stream_1 = require("../../../../../model/cleanup/cleanup.stream");
let ScheduleCleaningCommandHandler = class ScheduleCleaningCommandHandler {
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
        this.logger.log(`Schedule cleaning for room ${command.data.room.id} #${correlationId}`);
        const res = await this.client.publish((0, cleanup_stream_1.cleanupSubject)(command.data.room.id, day, correlationId), new room_cleaning_scheduled_event_1.RoomCleaningScheduledEvent(command.data, source, correlationId), { msgID: `cleanup-${correlationId}` });
        this.logger.log(`Cleaning scheduled for room ${command.data.room.id} #${correlationId}`);
        return res;
    }
};
ScheduleCleaningCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_jetstream_transport_1.NatsJetStreamClient])
], ScheduleCleaningCommandHandler);
exports.ScheduleCleaningCommandHandler = ScheduleCleaningCommandHandler;
//# sourceMappingURL=schedule-cleaning.command.js.map