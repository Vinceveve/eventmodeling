"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomCreatedEvent = void 0;
const app_cloudevent_event_1 = require("../app/app-cloudevent.event");
class RoomCreatedEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = this.constructor.name;
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomCreatedEvent = RoomCreatedEvent;
//# sourceMappingURL=room-created.event.js.map