import { BookingEntity } from "../../booking/entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

export class GuestCheckedInEvent extends AppCloudEvent {
  readonly specversion: string = "1.0";
  readonly type: string = "GuestCheckedInEvent";
  constructor(
    data: BookingEntity,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
