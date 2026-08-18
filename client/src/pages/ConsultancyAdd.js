import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConsultancyAdd.css";

function ConsultancyAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [consultancyTitle, setConsultancyTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
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
    printWindow.onload = () => printWindow.print();
  }

};
const handleSave = async () => {

  if (!facultyName.trim()) {
    alert("Please enter Faculty Name.");
    return;
  }

  if (!consultancyTitle.trim()) {
    alert("Please enter Consultancy Title.");
    return;
  }

  if (!clientName.trim()) {
    alert("Please enter Client / Organization.");
    return;
  }

  if (!amount) {
    alert("Please enter Amount.");
    return;
  }

  if (!duration.trim()) {
    alert("Please enter Duration.");
    return;
  }

  if (!selectedFile) {
    alert("Please upload Supporting Document.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("faculty_name", facultyName);
    formData.append("consultancy_title", consultancyTitle);
    formData.append("client_name", clientName);
    formData.append("amount", amount);
    formData.append("duration", duration);
    formData.append("document", selectedFile);

    const res = await axios.post(
      "http://localhost:5000/api/consultancy-work",
      formData
    );

    alert(res.data.message);

    navigate("/criteria6/consultancy/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
  return (

    <div className="resource-container">

      <h2>6.2.5 Consultancy Work</h2>

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
          <label>Consultancy Title</label>
          <input
            type="text"
            value={consultancyTitle}
            onChange={(e)=>setConsultancyTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Client / Organization</label>
          <input
            type="text"
            value={clientName}
            onChange={(e)=>setClientName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e)=>setDuration(e.target.value)}
          />
        </div>

        <div className="form-group">

          <label>Supporting Document</label>

          <label className="choose-file-btn">

            Choose File

           <input
  id="consultancyFile"
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

export default ConsultancyAdd;