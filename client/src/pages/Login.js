import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginTemp.css";

import {
  FaEnvelope,
  FaLock
} from "react-icons/fa";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email: loginData.email,
        password: loginData.password,
      });

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");

        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }

        alert("Login Successful!");

        navigate("/home");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="login-cms-viewport-container">

      {/* LEFT PANEL */}
      <div className="login-left-brand-panel">

        <div className="login-panel-logo-wrap">
          <div className="login-panel-logo-circle">
            <div className="login-panel-logo-inner">
              <span className="login-panel-logo-main">NBA</span>
              <span className="login-panel-logo-sub">NATIONAL BOARD</span>
              <span className="login-panel-logo-sub">OF ACCREDITATION</span>
            </div>
          </div>
        </div>

        <div className="login-panel-hero-content">
          <h1 className="login-panel-main-title">
            COLLEGE <br />
            MANAGEMENT SYSTEM <br />
            FOR NBA
          </h1>

          <p className="login-panel-subtitle">
            Digitizing Accreditation Excellence
          </p>
        </div>

        <div className="login-panel-student-mascot">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600"
            alt="Student"
            className="mascot-img-fluid"
          />
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="login-right-form-panel">

        <div className="login-authentication-card">

          <div className="login-lock-avatar-icon">
            <FaLock />
          </div>

          <h2 className="login-card-main-title">
            Welcome Back!
          </h2>

          <p className="login-card-subtitle-desc">
            Login to your account to continue
          </p>

          <form
            onSubmit={handleLoginSubmit}
            className="login-functional-form-tree"
          >

            <div className="login-form-input-group">

              <label>Email Address</label>

              <div className="login-form-field-wrapper">

                <FaEnvelope className="login-form-field-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="login-form-input-group">

              <label>Password</label>

              <div className="login-form-field-wrapper">

                <FaLock className="login-form-field-icon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="login-forgot-password-anchor-row">

              <span
                className="login-forgot-link"
                onClick={() => alert("Forgot Password")}
              >
                Forgot Password?
              </span>

            </div>

            <div className="login-remember-me-checkbox-row">

              <input
                type="checkbox"
                id="rememberMeCheckbox"
                name="rememberMe"
                checked={loginData.rememberMe}
                onChange={handleChange}
              />

              <label htmlFor="rememberMeCheckbox">
                Remember Me
              </label>

            </div>

            <button
              type="submit"
              className="login-btn-processing-trigger"
            >
              Login
            </button>

          </form>

          <p className="login-bottom-form-redirect-text">

            Don't have an account?{" "}

            <span
              className="login-register-here-link-span"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}