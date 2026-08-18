import React, { useState, useEffect } from "react";
import "./VisionMission.css";
import { MdDelete } from "react-icons/md";
import {
  FaUpload,
  FaEye
} from "react-icons/fa";
import { FaDownload, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
function VisionMission({ onNext }) {
  const navigate = useNavigate();
  const STORAGE_KEY = "criteria1_vision_mission";
const [loaded, setLoaded] = useState(false);
const [savedFileNames, setSavedFileNames] = useState({});
  const [visionFile, setVisionFile] = useState(null);
const [missionFile, setMissionFile] = useState(null);
const [peoFile1, setPeoFile1] = useState(null);
const [peoFile2, setPeoFile2] = useState(null);
const [peoFile3, setPeoFile3] = useState(null);
// ===================== 1.1.3 =====================

// ===================== Supporting Document Files =====================

// Left Side
const [minutesFile, setMinutesFile] = useState(null);
const [bosFile, setBosFile] = useState(null);
const [iqacFile, setIqacFile] = useState(null);
const [stakeholderFile, setStakeholderFile] = useState(null);

// Right Side
const [stakeholderFeedbackFile, setStakeholderFeedbackFile] = useState(null);
const [industryFile, setIndustryFile] = useState(null);
const [bosApprovalFile, setBosApprovalFile] = useState(null);
const [industryConsultationFile, setIndustryConsultationFile] = useState(null)
const [websiteFile,setWebsiteFile]=useState(null);
const [noticeBoardFile, setNoticeBoardFile] = useState(null);
const [studentHandbookFile, setStudentHandbookFile] = useState(null);
const [prospectusFile, setProspectusFile] = useState(null);
const [orientationFile, setOrientationFile] = useState(null);
const [communicationPlanFile, setCommunicationPlanFile] = useState(null);
const [meetingRecordFile, setMeetingRecordFile] = useState(null);
const [justificationFile, setJustificationFile] = useState(null);
const [fileName, setFileName] = useState("");
// 1.1.5 Mapping
const [peo1_m1, setPeo1_m1] = useState("");
const [peo1_m2, setPeo1_m2] = useState("");
const [peo1_m3, setPeo1_m3] = useState("");
const [peo1_m4, setPeo1_m4] = useState("");

const [peo2_m1, setPeo2_m1] = useState("");
const [peo2_m2, setPeo2_m2] = useState("");
const [peo2_m3, setPeo2_m3] = useState("");
const [peo2_m4, setPeo2_m4] = useState("");

const [peo3_m1, setPeo3_m1] = useState("");
const [peo3_m2, setPeo3_m2] = useState("");
const [peo3_m3, setPeo3_m3] = useState("");
const [peo3_m4, setPeo3_m4] = useState("");

const [justification, setJustification] = useState(
  `The correlation between PEOs and Mission statements is established based on the level of contribution towards achieving the mission through PEOs. The scale used is 3 (Strong), 2 (Moderate), 1 (Weak), and 0 (No Correlation).`
);

const [publicationProcess, setPublicationProcess] = useState(
  `Vision, Mission and PEOs are displayed on the Institute website, department notice boards, HoD chamber, student handbook, prospectus and course curriculum documents.`
);

const [disseminationProcess, setDisseminationProcess] = useState(
  `Vision, Mission and PEOs are disseminated through induction programs, stakeholder meetings, department website, alumni interactions and regular awareness activities.`
);
const [vision, setVision] = useState(
"To be a premier institute recognized for excellence in technical education, research and innovation for the betterment of society."
);
const [mission, setMission] = useState(
`• To provide quality education.
• To encourage research and innovation.
• To develop industry oriented skills.
• To contribute to society.`
);
const [peo1, setPeo1] = useState(
"Graduates will apply technical knowledge and skills in their profession."
);
const [peo2, setPeo2] = useState(
"Graduates will pursue higher studies and lifelong learning."
);
const [peo3, setPeo3] = useState(
"Graduates will demonstrate professional ethics, leadership and teamwork."
);
const [visionMissionProcess, setVisionMissionProcess] = useState(
`The Vision and Mission of the department are defined through consultations with internal stakeholders (faculty, students) and external stakeholders (industry experts, alumni) in Department Advisory Board meetings. The process is approved by BoS and reflected in the IQAC records.`
);
const [peoProcess, setPeoProcess] = useState(
`The PEOs are defined based on graduate attributes, feedback from stakeholders, industry requirements and benchmarking with leading institutions. The process is reviewed periodically and approved by BoS.`
);
// ================= RESTORE SAVED DATA =================

useEffect(() => {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {

    try {

      const data = JSON.parse(saved);
// ================= RESTORE TEXT DATA =================

if (data.vision && data.vision.trim() !== "") {
  setVision(data.vision);
}

if (data.mission && data.mission.trim() !== "") {
  setMission(data.mission);
}

if (data.peo1 && data.peo1.trim() !== "") {
  setPeo1(data.peo1);
}

if (data.peo2 && data.peo2.trim() !== "") {
  setPeo2(data.peo2);
}

if (data.peo3 && data.peo3.trim() !== "") {
  setPeo3(data.peo3);
}// ================= RESTORE DESCRIPTIONS =================

if (
  data.visionMissionProcess &&
  data.visionMissionProcess.trim() !== ""
) {
  setVisionMissionProcess(data.visionMissionProcess);
}

if (
  data.peoProcess &&
  data.peoProcess.trim() !== ""
) {
  setPeoProcess(data.peoProcess);
}

if (
  data.publicationProcess &&
  data.publicationProcess.trim() !== ""
) {
  setPublicationProcess(data.publicationProcess);
}

if (
  data.disseminationProcess &&
  data.disseminationProcess.trim() !== ""
) {
  setDisseminationProcess(data.disseminationProcess);
}

if (
  data.justification &&
  data.justification.trim() !== ""
) {
  setJustification(data.justification);
}
      // PEO Mapping
      setPeo1_m1(data.peo1_m1 ?? "");
      setPeo1_m2(data.peo1_m2 ?? "");
      setPeo1_m3(data.peo1_m3 ?? "");
      setPeo1_m4(data.peo1_m4 ?? "");

      setPeo2_m1(data.peo2_m1 ?? "");
      setPeo2_m2(data.peo2_m2 ?? "");
      setPeo2_m3(data.peo2_m3 ?? "");
      setPeo2_m4(data.peo2_m4 ?? "");

      setPeo3_m1(data.peo3_m1 ?? "");
      setPeo3_m2(data.peo3_m2 ?? "");
      setPeo3_m3(data.peo3_m3 ?? "");
      setPeo3_m4(data.peo3_m4 ?? "");

      // Uploaded file names
      if (data.files) {
        setSavedFileNames(data.files);
      }

    } catch (error) {

      console.log("Restore Error:", error);

    }

  }

  setLoaded(true);

}, []);
// ================= AUTO SAVE =================

useEffect(() => {

  if (!loaded) return;

  const data = {

    vision,
    mission,

    peo1,
    peo2,
    peo3,

    visionMissionProcess,
    peoProcess,

    publicationProcess,
    disseminationProcess,

    justification,

    // PEO Mapping
    peo1_m1,
    peo1_m2,
    peo1_m3,
    peo1_m4,

    peo2_m1,
    peo2_m2,
    peo2_m3,
    peo2_m4,

    peo3_m1,
    peo3_m2,
    peo3_m3,
    peo3_m4,

    // File names
    files: savedFileNames

  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}, [

  loaded,

  vision,
  mission,

  peo1,
  peo2,
  peo3,

  visionMissionProcess,
  peoProcess,

  publicationProcess,
  disseminationProcess,

  justification,

  peo1_m1,
  peo1_m2,
  peo1_m3,
  peo1_m4,

  peo2_m1,
  peo2_m2,
  peo2_m3,
  peo2_m4,

  peo3_m1,
  peo3_m2,
  peo3_m3,
  peo3_m4,

  savedFileNames

]);
// ================= SAVE FILE NAME =================

const saveFileName = (key, file) => {

  if (!file) return;

  setSavedFileNames((prev) => ({
    ...prev,
    [key]: file.name
  }));

};

const handleSave = async () => {
// ===================== Required Text Fields =====================
if (

  // ================= TEXT / PARENT DATA =================

  !vision.trim() ||
  !mission.trim() ||

  !peo1.trim() ||
  !peo2.trim() ||
  !peo3.trim() ||

  // ================= STATIC DESCRIPTIONS =================

  !visionMissionProcess.trim() ||
  !peoProcess.trim() ||

  !publicationProcess.trim() ||
  !disseminationProcess.trim() ||

  !justification.trim() ||

  // ================= PEO - MISSION MAPPING =================

  peo1_m1 === "" ||
  peo1_m2 === "" ||
  peo1_m3 === "" ||
  peo1_m4 === "" ||

  peo2_m1 === "" ||
  peo2_m2 === "" ||
  peo2_m3 === "" ||
  peo2_m4 === "" ||

  peo3_m1 === "" ||
  peo3_m2 === "" ||
  peo3_m3 === "" ||
  peo3_m4 === "" ||

  // ================= REQUIRED FILES =================
  // New File OR Previously Saved Filename

  (!visionFile && !savedFileNames.visionFile) ||

  (!missionFile && !savedFileNames.missionFile) ||

  (!peoFile1 && !savedFileNames.peoFile1) ||

  (!peoFile2 && !savedFileNames.peoFile2) ||

  (!peoFile3 && !savedFileNames.peoFile3) ||

  (!minutesFile && !savedFileNames.minutesFile) ||

  (!bosFile && !savedFileNames.bosFile) ||

  (!iqacFile && !savedFileNames.iqacFile) ||

  (!stakeholderFile && !savedFileNames.stakeholderFile) ||

  (!stakeholderFeedbackFile &&
    !savedFileNames.stakeholderFeedbackFile) ||

  (!industryConsultationFile &&
    !savedFileNames.industryConsultationFile) ||

  (!bosApprovalFile &&
    !savedFileNames.bosApprovalFile) ||

  (!websiteFile && !savedFileNames.websiteFile) ||

  (!noticeBoardFile &&
    !savedFileNames.noticeBoardFile) ||

  (!studentHandbookFile &&
    !savedFileNames.studentHandbookFile) ||

  (!prospectusFile &&
    !savedFileNames.prospectusFile) ||

  (!orientationFile &&
    !savedFileNames.orientationFile) ||

  (!communicationPlanFile &&
    !savedFileNames.communicationPlanFile) ||

  (!meetingRecordFile &&
    !savedFileNames.meetingRecordFile) ||

  (!justificationFile &&
    !savedFileNames.justificationFile)

) {

  alert("Please fill all required fields.");
  return;
}

  try {
    const formData = new FormData();

    formData.append("vision", vision);
    formData.append("mission", mission);
    formData.append("peo1", peo1);
    formData.append("peo2", peo2);
    formData.append("peo3", peo3);

    formData.append("visionFile", visionFile);
    formData.append("missionFile", missionFile);
    formData.append("peoFile1", peoFile1);
    formData.append("peoFile2", peoFile2);
    formData.append("peoFile3", peoFile3);
    formData.append("visionMissionProcess", visionMissionProcess);
formData.append("peoProcess", peoProcess);
formData.append("publicationProcess", publicationProcess);
formData.append("disseminationProcess", disseminationProcess);

formData.append("minutesFile", minutesFile);
formData.append("bosFile", bosFile);
formData.append("iqacFile", iqacFile);
formData.append("stakeholderFile", stakeholderFile);

formData.append("stakeholderFeedbackFile", stakeholderFeedbackFile);
formData.append("industryConsultationFile", industryConsultationFile);
formData.append("bosApprovalFile", bosApprovalFile);

formData.append("websiteFile", websiteFile);
formData.append("noticeBoardFile", noticeBoardFile);
formData.append("studentHandbookFile", studentHandbookFile);
formData.append("prospectusFile", prospectusFile);

formData.append("orientationFile", orientationFile);
formData.append("communicationPlanFile", communicationPlanFile);
formData.append("meetingRecordFile", meetingRecordFile);
// 1.1.5 Mapping
formData.append("peo1_m1", peo1_m1);
formData.append("peo1_m2", peo1_m2);
formData.append("peo1_m3", peo1_m3);
formData.append("peo1_m4", peo1_m4);

formData.append("peo2_m1", peo2_m1);
formData.append("peo2_m2", peo2_m2);
formData.append("peo2_m3", peo2_m3);
formData.append("peo2_m4", peo2_m4);

formData.append("peo3_m1", peo3_m1);
formData.append("peo3_m2", peo3_m2);
formData.append("peo3_m3", peo3_m3);
formData.append("peo3_m4", peo3_m4);

// Justification
formData.append("justification", justification);
formData.append("justificationFile", justificationFile);

    const response = await fetch("http://localhost:5000/save-vision", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(data.message);

  } catch (error) {
    console.log(error);
    alert("Save Error");
  }
};
const handleFileView = (fileName) => {

  if (!fileName) {
    alert("No file available");
    return;
  }

  window.open(
    `http://localhost:5000/view/${fileName}`,
    "_blank"
  );

};

const handleFileDownload = (fileName) => {

  if (!fileName) {
    alert("No file available");
    return;
  }

  window.open(
    `http://localhost:5000/download/${fileName}`,
    "_blank"
  );

};

const readFileContentHTML = async (row) => {

    let fileBlob = row.fileObject;

    if (!fileBlob && row.fileName) {

        const response = await fetch(
            `http://localhost:5000/uploads/${row.fileName}`
        );

        fileBlob = await response.blob();
    }

    if (!fileBlob) return "<p>No file found.</p>";

    const ext =
        row.fileName.split(".").pop().toLowerCase();

    if (ext === "docx") {

        const arrayBuffer =
            await fileBlob.arrayBuffer();

        const result =
            await mammoth.convertToHtml({
                arrayBuffer
            });

        return `
        <div class="word-parsed-content">
        ${result.value}
        </div>
        `;
    }

    if (["xlsx","xls","csv"].includes(ext)) {

        const arrayBuffer =
            await fileBlob.arrayBuffer();

        const workbook =
            XLSX.read(arrayBuffer,{
                type:"array"
            });

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        return `
        <div class="excel-parsed-content">
        ${XLSX.utils.sheet_to_html(sheet)}
        </div>
        `;
    }

    return "";
};
const handlePrint = async () => {

  try {

    const res = await fetch(
      "http://localhost:5000/print-vision-files"
    );

    const data = await res.json();

    const files = [
      { title: "Vision", fileName: data.vision_file },
      { title: "Mission", fileName: data.mission_file },
      { title: "PEO 1", fileName: data.peo_file1 },
      { title: "PEO 2", fileName: data.peo_file2 },
      { title: "PEO 3", fileName: data.peo_file3 },
      { title: "Minutes", fileName: data.minutes_file },
      { title: "BoS", fileName: data.bos_file },
      { title: "IQAC", fileName: data.iqac_file },
      { title: "Stakeholder", fileName: data.stakeholder_file },
      { title: "Stakeholder Feedback", fileName: data.stakeholder_feedback_file },
      { title: "Industry Consultation", fileName: data.industry_consultation_file },
      { title: "BoS Approval", fileName: data.bos_approval_file },
      { title: "Website", fileName: data.website_file },
      { title: "Notice Board", fileName: data.notice_board_file },
      { title: "Student Handbook", fileName: data.student_handbook_file },
      { title: "Prospectus", fileName: data.prospectus_file },
      { title: "Orientation", fileName: data.orientation_file },
      { title: "Communication Plan", fileName: data.communication_plan_file },
      { title: "Meeting Record", fileName: data.meeting_record_file },
      { title: "Justification", fileName: data.justification_file }
    ].filter(f => f.fileName);

    const printWindow = window.open("", "_blank");

    let html = `
      <html>
      <head>
      <title>Vision Mission Print</title>

      <style>

      body{
        font-family:Arial;
        padding:20px;
      }

      h2{
        text-align:center;
      }

      .doc{
        margin-bottom:40px;
        page-break-after:always;
      }

      iframe{
        width:100%;
        height:900px;
        border:none;
      }

      img{
        width:100%;
      }

      </style>

      </head>

      <body>

      <h2>Vision Mission Documents</h2>
    `;

    for (const file of files) {

      const ext =
        file.fileName.split(".").pop().toLowerCase();

      html += `<div class="doc">`;
      html += `<h3>${file.title}</h3>`;

      if (ext === "pdf") {

       html += `
<embed
src="http://localhost:5000/uploads/${file.fileName}"
type="application/pdf"
style="
width:100%;
height:1000px;
border:none;
display:block;
"
/>
`;
      }

      else if (
        ["jpg","jpeg","png","gif","webp"].includes(ext)
      ) {

        html += `
        <img
        src="http://localhost:5000/uploads/${file.fileName}">
        `;

      }

      else if (
        ["docx","xlsx","xls","csv"].includes(ext)
      ) {

        const preview =
          await readFileContentHTML({
            fileName:file.fileName
          });

        html += preview;

      }

      else {

        html += `
        <p>
        ${file.fileName}
        </p>
        `;

      }

      html += `</div>`;

    }

    html += `
      </body>
      </html>
    `;

    printWindow.document.write(html);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

    },1500);

  }

  catch(err){

    console.log(err);

    alert("Print Error");

  }

};

// ================= HANDLE CLEAR =================
// ================= HANDLE CLEAR =================

const handleClear = () => {

  const confirmClear = window.confirm(
    "Are you sure you want to clear uploaded files and mapping?"
  );

  if (!confirmClear) return;


  // =================================================
  // ❌ DO NOT CLEAR USER DATA
  // =================================================

  // setVision("");
  // setMission("");

  // setPeo1("");
  // setPeo2("");
  // setPeo3("");


  // =================================================
  // ❌ DO NOT CLEAR STATIC DESCRIPTIONS
  // =================================================

  // setVisionMissionProcess("");
  // setPeoProcess("");
  // setPublicationProcess("");
  // setDisseminationProcess("");
  // setJustification("");


  // =================================================
  // ✅ CLEAR MAPPING TABLE
  // =================================================

  setPeo1_m1("");
  setPeo1_m2("");
  setPeo1_m3("");
  setPeo1_m4("");

  setPeo2_m1("");
  setPeo2_m2("");
  setPeo2_m3("");
  setPeo2_m4("");

  setPeo3_m1("");
  setPeo3_m2("");
  setPeo3_m3("");
  setPeo3_m4("");


  // =================================================
  // ✅ CLEAR UPLOADED FILES FROM FRONTEND
  // =================================================

  setVisionFile(null);
  setMissionFile(null);

  setPeoFile1(null);
  setPeoFile2(null);
  setPeoFile3(null);

  setMinutesFile(null);
  setBosFile(null);
  setIqacFile(null);

  setStakeholderFile(null);
  setStakeholderFeedbackFile(null);
  setIndustryConsultationFile(null);
  setBosApprovalFile(null);

  setWebsiteFile(null);
  setNoticeBoardFile(null);
  setStudentHandbookFile(null);
  setProspectusFile(null);

  setOrientationFile(null);
  setCommunicationPlanFile(null);
  setMeetingRecordFile(null);

  setJustificationFile(null);


  // =================================================
  // ✅ CLEAR FILE INPUT ELEMENTS
  // =================================================

  document
    .querySelectorAll('input[type="file"]')
    .forEach((input) => {
      input.value = "";
    });


  // =================================================
  // ✅ CLEAR FILE NAMES FROM CURRENT FRONTEND
  // =================================================

  setSavedFileNames({});


  // =================================================
  // ❌ DO NOT DELETE LOCAL STORAGE
  // =================================================

  // localStorage.removeItem(STORAGE_KEY);


  // =================================================
  // ❌ DO NOT CALL BACKEND DELETE API
  // =================================================


  alert("Uploaded files and mapping cleared successfully.");
};
  return (
    <div className="vision-container">



      <h3>1.1 Vision, Mission </h3>
<div className="instruction-box">

  <h4>Instructions:</h4>

  <ul>
    <li>Provide the Institute Vision and Mission statements.</li>
    <li>Provide the Program Educational Objectives (PEOs).</li>
    <li>Upload supporting documents in PDF format.</li>
    <li>Provide documentary evidence for Vision, Mission and PEO mapping.</li>
  </ul>

</div>
<h3 className="main-section">
  1.1.1 State the Vision and Mission of the Institute and the Department
</h3>
      {/* Vision */}
    <h4 className="sub-heading">
A. Institute Vision
</h4>

      <table className="nba-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Particulars</th>
            <th>Description</th>
            <th>Attachment (PDF only)</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Institute Vision</td>
            <td>
              <textarea
  value={vision}
  onChange={(e) => setVision(e.target.value)}
/>
            </td>

           <td>

<div className="file-upload-row">
<label className="choose-file-btn">

  Choose File

  <input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file state
      setVisionFile(file);

      // Filename localStorage साठी
      saveFileName("visionFile", file);

    }

  }}
