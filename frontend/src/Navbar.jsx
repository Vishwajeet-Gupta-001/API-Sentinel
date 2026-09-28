import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav>
      <h2>API Sentinel</h2>

      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/create-monitor">Create Monitor</Link>

      <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
