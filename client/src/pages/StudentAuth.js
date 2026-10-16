import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaCheck,
  FaTimes,
  FaUniversity,
  FaAward,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const StudentAuth = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("login");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Success Modal State ("registration" | "login" | null)
  const [successModalType, setSuccessModalType] = useState(null);
  const [loggedInStudentName, setLoggedInStudentName] = useState("");

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const initialRegState = {
    fullName: "",
    prn: "",
    email: "",
    mobile: "",
    department: "",
    program: "",
    yearSemester: "",
    dob: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  };

  const [regForm, setRegForm] = useState(initialRegState);

  const modernCampusImage =
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";

  // Handle Registration Submit
  const handleRegister = (e) => {
    e.preventDefault();

    if (regForm.password !== regForm.confirmPassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }

    if (!regForm.agreeTerms) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    const cleanPrn = regForm.prn.trim().toUpperCase();
    const existingUsers = JSON.parse(localStorage.getItem("nba_registered_students") || "[]");

    const duplicate = existingUsers.find(
      (u) =>
        u.prn.toUpperCase() === cleanPrn ||
        u.email.toLowerCase() === regForm.email.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A student with this PRN or Email already exists. Please login instead.");
      setView("login");
      return;
    }

    const newStudent = {
      fullName: regForm.fullName.trim(),
      prn: cleanPrn,
      email: regForm.email.trim().toLowerCase(),
      mobile: regForm.mobile.trim(),
      department: regForm.department || "Computer Engineering",
      program: regForm.program || "B.Tech Computer Engineering",
      yearSemester: regForm.yearSemester || "6th Semester",
      dob: regForm.dob,
      password: regForm.password,
    };

    existingUsers.push(newStudent);
    localStorage.setItem("nba_registered_students", JSON.stringify(existingUsers));

    // Reset Form Fields completely
    setRegForm(initialRegState);

    // Show Image-Style Popup
    setSuccessModalType("registration");
  };

  // Handle Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const inputId = loginForm.identifier.trim();
    const inputPass = loginForm.password;

    const existingUsers = JSON.parse(localStorage.getItem("nba_registered_students") || "[]");

    const foundUser = existingUsers.find(
      (u) =>
        (u.prn.toUpperCase() === inputId.toUpperCase() ||
          u.email.toLowerCase() === inputId.toLowerCase()) &&
        u.password === inputPass
    );

    if (!foundUser) {
      setLoginError("Invalid Student ID or Password. Please register if you are a new student.");
      return;
    }

    const sessionData = {
      name: foundUser.fullName,
      prn: foundUser.prn,
      email: foundUser.email,
      department: foundUser.department,
      semester: foundUser.yearSemester,
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("currentStudent", JSON.stringify(sessionData));
    setLoggedInStudentName(foundUser.fullName);

    setLoginForm({ identifier: "", password: "", rememberMe: false });
    setSuccessModalType("login");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      alert("Please enter your registered email address.");
      return;
    }
    alert(`Password reset instructions have been sent to ${forgotEmail}. Please check your inbox.`);
    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 10% 20%, #eff6ff 0%, #dbeafe 90%)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Outer Card with Comfortable Proportions */}
      <div
        style={{
          width: "100%",
          maxWidth: view === "register" ? "1020px" : "880px",
          height: view === "register" ? "620px" : "520px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 50px -15px rgba(2, 132, 199, 0.22)",
          border: "1px solid #bfdbfe",
          transition: "all 0.3s ease",
        }}
      >
        {/* LEFT BRANDING PANEL */}
        <div
          style={{
            flex: "1 1 38%",
            position: "relative",
            backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(2, 132, 199, 0.88) 100%), url(${modernCampusImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "32px 26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0284c7",
                  fontSize: "19px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <FaUniversity />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "900", letterSpacing: "0.5px", color: "#ffffff" }}>
                  NBA
                </h2>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#e0f2fe" }}>
                  National Board of Accreditation
                </div>
              </div>
            </div>

            <h1 style={{ margin: "0 0 2px 0", fontSize: "24px", fontWeight: "900", color: "#ffffff" }}>
              Student Portal
            </h1>
            <p style={{ margin: 0, fontSize: "11.5px", fontWeight: "700", color: "#bae6fd" }}>
              Learn &nbsp;|&nbsp; Grow &nbsp;|&nbsp; Achieve
            </p>
          </div>

          <div style={{ margin: "14px 0" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "800", color: "#ffffff" }}>
              Your Academic Journey
            </h3>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#e2e8f0" }}>
              Towards a Better, Accredited Future
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "14px",
              padding: "14px",
              border: "1px solid rgba(255, 255, 255, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#ffffff",
              }}
            >
              <FaAward />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#ffffff" }}>
                Outcome-Based Education
              </div>
              <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>
                Tier-II OBE Compliance & Learning Ledger
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM PANEL */}
        <div
          style={{
            flex: "1 1 62%",
            backgroundColor: "#ffffff",
            padding: "26px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* LOGIN VIEW */}
          {view === "login" && (
            <div style={{ width: "100%", maxWidth: "360px", margin: "0 auto" }}>
              <div style={{ marginBottom: "16px" }}>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>
                  Welcome Back!
                </h2>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b" }}>
                  Login to your student account
                </p>
              </div>

              {loginError && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    Student ID / Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      required
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder="Enter your Student ID or Email"
                      style={{
                        width: "100%",
                        height: "38px",
                        padding: "0 10px 0 34px",
                        borderRadius: "7px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <FaUser style={{ position: "absolute", left: "11px", top: "13px", color: "#94a3b8", fontSize: "11px" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showLoginPass ? "text" : "password"}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                      style={{
                        width: "100%",
                        height: "38px",
                        padding: "0 34px",
                        borderRadius: "7px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />
                    <FaLock style={{ position: "absolute", left: "11px", top: "13px", color: "#94a3b8", fontSize: "11px" }} />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "11px",
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      {showLoginPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "11.5px", color: "#475569" }}>
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      style={{ width: "15px", height: "15px", margin: 0, accentColor: "#0284c7" }}
                    />
                    Remember me
                  </label>
                  <span
                    onClick={() => setShowForgotModal(true)}
                    style={{ fontSize: "11.5px", color: "#0284c7", fontWeight: "700", cursor: "pointer" }}
                  >
                    Forgot Password?
                  </span>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "38px",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "7px",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                  }}
                >
                  Login
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", margin: "14px 0", color: "#94a3b8", fontSize: "11px" }}>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                <span style={{ padding: "0 8px", fontWeight: "700" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              </div>

              <button
                type="button"
                onClick={() => alert("Google SSO Login")}
                style={{
                  width: "100%",
                  height: "36px",
                  background: "#ffffff",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FcGoogle style={{ fontSize: "16px" }} /> Continue with Google
              </button>

              <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11.5px", color: "#64748b" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setView("register");
                    setLoginError("");
                  }}
                  style={{ color: "#0284c7", fontWeight: "800", cursor: "pointer" }}
                >
                  Register here
                </span>
              </div>
            </div>
          )}

          {/* REGISTER VIEW WITH COMFORTABLE GAP & HEIGHT */}
          {view === "register" && (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <div style={{ marginBottom: "14px" }}>
                <h2 style={{ margin: "0 0 3px 0", fontSize: "21px", fontWeight: "900", color: "#0f172a" }}>
                  Create Your Account
                </h2>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b" }}>
                  Register to access your student portal
                </p>
              </div>

              <form onSubmit={handleRegister}>
                {/* Row 1 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Full Name *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        required
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 8px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                      <FaUser style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Student ID / PRN *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        required
                        value={regForm.prn}
                        onChange={(e) => setRegForm({ ...regForm, prn: e.target.value })}
                        placeholder="ENTER YOUR STUDENT ID"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 8px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                          textTransform: "uppercase",
                        }}
                      />
                      <FaIdCard style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Email Address *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="Enter your email address"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 8px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                      <FaEnvelope style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Mobile Number *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="tel"
                        required
                        value={regForm.mobile}
                        onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                        placeholder="Enter your mobile number"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 8px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                      <FaPhone style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Department *
                    </label>
                    <select
                      required
                      value={regForm.department}
                      onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                      style={{
                        width: "100%",
                        height: "36px",
                        padding: "0 8px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "11.5px",
                        boxSizing: "border-box",
                        background: "#fff",
                      }}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Telecom">Electronics & Telecom</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Program *
                    </label>
                    <select
                      required
                      value={regForm.program}
                      onChange={(e) => setRegForm({ ...regForm, program: e.target.value })}
                      style={{
                        width: "100%",
                        height: "36px",
                        padding: "0 8px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "11.5px",
                        boxSizing: "border-box",
                        background: "#fff",
                      }}
                    >
                      <option value="">Select Program</option>
                      <option value="B.Tech Engineering (UG)">B.Tech Engineering (UG)</option>
                      <option value="M.Tech Engineering (PG)">M.Tech Engineering (PG)</option>
                    </select>
                  </div>
                </div>

                {/* Row 4 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Year / Semester *
                    </label>
                    <select
                      required
                      value={regForm.yearSemester}
                      onChange={(e) => setRegForm({ ...regForm, yearSemester: e.target.value })}
                      style={{
                        width: "100%",
                        height: "36px",
                        padding: "0 8px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "11.5px",
                        boxSizing: "border-box",
                        background: "#fff",
                      }}
                    >
                      <option value="">Select Year / Semester</option>
                      <option value="5th Semester (TY)">5th Semester (TY)</option>
                      <option value="6th Semester (TY)">6th Semester (TY)</option>
                      <option value="7th Semester (B.E.)">7th Semester (B.E.)</option>
                      <option value="8th Semester (B.E.)">8th Semester (B.E.)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={regForm.dob}
                      onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                      style={{
                        width: "100%",
                        height: "36px",
                        padding: "0 8px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "11.5px",
                        boxSizing: "border-box",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>

                {/* Row 5 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showRegPass ? "text" : "password"}
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Create password"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 28px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                      <FaLock style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "9px",
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {showRegPass ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "3px" }}>
                      Confirm Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showRegConfirmPass ? "text" : "password"}
                        required
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                        style={{
                          width: "100%",
                          height: "36px",
                          padding: "0 28px 0 28px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                      <FaLock style={{ position: "absolute", left: "9px", top: "11px", color: "#94a3b8", fontSize: "11px" }} />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "9px",
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {showRegConfirmPass ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Privacy Checkbox */}
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: "#475569",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={regForm.agreeTerms}
                      onChange={(e) => setRegForm({ ...regForm, agreeTerms: e.target.checked })}
                      style={{
                        width: "15px",
                        height: "15px",
                        margin: 0,
                        cursor: "pointer",
                        accentColor: "#0284c7",
                      }}
                    />
                    <span>
                      I agree to the <strong style={{ color: "#0284c7" }}>Terms & Conditions</strong> and{" "}
                      <strong style={{ color: "#0284c7" }}>Privacy Policy</strong>
                    </span>
                  </label>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "38px",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "7px",
                    fontWeight: "800",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                  }}
                >
                  Register
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11.5px", color: "#64748b" }}>
                Already have an account?{" "}
                <span
                  onClick={() => setView("login")}
                  style={{ color: "#0284c7", fontWeight: "800", cursor: "pointer" }}
                >
                  Login here
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXACT SUCCESS POPUP MODAL */}
      {successModalType && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "radial-gradient(circle at 10% 20%, rgba(191, 219, 254, 0.82) 0%, rgba(219, 234, 254, 0.9) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              padding: "44px 38px 36px 38px",
              width: "100%",
              maxWidth: "420px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(2, 132, 199, 0.25)",
              border: "1px solid #e0f2fe",
            }}
          >
            {/* Green Circular Tick */}
            <div
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                margin: "0 auto 24px auto",
                boxShadow: "0 10px 22px rgba(16, 185, 129, 0.35)",
              }}
            >
              <FaCheck />
            </div>

            <h2
              style={{
                margin: "0 0 14px 0",
                fontSize: "23px",
                fontWeight: "900",
                color: "#0f2e5a",
                letterSpacing: "-0.3px",
              }}
            >
              {successModalType === "registration"
                ? "Registration Successful!"
                : "Login Successful!"}
            </h2>

            <p
              style={{
                margin: "0 0 28px 0",
                fontSize: "13px",
                color: "#475569",
                lineHeight: "1.6",
                fontWeight: "500",
              }}
            >
              {successModalType === "registration" ? (
                <>
                  Your account has been created successfully.
                  <br />
                  You can now login with your credentials.
                </>
              ) : (
                <>
                  Welcome back, <strong>{loggedInStudentName}</strong>!
                  <br />
                  Your academic session has been securely initiated.
                </>
              )}
            </p>

            <button
              onClick={() => {
                if (successModalType === "registration") {
                  setSuccessModalType(null);
                  setView("login");
                } else {
                  setSuccessModalType(null);
                  navigate("/student-dashboard");
                }
              }}
              style={{
                width: "100%",
                maxWidth: "230px",
                padding: "12px 20px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
              }}
            >
              {successModalType === "registration" ? "Go to Login" : "Go to Dashboard"}
            </button>

            <div
              style={{
                marginTop: "32px",
                fontSize: "12px",
                color: "#475569",
                fontWeight: "500",
              }}
            >
              Thank you for joining{" "}
              <strong style={{ color: "#2563eb", fontWeight: "700" }}>
                NBA Student Portal!
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px 22px",
              width: "90%",
              maxWidth: "380px",
              position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "14px",
                background: "none",
                border: "none",
                fontSize: "16px",
                color: "#94a3b8",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <FaLock style={{ fontSize: "22px", color: "#0284c7", marginBottom: "4px" }} />
              <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: "900", color: "#0f172a" }}>
                Forgot Password
              </h3>
              <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b" }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  style={{
                    width: "100%",
                    height: "36px",
                    padding: "0 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  height: "36px",
                  background: "#0284c7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "7px",
                  fontWeight: "800",
                  fontSize: "12.5px",
                  cursor: "pointer",
                }}
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAuth;