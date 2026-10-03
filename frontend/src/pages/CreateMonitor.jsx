import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateMonitor.css";

function CreateMonitor() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [interval, setInterval] = useState(60);
  const [timeout, setTimeout] = useState(5);
  const [failureThreshold, setFailureThreshold] = useState(3);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/v1/monitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          url,
          method,
          expectedStatus,
          interval,
          timeout,
          failureThreshold,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to create monitor");
        return;
      }

      setSuccessMessage(data.message);
      console.log("Response:", data);

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Unable to connect to the server");
    }
  }

  
  return (
    <div className="create-monitor-page">
      <div className="create-monitor-card">
        <h1>Create Monitor</h1>

        <p className="create-monitor-description">
          Configure a new monitor to track your API's availability and response.
        </p>

        {successMessage && (
          <p
            className="create-monitor-message create-monitor-success"
            role="status"
          >
            {successMessage}
          </p>
        )}

        {errorMessage && (
          <p
            className="create-monitor-message create-monitor-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <form className="create-monitor-form" onSubmit={handleSubmit}>
          <div className="create-monitor-field">
            <label htmlFor="name">Monitor Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. PayPal API"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="create-monitor-field">
            <label htmlFor="url">Target URL</label>
            <input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
          </div>

          <div className="create-monitor-field">
            <label htmlFor="method">HTTP Method</label>
            <select
              id="method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="create-monitor-field">
            <label htmlFor="expectedStatus">Expected Status</label>
            <input
              id="expectedStatus"
              type="number"
              value={expectedStatus}
              onChange={(event) =>
                setExpectedStatus(Number(event.target.value))
              }
              required
            />
          </div>

          <div className="create-monitor-field">
            <label htmlFor="interval">Check Interval (seconds)</label>
            <input
              id="interval"
              type="number"
              value={interval}
              onChange={(event) => setInterval(Number(event.target.value))}
              required
            />
            <p className="create-monitor-help">
              How often the monitor checks the target URL.
            </p>
          </div>

          <div className="create-monitor-field">
            <label htmlFor="timeout">Timeout (seconds)</label>
            <input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(event) => setTimeout(Number(event.target.value))}
              required
            />
            <p className="create-monitor-help">
              How long to wait for a response before timing out.
            </p>
          </div>

          <div className="create-monitor-field">
            <label htmlFor="failureThreshold">Failure Threshold</label>
            <input
              id="failureThreshold"
              type="number"
              value={failureThreshold}
              onChange={(event) =>
                setFailureThreshold(Number(event.target.value))
              }
              required
            />
            <p className="create-monitor-help">
              Consecutive failures required before an incident is created.
            </p>
          </div>

          <div className="create-monitor-actions">
            <button className="create-monitor-submit" type="submit">
              Create Monitor
            </button>

            <button
              className="create-monitor-cancel"
              type="button"
              onClick={() => navigate("/dashboard/monitors")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default CreateMonitor;
