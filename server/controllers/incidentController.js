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

export { acknowledgeIncidentController };
