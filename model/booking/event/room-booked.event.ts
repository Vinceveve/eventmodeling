import { BookingEntity } from "../entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

export class RoomBookedEvent extends AppCloudEvent {
  readonly specversion: string = "1.0";
  readonly type: string = "RoomBookedEvent";
  constructor(
    data: BookingEntity,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
