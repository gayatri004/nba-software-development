import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaInfoCircle,
  FaClipboardList,
  FaFileAlt,
  FaFolderOpen,
  FaCloudUploadAlt,
  FaEye,
  FaStar,
  FaArrowLeft,
  FaUndo,
  FaSave,
  
  FaTrash,
  FaPrint,
  FaArrowRight,
} from "react-icons/fa";

import "./Criteria92MonitoringSystem.css";

function Criteria92MonitoringSystem() {
  const navigate = useNavigate();

  const fileRefs = useRef([]);

  /* =====================================================
     STATES
  ===================================================== */

  const [implementationMarks, setImplementationMarks] = useState(0);
  const [effectivenessMarks, setEffectivenessMarks] = useState(0);

  const [remarks, setRemarks] = useState("");

  const [files, setFiles] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [savedId, setSavedId] = useState(null);

  /* =====================================================
     DOCUMENT ROWS
  ===================================================== */

  const documentRows = [
    {
      name: "Mentoring Policy / Guidelines",
      description: "Policy or guideline document of mentoring system",
    },
    {
      name: "Mentor-Mentee Allocation List",
      description: "List of mentors and mentees",
    },
    {
      name: "Mentoring Records / Meeting Reports",
      description: "Minutes of meetings / interaction records",
    },
    {
      name: "Feedback / Survey Reports",
      description: "Feedback collected from mentees",
    },
    {
      name: "Impact Analysis / Action Taken Report",
      description: "Analysis of effectiveness and actions taken",
    },
    {
      name: "Any Other Relevant Document",
      description: "Other supporting documents",
    },
  ];

  /* =====================================================
     TOTAL MARKS
  ===================================================== */

  const totalMarks =
    Number(implementationMarks) + Number(effectivenessMarks);

  /* =====================================================
     IMPLEMENTATION MARKS
     Maximum = 2
  ===================================================== */

  const handleImplementationChange = (e) => {
    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 2) value = 2;

    setImplementationMarks(value);
  };

  /* =====================================================
     EFFECTIVENESS MARKS
     Maximum = 3
  ===================================================== */

  const handleEffectivenessChange = (e) => {
    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 3) value = 3;

    setEffectivenessMarks(value);
  };

  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];

    if (!file) return;

    const updatedFiles = [...files];

    updatedFiles[index] = file;

    setFiles(updatedFiles);
  };

  /* =====================================================
     VIEW FILE
  ===================================================== */

  const handleViewFile = (index) => {
    if (!files[index]) {
      alert("Please upload a document first.");
      return;
    }

    const url = URL.createObjectURL(files[index]);

    window.open(url, "_blank");
  };

  /* =====================================================
     SAVE
  ===================================================== */
const handleSave = async () => {
  try {

    const formData = new FormData();

    if (savedId) {
      formData.append("id", String(savedId));
    }

    formData.append(
      "implementation_marks",
      String(Number(implementationMarks))
    );

    formData.append(
      "effectiveness_marks",
      String(Number(effectivenessMarks))
    );

    formData.append(
      "total_marks",
      String(Number(totalMarks))
    );

    formData.append(
      "remarks",
      remarks || ""
    );

    /* ================= DOCUMENTS ================= */

    files.forEach((file, index) => {

      if (file) {
        formData.append(
          `document_${index}`,
          file
        );
      }

    });

    console.log("===== CRITERIA 9.2 SAVE =====");
    console.log("Implementation:", implementationMarks);
    console.log("Effectiveness:", effectivenessMarks);
    console.log("Total:", totalMarks);
    console.log("Remarks:", remarks);
    console.log("Files:", files);

    const response = await axios.post(
      "http://localhost:5000/api/criteria92",
      formData
    );

    console.log(
      "CRITERIA 9.2 RESPONSE:",
      response.data
    );

    if (response.data) {

      setSavedId(
        response.data.id ||
        response.data.data?.id ||
        null
      );

      alert(
        "Monitoring System data saved successfully."
      );
    }

  } catch (error) {

    console.error(
      "Criteria 9.2 Save Error:",
      error
    );

    console.error(
      "Server Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.error ||
      "Save failed. Please check backend."
    );
  }
};
  /* =====================================================
     DELETE
  ===================================================== */
