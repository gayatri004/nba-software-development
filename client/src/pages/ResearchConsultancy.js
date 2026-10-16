import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

import NBASidebar from "./NBASidebar";
import "./ResearchConsultancy.css";

function ResearchConsultancy() {

  const navigate = useNavigate();

  // =====================================================
  // SECTIONS
  // =====================================================

  const sections = [
    {
      no: "6.2.1",
      title: "Academic Research",
      route: "/criteria6/academic-research"
    },
    {
      no: "6.2.2",
      title: "Ph.D. Student Details",
      route: "/criteria6/phd-student"
    },
    {
      no: "6.2.3",
      title: "Development Activities",
      route: "/criteria6/development-activities"
    },
    {
      no: "6.2.4",
      title: "Sponsored Research Projects",
      route: "/criteria6/sponsored-research"
    },
    {
      no: "6.2.5",
      title: "Consultancy Work",
      route: "/criteria6/consultancy"
    },
    {
      no: "6.2.6",
      title: "Institution Seed Money / Internal Research Grant",
      route: "/criteria6/seed-money"
    }
  ];


  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerateReport = async () => {

    const escapeHTML = (value) => {

      if (
        value === null ||
        value === undefined
      ) {
        return "-";
      }

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };


    // =====================================================
    // OPEN REPORT WINDOW
    // =====================================================

    const reportWindow =
      window.open("", "_blank");


    if (!reportWindow) {

      alert(
        "Please allow pop-ups for this website."
      );

      return;
    }


    // =====================================================
    // REPORT PAGE
    // =====================================================

    reportWindow.document.write(`

      <html>

      <head>

        <title>
          Criteria 6 Report
        </title>

        <style>

          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 10mm;
            font-family: Arial, sans-serif;
            color: #222;
            background: white;
            font-size: 16px;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #203648;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0;
            color: #203648;
            font-size: 24px;
          }

          .header h2 {
            margin: 7px 0;
            color: #0068c9;
            font-size: 20px;
          }

          .header p {
            margin: 5px 0;
            font-size: 13px;
          }

          .section-title {
            background: #203648;
            color: white;
            padding: 10px 12px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 19px;
            font-weight: bold;
            page-break-after: avoid;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 15px;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 9px 10px;
            font-size: 14px;
            line-height: 1.4;
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          th {
            background: #eef3f7;
          }

          .file-box {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 12px 0;
            page-break-inside: avoid;
          }

          .file-title {
            color: #0068c9;
            font-size: 18px;
            font-weight: bold;
          }

          .file-name {
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
          }

          .description {
            margin-top: 5px;
            font-size: 14px;
            color: #555;
          }

          .file-preview {
            width: 100%;
            margin-top: 10px;
          }

          .file-preview img {
            max-width: 100%;
            max-height: 650px;
            display: block;
            margin: auto;
            object-fit: contain;
          }

          .pdf-frame {
            width: 100%;
            height: 650px;
            border: none;
          }

          .doc-content {
            border: 1px solid #ddd;
            padding: 10px;
            width: 100%;
            overflow-wrap: anywhere;
            font-size: 15px;
            line-height: 1.5;
          }

          .doc-content img {
            max-width: 100%;
            height: auto;
          }

          .doc-content table {
            width: 100%;
            table-layout: fixed;
          }

          .doc-content p {
            font-size: 15px;
            line-height: 1.5;
          }

          .doc-content h1 {
            font-size: 26px;
          }

          .doc-content h2 {
            font-size: 22px;
          }

          .doc-content h3 {
            font-size: 19px;
          }

          .excel {
            width: 100%;
            overflow: hidden;
          }

          .excel table {
            width: 100%;
          }

          .excel th,
          .excel td {
            font-size: 8px;
          }

          .no-data {
            padding: 20px;
            text-align: center;
            color: #777;
            border: 1px dashed #aaa;
          }

          .page-break {
            page-break-before: always;
            break-before: page;
          }

          @media print {

            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            body {
              padding: 0;
            }

            .pdf-frame {
              height: 650px;
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
            Criteria 6 Report
          </h2>

          <p>
            Current Data — Criteria 6.1.1 to 6.2.6
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
      // GET ALL CRITERIA 6 DATA
      // =====================================================

      const [

        membershipsResponse,
        resourcePersonsResponse,
        participationResponse,
        moocsResponse,
        fdpResponse,
        studentProjectsResponse,
        internshipsResponse,
        academicResearchResponse,
        phdResponse,
        developmentResponse,
        sponsoredResponse,
        consultancyResponse,
        seedMoneyResponse

      ] = await Promise.all([

        // 6.1.1
        axios.get(
          "http://localhost:5000/api/memberships"
        ),

        // 6.1.2
        axios.get(
          "http://localhost:5000/api/resource-persons"
        ),

        // 6.1.2.2
        axios.get(
          "http://localhost:5000/api/participations"
        ),

        // 6.1.3
        axios.get(
          "http://localhost:5000/api/moocs"
        ),

        // 6.1.4
        axios.get(
          "http://localhost:5000/api/fdp-records"
        ),

        // 6.1.5
        axios.get(
          "http://localhost:5000/api/student-projects"
        ),

        // 6.1.6
        axios.get(
          "http://localhost:5000/api/internships"
        ),

        // 6.2.1
        axios.get(
          "http://localhost:5000/api/academic-research"
        ),

        // 6.2.2
        axios.get(
          "http://localhost:5000/api/phd-students"
        ),

        // 6.2.3
        axios.get(
          "http://localhost:5000/api/development-activities"
        ),

        // 6.2.4
        axios.get(
          "http://localhost:5000/api/sponsored-research"
        ),

        // 6.2.5
        axios.get(
          "http://localhost:5000/api/consultancy-work"
        ),

        // 6.2.6
        axios.get(
          "http://localhost:5000/api/seed-money"
        )

      ]);


      // =====================================================
      // GET CURRENT / LATEST RECORD
      // =====================================================

      const getCurrent = (response) => {

        if (
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {

          return response.data
            .slice()
            .sort(
              (a, b) =>
                Number(b.id || 0) -
                Number(a.id || 0)
            )[0];
        }

        return null;
      };


      const memberships =
        getCurrent(membershipsResponse);

      const resourcePersons =
        getCurrent(resourcePersonsResponse);

      const participation =
        getCurrent(participationResponse);

      const moocs =
        getCurrent(moocsResponse);

      const fdp =
        getCurrent(fdpResponse);

      const studentProjects =
        getCurrent(studentProjectsResponse);

      const internships =
        getCurrent(internshipsResponse);

      const academicResearch =
        getCurrent(academicResearchResponse);

      const phd =
        getCurrent(phdResponse);

      const development =
        getCurrent(developmentResponse);

      const sponsored =
        getCurrent(sponsoredResponse);

      const consultancy =
        getCurrent(consultancyResponse);

      const seedMoney =
        getCurrent(seedMoneyResponse);


      // =====================================================
      // FILE PREVIEW
      // =====================================================

      const previewFile = async (fileName) => {

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

                ${escapeHTML(fileName)}

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

              <div class="file-preview">

                <iframe
                  class="pdf-frame"
                  src="${objectURL}"
                ></iframe>

              </div>

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

              <div class="file-preview">

                <img
                  src="${objectURL}"
                />

              </div>

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

                <div class="file-preview">

                  <div class="doc-content">

                    ${result.value}

                  </div>

                </div>

              `;

            } catch (error) {

              return `

                <div class="no-data">

                  Unable to preview DOCX.

                  <br/>

                  ${escapeHTML(fileName)}

                </div>

              `;
            }
          }


          // =================================================
          // EXCEL
          // =================================================

          if (
            extension === "xlsx" ||
            extension === "xls"
          ) {

            try {

              const buffer =
                await blob.arrayBuffer();


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

                      ${escapeHTML(sheetName)}

                    </h3>

                    <div class="excel">

                      ${html}

                    </div>

                  `;

                }
              );


              return `

                <div class="file-preview">

                  ${excelHTML}

                </div>

              `;

            } catch (error) {

              return `

                <div class="no-data">

                  Unable to preview Excel file.

                  <br/>

                  ${escapeHTML(fileName)}

                </div>

              `;
            }
          }


          return `

            <div class="no-data">

              Preview not available.

              <br/>

              File:

              <strong>
                ${escapeHTML(fileName)}
              </strong>

            </div>

          `;

        } catch (error) {

          return `

            <div class="no-data">

              Unable to load:

              ${escapeHTML(fileName)}

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

              ${escapeHTML(title)}

            </div>


            <div class="file-name">

              File Name:

              ${escapeHTML(fileName)}

            </div>


            <div class="description">

              <strong>
                Description:
              </strong>

              ${escapeHTML(description)}

            </div>


            ${content}

          </div>

        `;
      };


      // =====================================================
      // CURRENT DATA TABLE
      // =====================================================

      const createCurrentTable = (record) => {

        if (!record) {

          return `

            <div class="no-data">

              No current data available.

            </div>

          `;
        }


        const keys =
          Object.keys(record)
            .filter(
              key =>
                key !== "id" &&
                key !== "created_at"
            );


        let html = `

          <table>

            <thead>

              <tr>

                <th>
                  Field
                </th>

                <th>
                  Current Data
                </th>

              </tr>

            </thead>

            <tbody>

        `;


        keys.forEach(key => {

          html += `

            <tr>

              <th>

                ${escapeHTML(key)}

              </th>

              <td>

                ${escapeHTML(record[key])}

              </td>

            </tr>

          `;

        });


        html += `

            </tbody>

          </table>

        `;


        return html;
      };


      // =====================================================
      // FIND DOCUMENT FIELD
      // =====================================================

      const getDocument = (record) => {

        if (!record) {
          return null;
        }


        const possibleKeys = [

          "document",
          "file",
          "file_name",
          "filename",
          "document_file",

          "membership_file",
          "resource_file",
          "participation_file",
          "mooc_file",
          "fdp_file",
          "project_file",
          "internship_file",

          "research_file",
          "phd_file",
          "development_file",
          "sponsored_file",
          "consultancy_file",
          "seed_money_file",

          "supporting_document"

        ];


        for (
          const key of possibleKeys
        ) {

          if (record[key]) {

            return record[key];

          }

        }


        return null;
      };


      // =====================================================
      // FINAL REPORT HTML
      // =====================================================

      const reportHTML = `

        <div class="section-title">
          6.1 Faculty Development and Activities
        </div>


        <div class="section-title">
          6.1.1 Memberships
        </div>

        ${createCurrentTable(memberships)}

        ${
          await fileBox(
            "6.1.1 Membership Document",
            getDocument(memberships),
            "Current Membership supporting document"
          )
        }


        <div class="section-title">
          6.1.2 Resource Persons
        </div>

        ${createCurrentTable(resourcePersons)}

        ${
          await fileBox(
            "6.1.2 Resource Person Document",
            getDocument(resourcePersons),
            "Current Resource Person supporting document"
          )
        }


        <div class="section-title">
          6.1.2.2 Participation
        </div>

        ${createCurrentTable(participation)}

        ${
          await fileBox(
            "6.1.2.2 Participation Document",
            getDocument(participation),
            "Current Participation supporting document"
          )
        }


        <div class="section-title">
          6.1.3 MOOCs
        </div>

        ${createCurrentTable(moocs)}

        ${
          await fileBox(
            "6.1.3 MOOC Document",
            getDocument(moocs),
            "Current MOOC supporting document"
          )
        }


        <div class="section-title">
          6.1.4 FDP / STTP
        </div>

        ${createCurrentTable(fdp)}

        ${
          await fileBox(
            "6.1.4 FDP / STTP Document",
            getDocument(fdp),
            "Current FDP / STTP supporting document"
          )
        }


        <div class="section-title">
          6.1.5 Student Innovative Projects
        </div>

        ${createCurrentTable(studentProjects)}

        ${
          await fileBox(
            "6.1.5 Student Project Document",
            getDocument(studentProjects),
            "Current Student Innovative Project supporting document"
          )
        }


        <div class="section-title">
          6.1.6 Internship / Training
        </div>

        ${createCurrentTable(internships)}

        ${
          await fileBox(
            "6.1.6 Internship / Training Document",
            getDocument(internships),
            "Current Internship / Training supporting document"
          )
        }


        <div class="section-title">
          6.2 Research & Consultancy
        </div>


        <div class="section-title">
          6.2.1 Academic Research
        </div>

        ${createCurrentTable(academicResearch)}

        ${
          await fileBox(
            "6.2.1 Academic Research Document",
            getDocument(academicResearch),
            "Current Academic Research supporting document"
          )
        }


        <div class="section-title">
          6.2.2 Ph.D. Student Details
        </div>

        ${createCurrentTable(phd)}

        ${
          await fileBox(
            "6.2.2 Ph.D. Student Document",
            getDocument(phd),
            "Current Ph.D. Student supporting document"
          )
        }


        <div class="section-title">
          6.2.3 Development Activities
        </div>

        ${createCurrentTable(development)}

        ${
          await fileBox(
            "6.2.3 Development Activity Document",
            getDocument(development),
            "Current Development Activity supporting document"
          )
        }


        <div class="section-title">
          6.2.4 Sponsored Research Projects
        </div>

        ${createCurrentTable(sponsored)}

        ${
          await fileBox(
            "6.2.4 Sponsored Research Document",
            getDocument(sponsored),
            "Current Sponsored Research supporting document"
          )
        }


        <div class="section-title">
          6.2.5 Consultancy Work
        </div>

        ${createCurrentTable(consultancy)}

        ${
          await fileBox(
            "6.2.5 Consultancy Document",
            getDocument(consultancy),
            "Current Consultancy supporting document"
          )
        }


        <div class="section-title">
          6.2.6 Institution Seed Money / Internal Research Grant
        </div>

        ${createCurrentTable(seedMoney)}

        ${
          await fileBox(
            "6.2.6 Seed Money Document",
            getDocument(seedMoney),
            "Current Seed Money / Internal Research Grant supporting document"
          )
        }

      `;


      // =====================================================
      // SHOW REPORT
      // =====================================================

      reportWindow.document.getElementById(
        "report"
      ).innerHTML = reportHTML;


      // =====================================================
      // PRINT
      // =====================================================

      reportWindow.focus();


      setTimeout(() => {

        reportWindow.print();

      }, 1000);


    } catch (error) {

      console.error(
        "CRITERIA 6 REPORT ERROR:",
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

            ${escapeHTML(error.message)}

          </p>

        </div>

      `;
    }

  };


  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="research-page-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <NBASidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="research-main-content">

        <div className="research-container">

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="research-title">

            <h2>
              Research & Consultancy
            </h2>

            <p>
              Criterion 6.2 Research Activities
            </p>

          </div>


          {/* =================================================
              RESEARCH CARDS
          ================================================= */}

          {sections.map((item, index) => (

            <div
              className="research-card"
              key={index}
            >

              <div>

                <h3>

                  {item.no} {item.title}

                </h3>

                <p>

                  Upload and maintain supporting documents.

                </p>

              </div>


              <div className="research-buttons">

                <button
                  className="research-view-btn"
                  onClick={() =>
                    navigate(
                      item.route + "/view"
                    )
                  }
                >
                  View
                </button>


                <button
                  className="research-add-btn"
                  onClick={() =>
                    navigate(
                      item.route + "/add"
                    )
                  }
                >
                  Add
                </button>

              </div>

            </div>

          ))}


          {/* =================================================
              BOTTOM NAVIGATION
          ================================================= */}

          <div className="module-navigation">

            <button
              className="module-prev"
              onClick={() =>
                navigate(
                  "/criteria6/faculty-activities"
                )
              }
            >
              ← Previous
            </button>


            {/* =================================================
                GENERATE REPORT
            ================================================= */}

            <div className="generate-report-container">

              <button
                className="generate-report-btn"
                onClick={handleGenerateReport}
              >
                🖨 Generate Report All
              </button>

            </div>


            <button
              className="module-next"
              onClick={() =>
                navigate("/criteria7")
              }
            >
              Criteria 7 →
            </button>

          </div>

        </div>

      </main>

    </div>

  );

}

export default ResearchConsultancy;