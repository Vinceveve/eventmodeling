import { StreamConfig } from "nats";
export const bookingSubject = (
  roomId: number,
  day: string,
  correlationId: string
): string => {
  return `booking.${roomId}.${day}.${correlationId}`;
};
export const bookingStream = {
  name: "room-booking",
  description: "Booking domain with all its events",
  subjects: ["booking.>"],
} as Partial<StreamConfig>;
