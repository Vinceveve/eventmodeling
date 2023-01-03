import { BookingEntity } from "../../booking/entity/booking.entity";
import { AppCloudEvent } from "../../app/app-cloudevent.event";
import { BookingEvent } from "./booking.event";

export class RoomAvailableEvent extends BookingEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "RoomAvailableEvent";
}
