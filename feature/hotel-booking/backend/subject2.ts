import { connect, Empty, headers } from "nats";

const main = async () => {
  const nc = await connect({
    servers: "127.0.0.1:4222",
  });
  const jsm = await nc.jetstreamManager();
  const js = nc.jetstream();

  const stream = "mystream";
  console.log(`Create stream ${stream}`);
  await jsm.streams.add({ name: stream, subjects: [`${stream}.*`] });

  const h = headers();
  h.set("Nats-Expected-Last-Subject-Sequence", "0");

  console.log(`Publish on ${stream}.a`);
  await js.publish(`${stream}.a`, Empty, { headers: h });

  console.log(`Publish on ${stream}.b`);
  await js.publish(`${stream}.b`, Empty, { headers: h });

  console.log(`Publish on ${stream}.b and it should bug`);
  await js.publish(`${stream}.b`, Empty, { headers: h });

  await jsm.streams.delete(stream);
  process.exit();
};
main();
