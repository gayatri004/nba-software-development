import React, { useState, useEffect } from "react";
import "./ArticulationMatrix.css";
import NBASidebar from "../pages/NBASidebar";

import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import * as XLSX from "xlsx";

import {
  FaTable,
  FaEdit,
  FaTrash,
  FaSave,
  FaPrint,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function ArticulationMatrix({
  onNext,
  onPrevious
}) {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [department, setDepartment] = useState("");

  const STORAGE_KEY = "articulation_matrix_1_5_data";

  const [loaded, setLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [clearMode, setClearMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // RESTORE LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (data.department) {
          setDepartment(data.department);
        }

        if (data.courses) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.log("Restore Error:", error);
      }
    }

    setLoaded(true);
  }, []);

  // =====================================================
  // LOAD COURSES
  // =====================================================

  const loadCourses = async () => {
    if (!department) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/get-course-master/${encodeURIComponent(
          department
        )}`
      );

      if (!res.ok) {
        throw new Error("Failed to load courses");
      }

      const data = await res.json();

      console.log("Courses =", data);

      setCourses(
        data.map((row) => ({
          ...row,

          po1: row.po1 ?? "",
          po2: row.po2 ?? "",
          po3: row.po3 ?? "",
          po4: row.po4 ?? "",
          po5: row.po5 ?? "",
          po6: row.po6 ?? "",
          po7: row.po7 ?? "",
          po8: row.po8 ?? "",
          po9: row.po9 ?? "",
          po10: row.po10 ?? "",

          pso1: row.pso1 ?? "",
          pso2: row.pso2 ?? "",
          pso3: row.pso3 ?? "",
        }))
      );

      setDataLoaded(true);
    } catch (error) {
      console.error("Load Courses Error:", error);
      alert("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD COURSE WHEN DEPARTMENT CHANGES
  // =====================================================

  useEffect(() => {
    if (!loaded || !department) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (
          data.department === department &&
          data.courses &&
          data.courses.length > 0
        ) {
          setCourses(data.courses);
          setDataLoaded(true);
          return;
        }
      } catch (error) {
        console.log("Local Storage Error:", error);
      }
    }

    loadCourses();
  }, [department, loaded]);

  // =====================================================
  // SAVE LOCAL STORAGE AUTOMATICALLY
  // =====================================================

  useEffect(() => {
    if (!loaded || clearMode || !department) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        department,
        courses,
      })
    );
  }, [loaded, clearMode, department, courses]);

  // =====================================================
  // HANDLE MATRIX INPUT
  // =====================================================

  const handleMatrixChange = (index, field, value) => {
    const temp = [...courses];

    temp[index] = {
      ...temp[index],
      [field]: value,
    };

    setCourses(temp);
  };

  // =====================================================
  // SAVE ALL COURSES
  // =====================================================

  const handleSave = async () => {
    if (!department) {
      alert("Please select department.");
      return;
    }

    if (courses.length === 0) {
      alert("No courses available.");
      return;
    }

    const hasData = courses.some(
      (row) =>
        row.po1 ||
        row.po2 ||
        row.po3 ||
        row.po4 ||
        row.po5 ||
        row.po6 ||
        row.po7 ||
        row.po8 ||
        row.po9 ||
        row.po10 ||
        row.pso1 ||
        row.pso2 ||
        row.pso3
    );

    if (!hasData) {
      alert("Please enter at least one PO/PSO value.");
      return;
    }

    try {
      setLoading(true);

      for (let i = 0; i < courses.length; i++) {
        const row = courses[i];

        const response = await fetch(
          "http://localhost:5000/save-all-courses-matrix",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              department,

              courseCode: row.course_code,
              courseName: row.course_name,

              po1: row.po1,
              po2: row.po2,
              po3: row.po3,
              po4: row.po4,
              po5: row.po5,
              po6: row.po6,
              po7: row.po7,
              po8: row.po8,
              po9: row.po9,
              po10: row.po10,

              pso1: row.pso1,
              pso2: row.pso2,
              pso3: row.pso3,

              // First row removes old data
              replaceExisting: i === 0,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to save course ${row.course_code}`
          );
        }
      }

      alert("All Courses Saved Successfully");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Save Error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async () => {
    try {
      setLoading(true);

      for (const row of courses) {
        if (!row.id) continue;

        const response = await fetch(
          `http://localhost:5000/update-all-courses-matrix/${row.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              department,

              courseCode: row.course_code,
              courseName: row.course_name,

              po1: row.po1,
              po2: row.po2,
              po3: row.po3,
              po4: row.po4,
              po5: row.po5,
              po6: row.po6,
              po7: row.po7,
              po8: row.po8,
              po9: row.po9,
              po10: row.po10,

              pso1: row.pso1,
              pso2: row.pso2,
              pso3: row.pso3,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update ${row.course_code}`
          );
        }
      }

      alert("Updated Successfully");
      setEditId(null);
    } catch (error) {
      console.error("Update Error:", error);
      alert("Update Error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MAIN DELETE BUTTON
  // =====================================================

  const handleDelete = () => {
    alert("Select a row and delete.");
  };

  // =====================================================
  // DELETE SINGLE ROW
  // =====================================================

  const handleRowDelete = async (id) => {
    if (!id) {
      alert("Invalid record.");
      return;
    }

    if (!window.confirm("Delete Record?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/delete-all-courses-matrix/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setCourses((prev) =>
        prev.filter((row) => row.id !== id)
      );

      alert("Record deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete Error");
    }
  };

  // =====================================================
  // EDIT ROW
  // =====================================================

  const handleRowEdit = (row) => {
    setEditId(row.id);
  };

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {
    navigate("/course-matrix");
  };

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerateReport = async () => {
    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
      alert("Please allow pop-ups for this website.");
      return;
    }

    reportWindow.document.write(`
      <html>
      <head>

        <title>Criteria 1 Report</title>

        <style>

          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #222;
            background: white;
            overflow-x: hidden;
          }

          body {
            padding: 10mm;
          }

          .header {
            width: 100%;
            text-align: center;
            border-bottom: 2px solid #203648;
            padding-bottom: 10px;
            margin-bottom: 18px;
          }

          .header h1 {
            margin: 0;
            color: #203648;
            font-size: 24px;
          }

          .header h2 {
            margin: 7px 0;
            color: #0068c9;
            font-size: 21px;
          }

          .header p {
            margin: 5px 0;
            font-size: 14px;
          }

          #report {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .section {
            width: 100%;
            max-width: 100%;
            margin-bottom: 22px;
            overflow: hidden;
          }

          .section-title {
            width: 100%;
            background: #203648;
            color: white;
            padding: 8px 10px;
            font-size: 17px;
            font-weight: bold;
            margin-bottom: 10px;
            page-break-after: avoid;
            break-after: avoid;
          }

          .sub-title {
            color: #0068c9;
            font-size: 16px;
            font-weight: bold;
            margin: 12px 0 7px;
          }

          table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 12px;
            page-break-inside: auto;
            break-inside: auto;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
            vertical-align: top;
            font-size: 9px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          th {
            background: #eef3f7;
            font-weight: bold;
          }

          tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .file-box {
            width: 100%;
            max-width: 100%;
            border: 1px solid #ccc;
            padding: 8px;
            margin: 12px 0;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .file-title {
            color: #0068c9;
            font-weight: bold;
            font-size: 15px;
          }

          .file-name {
            margin-top: 5px;
            font-weight: bold;
            font-size: 11px;
            word-break: break-word;
          }

          .description {
            margin-top: 5px;
            color: #555;
            font-size: 11px;
            word-break: break-word;
          }

          .uploaded-pdf-page {
            width: 100%;
            max-width: 100%;
            margin: 10px 0;
            text-align: center;
            page-break-after: always;
            break-after: page;
            overflow: hidden;
          }

          .uploaded-pdf-image {
            display: block;
            width: 100%;
            max-width: 100%;
            height: auto;
            margin: 0 auto;
          }

          .uploaded-image-page {
            width: 100%;
            max-width: 100%;
            text-align: center;
            margin: 10px 0;
            page-break-inside: avoid;
            break-inside: avoid;
            overflow: hidden;
          }

          .uploaded-image {
            display: block;
            max-width: 100%;
            max-height: 650px;
            width: auto;
            height: auto;
            margin: auto;
            object-fit: contain;
          }

          .uploaded-docx-page {
            width: 100%;
            max-width: 100%;
            padding: 10px;
            margin: 10px 0;
            overflow: hidden;
            page-break-inside: auto;
            break-inside: auto;
          }

          .uploaded-docx-page img {
            max-width: 100%;
            height: auto;
          }

          .doc-content {
            width: 100%;
            max-width: 100%;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          .uploaded-excel-page {
            width: 100%;
            max-width: 100%;
            margin: 10px 0;
            overflow: hidden;
            page-break-inside: auto;
            break-inside: auto;
          }

          .uploaded-excel-page h3 {
            color: #0068c9;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .excel {
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          }

          .no-data {
            width: 100%;
            text-align: center;
            padding: 20px;
            color: #777;
            border: 1px dashed #aaa;
          }

          @media print {

            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            html,
            body {
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0;
              overflow-x: hidden !important;
            }

            #report {
              width: 100%;
              max-width: 100%;
              overflow: hidden;
            }

            table {
              width: 100%;
              max-width: 100%;
              table-layout: fixed;
            }

            th,
            td {
              font-size: 8px;
              padding: 4px;
            }
          }

        </style>

      </head>

      <body>

        <div class="header">

          <h1>
            NBA Accreditation Management System
          </h1>

          <h2>
            Criteria 1 Report
          </h2>

          <p>
            Current Data — Criteria 1.1 to 1.5
          </p>

        </div>

        <div id="report">

          <div class="no-data">
            Loading current data...
          </div>

        </div>

      </body>

      </html>
    `);

    reportWindow.document.close();

    try {
      // =====================================================
      // FETCH DATA
      // =====================================================

      const visionResponse = await axios.get(
        "http://localhost:5000/print-vision-files"
      );

      const curriculumResponse = await axios.get(
        "http://localhost:5000/get-curriculum"
      );

      const popsoResponse = await axios.get(
        "http://localhost:5000/get-popso"
      );

      const outcomeResponse = await axios.get(
        "http://localhost:5000/get-course-outcomes"
      );

      const matrixResponse = await axios.get(
        "http://localhost:5000/get-course-matrix"
      );

      const articulationResponse = await axios.get(
        "http://localhost:5000/get-all-courses-matrix"
      );

      // =====================================================
      // CURRENT DATA
      // =====================================================

      const vision = visionResponse.data || {};
      const curriculum = curriculumResponse.data || {};
      const popso = popsoResponse.data || {};

      const outcomes = Array.isArray(outcomeResponse.data)
        ? outcomeResponse.data
        : [];

      const matrices = Array.isArray(matrixResponse.data)
        ? matrixResponse.data
        : [];

      const currentOutcome =
        outcomes.length > 0
          ? outcomes[0]
          : null;

      let currentMatrices = [];

      if (currentOutcome) {
        currentMatrices = matrices.filter(
          (row) =>
            row.academic_year ===
              currentOutcome.academic_year &&
            row.department ===
              currentOutcome.department &&
            row.subject_code ===
              currentOutcome.subject_code
        );
      }

      // =====================================================
      // CURRENT ARTICULATION
      // =====================================================

      const articulation = Array.isArray(
        articulationResponse.data
      )
        ? articulationResponse.data
        : [];

      const latestArticulation =
        articulation.length > 0
          ? articulation[articulation.length - 1]
          : null;

      let currentArticulation = [];

      if (latestArticulation) {
        currentArticulation = articulation.filter(
          (row) =>
            row.department ===
            latestArticulation.department
        );
      }

      // =====================================================
      // FILE PREVIEW
      // =====================================================

      const previewFile = async (fileName) => {
        if (!fileName) {
          return "";
        }

        try {
          const response = await fetch(
            `http://localhost:5000/download/${encodeURIComponent(
              fileName
            )}`
          );

          if (!response.ok) {
            return `
              <div class="no-data">
                File not found: ${fileName}
              </div>
            `;
          }

          const blob = await response.blob();

          const extension = fileName
            .split(".")
            .pop()
            .toLowerCase();

          // =================================================
          // PDF
          // =================================================

          if (extension === "pdf") {
            const buffer = await blob.arrayBuffer();

            const pdf = await pdfjsLib
              .getDocument({
                data: buffer,
              })
              .promise;

            let pdfHTML = "";

            for (
              let pageNumber = 1;
              pageNumber <= pdf.numPages;
              pageNumber++
            ) {
              const page =
                await pdf.getPage(pageNumber);

              const viewport =
                page.getViewport({
                  scale: 1.25,
                });

              const canvas =
                document.createElement("canvas");

              const context =
                canvas.getContext("2d");

              canvas.width = viewport.width;
              canvas.height = viewport.height;

              await page.render({
                canvasContext: context,
                viewport,
              }).promise;

              const imageData =
                canvas.toDataURL(
                  "image/jpeg",
                  0.9
                );

              pdfHTML += `
                <div class="uploaded-pdf-page">

                  <img
                    src="${imageData}"
                    class="uploaded-pdf-image"
                  />

                </div>
              `;
            }

            return pdfHTML;
          }

          // =================================================
          // IMAGE
          // =================================================

          if (
            extension === "jpg" ||
            extension === "jpeg" ||
            extension === "png" ||
            extension === "gif" ||
            extension === "webp"
          ) {
            const objectURL =
              URL.createObjectURL(blob);

            return `
              <div class="uploaded-image-page">

                <img
                  src="${objectURL}"
                  class="uploaded-image"
                />

              </div>
            `;
          }

          // =================================================
          // DOCX
          // =================================================

          if (extension === "docx") {
            const buffer =
              await blob.arrayBuffer();

            const result =
              await mammoth.convertToHtml({
                arrayBuffer: buffer,
              });

            return `
              <div class="uploaded-docx-page">

                <div class="doc-content">

                  ${result.value}

                </div>

              </div>
            `;
          }

          // =================================================
          // EXCEL
          // =================================================

          if (
            extension === "xlsx" ||
            extension === "xls"
          ) {
            const buffer =
              await blob.arrayBuffer();

            const workbook =
              XLSX.read(buffer, {
                type: "array",
              });

            let excelHTML = "";

            workbook.SheetNames.forEach(
              (sheetName) => {
                const sheet =
                  workbook.Sheets[sheetName];

                const html =
                  XLSX.utils.sheet_to_html(
                    sheet
                  );

                excelHTML += `
                  <div class="uploaded-excel-page">

                    <h3>
                      ${sheetName}
                    </h3>

                    <div class="excel">

                      ${html}

                    </div>

                  </div>
                `;
              }
            );

            return excelHTML;
          }

          // =================================================
          // TXT
          // =================================================

          if (extension === "txt") {
            const text = await blob.text();

            return `
              <div class="uploaded-docx-page">

                <div class="doc-content">

                  ${text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}

                </div>

              </div>
            `;
          }

          // =================================================
          // OTHER FILE
          // =================================================

          const objectURL =
            URL.createObjectURL(blob);

          return `
            <div class="no-data">

              Preview not available.

              <br/><br/>

              <a
                href="${objectURL}"
                target="_blank"
                rel="noreferrer"
              >
                Open ${fileName}
              </a>

            </div>
          `;
        } catch (error) {
          console.error(
            "File Preview Error:",
            error
          );

          return `
            <div class="no-data">
              Unable to load: ${fileName}
            </div>
          `;
        }
      };

      // =====================================================
      // FILE BOX
      // =====================================================

      const fileBox = async (
        title,
        fileName,
        description
      ) => {
        if (!fileName) {
          return "";
        }

        const content =
          await previewFile(fileName);

        return `
          <div class="file-box">

            <div class="file-title">
              ${title}
            </div>

            <div class="file-name">

              File Name:
              ${fileName}

            </div>

            <div class="description">

              <strong>
                Description:
              </strong>

              ${description}

            </div>

            ${content}

          </div>
        `;
      };

      // =====================================================
      // 1.1
      // =====================================================

      let html11 = "";

      const visionFiles = [
        [
          "Vision",
          vision.vision_file,
          "Vision document",
        ],

        [
          "Mission",
          vision.mission_file,
          "Mission document",
        ],

        [
          "PEO 1",
          vision.peo_file1,
          "PEO 1 document",
        ],

        [
          "PEO 2",
          vision.peo_file2,
          "PEO 2 document",
        ],

        [
          "PEO 3",
          vision.peo_file3,
          "PEO 3 document",
        ],

        [
          "Minutes",
          vision.minutes_file,
          "Minutes document",
        ],

        [
          "BoS",
          vision.bos_file,
          "Board of Studies document",
        ],

        [
          "IQAC",
          vision.iqac_file,
          "IQAC document",
        ],

        [
          "Stakeholder",
          vision.stakeholder_file,
          "Stakeholder document",
        ],

        [
          "Stakeholder Feedback",
          vision.stakeholder_feedback_file,
          "Stakeholder feedback",
        ],

        [
          "Industry Consultation",
          vision.industry_consultation_file,
          "Industry consultation",
        ],

        [
          "BoS Approval",
          vision.bos_approval_file,
          "BoS approval",
        ],

        [
          "Website",
          vision.website_file,
          "Website evidence",
        ],

        [
          "Notice Board",
          vision.notice_board_file,
          "Notice board evidence",
        ],

        [
          "Student Handbook",
          vision.student_handbook_file,
          "Student handbook",
        ],

        [
          "Prospectus",
          vision.prospectus_file,
          "Prospectus",
        ],

        [
          "Orientation",
          vision.orientation_file,
          "Orientation",
        ],

        [
          "Communication Plan",
          vision.communication_plan_file,
          "Communication plan",
        ],

        [
          "Meeting Record",
          vision.meeting_record_file,
          "Meeting record",
        ],

        [
          "Justification",
          vision.justification_file,
          "Justification",
        ],
      ];

      for (
        const [
          title,
          file,
          description,
        ] of visionFiles
      ) {
        if (file) {
          html11 += await fileBox(
            title,
            file,
            description
          );
        }
      }

      html11 += `
        <div class="sub-title">
          1.1.5 Mapping of PEOs with Mission
        </div>

        <table>

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

              <th>PEO 1</th>

              <td>${vision.peo1_m1 ?? "-"}</td>
              <td>${vision.peo1_m2 ?? "-"}</td>
              <td>${vision.peo1_m3 ?? "-"}</td>
              <td>${vision.peo1_m4 ?? "-"}</td>

            </tr>

            <tr>

              <th>PEO 2</th>

              <td>${vision.peo2_m1 ?? "-"}</td>
              <td>${vision.peo2_m2 ?? "-"}</td>
              <td>${vision.peo2_m3 ?? "-"}</td>
              <td>${vision.peo2_m4 ?? "-"}</td>

            </tr>

            <tr>

              <th>PEO 3</th>

              <td>${vision.peo3_m1 ?? "-"}</td>
              <td>${vision.peo3_m2 ?? "-"}</td>
              <td>${vision.peo3_m3 ?? "-"}</td>
              <td>${vision.peo3_m4 ?? "-"}</td>

            </tr>

          </tbody>

        </table>
      `;

      // =====================================================
      // 1.2
      // =====================================================

      let html12 = "";

      const curriculumFiles = [
        [
          "Teaching Learning Process",
          curriculum.tlp_attachment,
          "Teaching Learning Process",
        ],

        [
          "Syllabus",
          curriculum.syllabus_file,
          "Syllabus",
        ],

        [
          "Department Subjects",
          curriculum.department_subjects_file,
          "Department subjects",
        ],

        [
          "General Science",
          curriculum.general_science_file,
          "General Science",
        ],

        [
          "MDM / Elective",
          curriculum.mdm_elective_file,
          "MDM / Elective",
        ],

        [
          "Teaching Learning Methods",
          curriculum.teaching_learning_methods_file,
          "Teaching Learning Methods",
        ],

        [
          "Credit Structure",
          curriculum.credit_structure_file,
          "Credit Structure",
        ],

        [
          "Curriculum Gap",
          curriculum.curriculum_gap_file,
          "Curriculum Gap",
        ],

        [
          "Activity",
          curriculum.activity_file,
          "Activity",
        ],
      ];

      for (
        const [
          title,
          file,
          description,
        ] of curriculumFiles
      ) {
        if (file) {
          html12 += await fileBox(
            title,
            file,
            description
          );
        }
      }

      // =====================================================
      // 1.3
      // =====================================================

      let html13 = "";

      const popsoFiles = [
        [
          "PO / PSO",
          popso.po_pso_file,
          "PO / PSO document",
        ],

        [
          "Mapping",
          popso.mapping_file,
          "PO / PSO mapping",
        ],

        [
          "Justification",
          popso.justification_file,
          "PO / PSO justification",
        ],
      ];

      for (
        const [
          title,
          file,
          description,
        ] of popsoFiles
      ) {
        if (file) {
          html13 += await fileBox(
            title,
            file,
            description
          );
        }
      }

      // =====================================================
      // 1.4
      // =====================================================

      let html14 = "";

      if (currentOutcome) {
        html14 += `
          <div class="sub-title">
            Current Course Outcome
          </div>

          <table>

            <tr>
              <th>Academic Year</th>
              <td>${currentOutcome.academic_year || "-"}</td>
            </tr>

            <tr>
              <th>Department</th>
              <td>${currentOutcome.department || "-"}</td>
            </tr>

            <tr>
              <th>Subject Code</th>
              <td>${currentOutcome.subject_code || "-"}</td>
            </tr>

            <tr>
              <th>Course Outcome</th>
              <td>${currentOutcome.course_outcome || "-"}</td>
            </tr>

            <tr>
              <th>Mapped PO</th>
              <td>${currentOutcome.mapped_po || "-"}</td>
            </tr>

          </table>
        `;

        if (currentOutcome.outcome_file) {
          html14 += await fileBox(
            "Course Outcome File",
            currentOutcome.outcome_file,
            "Current Course Outcome file"
          );
        }

        if (currentMatrices.length > 0) {
          html14 += `
            <div class="sub-title">
              Current Course Matrix
            </div>
          `;

          currentMatrices.forEach((row) => {
            html14 += `
              <table>

                <tr>
                  <th>CO ID</th>
                  <td>${row.co_id || "-"}</td>
                </tr>

                <tr>
                  <th>PO1</th>
                  <td>${row.po1 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO2</th>
                  <td>${row.po2 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO3</th>
                  <td>${row.po3 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO4</th>
                  <td>${row.po4 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO5</th>
                  <td>${row.po5 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO6</th>
                  <td>${row.po6 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO7</th>
                  <td>${row.po7 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO8</th>
                  <td>${row.po8 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO9</th>
                  <td>${row.po9 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PO10</th>
                  <td>${row.po10 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PSO1</th>
                  <td>${row.pso1 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PSO2</th>
                  <td>${row.pso2 ?? "-"}</td>
                </tr>

                <tr>
                  <th>PSO3</th>
                  <td>${row.pso3 ?? "-"}</td>
                </tr>

              </table>
            `;
          });

          const matrixFiles = [
            ...new Set(
              currentMatrices
                .map((row) => row.matrix_file)
                .filter(Boolean)
            ),
          ];

          for (const matrixFile of matrixFiles) {
            html14 += await fileBox(
              "Course Matrix File",
              matrixFile,
              "Current Course Matrix file"
            );
          }
        }
      } else {
        html14 = `
          <div class="no-data">
            No current 1.4 data available.
          </div>
        `;
      }

      // =====================================================
      // 1.5
      // =====================================================

      let html15 = "";

      if (currentArticulation.length) {
        html15 = `
          <table>

            <thead>

              <tr>

                <th>Department</th>
                <th>Course Code</th>
                <th>Course Name</th>

                <th>PO1</th>
                <th>PO2</th>
                <th>PO3</th>
                <th>PO4</th>
                <th>PO5</th>
                <th>PO6</th>
                <th>PO7</th>
                <th>PO8</th>
                <th>PO9</th>
                <th>PO10</th>

                <th>PSO1</th>
                <th>PSO2</th>
                <th>PSO3</th>

              </tr>

            </thead>

            <tbody>

              ${currentArticulation
                .map(
                  (row) => `
                    <tr>

                      <td>${row.department || ""}</td>

                      <td>${row.course_code || ""}</td>

                      <td>${row.course_name || ""}</td>

                      <td>${row.po1 ?? ""}</td>
                      <td>${row.po2 ?? ""}</td>
                      <td>${row.po3 ?? ""}</td>
                      <td>${row.po4 ?? ""}</td>
                      <td>${row.po5 ?? ""}</td>
                      <td>${row.po6 ?? ""}</td>
                      <td>${row.po7 ?? ""}</td>
                      <td>${row.po8 ?? ""}</td>
                      <td>${row.po9 ?? ""}</td>
                      <td>${row.po10 ?? ""}</td>

                      <td>${row.pso1 ?? ""}</td>
                      <td>${row.pso2 ?? ""}</td>
                      <td>${row.pso3 ?? ""}</td>

                    </tr>
                  `
                )
                .join("")}

            </tbody>

          </table>
        `;
      } else {
        html15 = `
          <div class="no-data">
            No current 1.5 data available.
          </div>
        `;
      }

      // =====================================================
      // FINAL REPORT
      // =====================================================

      reportWindow.document.getElementById(
        "report"
      ).innerHTML = `

        <div class="section">

          <div class="section-title">
            1.1 Vision, Mission and PEO
          </div>

          ${html11}

        </div>

        <div class="section">

          <div class="section-title">
            1.2 Curriculum
          </div>

          ${html12}

        </div>

        <div class="section">

          <div class="section-title">
            1.3 PO / PSO
          </div>

          ${html13}

        </div>

        <div class="section">

          <div class="section-title">
            1.4 Course Outcomes & Course Matrix
          </div>

          ${html14}

        </div>

        <div class="section">

          <div class="section-title">
            1.5 Articulation Matrix
          </div>

          ${html15}

        </div>
      `;

      reportWindow.focus();

      setTimeout(() => {
        reportWindow.print();
      }, 1000);
    } catch (error) {
      console.error(
        "REPORT ERROR:",
        error
      );

      reportWindow.document.getElementById(
        "report"
      ).innerHTML = `
        <div class="no-data">

          <h3>
            Report Loading Error
          </h3>

          <p>
            ${error.message}
          </p>

        </div>
      `;
    }
  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {
    if (
      !window.confirm(
        "Are you sure you want to clear?"
      )
    ) {
      return;
    }

    setClearMode(true);

    setDepartment("");

    setCourses((prev) =>
      prev.map((row) => ({
        ...row,

        po1: "",
        po2: "",
        po3: "",
        po4: "",
        po5: "",
        po6: "",
        po7: "",
        po8: "",
        po9: "",
        po10: "",

        pso1: "",
        pso2: "",
        pso3: "",
      }))
    );

    localStorage.removeItem(STORAGE_KEY);

    alert("Cleared successfully.");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="articulation-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <NBASidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="articulation-main">

        <div className="matrix-page">

          <div className="matrix-card">

            {/* HEADER */}

            <div className="matrix-header">

              <FaTable />

              <h2>
                1.5 All Courses Articulation Matrix
              </h2>

            </div>

            {/* DEPARTMENT */}

            <div className="dept-section">

              <label>
                Department
              </label>

              <select
                value={department}
                onChange={(e) => {
                  setClearMode(false);
                  setDataLoaded(false);
                  setDepartment(e.target.value);
                }}
              >

                <option value="">
                  Select Department
                </option>

                <option value="Computer Science Engineering">
                  Computer Science Engineering
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="MCA">
                  MCA
                </option>

              </select>

            </div>

            {/* TABLE */}

            <div className="table-wrapper">

              <table className="all-course-table">

                <thead>

                  <tr>

                    <th>
                      Course Code
                    </th>

                    <th>
                      Course Name
                    </th>

                    <th>PO1</th>
                    <th>PO2</th>
                    <th>PO3</th>
                    <th>PO4</th>
                    <th>PO5</th>
                    <th>PO6</th>
                    <th>PO7</th>
                    <th>PO8</th>
                    <th>PO9</th>
                    <th>PO10</th>

                    <th>PSO1</th>
                    <th>PSO2</th>
                    <th>PSO3</th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="16"
                        className="loading-cell"
                      >
                        Loading courses...
                      </td>

                    </tr>

                  ) : courses.length === 0 ? (

                    <tr>

                      <td
                        colSpan="16"
                        className="empty-cell"
                      >
                        Please select a department.
                      </td>

                    </tr>

                  ) : (

                    courses.map(
                      (row, index) => (

                        <tr
                          key={
                            row.id ||
                            `${row.course_code}-${index}`
                          }
                        >

                          {/* COURSE CODE */}

                          <td className="course-code">
                            {row.course_code}
                          </td>

                          {/* COURSE NAME */}

                          <td className="course-name">
                            {row.course_name}
                          </td>

                          {/* PO1 */}

                          <td>
                            <input
                              type="number"
                              value={row.po1 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po1",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO2 */}

                          <td>
                            <input
                              type="number"
                              value={row.po2 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po2",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO3 */}

                          <td>
                            <input
                              type="number"
                              value={row.po3 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po3",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO4 */}

                          <td>
                            <input
                              type="number"
                              value={row.po4 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po4",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO5 */}

                          <td>
                            <input
                              type="number"
                              value={row.po5 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po5",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO6 */}

                          <td>
                            <input
                              type="number"
                              value={row.po6 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po6",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO7 */}

                          <td>
                            <input
                              type="number"
                              value={row.po7 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po7",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO8 */}

                          <td>
                            <input
                              type="number"
                              value={row.po8 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po8",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO9 */}

                          <td>
                            <input
                              type="number"
                              value={row.po9 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po9",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PO10 */}

                          <td>
                            <input
                              type="number"
                              value={row.po10 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "po10",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PSO1 */}

                          <td>
                            <input
                              type="number"
                              value={row.pso1 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "pso1",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PSO2 */}

                          <td>
                            <input
                              type="number"
                              value={row.pso2 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "pso2",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* PSO3 */}

                          <td>
                            <input
                              type="number"
                              value={row.pso3 ?? ""}
                              onChange={(e) =>
                                handleMatrixChange(
                                  index,
                                  "pso3",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          {/* ACTION */}

                          <td className="action-cell">

                            <button
                              type="button"
                              className="edit-btn"
                              title="Edit"
                              onClick={() =>
                                handleRowEdit(row)
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              title="Delete"
                              onClick={() =>
                                handleRowDelete(
                                  row.id
                                )
                              }
                            >
                              <FaTrash />
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

            {/* BUTTONS */}

            <div className="matrix-buttons">

              {/* PREVIOUS */}

              <button
                type="button"
                className="previous-page-btn"
                onClick={handlePrevious}
              >
                ← Previous
              </button>

              {/* BACK */}

              <button
                type="button"
                className="back-btn"
                onClick={() =>
                  navigate("/vision")
                }
              >
                ← Back
              </button>

              {/* SAVE */}

              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <FaSave />

                {loading
                  ? "Saving..."
                  : "Save"}
              </button>

              {/* CLEAR */}

              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
              >
                Clear
              </button>

              {/* NEXT */}

              <button
                type="button"
                className="next-page-btn"
                onClick={() =>
                  navigate("/criteria2")
                }
              >
                Next →
              </button>

              {/* REPORT */}

              <button
                type="button"
                className="print-btn"
                onClick={handleGenerateReport}
              >
                <FaPrint />

                Generate Report
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ArticulationMatrix;