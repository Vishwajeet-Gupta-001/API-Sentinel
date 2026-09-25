import mongoose from "mongoose";
import Incident from "../models/Incident.js";
import { acknowledgeIncident } from "../services/incidentEngine.js";

const acknowledgeIncidentController = async (req, res) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.incidentId,
      userId: req.userId,
    });

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    const acknowledgedIncident = await acknowledgeIncident({
      incidentId: incident._id,
    });

    res.status(200).json({
      message: "Incident acknowledged successfully",
      incident: acknowledgedIncident,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid incident ID",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getIncidentsController = async (req, res) => {
  try {
    const { status, monitorId, from, to } = req.query;

    const validStatuses = ["OPEN", "ACKNOWLEDGED", "RESOLVED"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid incident status",
      });
    }

    if (monitorId && !mongoose.Types.ObjectId.isValid(monitorId)) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    if (from && Number.isNaN(new Date(from).getTime())) {
      return res.status(400).json({
        message: "Invalid from date",
      });
    }

    if (to && Number.isNaN(new Date(to).getTime())) {
      return res.status(400).json({
        message: "Invalid to date",
      });
    }

    if (from && to && new Date(from) > new Date(to)) {
      return res.status(400).json({
        message: "From date cannot be after to date",
      });
    }

    const filter = {
      userId: req.userId,
    };

    const startedAtFilter = {};
    if (from) {
      startedAtFilter.$gte = new Date(from);
    }
    if (to) {
      const endDate = new Date(to);
      endDate.setDate(endDate.getDate() + 1);

      startedAtFilter.$lt = endDate;
    }

    if (status) {
      filter.status = status;
    }

    if (monitorId) {
      filter.monitorId = monitorId;
    }

    if (from || to) {
      filter.startedAt = startedAtFilter;
    }

    const incidents = await Incident.find(filter);

    return res.status(200).json({
      incidents,
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getIncidentController = async (req, res) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.incidentId,
      userId: req.userId,
    });

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      incident,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid incident ID",
      });
    }

    console.error("Error fetching incident:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  acknowledgeIncidentController,
  getIncidentsController,
  getIncidentController,
};
