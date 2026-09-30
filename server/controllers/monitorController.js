import Monitor from "../models/Monitor.js";
import CheckResult from "../models/CheckResult.js";

const createMonitor = async (req, res) => {
  try {
    const {
      name,
      url,
      method,
      expectedStatus,
      interval,
      timeout,
      failureThreshold,
    } = req.body;

    const monitor = await Monitor.create({
      userId: req.userId,
      name,
      url,
      method,
      expectedStatus,
      interval,
      timeout,
      failureThreshold,
    });

    res.status(201).json({
      message: "Monitor created successfully",
      monitor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.find({
      userId: req.userId,
    });

    res.status(200).json({
      monitors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      _id: req.params.monitorId,
      userId: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      monitor,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.monitorId,
        userId: req.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      message: "Monitor updated successfully",
      monitor,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndDelete({
      _id: req.params.monitorId,
      userId: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      message: "Monitor deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const enableMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.monitorId,
        userId: req.userId,
      },
      {
        enabled: true,
      },
      {
        new: true,
      },
    );

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      message: "Monitor enabled successfully",
      monitor,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const disableMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.params.monitorId,
        userId: req.userId,
      },
      {
        enabled: false,
      },
      {
        new: true,
      },
    );

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      message: "Monitor disabled successfully",
      monitor,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMonitorStatus = async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      _id: req.params.monitorId,
      userId: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    res.status(200).json({
      status: monitor.status,
      enabled: monitor.enabled,
      consecutiveFailures: monitor.consecutiveFailures,
      lastCheckedAt: monitor.lastCheckedAt,
      lastSuccessfulAt: monitor.lastSuccessfulAt,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCheckHistory = async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      _id: req.params.monitorId,
      userId: req.userId,
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    const checks = await CheckResult.find({
      monitorId: req.params.monitorId,
    }).sort({ checkedAt: -1 });

    res.status(200).json({
      checks,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { createMonitor, getMonitors, getMonitor, updateMonitor, deleteMonitor, enableMonitor, disableMonitor, getMonitorStatus, getCheckHistory};
