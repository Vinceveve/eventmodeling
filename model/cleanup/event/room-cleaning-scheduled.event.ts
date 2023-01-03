import { RoomCleanUpEvent } from "./room-clean-up.event";
export class RoomCleaningScheduledEvent extends RoomCleanUpEvent {
  static readonly specversion: string = "1.0";
  static readonly type: string = "RoomCleaningScheduledEvent";
}
