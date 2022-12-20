import { AppCloudEvent } from "../app/app-cloudevent.event";
import { StreamConfig } from "nats";

export class CleanupStream implements Partial<StreamConfig> {
  readonly name: string = "cleanup";
  readonly description: string = "Cleaning domain with all its events";
  readonly subjects: string[] = ["cleanup.>"];
  static buildsubject({
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
    const hierarchy = ["cleanup", roomId, day];
    type = event ? event.type : eventType;
    // To kebab case
    type = type.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      (s, ofs) => (ofs ? "-" : "") + s.toLowerCase()
    );
    hierarchy.push(type);
    const correlation = event ? event.correlationId : correlationId;
    hierarchy.push(correlation);
    return hierarchy.join(".");
  }
}
