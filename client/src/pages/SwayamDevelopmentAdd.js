import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SwayamDevelopmentAdd.css";

function SwayamDevelopmentAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [contributionType, setContributionType] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [role, setRole] = useState("");
  const [developmentDate, setDevelopmentDate] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const handleView = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  window.open(url, "_blank");

};

const handleDownload = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  const link = document.createElement("a");

  link.href = url;
  link.download = selectedFile.name;
  link.click();

  URL.revokeObjectURL(url);

};

const handlePrint = () => {

  if (!selectedFile) {
    alert("Please choose a file first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  const printWindow = window.open(url);

  if (printWindow) {

    printWindow.onload = () => {

      printWindow.print();

    };

  }

};
const handleSave = async () => {

  if (
    !facultyName ||
    !contributionType ||
    !courseTitle ||
    !platform ||
    !role ||
    !developmentDate ||
    !academicYear
  ) {
    alert("Please fill all required fields.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("contribution_type", contributionType);
    formData.append("course_title", courseTitle);
    formData.append("platform", platform);
    formData.append("role", role);
    formData.append("development_date", developmentDate);
    formData.append("academic_year", academicYear);

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    const res = await axios.post(
      "http://localhost:5000/api/swayam-development",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/swayam-development/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
return (

<div className="resource-container">

  <h2>6.1.3 Faculty Contribution in Development of SWAYAM MOOCs and other E-Content</h2>

  <div className="resource-card">

    {/* Faculty Name */}

    <div className="form-group">

      <label>Faculty Name</label>

      <input
        type="text"
        value={facultyName}
        onChange={(e)=>setFacultyName(e.target.value)}
      />

    </div>

    {/* Contribution Type */}

    <div className="form-group">

      <label>Contribution Type</label>

      <select
        value={contributionType}
        onChange={(e)=>setContributionType(e.target.value)}
      >

        <option value="">Select</option>
        <option>SWAYAM MOOC</option>
        <option>E-Content</option>

      </select>

    </div>

    {/* Course Title */}

    <div className="form-group">

      <label>Course / Content Title</label>

      <input
        type="text"
        value={courseTitle}
        onChange={(e)=>setCourseTitle(e.target.value)}
      />

    </div>

    {/* Platform */}

    <div className="form-group">

      <label>Platform</label>

      <select
        value={platform}
        onChange={(e)=>setPlatform(e.target.value)}
      >

        <option value="">Select</option>
        <option>SWAYAM</option>
        <option>NPTEL</option>
        <option>College LMS</option>
        <option>YouTube</option>
        <option>Other</option>

      </select>

    </div>

    {/* Role */}

    <div className="form-group">

      <label>Role</label>

      <select
        value={role}
        onChange={(e)=>setRole(e.target.value)}
      >

        <option value="">Select</option>
        <option>Content Developer</option>
        <option>Video Creator</option>
        <option>Course Coordinator</option>
        <option>Module Writer</option>

      </select>

    </div>

    {/* Development Date */}

    <div className="form-group">

      <label>Development Date</label>

      <input
        type="date"
        value={developmentDate}
        onChange={(e)=>setDevelopmentDate(e.target.value)}
      />

    </div>

    {/* Academic Year */}

    <div className="form-group">

      <label>Academic Year</label>

      <input
        type="text"
        placeholder="2025-26"
        value={academicYear}
        onChange={(e)=>setAcademicYear(e.target.value)}
      />

    </div>

    {/* Supporting Document */}

    <div className="form-group">

      <label>Supporting Document</label>

      <label className="choose-file-btn">

        Choose File

        <input
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={(e)=>{
            if(e.target.files.length>0){
              setSelectedFile(e.target.files[0]);
            }
          }}
        />

      </label>

      {selectedFile && <p>{selectedFile.name}</p>}

      <div className="document-actions">

        <button
          className="view-btn"
          onClick={handleView}
        >
          👁 View
        </button>

        <button
          className="download-btn-upload"
          onClick={handleDownload}
        >
          Download
        </button>

        <button
          className="print-btn-upload"
          onClick={handlePrint}
        >
          Print
        </button>

        <button
          className="save-btn"
          onClick={handleSave}
        >
          Save
        </button>

      </div>

    </div>

    <div className="bottom-buttons">

      <button
        className="back-btn"
        onClick={() =>
          navigate("/criteria6/faculty-development")
        }
      >
        ← Back
      </button>

    </div>

  </div>

</div>

);

}

export default SwayamDevelopmentAdd;