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
const common_1 = require("@nestjs/common");
const room_cleaning_scheduled_event_1 = require("../../../../../model/cleanup/event/room-cleaning-scheduled.event");
const cleanup_stream_1 = require("../../../../../model/cleanup/cleanup.stream");
let ScheduleCleaningCommandHandler = class ScheduleCleaningCommandHandler {
    stream;
    logger = new common_1.Logger(this.constructor.name);
    constructor(stream) {
        this.stream = stream;
    }
    async handle(command) {
        const source = this.constructor.name;
        const correlationId = command.correlationId;
        const isoDate = new Date(command.data.date);
        const day = isoDate.toISOString().split("T")[0];
        const roomId = command.data.room.id;
        this.logger.log(`Schedule cleaning for room ${roomId} #${correlationId}`);
        const res = await this.stream
            .emit(new room_cleaning_scheduled_event_1.RoomCleaningScheduledEvent(command.data, source, correlationId), { expect: { lastSubjectSequence: 0 } })
            .catch((e) => {
            const error = `Can't schedule cleaning if room ${roomId} has cleaning already scheduled #${correlationId}`;
            this.logger.error(error);
            throw new common_1.ConflictException(error);
        });
        this.logger.log(`Cleaning scheduled for room ${roomId} #${correlationId}`);
        return res;
    }
};
ScheduleCleaningCommandHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cleanup_stream_1.CleanupStream])
], ScheduleCleaningCommandHandler);
exports.ScheduleCleaningCommandHandler = ScheduleCleaningCommandHandler;
//# sourceMappingURL=schedule-cleaning.command.js.map