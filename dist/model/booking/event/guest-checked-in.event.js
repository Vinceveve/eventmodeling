"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestCheckedInEvent = void 0;
const booking_event_1 = require("./booking.event");
class GuestCheckedInEvent extends booking_event_1.BookingEvent {
    static specversion = "1.0";
    static type = "GuestCheckedInEvent";
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.GuestCheckedInEvent = GuestCheckedInEvent;
//# sourceMappingURL=guest-checked-in.event.js.map