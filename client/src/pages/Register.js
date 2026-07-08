import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // १. नेव्हिगेशनसाठी useNavigate इम्पोर्ट केले
import "../styles/Register.css"; 
import axios from "axios";
// Register.css फाईल जोडली आहे

import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaPaperPlane, 
  FaUserPlus 
} from 'react-icons/fa';

export default function Register() {
  const navigate = useNavigate(); // २. नेव्हिगेट फंक्शन इनिशियलाइज केले

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    otp: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = () => {
    alert("OTP Sent Successfully!");
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Password and Confirm Password do not match");
    return;
  }

  try {
    const res = await axios.post("https://nba-software-development-production.up.railway.app/register", {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    if (res.data.success) {
      alert("Registration Successful!");

      setFormData({
        fullName: "",
        email: "",
        otp: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      navigate("/login");
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.log(err);
    alert("Registration Failed");
  }
};

  return (
    <div className="register-cms-container">
      
      {/* ================= LEFT SIDE (BLUE CURVE DESIGN) ================= */}
      <div className="register-left-hero">
        
        {/* NBA Custom CSS Logo */}
        <div className="register-logo-wrapper">
          <div className="register-logo-circle">
            <div className="register-logo-inner">
              <span className="register-logo-main">NBA</span>
              <span className="register-logo-sub">NATIONAL BOARD</span>
              <span className="register-logo-sub">OF ACCREDITATION</span>
            </div>
          </div>
        </div>

        {/* Hero Title Grid */}
        <div className="register-hero-text">
          <h1 className="register-main-title">
            COLLEGE <br /> MANAGEMENT SYSTEM <br /> FOR NBA
          </h1>
          <p className="register-subtitle">
            Digitizing Accreditation Excellence
          </p>
        </div>

        <div className="register-left-footer-space"></div>
      </div>

      {/* ================= RIGHT SIDE (REGISTRATION FORM) ================= */}
      <div className="register-right-side">
        <div className="register-card-form">
          
          {/* Top Circular Blue Icon Box */}
          <div className="register-avatar-icon">
            <FaUserPlus />
          </div>

          <h2 className="register-form-title">Create Your Account</h2>
          <p className="register-form-subtitle">Fill in the details below to register</p>

          <form onSubmit={handleRegister} className="register-actual-form">
            
            {/* Full Name Input Box */}
            <div className="register-input-group register-full-row">
              <label>Full Name</label>
              <div className="register-field-wrapper">
                <FaUser className="register-field-icon" />
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Enter your full name" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Address Input Box */}
            <div className="register-input-group register-full-row">
              <label>Email Address</label>
              <div className="register-email-row">
                <div className="register-field-wrapper register-flex-input">
                  <FaEnvelope className="register-field-icon" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="button" className="register-btn-otp" onClick={handleSendOTP}>
                  <FaPaperPlane className="register-otp-icon-small" /> Send OTP
                </button>
              </div>
            </div>

            {/* Enter OTP Input Box */}
            <div className="register-input-group register-half-row">
              <label>Enter OTP</label>
              <div className="register-field-wrapper">
                <input 
                  type="text" 
                  name="otp"
                  maxLength="6"
                  placeholder="Enter 6 digit OTP" 
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Mobile Number Input Box */}
            <div className="register-input-group register-full-row">
              <label>Mobile Number</label>
              <div className="register-field-wrapper">
                <FaPhone className="register-field-icon register-phone-rotate" />
                <input 
                  type="tel" 
                  name="mobileNumber"
                  placeholder="Enter your mobile number" 
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input Box */}
            <div className="register-input-group register-half-row">
              <label>Password</label>
              <div className="register-field-wrapper">
                <FaLock className="register-field-icon" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input Box */}
            <div className="register-input-group register-half-row">
              <label>Confirm Password</label>
              <div className="register-field-wrapper">
                <FaLock className="register-field-icon" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role Select Dropdown Option */}
            <div className="register-input-group register-full-row">
              <label>Role</label>
              <div className="register-field-wrapper">
                <FaUser className="register-field-icon" />
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Admin">Admin</option>
                  <option value="HOD">HOD</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>
            </div>

            {/* Main Submit Action Trigger */}
            <button type="submit" className="register-btn-submit">
              <FaUserPlus className="register-submit-icon-btn" /> Register Account
            </button>

          </form>

          {/* Bottom Redirect Anchor */}
          <p className="register-bottom-text">
            Already have an account?{' '}
            {/* ३. पारंपारिक <a> टॅग ऐवजी react-router-dom च्या नेव्हिगेशनचा वापर केला */}
            <span 
              onClick={() => navigate('/login')} 
              className="register-login-link" 
              style={{ cursor: 'pointer' }}
            >
              Login here
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}
