import React, { useState, useEffect } from "react";
import "./ArticulationMatrix.css";
import NBASidebar from "../pages/NBASidebar";
import { FaTable, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import axios from "axios";
import { FaPrint } from "react-icons/fa";
function ArticulationMatrix({
  onNext,
  onPrevious
})  {
  const navigate = useNavigate();
const [department, setDepartment] = useState("");
const STORAGE_KEY = "articulation_matrix_1_5_data";
const [loaded, setLoaded] = useState(false);
const [courses, setCourses] = useState([]);
const [dataLoaded, setDataLoaded] = useState(false);
const [clearMode, setClearMode] = useState(false);
const [editId, setEditId] = useState(null);
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

 const loadCourses = async () => {
console.log(courses);
  if (!department) return;

  const res = await fetch(
    `http://localhost:5000/get-course-master/${department}`
  );

  const data = await res.json();

  console.log("Courses =", data);

  setCourses(
    data.map((row) => ({
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
      pso3:""
    }))
  );

};

useEffect(() => {

  if (!loaded || !department) return;

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    const data = JSON.parse(saved);

    if (
      data.department === department &&
      data.courses &&
      data.courses.length > 0
    ) {
      setCourses(data.courses);
      return;
    }
  }

  loadCourses();

}, [department, loaded]);

useEffect(() => {

  if (!loaded || clearMode || !department) return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      department,
      courses
    })
  );

}, [loaded, clearMode, department, courses]);

const handleSave = async () => {
 
  if (

    !department ||

    courses.length === 0 ||

    !courses.some(row =>
      row.po1 || row.po2 || row.po3 || row.po4 || row.po5 ||
      row.po6 || row.po7 || row.po8 || row.po9 || row.po10 ||
      row.pso1 || row.pso2 || row.pso3
    )

  ) {

    alert("Please fill all required fields.");
    return;

  }

  const hasData = courses.some(row =>
    row.po1 || row.po2 || row.po3 || row.po4 || row.po5 ||
    row.po6 || row.po7 || row.po8 || row.po9 || row.po10 ||
    row.pso1 || row.pso2 || row.pso3
  );

  if (!hasData) {
    alert("Please enter at least one PO/PSO value.");
    return;
  }
  try {

    for (const row of courses) {

      await fetch(
        "http://localhost:5000/save-all-courses-matrix",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
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
          pso3: row.pso3

          })

        }
      );

    }

    alert("All Courses Saved Successfully");

  } catch (error) {

    console.log(error);

    alert("Save Error");

  }

};
const handlePrevious = () => {
  navigate("/course-matrix");
};
const handleUpdate=async()=>{

for(const row of courses){

await fetch(

`http://localhost:5000/update-all-courses-matrix/${row.id}`,

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

department,

courseCode:row.course_code,
courseName:row.course_name,

po1:row.po1,
po2:row.po2,
po3:row.po3,
po4:row.po4,
po5:row.po5,
po6:row.po6,
po7:row.po7,
po8:row.po8,
po9:row.po9,
po10:row.po10,

pso1:row.pso1,
pso2:row.pso2,
pso3:row.pso3

})

}

);

}

alert("Updated Successfully");

};
const handleDelete = () => {

  alert("Select a row and delete.");

};
const handleRowDelete=async(id)=>{

if(!window.confirm("Delete Record?"))
return;

await fetch(

`http://localhost:5000/delete-all-courses-matrix/${id}`,

{
method:"DELETE"
}

);

setCourses(

courses.filter((row)=>row.id!==id)

);

};
const handleRowEdit=(row)=>{

setEditId(row.id);

}
;

const [loading, setLoading] = useState(false);

