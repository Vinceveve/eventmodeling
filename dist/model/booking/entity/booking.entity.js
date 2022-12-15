"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEntity = exports.Availabilities = void 0;
var Availabilities;
(function (Availabilities) {
    Availabilities[Availabilities["available"] = 0] = "available";
    Availabilities[Availabilities["cleaning"] = 1] = "cleaning";
    Availabilities[Availabilities["booked"] = 2] = "booked";
    Availabilities[Availabilities["occupied"] = 3] = "occupied";
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