import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import "../styles/User.css";

export default function User() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await api("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

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

          <div className="tag">
            Digitizing Accreditation Excellence
          </div>
        </div>

      </div>

      {/* Right Side */}
      <div className="right">

        <form className="card" onSubmit={submit}>

          <div className="icon-circle">🔒</div>

          <h2>Welcome Back!</h2>

          <div className="sub">
            Login to your account to continue
          </div>

          <label>Email Address</label>

          <div className="input">
            📧
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          <label>Password</label>

          <div className="input">
            🔒
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {err && <div className="err">{err}</div>}

          <div className="remember">
            <input type="checkbox" />
            <span>Remember Me</span>
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="center">
            Don't have an account?{" "}
            <Link to="/register">
              Register here
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}