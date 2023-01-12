import { connect, NatsConnection } from "nats.ws";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [nats, setNats] = useState<NatsConnection>();

  useEffect(() => {
    (async () => {
      const nc = await connect({
        servers: ["wss://demo.nats.io:8443"],
      });
      setNats(nc);
      console.log("connected to NATS");
    })();

    return () => {
      nats?.drain();
      console.log("closed NATS connection");
    };
  }, []);

  return (
    <>
      {nats ? (
        <h1>Connected to {nats?.getServer()}</h1>
      ) : (
        <h1>Connecting to NATS... </h1>
      )}
    </>
  );
}
