import { BookingEntity } from "../../booking/entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

export class GuestCheckedInEvent extends AppCloudEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "GuestCheckedInEvent";
  constructor(
    data: Partial<BookingEntity>,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
