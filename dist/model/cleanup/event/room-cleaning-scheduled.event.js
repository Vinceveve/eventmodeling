"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCleaningScheduledEvent = void 0;
const app_cloudevent_event_1 = require("../../app/app-cloudevent.event");
class RoomCleaningScheduledEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = this.constructor.name;
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomCleaningScheduledEvent = RoomCleaningScheduledEvent;
//# sourceMappingURL=room-cleaning-scheduled.event.js.map