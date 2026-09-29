import Monitor from "../models/Monitor.js";
import Incident from "../models/Incident.js";

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

export { getDashboardSummary };
