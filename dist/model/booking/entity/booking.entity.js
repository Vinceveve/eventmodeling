"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEntity = exports.Availabilities = void 0;
var Availabilities;
(function (Availabilities) {
    Availabilities["available"] = "available";
    Availabilities["cleaning"] = "cleaning";
    Availabilities["booked"] = "booked";
    Availabilities["occupied"] = "occupied";
})(Availabilities = exports.Availabilities || (exports.Availabilities = {}));
class BookingEntity {
    room;
    client;
    date;
    availability;
    updatedAt;
    updatedBy;
}
exports.BookingEntity = BookingEntity;
//# sourceMappingURL=booking.entity.js.map