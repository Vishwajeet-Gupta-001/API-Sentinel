import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MonitorCard from "../MonitorCard";
import "./Monitors.css";

function Monitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalMonitors = monitors.length;

  const upMonitors = monitors.filter(
    (monitor) => monitor.status === "UP",
  ).length;

  const downMonitors = monitors.filter(
    (monitor) => monitor.status === "DOWN",
  ).length;

  const pausedMonitors = monitors.filter(
    (monitor) => monitor.status === "PAUSED",
  ).length;

  useEffect(() => {
    async function fetchMonitors() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/v1/monitors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load monitors.");
        }

        setMonitors(data.monitors || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchMonitors();
  }, []);

  return (
    <div className="monitors-page">
      <div className="monitors-header">
        <div>
          <h1>Monitors</h1>
          <p>Manage and monitor your APIs in one place.</p>
        </div>

        <Link to="/create-monitor" className="create-monitor-button">
          + Create Monitor
        </Link>
      </div>

      <div className="monitor-summary">
        <div className="monitor-summary-card">
          <p>Total Monitors</p>
          <h2>{totalMonitors}</h2>
        </div>

        <div className="monitor-summary-card">
          <p>Up</p>
          <h2>{upMonitors}</h2>
        </div>

        <div className="monitor-summary-card">
          <p>Down</p>
          <h2>{downMonitors}</h2>
        </div>

        <div className="monitor-summary-card">
          <p>Paused</p>
          <h2>{pausedMonitors}</h2>
        </div>
      </div>

      <div className="monitors-list">
        {loading && <p className="monitors-message">Loading monitors...</p>}

        {!loading && error && <p className="monitors-error">{error}</p>}

        {!loading && !error && monitors.length === 0 && (
          <div className="monitors-empty-state">
            <h2>No monitors yet</h2>
            <p>Create your first monitor to start tracking an API.</p>
            <Link to="/create-monitor" className="create-monitor-button">
              Create your first monitor
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          monitors.map((monitor) => (
            <MonitorCard
              key={monitor._id}
              monitorId={monitor._id}
              name={monitor.name}
              url={monitor.url}
              status={monitor.status}
            />
          ))}
      </div>
    </div>
  );
}

export default Monitors;
