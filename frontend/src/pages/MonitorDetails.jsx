import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function MonitorDetails() {
  const { monitorId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("check:created", (check) => {
      if (check.monitorId !== monitorId) {
        return;
      }

      setChecks((currentChecks) => [check, ...currentChecks]);
    });

    return () => {
      socket.disconnect();
    };
  }, [monitorId]);

  const [monitor, setMonitor] = useState(null);
  const [checks, setChecks] = useState([]);

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

  useEffect(() => {
    async function fetchChecks() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/v1/monitors/${monitorId}/checks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("Check history response:", data);

      setChecks(data.checks);
    }

    fetchChecks();
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

          <h2>Check History</h2>

          {checks.length === 0 ? (
            <p>No check history available.</p>
          ) : (
            <table className="check-history-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>HTTP Status</th>
                  <th>Response Time</th>
                  <th>Checked At</th>
                  <th>Timed Out</th>
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {checks.map((check) => (
                  <tr key={check._id}>
                    <td
                      className={`check-status ${check.status.toLowerCase()}`}
                    >
                      {check.status}
                    </td>
                    <td>{check.httpStatus}</td>
                    <td>{check.responseTime} ms</td>
                    <td>{new Date(check.checkedAt).toLocaleString()}</td>
                    <td>{check.timedOut ? "Yes" : "No"}</td>
                    <td>{check.error || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default MonitorDetails;
