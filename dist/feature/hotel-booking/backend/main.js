"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const nats_jetstream_transport_1 = require("nats-jetstream-transport");
const hotel_booking_module_1 = require("./src/hotel-booking.module");
const os = require("os");
const booking_stream_1 = require("../../../model/booking/booking.stream");
const cleanup_stream_1 = require("../../../model/cleanup/cleanup.stream");
const bootstrap = async () => {
    const options = {
        strategy: new nats_jetstream_transport_1.NatsJetStreamServer({
            connectionOptions: {
                servers: "127.0.0.1:4222",
                name: `hotel-booking.${os.hostname()}`,
            },
            assertStreams: [booking_stream_1.bookingStream, cleanup_stream_1.cleanupStream],
        }),
    };
    const app = await core_1.NestFactory.create(hotel_booking_module_1.HotelBookingModule);
    const microService = app.connectMicroservice(options);
    microService.listen();
    app.listen(3000);
    return app;
};
bootstrap();
//# sourceMappingURL=main.js.map