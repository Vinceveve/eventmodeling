import { BookingEntity } from "../entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";
import { BookingEvent } from "./booking.event";

export class RoomBookedEvent extends BookingEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "RoomBookedEvent";
  constructor(
    data: BookingEntity,
    source: string,
    correlationId?: string,
    id?: string
  ) {
    super(data, source, correlationId, id);
  }
}