/>

</label>
{(visionFile || savedFileNames.visionFile) && (
  <div
    className="pdf-name"
    style={{
      color: "#040404",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    {visionFile?.name || savedFileNames.visionFile}
  </div>
)}
<div className="document-actions">

<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      visionFile?.name || savedFileNames.visionFile
    )
  }
>
  <FaEye />
</button>
 <button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      visionFile?.name || savedFileNames.visionFile
    )
  }
>
  <FaDownload />
</button>


</div>

</div>

</td>
          </tr>
        </tbody>
      </table>

      {/* Mission */}
      <h4 className="sub-heading">
B. Institute Mission
</h4>
      <table className="nba-table">
        <tbody>
          <tr>
            <td>1</td>
            <td>Institute Mission</td>

            <td>
             <textarea
  value={mission}
  onChange={(e) => setMission(e.target.value)}
/>
            </td>

            <td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setMissionFile(file);

      // Filename localStorage मध्ये
      saveFileName("missionFile", file);

    }

  }}
/>
</label>
{(missionFile || savedFileNames.missionFile) && (
  <div
    className="pdf-name"
    style={{
      color: "#0e100e",
      fontWeight: "600",
      fontSize: "13px"
    }}
  >
    {missionFile?.name || savedFileNames.missionFile}
  </div>
)}
<div className="document-actions">

  <button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      missionFile?.name || savedFileNames.missionFile
    )
  }
