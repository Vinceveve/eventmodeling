import { RoomEntity } from "../../admin/room.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

type RoomCleanedUpData = {
  date: Date;
  room: Pick<RoomEntity, "id">;
};
export class RoomCleanedUpEvent extends AppCloudEvent {
  static specversion: string = "1.0";
  static type: string = "RoomCleanedUpEvent";
  constructor(
    data: RoomCleanedUpData,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
