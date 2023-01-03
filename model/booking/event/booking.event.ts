import { BookingEntity } from "../../booking/entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";

export abstract class BookingEvent extends AppCloudEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "BookingEvent";
  constructor(
    data: Pick<BookingEntity, "room" | "date">,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
