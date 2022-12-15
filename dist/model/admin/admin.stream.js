"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStream = exports.adminSubject = void 0;
const adminSubject = (hotelId, roomId) => {
    return `hotel.${hotelId}.admin.room.${roomId}`;
};
exports.adminSubject = adminSubject;
exports.adminStream = {
    name: "hotel-administration",
    description: "Agents and manager domain",
    subjects: ["hotel.*.admin.room.>"],
};
//# sourceMappingURL=admin.stream.js.map