const handleGenerateReport = async () => {

  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    alert("Please allow pop-ups.");
    return;
  }

  reportWindow.document.write(`
    <html>
    <head>

      <title>Criteria 1 Report</title>

      <style>

        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #222;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #203648;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header h1 {
          color: #203648;
          margin: 0;
        }

        .header h2 {
          color: #0068c9;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          background: #203648;
          color: white;
          padding: 12px;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .sub-title {
          color: #0068c9;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        th,
        td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background: #eef3f7;
          width: 220px;
        }

        .file-box {
          border: 1px solid #ccc;
          padding: 15px;
          margin: 20px 0;
          page-break-inside: avoid;
        }

        .file-title {
          color: #0068c9;
          font-weight: bold;
          font-size: 17px;
        }

        .file-name {
          margin-top: 8px;
          font-weight: bold;
        }

        .description {
          margin-top: 8px;
          color: #555;
        }

        .pdf {
          width: 100%;
          height: 700px;
          border: 1px solid #aaa;
        }

        .image {
          max-width: 100%;
          max-height: 700px;
          display: block;
          margin: auto;
        }

        .doc-content {
          border: 1px solid #ddd;
          padding: 20px;
          margin-top: 10px;
        }

        .excel {
          overflow-x: auto;
        }

        .excel table {
          width: 100%;
          border-collapse: collapse;
        }

        .excel th {
          background: #203648;
          color: white;
        }

        .no-data {
          text-align: center;
          padding: 25px;
          color: #777;
          border: 1px dashed #aaa;
        }

        .print-btn {
          position: fixed;
          right: 20px;
          top: 20px;
          padding: 10px 20px;
          background: #0068c9;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        @media print {
          .print-btn {
            display: none;
          }
        }

      </style>

    </head>

    <body>

      <button
        class="print-btn"
        onclick="window.print()"
      >
        🖨 Print Report
      </button>

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
    // FETCH CURRENT DATA
    // =====================================================

    const visionResponse =
      await axios.get(
        "http://localhost:5000/print-vision-files"
      );

    const curriculumResponse =
      await axios.get(
        "http://localhost:5000/get-curriculum"
      );
console.log(
  "CURRICULUM DATA =",
  curriculumResponse.data
);
    const popsoResponse =
      await axios.get(
        "http://localhost:5000/get-popso"
      );

    const outcomeResponse =
      await axios.get(
        "http://localhost:5000/get-course-outcomes"
      );

    const matrixResponse =
      await axios.get(
        "http://localhost:5000/get-course-matrix"
      );

    const articulationResponse =
      await axios.get(
        "http://localhost:5000/get-all-courses-matrix"
      );


    // =====================================================
    // CURRENT 1.1
    // =====================================================

    const vision =
      visionResponse.data || {};


    // =====================================================
    // CURRENT 1.2
    // =====================================================

    const curriculum =
      curriculumResponse.data || {};


    // =====================================================
    // CURRENT 1.3
    // =====================================================

    const popso =
      popsoResponse.data || {};


    // =====================================================
    // 1.4
    // ONLY CURRENT RECORD
    // =====================================================

    const outcomes =
      Array.isArray(outcomeResponse.data)
        ? outcomeResponse.data
        : [];


    const matrices =
      Array.isArray(matrixResponse.data)
        ? matrixResponse.data
        : [];


    const currentOutcome =
      outcomes.length
        ? outcomes[0]
        : null;


    let currentMatrices = [];


    if (currentOutcome) {

      currentMatrices =
        matrices.filter(row =>

          row.academic_year ===
            currentOutcome.academic_year &&

          row.department ===
            currentOutcome.department &&

          row.subject_code ===
            currentOutcome.subject_code

        );

    }


    // =====================================================
    // 1.5
    // CURRENT DEPARTMENT ONLY
    // =====================================================

    const articulation =
      Array.isArray(articulationResponse.data)
        ? articulationResponse.data
        : [];


    /*
      Latest saved department is taken
      from newest row.
    */

    const latestArticulation =
      articulation.length
        ? articulation[articulation.length - 1]
        : null;


    let currentArticulation = [];


    if (latestArticulation) {

      currentArticulation =
        articulation.filter(
          row =>
            row.department ===
            latestArticulation.department
        );

    }


    // =====================================================
    // FILE PREVIEW
    // =====================================================

    const previewFile = async (
      fileName
    ) => {

      if (!fileName) {
        return "";
      }


      try {

        const response =
          await fetch(
            `http://localhost:5000/download/${encodeURIComponent(
              fileName
            )}`
          );


        if (!response.ok) {

          return `
            <div class="no-data">
              File not found:
              ${fileName}
            </div>
          `;

        }


        const blob =
          await response.blob();


        const extension =
          fileName
            .split(".")
            .pop()
            .toLowerCase();


        const objectURL =
          URL.createObjectURL(blob);


        // =================================================
        // PDF
        // =================================================

        if (extension === "pdf") {

          return `

            <iframe
              class="pdf"
              src="${objectURL}"
            ></iframe>

          `;

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

          return `

            <img
              class="image"
              src="${objectURL}"
            />

          `;

        }


        // =================================================
        // DOCX
        // =================================================

        if (extension === "docx") {

          try {

            const buffer =
              await blob.arrayBuffer();


            const result =
              await mammoth.convertToHtml({
                arrayBuffer: buffer
              });


            return `

              <div class="doc-content">

                ${result.value}

              </div>

            `;

          } catch (error) {

            return `

              <div class="no-data">

                Unable to preview DOCX.

                <br/>

                ${fileName}

              </div>

            `;

          }

        }


        // =================================================
        // XLSX / XLS
        // =================================================

        if (
          extension === "xlsx" ||
          extension === "xls"
        ) {

          try {

            const buffer =
              await blob.arrayBuffer();


            if (
              !buffer ||
              buffer.byteLength === 0
            ) {

              return `

                <div class="no-data">

                  Empty Excel file.

                  <br/>

                  ${fileName}

                </div>

              `;

            }


            const workbook =
              XLSX.read(
                buffer,
                {
                  type: "array"
                }
              );


            let excelHTML = "";


            workbook.SheetNames.forEach(
              sheetName => {

                const sheet =
                  workbook.Sheets[sheetName];


                const html =
                  XLSX.utils.sheet_to_html(
                    sheet
                  );


                excelHTML += `

                  <h3>
                    ${sheetName}
                  </h3>

                  <div class="excel">

                    ${html}

                  </div>

                `;

              }
            );


            return excelHTML;

          } catch (error) {

            console.error(
              "Excel Preview Error:",
              fileName,
              error
            );


            return `

              <div class="no-data">

                Unable to preview this Excel file.

                <br/>

                File Name:
                <strong>
                  ${fileName}
                </strong>

              </div>

            `;

          }

        }


        // =================================================
        // TXT
        // =================================================

        if (extension === "txt") {

          const text =
            await blob.text();


          return `

            <div class="doc-content">

              ${text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
              }

            </div>

          `;

        }


        // =================================================
        // OTHER FILES
        // =================================================

        return `

          <div class="no-data">

            Preview not available.

            <br/><br/>

            <a
              href="${objectURL}"
              target="_blank"
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

            Unable to load:

            ${fileName}

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
        await previewFile(
          fileName
        );


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
        "Vision document"
      ],

      [
        "Mission",
        vision.mission_file,
        "Mission document"
      ],

      [
        "PEO 1",
        vision.peo_file1,
        "PEO 1 document"
      ],

      [
        "PEO 2",
        vision.peo_file2,
        "PEO 2 document"
      ],

      [
        "PEO 3",
        vision.peo_file3,
        "PEO 3 document"
      ],

      [
        "Minutes",
        vision.minutes_file,
        "Minutes document"
      ],

      [
        "BoS",
        vision.bos_file,
        "Board of Studies document"
      ],

      [
        "IQAC",
        vision.iqac_file,
        "IQAC document"
      ],

      [
        "Stakeholder",
        vision.stakeholder_file,
        "Stakeholder document"
      ],

      [
        "Stakeholder Feedback",
        vision.stakeholder_feedback_file,
        "Stakeholder feedback"
      ],

      [
        "Industry Consultation",
        vision.industry_consultation_file,
        "Industry consultation"
      ],

      [
        "BoS Approval",
        vision.bos_approval_file,
        "BoS approval"
      ],

      [
        "Website",
        vision.website_file,
        "Website evidence"
      ],

      [
        "Notice Board",
        vision.notice_board_file,
        "Notice board evidence"
      ],

      [
        "Student Handbook",
        vision.student_handbook_file,
        "Student handbook"
      ],

      [
        "Prospectus",
        vision.prospectus_file,
        "Prospectus"
      ],

      [
        "Orientation",
        vision.orientation_file,
        "Orientation"
      ],

      [
        "Communication Plan",
        vision.communication_plan_file,
        "Communication plan"
      ],

      [
        "Meeting Record",
        vision.meeting_record_file,
        "Meeting record"
      ],

      [
        "Justification",
        vision.justification_file,
        "Justification"
      ]

    ];


    for (
      const [title, file, description]
      of visionFiles
    ) {

      if (file) {

        html11 +=
          await fileBox(
            title,
            file,
            description
          );

      }

    }
