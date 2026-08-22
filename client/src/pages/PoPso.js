import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PoPso.css";
import NBASidebar from "../pages/NBASidebar";

import {
  FaSave,
  FaEye,
  FaDownload,
  FaPrint
} from "react-icons/fa";

import mammoth from "mammoth";
import * as XLSX from "xlsx";

function PoPso({ onNext, onPrevious }) {

  const navigate = useNavigate();

  // =====================================================
  // FILE STATES
  // =====================================================

  const [poPsoFile, setPoPsoFile] = useState(null);
  const [mappingFile, setMappingFile] = useState(null);
  const [justificationFile, setJustificationFile] = useState(null);

  const [displayFileNames, setDisplayFileNames] = useState({});

  // =====================================================
  // AUTO SAVE
  // =====================================================

  const STORAGE_KEY = "popso_1_3_data";

  const [savedFileNames, setSavedFileNames] = useState({});
  const [loaded, setLoaded] = useState(false);

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
  // RESTORE LOCAL STORAGE
  // =====================================================

  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      try {

        const data = JSON.parse(saved);

        if (data.files) {

          setSavedFileNames(data.files);

          setDisplayFileNames(data.files);

        }

      } catch (error) {

        console.log(
          "PO/PSO Restore Error:",
          error
        );

      }

    }

    setLoaded(true);

  }, []);

  // =====================================================
  // AUTO SAVE LOCAL STORAGE
  // =====================================================

  useEffect(() => {

    if (!loaded) return;

    const data = {
      files: savedFileNames
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

  }, [
    loaded,
    savedFileNames
  ]);

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    try {

      if (
        (!poPsoFile && !savedFileNames.poPsoFile) ||
        (!mappingFile && !savedFileNames.mappingFile) ||
        (!justificationFile &&
          !savedFileNames.justificationFile)
      ) {

        alert("Please fill all required fields.");

        return;

      }

      const formData = new FormData();

      if (poPsoFile) {

        formData.append(
          "poPsoFile",
          poPsoFile
        );

      }

      if (mappingFile) {

        formData.append(
          "mappingFile",
          mappingFile
        );

      }

      if (justificationFile) {

        formData.append(
          "justificationFile",
          justificationFile
        );

      }

      const response = await fetch(
        "http://localhost:5000/save-popso",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      alert(data.message);

    } catch (error) {

      console.log(error);

      alert("Save Error");

    }

  };

  // =====================================================
  // READ FILE CONTENT
  // =====================================================

  const readFileContentHTML = async (fileName) => {

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

      const response = await fetch(
        `http://localhost:5000/uploads/${fileName}`
      );

      const blob = await response.blob();

      const buffer =
        await blob.arrayBuffer();

      const result =
        await mammoth.convertToHtml({
          arrayBuffer: buffer
        });

      return result.value;

    }

    // EXCEL
    if (
      ["xlsx", "xls"].includes(ext)
    ) {

      const response = await fetch(
        `http://localhost:5000/uploads/${fileName}`
      );

      const blob =
        await response.blob();

      const buffer =
        await blob.arrayBuffer();

      const workbook =
        XLSX.read(
          buffer,
          {
            type: "array"
          }
        );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      return XLSX.utils.sheet_to_html(
        sheet
      );

    }

    return "";

  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/print-popso-files"
      );

      const data = await res.json();

      const documents = [

        {
          title: "1.3.1 POs and PSOs",
          file: data.po_pso_file
        },

        {
          title:
            "1.3.2 Mapping between Courses and POs/PSOs",
          file: data.mapping_file
        },

        {
          title:
            "1.3.3 Justification of Mapping",
          file: data.justification_file
        }

      ].filter(
        (item) => item.file
      );

      let html = "";

      for (const doc of documents) {

        const preview =
          await readFileContentHTML(
            doc.file
          );

        html += `

          <div class="doc-section">

            <h2>${doc.title}</h2>

            ${preview}

            <hr/>

          </div>

        `;

      }

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      printWindow.document.write(`

        <html>

        <head>

          <title>
            PO PSO Documents
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
            1.3 PO, PSO and their Mapping with Courses
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
  // VIEW FILE
  // =====================================================

  const handleView = (fileName) => {

    if (!fileName) {

      alert(
        "Please upload file first."
      );

      return;

    }

    const extension =
      fileName
        .split(".")
        .pop()
        .toLowerCase();

    if (extension === "pdf") {

      window.open(
        `http://localhost:5000/uploads/${fileName}`,
        "_blank"
      );

    } else {

      window.open(
        `http://localhost:5000/download/${fileName}`,
        "_blank"
      );

    }

  };

  // =====================================================
  // DOWNLOAD FILE
  // =====================================================

  const handleDownload = (fileName) => {

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
  // UPDATE
  // =====================================================

  const handleUpdate = () => {

    alert(
      "Data Updated Successfully"
    );

  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = () => {

    alert(
      "Data Deleted Successfully"
    );

  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {

    const confirmClear =
      window.confirm(
        "Are you sure you want to clear uploaded files?"
      );

    if (!confirmClear) return;

    // Clear frontend file objects
    setPoPsoFile(null);
    setMappingFile(null);
    setJustificationFile(null);

    // Clear current screen names
    setDisplayFileNames({});

    // Clear file inputs
    document
      .querySelectorAll(
        'input[type="file"]'
      )
      .forEach((input) => {
        input.value = "";
      });

    // Do NOT clear:
    // savedFileNames
    // localStorage
    // database
    // backend files

    alert(
      "Uploaded files cleared successfully."
    );

  };

  // =====================================================
  // FILE UPLOAD HANDLER
  // =====================================================

  const handlePoPsoUpload = (e) => {

    if (
      e.target.files.length > 0
    ) {

      const file =
        e.target.files[0];

      setPoPsoFile(file);

      saveFileName(
        "poPsoFile",
        file
      );

      setDisplayFileNames(
        (prev) => ({
          ...prev,
          poPsoFile: file.name
        })
      );

    }

  };

  const handleMappingUpload = (e) => {

    if (
      e.target.files.length > 0
    ) {

      const file =
        e.target.files[0];

      setMappingFile(file);

      saveFileName(
        "mappingFile",
        file
      );

      setDisplayFileNames(
        (prev) => ({
          ...prev,
          mappingFile: file.name
        })
      );

    }

  };

  const handleJustificationUpload = (e) => {

    if (
      e.target.files.length > 0
    ) {

      const file =
        e.target.files[0];

      setJustificationFile(file);

      saveFileName(
        "justificationFile",
        file
      );

      setDisplayFileNames(
        (prev) => ({
          ...prev,
          justificationFile: file.name
        })
      );

    }

  };

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="popso-layout">

      {/* =================================================
          SAME NBA SIDEBAR
      ================================================= */}

      <NBASidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="popso-main">

        <div className="popso-page">

          <div className="popso-container">

            {/* =================================================
                1.3.1
            ================================================= */}

            <div className="po-card">

              <div className="page-header">

                <h2>
                  1.3 PO, PSO and their Mapping with Courses
                </h2>

              </div>

              <div className="card-body">

                <div className="popso-left">

                  <h4>
                    1.3.1 POs and PSOs
                    <span></span>
                  </h4>

                  <p className="section-text">

                    Provide the approved list of
                    Program Outcomes (POs) and
                    Program Specific Outcomes (PSOs)
                    applicable to the program under
                    consideration.

                  </p>

                </div>

                <div className="popso-right">

                  <div className="file-upload-row">

                    <label
                      htmlFor="poPsoFile"
                      className="choose-file-btn"
                    >
                      Choose File
                    </label>

                    <input
                      id="poPsoFile"
                      type="file"
                      className="custom-file-input"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                      onChange={handlePoPsoUpload}
                    />

                    {(
                      poPsoFile ||
                      displayFileNames.poPsoFile
                    ) && (

                      <div className="pdf-name">

                        {
                          poPsoFile?.name ||
                          displayFileNames.poPsoFile
                        }

                      </div>

                    )}

                    <div className="document-actions">

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleView(
                            poPsoFile?.name ||
                            displayFileNames.poPsoFile
                          )
                        }
                      >
                        <FaEye />
                      </button>

                      <button
                        className="download-btn"
                        onClick={() =>
                          handleDownload(
                            poPsoFile?.name ||
                            displayFileNames.poPsoFile
                          )
                        }
                      >
                        <FaDownload />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                1.3.2
            ================================================= */}

            <div className="card-body">

              <div className="popso-left">

                <h4>
                  1.3.2 Mapping between Courses and POs/PSOs
                  <span></span>
                </h4>

                <p className="section-text">

                  Upload the course-wise mapping matrix
                  indicating the contribution of each course
                  towards the attainment of the Program
                  Outcomes (POs) and Program Specific
                  Outcomes (PSOs).

                </p>

              </div>

              <div className="popso-right">

                <div className="file-upload-row">

                  <label
                    htmlFor="mappingFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>

                  <input
                    id="mappingFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={handleMappingUpload}
                  />

                  {(
                    mappingFile ||
                    displayFileNames.mappingFile
                  ) && (

                    <div className="pdf-name">

                      {
                        mappingFile?.name ||
                        displayFileNames.mappingFile
                      }

                    </div>

                  )}

                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          mappingFile?.name ||
                          displayFileNames.mappingFile
                        )
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="download-btn"
                      onClick={() =>
                        handleDownload(
                          mappingFile?.name ||
                          displayFileNames.mappingFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>

            </div>

            <hr className="section-divider" />


            {/* =================================================
                1.3.3
            ================================================= */}

            <div className="po-card">

              <div className="card-body">

                <div className="popso-left">

                  <h4>
                    1.3.3 Justification of Mapping
                    <span></span>
                  </h4>

                  <p className="section-text">

                    Provide a brief justification explaining
                    the methodology adopted for mapping the
                    courses with the Program Outcomes (POs)
                    and Program Specific Outcomes (PSOs),
                    including the rationale for the assigned
                    correlation levels.

                  </p>

                </div>

                <div className="popso-right">

                  <div className="file-upload-row">

                    <label
                      htmlFor="justificationFile"
                      className="choose-file-btn"
                    >
                      Choose File
                    </label>

                    <input
                      id="justificationFile"
                      type="file"
                      className="custom-file-input"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                      onChange={handleJustificationUpload}
                    />

                    {(
                      justificationFile ||
                      displayFileNames.justificationFile
                    ) && (

                      <div className="pdf-name">

                        {
                          justificationFile?.name ||
                          displayFileNames.justificationFile
                        }

                      </div>

                    )}

                    <div className="document-actions">

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleView(
                            justificationFile?.name ||
                            displayFileNames.justificationFile
                          )
                        }
                      >
                        <FaEye />
                      </button>

                      <button
                        className="download-btn"
                        onClick={() =>
                          handleDownload(
                            justificationFile?.name ||
                            displayFileNames.justificationFile
                          )
                        }
                      >
                        <FaDownload />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="btn-row">

              <button
                className="previous-btn"
                onClick={() =>
                  navigate("/curriculum")
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
                className="save-btn"
                onClick={handleSave}
              >
                <FaSave />
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
                <FaPrint />
                Print
              </button>

              <button
                className="next-page-btn"
                onClick={() =>
                  navigate("/course-matrix")
                }
              >
                Next →
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default PoPso;