import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function IncidentDetails() {
  const { incidentId } = useParams();

  const [incident, setIncident] = useState(null);

  useEffect(() => {
    async function fetchIncident() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/incidents/${incidentId}`,
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
      `http://localhost:5000/api/v1/incidents/${incidentId}/acknowledge`,
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
      `http://localhost:5000/api/v1/incidents/${incidentId}/resolve`,
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
    <div>
      <h1>Incident Details</h1>

      {incident && (
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
      )}

      {incident && incident.status === "OPEN" && (
        <div>
          <button
            className="incident-action-button acknowledge-button"
            onClick={handleAcknowledge}
          >
            Acknowledge Incident
          </button>
        </div>
      )}

      {incident && incident.status === "ACKNOWLEDGED" && (
        <button
          className="incident-action-button resolve-button"
          onClick={handleResolve}
        >
          Resolve Incident
        </button>
      )}
    </div>
  );
}

export default IncidentDetails;
