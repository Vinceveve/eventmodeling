import { BookingEntity } from "../../booking/entity/booking.entity";
import { BookingEvent } from "./booking.event";

export class GuestCheckedInEvent extends BookingEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "GuestCheckedInEvent";
  constructor(
    data: Pick<BookingEntity, "room" | "date" | "availability">,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
