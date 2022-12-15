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
exports.GuestHttpController = void 0;
const common_1 = require("@nestjs/common");
const book_room_command_1 = require("../command/book-room.command");
const checkin_command_1 = require("../command/checkin.command");
let GuestHttpController = class GuestHttpController {
    bookRoomCommandHandler;
    checkinHandler;
    constructor(bookRoomCommandHandler, checkinHandler) {
        this.bookRoomCommandHandler = bookRoomCommandHandler;
        this.checkinHandler = checkinHandler;
    }
    async availability(command) { }
    async bookRoom(command) {
        return this.bookRoomCommandHandler.handle({
            ...command,
            source: this.constructor.name,
            correlationId: command.correlationId
                ? command.correlationId
                : `${command.data.room.id}_${command.data.date}`,
        });
    }
    async checkin(command) {
        return this.checkinHandler.handle({
            ...command,
            source: this.constructor.name,
            correlationId: command.correlationId
                ? command.correlationId
                : `${command.data.room.id}_${command.data.date}`,
        });
    }
};
__decorate([
    (0, common_1.Get)("/hotel/{hotelId}/room/{roomId}"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuestHttpController.prototype, "availability", null);
__decorate([
    (0, common_1.Put)("/mutation/book-room"),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuestHttpController.prototype, "bookRoom", null);
__decorate([
    (0, common_1.Put)("/mutation/checkin"),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuestHttpController.prototype, "checkin", null);
GuestHttpController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [book_room_command_1.BookRoomCommandHandler,
        checkin_command_1.CheckinCommandHandler])
], GuestHttpController);
exports.GuestHttpController = GuestHttpController;
//# sourceMappingURL=guest.http.controller.js.map