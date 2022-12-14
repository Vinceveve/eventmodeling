import { RoomEntity } from "../../admin/room.entity";

export enum Availabilities {
  "available",
  "cleaning",
  "booked",
  "occupied",
}

export class BookingEntity {
  room: Pick<RoomEntity, "id">;
  client: Pick<RoomEntity, "id">;
  date: Date;
  availability?: Availabilities;
  updatedAt?: string;
  updatedBy?: string;
}
