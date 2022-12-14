import { Controller, Put, Body, Get, HttpCode } from "@nestjs/common";
import {
  CleanRoomCommand,
  CleanRoomCommandHandler,
} from "../command/clean-room.command";

@Controller()
export class ManagerHttpController {
  constructor(private cleanRoomHandler: CleanRoomCommandHandler) {}
  @Put("/mutation/cleanup")
  @HttpCode(201)
  async checkin(@Body() command: CleanRoomCommand) {
    return this.cleanRoomHandler.handle({
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
