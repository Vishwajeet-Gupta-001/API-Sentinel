import { Link } from "react-router-dom";
import "./MonitorCard.css";

function MonitorCard({ monitorId, name, url, status }) {
  const statusClass = status.toLowerCase();

  return (
    <div className="monitor-card">
      <div className="monitor-card-icon">
        <span>API</span>
      </div>

      <div className="monitor-card-info">
        <Link
          to={`/dashboard/monitors/${monitorId}`}
          className="monitor-card-name"
        >
          {name}
        </Link>

        <p className="monitor-card-url" title={url}>
          {url}
        </p>
      </div>

      <div className="monitor-card-right">
        <span className={`monitor-status-badge ${statusClass}`}>
          <span className="monitor-status-dot" />
          {status}
        </span>

        <Link
          to={`/dashboard/monitors/${monitorId}`}
          className="monitor-card-details"
          aria-label={`View ${name} details`}
        >
          View details →
        </Link>
      </div>
    </div>
  );
}

export default MonitorCard;
