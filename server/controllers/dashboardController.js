import Monitor from "../models/Monitor.js";
import Incident from "../models/Incident.js";
import CheckResult from "../models/CheckResult.js";

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const [
      totalMonitors,
      healthyMonitors,
      failingMonitors,
      pausedMonitors,
      activeIncidents,
    ] = await Promise.all([
      Monitor.countDocuments({
        userId,
      }),

      Monitor.countDocuments({
        userId,
        status: "UP",
      }),

      Monitor.countDocuments({
        userId,
        status: "DOWN",
      }),

      Monitor.countDocuments({
        userId,
        status: "PAUSED",
      }),

      Incident.countDocuments({
        userId,
        status: {
          $in: ["OPEN", "ACKNOWLEDGED"],
        },
      }),
    ]);

    return res.status(200).json({
      summary: {
        totalMonitors,
        healthyMonitors,
        failingMonitors,
        pausedMonitors,
        activeIncidents,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Define the analytics window: last 24 hours.
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find only monitors belonging to the authenticated user.
    const monitors = await Monitor.find({ userId }).select("_id");
    const monitorIds = monitors.map((monitor) => monitor._id);

    // Retrieve check results recorded in the last 24 hours.
    const checks = await CheckResult.find({
      monitorId: { $in: monitorIds },
      checkedAt: { $gte: since },
    })
      .select("status responseTime checkedAt")
      .sort({ checkedAt: 1 });

    const totalChecks = checks.length;
    const successfulChecks = checks.filter(
      (check) => check.status === "SUCCESS",
    ).length;
    const failedChecks = checks.filter(
      (check) => check.status === "FAILURE",
    ).length;

    const uptimePercentage =
      totalChecks === 0 ? null : (successfulChecks / totalChecks) * 100;

    // Average only recorded response times.
    const responseTimes = checks
      .map((check) => check.responseTime)
      .filter((time) => typeof time === "number" && Number.isFinite(time));

    const averageResponseTime =
      responseTimes.length === 0
        ? null
        : responseTimes.reduce((sum, time) => sum + time, 0) /
          responseTimes.length;

    // Keep the chart data in chronological order.
    const recentResponseTimes = checks
      .filter(
        (check) =>
          typeof check.responseTime === "number" &&
          Number.isFinite(check.responseTime),
      )
      .map((check) => ({
        checkedAt: check.checkedAt,
        responseTime: check.responseTime,
      }));

    // Find incidents that started during the same 24-hour window.
    const incidents = await Incident.find({
      userId,
      startedAt: { $gte: since },
    }).select("status startedAt resolvedAt");

    const incidentCount = incidents.length;
    const openIncidents = incidents.filter(
      (incident) => incident.status === "OPEN",
    ).length;
    const acknowledgedIncidents = incidents.filter(
      (incident) => incident.status === "ACKNOWLEDGED",
    ).length;
    const resolvedIncidents = incidents.filter(
      (incident) => incident.status === "RESOLVED",
    ).length;

    const resolvedDurations = incidents
      .filter(
        (incident) => incident.status === "RESOLVED" && incident.resolvedAt,
      )
      .map(
        (incident) =>
          incident.resolvedAt.getTime() - incident.startedAt.getTime(),
      )
      .filter((duration) => duration >= 0);

    const averageIncidentDuration =
      resolvedDurations.length === 0
        ? null
        : resolvedDurations.reduce((sum, duration) => sum + duration, 0) /
          resolvedDurations.length;

    return res.status(200).json({
      period: "last_24_hours",
      uptimePercentage,
      averageResponseTime,
      totalChecks,
      successfulChecks,
      failedChecks,
      recentResponseTimes,
      incidents: {
        total: incidentCount,
        open: openIncidents,
        acknowledged: acknowledgedIncidents,
        resolved: resolvedIncidents,
        averageResolvedDurationMs: averageIncidentDuration,
      },
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);

    return res.status(500).json({
      message: "Server error while fetching dashboard analytics",
    });
  }
};

export { getDashboardSummary, getDashboardAnalytics };
