import { AppCloudEvent } from "../app/app-cloudevent.event";
import { JetStreamPublishOptions, StreamConfig } from "nats";

export class BookingStream implements Partial<StreamConfig> {
  name: string = "booking";
  description: string = "Booking domain with all its events";
  subjects: string[] = ["booking.>"];

  static buildSubject({
    roomId,
    day,
    event,
    eventType,
    correlationId,
  }: {
    roomId: number;
    day: string;
    event?: AppCloudEvent;
    eventType?: string;
    correlationId?: string;
  }) {
    if (!event && !eventType) {
      throw new Error(
        "To generate a subject you should provide event or eventType"
      );
    }
    let type;
    const hierarchy = ["booking", roomId, day];
    type = event ? event.type : eventType;
    // To kebab case
    type = type.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      (s: string, ofs: string) => (ofs ? "-" : "") + s.toLowerCase()
    );
    hierarchy.push(type);
    const correlation = event ? event.correlationId : correlationId;
    hierarchy.push(correlation);
    console.log(hierarchy.join("."));
    return hierarchy.join(".");
  }
}
