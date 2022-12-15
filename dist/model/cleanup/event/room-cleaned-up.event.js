"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCleanedUpEvent = void 0;
const app_cloudevent_event_1 = require("../../app/app-cloudevent.event");
class RoomCleanedUpEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = this.constructor.name;
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomCleanedUpEvent = RoomCleanedUpEvent;
//# sourceMappingURL=room-cleaned-up.event.js.map