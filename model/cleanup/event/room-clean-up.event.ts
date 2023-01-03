import { RoomEntity } from "../../admin/room.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

type RoomCleanUpData = {
  date: string;
  room: Pick<RoomEntity, "id">;
};
export abstract class RoomCleanUpEvent extends AppCloudEvent {
  static specversion: string = "1.0";
  static type: string = "RoomCleanEvent";
  constructor(
    data: RoomCleanUpData,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
