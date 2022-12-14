import { RoomEntity } from "./room.entity";
import { AppCloudEvent } from "../app/app-cloudevent.event";

export class RoomCreatedEvent extends AppCloudEvent {
  readonly specversion: string = "1.0";
  readonly type: string = this.constructor.name;
  constructor(
    data: RoomEntity,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
