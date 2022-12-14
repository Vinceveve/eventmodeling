import { Controller, Put, Body, Get, HttpCode } from "@nestjs/common";
import {
  BookRoomCommandHandler,
  BookRoomCommand,
} from "../command/book-room.command";
import {
  CheckinCommand,
  CheckinCommandHandler,
} from "../command/checkin.command";

@Controller()
export class GuestHttpController {
  constructor(
    private bookRoomCommandHandler: BookRoomCommandHandler,
    private checkinHandler: CheckinCommandHandler
  ) {}
  @Get("/hotel/{hotelId}/room/{roomId}")
  async availability(@Body() command: BookRoomCommand) {}
  @Put("/mutation/book-room")
  @HttpCode(201)
  async bookRoom(@Body() command: BookRoomCommand) {
    return this.bookRoomCommandHandler.handle({
      ...command,
      source: this.constructor.name,
      // Client can control correlation ID or generated here
      // Source of the whole process
      correlationId: command.correlationId
        ? command.correlationId
        : `${command.data.room.id}_${command.data.date}`,
    });
  }
  @Put("/mutation/checkin")
  @HttpCode(201)
  async checkin(@Body() command: CheckinCommand) {
    return this.checkinHandler.handle({
      ...command,
      source: this.constructor.name,
      // Client can control correlation ID or generated here
      // Source of the whole process
      correlationId: command.correlationId
        ? command.correlationId
        : `${command.data.room.id}_${command.data.date}`,
    });
  }
}
