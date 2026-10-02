import { useEffect, useState } from "react";
import MonitorCard from "../MonitorCard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);

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

    async function fetchAnalytics() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/v1/dashboard/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setAnalytics(data);
    }

    fetchMonitors();
    fetchSummary();
    fetchAnalytics();
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

      {analytics && (
        <div className="analytics-section">
          <h2>Analytics (Last 24 Hours)</h2>

          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>Uptime</h3>
              <p>
                {analytics.uptimePercentage === null
                  ? "N/A"
                  : `${analytics.uptimePercentage.toFixed(2)}%`}
              </p>
            </div>

            <div className="analytics-card">
              <h3>Average Response Time</h3>
              <p>
                {analytics.averageResponseTime === null
                  ? "N/A"
                  : `${Math.round(analytics.averageResponseTime)} ms`}
              </p>
            </div>

            <div className="analytics-card">
              <h3>Successful Checks</h3>
              <p>{analytics.successfulChecks}</p>
            </div>

            <div className="analytics-card">
              <h3>Failed Checks</h3>
              <p>{analytics.failedChecks}</p>
            </div>
          </div>

          <div className="analytics-chart">
            <h3>Response Time History</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.recentResponseTimes}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="checkedAt"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="responseTime"
                  name="Response Time"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-chart">
            <h3>Check Results (Last 24 Hours)</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Checks",
                    Successful: analytics.successfulChecks,
                    Failed: analytics.failedChecks,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Successful" fill="#16a34a" />
                <Bar dataKey="Failed" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
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
