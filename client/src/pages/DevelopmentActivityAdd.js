import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DevelopmentActivityAdd.css";

function DevelopmentActivityAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [activityType, setActivityType] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [year, setYear] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleView = () => {

    if (!selectedFile) {
      alert("Choose file first");
      return;
    }

    window.open(URL.createObjectURL(selectedFile));

  };

  const handleDownload = () => {

    if (!selectedFile) {
      alert("Choose file first");
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    const a = document.createElement("a");

    a.href = url;
    a.download = selectedFile.name;
    a.click();

    URL.revokeObjectURL(url);

  };

  const handlePrint = () => {

    if (!selectedFile) {
      alert("Choose file first");
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    const w = window.open(url);

    if (w) {
      w.onload = () => w.print();
    }

  };

  const handleSave = async () => {

    if (!facultyName.trim()) {
      alert("Please enter Faculty Name.");
      return;
    }

    if (!activityType) {
      alert("Please select Activity Type.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter Title.");
      return;
    }

    if (!status) {
      alert("Please select Status.");
      return;
    }

    if (!year.trim()) {
      alert("Please enter Academic Year.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload Supporting Document.");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("faculty_name", facultyName);
      formData.append("activity_type", activityType);
      formData.append("title", title);
      formData.append("status", status);
      formData.append("academic_year", year);
      formData.append("document", selectedFile);

      const res = await axios.post(
        "http://localhost:5000/api/development-activities",
        formData
      );

      alert(res.data.message);

      navigate("/criteria6/development-activities/view");

    } catch (error) {

      console.log(error);

      alert(error.response?.data?.message || "Save Failed");

    }

  };
  return (

  <div className="resource-container">

    <h2>6.2.3 Development Activities</h2>

    <div className="resource-card">

      {/* Faculty Name */}

      <div className="form-group">

        <label>Faculty Name</label>

        <input
          type="text"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
        />

      </div>

      {/* Activity Type */}

      <div className="form-group">

        <label>Activity Type</label>

        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
        >

          <option value="">Select</option>
          <option>Patent</option>
          <option>Prototype</option>
          <option>Working Model</option>

        </select>

      </div>

      {/* Title */}

      <div className="form-group">

        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

      </div>

      {/* Status */}

      <div className="form-group">

        <label>Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >

          <option value="">Select</option>
          <option>Published</option>
          <option>Granted</option>
          <option>Completed</option>

        </select>

      </div>

      {/* Academic Year */}

      <div className="form-group">

        <label>Academic Year</label>

        <input
          type="text"
          placeholder="2025-26"
          value={year}
          onChange={(e) => setYear(e.target.value)}
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
            onChange={(e) => {
              if (e.target.files.length > 0) {
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
          onClick={() => navigate("/criteria6/research")}
        >
          ← Back
        </button>

      </div>

    </div>

  </div>

);

}

export default DevelopmentActivityAdd;