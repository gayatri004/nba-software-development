import { Link } from "react-router-dom";
import "../styles/Welcome.css";

export default function Welcome() {
  return (
    <div className="shell">

      {/* Left Side */}
      <div className="left">

        <div className="logo-section">
          <img
            src="/nba-logo.png"
            alt="NBA Logo"
            className="logo"
          />
        </div>

        <div className="welcome-content">
          <h1>
            COLLEGE <br />
            MANAGEMENT SYSTEM <br />
            FOR NBA
          </h1>

          <p className="tag">
            Digitizing Accreditation Excellence
          </p>

          <div className="welcome-btns">
            <Link to="/login" className="btn-light">
              Login
            </Link>

            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="right">

        <div className="right-content">

          <img
            
          />

          <h2>Welcome to NBA CMS</h2>

          <p className="sub">
            Manage Accreditation, Reports, Criteria and Documentation
            in one platform.
          </p>

        </div>

      </div>

    </div>
  );
}