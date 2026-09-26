import Incident from "../models/Incident.js";
import publisher from "../pubsub/pubsubPublisher.js";

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

  await publisher.publish(
    "api-sentinel-events",
    JSON.stringify({
      event: "incident:created",
      data: {
        incidentId: incident._id.toString(),
        monitorId: monitor._id.toString(),
        status: incident.status,
      },
    }),
  );

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

  await publisher.publish(
    "api-sentinel-events",
    JSON.stringify({
      event: "incident:acknowledged",
      data: {
        incidentId: incident._id.toString(),
        monitorId: incident.monitorId.toString(),
        status: incident.status,
      },
    }),
  );

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

  await publisher.publish(
    "api-sentinel-events",
    JSON.stringify({
      event: "incident:resolved",
      data: {
        incidentId: activeIncident._id.toString(),
        monitorId: activeIncident.monitorId.toString(),
        status: activeIncident.status,
      },
    }),
  );

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

  await publisher.publish(
    "api-sentinel-events",
    JSON.stringify({
      event: "incident:resolved",
      data: {
        incidentId: incident._id.toString(),
        monitorId: incident.monitorId.toString(),
        status: incident.status,
      },
    }),
  );

  return incident;
};

export {
  createIncidentIfNeeded,
  acknowledgeIncident,
  resolveIncidentIfNeeded,
  resolveIncident,
};
