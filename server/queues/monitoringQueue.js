import { Queue } from "bullmq";
import redis from "../config/redis.js";

const monitoringQueue = new Queue("monitoring", {
  connection: redis,
});

export default monitoringQueue;
