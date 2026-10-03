import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./MonitorDetails.css";

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
    <div className="monitor-details-page">
      <div className="monitor-details-header">
        <div>
          <h1>Monitor Details</h1>
          <p className="monitor-details-subtitle">
            View your monitor configuration, current status, and check history.
          </p>
        </div>
      </div>

      {monitor && (
        <>
          <section className="monitor-summary-card">
            <div className="monitor-summary-top">
              <h2>{monitor.name}</h2>

              <div className="monitor-status-badges">
                <span
                  className={`monitor-status-badge ${
                    monitor.enabled
                      ? monitor.status === "UP"
                        ? "monitor-status-up"
                        : "monitor-status-down"
                      : "monitor-status-paused"
                  }`}
                >
                  {monitor.enabled ? monitor.status : "PAUSED"}
                </span>
              </div>
            </div>

            <div className="monitor-config-grid">
              <div className="monitor-config-item">
                <span className="monitor-config-label">URL</span>
                <span className="monitor-config-value">{monitor.url}</span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Method</span>
                <span className="monitor-config-value">{monitor.method}</span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Expected Status</span>
                <span className="monitor-config-value">
                  {monitor.expectedStatus}
                </span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Check Interval</span>
                <span className="monitor-config-value">
                  {monitor.interval} seconds
                </span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Timeout</span>
                <span className="monitor-config-value">
                  {monitor.timeout} seconds
                </span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Failure Threshold</span>
                <span className="monitor-config-value">
                  {monitor.failureThreshold}
                </span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">Enabled</span>
                <span className="monitor-config-value">
                  {monitor.enabled ? "Yes" : "No"}
                </span>
              </div>

              <div className="monitor-config-item">
                <span className="monitor-config-label">
                  Consecutive Failures
                </span>
                <span className="monitor-config-value">
                  {monitor.consecutiveFailures}
                </span>
              </div>
            </div>

            <div className="monitor-actions">
              {monitor.enabled ? (
                <button
                  className="monitor-action-secondary"
                  onClick={handleDisable}
                >
                  Disable Monitor
                </button>
              ) : (
                <button
                  className="monitor-action-primary"
                  onClick={handleEnable}
                >
                  Enable Monitor
                </button>
              )}

              <button
                className="monitor-action-primary"
                onClick={() =>
                  navigate(`/dashboard/monitors/${monitorId}/edit`)
                }
              >
                Edit Monitor
              </button>

              <button className="monitor-action-danger" onClick={handleDelete}>
                Delete Monitor
              </button>
            </div>
          </section>

          <section className="check-history-section">
            <div className="check-history-header">
              <div>
                <h2>Check History</h2>
                <p className="check-history-description">
                  Recent health checks and response details for this monitor.
                </p>
              </div>
            </div>

            {checks.length === 0 ? (
              <div className="monitor-summary-card">
                <p>No check history available.</p>
              </div>
            ) : (
              <div className="check-history-table-wrapper">
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
                          className={`check-history-${
                            check.status.toLowerCase() === "success"
                              ? "success"
                              : "failure"
                          }`}
                        >
                          {check.status}
                        </td>
                        <td>{check.httpStatus ?? "-"}</td>
                        <td>
                          {check.responseTime != null
                            ? `${check.responseTime} ms`
                            : "-"}
                        </td>
                        <td>
                          {check.checkedAt
                            ? new Date(check.checkedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td>{check.timedOut ? "Yes" : "No"}</td>
                        <td>{check.error || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default MonitorDetails;