const handleDelete = async () => {

  if (!savedId) {
    alert("Please save the record first.");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this record?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    await axios.delete(
      `http://localhost:5000/api/criteria92/${savedId}`
    );

    alert(
      "Record deleted successfully."
    );

    handleClear();

  } catch (error) {

    console.error(
      "Criteria 9.2 Delete Error:",
      error
    );

    alert(
      error.response?.data?.error ||
      "Delete failed."
    );
  }
};
  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {
    setImplementationMarks(0);
    setEffectivenessMarks(0);
    setRemarks("");
    setSavedId(null);

    setFiles([
      null,
      null,
      null,
      null,
      null,
      null,
    ]);

    fileRefs.current.forEach((ref) => {
      if (ref) {
        ref.value = "";
      }
    });
  };

  /* =====================================================
     PRINT
  ===================================================== */

  const handlePrint = () => {
    window.print();
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handlePrevious = () => {
    navigate("/criteria9/1");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/3");
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="monitoring92-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="monitoring92-header">

        <div className="monitoring92-header-left">

          <div className="monitoring92-number">
            9.2
          </div>

          <div className="monitoring92-title">

            <h1>
              Monitoring System
            </h1>

            <p>
              Evaluate the mentoring system and its effectiveness.
            </p>

          </div>

        </div>

        
      </div>


      {/* =================================================
          SUB CRITERIA
      ================================================= */}

      <div className="monitoring92-subcriteria">

        <div className="subcriteria-title">

          <FaInfoCircle />

          <strong>
            Sub-Criteria
          </strong>

        </div>

        <div className="subcriteria-content">

          <div>
            <strong>A.</strong>
            <span>
              Mentoring system-implementation (02)
            </span>
          </div>

          <div>
            <strong>B.</strong>
            <span>
              Effectiveness (03)
            </span>
          </div>

        </div>

      </div>


      {/* =================================================
          GUIDELINES + INSTRUCTIONS
      ================================================= */}

      <div className="monitoring92-top-grid">

        {/* ================= GUIDELINES ================= */}

        <div className="monitoring92-card guidelines92-card">

          <div className="monitoring92-card-title">

            <FaFileAlt />

            <h2>
              Evaluation Guidelines / Breakdown of Marks
            </h2>

          </div>

          <div className="guidelines92-table">

            <div className="guidelines92-header">

              <div>
                Sub-Criteria
              </div>

              <div>
                Description
              </div>

              <div>
                Marks
              </div>

            </div>


            {/* A */}

            <div className="guidelines92-row">

              <div className="guideline-subcriteria">

                <strong>
                  A. Mentoring system-implementation
                </strong>

              </div>

              <div className="guideline-description">

                <ul>

                  <li>
                    Well-defined mentoring policy and process
                  </li>

                  <li>
                    Mentor-mentee allocation and monitoring
                  </li>

                  <li>
                    Records and regular interactions
                  </li>

                  <li>
                    Any relevant mentoring activities conducted
                  </li>

                </ul>

              </div>

              <div className="guideline-marks">
                02
              </div>

            </div>


            {/* B */}

            <div className="guidelines92-row">

              <div className="guideline-subcriteria">

                <strong>
                  B. Effectiveness
                </strong>

              </div>

              <div className="guideline-description">

                <ul>

                  <li>
                    Positive impact on mentee performance and development
                  </li>

                  <li>
                    Feedback from mentees
                  </li>

                  <li>
                    Analysis and remedial actions taken
                  </li>

                  <li>
                    Improvements observed
                  </li>

                </ul>

              </div>

              <div className="guideline-marks">
                03
              </div>

            </div>


            {/* TOTAL */}

            <div className="guidelines92-total">

              <div></div>

              <strong>
                Total Marks
              </strong>

              <strong>
                05
              </strong>

            </div>

          </div>

        </div>


        {/* ================= INSTRUCTIONS ================= */}

        <div className="monitoring92-right-top">

          <div className="monitoring92-card instructions92-card">

            <div className="monitoring92-card-title green-title">

              <FaClipboardList />

              <h2>
                Instructions
              </h2>

            </div>

            <ul>

              <li>
                Provide documentary evidence for both sub-criteria.
              </li>

              <li>
                Consider few relevant activities conducted under
                mentoring system.
              </li>

              <li>
                Maximum marks are <strong>05</strong>.
              </li>

            </ul>

          </div>


          {/* ================= EXHIBITS ================= */}

          <div className="monitoring92-card exhibits92-card">

            <div className="monitoring92-card-title">

              <FaFolderOpen />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <div className="exhibit92-content">

              <span>
                ❖
              </span>

              <p>
                <strong>
                  A &amp; B:
                </strong>{" "}
                Documentary evidence by considering a few
                relevant activities.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          SUPPORTING DOCUMENTS
      ================================================= */}

      <div className="monitoring92-card documents92-card">

        <div className="monitoring92-card-title">

          <FaCloudUploadAlt />

          <h2>
            Supporting Documents (Upload)
          </h2>

        </div>


        <div className="documents92-table">

          <div className="documents92-header">

            <div>
              Sr. No.
            </div>

            <div>
              Document Type
            </div>

            <div>
              Description
            </div>

            <div>
              Upload File
            </div>

            <div>
              View
            </div>

          </div>


          {documentRows.map((document, index) => (

            <div
              className="documents92-row"
              key={index}
            >

              <div className="document92-serial">
                {index + 1}
              </div>

              <div className="document92-name">
                {document.name}
              </div>

              <div className="document92-description">
                {document.description}
              </div>

              <div className="document92-upload">

                <input
                  type="file"
                  ref={(el) =>
                    (fileRefs.current[index] = el)
                  }
                  onChange={(e) =>
                    handleFileChange(index, e)
                  }
                />

              </div>

              <div className="document92-view">

                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(index)
                  }
                  title="View Document"
                >
                  <FaEye />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          EVALUATION & MARKS
      ================================================= */}

      <div className="monitoring92-card evaluation92-card">

        <div className="monitoring92-card-title">

          <FaStar />

          <h2>
            Evaluation &amp; Marks
          </h2>

        </div>


        <div className="evaluation92-content">

          {/* A */}

          <div className="evaluation92-item">

            <div className="evaluation92-label">

              <strong>
                A. Mentoring system-implementation
              </strong>

              <span>
                Out of 02 Marks
              </span>

            </div>

            <input
              type="number"
              min="0"
              max="2"
              step="1"
              value={implementationMarks}
              onChange={handleImplementationChange}
            />

            <span className="evaluation92-max">
              / 2
            </span>

          </div>


          {/* B */}

          <div className="evaluation92-item">

            <div className="evaluation92-label">

              <strong>
                B. Effectiveness
              </strong>

              <span>
                Out of 03 Marks
              </span>

            </div>

            <input
              type="number"
              min="0"
              max="3"
              step="1"
              value={effectivenessMarks}
              onChange={handleEffectivenessChange}
            />

            <span className="evaluation92-max">
              / 3
            </span>

          </div>


          {/* TOTAL */}

          <div className="evaluation92-total">

            <label>
              Marks Awarded (Out of 05)
            </label>

            <div className="evaluation92-total-box">
              {totalMarks} / 5
            </div>

          </div>


          {/* REMARKS */}

          <div className="remarks92-box">

            <label>
              Remarks (Optional)
            </label>

            <textarea
              placeholder="Enter remarks..."
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* =================================================
          BOTTOM BUTTONS
      ================================================= */}

      <div className="monitoring92-buttons">

        <button
          className="monitoring92-btn previous92-btn"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>


        <button
          className="monitoring92-btn back92-btn"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>


        <button
          className="monitoring92-btn save92-btn"
          onClick={handleSave}
        >
          <FaSave />
          Save
        </button>



        <button
          className="monitoring92-btn delete92-btn"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>


        <button
          className="monitoring92-btn print92-btn"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>


        <button
          className="monitoring92-btn next92-btn"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria92MonitoringSystem;