import { StreamConfig } from "nats";
export const adminSubject = (hotelId: number, roomId: number): string => {
  return `hotel.${hotelId}.admin.room.${roomId}`;
};
export const adminStream = {
  name: "hotel-administration",
  description: "Agents and manager domain",
  subjects: ["hotel.*.admin.room.>"],
} as Partial<StreamConfig>;