>
  <FaEye />
</button>

  <button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      missionFile?.name || savedFileNames.missionFile
    )
  }
>
  <FaDownload />
</button>


</div>

</div>

</td>
          </tr>
        </tbody>
      </table>

      {/* PEO */}
      <h3 className="main-section">
  1.1.2 State PEOs of the Program
</h3>

      <table className="nba-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>PEO No.</th>
            <th>Program Educational Objectives</th>
            <th>Attachment</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>PEO 1</td>
            <td>
             <input
  type="text"
  value={peo1}
onChange={(e) => setPeo1(e.target.value)}
/>
            </td>
          <td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setPeoFile1(file);

      // Filename localStorage मध्ये
      saveFileName("peoFile1", file);

    }

  }}
/>
</label>
{(peoFile1 || savedFileNames.peoFile1) && (
  <div className="pdf-name">
    {peoFile1?.name || savedFileNames.peoFile1}
  </div>
)}
<div className="document-actions">

  <button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      peoFile1?.name || savedFileNames.peoFile1
    )
  }
>
  <FaEye />
</button>

  <button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      peoFile1?.name || savedFileNames.peoFile1
    )
  }
>
  <FaDownload />
</button>

  

</div>

</div>

</td>
          </tr>

          <tr>
  <td>2</td>

  <td>PEO 2</td>

  <td>
    <input
      type="text"
      value={peo2}
