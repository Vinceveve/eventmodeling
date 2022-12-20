import { BookingEntity } from "../../booking/entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

export class RoomAvailableEvent extends AppCloudEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "RoomAvailableEvent";
  constructor(
    data: Pick<BookingEntity, "date" | "room">,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
