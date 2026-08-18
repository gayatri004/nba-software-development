import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MoocsAdd.css";

function MoocsAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [platform, setPlatform] = useState("");
  const [duration, setDuration] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
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

  const link = window.document.createElement("a");
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
    !courseName ||
    !platform ||
    !duration ||
    !completionDate ||
    !certificateNo
  ) {
    alert("Please fill all required fields.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("course_name", courseName);
    formData.append("platform", platform);
    formData.append("duration", duration);
    formData.append("completion_date", completionDate);
    formData.append("certificate_number", certificateNo);

    if (selectedFile) {
      formData.append("document", selectedFile);
    }

    const res = await axios.post(
      "http://localhost:5000/api/moocs",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/moocs/view");

  } catch (error) {

    console.log(error);

    alert("Save Failed");

  }

};
  return (

    <div className="resource-container">

      <h2>6.1.4 Faculty Certification of MOOCs through SWAYAM / NPTEL</h2>

      <div className="resource-card">

        <div className="form-group">
          <label>Faculty Name</label>
          <input
            type="text"
            value={facultyName}
            onChange={(e)=>setFacultyName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e)=>setCourseName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Platform</label>
          <select
            value={platform}
            onChange={(e)=>setPlatform(e.target.value)}
          >
            <option value="">Select Platform</option>
            <option>SWAYAM</option>
            <option>NPTEL</option>
            <option>Coursera</option>
            <option>Udemy</option>
            <option>edX</option>
          </select>
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            placeholder="8 Weeks"
            value={duration}
            onChange={(e)=>setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Completion Date</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e)=>setCompletionDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Certificate Number</label>
          <input
            type="text"
            value={certificateNo}
            onChange={(e)=>setCertificateNo(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

            <input
  id="participationFile"
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

export default MoocsAdd;