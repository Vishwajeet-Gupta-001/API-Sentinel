import Redis from "ioredis";

const publisher = new Redis(process.env.REDIS_URL);

export default publisher;
