import { RoomEntity } from "../../admin/room.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

type RoomCleanedUpData = {
  date: Date;
  room: Pick<RoomEntity, "id">;
};
export class RoomCleanedUpEvent extends AppCloudEvent {
  specversion: string = "1.0";
  type: string = this.constructor.name;
  constructor(
    data: RoomCleanedUpData,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
