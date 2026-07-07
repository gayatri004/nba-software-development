import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthorityManagement.css";

function AuthorityManagement() {

  const navigate = useNavigate();

  /* ===========================================
            INITIAL FORM DATA
  =========================================== */

  const initialFormData = {

    authority_id: "",

    authority_name: "",

    employee_id: "",

    department: "",

    designation: "",

    authority_level: "",

    joining_date: "",

    status: "Active",

    username: "",

    password: "",

    confirm_password: "",

    email: "",

    mobile: "",

    office_extension: "",

    office_location: "",

    apar_id: "",

    office_address: "",

    remarks: ""

  };

  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  /* ===========================================
              HANDLE CHANGE
  =========================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

    setErrors((prev) => ({

      ...prev,

      [name]: "",

    }));

  };

  /* ===========================================
             HANDLE BACK
  =========================================== */

  const handleBack = () => {

    navigate("/authority");

    window.scrollTo({

      top:0,

      behavior:"smooth"

    });

  };

  return (

    <div className="authority-container">

      <div className="authority-card">

        {/* ======================================
                    HEADER
        ======================================= */}

        <div className="authority-header">

          <div>

            <h1>

              Authority Management

            </h1>

            <p>

              Manage Authority Details

            </p>

          </div>

        </div>

        {/* ======================================
              AUTHORITY INFORMATION
        ======================================= */}

        <div className="authority-section">

          <h2>

            Authority Information

          </h2>

          <div className="authority-grid">
                        {/* Authority ID */}

            <div className="form-group">

              <label>
                Authority ID
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="authority_id"
                value={formData.authority_id}
                placeholder="Auto Generate"
                readOnly
              />

            </div>

            {/* Authority Name */}

            <div className="form-group">

              <label>
                Authority Name
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="authority_name"
                value={formData.authority_name}
                onChange={handleChange}
                placeholder="Enter Authority Name"
                className={errors.authority_name ? "error-input" : ""}
              />

              {errors.authority_name && (
                <span className="error-text">
                  {errors.authority_name}
                </span>
              )}

            </div>

            {/* Employee ID */}

            <div className="form-group">

              <label>
                Employee ID
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="Enter Employee ID"
                className={errors.employee_id ? "error-input" : ""}
              />

              {errors.employee_id && (
                <span className="error-text">
                  {errors.employee_id}
                </span>
              )}

            </div>

            {/* Department */}

            <div className="form-group">

              <label>
                Department
                <span className="required">*</span>
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={errors.department ? "error-input" : ""}
              >

                <option value="">
                  Select Department
                </option>

                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Mechanical Engineering</option>
                <option>Civil Engineering</option>
                <option>Electrical Engineering</option>
                <option>Electronics Engineering</option>
                <option>Administration</option>
                <option>Accounts</option>
                <option>Library</option>
                <option>Examination</option>

              </select>

              {errors.department && (
                <span className="error-text">
                  {errors.department}
                </span>
              )}

            </div>
                        {/* Designation */}

            <div className="form-group">

              <label>
                Designation
                <span className="required">*</span>
              </label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={errors.designation ? "error-input" : ""}
              >

                <option value="">Select Designation</option>

                <option>Principal</option>
                <option>Vice Principal</option>
                <option>Director</option>
                <option>Dean</option>
                <option>Head of Department</option>
                <option>IQAC Coordinator</option>
                <option>Exam Controller</option>
                <option>Administrator</option>
                <option>Office Superintendent</option>
                <option>Registrar</option>

              </select>

              {errors.designation && (
                <span className="error-text">
                  {errors.designation}
                </span>
              )}

            </div>

            {/* Authority Level */}

            <div className="form-group">

              <label>
                Authority Level
                <span className="required">*</span>
              </label>

              <select
                name="authority_level"
                value={formData.authority_level}
                onChange={handleChange}
                className={errors.authority_level ? "error-input" : ""}
              >

                <option value="">Select Authority Level</option>

                <option>Super Admin</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Head</option>
                <option>Coordinator</option>
                <option>User</option>

              </select>

              {errors.authority_level && (
                <span className="error-text">
                  {errors.authority_level}
                </span>
              )}

            </div>

            {/* Joining Date */}

            <div className="form-group">

              <label>
                Joining Date
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className={errors.joining_date ? "error-input" : ""}
              />

              {errors.joining_date && (
                <span className="error-text">
                  {errors.joining_date}
                </span>
              )}

            </div>

            {/* Status */}

            <div className="form-group">

              <label>
                Status
                <span className="required">*</span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>

              </select>

            </div>

          </div>

        </div>

        {/* ======================================
                LOGIN INFORMATION
        ======================================= */}

        <div className="authority-section">

          <h2>

            Login Information

          </h2>

          <div className="authority-grid">
                        {/* ==============================
                  Username
            ============================== */}

            <div className="form-group">

              <label>
                Username
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className={errors.username ? "error-input" : ""}
              />

              {errors.username && (
                <span className="error-text">
                  {errors.username}
                </span>
              )}

            </div>

            {/* ==============================
                  Password
            ============================== */}

            <div className="form-group">

              <label>
                Password
                <span className="required">*</span>
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={errors.password ? "error-input" : ""}
              />

              {errors.password && (
                <span className="error-text">
                  {errors.password}
                </span>
              )}

            </div>

            {/* ==============================
              Confirm Password
            ============================== */}

            <div className="form-group">

              <label>
                Confirm Password
                <span className="required">*</span>
              </label>

              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirm_password ? "error-input" : ""}
              />

              {errors.confirm_password && (
                <span className="error-text">
                  {errors.confirm_password}
                </span>
              )}

            </div>

            {/* ==============================
                    Email
            ============================== */}

            <div className="form-group">

              <label>
                Email ID
                <span className="required">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className={errors.email ? "error-input" : ""}
              />

              {errors.email && (
                <span className="error-text">
                  {errors.email}
                </span>
              )}

            </div>

            {/* ==============================
                Mobile Number
            ============================== */}

            <div className="form-group">

              <label>
                Mobile Number
                <span className="required">*</span>
              </label>

              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                maxLength="10"
                className={errors.mobile ? "error-input" : ""}
              />

              {errors.mobile && (
                <span className="error-text">
                  {errors.mobile}
                </span>
              )}

            </div>

            {/* ==============================
              Office Extension
            ============================== */}

            <div className="form-group">

              <label>

                Office Extension

              </label>

              <input
                type="text"
                name="office_extension"
                value={formData.office_extension}
                onChange={handleChange}
                placeholder="Enter Office Extension"
              />

            </div>

            {/* ==============================
                Office Location
            ============================== */}

            <div className="form-group">

              <label>

                Office Location

              </label>

              <input
                type="text"
                name="office_location"
                value={formData.office_location}
                onChange={handleChange}
                placeholder="Enter Office Location"
              />

            </div>

            {/* ==============================
                    APAR ID
            ============================== */}

            <div className="form-group">

              <label>

                APAR ID

              </label>

              <input
                type="text"
                name="apar_id"
                value={formData.apar_id}
                onChange={handleChange}
                placeholder="Enter APAR ID"
              />

            </div>

          </div>

        </div>

        {/* ======================================
              OFFICE INFORMATION
        ======================================= */}

        <div className="authority-section">

          <h2>

            Office Information

          </h2>

          <div className="authority-grid">
                        {/* ==============================
                Office Address
            ============================== */}

            <div
              className="form-group"
              style={{ gridColumn: "1 / -1" }}
            >

              <label>

                Office Address

              </label>

              <textarea
                rows="4"
                name="office_address"
                value={formData.office_address}
                onChange={handleChange}
                placeholder="Enter Office Address"
              />

            </div>

          </div>

        </div>

        {/* ======================================
            PERMISSION INFORMATION
        ======================================= */}

        <div className="authority-section">

          <h2>

            Permission Information

          </h2>

          <div className="permission-grid">

            <label className="permission-item">
              <input type="checkbox" />
              Dashboard
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Employee
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Faculty
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Department
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Course
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Attendance
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Salary
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Reports
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Authority
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              User Management
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Settings
            </label>

            <label className="permission-item">
              <input type="checkbox" />
              Notifications
            </label>

          </div>

        </div>

        {/* ======================================
                REMARKS
        ======================================= */}

        <div className="authority-section">

          <h2>

            Remarks

          </h2>

          <div className="form-group">

            <textarea

              rows="5"

              name="remarks"

              value={formData.remarks}

              onChange={handleChange}

              placeholder="Enter Remarks"

            />

          </div>

        </div>

        {/* ======================================
              ACTION BUTTONS
        ======================================= */}

        <div className="authority-button-group">
                      {/* ==============================
                SAVE BUTTON
          ============================== */}

          <button
            type="button"
            className="save-btn"
            disabled={loading}
            onClick={async () => {

              let validationErrors = {};

              if (!formData.authority_name.trim())
                validationErrors.authority_name =
                  "Authority Name is required.";

              if (!formData.employee_id.trim())
                validationErrors.employee_id =
                  "Employee ID is required.";

              if (!formData.department)
                validationErrors.department =
                  "Department is required.";

              if (!formData.designation)
                validationErrors.designation =
                  "Designation is required.";

              if (!formData.authority_level)
                validationErrors.authority_level =
                  "Authority Level is required.";

              if (!formData.joining_date)
                validationErrors.joining_date =
                  "Joining Date is required.";

              if (!formData.username.trim())
                validationErrors.username =
                  "Username is required.";

              if (!formData.email.trim())
                validationErrors.email =
                  "Email is required.";

              if (!formData.mobile.trim())
                validationErrors.mobile =
                  "Mobile Number is required.";

              if (!formData.password)
                validationErrors.password =
                  "Password is required.";

              if (
                formData.password !==
                formData.confirm_password
              ) {

                validationErrors.confirm_password =
                  "Password does not match.";

              }

              if (
                Object.keys(validationErrors).length > 0
              ) {

                setErrors(validationErrors);

                return;

              }

              try {

                setLoading(true);

                await axios.post(

                  "nba-software-development-production.up.railway.app/authority",

                  formData

                );

                alert("Authority Saved Successfully.");

                setFormData(initialFormData);

                setErrors({});

                window.scrollTo({

                  top:0,

                  behavior:"smooth"

                });

              } catch (err) {

                console.log(err);

                alert("Unable to Save Record.");

              } finally {

                setLoading(false);

              }

            }}
          >

            {loading ? "Saving..." : "Save"}

          </button>

          {/* ==============================
                UPDATE BUTTON
          ============================== */}

          <button

            type="button"

            className="update-btn"

          >

            Update

          </button>

          {/* ==============================
                DELETE BUTTON
          ============================== */}

          <button

            type="button"

            className="delete-btn"

          >

            Delete

          </button>

          {/* ==============================
                CLEAR BUTTON
          ============================== */}

          <button

            type="button"

            className="clear-btn"

            onClick={() => {

              setFormData(initialFormData);

              setErrors({});

              window.scrollTo({

                top:0,

                behavior:"smooth"

              });

            }}

          >

            Clear

          </button>

          {/* ==============================
                BACK BUTTON
          ============================== */}

          <button

            type="button"

            className="back-btn"

            onClick={handleBack}

          >

            Back

          </button>

        </div>

      </div>

    </div>

  );

}

export default AuthorityManagement;