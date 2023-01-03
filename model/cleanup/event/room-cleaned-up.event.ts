import { RoomCleanUpEvent } from "./room-clean-up.event";

export class RoomCleanedUpEvent extends RoomCleanUpEvent {
  static specversion: string = "1.0";
  static type: string = "RoomCleanedUpEvent";
}
