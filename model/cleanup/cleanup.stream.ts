import { StreamConfig } from "nats";

export const cleanupSubject = (
  roomId: number,
  day: string,
  correlationId: string
): string => {
  return `cleanup.${roomId}.${day}.${correlationId}`;
};

export const cleanupStream = {
  name: "room-cleanup",
  description: "Cleaning domain with all its events",
  subjects: ["cleanup.>"],
} as Partial<StreamConfig>;
