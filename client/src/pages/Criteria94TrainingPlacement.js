import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaChartBar,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaArrowLeft,
  FaUndo,
  FaSave,
  FaTrash,
  FaPrint,
  FaArrowRight,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";

import "./Criteria94TrainingPlacement.css";

function Criteria94TrainingPlacement() {
  const navigate = useNavigate();

  /* =========================================================
     FILE REFS
  ========================================================= */

  const fileRefs = useRef([]);

  /* =========================================================
     MARKS
  ========================================================= */

  const [marksA, setMarksA] = useState(0);
  const [marksB, setMarksB] = useState(0);
  const [marksC, setMarksC] = useState(0);
  const [marksD, setMarksD] = useState(0);

  const [remarks, setRemarks] = useState("");

  /* =========================================================
     FILES
  ========================================================= */

  const [files, setFiles] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [savedId, setSavedId] = useState(null);

  /* =========================================================
     TOTAL MARKS
  ========================================================= */

  const totalMarks =
    Number(marksA) +
    Number(marksB) +
    Number(marksC) +
    Number(marksD);

  /* =========================================================
     MARK VALIDATION
  ========================================================= */

  const handleMarksChange = (value, setter, max) => {
    let newValue = Number(value);

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > max) {
      newValue = max;
    }

    setter(newValue);
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];

    if (!file) return;

    const updatedFiles = [...files];

    updatedFiles[index] = file;

    setFiles(updatedFiles);
  };

  /* =========================================================
     VIEW FILE
  ========================================================= */

  const handleViewFile = (file) => {
    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    const url = URL.createObjectURL(file);

    window.open(url, "_blank");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
  try {

    const formData = new FormData();

    formData.append(
      "section_a_marks",
      Number(marksA)
    );

    formData.append(
      "section_b_marks",
      Number(marksB)
    );

    formData.append(
      "section_c_marks",
      Number(marksC)
    );

    formData.append(
      "section_d_marks",
      Number(marksD)
    );

    formData.append(
      "total_marks",
      Number(totalMarks)
    );

    formData.append(
      "remarks",
      remarks
    );

    formData.append(
      "criterion",
      "9.4"
    );


    /* =========================
       DOCUMENTS
    ========================= */

    files.forEach((file, index) => {

      if (file) {

        formData.append(
          `document_${index + 1}`,
          file
        );

      }

    });


    const response = await axios.post(
      "http://localhost:5000/api/criteria94",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    if (response.data) {

      setSavedId(
        response.data.id || null
      );

    }


    alert(
      "Training and Placement Support data saved successfully."
    );

  } catch (error) {

    console.error(
      "Criteria 9.4 Save Error:",
      error
    );

    alert(
      "Save failed. Please check backend."
    );
  }
};
  /* =========================================================
     DELETE
  ========================================================= */

 const handleDelete = async () => {
  if (!savedId) {
    handleClear();
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this record?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `http://localhost:5000/api/criteria94/${savedId}`
    );

    alert("Record deleted successfully.");

    handleClear();

  } catch (error) {

    console.error(error);

    alert("Delete failed.");
  }
};
  /* =========================================================
     CLEAR
  ========================================================= */

  const handleClear = () => {
    setMarksA(0);
    setMarksB(0);
    setMarksC(0);
    setMarksD(0);

    setRemarks("");

    setFiles([
      null,
      null,
      null,
      null,
      null,
      null,
    ]);

    setSavedId(null);

    fileRefs.current.forEach((ref) => {
      if (ref) {
        ref.value = "";
      }
    });
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handlePrevious = () => {
    navigate("/criteria9/3");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/5");
  };

  /* =========================================================
     EVALUATION DATA
  ========================================================= */

  const evaluationRows = [
    {
      code: "A",
      title: "Facilities of training and placement cell",
      points: [
        "Infrastructure and facilities",
        "Equipment and resources",
        "Placement cell operations",
      ],
      marks: 2,
    },
    {
      code: "B",
      title: "Adequate staff",
      points: [
        "Qualified and dedicated staff",
        "Student-staff ratio",
        "Responsibilities and coordination",
      ],
      marks: 2,
    },
    {
      code: "C",
      title: "Pre-placement training activities",
      points: [
        "Soft skills / Aptitude training",
        "Technical training",
        "Mock tests / GD / PI sessions",
      ],
      marks: 3,
    },
    {
      code: "D",
      title: "Support for higher studies",
      points: [
        "Guidance for higher studies",
        "Coaching / resources",
        "Financial / administrative support",
      ],
      marks: 3,
    },
  ];

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents = [
    {
      type: "Training and Placement Cell Facilities",
      description:
        "Infrastructure, equipment and other facilities",
    },
    {
      type: "Staff Details / Organization Chart",
      description:
        "Details of staff with responsibilities",
    },
    {
      type: "Pre-placement Training Activities",
      description:
        "Details of training programs and sessions",
    },
    {
      type: "Placement Records / Statistics",
      description:
        "Placement data, offers and recruiters",
    },
    {
      type: "Support for Higher Studies",
      description:
        "Guidance, resources and financial support",
    },
    {
      type: "Any Other Relevant Document",
      description:
        "Any other supporting document",
    },
  ];

  return (
    <div className="training94-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="training94-header">

        <div className="training94-header-left">

          <div className="training94-number">
            9.4
          </div>

          <div>

            <h1>
              Training and Placement Support
            </h1>

            <p>
              Evaluate the facilities, staff, training activities
              and support provided for placements and higher studies.
            </p>

          </div>

        </div>

        <div className="training94-max-marks">

          <span>
            Maximum Marks
          </span>

          <strong>
            10
          </strong>

        </div>

      </div>


      {/* =====================================================
          SUB CRITERIA
      ====================================================== */}

      <div className="training94-subcriteria">

        <div className="training94-sub-title">

          <FaInfoCircle />

          <strong>
            Sub-Criteria
          </strong>

        </div>

        <div className="training94-sub-content">

          <div>
            <strong>A.</strong>
            <span>
              Facilities of training and placement cell (02)
            </span>
          </div>

          <div>
            <strong>B.</strong>
            <span>
              Adequate staff (02)
            </span>
          </div>

          <div>
            <strong>C.</strong>
            <span>
              Pre-placement training activities (03)
            </span>
          </div>

          <div>
            <strong>D.</strong>
            <span>
              Support for higher studies (03)
            </span>
          </div>

        </div>

      </div>


      {/* =====================================================
          TOP GRID
      ====================================================== */}

      <div className="training94-top-grid">

        {/* =================================================
            GUIDELINES
        ================================================== */}

        <div className="training94-card">

          <div className="training94-card-title">

            <FaChartBar />

            <h2>
              Evaluation Guidelines / Breakdown of Marks
            </h2>

          </div>


          <table className="training94-evaluation-table">

            <thead>

              <tr>

                <th>
                  Criteria
                </th>

                <th>
                  Description
                </th>

                <th>
                  Marks
                </th>

              </tr>

            </thead>

            <tbody>

              {evaluationRows.map((row) => (

                <tr key={row.code}>

                  <td className="training94-code">
                    <strong>
                      {row.code}
                    </strong>
                  </td>

                  <td>

                    <div className="training94-description">

                      <strong>
                        {row.title}
                      </strong>

                      <ul>

                        {row.points.map(
                          (point, index) => (
                            <li key={index}>
                              {point}
                            </li>
                          )
                        )}

                      </ul>

                    </div>

                  </td>

                  <td className="training94-marks">
                    <strong>
                      {String(row.marks).padStart(2, "0")}
                    </strong>
                  </td>

                </tr>

              ))}


              <tr className="training94-total-row">

                <td colSpan="2">
                  Total Marks
                </td>

                <td>
                  10
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* =================================================
            RIGHT INFORMATION
        ================================================== */}

        <div className="training94-side">

          {/* INSTRUCTIONS */}

          <div className="training94-card training94-instructions">

            <div className="training94-card-title">

              <FaInfoCircle />

              <h2>
                Instructions
              </h2>

            </div>

            <ul>

              <li>
                Provide appropriate documentary evidence
                for all the sub-criteria.
              </li>

              <li>
                Consider few relevant activities conducted
                under training and placement.
              </li>

              <li>
                Maximum marks are <strong>10</strong>.
              </li>

            </ul>

          </div>


          {/* EXHIBITS */}

          <div className="training94-card training94-exhibits">

            <div className="training94-card-title">

              <FaFileAlt />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <p>
              ◆ <strong>A, B, C &amp; D:</strong>{" "}
              Appropriate documentary evidence.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          SUPPORTING DOCUMENTS
      ====================================================== */}

      <div className="training94-card training94-documents">

        <div className="training94-card-title">

          <FaCloudUploadAlt />

          <h2>
            Supporting Documents (Upload)
          </h2>

        </div>


        <div className="training94-document-table">

          <div className="training94-document-header">

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


          {documents.map((document, index) => (

            <div
              className="training94-document-row"
              key={index}
            >

              <div>
                {index + 1}
              </div>

              <div>
                {document.type}
              </div>

              <div>
                {document.description}
              </div>

              <div>

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

              <div>

                <button
                  type="button"
                  onClick={() =>
                    handleViewFile(files[index])
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


      {/* =====================================================
          EVALUATION & MARKS
      ====================================================== */}

      <div className="training94-card training94-evaluation">

        <div className="training94-card-title">

          <FaStar />

          <h2>
            Evaluation &amp; Marks
          </h2>

        </div>


        <div className="training94-mark-grid">

          {/* A */}

          <div className="training94-mark-box">

            <div>

              <strong>
                A. Facilities of training and placement cell
              </strong>

              <span>
                Out of 02 Marks
              </span>

            </div>

            <div className="training94-input-wrap">

              <input
                type="number"
                min="0"
                max="2"
                step="1"
                value={marksA}
                onChange={(e) =>
                  handleMarksChange(
                    e.target.value,
                    setMarksA,
                    2
                  )
                }
              />

              <span>
                / 2
              </span>

            </div>

          </div>


          {/* B */}

          <div className="training94-mark-box">

            <div>

              <strong>
                B. Adequate staff
              </strong>

              <span>
                Out of 02 Marks
              </span>

            </div>

            <div className="training94-input-wrap">

              <input
                type="number"
                min="0"
                max="2"
                step="1"
                value={marksB}
                onChange={(e) =>
                  handleMarksChange(
                    e.target.value,
                    setMarksB,
                    2
                  )
                }
              />

              <span>
                / 2
              </span>

            </div>

          </div>


          {/* C */}

          <div className="training94-mark-box">

            <div>

              <strong>
                C. Pre-placement training activities
              </strong>

              <span>
                Out of 03 Marks
              </span>

            </div>

            <div className="training94-input-wrap">

              <input
                type="number"
                min="0"
                max="3"
                step="1"
                value={marksC}
                onChange={(e) =>
                  handleMarksChange(
                    e.target.value,
                    setMarksC,
                    3
                  )
                }
              />

              <span>
                / 3
              </span>

            </div>

          </div>


          {/* D */}

          <div className="training94-mark-box">

            <div>

              <strong>
                D. Support for higher studies
              </strong>

              <span>
                Out of 03 Marks
              </span>

            </div>

            <div className="training94-input-wrap">

              <input
                type="number"
                min="0"
                max="3"
                step="1"
                value={marksD}
                onChange={(e) =>
                  handleMarksChange(
                    e.target.value,
                    setMarksD,
                    3
                  )
                }
              />

              <span>
                / 3
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            TOTAL + REMARKS
        ================================================== */}

        <div className="training94-bottom">

          <div className="training94-final-mark">

            <label>
              Marks Awarded (Out of 10)
            </label>

            <div>
              {totalMarks} / 10
            </div>

          </div>


          <div className="training94-remarks">

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


      {/* =====================================================
          BUTTONS
      ====================================================== */}

      <div className="training94-buttons">

        <button
          className="training94-btn training94-previous"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>


        <button
          className="training94-btn training94-back"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>


        <button
          className="training94-btn training94-save"
          onClick={handleSave}
        >
          <FaSave />
          Save
        </button>


        <button
          className="training94-btn training94-delete"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>


        <button
          className="training94-btn training94-print"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>


        <button
          className="training94-btn training94-next"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria94TrainingPlacement;