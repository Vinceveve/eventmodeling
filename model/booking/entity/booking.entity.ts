import { RoomEntity } from "../../admin/room.entity";

export enum Availabilities {
  available = "available",
  cleaning = "cleaning",
  booked = "booked",
  occupied = "occupied",
}

export class BookingEntity {
  room: Pick<RoomEntity, "id">;
  client: Pick<RoomEntity, "id">;
  date: string;
  availability?: Availabilities;
  updatedAt?: string;
  updatedBy?: string;
}
