import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PhdStudentAdd.css";

function PhdStudentAdd() {

  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [scholarName, setScholarName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [researchTitle, setResearchTitle] = useState("");
  const [university, setUniversity] = useState("");
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

  if (!scholarName.trim()) {
    alert("Please enter Ph.D. Scholar Name.");
    return;
  }

  if (!enrollmentNo.trim()) {
    alert("Please enter Enrollment Number.");
    return;
  }

  if (!researchTitle.trim()) {
    alert("Please enter Research Title.");
    return;
  }

  if (!university.trim()) {
    alert("Please enter University.");
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
    formData.append("scholar_name", scholarName);
    formData.append("enrollment_no", enrollmentNo);
    formData.append("research_title", researchTitle);
    formData.append("university", university);
    formData.append("status", status);
    formData.append("academic_year", year);
    formData.append("document", selectedFile);

   const res = await axios.post(
  "http://localhost:5000/api/phd-students",
  formData
);

alert(res.data.message);
    navigate("/criteria6/phd-student/view");

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Save Failed");

  }

};
return (

<div className="resource-container">

<h2>6.2.2 Ph.D. Student Details</h2>

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

{/* Scholar Name */}

<div className="form-group">
<label>Ph.D. Scholar Name</label>

<input
type="text"
value={scholarName}
onChange={(e)=>setScholarName(e.target.value)}
/>

</div>

{/* Enrollment Number */}

<div className="form-group">
<label>Enrollment Number</label>

<input
type="text"
value={enrollmentNo}
onChange={(e)=>setEnrollmentNo(e.target.value)}
/>

</div>

{/* Research Title */}

<div className="form-group">
<label>Research Title</label>

<input
type="text"
value={researchTitle}
onChange={(e)=>setResearchTitle(e.target.value)}
/>

</div>

{/* University */}

<div className="form-group">
<label>University</label>

<input
type="text"
value={university}
onChange={(e)=>setUniversity(e.target.value)}
/>

</div>

{/* Status */}

<div className="form-group">

<label>Status</label>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
>

<option value="">Select</option>
<option>Enrolled</option>
<option>Submitted</option>
<option>Graduated</option>

</select>

</div>

{/* Academic Year */}

<div className="form-group">

<label>Academic Year</label>

<input
type="text"
placeholder="2025-26"
value={year}
onChange={(e)=>setYear(e.target.value)}
/>

</div>

{/* Document */}

<div className="form-group">

<label>Supporting Document</label>

<label className="choose-file-btn">

Choose File

<input
id="phdFile"
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
onClick={() => navigate("/criteria6/research")}
>
← Back
</button>

</div>

</div>

</div>

);
}

export default PhdStudentAdd;