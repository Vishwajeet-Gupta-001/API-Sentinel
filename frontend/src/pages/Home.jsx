import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-panel">
        <div className="home-brand">
          <div className="home-logo">A</div>
          <span>API Sentinel</span>
        </div>

        <div className="home-badge">
          <span className="home-status-dot"></span>
          Monitor • Detect • Resolve
        </div>

        <h1>
          Keep Your APIs
          <span>Always Reliable.</span>
        </h1>

        <p className="home-description">
          API Sentinel monitors your APIs in real time, detects failures, tracks
          incidents, and gives you the visibility you need to keep your services
          healthy.
        </p>

        <div className="home-features">
          <div className="home-feature">
            <span>⌁</span>
            <div>
              <strong>Real-Time Monitoring</strong>
              <p>Continuously monitor your APIs and track their health.</p>
            </div>
          </div>

          <div className="home-feature">
            <span>!</span>
            <div>
              <strong>Incident Management</strong>
              <p>
                Detect failures and manage incidents from detection to
                resolution.
              </p>
            </div>
          </div>

          <div className="home-feature">
            <span>↗</span>
            <div>
              <strong>Performance Analytics</strong>
              <p>Understand API performance through detailed analytics.</p>
            </div>
          </div>
        </div>

        <div className="home-actions">
          <Link to="/register" className="home-register-button">
            Get Started
          </Link>

          <Link to="/login" className="home-login-button">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
