import { HotelEntity } from "./hotel.entity";

export class RoomEntity {
  id: number;
  hotel: Pick<HotelEntity, "id">;
}
