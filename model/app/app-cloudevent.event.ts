import { CloudEventV1 } from "cloudevents";
import { randomUUID } from "crypto";

export abstract class AppCloudEvent implements CloudEventV1<any> {
  [key: string]: unknown;
  readonly specversion: string = "1.0";
  readonly type: string = this.constructor.name;
  readonly source: string;
  readonly id: string;
  readonly time: string;
  readonly data: any;
  readonly correlationId: string;
  constructor(data: any, source: string, correlationId?: string, id?: string) {
    this.source = source;
    this.id = id ? id : randomUUID();
    this.correlationId = correlationId ? correlationId : randomUUID();
    this.time = new Date().toISOString();
    this.data = data;
  }
}
