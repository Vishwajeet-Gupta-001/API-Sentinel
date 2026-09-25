import Incident from "../models/Incident.js";

const createIncidentIfNeeded = async ({ monitor, lastError }) => {
  const existingIncident = await Incident.findOne({
    monitorId: monitor._id,
    status: {
      $in: ["OPEN", "ACKNOWLEDGED"],
    },
  });

  if (existingIncident) {
    return existingIncident;
  }

  const incident = await Incident.create({
    monitorId: monitor._id,
    userId: monitor.userId,
    status: "OPEN",
    startedAt: new Date(),
    failureCount: monitor.consecutiveFailures,
    lastError,
  });

  return incident;
};

const acknowledgeIncident = async ({ incidentId }) => {
  const incident = await Incident.findById(incidentId);

  if (!incident) {
    return null;
  }

  if (incident.status !== "OPEN") {
    return incident;
  }

  incident.status = "ACKNOWLEDGED";
  incident.acknowledgedAt = new Date();

  await incident.save();

  return incident;
};

const resolveIncidentIfNeeded = async ({ monitor }) => {
  const activeIncident = await Incident.findOne({
    monitorId: monitor._id,
    status: {
      $in: ["OPEN", "ACKNOWLEDGED"],
    },
  });

  if (!activeIncident) {
    return null;
  }

  activeIncident.status = "RESOLVED";
  activeIncident.resolvedAt = new Date();

  await activeIncident.save();

  return activeIncident;
};

const resolveIncident = async ({ incidentId }) => {
  const incident = await Incident.findById(incidentId);

  if (!incident) {
    return null;
  }

  if (incident.status === "RESOLVED") {
    return incident;
  }

  incident.status = "RESOLVED";
  incident.resolvedAt = new Date();

  await incident.save();

  return incident;
};

export {
  createIncidentIfNeeded,
  acknowledgeIncident,
  resolveIncidentIfNeeded,
  resolveIncident,
};
