import { AppCloudEvent } from "../app/app-cloudevent.event";
import { JetStreamPublishOptions, StreamConfig } from "nats";
import {
  NatsJetStreamClient,
  NatsJetStreamManager,
} from "nats-jetstream-transport";
import { Injectable } from "@nestjs/common";
import { BookingEvent } from "./event/booking.event";

@Injectable()
export class BookingStream {
  static readonly config: Partial<StreamConfig> = {
    name: "booking",
    description: "Booking domain with all its events",
    subjects: ["booking.>"],
  };

  constructor(
    private client: NatsJetStreamClient,
    private manager: NatsJetStreamManager
  ) {}
  async emit(
    event: BookingEvent,
    publishOptions?: Partial<JetStreamPublishOptions>
  ) {
    const subject = BookingStream.buildsubject({
      roomId: event.data.room.id,
      day: event.data.date,
      eventType: event.type,
      correlationId: event.correlationId,
    });
    return await this.client.publish(subject, event, publishOptions);
  }
  async subjectExists(subject: string): Promise<boolean> {
    const stream = await this.manager.streams();
    const streamInfo = await stream.info(BookingStream.config.name, {
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
  }): string {
    if (!event && !eventType) {
      throw new Error(
        "To generate a subject you should provide event or eventType"
      );
    }
    let type;
    const hierarchy = [BookingStream.config.name, roomId, day];
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