onChange={(e) => setPeo2(e.target.value)}
    />
  </td>
<td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setPeoFile2(file);

      // Filename localStorage मध्ये
      saveFileName("peoFile2", file);

    }

  }}
/>
</label>
{(peoFile2 || savedFileNames.peoFile2) && (
  <div className="pdf-name">
    {peoFile2?.name || savedFileNames.peoFile2}
  </div>
)}
<div className="document-actions">

  <button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      peoFile2?.name || savedFileNames.peoFile2
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      peoFile2?.name || savedFileNames.peoFile2
    )
  }
>
  <FaDownload />
</button>

</div>

</div>

</td>
</tr>

          <tr>
            <td>3</td>
            <td>PEO 3</td>
           
             <td>
  <input
    type="text"
    value={peo3}
onChange={(e) => setPeo3(e.target.value)}
  />
</td>
<td>

<div className="file-upload-row">

<label className="choose-file-btn">

Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setPeoFile3(file);

      // Filename localStorage मध्ये
      saveFileName("peoFile3", file);

    }

  }}
/>
</label>
{(peoFile3 || savedFileNames.peoFile3) && (
  <div className="pdf-name">
    {peoFile3?.name || savedFileNames.peoFile3}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      peoFile3?.name || savedFileNames.peoFile3
    )
  }
