import { connect, Empty } from "nats";

const main = async () => {
  const nc = await connect({
    servers: "127.0.0.1:4222",
  });
  const jsm = await nc.jetstreamManager();
  const js = nc.jetstream();

  const stream = "mystream";
  console.log(`Create stream ${stream}`);
  await jsm.streams.add({ name: stream, subjects: [`${stream}.*`] });

  console.log(`Publish on ${stream}.a`);
  await js.publish(`${stream}.a`, Empty);

  console.log(`Publish on ${stream}.b`);
  await js.publish(`${stream}.b`, Empty);

  // It should be ok but bug saying I'm in position 3
  // meaning it counts mystream.b subject on the sequence
  // meaning same behavior between lastSubjectSequence and lastSequence
  console.log(
    `Publish on ${stream}.a expecting its in 2nd position on the subject`
  );
  await js.publish(`${stream}.a`, Empty, {
    expect: { lastSubjectSequence: 0 },
  });
  await js.publish(`${stream}.a`, Empty, {
    expect: { lastSubjectSequence: 1 },
  });
  await jsm.streams.delete(stream);
  process.exit();
};
main();