// =====================================================
// 1.1.5 PEO - MISSION MAPPING MATRIX
// =====================================================

html11 += `

  <div class="sub-title">
    1.1.5 Mapping of PEOs with Mission
  </div>

  <table>

    <thead>

      <tr>

        <th>
          PEO / Mission
        </th>

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

  <p>
    <strong>Correlation:</strong>
    3 = Strong &nbsp; | &nbsp;
    2 = Moderate &nbsp; | &nbsp;
    1 = Weak &nbsp; | &nbsp;
    0 = No Correlation
  </p> 

`;

    // =====================================================
    // 1.2
    // =====================================================

    let html12 = "";


    const curriculumFiles = [

      [
        "Teaching Learning Process",
        curriculum.tlp_attachment,
        "Teaching Learning Process"
      ],

      [
        "Syllabus",
        curriculum.syllabus_file,
        "Syllabus"
      ],

      [
        "Department Subjects",
        curriculum.department_subjects_file,
        "Department subjects"
      ],

      [
        "General Science",
        curriculum.general_science_file,
        "General Science"
      ],

      [
        "MDM / Elective",
        curriculum.mdm_elective_file,
        "MDM / Elective"
      ],

      [
        "Teaching Learning Methods",
        curriculum.teaching_learning_methods_file,
        "Teaching Learning Methods"
      ],

      [
        "Credit Structure",
        curriculum.credit_structure_file,
        "Credit Structure"
      ],

      [
        "Curriculum Gap",
        curriculum.curriculum_gap_file,
        "Curriculum Gap"
      ],

      [
        "Activity",
        curriculum.activity_file,
        "Activity"
      ]

    ];


    for (
      const [title, file, description]
      of curriculumFiles
    ) {

      if (file) {

        html12 +=
          await fileBox(
            title,
            file,
            description
          );

      }

    }
