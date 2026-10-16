import React, {useEffect,useRef,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
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

import "./Criteria912InnovativeEducationalInitiatives.css";

function Criteria912InnovativeEducationalInitiatives() {

  const navigate = useNavigate();
  const fileRefs = useRef([]);

  /* =========================================================
     RECORD
  ========================================================= */

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* =========================================================
     MARKS
  ========================================================= */

  const [marks, setMarks] = useState(0);
  const [remarks, setRemarks] = useState("");

  const totalMarks = Number(marks) || 0;

  /* =========================================================
     DOCUMENT LIST
  ========================================================= */

  const documentsList = [
    {
      id: 1,
      type: "Universal Human Values Initiatives",
      description:
        "Evidence of activities related to Universal Human Values",
    },
    {
      id: 2,
      type: "Indian Knowledge System Evidence",
      description:
        "Evidence of initiatives under Indian Knowledge System",
    },
    {
      id: 3,
      type: "Multidisciplinary Programs",
      description:
        "Evidence of multidisciplinary / interdisciplinary programs",
    },
    {
      id: 4,
      type: "Flexible Curriculum / Student Mobility Evidence",
      description:
        "Evidence of flexible curriculum and student mobility",
    },
    {
      id: 5,
      type: "Academic Bank of Credits",
      description:
        "Evidence of implementation of Academic Bank of Credits",
    },
    {
      id: 6,
      type: "Any Other Relevant Document",
      description:
        "Any other supporting document related to innovative educational initiatives",
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
   LOAD SAVED DATA
========================================================= */

useEffect(() => {

  const loadSavedData = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/criteria912/latest"
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {

        const data = response.data.data;

        setRecordId(data.id);

        setMarks(
          Number(data.marks || 0)
        );

        setRemarks(
          data.remarks || ""
        );

        setDocuments((prev) => {

          return prev.map((doc, index) => {

            const fileKey =
              `document_${index + 1}`;

            const savedFile =
              data[fileKey];

            return {
              ...doc,

              fileName:
                savedFile || "",

              uploaded:
                !!savedFile
            };

          });

        });

      }

    } catch (error) {

      if (error.response?.status !== 404) {

        console.error(
          "Criteria 9.12 Load Error:",
          error
        );

      }

    }

  };

  loadSavedData();

}, []);
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

    if (!file) return;

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
     FORM DATA
  ========================================================= */

  const createFormData = () => {

  const formData = new FormData();

  formData.append("criterion", "9.12");
  formData.append("marks", String(totalMarks));
  formData.append("marks_a", String(totalMarks));
  formData.append("total_marks", String(totalMarks));
  formData.append("remarks", remarks || "");

  documents.forEach((doc, index) => {

    if (doc.file instanceof File) {

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

    console.log(
      "========== CRITERIA 9.12 SAVE =========="
    );

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axios.post(
      "http://localhost:5000/api/criteria912",
      formData
    );

    console.log(
      "SAVE RESPONSE:",
      response.data
    );

    const id =
      response.data?.id ||
      response.data?.data?.id ||
      null;

    if (id) {

      setRecordId(id);

    }

    alert(
      `Criterion 9.12 saved successfully.\n\nTotal Marks: ${totalMarks} / 05`
    );

  } catch (error) {

    console.error(
      "9.12 Save Error:",
      error
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      error.message ||
      "Save failed."
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
      `http://localhost:5000/api/criteria912/${recordId}`,
      formData
    );

    console.log(
      "UPDATE RESPONSE:",
      response.data
    );

    alert(
      `Criterion 9.12 updated successfully.\n\nTotal Marks: ${totalMarks} / 05`
    );

  } catch (error) {

    console.error(
      "9.12 Update Error:",
      error
    );

    console.error(
      "Status:",
      error.response?.status
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Unable to update Criterion 9.12."
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
    "Are you sure you want to delete Criterion 9.12 data?"
  );

  if (!confirmDelete) return;

  try {

    if (recordId) {

      await axios.delete(
        `http://localhost:5000/api/criteria912/${recordId}`
      );

    }

    handleClear();

    alert(
      "Criterion 9.12 data deleted successfully."
    );

  } catch (error) {

    console.error(
      "9.12 Delete Error:",
      error
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Unable to delete Criterion 9.12 data."
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

    setSubmitted(false);

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
     NAVIGATION
  ========================================================= */

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrevious = () => {
    navigate("/criteria9/sdgs");
  };

  const handleNext = () => {
  navigate("/criteria9/13");
};
  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (

    <div className="criteria912-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="criteria912-header">

        <div className="criteria912-header-left">

          <div className="criteria912-number">
            9.12
          </div>

          <div className="criteria912-header-icon">
            <FaClipboardList />
          </div>

          <div>

            <h1>
              9.12 Innovative Educational Initiatives
            </h1>

            <p>
              Evaluate innovative educational initiatives
              implemented by the institution.
            </p>

          </div>

        </div>


      </div>


      {/* =====================================================
          TOP EVALUATION POINT + INSTRUCTIONS
      ===================================================== */}

      <div className="criteria912-top-grid">

        {/* EVALUATION POINT */}

        <div className="criteria912-evaluation-point">

          <div className="evaluation-point-icon">
            <FaClipboardList />
          </div>

          <div>

            <h3>
              Evaluation Point:
            </h3>

            <p>
              <strong>
                A. Innovative Educational Initiatives
              </strong>
              <span className="top-marks">
                (05)
              </span>
            </p>

          </div>

        </div>


        {/* INSTRUCTIONS */}

        <div className="criteria912-instructions-top">

          <div className="top-instructions-title">

            <FaInfoCircle />

            <span>
              Instructions
            </span>

          </div>

          <ul>

            <li>
              Provide documentary evidence for
              innovative educational initiatives.
            </li>

            <li>
              Consider relevant initiatives during
              the assessment period.
            </li>

            <li>
              Maximum marks are 05.
            </li>

            <li>
              Marks should be awarded based on
              the documentary evidence provided.
            </li>

          </ul>

        </div>

      </div>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="criteria912-main-grid">

        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="criteria912-left">

          {/* =================================================
              GUIDELINES
          ================================================= */}

          <div className="criteria912-card">

            <div className="criteria912-card-title">

              <FaClipboardList />

              <span>
                Evaluation Guidelines / Breakdown of Marks
              </span>

            </div>


            <div className="criteria912-table-wrapper">

              <table className="criteria912-guideline-table">

                <thead>

                  <tr>

                    <th>
                      Sr. No.
                    </th>

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

                  <tr>

                    <td className="criteria-sr">
                      A.
                    </td>

                    <td className="criteria-name">

                      <strong>
                        Innovative Educational
                        Initiatives
                      </strong>

                    </td>


                    <td>

                      <ul>

                        <li>
                          Initiatives towards Universal
                          Human Values
                        </li>

                        <li>
                          Indian Knowledge System
                        </li>

                        <li>
                          Multidisciplinary programs
                        </li>

                        <li>
                          Flexible curriculum
                        </li>

                        <li>
                          Mobility of students
                        </li>

                        <li>
                          Academic Bank of Credits
                        </li>

                        <li>
                          Support facilities for
                          holistic education
                        </li>

                        <li>
                          Any other innovative
                          educational initiatives
                        </li>

                      </ul>

                    </td>


                    <td className="marks-cell">

                      <div className="marks-input-box">

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

                      </div>

                    </td>

                  </tr>


                  {/* TOTAL */}

                  <tr className="total-row">

                    <td
                      colSpan="3"
                    >
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

          <div className="criteria912-card documents-card">

            <div className="criteria912-card-title">

              <FaCloudUploadAlt />

              <span>
                Supporting Documents (Upload)
              </span>

            </div>


            <div className="criteria912-table-wrapper">

              <table className="criteria912-doc-table">

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
                              (fileRefs.current[index] =
                                el)
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
            RIGHT
        =================================================== */}

        <div className="criteria912-right">


          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria912-card exhibits-card">

            <div className="right-card-title blue-title">

              <FaFileAlt />

              <span>
                Exhibits / Context to be Observed / Assessed
              </span>

            </div>


            <p className="exhibits-intro">

              <strong>
                Appropriate documentary evidence such as:
              </strong>

            </p>


            <ul>

              <li>
                Evidence of Universal Human Values
                initiatives
              </li>

              <li>
                Indian Knowledge System activities
              </li>

              <li>
                Multidisciplinary / interdisciplinary
                programs
              </li>

              <li>
                Flexible curriculum implementation
              </li>

              <li>
                Student mobility records
              </li>

              <li>
                Academic Bank of Credits evidence
              </li>

              <li>
                Holistic education support facilities
              </li>

              <li>
                Any other relevant supporting documents
              </li>

            </ul>

          </div>


          {/* =================================================
              EVALUATION
          ================================================= */}

          <div className="criteria912-card evaluation-card">

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


              <div className="marks-display">

                <strong>
                  {totalMarks}
                </strong>

                <span>
                  / 05
                </span>

              </div>


              <small>
                Marks awarded for Innovative
                Educational Initiatives
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
                  setRemarks(e.target.value)
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

      <div className="criteria912-final-total">

        <span>
          Total Marks for Criterion 9.12
        </span>

        <strong>
          {totalMarks} / 05
        </strong>

      </div>


      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="criteria912-actions">


        {/* PREVIOUS */}

        <button
          className="action-btn previous-btn"
          onClick={handlePrevious}
        >

          <FaArrowLeft />

          Previous

        </button>


        {/* BACK */}

        <button
          className="action-btn back-btn"
          onClick={handleBack}
        >

          <FaUndo />

          Back

        </button>


        {/* SAVE / UPDATE */}

        <button
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
          className="action-btn delete-btn"
          onClick={handleDelete}
        >

          <FaTrash />

          Delete

        </button>


        {/* PRINT */}

        <button
          className="action-btn print-btn"
          onClick={handlePrint}
        >

          <FaPrint />

          Print

        </button>


        {/* NEXT */}

        <button
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

export default Criteria912InnovativeEducationalInitiatives;