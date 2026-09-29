import "dotenv/config";
import { Worker } from "bullmq";
import Redis from "ioredis";
import connectDB from "../config/db.js";
import Monitor from "../models/Monitor.js";
import CheckResult from "../models/CheckResult.js";
import {
  createIncidentIfNeeded,
  resolveIncidentIfNeeded,
} from "../services/incidentEngine.js";
import publisher from "../pubsub/pubsubPublisher.js";

const workerConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

await connectDB();

const monitoringWorker = new Worker(
  "monitoring",
  async (job) => {
    console.log("Processing job:", job.id);
    console.log("Job name:", job.name);
    console.log("Job data:", job.data);

    const { monitorId } = job.data;

    const monitor = await Monitor.findById(monitorId);

    if (!monitor) {
      console.log(`Monitor not found: ${monitorId}`);
      return {
        processed: false,
        reason: "MONITOR_NOT_FOUND",
      };
    }

    console.log("Monitor name:", monitor.name);
    console.log("Monitor URL:", monitor.url);

    const startTime = Date.now();

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, monitor.timeout * 1000);

    let error = null;
    let httpStatus = null;
    let responseTime = null;
    let timedOut = false;
    let checkSuccessful = false;
    let response;

    try {
      response = await fetch(monitor.url, {
        signal: controller.signal,
      });

    } catch (requestError) {
      if (requestError.name === "AbortError") {
        timedOut = true;
        error = "Request timed out";
        console.log("Request timed out");
      } else {
        error = requestError.message;
        console.log("HTTP request error:", requestError.message);
      }
    }
    clearTimeout(timeoutId);


   if (response) {
     const endTime = Date.now();

     responseTime = endTime - startTime;

     console.log("Response time:", responseTime, "ms");

     httpStatus = response.status;

     console.log("HTTP status:", response.status);

     checkSuccessful = response.status === monitor.expectedStatus;

     console.log("Check successful:", checkSuccessful);
   }

    await CheckResult.create({
      monitorId,
      status: checkSuccessful ? "SUCCESS" : "FAILURE",
      httpStatus,
      responseTime,
      error,
      timedOut,
      checkedAt: new Date(),
    });

    await Monitor.findByIdAndUpdate(monitorId, {
      lastCheckedAt: new Date(),
    });

    const newStatus = checkSuccessful ? "UP" : "DOWN";

    if (monitor.status !== "PAUSED" && monitor.status !== newStatus) {
      await Monitor.findByIdAndUpdate(monitorId, {
        status: newStatus,
      });

      console.log(`Monitor status changed: ${monitor.status} → ${newStatus}`);

      await publisher.publish(
        "api-sentinel-events",
        JSON.stringify({
          event: "monitor:status_changed",
          data: {
            monitorId,
            status: newStatus,
          },
        }),
      );
    }

    if (checkSuccessful) {
      await Monitor.findByIdAndUpdate(monitorId, {
        consecutiveFailures: 0,
      });
    }

    if (checkSuccessful) {
      await resolveIncidentIfNeeded({
        monitor,
      });
    }

    if (!checkSuccessful) {
      const updatedMonitor = await Monitor.findByIdAndUpdate(
        monitorId,
        {
          $inc: {
            consecutiveFailures: 1,
          },
        },
        {
          returnDocument: "after",
        },
      );

      if (
        updatedMonitor.consecutiveFailures >= updatedMonitor.failureThreshold
      ) {
        console.log("Failure threshold reached");

        await createIncidentIfNeeded({
          monitor: updatedMonitor,
          lastError: error,
        });
      }
    }

    if (checkSuccessful) {
      await Monitor.findByIdAndUpdate(monitorId, {
        lastSuccessfulAt: new Date(),
      });
    }

    return {
      processed: true,
    };
  },
  {
    connection: workerConnection,
  },
);

monitoringWorker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

monitoringWorker.on("failed", (job, error) => {
  console.error("Job failed:", job?.id, error.message);
});

console.log("Monitoring worker started");
