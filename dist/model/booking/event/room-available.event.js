"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAvailableEvent = void 0;
const app_cloudevent_event_1 = require("../../app/app-cloudevent.event");
class RoomAvailableEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = "RoomAvailableEvent";
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomAvailableEvent = RoomAvailableEvent;
//# sourceMappingURL=room-available.event.js.map