import React, { useState, useEffect } from "react";
import "./CourseMatrix.css";
import NBASidebar from "../pages/NBASidebar";

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
    CO1: {
      po1: "",
      po2: "",
      po3: "",
      po4: "",
      po5: ""
    },
    CO2: {
      po1: "",
      po2: "",
      po3: "",
      po4: "",
      po5: ""
    },
    CO3: {
      po1: "",
      po2: "",
      po3: "",
      po4: "",
      po5: ""
    }
  });

  const [editId, setEditId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [pos, setPos] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [matrixRows, setMatrixRows] = useState([]);
  const [courseMatrix, setCourseMatrix] = useState([]);
  const [coSubject, setCoSubject] = useState("");
  const [matrixSubject, setMatrixSubject] = useState("");
  const [courseOutcome, setCourseOutcome] = useState("");
  const [courseSummary, setCourseSummary] = useState([]);
  const [courseOutcomes, setCourseOutcomes] = useState([]);

  // =====================================================
  // SAVE FILE NAME
  // =====================================================

  const saveFileName = (key, file) => {

    if (!file) return;

    setSavedFileNames((prev) => ({
      ...prev,
      [key]: file.name
    }));

  };

  // =====================================================
  // RESTORE 1.4 DATA
  // =====================================================

  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      try {

        const data = JSON.parse(saved);

        setAcademicYear(data.academicYear ?? "");
        setDepartment(data.department ?? "");
        setProgram(data.program ?? "");

        setMappedPO(data.mappedPO ?? "");
        setCourseOutcome(data.courseOutcome ?? "");

        setSelectedSubject(
          data.selectedSubject ?? ""
        );

        if (data.matrixData) {
          setMatrixData(data.matrixData);
        }

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

  // =====================================================
  // AUTO SAVE
  // =====================================================

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

  // =====================================================
  // LOAD COURSE MATRIX
  // =====================================================

  const loadCourseMatrix = async () => {

    if (!selectedSubject) {

      setCourseMatrix([]);

      return;

    }

    try {

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

    } catch (error) {

      console.log(
        "Load Course Matrix Error:",
        error
      );

    }

  };

  // =====================================================
  // LOAD COURSE OUTCOMES
  // =====================================================

  const loadCourseOutcomes = async () => {

    if (!selectedSubject) {

      setCourseOutcomes([]);

      return;

    }

    try {

      const res = await fetch(
        `http://localhost:5000/get-subject-co/${selectedSubject}`
      );

      const data = await res.json();

      setCourseOutcomes(data);

      if (data.length > 0) {

        setUploadedOutcomeFile(
          data[data.length - 1].outcome_file || ""
        );

      }

    } catch (error) {

      console.log(
        "Load Course Outcomes Error:",
        error
      );

    }

  };

  // =====================================================
  // PAGE LOAD
  // =====================================================

  useEffect(() => {

    loadPOs();

  }, []);

  // =====================================================
  // DEPARTMENT CHANGE
  // =====================================================

  useEffect(() => {

    loadSubjects();

  }, [department]);

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  useEffect(() => {

    if (selectedSubject) {

      loadCourseOutcomes();
      loadCourseMatrix();
      loadMatrixRows();

    } else {

      setCourseOutcomes([]);
      setCourseMatrix([]);
      setMatrixRows([]);

    }

  }, [selectedSubject]);

  // =====================================================
  // COURSE SUMMARY
  // =====================================================

  const loadCourseSummary = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/get-course-summary"
      );

      const data = await res.json();

      setCourseSummary(data);

    } catch (error) {

      console.log(
        "Course Summary Error:",
        error
      );

    }

  };

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================

  const loadSubjects = async () => {

    if (!department) {

      setSubjects([]);

      return;

    }

    try {

      const res = await fetch(
        `http://localhost:5000/get-subjects/${department}`
      );

      const data = await res.json();

      setSubjects(data);

    } catch (error) {

      console.log(
        "Load Subjects Error:",
        error
      );

    }

  };

  // =====================================================
  // LOAD POs
  // =====================================================

  const loadPOs = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/get-pos"
      );

      const data = await res.json();

      setPos(data);

    } catch (error) {

      console.log(
        "Load PO Error:",
        error
      );

    }

  };

  // =====================================================
  // LOAD MATRIX ROWS
  // =====================================================

  const loadMatrixRows = async () => {

    if (!selectedSubject) return;

    try {

      const res = await fetch(
        `http://localhost:5000/get-subject-co/${selectedSubject}`
      );

      const data = await res.json();

      setMatrixRows(data);

    } catch (error) {

      console.log(
        "Load Matrix Rows Error:",
        error
      );

    }

  };

  // =====================================================
  // ADD / UPDATE COURSE OUTCOME
  // =====================================================

  const handleAddCO = async () => {

    if (!selectedSubject) {

      alert("Please select Subject.");

      return;

    }

    if (!courseOutcome.trim()) {

      alert("Please enter Course Outcome.");

      return;

    }

    try {

      let url =
        "http://localhost:5000/save-course-outcome";

      let method = "POST";

      if (editId) {

        url =
          `http://localhost:5000/update-course-outcome/${editId}`;

        method = "PUT";

      }

      const formData = new FormData();

      formData.append(
        "academicYear",
        academicYear
      );

      formData.append(
        "department",
        department
      );

      formData.append(
        "subjectCode",
        selectedSubject
      );

      formData.append(
        "courseOutcome",
        courseOutcome
      );

      formData.append(
        "mappedPO",
        mappedPO
      );

      if (!coFile) {

        alert(
          "Please select Outcome File"
        );

        return;

      }

      formData.append(
        "outcomeFile",
        coFile
      );

      const response = await fetch(
        url,
        {
          method,
          body: formData
        }
      );

      const data =
        await response.json();

      console.log(
        "Backend Response =",
        data
      );

      if (!response.ok) {

        alert(
          data.error ||
          data.message ||
          "Save Failed"
        );

        return;

      }

      setUploadedOutcomeFile(
        data.fileName || ""
      );

      alert(
        data.message ||
        "Course Outcome Saved Successfully"
      );

      setCourseOutcome("");
      setMappedPO("");
      setEditId(null);

      await loadCourseOutcomes();

    } catch (error) {

      console.log(error);

      alert("Save Error");

    }

    setCoFile(null);

    const fileInput =
      document.getElementById(
        "outcomeFile"
      );

    if (fileInput) {

      fileInput.value = "";

    }

  };

  // =====================================================
  // SAVE COURSE MATRIX FILE
  // =====================================================

  const handleSave = async () => {

    try {

      const formData =
        new FormData();

      formData.append(
        "academicYear",
        academicYear
      );

      formData.append(
        "department",
        department
      );

      formData.append(
        "program",
        program
      );

      formData.append(
        "courseOutcome",
        courseOutcome
      );

      formData.append(
        "mappedPO",
        mappedPO
      );

      formData.append(
        "subjectCode",
        selectedSubject
      );

      if (matrixFile) {

        formData.append(
          "matrixFile",
          matrixFile
        );

      }

      const response =
        await fetch(
          "http://localhost:5000/save-course-matrix",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      console.log(
        "Uploaded File =",
        data.fileName
      );

      alert(
        data.message ||
        "Matrix Saved Successfully"
      );

      await loadCourseOutcomes();
      await loadCourseMatrix();

    } catch (error) {

      console.log(error);

      alert("Save Error");

    }

  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = () => {

    if (
      !academicYear ||
      !department
    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }

    alert(
      "Submitted Successfully"
    );

  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (row) => {

    setEditId(row.id);

    setCourseOutcome(
      row.course_outcome || ""
    );

    setMappedPO(
      row.mapped_po || ""
    );

  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this record?"
      )
    ) return;

    try {

      const response =
        await fetch(
          `http://localhost:5000/delete-course-outcome/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      alert(
        data.message ||
        "Deleted Successfully"
      );

      await loadCourseOutcomes();

    } catch (error) {

      console.log(error);

      alert("Delete Error");

    }

  };

  // =====================================================
  // MATRIX CHANGE
  // =====================================================

  const handleMatrixChange = (
    co,
    po,
    value
  ) => {

    setMatrixData((prev) => ({

      ...prev,

      [co]: {

        ...prev[co],

        [po]: value

      }

    }));

  };

  // =====================================================
  // MATRIX SAVE
  // =====================================================

  const handleMatrixSave =
    async (coId) => {

      const row =
        document.getElementById(
          coId
        );

      if (!row) return;

      const inputs =
        row.querySelectorAll(
          "input"
        );

      if (!selectedSubject) {

        alert(
          "Please select Subject."
        );

        return;

      }

      if (!matrixFile) {

        alert(
          "Please select Matrix File"
        );

        return;

      }

      const formData =
        new FormData();

      formData.append(
        "academicYear",
        academicYear
      );

      formData.append(
        "department",
        department
      );

      formData.append(
        "subjectCode",
        selectedSubject
      );

      formData.append(
        "coId",
        coId
      );

      formData.append(
        "po1",
        inputs[0]?.value || ""
      );

      formData.append(
        "po2",
        inputs[1]?.value || ""
      );

      formData.append(
        "po3",
        inputs[2]?.value || ""
      );

      formData.append(
        "po4",
        inputs[3]?.value || ""
      );

      formData.append(
        "po5",
        inputs[4]?.value || ""
      );

      formData.append(
        "matrixFile",
        matrixFile
      );

      try {

        const response =
          await fetch(
            "http://localhost:5000/save-course-matrix",
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await response.json();

        console.log(
          "Backend Response =",
          data
        );

        if (!response.ok) {

          alert(
            data.error ||
            data.message ||
            "Matrix Save Failed"
          );

          return;

        }

        setUploadedMatrixFile(
          data.fileName || ""
        );

        alert(
          data.message ||
          "Matrix Saved Successfully"
        );

        await loadCourseMatrix();

      } catch (error) {

        console.log(error);

        alert(
          "Matrix Save Error"
        );

      }

    };

  // =====================================================
  // DOWNLOAD
  // =====================================================

  const handleDownload = () => {

    window.open(
      "http://localhost:5000/download-course-matrix",
      "_blank"
    );

  };

  // =====================================================
  // READ FILE CONTENT
  // =====================================================

  const readFileContentHTML =
    async (fileName) => {

      const ext =
        fileName
          .split(".")
          .pop()
          .toLowerCase();

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

      // IMAGE

      if (
        [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp"
        ].includes(ext)
      ) {

        return `
          <img
            src="http://localhost:5000/uploads/${fileName}"
            style="width:100%;"
          />
        `;

      }

      // DOCX

      if (ext === "docx") {

        const response =
          await fetch(
            `http://localhost:5000/uploads/${fileName}`
          );

        const blob =
          await response.blob();

        const arrayBuffer =
          await blob.arrayBuffer();

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

      // EXCEL

      if (
        [
          "xlsx",
          "xls",
          "csv"
        ].includes(ext)
      ) {

        const response =
          await fetch(
            `http://localhost:5000/uploads/${fileName}`
          );

        const blob =
          await response.blob();

        const arrayBuffer =
          await blob.arrayBuffer();

        const workbook =
          XLSX.read(
            arrayBuffer,
            {
              type: "array"
            }
          );

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        return `
          <div class="excel-parsed-content">
            ${XLSX.utils.sheet_to_html(
              sheet
            )}
          </div>
        `;

      }

      return `
        <p>
          Preview not available.
        </p>
      `;

    };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = async () => {

    try {

      const res =
        await fetch(
          `http://localhost:5000/print-course-files/${selectedSubject}`
        );

      const data =
        await res.json();

      const documents = [

        {
          title:
            "1.4.1 Course Outcomes",

          file:
            data.outcome_file
        },

        {
          title:
            "1.4.2 Course Articulation Matrix",

          file:
            data.matrix_file
        }

      ].filter(
        (item) => item.file
      );

      let html = "";

      for (
        const doc of documents
      ) {

        const preview =
          await readFileContentHTML(
            doc.file
          );

        html += `

          <div class="doc-section">

            <h2>
              ${doc.title}
            </h2>

            ${preview}

            <hr />

          </div>

        `;

      }

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      if (!printWindow) {

        alert(
          "Please allow pop-ups for printing."
        );

        return;

      }

      printWindow.document.write(`

        <html>

          <head>

            <title>
              Course Outcomes & Matrix
            </title>

            <style>

              body {
                font-family: Arial;
                margin: 20px;
              }

              h1 {
                text-align: center;
                color: #0b4ea2;
              }

              h2 {
                margin-top: 35px;
                color: #0b4ea2;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
              }

              embed {
                width: 100%;
                height: 900px;
              }

              img {
                width: 100%;
              }

              table {
                width: 100%;
                border-collapse: collapse;
              }

              td,
              th {
                border: 1px solid #ddd;
                padding: 8px;
              }

            </style>

          </head>

          <body>

            <h1>
              1.4 Course Outcomes & Matrix
            </h1>

            ${html}

          </body>

        </html>

      `);

      printWindow.document.close();

      setTimeout(() => {

        printWindow.focus();
        printWindow.print();

      }, 1000);

    } catch (err) {

      console.log(err);

      alert("Print Error");

    }

  };

  // =====================================================
  // MATRIX VIEW
  // =====================================================

  const handleMatrixView = () => {

    const fileName =
      matrixFile?.name ||
      displayFileNames.matrixFile ||
      uploadedMatrixFile;

    if (!fileName) {

      alert(
        "Please upload Matrix file first."
      );

      return;

    }

    window.open(
      `http://localhost:5000/uploads/${fileName}`,
      "_blank"
    );

  };

  // =====================================================
  // MATRIX DOWNLOAD
  // =====================================================

  const handleMatrixDownload = () => {

    const fileName =
      matrixFile?.name ||
      displayFileNames.matrixFile ||
      uploadedMatrixFile;

    if (!fileName) {

      alert(
        "Please upload Matrix file first."
      );

      return;

    }

    window.open(
      `http://localhost:5000/download/${fileName}`,
      "_blank"
    );

  };

  // =====================================================
  // OUTCOME VIEW
  // =====================================================

  const handleOutcomeView = () => {

    const fileName =
      coFile?.name ||
      displayFileNames.coFile ||
      uploadedOutcomeFile;

    if (!fileName) {

      alert(
        "No Outcome file found."
      );

      return;

    }

    window.open(
      `http://localhost:5000/uploads/${fileName}`,
      "_blank"
    );

  };

  // =====================================================
  // OUTCOME DOWNLOAD
  // =====================================================

  const handleOutcomeDownload = () => {

    const fileName =
      coFile?.name ||
      displayFileNames.coFile ||
      uploadedOutcomeFile;

    if (!fileName) {

      alert(
        "Please upload file first."
      );

      return;

    }

    window.open(
      `http://localhost:5000/download/${fileName}`,
      "_blank"
    );

  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {

    navigate("/po-pso");

  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {

    const confirmClear =
      window.confirm(
        "Are you sure you want to clear the form?"
      );

    if (!confirmClear) return;

    setAcademicYear("");
    setDepartment("");
    setProgram("");

    setMappedPO("");
    setSelectedSubject("");
    setCourseOutcome("");

    setCoFile(null);
    setMatrixFile(null);

    setUploadedOutcomeFile("");
    setUploadedMatrixFile("");

    setDisplayFileNames({});

    setMatrixData({

      CO1: {
        po1: "",
        po2: "",
        po3: "",
        po4: "",
        po5: ""
      },

      CO2: {
        po1: "",
        po2: "",
        po3: "",
        po4: "",
        po5: ""
      },

      CO3: {
        po1: "",
        po2: "",
        po3: "",
        po4: "",
        po5: ""
      }

    });

    const fileInputs =
      document.querySelectorAll(
        'input[type="file"]'
      );

    fileInputs.forEach(
      (input) => {
        input.value = "";
      }
    );

    alert(
      "Form cleared successfully."
    );

  };

  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="nba-layout">

      {/* =================================================
          NBA SIDEBAR
      ================================================= */}

      <NBASidebar />

      {/* =================================================
          MAIN COURSE MATRIX CONTENT
      ================================================= */}

      <main className="course-matrix-page">

        {/* ================= PAGE TITLE ================= */}

        <div className="page-title">

          <h1>
            Criteria 1.4 : Course Outcomes & Matrix
          </h1>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="filter-card">

          <div className="filter-box">

            <label>
              Academic Year
            </label>

            <select
              value={academicYear}
              onChange={(e) =>
                setAcademicYear(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Academic Year
              </option>

              <option value="2020-21">
                2020-21
              </option>

              <option value="2021-22">
                2021-22
              </option>

              <option value="2022-23">
                2022-23
              </option>

              <option value="2023-24">
                2023-24
              </option>

              <option value="2024-25">
                2024-25
              </option>

              <option value="2025-26">
                2025-26
              </option>

              <option value="2026-27">
                2026-27
              </option>

            </select>

          </div>

          <div className="filter-box">

            <label>
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Department Type
              </option>

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

        {/* =================================================
            1.4.1 COURSE OUTCOMES
        ================================================= */}

        <div className="section-card">

          <div className="section-header">
            1.4.1 Course Outcomes
          </div>

          <div className="section-content">

            <div className="left-content">

              <div className="top-row">

                {/* MAPPED PO */}

                <select
                  value={mappedPO}
                  onChange={(e) =>
                    setMappedPO(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select PO
                  </option>

                  <option value="PO1">
                    PO1
                  </option>

                  <option value="PO2">
                    PO2
                  </option>

                  <option value="PO3">
                    PO3
                  </option>

                  <option value="PO4">
                    PO4
                  </option>

                  <option value="PO5">
                    PO5
                  </option>

                </select>

                {/* SUBJECT */}

                <div className="filter-box">

                  <label>
                    Subject
                  </label>

                  <select
                    value={
                      selectedSubject
                    }
                    onChange={(e) =>
                      setSelectedSubject(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Subject
                    </option>

                    {subjects.map(
                      (subject) => (

                        <option
                          key={
                            subject.course_code
                          }
                          value={
                            subject.course_code
                          }
                        >

                          {
                            subject.course_name
                          }

                          {" ("}

                          {
                            subject.course_code
                          }

                          {")"}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* COURSE OUTCOME */}

                <textarea
                  placeholder="Enter Course Outcome"
                  value={
                    courseOutcome
                  }
                  onChange={(e) =>
                    setCourseOutcome(
                      e.target.value
                    )
                  }
                  className="co-textarea"
                />

                {/* ADD BUTTON */}

                <button
                  className="add-btn"
                  onClick={
                    handleAddCO
                  }
                >

                  <FaPlus />

                  {editId
                    ? "Update Course Outcome"
                    : "Add Course Outcome"}

                </button>

              </div>

              {/* CO TABLE */}

              <table>

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Course Outcomes
                    </th>

                    <th>
                      Mapped PO
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {courseOutcomes
                    .slice(0, 5)
                    .map(
                      (row, index) => (

                        <tr
                          key={row.id}
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {
                              row.course_outcome
                            }
                          </td>

                          <td>
                            {
                              row.mapped_po
                            }
                          </td>

                          <td>

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  row
                                )
                              }
                            >

                              <FaEdit />

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  row.id
                                )
                              }
                            >

                              <FaTrash />

                            </button>

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

            {/* OUTCOME FILE */}

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

                  if (
                    e.target.files.length > 0
                  ) {

                    const file =
                      e.target.files[0];

                    setCoFile(file);

                    saveFileName(
                      "coFile",
                      file
                    );

                    setDisplayFileNames(
                      (prev) => ({

                        ...prev,

                        coFile:
                          file.name

                      })
                    );

                  }

                }}
              />

              {(coFile ||
                displayFileNames.coFile) && (

                <div className="pdf-name">

                  {
                    coFile?.name ||
                    displayFileNames.coFile
                  }

                </div>

              )}

              <div className="document-actions">

                <button
                  type="button"
                  className="view-btn"
                  onClick={
                    handleOutcomeView
                  }
                >

                  <FaEye />

                </button>

                <button
                  type="button"
                  className="download-btn"
                  onClick={
                    handleOutcomeDownload
                  }
                >

                  <FaDownload />

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            1.4.2 COURSE ARTICULATION MATRIX
        ================================================= */}

        <div className="section-card">

          <div className="section-header">
            1.4.2 Course Articulation Matrix
          </div>

          <div className="section-content">

            <div className="left-content">

              {/* SUBJECT */}

              <div className="top-row">

                <select
                  value={
                    selectedSubject
                  }
                  onChange={(e) =>
                    setSelectedSubject(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Subject
                  </option>

                  {subjects.map(
                    (subject) => (

                      <option
                        key={
                          subject.course_code
                        }
                        value={
                          subject.course_code
                        }
                      >

                        {
                          subject.course_name
                        }

                        {" ("}

                        {
                          subject.course_code
                        }

                        {")"}

                      </option>

                    )
                  )}

                </select>

              </div>

              {/* MATRIX TABLE */}

              <table>

                <thead>

                  <tr>

                    <th>
                      CO/PO
                    </th>

                    <th>
                      PO1
                    </th>

                    <th>
                      PO2
                    </th>

                    <th>
                      PO3
                    </th>

                    <th>
                      PO4
                    </th>

                    <th>
                      PO5
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* CO1 */}

                  <tr id="CO1">

                    <td>
                      CO1
                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO1.po1
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO1",
                            "po1",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO1.po2
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO1",
                            "po2",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO1.po3
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO1",
                            "po3",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO1.po4
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO1",
                            "po4",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO1.po5
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO1",
                            "po5",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <button
                        type="button"
                        className="matrix-save-btn"
                        onClick={() =>
                          handleMatrixSave(
                            "CO1"
                          )
                        }
                      >
                        Save
                      </button>

                    </td>

                  </tr>

                  {/* CO2 */}

                  <tr id="CO2">

                    <td>
                      CO2
                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO2.po1
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO2",
                            "po1",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO2.po2
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO2",
                            "po2",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO2.po3
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO2",
                            "po3",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO2.po4
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO2",
                            "po4",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO2.po5
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO2",
                            "po5",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <button
                        type="button"
                        className="matrix-save-btn"
                        onClick={() =>
                          handleMatrixSave(
                            "CO2"
                          )
                        }
                      >
                        Save
                      </button>

                    </td>

                  </tr>

                  {/* CO3 */}

                  <tr id="CO3">

                    <td>
                      CO3
                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO3.po1
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO3",
                            "po1",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO3.po2
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO3",
                            "po2",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO3.po3
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO3",
                            "po3",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO3.po4
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO3",
                            "po4",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          matrixData.CO3.po5
                        }
                        onChange={(e) =>
                          handleMatrixChange(
                            "CO3",
                            "po5",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <button
                        type="button"
                        className="matrix-save-btn"
                        onClick={() =>
                          handleMatrixSave(
                            "CO3"
                          )
                        }
                      >
                        Save
                      </button>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            {/* MATRIX FILE */}

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

                  if (
                    e.target.files.length > 0
                  ) {

                    const file =
                      e.target.files[0];

                    setMatrixFile(file);

                    saveFileName(
                      "matrixFile",
                      file
                    );

                    setDisplayFileNames(
                      (prev) => ({

                        ...prev,

                        matrixFile:
                          file.name

                      })
                    );

                  }

                }}
              />

              {(matrixFile ||
                displayFileNames.matrixFile) && (

                <div className="pdf-name">

                  {
                    matrixFile?.name ||
                    displayFileNames.matrixFile
                  }

                </div>

              )}

              <div className="document-actions">

                <button
                  type="button"
                  className="view-btn"
                  onClick={
                    handleMatrixView
                  }
                >

                  <FaEye />

                </button>

                <button
                  type="button"
                  className="download-btn"
                  onClick={
                    handleMatrixDownload
                  }
                >

                  <FaDownload />

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER BUTTONS
        ================================================= */}

        <div className="footer-buttons">

          <button
            type="button"
            className="previous-btn"
            onClick={
              handlePrevious
            }
          >
            ← Previous
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/vision")
            }
          >
            ← Back
          </button>

          <button
            type="button"
            className="submit-btn"
            onClick={
              handleSubmit
            }
          >
            <FaSave />
            {" "}
            Save
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={
              handleClear
            }
          >
            Clear
          </button>

          <button
            type="button"
            className="print-btn"
            onClick={
              handlePrint
            }
          >
            <FaPrint />
            {" "}
            Print
          </button>

          <button
            type="button"
            className="next-page-btn"
            onClick={() =>
              navigate(
                "/articulation-matrix"
              )
            }
          >
            Next →
          </button>

        </div>

      </main>

    </div>

  );

}

export default CourseMatrix;