"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestCheckedInEvent = void 0;
const app_cloudevent_event_1 = require("../../app/app-cloudevent.event");
class GuestCheckedInEvent extends app_cloudevent_event_1.AppCloudEvent {
    specversion = "1.0";
    type = "GuestCheckedInEvent";
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.GuestCheckedInEvent = GuestCheckedInEvent;
//# sourceMappingURL=guest-checked-in.event.js.map