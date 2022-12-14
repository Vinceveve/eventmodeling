import { RoomEntity } from "../../admin/room.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";
type RoomCleaningScheduledData = {
  room: Pick<RoomEntity, "id">;
  date: Date;
};
export class RoomCleaningScheduledEvent extends AppCloudEvent {
  readonly specversion: string = "1.0";
  readonly type: string = this.constructor.name;
  constructor(
    data: RoomCleaningScheduledData,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
