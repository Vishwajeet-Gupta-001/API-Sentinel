import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Incidents() {
  const [incidents, setIncidents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchIncidents() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/v1/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Incidents response:", data);

      setIncidents(data.incidents);
    }

    fetchIncidents();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("incident:created", async (event) => {
      console.log("Real-time incident created:", event);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/incidents/${event.incidentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIncidents((currentIncidents) => {
          const alreadyExists = currentIncidents.some(
            (incident) => incident._id === data.incident._id,
          );

          if (alreadyExists) {
            return currentIncidents;
          }

          return [data.incident, ...currentIncidents];
        });
      }
    });

    socket.on("incident:acknowledged", async (event) => {
      console.log("Real-time incident acknowledged:", event);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/incidents/${event.incidentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIncidents((currentIncidents) =>
          currentIncidents.map((incident) =>
            incident._id === data.incident._id ? data.incident : incident,
          ),
        );
      }
    });

    socket.on("incident:resolved", async (event) => {
      console.log("Real-time incident resolved:", event);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/incidents/${event.incidentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setIncidents((currentIncidents) =>
          currentIncidents.map((incident) =>
            incident._id === data.incident._id ? data.incident : incident,
          ),
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Incidents</h1>

      <p>Total incidents: {incidents.length}</p>

      {incidents.length === 0 ? (
        <p>No incidents available.</p>
      ) : (
        <table className="incident-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Started At</th>
              <th>Failure Count</th>
              <th>Last Error</th>
              <th>Acknowledged At</th>
              <th>Resolved At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident._id}>
                <td
                  className={`incident-status ${incident.status.toLowerCase()}`}
                >
                  {incident.status}
                </td>

                <td>{new Date(incident.startedAt).toLocaleString()}</td>

                <td>{incident.failureCount}</td>

                <td>{incident.lastError || "-"}</td>

                <td>
                  {incident.acknowledgedAt
                    ? new Date(incident.acknowledgedAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  {incident.resolvedAt
                    ? new Date(incident.resolvedAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <button
                    className="incident-view-button"
                    onClick={() => navigate(`/incidents/${incident._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Incidents;
