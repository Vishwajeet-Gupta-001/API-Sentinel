import { useEffect, useState } from "react";
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
import "./Dashboard.css";
import { API_URL } from "../config";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/v1/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setSummary(data.summary);
    }

    async function fetchAnalytics() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/v1/dashboard/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setAnalytics(data);
    }

    fetchSummary();
    fetchAnalytics();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>This is the API Sentinel dashboard.</p>
      </div>

      {summary && (
        <div className="dashboard-summary">
          <h2>Dashboard Summary</h2>

          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Monitors</h3>
              <p className="summary-value total">{summary.totalMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Healthy Monitors</h3>
              <p className="summary-value healthy">{summary.healthyMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Failing Monitors</h3>
              <p className="summary-value failing">{summary.failingMonitors}</p>
            </div>

            <div className="summary-card">
              <h3>Active Incidents</h3>
              <p className="summary-value incidents">
                {summary.activeIncidents}
              </p>
            </div>
          </div>
        </div>
      )}

      {analytics && (
        <div className="analytics-section">
          <div className="analytics-header">
            <h2>Monitor Analytics</h2>
            <p>Performance and reliability insights for your APIs</p>
          </div>

          <div className="analytics-overview">
            <div className="analytics-heading">
              <h3>API Performance</h3>
              <span>Last 24 hours</span>
            </div>

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
            </div>

            <div className="analytics-charts">
              {analytics.recentResponseTimes?.length > 0 ? (
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
              ) : (
                <div className="chart-empty-state">
                  <p>No check data available yet</p>
                  <span>
                    Response time history will appear after your API is checked.
                  </span>
                </div>
              )}

              {analytics.successfulChecks > 0 || analytics.failedChecks > 0 ? (
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
              ) : (
                <div className="chart-empty-state">
                  <p>No check data available yet</p>
                  <span>
                    Check results will appear after your API is checked.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
