import { NestFactory } from "@nestjs/core";
import { CustomStrategy } from "@nestjs/microservices";
import { NatsJetStreamServer } from "nats-jetstream-transport";
import { HotelBookingModule } from "./src/hotel-booking.module";
import os = require("os");
import { bookingStream } from "../../../model/booking/booking.stream";
import { cleanupStream } from "../../../model/cleanup/cleanup.stream";

const bootstrap = async () => {
  const options: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: "127.0.0.1:4222",
        // Name the client for connection hostname to avoid overlap
        name: `hotel-booking.${os.hostname()}`,
      },
      // Stream will be created if not exist
      // To work we need all this stream to be available
      assertStreams: [bookingStream, cleanupStream],
    }),
  };

  // hybrid microservice and web application
  const app = await NestFactory.create(HotelBookingModule);
  const microService = app.connectMicroservice(options);
  microService.listen();
  app.listen(3000);
  return app;
};
bootstrap();
