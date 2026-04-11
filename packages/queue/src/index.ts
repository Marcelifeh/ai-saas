import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";

// Use Upstash or local Redis
const redisConnection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

export const queues = {
    autopilot: new Queue("autopilot-jobs", { connection: redisConnection as any }),
    trend: new Queue("trend-collector", { connection: redisConnection as any }),
};

export { Worker, QueueEvents, redisConnection };
