import { AppCloudEvent } from "../app/app-cloudevent.event";
import { JetStreamPublishOptions, StreamConfig } from "nats";
import {
  NatsJetStreamClient,
  NatsJetStreamManager,
} from "nats-jetstream-transport";
import { Injectable } from "@nestjs/common";
import { RoomCleanUpEvent } from "./event/room-clean-up.event";

@Injectable()
export class CleanupStream {
  static readonly config: Partial<StreamConfig> = {
    name: "cleanup",
    description: "Cleaning domain with all its events",
    subjects: ["cleanup.>"],
  };

  constructor(
    private client: NatsJetStreamClient,
    private manager: NatsJetStreamManager
  ) {}
  emit(
    event: RoomCleanUpEvent,
    publishOptions?: Partial<JetStreamPublishOptions>
  ) {
    const subject = CleanupStream.buildsubject({
      roomId: event.data.room.id,
      day: event.data.date,
      eventType: event.type,
      correlationId: event.correlationId,
    });
    return this.client.publish(subject, event, publishOptions);
  }
  async subjectExists(subject: string) {
    const streamInfo = await (
      await this.manager.streams()
    ).info(CleanupStream.config.name, {
      subjects_filter: subject,
    });
    return streamInfo.state.subjects ? true : false;
  }

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
    const hierarchy = [CleanupStream.config.name, roomId, day];
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