// =====================================================
// 1.2.4 CONTENT BEYOND SYLLABUS
// =====================================================

if (
  curriculum.academic_year ||
  curriculum.semester ||
  curriculum.activity_name ||
  curriculum.faculty_name ||
  curriculum.activity_file
) {

  html12 += `

    <div class="sub-title">
      1.2.4 Content Beyond Syllabus
    </div>

    <table>

      <thead>
        <tr>
          <th>Academic Year</th>
          <th>Semester</th>
          <th>Activity Name</th>
          <th>Faculty</th>
          <th>Document</th>
        </tr>
      </thead>

      <tbody>
        <tr>

          <td>
            ${curriculum.academic_year || "-"}
          </td>

          <td>
            ${curriculum.semester || "-"}
          </td>

          <td>
            ${curriculum.activity_name || "-"}
          </td>

          <td>
            ${curriculum.faculty_name || "-"}
          </td>

          <td>
            ${curriculum.activity_file || "-"}
          </td>

        </tr>
      </tbody>

    </table>

  `;

}

    // =====================================================
    // 1.3
    // =====================================================

    let html13 = "";


    const popsoFiles = [

      [
        "PO / PSO",
        popso.po_pso_file,
        "PO / PSO document"
      ],

      [
        "Mapping",
        popso.mapping_file,
        "PO / PSO mapping"
      ],

      [
        "Justification",
        popso.justification_file,
        "PO / PSO justification"
      ]

    ];


    for (
      const [title, file, description]
      of popsoFiles
    ) {

      if (file) {

        html13 +=
          await fileBox(
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

            <th>
              Academic Year
            </th>

            <td>
              ${currentOutcome.academic_year || "-"}
            </td>

          </tr>


          <tr>

            <th>
              Department
            </th>

            <td>
              ${currentOutcome.department || "-"}
            </td>

          </tr>


          <tr>

            <th>
              Subject Code
            </th>

            <td>
              ${currentOutcome.subject_code || "-"}
            </td>

          </tr>


          <tr>

            <th>
              Course Outcome
            </th>

            <td>
              ${currentOutcome.course_outcome || "-"}
            </td>

          </tr>


          <tr>

            <th>
              Mapped PO
            </th>

            <td>
              ${currentOutcome.mapped_po || "-"}
            </td>

          </tr>

        </table>

      `;


      if (
        currentOutcome.outcome_file
      ) {

        html14 +=
          await fileBox(
            "Course Outcome File",
            currentOutcome.outcome_file,
            "Current Course Outcome file"
          );

      }


      // ===================================================
      // CURRENT MATRIX
      // ===================================================

      currentMatrices.forEach(
        row => {

          html14 += `

            <table>

              <tr>

                <th>
                  CO ID
                </th>

                <td>
                  ${row.co_id || "-"}
                </td>

              </tr>

              <tr>

                <th>
                  PO1
                </th>

                <td>
                  ${row.po1 ?? "-"}
                </td>

              </tr>

              <tr>

                <th>
                  PO2
                </th>

                <td>
                  ${row.po2 ?? "-"}
                </td>

              </tr>

              <tr>

                <th>
                  PO3
                </th>

                <td>
                  ${row.po3 ?? "-"}
                </td>

              </tr>

              <tr>

                <th>
                  PO4
                </th>

                <td>
                  ${row.po4 ?? "-"}
                </td>

              </tr>

              <tr>

                <th>
                  PO5
                </th>

                <td>
                  ${row.po5 ?? "-"}
                </td>

              </tr>

            </table>

          `;

        }
      );

// -------------------------------------------------
// MATRIX FILE
// SHOW ONLY ONCE
// -------------------------------------------------

const matrixFiles = [
  ...new Set(
    currentMatrices
      .map(row => row.matrix_file)
      .filter(Boolean)
  )
];

for (
  const matrixFile
  of matrixFiles
) {

  html14 += await fileBox(
    "Course Matrix File",
    matrixFile,
    "Current Course Matrix file"
  );

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


    if (
      currentArticulation.length
    ) {


      html15 = `

        <table>

          <tr>

            <th>
              Department
            </th>

            <th>
              Course Code
            </th>

            <th>
              Course Name
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
              PO6
            </th>

            <th>
              PO7
            </th>

            <th>
              PO8
            </th>

            <th>
              PO9
            </th>

            <th>
              PO10
            </th>

            <th>
              PSO1
            </th>

            <th>
              PSO2
            </th>

            <th>
              PSO3
            </th>

          </tr>


          ${
            currentArticulation
              .map(
                row => `

                  <tr>

                    <td>
                      ${row.department || ""}
                    </td>

                    <td>
                      ${row.course_code || ""}
                    </td>

                    <td>
                      ${row.course_name || ""}
                    </td>

                    <td>
                      ${row.po1 ?? ""}
                    </td>

                    <td>
                      ${row.po2 ?? ""}
                    </td>

                    <td>
                      ${row.po3 ?? ""}
                    </td>

                    <td>
                      ${row.po4 ?? ""}
                    </td>

                    <td>
                      ${row.po5 ?? ""}
                    </td>

                    <td>
                      ${row.po6 ?? ""}
                    </td>

                    <td>
                      ${row.po7 ?? ""}
                    </td>

                    <td>
                      ${row.po8 ?? ""}
                    </td>

                    <td>
                      ${row.po9 ?? ""}
                    </td>

                    <td>
                      ${row.po10 ?? ""}
                    </td>

                    <td>
                      ${row.pso1 ?? ""}
                    </td>

                    <td>
                      ${row.pso2 ?? ""}
                    </td>

                    <td>
                      ${row.pso3 ?? ""}
                    </td>

                  </tr>

                `
              )
              .join("")
          }

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
    // SHOW REPORT
    // =====================================================

    reportWindow.document.getElementById(
      "report"
    ).innerHTML = `


      <div class="section">

        <div class="section-title">
          1.1 Vision, Mission and PEO
        </div>

        ${
          html11 ||
          `<div class="no-data">
             No current data available.
           </div>`
        }

      </div>


      <div class="section">

        <div class="section-title">
          1.2 Curriculum
        </div>

        ${
          html12 ||
          `<div class="no-data">
             No current data available.
           </div>`
        }

      </div>


      <div class="section">

        <div class="section-title">
          1.3 PO / PSO
        </div>

        ${
          html13 ||
          `<div class="no-data">
             No current data available.
           </div>`
        }

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

        ${error.message}

      </div>

    `;

  }

};
const handleClear = () => {

  if (!window.confirm("Are you sure you want to clear?")) {
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
      pso3: ""
    }))
  );

  localStorage.removeItem(STORAGE_KEY);

  alert("Cleared successfully.");
};
  return (
    <div className="matrix-page">

      <div className="matrix-card">

        <div className="matrix-header">
          <FaTable />
          <h2>1.5 All Courses Articulation Matrix</h2>
        </div>

       <div className="dept-section">
          <label>Department</label>

          <select
    value={department}
    onChange={(e) => {
  setClearMode(false);
  setDepartment(e.target.value);
}}
>

<option value="">Select Department</option>

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

{/* Description */}




{/* Context Box */}


<div className="table-wrapper"></div>
     <table className="all-course-table">

          <thead>
            <tr>
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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

{courses.map((row, index) => (

<tr key={index}>

<td>{row.course_code}</td>

<td className="course-name">
  {row.course_name}
</td>

<td>
  <input
    type="number"
    value={row.po1}
    onChange={(e) => {
      const temp = [...courses];
      temp[index].po1 = e.target.value;
      setCourses(temp);
    }}
  />
</td>
<td>
<input
type="number"
value={row.po2}
onChange={(e)=>{

const temp=[...courses];

temp[index].po2=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po3}
onChange={(e)=>{

const temp=[...courses];

temp[index].po3=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po4}
onChange={(e)=>{

const temp=[...courses];

temp[index].po4=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po5}
onChange={(e)=>{

const temp=[...courses];

temp[index].po5=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po6}
onChange={(e)=>{

const temp=[...courses];

temp[index].po6=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po7}
onChange={(e)=>{

const temp=[...courses];

temp[index].po7=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po8}
onChange={(e)=>{

const temp=[...courses];

temp[index].po8=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po9}
onChange={(e)=>{

const temp=[...courses];

temp[index].po9=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.po10}
onChange={(e)=>{

const temp=[...courses];

temp[index].po10=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso1}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso1=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso2}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso2=e.target.value;

setCourses(temp);

}}
/>
</td>
<td>
<input
type="number"
value={row.pso3}
onChange={(e)=>{

const temp=[...courses];

temp[index].pso3=e.target.value;

setCourses(temp);

}}
/>
</td>

                <td className="action-cell">
<button
className="edit-btn"
onClick={()=>handleRowEdit(row)}
>
<FaEdit/>
</button>
  <button
className="delete-btn"
onClick={()=>handleRowDelete(row.id)}
>
<FaTrash/>
</button>

</td>

              </tr>
            ))}

          </tbody>

        </table>

       <div className="matrix-buttons">
       <button
  className="previous-page-btn"
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
    className="save-btn"
    onClick={handleSave}
  >
    <FaSave /> Save
  </button>
  <button
  className="clear-btn"
  onClick={handleClear}
>
  Clear
</button>
<button
  className="next-page-btn"
  onClick={() => navigate("/criteria2")}
>
  Next →
</button>
<button
className="print-btn"
onClick={handleGenerateReport}
>

<FaPrint/>

Generate Report (1.1 - 1.5)

</button>
</div>

      </div> 

    </div>
  );
}

export default ArticulationMatrix;