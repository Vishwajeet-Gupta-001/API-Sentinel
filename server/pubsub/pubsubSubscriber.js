import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL);

const initializeSubscriber = async (io) => {
  await subscriber.subscribe("api-sentinel-events");

  subscriber.on("message", (channel, message) => {
    console.log("Pub/Sub message received:", channel, message);

    const event = JSON.parse(message);

    io.emit(event.event, event.data);
  });
};

export default initializeSubscriber;
