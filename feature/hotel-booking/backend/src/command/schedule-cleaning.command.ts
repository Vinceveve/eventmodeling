import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { RoomCleaningScheduledEvent } from "../../../../../model/cleanup/event/room-cleaning-scheduled.event";
import { HotelEntity } from "../../../../../model/admin/hotel.entity";
import { RoomEntity } from "../../../../../model/admin/room.entity";
import { CleanupStream } from "../../../../../model/cleanup/cleanup.stream";

export interface ScheduleCleaningCommand {
  source: string;
  correlationId: string;
  data: {
    hotel: Pick<HotelEntity, "id">;
    room: Pick<RoomEntity, "id">;
    date: string;
  };
}

// TODO move to cleanup service
@Injectable()
export class ScheduleCleaningCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private stream: CleanupStream) {}

  async handle(command: ScheduleCleaningCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const roomId = command.data.room.id;
    this.logger.log(`Schedule cleaning for room ${roomId} #${correlationId}`);

    const res = await this.stream
      .emit(
        new RoomCleaningScheduledEvent(command.data, source, correlationId),
        // Must be only one cleanup scheduled per day
        { expect: { lastSubjectSequence: 0 } }
      )
      .catch((e) => {
        const error = `Can't schedule cleaning if room ${roomId} has cleaning already scheduled #${correlationId}`;
        this.logger.error(error);
        throw new ConflictException(error);
      });
    this.logger.log(`Cleaning scheduled for room ${roomId} #${correlationId}`);
    return res;
  }
}
