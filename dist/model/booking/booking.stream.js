"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingStream = exports.bookingSubject = void 0;
const bookingSubject = (roomId, day, correlationId) => {
    return `booking.${roomId}.${day}.${correlationId}`;
};
exports.bookingSubject = bookingSubject;
exports.bookingStream = {
    name: "room-booking",
    description: "Booking domain with all its events",
    subjects: ["booking.>"],
};
//# sourceMappingURL=booking.stream.js.map