>
  <FaEye />
</button>
  <button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      peoFile3?.name || savedFileNames.peoFile3
    )
  }
>
  <FaDownload />
</button>

</div>

</div>

</td>
          </tr>
        </tbody>
      </table>
{/* ===================== 1.1.3 ===================== */}

<h3 className="main-section">
  1.1.3 Process of Defining Vision, Mission and PEOs
</h3>
<div className="process-wrapper">

  {/* LEFT CARD */}

  <div className="process-card">

    <h4>
      A. Process of Defining Vision and Mission of the Department
    </h4>

    <label className="process-label">
      Description 
    </label>

    <textarea
      className="process-textarea"
      rows="6"
      value={visionMissionProcess}
      onChange={(e) =>
        setVisionMissionProcess(e.target.value)
      }
    />

    <h5 className="support-heading">
      Supporting Documents (PDF only)
    </h5>

    <table className="support-table">

      <tbody>

        <tr>
          <td>1</td>
          <td>Minutes of Meeting</td>
          <td>
           <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setMinutesFile(file);

      // Filename localStorage मध्ये
      saveFileName("minutesFile", file);

    }

  }}
/>
</label>
{(minutesFile || savedFileNames.minutesFile) && (
  <div className="pdf-name">
    {minutesFile?.name || savedFileNames.minutesFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      minutesFile?.name || savedFileNames.minutesFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      minutesFile?.name || savedFileNames.minutesFile
    )
  }
>
  <FaDownload />
</button>
</div>

          </td>
        </tr>

        <tr>
          <td>2</td>
          <td>BoS Approval</td>
          <td>
           <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setBosFile(file);

      // Filename localStorage मध्ये
      saveFileName("bosFile", file);

    }

  }}
