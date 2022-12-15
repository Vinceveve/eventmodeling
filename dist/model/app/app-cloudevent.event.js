"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCloudEvent = void 0;
const crypto_1 = require("crypto");
class AppCloudEvent {
    specversion = "1.0";
    type = this.constructor.name;
    source;
    id;
    time;
    data;
    correlationId;
    constructor(data, source, correlationId, id) {
        this.source = source;
        this.id = id ? id : (0, crypto_1.randomUUID)();
        this.correlationId = correlationId ? correlationId : (0, crypto_1.randomUUID)();
        this.time = new Date().toISOString();
        this.data = data;
    }
}
exports.AppCloudEvent = AppCloudEvent;
//# sourceMappingURL=app-cloudevent.event.js.map