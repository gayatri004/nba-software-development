import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SponsoredResearchAdd.css";

function SponsoredResearchAdd() {

  const navigate = useNavigate();

  const [projectTitle, setProjectTitle] = useState("");
  const [piName, setPiName] = useState("");
  const [coPiName, setCoPiName] = useState("");
  const [department, setDepartment] = useState("");
  const [fundingAgency, setFundingAgency] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [sanctionYear, setSanctionYear] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectStatus, setProjectStatus] = useState("");
const [academicYear, setAcademicYear] = useState("");
const [projectProgress, setProjectProgress] = useState("");
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

  if (!projectTitle.trim()) {
    alert("Please enter Project Title.");
    return;
  }

  if (!piName.trim()) {
    alert("Please enter Principal Investigator.");
    return;
  }

  if (!coPiName.trim()) {
    alert("Please enter Co-PI Name.");
    return;
  }

  if (!department.trim()) {
    alert("Please enter Department.");
    return;
  }

  if (!fundingAgency.trim()) {
    alert("Please enter Funding Agency.");
    return;
  }

  if (!amount.trim()) {
    alert("Please enter Sanction Amount.");
    return;
  }

  if (!duration.trim()) {
    alert("Please enter Duration.");
    return;
  }

  if (!sanctionYear.trim()) {
    alert("Please enter Sanction Year.");
    return;
  }

  if (!selectedFile) {
    alert("Please upload Supporting Document.");
    return;
  }
  if (!projectStatus) {
  alert("Please select Project Status.");
  return;
}

if (!academicYear.trim()) {
  alert("Please enter Academic Year.");
  return;
}

if (!projectProgress.trim()) {
  alert("Please enter Project Progress.");
  return;
}

  try {

    const formData = new FormData();

    formData.append("project_title", projectTitle);
    formData.append("pi_name", piName);
    formData.append("co_pi_name", coPiName);
    formData.append("department", department);
    formData.append("funding_agency", fundingAgency);
    formData.append("sanction_amount", amount);
    formData.append("duration", duration);
    formData.append("sanction_year", sanctionYear);
    formData.append("document", selectedFile);
formData.append("project_status", projectStatus);
formData.append("academic_year", academicYear);
formData.append("project_progress", projectProgress);
console.log("Project Status:", projectStatus);
console.log("Academic Year:", academicYear);
console.log("Project Progress:", projectProgress);

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    const res = await axios.post(
      "http://localhost:5000/api/sponsored-research",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/sponsored-research/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
  return (

    <div className="resource-container">

    <h2>6.2.4 Sponsored Research Project</h2>
      <div className="resource-card">

        <div className="form-group">
          <label>Project Title</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e)=>setProjectTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Principal Investigator (PI)</label>
          <input
            type="text"
            value={piName}
            onChange={(e)=>setPiName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Co-PI Name</label>
          <input
            type="text"
            value={coPiName}
            onChange={(e)=>setCoPiName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Funding Agency</label>
          <input
            type="text"
            value={fundingAgency}
            onChange={(e)=>setFundingAgency(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sanction Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>
<div className="form-group">
  <label>Project Status</label>

  <select
    value={projectStatus}
    onChange={(e) => setProjectStatus(e.target.value)}
  >
    <option value="">Select</option>
    <option>Ongoing</option>
    <option>Completed</option>
  </select>
</div>

<div className="form-group">
  <label>Academic Year</label>

  <input
    type="text"
    placeholder="2025-26"
    value={academicYear}
    onChange={(e) => setAcademicYear(e.target.value)}
  />
</div>

<div className="form-group">
  <label>Project Progress / Outcome</label>

  <textarea
    rows="3"
    value={projectProgress}
    onChange={(e) => setProjectProgress(e.target.value)}
  />
</div>
        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            placeholder="2 Years"
            value={duration}
            onChange={(e)=>setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Sanction Year</label>
          <input
            type="text"
            value={sanctionYear}
            onChange={(e)=>setSanctionYear(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

           <input
  id="sponsoredResearchFile"
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
            onClick={() => navigate("/criteria6/research")}
          >
            ← Back
          </button>

         

        </div>

      </div>

    </div>

  );

}

export default SponsoredResearchAdd;