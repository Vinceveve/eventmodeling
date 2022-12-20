import { ModuleMocker } from "jest-mock";
import { Test } from "@nestjs/testing";
import { HotelBookingModule } from "./src/hotel-booking.module";
import { GuestHttpController } from "./src/adapter/guest.http.controller";
import { ManagerHttpController } from "./src/adapter/manager.http.controller";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import {
  ConflictException,
  INestApplication,
  INestMicroservice,
} from "@nestjs/common";
import { NatsJetStreamTransportConnection } from "nats-jetstream-transport/dist/nats-jetstream-transport.connection";
import { BotNatsController } from "./src/adapter/bot.nats.controller";
import {
  NatsJetStreamContext,
  NatsJetStreamManager,
  NatsJetStreamServer,
} from "nats-jetstream-transport";
import { RoomBookedEvent } from "../../../model/booking/event/room-booked.event";
import { JsMsg } from "nats";
import { BookingStream } from "../../../model/booking/booking.stream";
import { CleanupStream } from "../../../model/cleanup/cleanup.stream";

const moduleMocker = new ModuleMocker(global);

describe("Room booking feature", () => {
  const room = { id: 1 };
  const date = "2022-12-12";
  const notBookedDate = "2022-12-13";
  const client = { id: 1 };
  const correlationId = `${room.id}_${date}`;

  let nats: NatsJetStreamTransportConnection,
    app: INestApplication,
    microService: INestMicroservice;
  let guestController: GuestHttpController;
  let managerController: ManagerHttpController;
  let botController: BotNatsController;
  let natsContext: NatsJetStreamContext;
  let jetStreamManager: NatsJetStreamManager;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HotelBookingModule],
    }).compile();
    app = moduleRef.createNestApplication(new FastifyAdapter());
    microService = app.connectMicroservice({
      strategy: new NatsJetStreamServer({
        connectionOptions: {
          servers: "127.0.0.1:4222",
        },
        assertStreams: [new BookingStream(), new CleanupStream()],
      }),
    });
    await microService.init();
    await app.init();
    console.log(microService);

    nats = moduleRef.get<NatsJetStreamTransportConnection>(
      NatsJetStreamTransportConnection
    );
    guestController = moduleRef.get<GuestHttpController>(GuestHttpController);
    managerController = moduleRef.get<ManagerHttpController>(
      ManagerHttpController
    );
    natsContext = jest.createMockFromModule("nats-jetstream-transport");
    jetStreamManager =
      moduleRef.get<NatsJetStreamManager>(NatsJetStreamManager);
  });
  afterAll(async () => {
    await Promise.all([app.close(), microService.close()]);
  });
  describe("User book a room for a given date", () => {
    it("can be booked only once for room and date", async () => {
      await guestController.bookRoom({
        correlationId,
        data: { room, date, client },
      });

      await guestController
        .bookRoom({ data: { room, date, client } })
        .then(() => {
          throw new Error("Room can't be booked twice for same day");
        })
        .catch((e: ConflictException) => {
          expect(e.getStatus()).toBe(409);
        });
    });
  });

  describe("Based on schedule, manager ask for room cleaning", () => {
    it("cleanup is done only if room is booked for this date", async () => {
      await managerController
        .cleanup({
          correlationId,
          data: { room, date: notBookedDate },
        })
        .then(() => {
          throw new Error("Room can't be cleaned up if it's not booked");
        })
        .catch((e: ConflictException) => {
          expect(e.getStatus()).toBe(409);
        });
    });
    it("cleanup can be done once", async () => {
      await managerController.cleanup({
        correlationId,
        data: { room, date },
      });

      await managerController
        .cleanup({ correlationId, data: { room, date } })
        .then(() => {
          throw new Error("Room can't be cleanedup twice for same day");
        })
        .catch((e: ConflictException) => {
          console.log(e);
          expect(e.getStatus()).toBe(409);
        });
    });
  });
  // describe("User checkin to take his room", () => {
  //   it("Checkin is possible only if he has booked the room", () => {});
  //   it("Checkin is possible only if room is clean", () => {});
  //   it("He can checkin only once", () => {});
  // });
});