/>
</label>
{(bosFile || savedFileNames.bosFile) && (
  <div className="pdf-name">
    {bosFile?.name || savedFileNames.bosFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      bosFile?.name || savedFileNames.bosFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      bosFile?.name || savedFileNames.bosFile
    )
  }
>
  <FaDownload />
</button>

</div>

          </td>
        </tr>

        <tr>
          <td>3</td>
          <td>IQAC Report</td>
          <td>
            <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setIqacFile(file);

      // Filename localStorage मध्ये
      saveFileName("iqacFile", file);

    }

  }}
/>
</label>
{(iqacFile || savedFileNames.iqacFile) && (
  <div className="pdf-name">
    {iqacFile?.name || savedFileNames.iqacFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      iqacFile?.name || savedFileNames.iqacFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      iqacFile?.name || savedFileNames.iqacFile
    )
  }
>
  <FaDownload />
</button>

</div>

          </td>
        </tr>

        <tr>
          <td>4</td>
          <td>Stakeholder Feedback</td>
          <td>
           <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setStakeholderFile(file);

      // Filename localStorage मध्ये
      saveFileName("stakeholderFile", file);

    }

  }}
/>
</label>
{(stakeholderFile || savedFileNames.stakeholderFile) && (
  <div className="pdf-name">
    {stakeholderFile?.name || savedFileNames.stakeholderFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      stakeholderFile?.name ||
      savedFileNames.stakeholderFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      stakeholderFile?.name ||
      savedFileNames.stakeholderFile
    )
  }
>
  <FaDownload />
</button>
</div>

          </td>
        </tr>

      </tbody>

    </table>

  </div>

  {/* RIGHT CARD */}

  <div className="process-card">

    <h4>
      B. Process of Defining PEOs of the Program
    </h4>

    <label className="process-label">
      Description 
    </label>

    <textarea
      className="process-textarea"
      rows="6"
      value={peoProcess}
      onChange={(e) =>
        setPeoProcess(e.target.value)
      }
    />

    <h5 className="support-heading">
      Supporting Documents (PDF only)
    </h5>

    <table className="support-table">

      <tbody>

        <tr>
          <td>1</td>
          <td>Stakeholder Feedback</td>
          <td>
          <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setStakeholderFeedbackFile(file);

      // Filename localStorage मध्ये
      saveFileName("stakeholderFeedbackFile", file);

    }

  }}
/>
</label>
{(
  stakeholderFeedbackFile ||
  savedFileNames.stakeholderFeedbackFile
) && (
  <div className="pdf-name">
    {stakeholderFeedbackFile?.name ||
      savedFileNames.stakeholderFeedbackFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      stakeholderFeedbackFile?.name ||
      savedFileNames.stakeholderFeedbackFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      stakeholderFeedbackFile?.name ||
      savedFileNames.stakeholderFeedbackFile
    )
  }
>
  <FaDownload />
</button>
</div>
      </td>
        </tr>

        <tr>
          <td>2</td>
          <td>Industry Consultation</td>
          <td>
           <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setIndustryConsultationFile(file);

      // Filename localStorage मध्ये
      saveFileName("industryConsultationFile", file);

    }

  }}
/>
</label>
{(
  industryConsultationFile ||
  savedFileNames.industryConsultationFile
) && (
  <div className="pdf-name">
    {industryConsultationFile?.name ||
      savedFileNames.industryConsultationFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      industryConsultationFile?.name ||
      savedFileNames.industryConsultationFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      industryConsultationFile?.name ||
      savedFileNames.industryConsultationFile
    )
  }
>
  <FaDownload />
</button>
</div>

          </td>
        </tr>

        <tr>
          <td>3</td>
          <td>BoS Approval</td>
          <td>
          <label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setBosApprovalFile(file);

      // Filename localStorage मध्ये
      saveFileName("bosApprovalFile", file);

    }

  }}
