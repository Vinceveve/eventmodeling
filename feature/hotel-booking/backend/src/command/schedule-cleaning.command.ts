import { NatsJetStreamClient } from "nats-jetstream-transport";
import { Injectable, Logger } from "@nestjs/common";
import { RoomCleaningScheduledEvent } from "../../../../../model/cleanup/event/room-cleaning-scheduled.event";
import { HotelEntity } from "../../../../../model/admin/hotel.entity";
import { RoomEntity } from "../../../../../model/admin/room.entity";
import { cleanupSubject } from "../../../../../model/cleanup/cleanup.stream";

export interface ScheduleCleaningCommand {
  source: string;
  correlationId: string;
  data: {
    hotel: Pick<HotelEntity, "id">;
    room: Pick<RoomEntity, "id">;
    date: Date;
  };
}

// TODO move to cleanup service
@Injectable()
export class ScheduleCleaningCommandHandler {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private client: NatsJetStreamClient) {}

  async handle(command: ScheduleCleaningCommand) {
    const source = this.constructor.name;
    const correlationId = command.correlationId;
    const isoDate = new Date(command.data.date);
    const day = isoDate.toISOString().split("T")[0];
    this.logger.log(
      `Schedule cleaning for room ${command.data.room.id} #${correlationId}`
    );

    const res = await this.client.publish(
      cleanupSubject(command.data.room.id, day, correlationId),
      new RoomCleaningScheduledEvent(command.data, source, correlationId),
      { msgID: `cleanup-${correlationId}` }
    );

    this.logger.log(
      `Cleaning scheduled for room ${command.data.room.id} #${correlationId}`
    );
    return res;
  }
}
