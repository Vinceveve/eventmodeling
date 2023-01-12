"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomBookedEvent = void 0;
const booking_event_1 = require("./booking.event");
class RoomBookedEvent extends booking_event_1.BookingEvent {
    static specversion = "1.0";
    static type = "RoomBookedEvent";
    constructor(data, source, correlationId, id) {
        super(data, source, correlationId, id);
    }
}
exports.RoomBookedEvent = RoomBookedEvent;
//# sourceMappingURL=room-booked.event.js.map