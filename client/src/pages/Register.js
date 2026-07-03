import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaKey,
  FaUserGraduate,
} from "react-icons/fa";

import { api } from "../api";
import "../styles/Register.css";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    otp: "",
    mobile: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const sendOtp = async () => {

    setError("");

    if (!form.email) {
      setError("Please enter your email.");
      return;
    }

    try {

      await api("/auth/send-otp", {
        email: form.email,
      });

      setOtpSent(true);

    } catch (err) {

      setError(err.message);

    }

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data = await api("/auth/register", form);

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Registration Successful");

      navigate("/user");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-wrapper">

      {/* LEFT PANEL */}

      <div className="register-left">

        <img
          src="/nba-logo.png"
          alt="NBA"
          className="register-logo"
        />

        <div className="register-content">

          <h1>

            COLLEGE
            <br />

            MANAGEMENT
            <br />

            SYSTEM
            <br />

            <span>FOR NBA</span>

          </h1>

          <div className="register-line"></div>

          <p>

            Digitizing Accreditation Excellence

          </p>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="register-right">

        <form
          className="register-card"
          onSubmit={handleSubmit}
        >

          <div className="user-circle">

            <FaUser />

          </div>

          <h2>

            Create Your Account

          </h2>

          <p className="subtitle">

            Fill in the details below to register

          </p>
                    {/* Full Name */}

          <div className="register-group">

            <label>Full Name</label>

            <div className="register-input">

              <FaUser className="input-icon" />

              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* Email + OTP */}

          <div className="register-group">

            <label>Email Address</label>

            <div className="register-email-row">

              <div className="register-input">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                type="button"
                className="otp-btn"
                onClick={sendOtp}
              >
                Send OTP
              </button>

            </div>

          </div>

          {/* OTP + Mobile */}

          <div className="register-row">

            <div className="register-group">

              <label>OTP</label>

              <div className="register-input">

                <FaKey className="input-icon" />

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={form.otp}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="register-group">

              <label>Mobile Number</label>

              <div className="register-input">

                <FaPhoneAlt className="input-icon" />

                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {otpSent && (

            <div className="otp-success">

              OTP Sent Successfully

            </div>

          )}

          {/* Password Row */}

          <div className="register-row">

            <div className="register-group">

              <label>Password</label>

              <div className="register-input">

                <FaLock className="input-icon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="register-group">

              <label>Confirm Password</label>

              <div className="register-input">

                <FaLock className="input-icon" />

                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>
                    {/* Role */}

          <div className="register-group">

            <label>Role</label>

            <div className="register-input">

              <FaUserGraduate className="input-icon" />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select your role
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="faculty">
                  Faculty
                </option>

                <option value="student">
                  Student
                </option>

                <option value="coordinator">
                  NBA Coordinator
                </option>

              </select>

            </div>

          </div>

          {/* Error Message */}

          {error && (

            <div className="error-box">

              {error}

            </div>

          )}

          {/* Register Button */}

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          {/* Login Link */}

          <div className="login-text">

            Already have an account?

            <Link to="/user">

              Login

            </Link>

          </div>

        </form>

      </div>

    </div>

  );

}