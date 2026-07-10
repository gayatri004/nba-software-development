import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyForm.css";

function FacultyForm() {

  const navigate = useNavigate();
  const formRef = useRef(null);
  const inputRefs = useRef({});

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({

    // ================= PERSONAL =================

    facultyId: "",
    facultyName: "",
    fatherName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    category: "",
    facultyStatus: "",

    // ================= ADDRESS =================

    currentAddress: "",
    permanentAddress: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",

    // ================= OTHER =================

    panNumber: "",
    aadhaarNumber: "",
    aparId: "",
    department: "",
    designation: "",
    qualification: "",
    specialization: "",
    joiningDate: "",
    employeeType: "",
    experience: "",
    previousExperience: "",
    email: "",
    mobile: ""
    

  });

  useEffect(() => {

    const draft = localStorage.getItem("facultyForm");

    if (draft) {

      setFormData(JSON.parse(draft));

    }

  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => {

      const updated = {

        ...prev,

        [name]: value

      };

      localStorage.setItem(
        "facultyForm",
        JSON.stringify(updated)
      );

      return updated;

    });

    if (errors[name]) {

      setErrors((prev) => ({

        ...prev,

        [name]: ""

      }));

    }

  };

 const handleBackToTop = () => {
  navigate("/dashboard");
};

  const handleSubmit = async () => {
        const newErrors = {};

    /* ======================
        REQUIRED VALIDATION
    ====================== */

    Object.keys(formData).forEach((key) => {

      if (!formData[key]) {

        newErrors[key] = "This field is required";

      }

    });

    /* ======================
          EMAIL
    ====================== */

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {

      newErrors.email = "Invalid Email";

    }

    /* ======================
          MOBILE
    ====================== */

    if (
      formData.mobile &&
      !/^[0-9]{10}$/.test(formData.mobile)
    ) {

      newErrors.mobile = "Mobile Number must be 10 digits";

    }

    if (
      formData.alternateMobile &&
      !/^[0-9]{10}$/.test(formData.alternateMobile)
    ) {

      newErrors.alternateMobile =
        "Alternate Mobile must be 10 digits";

    }

    /* ======================
        AADHAAR
    ====================== */

    if (
      formData.aadhaarNumber &&
      !/^[0-9]{12}$/.test(formData.aadhaarNumber)
    ) {

      newErrors.aadhaarNumber =
        "Aadhaar Number must be 12 digits";

    }

    /* ======================
          PIN CODE
    ====================== */

    if (
      formData.pinCode &&
      !/^[0-9]{6}$/.test(formData.pinCode)
    ) {

      newErrors.pinCode =
        "PIN Code must be 6 digits";

    }

    /* ======================
            PAN
    ====================== */

    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)
    ) {

      newErrors.panNumber =
        "Invalid PAN Number";

    }

    /* ======================
        SHOW ERRORS
    ====================== */

    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);

      const firstError = Object.keys(newErrors)[0];

      if (inputRefs.current[firstError]) {

        inputRefs.current[firstError].scrollIntoView({

          behavior: "smooth",

          block: "center",

        });

        inputRefs.current[firstError].focus();

      }

      return;

    }

    setErrors({});

    try {
            await axios.post(
        "https://nba-software-development-production.up.railway.app/faculty",
        {

          faculty_id: formData.facultyId,
          faculty_name: formData.facultyName,
          father_name: formData.fatherName,
          dob: formData.dob,
          gender: formData.gender,
          marital_status: formData.maritalStatus,
          blood_group: formData.bloodGroup,
          nationality: formData.nationality,
          religion: formData.religion,
          category: formData.category,
          faculty_status: formData.facultyStatus,

          current_address: formData.currentAddress,
          permanent_address: formData.permanentAddress,
          city: formData.city,
          state: formData.state,
          pin_code: formData.pinCode,
          country: formData.country,

          pan_number: formData.panNumber,
          aadhaar_number: formData.aadhaarNumber,
          apar_id: formData.aparId,

          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          specialization: formData.specialization,

          joining_date: formData.joiningDate,
          employee_type: formData.employeeType,
          experience: formData.experience,
          previous_experience: formData.previousExperience,

          email: formData.email,
          mobile: formData.mobile
         
        }
      );

      localStorage.removeItem("facultyForm");

      setErrors({});

      setFormData({

        facultyId: "",
        facultyName: "",
        fatherName: "",
        dob: "",
        gender: "",
        maritalStatus: "",
        bloodGroup: "",
        nationality: "",
        religion: "",
        category: "",
        facultyStatus: "",

        currentAddress: "",
        permanentAddress: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",

        panNumber: "",
        aadhaarNumber: "",
        aparId: "",
        department: "",
        designation: "",
        qualification: "",
        specialization: "",
        joiningDate: "",
        employeeType: "",
        experience: "",
        previousExperience: "",
        email: "",
        mobile: ""
      

      });

      alert("Faculty Saved Successfully");

     navigate("/dashboard");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Unable to Save Faculty"
      );

    }

  };
    return (

    <div
      className="faculty-container"
      ref={formRef}
    >

      <div className="form-header">

        <h2>Faculty Management</h2>

      </div>

      <div className="form-layout">

        <div className="form-left">

          {/* ================= PERSONAL INFORMATION ================= */}

          <div className="personal-info">

            <h1>Personal Information </h1>

            <div className="grid-4">

              {/* Faculty ID */}

              <div className="form-group">

                <label>Faculty ID </label>

                <input
                  ref={(el) => (inputRefs.current.facultyId = el)}
                  type="text"
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  placeholder="Faculty ID"
                  className={errors.facultyId ? "error-input" : ""}
                />

                {errors.facultyId && (
                  <small className="error-text">
                    {errors.facultyId}
                  </small>
                )}

              </div>

              {/* Faculty Name */}

              <div className="form-group">

                <label>Faculty Name</label>

                <input
                  ref={(el) => (inputRefs.current.facultyName = el)}
                  type="text"
                  name="facultyName"
                  value={formData.facultyName}
                  onChange={handleChange}
                  placeholder="Faculty Name"
                  className={errors.facultyName ? "error-input" : ""}
                />

                {errors.facultyName && (
                  <small className="error-text">
                    {errors.facultyName}
                  </small>
                )}

              </div>

              {/* Father Name */}

              <div className="form-group">

                <label>Father / Husband Name</label>

                <input
                  ref={(el) => (inputRefs.current.fatherName = el)}
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Father / Husband Name"
                  className={errors.fatherName ? "error-input" : ""}
                />

                {errors.fatherName && (
                  <small className="error-text">
                    {errors.fatherName}
                  </small>
                )}

              </div>

              {/* DOB */}

              <div className="form-group">

                <label>Date of Birth</label>

                <input
                  ref={(el) => (inputRefs.current.dob = el)}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={errors.dob ? "error-input" : ""}
                />

                {errors.dob && (
                  <small className="error-text">
                    {errors.dob}
                  </small>
                )}

              </div>
                            {/* Gender */}

              <div className="form-group">

                <label>Gender</label>

                <select
                  ref={(el) => (inputRefs.current.gender = el)}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "error-input" : ""}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                {errors.gender && (
                  <small className="error-text">
                    {errors.gender}
                  </small>
                )}

              </div>

              {/* Marital Status */}

              <div className="form-group">

                <label>Marital Status</label>

                <select
                  ref={(el) => (inputRefs.current.maritalStatus = el)}
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className={errors.maritalStatus ? "error-input" : ""}
                >
                  <option value="">Select Status</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>

                {errors.maritalStatus && (
                  <small className="error-text">
                    {errors.maritalStatus}
                  </small>
                )}

              </div>

              {/* Blood Group */}

              <div className="form-group">

                <label>Blood Group</label>

                <select
                  ref={(el) => (inputRefs.current.bloodGroup = el)}
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={errors.bloodGroup ? "error-input" : ""}
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>

                {errors.bloodGroup && (
                  <small className="error-text">
                    {errors.bloodGroup}
                  </small>
                )}

              </div>

              {/* Nationality */}

              <div className="form-group">

                <label>Nationality</label>

                <select
                  ref={(el) => (inputRefs.current.nationality = el)}
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={errors.nationality ? "error-input" : ""}
                >
                  <option value="">Select Nationality</option>
                  <option>Indian</option>
                  <option>Other</option>
                </select>

                {errors.nationality && (
                  <small className="error-text">
                    {errors.nationality}
                  </small>
                )}

              </div>
                            {/* Religion */}

              <div className="form-group">

                <label>Religion</label>

                <select
                  ref={(el) => (inputRefs.current.religion = el)}
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className={errors.religion ? "error-input" : ""}
                >
                  <option value="">Select Religion</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Buddhist</option>
                  <option>Jain</option>
                  <option>Sikh</option>
                </select>

                {errors.religion && (
                  <small className="error-text">
                    {errors.religion}
                  </small>
                )}

              </div>

              {/* Category */}

              <div className="form-group">

                <label>Category</label>

                <select
                  ref={(el) => (inputRefs.current.category = el)}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? "error-input" : ""}
                >
                  <option value="">Select Category</option>
                  <option>Open</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                </select>

                {errors.category && (
                  <small className="error-text">
                    {errors.category}
                  </small>
                )}

              </div>

              {/* Faculty Status */}

              <div className="form-group">

                <label>Faculty Status</label>

                <select
                  ref={(el) => (inputRefs.current.facultyStatus = el)}
                  name="facultyStatus"
                  value={formData.facultyStatus}
                  onChange={handleChange}
                  className={errors.facultyStatus ? "error-input" : ""}
                >
                  <option value="">Select Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                {errors.facultyStatus && (
                  <small className="error-text">
                    {errors.facultyStatus}
                  </small>
                )}

              </div>

            </div>

          </div>

          {/* ================= ADDRESS INFORMATION ================= */}

          <div className="address-info">

            <h1>Address Information</h1>

            <div className="grid-2">
                            {/* Current Address */}

              <div className="form-group">

                <label>Current Address</label>

                <textarea
                  ref={(el) => (inputRefs.current.currentAddress = el)}
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  placeholder="Current Address"
                  className={errors.currentAddress ? "error-input" : ""}
                />

                {errors.currentAddress && (
                  <small className="error-text">
                    {errors.currentAddress}
                  </small>
                )}

              </div>

              {/* Permanent Address */}

              <div className="form-group">

                <label>Permanent Address</label>

                <textarea
                  ref={(el) => (inputRefs.current.permanentAddress = el)}
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Permanent Address"
                  className={errors.permanentAddress ? "error-input" : ""}
                />

                {errors.permanentAddress && (
                  <small className="error-text">
                    {errors.permanentAddress}
                  </small>
                )}

              </div>

            </div>

            <div className="grid-4">

              {/* City */}

              <div className="form-group">

                <label>City </label>

                <select
                  ref={(el) => (inputRefs.current.city = el)}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "error-input" : ""}
                >
                  <option value="">Select City</option>
                  <option>Mumbai</option>
                  <option>Pune</option>
                  <option>Nagpur</option>
                  <option>Nashik</option>
                  <option>Kolhapur</option>
                  <option>Satara</option>
                  <option>Sangli</option>
                </select>

                {errors.city && (
                  <small className="error-text">
                    {errors.city}
                  </small>
                )}

              </div>

              {/* State */}

              <div className="form-group">

                <label>State</label>

                <select
                  ref={(el) => (inputRefs.current.state = el)}
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? "error-input" : ""}
                >
                  <option value="">Select State</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Goa</option>
                  <option>Gujarat</option>
                  <option>Delhi</option>
                </select>

                {errors.state && (
                  <small className="error-text">
                    {errors.state}
                  </small>
                )}

              </div>
                            {/* PIN Code */}

              <div className="form-group">

                <label>PIN Code </label>

                <input
                  ref={(el) => (inputRefs.current.pinCode = el)}
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="PIN Code"
                  className={errors.pinCode ? "error-input" : ""}
                />

                {errors.pinCode && (
                  <small className="error-text">
                    {errors.pinCode}
                  </small>
                )}

              </div>

              {/* Country */}

              <div className="form-group">

                <label>Country</label>

                <select
                  ref={(el) => (inputRefs.current.country = el)}
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={errors.country ? "error-input" : ""}
                >
                  <option value="">Select Country</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>

                {errors.country && (
                  <small className="error-text">
                    {errors.country}
                  </small>
                )}

              </div>

            </div>

          </div>

          {/* ================= OTHER INFORMATION ================= */}

          <div className="other-info">

            <h1>Other Information</h1>

            <div className="grid-4">
                            {/* PAN Number */}

              <div className="form-group">

                <label>PAN Number</label>

                <input
                  ref={(el) => (inputRefs.current.panNumber = el)}
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="PAN Number"
                  className={errors.panNumber ? "error-input" : ""}
                />

                {errors.panNumber && (
                  <small className="error-text">
                    {errors.panNumber}
                  </small>
                )}

              </div>

              {/* Aadhaar Number */}

              <div className="form-group">

                <label>Aadhaar Number</label>

                <input
                  ref={(el) => (inputRefs.current.aadhaarNumber = el)}
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="Aadhaar Number"
                  className={errors.aadhaarNumber ? "error-input" : ""}
                />

                {errors.aadhaarNumber && (
                  <small className="error-text">
                    {errors.aadhaarNumber}
                  </small>
                )}

              </div>

              {/* APAR ID */}

              <div className="form-group">

                <label>APAR ID </label>

                <input
                  ref={(el) => (inputRefs.current.aparId = el)}
                  type="text"
                  name="aparId"
                  value={formData.aparId}
                  onChange={handleChange}
                  placeholder="APAR ID"
                  className={errors.aparId ? "error-input" : ""}
                />

                {errors.aparId && (
                  <small className="error-text">
                    {errors.aparId}
                  </small>
                )}

              </div>

              {/* Department */}

              <div className="form-group">

                <label>Department</label>

                <input
                  ref={(el) => (inputRefs.current.department = el)}
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className={errors.department ? "error-input" : ""}
                />

                {errors.department && (
                  <small className="error-text">
                    {errors.department}
                  </small>
                )}

              </div>
                            {/* Designation */}

              <div className="form-group">

                <label>Designation</label>

                <input
                  ref={(el) => (inputRefs.current.designation = el)}
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  className={errors.designation ? "error-input" : ""}
                />

                {errors.designation && (
                  <small className="error-text">
                    {errors.designation}
                  </small>
                )}

              </div>

              {/* Qualification */}

              <div className="form-group">

                <label>Qualification</label>

                <input
                  ref={(el) => (inputRefs.current.qualification = el)}
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Qualification"
                  className={errors.qualification ? "error-input" : ""}
                />

                {errors.qualification && (
                  <small className="error-text">
                    {errors.qualification}
                  </small>
                )}

              </div>

              {/* Specialization */}

              <div className="form-group">

                <label>Specialization</label>

                <input
                  ref={(el) => (inputRefs.current.specialization = el)}
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Specialization"
                  className={errors.specialization ? "error-input" : ""}
                />

                {errors.specialization && (
                  <small className="error-text">
                    {errors.specialization}
                  </small>
                )}

              </div>

              {/* Joining Date */}

              <div className="form-group">

                <label>Date of Joining</label>

                <input
                  ref={(el) => (inputRefs.current.joiningDate = el)}
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={errors.joiningDate ? "error-input" : ""}
                />

                {errors.joiningDate && (
                  <small className="error-text">
                    {errors.joiningDate}
                  </small>
                )}

              </div>
                            {/* Employee Type */}

              <div className="form-group">

                <label>Employee Type</label>

                <select
                  ref={(el) => (inputRefs.current.employeeType = el)}
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleChange}
                  className={errors.employeeType ? "error-input" : ""}
                >
                  <option value="">Select Employee Type</option>
                  <option>Permanent</option>
                  <option>Contract</option>
                  <option>Guest Faculty</option>
                </select>

                {errors.employeeType && (
                  <small className="error-text">
                    {errors.employeeType}
                  </small>
                )}

              </div>

              {/* Experience */}

              <div className="form-group">

                <label>Experience</label>

                <input
                  ref={(el) => (inputRefs.current.experience = el)}
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Experience"
                  className={errors.experience ? "error-input" : ""}
                />

                {errors.experience && (
                  <small className="error-text">
                    {errors.experience}
                  </small>
                )}

              </div>

              {/* Previous Experience */}

              <div className="form-group">

                <label>Previous Experience </label>

                <input
                  ref={(el) => (inputRefs.current.previousExperience = el)}
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  placeholder="Previous Experience"
                  className={errors.previousExperience ? "error-input" : ""}
                />

                {errors.previousExperience && (
                  <small className="error-text">
                    {errors.previousExperience}
                  </small>
                )}

              </div>

              {/* Email */}

              <div className="form-group">

                <label>Email ID </label>

                <input
                  ref={(el) => (inputRefs.current.email = el)}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email ID"
                  className={errors.email ? "error-input" : ""}
                />

                {errors.email && (
                  <small className="error-text">
                    {errors.email}
                  </small>
                )}

              </div>
                            {/* Mobile Number */}

              <div className="form-group">

                <label>Mobile Number </label>

                <input
                  ref={(el) => (inputRefs.current.mobile = el)}
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className={errors.mobile ? "error-input" : ""}
                />

                {errors.mobile && (
                  <small className="error-text">
                    {errors.mobile}
                  </small>
                )}

              </div>

              

            </div>

          </div>
                {/* ================= BUTTONS ================= */}

      <div className="buttons">

        <button
          type="button"
          className="save"
          onClick={handleSubmit}
        >
          Save
        </button>

        <button
          type="button"
          className="update"
          onClick={() => alert("Update Operation")}
        >
          Update
        </button>

        <button
          type="button"
          className="delete"
          onClick={() => alert("Delete Operation")}
        >
          Delete
        </button>

        <button
          type="button"
          className="clear"
          onClick={() => {

            setFormData({

              facultyId: "",
              facultyName: "",
              fatherName: "",
              dob: "",
              gender: "",
              maritalStatus: "",
              bloodGroup: "",
              nationality: "",
              religion: "",
              category: "",
              facultyStatus: "",

              currentAddress: "",
              permanentAddress: "",
              city: "",
              state: "",
              pinCode: "",
              country: "",

              panNumber: "",
              aadhaarNumber: "",
              aparId: "",

              department: "",
              designation: "",
              qualification: "",
              specialization: "",
              joiningDate: "",
              employeeType: "",
              experience: "",
              previousExperience: "",

              email: "",
              mobile: ""
          
              

            });

            localStorage.removeItem("facultyForm");

            setErrors({});

          }}
        >
          Clear
        </button>

        <button
          type="button"
          className="back-btn"
          onClick={handleBackToTop}
        >
          Back
        </button>

      </div>

    </div>

  </div>

</div>

  );

}

export default FacultyForm;