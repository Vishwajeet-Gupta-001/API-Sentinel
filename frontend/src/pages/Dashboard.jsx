import { useEffect, useState } from "react";
import MonitorCard from "../MonitorCard";

function Dashboard() {
  const [monitors, setMonitors] = useState([]);

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

    fetchMonitors();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the API Sentinel dashboard.</p>

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
