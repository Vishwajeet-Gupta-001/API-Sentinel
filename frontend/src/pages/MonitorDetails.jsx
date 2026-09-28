import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MonitorDetails() {
  const { monitorId } = useParams();

  const navigate = useNavigate();

  const [monitor, setMonitor] = useState(null);

  useEffect(() => {
    async function fetchMonitor() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/monitors/${monitorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Monitor response:", data);

      setMonitor(data.monitor);
    }

    fetchMonitor();
  }, [monitorId]);

  console.log("Monitor ID:", monitorId);

  async function handleDisable() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/v1/monitors/${monitorId}/disable`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("Disable response:", data);

    if (response.ok) {
      setMonitor(data.monitor);
    }
  }

  async function handleEnable() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/v1/monitors/${monitorId}/enable`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("Enable response:", data);

    if (response.ok) {
      setMonitor(data.monitor);
    }
  }

  async function handleDelete() {

    const confirmed = window.confirm(
      "Are you sure you want to delete this monitor?",
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/v1/monitors/${monitorId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log("Delete response:", data);

    if (response.ok) {
      navigate("/dashboard");
    }
  }

  return (
    <div>
      <h1>Monitor Details</h1>

      {monitor && (
        <div>
          <h2>{monitor.name}</h2>

          <p>URL: {monitor.url}</p>

          <p>Method: {monitor.method}</p>

          <p>Expected Status: {monitor.expectedStatus}</p>

          <p>Check Interval: {monitor.interval} seconds</p>

          <p>Timeout: {monitor.timeout} seconds</p>

          <p>Failure Threshold: {monitor.failureThreshold}</p>

          <p>Enabled: {monitor.enabled ? "Yes" : "No"}</p>

          {monitor.enabled && (
            <button onClick={handleDisable}>Disable Monitor</button>
          )}

          {!monitor.enabled && (
            <button onClick={handleEnable}>Enable Monitor</button>
          )}

          <p>Status: {monitor.status}</p>

          <p>Consecutive Failures: {monitor.consecutiveFailures}</p>

          <button
            onClick={() => navigate(`/dashboard/monitors/${monitorId}/edit`)}
          >
            Edit Monitor
          </button>

          <button onClick={handleDelete}>Delete Monitor</button>
        </div>
      )}
    </div>
  );
}

export default MonitorDetails;
