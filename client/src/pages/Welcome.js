import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="welcome-cms-container">

      <div className="welcome-left-hero">

        <div className="welcome-logo-wrapper">
          <div className="welcome-logo-circle">
            <div className="welcome-logo-inner">
              <span className="welcome-logo-main">NBA</span>
              <span className="welcome-logo-sub">NATIONAL BOARD</span>
              <span className="welcome-logo-sub">OF ACCREDITATION</span>
            </div>
          </div>
        </div>

        <div className="welcome-hero-text">
          <h1 className="welcome-main-title">
            COLLEGE <br />
            MANAGEMENT SYSTEM <br />
            FOR NBA
          </h1>

          <p className="welcome-subtitle">
            Digitizing Accreditation Excellence
          </p>
        </div>

        <div className="welcome-btn-group">
          <button
            className="welcome-btn-login"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="welcome-btn-register"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>

      </div>

      <div className="welcome-right-side">
        <h2 className="welcome-right-title">
          Welcome to NBA CMS
        </h2>

        <p className="welcome-right-desc">
          Manage Accreditation, Reports, Criteria and Documentation in one platform.
        </p>
      </div>

    </div>
  );
}