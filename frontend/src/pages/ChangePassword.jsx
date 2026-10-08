import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import { API_URL } from "../config";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setMessage(data.message || "Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    }
  }

  
  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h1>Change Password</h1>

        <p className="change-password-description">
          Update your password to keep your account secure.
        </p>

        {error && (
          <p
            className="change-password-message change-password-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            className="change-password-message change-password-success"
            role="status"
          >
            {message}
          </p>
        )}

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="change-password-field">
            <label htmlFor="currentPassword">Current Password</label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className="change-password-field">
            <label htmlFor="newPassword">New Password</label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div className="change-password-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <div className="change-password-actions">
            <button className="change-password-submit" type="submit">
              Change Password
            </button>

            <button
              className="change-password-cancel"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
