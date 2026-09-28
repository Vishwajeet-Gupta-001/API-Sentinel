import { Link } from "react-router-dom";

function MonitorCard({ monitorId, name, url, status }) {
  return (
    <div>
      <h2>
        <Link to={`/dashboard/monitors/${monitorId}`}>{name}</Link>
      </h2>
      <p>URL: {url}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default MonitorCard;
