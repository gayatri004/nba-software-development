import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUniversity,
  FaClipboardList,
  FaFileAlt,
  FaInfoCircle,
  FaEye,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaUndo,
  FaSave,
  FaPaperPlane,
  FaTrash,
  FaPrint,
  FaCloudUploadAlt,
} from "react-icons/fa";

import "./Criteria910EGovernance.css";

function Criteria910EGovernance() {
  const navigate = useNavigate();
  const fileRefs = useRef([]);

  /* =========================================================
     RECORD / LOADING
  ========================================================= */

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  

  /* =========================================================
     E-GOVERNANCE MARKS
     Maximum = 05
  ========================================================= */

  const [marks, setMarks] = useState(0);

  const [remarks, setRemarks] = useState("");

  /* =========================================================
     TOTAL MARKS
  ========================================================= */

  const totalMarks = Number(marks);

  /* =========================================================
     DOCUMENT LIST
  ========================================================= */

  const documentsList = [
    {
      id: 1,
      type: "E-Governance System",
      description:
        "Evidence of e-governance initiatives implemented by the institution",
    },
    {
      id: 2,
      type: "Office Automation Evidence",
      description:
        "Evidence showing extent of office automation",
    },
    {
      id: 3,
      type: "Software / Application Evidence",
      description:
        "Screenshots or reports of software/applications used for office automation",
    },
    {
      id: 4,
      type: "Digital Administrative Records",
      description:
        "Evidence of online and digital administrative records and processes",
    },
    {
      id: 5,
      type: "Any Other Relevant Document",
      description:
        "Any other supporting document related to e-governance initiatives",
    },
  ];

  const [documents, setDocuments] = useState(
    documentsList.map((doc) => ({
      ...doc,
      file: null,
      fileName: "",
      uploaded: false,
    }))
  );

  /* =========================================================
     MARK CHANGE
  ========================================================= */

  const handleMarksChange = (value) => {
    let newValue = Number(value);

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > 5) {
      newValue = 5;
    }

    setMarks(newValue);
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const updated = [...documents];

    updated[index] = {
      ...updated[index],
      file: file,
      fileName: file.name,
      uploaded: false,
    };

    setDocuments(updated);
  };

  /* =========================================================
     VIEW DOCUMENT
  ========================================================= */

  const handleViewDocument = (index) => {
    const doc = documents[index];

    if (!doc.file) {
      alert("Please upload the document first.");
      return;
    }

    const url = URL.createObjectURL(doc.file);

    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  /* =========================================================
     CREATE FORM DATA
  ========================================================= */

  const createFormData = () => {
    const formData = new FormData();

    formData.append(
      "marks",
      Number(totalMarks)
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
      "9.10"
    );

    formData.append(
      "title",
      "E-Governance"
    );

    formData.append(
      "evaluation_point",
      "E-governance initiatives"
    );

    formData.append(
      "indicator",
      "Extent of office automation"
    );

    documents.forEach((doc, index) => {
      if (doc.file) {
        formData.append(
          `document_${index + 1}`,
          doc.file
        );
      }
    });

    return formData;
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
  try {
    setLoading(true);

    const formData = createFormData();

    console.log("Saving Criteria 9.10...");
    console.log("Marks:", totalMarks);
    console.log("Remarks:", remarks);

    const response = await axios.post(
      "http://localhost:5000/api/criteria910",
      formData
    );

    console.log("9.10 Save Response:", response.data);

    if (response.data) {
      const id =
        response.data.id ||
        response.data.data?.id ||
        null;

      setRecordId(id);
    }

    alert(
      `Criterion 9.10 saved successfully.\n\nTotal Marks: ${totalMarks} / 05`
    );

  } catch (error) {
    console.error("9.10 Save Error:", error);

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    console.error(
      "Error Message:",
      error.message
    );

    alert(
      error.response?.data?.message ||
      "Save failed. Check backend console."
    );

  } finally {
    setLoading(false);
  }
};
  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = async () => {
  if (!recordId) {
    await handleSave();
    return;
  }

  try {
    setLoading(true);

    const formData = createFormData();

    const response = await axios.put(
      `http://localhost:5000/api/criteria910/${recordId}`,
      formData
    );

    console.log(
      "9.10 Update Response:",
      response.data
    );

    alert(
      `Criterion 9.10 updated successfully.\n\nTotal Marks: ${totalMarks} / 05`
    );

  } catch (error) {
    console.error(
      "9.10 Update Error:",
      error
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Unable to update Criterion 9.10."
    );

  } finally {
    setLoading(false);
  }
};
  
  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete Criterion 9.10 data?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      if (recordId) {
        await axios.delete(
          `/api/criteria910/${recordId}`
        );
      }

      handleClear();

      alert(
        "Criterion 9.10 data deleted successfully."
      );
    } catch (error) {
      console.error(
        "9.10 Delete Error:",
        error
      );

      alert(
        "Unable to delete Criterion 9.10 data."
      );
    }
  };

  /* =========================================================
     CLEAR
  ========================================================= */
