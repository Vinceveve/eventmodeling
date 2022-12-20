import { Injectable, Logger } from "@nestjs/common";
import { JSONCodec } from "nats";
import {
  Availabilities,
  BookingEntity,
} from "../../../../../model/booking/entity/booking.entity";
import { NatsJetStreamKeyStore } from "nats-jetstream-transport";
import { GuestCheckedInEvent } from "../../../../../model/booking/event/guest-checked-in.event";
import { RoomBookedEvent } from "../../../../../model/booking/event/room-booked.event";
import { RoomAvailableEvent } from "../../../../../model/booking/event/room-available.event";

@Injectable()
export class BookingProjection {
  private logger = new Logger(this.constructor.name);
  private codec = JSONCodec();
  constructor(private keyStore: NatsJetStreamKeyStore) {}

  async handle(
    event: RoomBookedEvent | RoomAvailableEvent | GuestCheckedInEvent
  ) {
    const isoDate = new Date(event.data.date);
    const day = isoDate.toISOString().split("T")[0];
    const booking = await this.keyStore.assertBucket("booking");
    const key = `booking.${event.data.room.id}.${day}`;

    this.logger.log(
      `Handle state for key ${key} and event ${event.type} #${event.correlationId}`
    );

    // IDEA use seq value from entry to handle race condition ?
    // IDEA use watcher to maintain state cache ?
    const state = await booking.get(key).then((entry) => {
      return entry
        ? (this.codec.decode(entry.value) as Partial<BookingEntity>)
        : ({} as Partial<BookingEntity>);
    });
    const handler = this.handlers[event.type];
    const newState = handler(event, state);

    if (!newState) {
      await booking.delete(key);
      this.logger.log(`No state return, delete key ${key}`);
    } else if (!state) {
      this.logger.log(`Key ${key} does not exists, create it`);
      await booking.create(key, this.codec.encode(newState));
    } else if (state != newState) {
      this.logger.log(
        `State is different for ${key}, update it ${state.availability}`
      );
      await booking.put(key, this.codec.encode(newState));
    }
    return newState;
  }
  private handlers: {
    [key: string]: (
      event: any,
      state: Partial<BookingEntity>
    ) => Partial<BookingEntity>;
  } = {
    RoomBookedEvent: (
      event: RoomBookedEvent,
      state: BookingEntity
    ): BookingEntity => ({
      ...state,
      ...event.data,
      updatedAt: event.time,
      updatedBy: event.type,
      availability: Availabilities.booked,
    }),
    RoomAvailableEvent: (
      event: RoomAvailableEvent,
      state: BookingEntity
    ): BookingEntity => ({
      ...state,
      updatedAt: event.time,
      updatedBy: event.type,
      availability: Availabilities.available,
    }),
    GuestCheckedInEvent: (
      event: GuestCheckedInEvent,
      state: BookingEntity
    ): BookingEntity => ({
      ...state,
      updatedAt: event.time,
      updatedBy: event.type,
      availability: Availabilities.occupied,
    }),
  };
}
