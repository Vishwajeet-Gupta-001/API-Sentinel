import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="app-navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="brand-icon">A</span>
        <span>API Sentinel</span>
      </Link>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/monitors">Monitors</Link>
        <Link to="/incidents">Incidents</Link>

        {isAuthenticated && <Link to="/change-password">Change Password</Link>}
      </div>

      <div className="navbar-actions">
        <span
          className={`auth-indicator ${isAuthenticated ? "authenticated" : ""}`}
        >
          <span className="auth-dot" />
          {isAuthenticated ? "Authenticated" : "Not authenticated"}
        </span>

        {isAuthenticated && (
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        )}

        {!isAuthenticated && (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