/>
</label>
{(
  bosApprovalFile ||
  savedFileNames.bosApprovalFile
) && (
  <div className="pdf-name">
    {bosApprovalFile?.name ||
      savedFileNames.bosApprovalFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      bosApprovalFile?.name ||
      savedFileNames.bosApprovalFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      bosApprovalFile?.name ||
      savedFileNames.bosApprovalFile
    )
  }
>
  <FaDownload />
</button>
</div>
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
      {/* ===================== 1.1.4 ===================== */}
<h3 className="main-section">
  1.1.4 Dissemination of Vision, Mission and PEOs
</h3>

<div className="process-wrapper">

  {/* LEFT CARD */}

  <div className="process-card">

    <h4>
      A. Adequacy in respect of publication & dissemination
    </h4>

    <label className="process-label">
      Description
    </label>

    <textarea
      className="process-textarea"
      rows="6"
      value={publicationProcess}
      onChange={(e)=>setPublicationProcess(e.target.value)}
    />

    <h5 className="support-heading">
      Supporting Documents (PDF only)
    </h5>

    <table className="support-table">

      <tbody>

        <tr>
          <td>1</td>
          <td>Website Screenshot</td>
         
            <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setWebsiteFile(file);

      // Filename localStorage मध्ये
      saveFileName("websiteFile", file);

    }

  }}
/>
</label>
{(websiteFile || savedFileNames.websiteFile) && (
  <div className="pdf-name">
    {websiteFile?.name || savedFileNames.websiteFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      websiteFile?.name ||
      savedFileNames.websiteFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      websiteFile?.name ||
      savedFileNames.websiteFile
    )
  }
>
  <FaDownload />
</button>

</div>





</div>


          </td>
        </tr>

        <tr>
          <td>2</td>
          <td>Notice Board</td>
         
           <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setNoticeBoardFile(file);

      // Filename localStorage मध्ये
      saveFileName("noticeBoardFile", file);

    }

  }}
/>
</label>
{(noticeBoardFile || savedFileNames.noticeBoardFile) && (
  <div className="pdf-name">
    {noticeBoardFile?.name || savedFileNames.noticeBoardFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      noticeBoardFile?.name ||
      savedFileNames.noticeBoardFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      noticeBoardFile?.name ||
      savedFileNames.noticeBoardFile
    )
  }
>
  <FaDownload />
</button>
</div>

</div>


          </td>
        </tr>

        <tr>
          <td>3</td>
          <td>Student Handbook</td>
          
            <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setStudentHandbookFile(file);

      // Filename localStorage मध्ये
      saveFileName("studentHandbookFile", file);

    }

  }}
/>
</label>
{(studentHandbookFile || savedFileNames.studentHandbookFile) && (
  <div className="pdf-name">
    {studentHandbookFile?.name || savedFileNames.studentHandbookFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      studentHandbookFile?.name ||
      savedFileNames.studentHandbookFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      studentHandbookFile?.name ||
      savedFileNames.studentHandbookFile
    )
  }
>
  <FaDownload />
</button>

</div>



</div>


          </td>
        </tr>

        <tr>
          <td>4</td>
          <td>Prospectus</td>
          <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setProspectusFile(file);

      // Filename localStorage मध्ये
      saveFileName("prospectusFile", file);

    }

  }}
/>
</label>
{(prospectusFile || savedFileNames.prospectusFile) && (
  <div className="pdf-name">
    {prospectusFile?.name || savedFileNames.prospectusFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      prospectusFile?.name ||
      savedFileNames.prospectusFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      prospectusFile?.name ||
      savedFileNames.prospectusFile
    )
  }
>
  <FaDownload />
</button>
</div>
</div>
</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* RIGHT CARD */}

  <div className="process-card">

    <h4>
      B. Process of dissemination among stakeholders
    </h4>

    <label className="process-label">
      Description 
    </label>

    <textarea
      className="process-textarea"
      rows="6"
      value={disseminationProcess}
      onChange={(e)=>setDisseminationProcess(e.target.value)}
    />

    <h5 className="support-heading">
      Supporting Documents (PDF only)
    </h5>

    <table className="support-table">

      <tbody>

        <tr>
          <td>1</td>
          <td>Orientation Program</td>
          <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setOrientationFile(file);

      // Filename localStorage मध्ये
      saveFileName("orientationFile", file);

    }

  }}
/>
</label>
{(orientationFile || savedFileNames.orientationFile) && (
  <div className="pdf-name">
    {orientationFile?.name || savedFileNames.orientationFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      orientationFile?.name ||
      savedFileNames.orientationFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      orientationFile?.name ||
      savedFileNames.orientationFile
    )
  }
>
  <FaDownload />
</button>

</div>



</div>

</td>
        </tr>

        <tr>
          <td>2</td>
          <td>Communication Plan</td>
          <td>
           

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setCommunicationPlanFile(file);

      // Filename localStorage मध्ये
      saveFileName("communicationPlanFile", file);

    }

  }}
/>
</label>
{(
  communicationPlanFile ||
  savedFileNames.communicationPlanFile
) && (
  <div className="pdf-name">
    {communicationPlanFile?.name ||
      savedFileNames.communicationPlanFile}
  </div>
)}
<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      communicationPlanFile?.name ||
      savedFileNames.communicationPlanFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      communicationPlanFile?.name ||
      savedFileNames.communicationPlanFile
    )
  }
