import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Create Monitor</h1>

      {successMessage && <p>{successMessage}</p>}

      {errorMessage && <p>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Monitor Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="url">Target URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>

        <div>
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

        <div>
          <label htmlFor="expectedStatus">Expected Status</label>
          <input
            id="expectedStatus"
            type="number"
            value={expectedStatus}
            onChange={(event) => setExpectedStatus(Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="interval">Check Interval (seconds)</label>
          <input
            id="interval"
            type="number"
            value={interval}
            onChange={(event) => setInterval(Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="timeout">Timeout (seconds)</label>
          <input
            id="timeout"
            type="number"
            value={timeout}
            onChange={(event) => setTimeout(Number(event.target.value))}
          />
        </div>

        <div>
          <label htmlFor="failureThreshold">Failure Threshold</label>
          <input
            id="failureThreshold"
            type="number"
            value={failureThreshold}
            onChange={(event) =>
              setFailureThreshold(Number(event.target.value))
            }
          />
        </div>

        <button type="submit">Create Monitor</button>
      </form>
    </div>
  );
}

export default CreateMonitor;
