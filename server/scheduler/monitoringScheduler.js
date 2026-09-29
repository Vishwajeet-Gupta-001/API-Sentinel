import Monitor from "../models/Monitor.js";
import monitoringQueue from "../queues/monitoringQueue.js";

async function reconcileMonitoringSchedules() {
  const monitors = await Monitor.find();

  console.log("Total monitors:", monitors.length);

  const existingMonitorIds = new Set(
    monitors.map((monitor) => monitor._id.toString()),
  );

  for (const monitor of monitors) {
    const schedulerId = `monitor:${monitor._id}`;

    if (monitor.enabled) {
      console.log(
        `Scheduling monitor: ${monitor.name} | Interval: ${monitor.interval}s`,
      );

      await monitoringQueue.upsertJobScheduler(
        schedulerId,
        {
          every: monitor.interval * 1000,
        },
        {
          name: "monitor-check",
          data: {
            monitorId: monitor._id.toString(),
          },
        },
      );

      console.log(`Scheduler synchronized for monitor: ${monitor.name}`);
    } else {
      const removed = await monitoringQueue.removeJobScheduler(schedulerId);

      console.log(
        `Monitor disabled: ${monitor.name} | Scheduler removed: ${removed}`,
      );
    }
  }

  const schedulers = await monitoringQueue.getJobSchedulers();

  for (const scheduler of schedulers) {
    if (!scheduler.key.startsWith("monitor:")) {
      continue;
    }

    const monitorId = scheduler.key.replace("monitor:", "");

    if (!existingMonitorIds.has(monitorId)) {
      const removed = await monitoringQueue.removeJobScheduler(scheduler.key);

      console.log(
        `Orphaned scheduler removed: ${scheduler.key} | Removed: ${removed}`,
      );
    }
  }

  console.log("Monitoring schedules reconciled");
}

export async function startMonitoringScheduler() {
  await reconcileMonitoringSchedules();

  setInterval(async () => {
    try {
      await reconcileMonitoringSchedules();
    } catch (error) {
      console.error("Scheduler reconciliation failed:", error);
    }
  }, 30_000);
}