>
  <FaDownload />
</button>

</div>


</div>



          </td>
        </tr>

        <tr>
          <td>3</td>
          <td>Meeting Records</td>
          
           <td>

<div className="file-upload-row">
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setMeetingRecordFile(file);

      // Filename localStorage मध्ये
      saveFileName("meetingRecordFile", file);

    }

  }}
/>
</label>
{(
  meetingRecordFile ||
  savedFileNames.meetingRecordFile
) && (
  <div className="pdf-name">
    {meetingRecordFile?.name ||
      savedFileNames.meetingRecordFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      meetingRecordFile?.name ||
      savedFileNames.meetingRecordFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      meetingRecordFile?.name ||
      savedFileNames.meetingRecordFile
    )
  }
>
  <FaDownload />
</button>
</div>

</div>

</td>
          
        </tr>

      </tbody>

    </table>

  </div>

</div>
{/* ====================== 1.1.5 ====================== */}
<h3 className="main-section">
  1.1.5 Mapping of PEOs with Mission
</h3>

<div className="mapping-wrapper">

  {/* Left Card */}

  <div className="mapping-card">

    <h4>A. PEO – Mission Mapping Matrix</h4>

    <table className="mapping-table">

      <thead>
        <tr>
          <th>PEO / Mission</th>
          <th>M1</th>
          <th>M2</th>
          <th>M3</th>
          <th>M4</th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td>PEO 1</td>
          <td><input type="number" min="0" max="3" value={peo1_m1} onChange={(e)=>setPeo1_m1(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo1_m2} onChange={(e)=>setPeo1_m2(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo1_m3} onChange={(e)=>setPeo1_m3(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo1_m4} onChange={(e)=>setPeo1_m4(e.target.value)} /></td>
        </tr>

        <tr>
          <td>PEO 2</td>
          <td><input type="number" min="0" max="3" value={peo2_m1} onChange={(e)=>setPeo2_m1(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo2_m2} onChange={(e)=>setPeo2_m2(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo2_m3} onChange={(e)=>setPeo2_m3(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo2_m4} onChange={(e)=>setPeo2_m4(e.target.value)} /></td>
        </tr>

        <tr>
          <td>PEO 3</td>
          <td><input type="number" min="0" max="3" value={peo3_m1} onChange={(e)=>setPeo3_m1(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo3_m2} onChange={(e)=>setPeo3_m2(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo3_m3} onChange={(e)=>setPeo3_m3(e.target.value)} /></td>
<td><input type="number" min="0" max="3" value={peo3_m4} onChange={(e)=>setPeo3_m4(e.target.value)} /></td>
        </tr>

      </tbody>

    </table>

    <div className="mapping-note">
      <b>Correlation:</b> 3 = Strong &nbsp; | &nbsp;
      2 = Moderate &nbsp; | &nbsp;
      1 = Weak &nbsp; | &nbsp;
      0 = No Correlation
    </div>

  </div>

  {/* Right Card */}

  <div className="mapping-card">

    <h4>B. Justification of Correlation Parameters</h4>

    <label>Description </label>

    <textarea
  rows="7"
  value={justification}
  onChange={(e) => setJustification(e.target.value)}
/>
    <h5>Supporting Documents (PDF only)</h5>

    <table className="support-table">

      <tbody>

        <tr>
          <td>1</td>
          <td>Justification Document</td>
          <td>

  <input
    type="file"
    id="justificationFile"
    className="custom-file-input"
    onChange={(e) => {
      if (e.target.files.length > 0) {
        setJustificationFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
      }
    }}
  />
<label className="choose-file-btn">
Choose File
<input
  type="file"
  hidden
  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (e.target.files.length > 0) {

      const file = e.target.files[0];

      // Actual file
      setJustificationFile(file);

      // Filename localStorage मध्ये
      saveFileName("justificationFile", file);

    }

  }}
/>
</label>
{(
  justificationFile ||
  savedFileNames.justificationFile
) && (
  <div className="pdf-name">
    {justificationFile?.name ||
      savedFileNames.justificationFile}
  </div>
)}

<div className="document-actions">
<button
  type="button"
  className="view-btn"
  onClick={() =>
    handleFileView(
      justificationFile?.name ||
      savedFileNames.justificationFile
    )
  }
>
  <FaEye />
</button>
<button
  type="button"
  className="download-btn"
  onClick={() =>
    handleFileDownload(
      justificationFile?.name ||
      savedFileNames.justificationFile
    )
  }
>
  <FaDownload />
</button>
</div>
</td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
<div className="mapping-note-box">
</div>
 <div className="btn-row">
  <button
    className="save-btn"
    onClick={handleSave}
  >
    Save
  </button>
  
<button
  type="button"
  className="clear-btn"
  onClick={handleClear}
>
  Clear
</button>
<button
  className="print-btn"
  onClick={handlePrint}
>
  Print
</button>

<Link to="/curriculum">
  <button className="next-page-btn">
    Next →
  </button>
</Link>
</div>

</div>
    
  );
}

export default VisionMission;