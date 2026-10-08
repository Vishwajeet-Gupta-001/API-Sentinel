import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./IncidentDetails.css";
import { API_URL } from "../config";

function IncidentDetails() {
  const { incidentId } = useParams();

  const [incident, setIncident] = useState(null);

  useEffect(() => {
    async function fetchIncident() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/v1/incidents/${incidentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Incident details response:", data);

      setIncident(data.incident);
    }

    fetchIncident();
  }, [incidentId]);

  async function handleAcknowledge() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/incidents/${incidentId}/acknowledge`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("Acknowledge incident response:", data);

    if (response.ok) {
      setIncident(data.incident);
    }
  }

  async function handleResolve() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/v1/incidents/${incidentId}/resolve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("Resolve incident response:", data);

    if (response.ok) {
      setIncident(data.incident);
    }
  }

  
  return (
    <div className="incident-details-page">
      <div className="incident-details-header">
        <h1 className="incident-details-title">Incident Details</h1>
        <p className="incident-details-subtitle">
          Review incident information and manage its status.
        </p>
      </div>

      {incident && (
        <>
          <div className="incident-details-card">
            <div className="incident-detail-row">
              <strong>Status</strong>
              <span
                className={`incident-status ${incident.status.toLowerCase()}`}
              >
                {incident.status}
              </span>
            </div>

            <div className="incident-detail-row">
              <strong>Started At</strong>
              <span>{new Date(incident.startedAt).toLocaleString()}</span>
            </div>

            <div className="incident-detail-row">
              <strong>Failure Count</strong>
              <span>{incident.failureCount}</span>
            </div>

            <div className="incident-detail-row">
              <strong>Last Error</strong>
              <span>{incident.lastError || "-"}</span>
            </div>

            <div className="incident-detail-row">
              <strong>Acknowledged At</strong>
              <span>
                {incident.acknowledgedAt
                  ? new Date(incident.acknowledgedAt).toLocaleString()
                  : "-"}
              </span>
            </div>

            <div className="incident-detail-row">
              <strong>Resolved At</strong>
              <span>
                {incident.resolvedAt
                  ? new Date(incident.resolvedAt).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>

          <div className="incident-details-actions">
            {incident.status === "OPEN" && (
              <button
                className="incident-action-button acknowledge-button"
                onClick={handleAcknowledge}
              >
                Acknowledge Incident
              </button>
            )}

            {incident.status === "ACKNOWLEDGED" && (
              <button
                className="incident-action-button resolve-button"
                onClick={handleResolve}
              >
                Resolve Incident
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default IncidentDetails;
