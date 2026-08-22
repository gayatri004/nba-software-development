import React, { useState } from "react";
import { Link } from "react-router-dom";

import NBASidebar from "./NBASidebar";

import {
  FaEye,
  FaDownload,
  FaSave,
  FaPrint,
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaBroom,
} from "react-icons/fa";

import "./VisionMission.css";

function VisionMission() {

  // =========================================================
  // STATE
  // =========================================================

  const [visionFile, setVisionFile] = useState(null);
  const [missionFile, setMissionFile] = useState(null);
  const [peoFile, setPeoFile] = useState(null);

  const [visionDescription, setVisionDescription] = useState(
    "To be a premier institute recognized for excellence in technical education, research and innovation for the betterment of society."
  );

  const [missionDescription, setMissionDescription] = useState(
    "To provide quality technical education through innovative teaching-learning practices."
  );

  const [peoDescription, setPeoDescription] = useState(
    "To prepare competent professionals with technical knowledge, ethical values and lifelong learning capabilities."
  );

  const [mappingNote, setMappingNote] = useState("");

  const [mappingData, setMappingData] = useState({
    PEO1: {
      Mission1: "",
      Mission2: "",
      Mission3: "",
    },
    PEO2: {
      Mission1: "",
      Mission2: "",
      Mission3: "",
    },
    PEO3: {
      Mission1: "",
      Mission2: "",
      Mission3: "",
    },
  });

  // =========================================================
  // FILE HANDLERS
  // =========================================================

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload PDF file only.");
      event.target.value = "";
      return;
    }

    if (type === "vision") {
      setVisionFile(file);
    }

    if (type === "mission") {
      setMissionFile(file);
    }

    if (type === "peo") {
      setPeoFile(file);
    }
  };

  // =========================================================
  // VIEW FILE
  // =========================================================

  const handleViewFile = (file) => {
    if (!file) {
      alert("Please upload a PDF file first.");
      return;
    }

    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  // =========================================================
  // DOWNLOAD FILE
  // =========================================================

  const handleDownloadFile = (file) => {
    if (!file) {
      alert("Please upload a PDF file first.");
      return;
    }

    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileURL);
  };

  // =========================================================
  // MAPPING CHANGE
  // =========================================================

  const handleMappingChange = (peo, mission, value) => {
    setMappingData((prev) => ({
      ...prev,
      [peo]: {
        ...prev[peo],
        [mission]: value,
      },
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = () => {
    const data = {
      visionDescription,
      missionDescription,
      peoDescription,
      mappingData,
      mappingNote,
      visionFile,
      missionFile,
      peoFile,
    };

    console.log("Vision Mission Data:", data);

    alert("Vision & Mission data saved successfully.");
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the Vision & Mission data?"
    );

    if (!confirmDelete) return;

    setVisionDescription("");
    setMissionDescription("");
    setPeoDescription("");

    setVisionFile(null);
    setMissionFile(null);
    setPeoFile(null);

    setMappingNote("");

    setMappingData({
      PEO1: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
      PEO2: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
      PEO3: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
    });

    alert("Data deleted successfully.");
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const handleClear = () => {
    setVisionDescription("");
    setMissionDescription("");
    setPeoDescription("");
    setMappingNote("");

    setVisionFile(null);
    setMissionFile(null);
    setPeoFile(null);

    setMappingData({
      PEO1: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
      PEO2: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
      PEO3: {
        Mission1: "",
        Mission2: "",
        Mission3: "",
      },
    });
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // FILE UPLOAD COMPONENT
  // =========================================================

  const FileUpload = ({ file, type }) => {
    return (
      <div className="file-upload-row">

        <label className="choose-file-btn">
          Choose File

          <input
            type="file"
            accept="application/pdf"
            className="custom-file-input"
            onChange={(e) => handleFileChange(e, type)}
          />
        </label>

        <div className="pdf-name">
          {file ? file.name : "No file selected"}
        </div>

        <div className="document-actions">

          <button
            type="button"
            className="view-btn"
            onClick={() => handleViewFile(file)}
            title="View PDF"
          >
            <FaEye />
          </button>

          <button
            type="button"
            className="download-btn"
            onClick={() => handleDownloadFile(file)}
            title="Download PDF"
          >
            <FaDownload />
          </button>

        </div>

      </div>
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="vision-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <NBASidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="vision-main">

        <div className="vision-container">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <h1 className="section-heading">
            Vision, Mission and Program Educational Objectives
          </h1>

          {/* =================================================
              INSTRUCTION
          ================================================= */}

          <div className="instruction-box">

            <h4>
              Instructions
            </h4>

            <ul>
              <li>
                Enter the approved Vision and Mission statements.
              </li>

              <li>
                Enter the Program Educational Objectives (PEOs).
              </li>

              <li>
                Upload supporting documents in PDF format.
              </li>

              <li>
                Provide documentary evidence for Vision, Mission and PEO mapping.
              </li>
            </ul>

          </div>

          {/* =================================================
              1.1.1
          ================================================= */}

          <div className="main-section">
            1.1.1 Vision, Mission and Program Educational Objectives
          </div>

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

              {/* VISION */}

              <tr>

                <td>1</td>

                <td>
                  Institute Vision
                </td>

                <td>

                  <textarea
                    value={visionDescription}
                    onChange={(e) =>
                      setVisionDescription(e.target.value)
                    }
                    placeholder="Enter Institute Vision"
                  />

                </td>

                <td>

                  <FileUpload
                    file={visionFile}
                    type="vision"
                  />

                </td>

              </tr>

              {/* MISSION */}

              <tr>

                <td>2</td>

                <td>
                  Institute Mission
                </td>

                <td>

                  <textarea
                    value={missionDescription}
                    onChange={(e) =>
                      setMissionDescription(e.target.value)
                    }
                    placeholder="Enter Institute Mission"
                  />

                </td>

                <td>

                  <FileUpload
                    file={missionFile}
                    type="mission"
                  />

                </td>

              </tr>

              {/* PEO */}

              <tr>

                <td>3</td>

                <td>
                  Program Educational Objectives (PEOs)
                </td>

                <td>

                  <textarea
                    value={peoDescription}
                    onChange={(e) =>
                      setPeoDescription(e.target.value)
                    }
                    placeholder="Enter PEO Description"
                  />

                </td>

                <td>

                  <FileUpload
                    file={peoFile}
                    type="peo"
                  />

                </td>

              </tr>

            </tbody>

          </table>

          {/* =================================================
              1.1.2
          ================================================= */}

          <div className="main-section">
            1.1.2 Vision of the Institute and the Department
          </div>

          <div className="mapping-wrapper">

            <div className="mapping-card">

              <h4>
                Vision Statement
              </h4>

              <textarea
                value={visionDescription}
                onChange={(e) =>
                  setVisionDescription(e.target.value)
                }
                placeholder="Enter Vision Statement"
              />

              <h5>
                Supporting Documents
              </h5>

              <table className="support-table">

                <tbody>

                  <tr>

                    <td>
                      Vision Document
                    </td>

                    <td>
                      <FileUpload
                        file={visionFile}
                        type="vision"
                      />
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <div className="mapping-card">

              <h4>
                Department Vision
              </h4>

              <textarea
                placeholder="Enter Department Vision"
              />

              <h5>
                Supporting Documents
              </h5>

              <table className="support-table">

                <tbody>

                  <tr>

                    <td>
                      Department Vision Document
                    </td>

                    <td>

                      <label className="custom-file-btn">

                        Choose File

                        <input
                          type="file"
                          accept="application/pdf"
                          className="custom-file-input"
                        />

                      </label>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              1.1.3
          ================================================= */}

          <div className="main-section">
            1.1.3 Mission of the Institute and the Department
          </div>

          <div className="mapping-wrapper">

            <div className="mapping-card">

              <h4>
                Institute Mission
              </h4>

              <textarea
                value={missionDescription}
                onChange={(e) =>
                  setMissionDescription(e.target.value)
                }
                placeholder="Enter Institute Mission"
              />

              <h5>
                Supporting Documents
              </h5>

              <table className="support-table">

                <tbody>

                  <tr>

                    <td>
                      Mission Document
                    </td>

                    <td>

                      <FileUpload
                        file={missionFile}
                        type="mission"
                      />

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <div className="mapping-card">

              <h4>
                Department Mission
              </h4>

              <textarea
                placeholder="Enter Department Mission"
              />

              <h5>
                Supporting Documents
              </h5>

              <table className="support-table">

                <tbody>

                  <tr>

                    <td>
                      Department Mission Document
                    </td>

                    <td>

                      <label className="custom-file-btn">

                        Choose File

                        <input
                          type="file"
                          accept="application/pdf"
                          className="custom-file-input"
                        />

                      </label>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              1.1.4
          ================================================= */}

          <div className="main-section">
            1.1.4 Program Educational Objectives
          </div>

          <table className="nba-table">

            <thead>

              <tr>

                <th>
                  Sr. No.
                </th>

                <th>
                  PEO
                </th>

                <th>
                  Description
                </th>

                <th>
                  Attachment (PDF only)
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>
                  1
                </td>

                <td>
                  PEO1
                </td>

                <td>

                  <textarea
                    value={peoDescription}
                    onChange={(e) =>
                      setPeoDescription(e.target.value)
                    }
                    placeholder="Enter PEO1 description"
                  />

                </td>

                <td>

                  <FileUpload
                    file={peoFile}
                    type="peo"
                  />

                </td>

              </tr>

              <tr>

                <td>
                  2
                </td>

                <td>
                  PEO2
                </td>

                <td>

                  <textarea
                    placeholder="Enter PEO2 description"
                  />

                </td>

                <td>

                  <FileUpload
                    file={peoFile}
                    type="peo"
                  />

                </td>

              </tr>

              <tr>

                <td>
                  3
                </td>

                <td>
                  PEO3
                </td>

                <td>

                  <textarea
                    placeholder="Enter PEO3 description"
                  />

                </td>

                <td>

                  <FileUpload
                    file={peoFile}
                    type="peo"
                  />

                </td>

              </tr>

            </tbody>

          </table>

          {/* =================================================
              1.1.5
          ================================================= */}

          <div className="main-section">
            1.1.5 Mapping of PEOs with Mission
          </div>

          <div className="mapping-wrapper">

            {/* MAPPING TABLE */}

            <div className="mapping-card">

              <h4>
                PEO - Mission Mapping
              </h4>

              <table className="mapping-table">

                <thead>

                  <tr>

                    <th>
                      PEO
                    </th>

                    <th>
                      Mission 1
                    </th>

                    <th>
                      Mission 2
                    </th>

                    <th>
                      Mission 3
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td>
                      PEO1
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO1.Mission1}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO1",
                            "Mission1",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO1.Mission2}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO1",
                            "Mission2",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO1.Mission3}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO1",
                            "Mission3",
                            e.target.value
                          )
                        }
                      />
                    </td>

                  </tr>

                  <tr>

                    <td>
                      PEO2
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO2.Mission1}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO2",
                            "Mission1",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO2.Mission2}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO2",
                            "Mission2",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO2.Mission3}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO2",
                            "Mission3",
                            e.target.value
                          )
                        }
                      />
                    </td>

                  </tr>

                  <tr>

                    <td>
                      PEO3
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO3.Mission1}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO3",
                            "Mission1",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO3.Mission2}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO3",
                            "Mission2",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={mappingData.PEO3.Mission3}
                        onChange={(e) =>
                          handleMappingChange(
                            "PEO3",
                            "Mission3",
                            e.target.value
                          )
                        }
                      />
                    </td>

                  </tr>

                </tbody>

              </table>

              <div className="mapping-note">

                <strong>
                  Correlation:
                </strong>

                <br />

                3 - High correlation
                <br />

                2 - Moderate correlation
                <br />

                1 - Low correlation
                <br />

                0 - No correlation

              </div>

            </div>

            {/* NOTE CARD */}

            <div className="mapping-card">

              <h4>
                Mapping Justification
              </h4>

              <textarea
                value={mappingNote}
                onChange={(e) =>
                  setMappingNote(e.target.value)
                }
                placeholder="Enter justification for PEO and Mission mapping..."
              />

              <div className="mapping-note-box">

                <h4>
                  Note
                </h4>

                <ul>

                  <li>
                    The mapping should demonstrate the relationship
                    between PEOs and Mission statements.
                  </li>

                  <li>
                    Provide appropriate supporting evidence wherever
                    applicable.
                  </li>

                  <li>
                    Correlation values should be justified.
                  </li>

                </ul>

              </div>

            </div>

          </div>

          {/* =================================================
              BOTTOM BUTTONS
          ================================================= */}

          <div className="btn-row">

            <button
              type="button"
              className="previous-btn"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
              &nbsp; Previous
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
              &nbsp; Back
            </button>

            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              <FaSave />
              &nbsp; Save
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
            >
              <FaTrash />
              &nbsp; Delete
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              <FaBroom />
              &nbsp; Clear
            </button>

            <button
              type="button"
              className="print-btn"
              onClick={handlePrint}
            >
              <FaPrint />
              &nbsp; Print
            </button>

            <Link
              to="/criteria/1.1.2"
              className="next-page-btn"
            >
              <FaArrowRight />
              &nbsp; Next
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default VisionMission;