import { useEffect, useState } from "react";
import MonitorCard from "../MonitorCard";

function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchMonitors() {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/v1/monitors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setMonitors(data.monitors);
    }

    async function fetchSummary() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/v1/dashboard/summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setSummary(data.summary);
    }

    fetchMonitors();
    fetchSummary();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the API Sentinel dashboard.</p>

      {summary && (
        <div className="dashboard-summary">
          <h2>Dashboard Summary</h2>

          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Monitors</h3>
              <p>{summary.totalMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Healthy Monitors</h3>
              <p>{summary.healthyMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Failing Monitors</h3>
              <p>{summary.failingMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Paused Monitors</h3>
              <p>{summary.pausedMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Active Incidents</h3>
              <p>{summary.activeIncidents}</p>
            </div>
          </div>
        </div>
      )}

      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor._id}
          monitorId={monitor._id}
          name={monitor.name}
          url={monitor.url}
          status={monitor.status}
        />
      ))}
    </div>
  );
}

export default Dashboard;