const handleClear = () => {
  setRecordId(null);

  setMarks(0);

  setRemarks("");

  setDocuments(
    documentsList.map((doc) => ({
      ...doc,
      file: null,
      fileName: "",
      uploaded: false,
    }))
  );

  fileRefs.current.forEach((ref) => {
    if (ref) {
      ref.value = "";
    }
  });
};

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    navigate(-1);
  };

  /* =========================================================
     PREVIOUS
     9.9 Continuous Internal Assessment
  ========================================================= */

  const handlePrevious = () => {
    navigate(
      "/criteria9/continuous-internal-assessment"
    );
  };

  /* =========================================================
     NEXT

     Change this route when 9.11 page is created.
  ========================================================= */

  const handleNext = () => {
    navigate("/criteria9/11");
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="criteria910-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="criteria910-header">

        <div className="criteria910-header-left">

          <div className="criteria910-number">
            9.10
          </div>

          <div className="criteria910-header-icon">
            <FaUniversity />
          </div>

          <div>

            <h1>
              9.10&nbsp;&nbsp;E-Governance
            </h1>

            <p>
              Evaluate the e-governance initiatives and
              extent of office automation in the institution.
            </p>

          </div>

        </div>


      </div>


      {/* =====================================================
          CRITERIA SUMMARY
      ===================================================== */}

      <div className="criteria910-summary">

        <div className="summary-icon">
          <FaClipboardList />
        </div>

        <div className="summary-content">

          <div className="summary-row">

            <span className="summary-letter">
              A.
            </span>

            <span>
              E-Governance Initiatives
            </span>

            <b>
              (05)
            </b>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="criteria910-main-grid">

        {/* ===================================================
            LEFT SECTION
        =================================================== */}

        <div className="criteria910-left">

          {/* =================================================
              EVALUATION GUIDELINES
          ================================================= */}

          <div className="criteria910-card guidelines-card">

            <div className="criteria910-card-title">

              <FaClipboardList />

              <span>
                Evaluation Guidelines / Breakdown of Marks
              </span>

            </div>


            <div className="criteria910-table-wrapper">

              <table className="criteria910-guideline-table">

                <thead>

                  <tr>

                    <th>
                      Criteria
                    </th>

                    <th>
                      Description / Indicators
                    </th>

                    <th>
                      Marks
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {/* ================= A ================= */}

                  <tr>

                    <td className="criteria-name-cell">

                      <div className="criteria-title-row">

                        <strong>
                          A.
                        </strong>

                        <span>
                          E-Governance Initiatives
                        </span>

                      </div>

                    </td>


                    <td>

                      <ul>

                        <li>
                          E-governance initiatives implemented
                          by the institution
                        </li>

                        <li>
                          Extent of office automation
                        </li>

                        <li>
                          Use of digital systems for
                          administrative activities
                        </li>

                        <li>
                          Online and automated office
                          processes
                        </li>

                        <li>
                          Digital management of institutional
                          records and services
                        </li>

                      </ul>

                    </td>


                    <td className="marks-cell">

                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={marks}
                        onChange={(e) =>
                          handleMarksChange(
                            e.target.value
                          )
                        }
                      />

                      <span>
                        / 05
                      </span>

                    </td>

                  </tr>


                  {/* ================= TOTAL ================= */}

                  <tr className="total-row">

                    <td colSpan="2">
                      Total Marks
                    </td>

                    <td>

                      <strong>
                        {totalMarks}
                      </strong>

                      {" / 05"}

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              SUPPORTING DOCUMENTS
          ================================================= */}

          <div className="criteria910-card documents-card">

            <div className="criteria910-card-title">

              <FaCloudUploadAlt />

              <span>
                Supporting Documents (Upload)
              </span>

            </div>


            <div className="criteria910-table-wrapper">

              <table className="criteria910-doc-table">

                <thead>

                  <tr>

                    <th>
                      Sr. No.
                    </th>

                    <th>
                      Document Type
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Upload File
                    </th>

                    <th>
                      View
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {documents.map(
                    (doc, index) => (

                      <tr key={doc.id}>

                        <td className="serial-cell">
                          {doc.id}
                        </td>


                        <td className="document-type">
                          {doc.type}
                        </td>


                        <td className="document-description">
                          {doc.description}
                        </td>


                        <td className="upload-cell">

                          <input
                            type="file"
                            ref={(el) =>
                              (fileRefs.current[index] = el)
                            }
                            onChange={(e) =>
                              handleFileChange(
                                index,
                                e
                              )
                            }
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          />

                        </td>


                        <td className="view-cell">

                          <button
                            type="button"
                            className="document-view-btn"
                            onClick={() =>
                              handleViewDocument(
                                index
                              )
                            }
                            title="View Document"
                          >

                            <FaEye />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT SECTION
        =================================================== */}

        <div className="criteria910-right">

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <div className="criteria910-card instructions-card">

            <div className="right-card-title green-title">

              <FaInfoCircle />

              <span>
                Instructions
              </span>

            </div>


            <ul>

              <li>
                Provide documentary evidence for
                e-governance initiatives.
              </li>

              <li>
                Evidence should indicate the extent
                of office automation.
              </li>

              <li>
                Consider relevant activities during
                the assessment period.
              </li>

              <li>
                Maximum marks are 05.
              </li>

              <li>
                Marks should be awarded based on the
                documentary evidence provided.
              </li>

            </ul>

          </div>


          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria910-card exhibits-card">

            <div className="right-card-title blue-title">

              <FaFileAlt />

              <span>
                Exhibits / Context to be Observed / Assessed
              </span>

            </div>


            <p className="exhibits-intro">

              <strong>
                E-Governance Initiatives:
              </strong>

            </p>


            <ul>

              <li>
                E-governance initiatives
              </li>

              <li>
                Extent of office automation
              </li>

              <li>
                Digital / online administrative processes
              </li>

              <li>
                Automated office services and systems
              </li>

              <li>
                Digital record and document management
              </li>

            </ul>

          </div>


          {/* =================================================
              EVALUATION & MARKS
          ================================================= */}

          <div className="criteria910-card evaluation-card">

            <div className="right-card-title purple-title">

              <FaStar />

              <span>
                Evaluation &amp; Marks
              </span>

            </div>


            <div className="marks-section">

              <label>
                Marks Awarded (Out of 05)
              </label>


              <div className="marks-input-wrapper">

                <strong className="auto-total-marks">
                  {totalMarks}
                </strong>

                <span>
                  / 05
                </span>

              </div>


              <small>
                Marks awarded for E-Governance Initiatives
              </small>

            </div>


            <div className="remarks-section">

              <label>

                Remarks{" "}

                <span>
                  (Optional)
                </span>

              </label>


              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
                placeholder="Enter remarks..."
                rows="4"
              />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FINAL TOTAL
      ===================================================== */}

      <div className="criteria910-final-total">

        <span>
          Total Marks for Criterion 9.10
        </span>

        <strong>
          {totalMarks} / 05
        </strong>

      </div>


      {/* =====================================================
          ACTION BAR
      ===================================================== */}

      <div className="criteria910-actions">

        {/* PREVIOUS */}

        <button
          type="button"
          className="action-btn previous-btn"
          onClick={handlePrevious}
        >

          <FaArrowLeft />

          Previous

        </button>


        {/* BACK */}

        <button
          type="button"
          className="action-btn back-btn"
          onClick={handleBack}
        >

          <FaUndo />

          Back

        </button>


        {/* SAVE / UPDATE */}

        <button
          type="button"
          className="action-btn save-btn"
          onClick={
            recordId
              ? handleUpdate
              : handleSave
          }
          disabled={loading}
        >

          <FaSave />

          {loading
            ? "Saving..."
            : recordId
              ? "Update"
              : "Save"}

        </button>



        {/* DELETE */}

        <button
          type="button"
          className="action-btn delete-btn"
          onClick={handleDelete}
        >

          <FaTrash />

          Delete

        </button>


        {/* PRINT */}

        <button
          type="button"
          className="action-btn print-btn"
          onClick={handlePrint}
        >

          <FaPrint />

          Print

        </button>


        {/* NEXT */}

        <button
          type="button"
          className="action-btn next-btn"
          onClick={handleNext}
        >

          Next

          <FaArrowRight />

        </button>

      </div>

    </div>
  );
}

export default Criteria910EGovernance;