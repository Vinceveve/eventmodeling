"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerHttpController = void 0;
const common_1 = require("@nestjs/common");
const clean_room_command_1 = require("../command/clean-room.command");
let ManagerHttpController = class ManagerHttpController {
    cleanRoomHandler;
    constructor(cleanRoomHandler) {
        this.cleanRoomHandler = cleanRoomHandler;
    }
    async cleanup(command) {
        return this.cleanRoomHandler.handle({
            ...command,
            source: this.constructor.name,
            correlationId: command.correlationId
                ? command.correlationId
                : `${command.data.room.id}_${command.data.date}`,
        });
    }
};
__decorate([
    (0, common_1.Put)("/mutation/cleanup"),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagerHttpController.prototype, "cleanup", null);
ManagerHttpController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [clean_room_command_1.CleanRoomCommandHandler])
], ManagerHttpController);
exports.ManagerHttpController = ManagerHttpController;
//# sourceMappingURL=manager.http.controller.js.map