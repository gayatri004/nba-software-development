import React,
{
  useState,
  useEffect
}
from "react";
import "./CourseMatrix.css";
import {
  FaSave,
  FaEye,
  FaDownload,
  FaPrint,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
function CourseMatrix({ onNext, onPrevious }) {
  const navigate = useNavigate();
  const [coFile, setCoFile] = useState(null);
const [matrixFile, setMatrixFile] = useState(null);
const [summaryFile, setSummaryFile] = useState("");
// ================= AUTO SAVE =================

const STORAGE_KEY = "course_matrix_1_4_data";

const [savedFileNames, setSavedFileNames] = useState({});
const [displayFileNames, setDisplayFileNames] = useState({});
const [loaded, setLoaded] = useState(false);
const [academicYear, setAcademicYear] = useState("");
const [department, setDepartment] = useState("");
const [program, setProgram] = useState("");

const [uploadedOutcomeFile, setUploadedOutcomeFile] = useState("");
const [uploadedMatrixFile, setUploadedMatrixFile] = useState("");
const [mappedPO, setMappedPO] = useState("");

const [po1, setPo1] = useState("");
const [po2, setPo2] = useState("");
const [po3, setPo3] = useState("");
const [po4, setPo4] = useState("");
const [po5, setPo5] = useState("");
const [matrixData, setMatrixData] = useState({
  CO1: { po1: "", po2: "", po3: "", po4: "", po5: "" },
  CO2: { po1: "", po2: "", po3: "", po4: "", po5: "" },
  CO3: { po1: "", po2: "", po3: "", po4: "", po5: "" }
});
const [editId, setEditId] = useState(null);
const [subjects, setSubjects] = useState([]);
const [pos, setPos] = useState([]);
const [selectedSubject, setSelectedSubject] = useState("");
const [matrixRows, setMatrixRows] = useState([]);
const [courseMatrix,setCourseMatrix]=useState([]);
const [coSubject, setCoSubject] = useState("");
const [matrixSubject, setMatrixSubject] = useState("");
const [courseOutcome, setCourseOutcome] = useState("");
const [courseSummary, setCourseSummary] = useState([]);
const [courseOutcomes, setCourseOutcomes] = useState([]);
const saveFileName = (key, file) => {

  if (!file) return;

  setSavedFileNames((prev) => ({
    ...prev,
    [key]: file.name
  }));

};
// ================= RESTORE 1.4 DATA =================

useEffect(() => {

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {

    try {

      const data = JSON.parse(saved);

      // ================= USER DATA =================

      setAcademicYear(data.academicYear ?? "");
      setDepartment(data.department ?? "");
      setProgram(data.program ?? "");

      setMappedPO(data.mappedPO ?? "");
      setCourseOutcome(data.courseOutcome ?? "");

      setSelectedSubject(data.selectedSubject ?? "");

      // ================= MATRIX DATA =================

      if (data.matrixData) {
        setMatrixData(data.matrixData);
      }

      // ================= FILE NAMES =================

      if (data.files) {
        setSavedFileNames(data.files);
        setDisplayFileNames(data.files);
      }

    } catch (error) {

      console.log(
        "Course Matrix Restore Error:",
        error
      );

    }
  }

  setLoaded(true);

}, []);
// ================= AUTO SAVE 1.4 =================

useEffect(() => {

  if (!loaded) return;

  const data = {

    academicYear,
    department,
    program,

    mappedPO,
    courseOutcome,

    selectedSubject,

    matrixData,

    files: savedFileNames

  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

}, [
  loaded,

  academicYear,
  department,
  program,

  mappedPO,
  courseOutcome,

  selectedSubject,

  matrixData,

  savedFileNames
]);
const loadCourseMatrix = async () => {

  if (!selectedSubject) {
    setCourseMatrix([]);
    return;
  }
const res = await fetch(
  `http://localhost:5000/get-subject-matrix/${selectedSubject}`
);
  const data = await res.json();

  setCourseMatrix(data);

  if (data.length > 0) {
    setUploadedMatrixFile(
      data[data.length - 1].matrix_file || ""
    );
  }

};

const loadCourseOutcomes = async () => {

  if (!selectedSubject) {
    setCourseOutcomes([]);
    return;
  }

  const res = await fetch(
    `http://localhost:5000/get-subject-co/${selectedSubject}`
  );

  const data = await res.json();

  setCourseOutcomes(data);

  if (data.length > 0) {
    setUploadedOutcomeFile(data[data.length - 1].outcome_file || "");
  }

};


// Page Load
// Page Load
useEffect(() => {

  loadPOs();

}, []);

// Department Change
useEffect(() => {

  loadSubjects();

}, [department]);

useEffect(() => {

  if (selectedSubject) {

    loadCourseOutcomes();
    loadCourseMatrix();
    loadMatrixRows();

  }

}, [selectedSubject]);

const loadCourseSummary = async()=>{

const res=await fetch(
"http://localhost:5000/get-course-summary"
);

const data=await res.json();

setCourseSummary(data);

}


const loadSubjects = async () => {

  if (!department) return;

  const res = await fetch(
    `http://localhost:5000/get-subjects/${department}`
  );

  const data = await res.json();

  setSubjects(data);

};
const loadPOs = async () => {

  const res = await fetch(
    "http://localhost:5000/get-pos"
  );

  const data = await res.json();

  setPos(data);

};
const loadMatrixRows = async () => {

  if (!selectedSubject) return;

  const res = await fetch(
    `http://localhost:5000/get-subject-co/${selectedSubject}`
  );

  const data = await res.json();

  setMatrixRows(data);

};
const handleAddCO = async () => {

  if (!selectedSubject) {
    alert("Please select Subject.");
    return;
  }

  if (!courseOutcome) {
    alert("Please enter Course Outcome.");
    return;
  }

  try {

    let url = "http://localhost:5000/save-course-outcome";
    let method = "POST";

    if (editId) {
      url = `http://localhost:5000/update-course-outcome/${editId}`;
      method = "PUT";
    }

    const formData = new FormData();

    formData.append("academicYear", academicYear);
    formData.append("department", department);
    formData.append("subjectCode", selectedSubject);
    formData.append("courseOutcome", courseOutcome);
    formData.append("mappedPO", mappedPO);

    if (!coFile) {
  alert("Please select Outcome File");
  return;
}

formData.append("outcomeFile", coFile);

console.log("coFile =", coFile);

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

    const response = await fetch(url, {
      method,
      body: formData
    });

    const data = await response.json();

console.log("Backend Response =", data);

setUploadedOutcomeFile(data.fileName);

console.log("State File =", data.fileName);

alert(data.message);
    await loadCourseOutcomes();

  } catch (error) {

    console.log(error);
    alert("Save Error");

  }
  setCoFile(null);
document.getElementById("outcomeFile").value = "";
};
const handleSave = async () => {

  try {
    const formData = new FormData();

formData.append("academicYear", academicYear);
formData.append("department", department);
formData.append("program", program);
formData.append("courseOutcome", courseOutcome);
formData.append("mappedPO", mappedPO);
formData.append("subjectCode", selectedSubject);

if (matrixFile) {
  formData.append("matrixFile", matrixFile);
}

const response = await fetch(
  "http://localhost:5000/save-course-matrix",
  {
    method: "POST",
    body: formData
  }
);


    const data = await response.json();
    console.log("Uploaded File =", data.fileName);

    alert(data.message);

    await loadCourseOutcomes();
    await loadCourseMatrix();
    //await loadCourseSummary();

  } catch (error) {

    console.log(error);
    alert("Save Error");

  }

};
const courses = {

  "MCA": [
    { code: "MCA101", name: "Programming in C" },
    { code: "MCA102", name: "Data Structures" }
  ],

  "BCA": [
    { code: "BCA101", name: "Computer Fundamentals" },
    { code: "BCA102", name: "Web Technology" }
  ],

  "BBA": [
    { code: "BBA101", name: "Principles of Management" },
    { code: "BBA102", name: "Business Communication" }
  ],

  "Computer Science & Engineering": [
    { code: "CS201", name: "Data Structures" },
    { code: "CS202", name: "DBMS" }
  ]

};
  
const handleSubmit = () => {

  if (
    !academicYear ||
    !department
  ) {

    alert("Please fill all required fields.");
    return;

  }

  alert("Submitted Successfully");

};

const handleEdit = (row) => {

  setEditId(row.id);

  setCourseOutcome(row.course_outcome);

  setMappedPO(row.mapped_po);

};
const handleDelete = async (id) => {

  if (!window.confirm("Delete this record?")) return;

  try {

    const response = await fetch(
      `http://localhost:5000/delete-course-outcome/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    alert(data.message);

    await loadCourseOutcomes();

  } catch (error) {

    console.log(error);

    alert("Delete Error");

  }

};
const handleMatrixChange = (co, po, value) => {
  setMatrixData((prev) => ({
    ...prev,
    [co]: {
      ...prev[co],
      [po]: value
    }
  }));
};
const handleMatrixSave = async (coId) => {

  const row = document.getElementById(coId);
  const inputs = row.querySelectorAll("input");

  const formData = new FormData();

  formData.append("academicYear", academicYear);
  formData.append("department", department);
  formData.append("subjectCode", selectedSubject);
  formData.append("coId", coId);

  formData.append("po1", inputs[0].value);
  formData.append("po2", inputs[1].value);
  formData.append("po3", inputs[2].value);
  formData.append("po4", inputs[3].value);
  formData.append("po5", inputs[4].value);
console.log("matrixFile =", matrixFile);
  // File compulsory
  if (!matrixFile) {
    alert("Please select Matrix File");
    return;
  }

  formData.append("matrixFile", matrixFile);

  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await fetch(
    "http://localhost:5000/save-course-matrix",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

console.log("Backend Response =", data);

setUploadedMatrixFile(data.fileName);

console.log("Matrix File =", data.fileName);

alert(data.message);
};
const handleDownload = () => {

  window.open(
    "http://localhost:5000/download-course-matrix",
    "_blank"
  );

};

const readFileContentHTML = async (fileName) => {

  const ext = fileName.split(".").pop().toLowerCase();

  // PDF
  if (ext === "pdf") {

    return `
      <embed
        src="http://localhost:5000/uploads/${fileName}"
        type="application/pdf"
        style="width:100%;height:900px;"
      />
    `;

  }

  // Image
  if (["jpg","jpeg","png","gif","webp"].includes(ext)) {

    return `
      <img
        src="http://localhost:5000/uploads/${fileName}"
        style="width:100%;"
      />
    `;

  }

  // DOCX
  if (ext === "docx") {

    const response = await fetch(
      `http://localhost:5000/uploads/${fileName}`
    );

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const result = await mammoth.convertToHtml({
      arrayBuffer
    });

    return `
      <div class="word-parsed-content">
        ${result.value}
      </div>
    `;

  }

  // Excel
  if (["xlsx","xls","csv"].includes(ext)) {

    const response = await fetch(
      `http://localhost:5000/uploads/${fileName}`
    );

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, {
      type: "array"
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

  return `
    <p>Preview not available.</p>
  `;

};
const handlePrint = async () => {

  try {

    const res = await fetch(
  `http://localhost:5000/print-course-files/${selectedSubject}`
);

    const data = await res.json();

    const documents = [

      {
        title: "1.4.1 Course Outcomes",
        file: data.outcome_file
      },

      {
        title: "1.4.2 Course Articulation Matrix",
        file: data.matrix_file
      }

    ].filter(item => item.file);

    let html = "";

    for (const doc of documents) {

      const preview =
        await readFileContentHTML(doc.file);

      html += `

      <div class="doc-section">

        <h2>${doc.title}</h2>

        ${preview}

        <hr/>

      </div>

      `;

    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`

    <html>

    <head>

    <title>Course Outcomes & Matrix</title>

    <style>

    body{
      font-family:Arial;
      margin:20px;
    }

    h1{
      text-align:center;
      color:#0b4ea2;
    }

    h2{
      margin-top:35px;
      color:#0b4ea2;
      border-bottom:1px solid #ddd;
      padding-bottom:8px;
    }

    embed{
      width:100%;
      height:900px;
    }

    img{
      width:100%;
    }

    table{
      width:100%;
      border-collapse:collapse;
    }

    td,th{
      border:1px solid #ddd;
      padding:8px;
    }

    </style>

    </head>

    <body>

    <h1>1.4 Course Outcomes & Matrix</h1>

    ${html}

    </body>

    </html>

    `);

    printWindow.document.close();

    setTimeout(() => {

      printWindow.focus();

      printWindow.print();

    },1000);

  }

  catch(err){

    console.log(err);

    alert("Print Error");

  }

};
const handleMatrixView = () => {

  const fileName =
    matrixFile?.name ||
    displayFileNames.matrixFile ||
    uploadedMatrixFile;

  if (!fileName) {
    alert("Please upload Matrix file first.");
    return;
  }

  window.open(
    `http://localhost:5000/uploads/${fileName}`,
    "_blank"
  );
};
const handleMatrixDownload = () => {

  const fileName =
    matrixFile?.name ||
    displayFileNames.matrixFile ||
    uploadedMatrixFile;

  if (!fileName) {
    alert("Please upload Matrix file first.");
    return;
  }

  window.open(
    `http://localhost:5000/download/${fileName}`,
    "_blank"
  );
};
const handleOutcomeView = () => {

  const fileName =
    coFile?.name ||
    displayFileNames.coFile ||
    uploadedOutcomeFile;

  if (!fileName) {
    alert("No Outcome file found.");
    return;
  }

  window.open(
    `http://localhost:5000/uploads/${fileName}`,
    "_blank"
  );
};
const handleOutcomeDownload = () => {

  const fileName =
    coFile?.name ||
    displayFileNames.coFile ||
    uploadedOutcomeFile;

  if (!fileName) {
    alert("Please upload file first.");
    return;
  }

  window.open(
    `http://localhost:5000/download/${fileName}`,
    "_blank"
  );
};
const handlePrevious = () => {
  navigate("/po-pso");
};
// ================= HANDLE CLEAR =================
const handleClear = () => {

  const confirmClear = window.confirm(
    "Are you sure you want to clear the form?"
  );

  if (!confirmClear) return;

  // Clear selected/user-entered data
  setAcademicYear("");
  setDepartment("");
  setProgram("");

  setMappedPO("");
  setSelectedSubject("");
  setCourseOutcome("");

  // Clear uploaded files from frontend
  setCoFile(null);
  setMatrixFile(null);

  // Clear displayed file names
  setDisplayFileNames({});

  // Clear matrix
  setMatrixData({
    CO1: { po1: "", po2: "", po3: "", po4: "", po5: "" },
    CO2: { po1: "", po2: "", po3: "", po4: "", po5: "" },
    CO3: { po1: "", po2: "", po3: "", po4: "", po5: "" }
  });

  // Clear file inputs
  document
    .querySelectorAll('input[type="file"]')
    .forEach((input) => {
      input.value = "";
    });

  // ❌ DO NOT delete localStorage
  // ❌ DO NOT delete database
  // ❌ DO NOT call DELETE API

  alert("Form cleared successfully.");
};
  return (
    
    <div className="course-matrix-page">
{/* Criteria 1.4 Description */}



      {/* Header */}

      <div className="page-title">
        <h1>
          Criteria 1.4 : Course Outcomes & Matrix
        </h1>
      </div>

      {/* Filters */}

      <div className="filter-card">

        <div className="filter-box">
          <label>Academic Year</label>
         <select
  value={academicYear}
  onChange={(e) => setAcademicYear(e.target.value)}
>
  <option value="">Select Academic Year</option>

  <option value="2020-21">2020-21</option>
  <option value="2021-22">2021-22</option>
  <option value="2022-23">2022-23</option>
  <option value="2023-24">2023-24</option>
  <option value="2024-25">2024-25</option>
  <option value="2025-26">2025-26</option>
  <option value="2026-27">2026-27</option>
</select>
        </div>

        <div className="filter-box">
  <label>Department</label>
<select
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
>
  <option value="">Select Department Type</option>

  <option value="Computer Science & Engineering">
    Computer Science & Engineering
  </option>

  <option value="Information Technology">
    Information Technology
  </option>

  <option value="Artificial Intelligence & Data Science">
    Artificial Intelligence & Data Science
  </option>

  <option value="Electronics & Telecommunication">
    Electronics & Telecommunication
  </option>

  <option value="Electrical Engineering">
    Electrical Engineering
  </option>

  <option value="Mechanical Engineering">
    Mechanical Engineering
  </option>

  <option value="Civil Engineering">
    Civil Engineering
  </option>

  <option value="MBA">
    MBA
  </option>

  <option value="MCA">
    MCA
  </option>

  <option value="BCA">
    BCA
  </option>

  <option value="BBA">
    BBA
  </option>
  
  <option value="Science">
  Science
  </option>
  <option value="Commerce">
Commerce
  </option>
  <option value="Arts">
Arts
  </option>


</select>
        </div>

      </div>

      {/* 1.4.1 */}

      <div className="section-card">

        <div className="section-header">
          1.4.1 Course Outcomes
        </div>

        <div className="section-content">

          <div className="left-content">

            <div className="top-row">

              

<select
  value={mappedPO}
  onChange={(e) => setMappedPO(e.target.value)}
>
  <option value="">Select PO</option>
  <option value="PO1">PO1</option>
  <option value="PO2">PO2</option>
  <option value="PO3">PO3</option>
  <option value="PO4">PO4</option>
  <option value="PO5">PO5</option>
</select>
<div className="filter-box">

<label>Subject</label>

<select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>

  <option value="">Select Subject</option>

  {subjects.map((subject) => (

    <option
      key={subject.course_code}
      value={subject.course_code}
    >
      {subject.course_name} ({subject.course_code})
    </option>

  ))}

</select>

</div>

<textarea
  placeholder="Enter Course Outcome"
  value={courseOutcome}
  onChange={(e) => setCourseOutcome(e.target.value)}
  className="co-textarea"
/>

<button
  className="add-btn"
  onClick={handleAddCO}
>
  <FaPlus />
{editId ? "Update Course Outcome" : "Add Course Outcome"}
</button>
            </div>

            <table>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Course Outcomes</th>
                  <th>Mapped PO</th>
                  <th>Action</th>
                </tr>
              </thead>
               <tbody>

{courseOutcomes.slice(0, 5).map((row, index) => (

<tr key={row.id}>

<td>{index + 1}</td>

<td>{row.course_outcome}</td>

<td>{row.mapped_po}</td>

<td>
<button onClick={() => handleEdit(row)}>
<FaEdit/>
</button>

<button onClick={() => handleDelete(row.id)}>
<FaTrash/>
</button>
</td>

</tr>

))}

</tbody>
            </table>

          </div>

         <div className="file-upload-row">

  <label
    htmlFor="outcomeFile"
    className="choose-file-btn"
  >
    Choose File
  </label>

  <input
    id="outcomeFile"
    type="file"
    className="custom-file-input"
    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
   onChange={(e) => {

  if (e.target.files.length > 0) {

    const file = e.target.files[0];

    setCoFile(file);

    saveFileName("coFile", file);

    setDisplayFileNames((prev) => ({
      ...prev,
      coFile: file.name
    }));

  }

}}
  />
{(coFile || displayFileNames.coFile) && (
  <div className="pdf-name">
    {coFile?.name || displayFileNames.coFile}
  </div>
)}
  <div className="document-actions">

    <button
      type="button"
      className="view-btn"
      onClick={handleOutcomeView}
    >
      👁
    </button>

    <button
      type="button"
      className="download-btn"
      onClick={handleOutcomeDownload}
    >
      <FaDownload />
    </button>

  </div>

</div>
        </div>
        

      </div>

      {/* 1.4.2 */}

      <div className="section-card">

        <div className="section-header">
          1.4.2 Course Articulation Matrix
        </div>

        <div className="section-content">

          <div className="left-content">

            <div className="top-row">
<select
  value={selectedSubject}
  onChange={(e) => setSelectedSubject(e.target.value)}
>

  <option value="">Select Subject</option>

  {subjects.map((subject) => (

    <option
      key={subject.course_code}
      value={subject.course_code}
    >
      {subject.course_name} ({subject.course_code})
    </option>

  ))}

</select>


            </div>

            <table>

             <thead>
<tr>
  <th>CO/PO</th>
  <th>PO1</th>
  <th>PO2</th>
  <th>PO3</th>
  <th>PO4</th>
  <th>PO5</th>
  <th>Action</th>
</tr>
</thead>
<tbody>

  <tr id="CO1">
    <td>CO1</td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO1.po1}
        onChange={(e) =>
          handleMatrixChange("CO1", "po1", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO1.po2}
        onChange={(e) =>
          handleMatrixChange("CO1", "po2", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO1.po3}
        onChange={(e) =>
          handleMatrixChange("CO1", "po3", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO1.po4}
        onChange={(e) =>
          handleMatrixChange("CO1", "po4", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO1.po5}
        onChange={(e) =>
          handleMatrixChange("CO1", "po5", e.target.value)
        }
      />
    </td>

    <td>
      <button
        className="matrix-save-btn"
        onClick={() => handleMatrixSave("CO1")}
      >
        Save
      </button>
    </td>
  </tr>


  <tr id="CO2">
    <td>CO2</td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO2.po1}
        onChange={(e) =>
          handleMatrixChange("CO2", "po1", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO2.po2}
        onChange={(e) =>
          handleMatrixChange("CO2", "po2", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO2.po3}
        onChange={(e) =>
          handleMatrixChange("CO2", "po3", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO2.po4}
        onChange={(e) =>
          handleMatrixChange("CO2", "po4", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO2.po5}
        onChange={(e) =>
          handleMatrixChange("CO2", "po5", e.target.value)
        }
      />
    </td>

    <td>
      <button
        className="matrix-save-btn"
        onClick={() => handleMatrixSave("CO2")}
      >
        Save
      </button>
    </td>
  </tr>


  <tr id="CO3">
    <td>CO3</td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO3.po1}
        onChange={(e) =>
          handleMatrixChange("CO3", "po1", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO3.po2}
        onChange={(e) =>
          handleMatrixChange("CO3", "po2", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO3.po3}
        onChange={(e) =>
          handleMatrixChange("CO3", "po3", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO3.po4}
        onChange={(e) =>
          handleMatrixChange("CO3", "po4", e.target.value)
        }
      />
    </td>

    <td>
      <input
        type="number"
        min="0"
        max="100"
        value={matrixData.CO3.po5}
        onChange={(e) =>
          handleMatrixChange("CO3", "po5", e.target.value)
        }
      />
    </td>

    <td>
      <button
        className="matrix-save-btn"
        onClick={() => handleMatrixSave("CO3")}
      >
        Save
      </button>
    </td>
  </tr>

</tbody>
            </table>

          </div>
<div className="file-upload-row">

  <label
    htmlFor="matrixFile"
    className="choose-file-btn"
  >
    Choose File
  </label>

  <input
    id="matrixFile"
    type="file"
    className="custom-file-input"
    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
   onChange={(e) => {

  if (e.target.files.length > 0) {

    const file = e.target.files[0];

    setMatrixFile(file);

    saveFileName("matrixFile", file);

    setDisplayFileNames((prev) => ({
      ...prev,
      matrixFile: file.name
    }));

  }

}}
  />
{(matrixFile || displayFileNames.matrixFile) && (
  <div className="pdf-name">
    {matrixFile?.name || displayFileNames.matrixFile}
  </div>
)}
  <div className="document-actions">

    <button
      type="button"
      className="view-btn"
      onClick={handleMatrixView}
    >
      👁
    </button>

    <button
      type="button"
      className="download-btn"
      onClick={handleMatrixDownload}
    >
      <FaDownload />
    </button>

  </div>

</div>
        </div>

      </div>


           

          
    <div className="footer-buttons">

<button
  className="previous-btn"
  onClick={handlePrevious}
>
    ← Previous
</button>
<button
  type="button"
  className="back-btn"
  onClick={() => navigate("/vision")}
>
  ← Back
</button>
<button
className="submit-btn"
onClick={handleSubmit}
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
  <FaPrint /> Print
</button>
<button
  className="next-page-btn"
  onClick={() => navigate("/articulation-matrix")}
>
  Next →
</button>
</div>
      </div>
  );
}

export default CourseMatrix;