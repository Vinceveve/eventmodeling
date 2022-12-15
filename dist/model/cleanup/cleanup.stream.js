"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStream = exports.cleanupSubject = void 0;
const cleanupSubject = (roomId, day, correlationId) => {
    return `cleanup.${roomId}.${day}.${correlationId}`;
};
exports.cleanupSubject = cleanupSubject;
exports.cleanupStream = {
    name: "room-cleanup",
    description: "Cleaning domain with all its events",
    subjects: ["cleanup.>"],
};
//# sourceMappingURL=cleanup.stream.js.map