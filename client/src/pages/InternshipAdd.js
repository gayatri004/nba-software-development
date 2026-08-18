import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InternshipAdd.css";

function InternshipAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
 const [selectedFile, setSelectedFile] = useState(null);
const handleView = () => {

  if (!selectedFile) {
    alert("Please choose a document first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);
  window.open(url, "_blank");

};
const handleDownload = () => {

  if (!selectedFile) {
    alert("Please choose a document first.");
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
    alert("Please choose a document first.");
    return;
  }

  const url = URL.createObjectURL(selectedFile);

  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }

};
const handleSave = async () => {

  if (!facultyName.trim()) {
    alert("Please enter Faculty Name.");
    return;
  }

  if (!companyName.trim()) {
    alert("Please enter Company / Industry Name.");
    return;
  }

  if (!trainingType) {
    alert("Please select Internship / Training Type.");
    return;
  }

  if (!fromDate) {
    alert("Please select From Date.");
    return;
  }

  if (!toDate) {
    alert("Please select To Date.");
    return;
  }

  if (!selectedFile) {
    alert("Please upload Supporting Document.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("company_name", companyName);
    formData.append("training_type", trainingType);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("document", selectedFile);

    const res = await axios.post(
      "http://localhost:5000/api/internships",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/internship/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
  return (

    <div className="resource-container">

      <h2>
6.1.7 Faculty Internship / Training / Collaboration with Industry
</h2>

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
          <label>Company / Industry Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e)=>setCompanyName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Internship / Training Type</label>

          <select
            value={trainingType}
            onChange={(e)=>setTrainingType(e.target.value)}
          >
            <option value="">Select</option>
            <option>Internship</option>
            <option>Training</option>
            <option>Industry Collaboration</option>
          </select>

        </div>

        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e)=>setFromDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e)=>setToDate(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

            <input
  id="fdpFile"
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

            <div className="document-actions">

<button
type="button"
className="view-btn"
onClick={handleView}
>
👁 View
</button>

<button
type="button"
className="download-btn-upload"
onClick={handleDownload}
>
Download
</button>

<button
type="button"
className="print-btn-upload"
onClick={handlePrint}
>
Print
</button>
<button
type="button"
className="save-btn"
onClick={handleSave}
>
Save
</button>
</div>


          </div>

        </div>

        <div className="bottom-buttons">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/criteria6/faculty-activities")
            }
          >
            ← Back
          </button>

          
        </div>

      </div>

    </div>

  );

}

export default InternshipAdd;