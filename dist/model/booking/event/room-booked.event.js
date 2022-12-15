"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomBookedEvent = void 0;
const app_cloudevent_event_1 = require("../../app/app-cloudevent.event");
class RoomBookedEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = "RoomBookedEvent";
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomBookedEvent = RoomBookedEvent;
//# sourceMappingURL=room-booked.event.js.map