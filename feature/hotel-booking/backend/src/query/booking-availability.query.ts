import { Injectable } from "@nestjs/common";
import { NatsJetStreamKeyStore } from "nats-jetstream-transport";
import { BookingEntity } from "../../../../../model/booking/entity/booking.entity";
import { JSONCodec, KV, KvEntry } from "nats";

@Injectable()
export class BookingAvailabilityQuery {
  private codec = JSONCodec((key, value) => {
    console.log(value);
  });
  private kv: KV;
  constructor(private keyStore: NatsJetStreamKeyStore) {}

  async handle(query: Pick<BookingEntity, "room">): Promise<BookingEntity> {
    return (await this.assertBucket())
      .get(`booking.${query.room.id}`)
      .then(
        (entry: KvEntry) => this.codec.decode(entry.value) as BookingEntity
      );
  }

  private async assertBucket(): Promise<KV> {
    if (!this.kv) {
      const kv = await this.keyStore.assertBucket(`room`, { history: 3 });
    }
    return this.kv;
  }
}
