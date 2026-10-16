import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaClipboardList,
  FaCloudUploadAlt,
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
  FaFileAlt,
  FaEdit,
} from "react-icons/fa";

import "./Criteria913FPADS.css";

function Criteria913FPADS() {

  const navigate = useNavigate();
  const fileRefs = useRef([]);

  /* =====================================================
     RECORD
  ===================================================== */

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* =====================================================
     MARKS
  ===================================================== */

  const [marksA, setMarksA] = useState(0);
  const [marksB, setMarksB] = useState(0);

  /* =====================================================
     REMARKS
  ===================================================== */

  const [remarksA, setRemarksA] = useState("");
  const [remarksB, setRemarksB] = useState("");

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: "Notified Performance appraisal and Development System",
      description:
        "Document showing the notified performance appraisal and development system",
      file: null,
    },
    {
      id: 2,
      type: "Appraisal Parameters",
      description:
        "Document showing the appraisal parameters",
      file: null,
    },
    {
      id: 3,
      type: "Faculty Awareness",
      description:
        "Evidence of faculty awareness about the appraisal and development system",
      file: null,
    },
    {
      id: 4,
      type: "Implementation, Transparency and Effectiveness",
      description:
        "Evidence of implementation, transparency and effectiveness of the system",
      file: null,
    },
  ]);
useEffect(() => {

  const loadSavedData = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/criteria913/latest"
      );

      if (
        response.data?.success &&
        response.data?.data
      ) {

        const data = response.data.data;

        setRecordId(data.id);

        setMarksA(
          Number(data.marks_a || 0)
        );

        setMarksB(
          Number(data.marks_b || 0)
        );

        setRemarksA(
          data.remarks_a || ""
        );

        setRemarksB(
          data.remarks_b || ""
        );

        setDocuments((prev) => {

          return prev.map((doc, index) => {

            const fileName =
              data[`document_${index + 1}`];

            return {
              ...doc,
              file: null,
              savedFileName: fileName || ""
            };

          });

        });

      }

    } catch (error) {

      if (error.response?.status !== 404) {

        console.error(
          "Criteria 9.13 Load Error:",
          error
        );

      }

    }

  };

  loadSavedData();

}, []);
  /* =====================================================
     CALCULATION
  ===================================================== */

  const totalMarks =
    Number(marksA || 0) + Number(marksB || 0);

  const percentage =
    ((totalMarks / 10) * 100).toFixed(2);

  let evaluationStatus = "Not Evaluated";

  if (totalMarks >= 9) {
    evaluationStatus = "Excellent";
  } else if (totalMarks >= 7) {
    evaluationStatus = "Very Good";
  } else if (totalMarks >= 5) {
    evaluationStatus = "Good";
  } else if (totalMarks > 0) {
    evaluationStatus = "Needs Improvement";
  }

  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (index, event) => {

  const file = event.target.files[0];

  if (!file) return;

  setDocuments((prev) =>
    prev.map((doc, i) =>
      i === index
        ? {
            ...doc,
            file: file,
            savedFileName: "",
          }
        : doc
    )
  );
};
  /* =====================================================
     VIEW FILE
  ===================================================== */
const handleView = (file, savedFileName) => {

  // Newly selected file
  if (file) {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
    return;
  }

  // Saved database file
  if (savedFileName) {

    const fileURL =
      `http://localhost:5000/uploads/criteria913/${savedFileName}`;

    window.open(fileURL, "_blank");
    return;
  }

  alert("No document uploaded.");
};

  /* =====================================================
     MARK A
  ===================================================== */

  const handleMarksA = (e) => {

    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 4) value = 4;

    setMarksA(value);
  };

  /* =====================================================
     MARK B
  ===================================================== */

  const handleMarksB = (e) => {

    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 6) value = 6;

    setMarksB(value);
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("criterion", "9.13");
      formData.append("marksA", marksA);
      formData.append("marksB", marksB);
      formData.append("remarksA", remarksA);
      formData.append("remarksB", remarksB);
      formData.append("totalMarks", totalMarks);
      formData.append("percentage", percentage);

      documents.forEach((doc) => {

        if (doc.file) {

          formData.append(
            `document_${doc.id}`,
            doc.file
          );

        }

      });

      const response = await axios.post(
        "http://localhost:5000/api/criteria913",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {

        if (response.data.id) {
          setRecordId(response.data.id);
        }

        alert("9.13 FPADS saved successfully.");
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Failed to save 9.13 FPADS."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdate = async () => {

    if (!recordId) {
      alert("Please save the record first.");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("id", recordId);
      formData.append("criterion", "9.13");
      formData.append("marksA", marksA);
      formData.append("marksB", marksB);
      formData.append("remarksA", remarksA);
      formData.append("remarksB", remarksB);
      formData.append("totalMarks", totalMarks);
      formData.append("percentage", percentage);

      documents.forEach((doc) => {

        if (doc.file) {

          formData.append(
            `document_${doc.id}`,
            doc.file
          );

        }

      });

      await axios.put(
        "http://localhost:5000/api/criteria913",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("9.13 FPADS updated successfully.");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Failed to update record."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {

    if (!recordId) {
      alert("No saved record found.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/criteria913/${recordId}`
      );

      setRecordId(null);
      setMarksA(0);
      setMarksB(0);
      setRemarksA("");
      setRemarksB("");

      setDocuments(
        documents.map((doc) => ({
          ...doc,
          file: null,
        }))
      );

      alert("Record deleted successfully.");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.error ||
        "Failed to delete record."
      );

    }
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to clear all entered data?"
    );

    if (!confirmClear) return;

    setMarksA(0);
    setMarksB(0);
    setRemarksA("");
    setRemarksB("");

    setDocuments(
      documents.map((doc) => ({
        ...doc,
        file: null,
      }))
    );

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
    navigate("/criteria912/innovative-educational-initiatives");
  };

  const handleNext = () => {
  navigate("/criteria9/outreach-activities");
};

  /* =====================================================
     JSX
  ===================================================== */

  return (

    <div className="criteria913-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="criteria913-header">

        <div className="criteria913-icon">
          <FaClipboardList />
        </div>

        <div className="criteria913-title">

          <h1>
            9.13. Faculty Performance Appraisal and Development
            System (FPADS)
          </h1>

          <p>
            Faculty Performance Appraisal and Development
            System Evaluation
          </p>

        </div>


      </div>


      {/* =================================================
          NBA EVALUATION GUIDELINES
      ================================================= */}

      <div className="criteria913-guideline">

        <div className="guideline-heading">

          <FaInfoCircle />

          <h2>
            NBA Evaluation Guidelines
          </h2>

        </div>


        <div className="guideline-row">

          <div className="guideline-item">

            <div className="guideline-code">
              A
            </div>

            <div>

              <h3>
                A well-defined performance appraisal and
                development system instituted for all the
                assessment years
              </h3>

            </div>

            <div className="guideline-marks">
              04 Marks
            </div>

          </div>


          <div className="guideline-item">

            <div className="guideline-code">
              B
            </div>

            <div>

              <h3>
                Its implementation and effectiveness
              </h3>

            </div>

            <div className="guideline-marks">
              06 Marks
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          EXHIBITS / CONTEXT
      ================================================= */}

      <div className="criteria913-section">

        <div className="section-title">

          <FaFileAlt />

          <div>

            <h2>
              Exhibits / Context to be Observed / Assessed
            </h2>

          </div>

        </div>


        <div className="exhibits-container">

          <div className="exhibit-card">

            <div className="exhibit-letter">
              A
            </div>

            <div className="exhibit-content">

              <h3>
                Notified performance appraisal and development
                system; Appraisal Parameters; Awareness
              </h3>

            </div>

          </div>


          <div className="exhibit-card">

            <div className="exhibit-letter">
              B
            </div>

            <div className="exhibit-content">

              <h3>
                Implementation, Transparency and Effectiveness.
              </h3>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          SUPPORTING DOCUMENTS
      ================================================= */}

      <div className="criteria913-section">

        <div className="section-title">

          <FaClipboardList />

          <div>

            <h2>
              Supporting Documents
            </h2>

          </div>

        </div>


        <div className="document-table-wrapper">

          <table className="document-table">

            <thead>

              <tr>

                <th>Sr. No.</th>
                <th>Document Type</th>
                <th>Description</th>
                <th>Upload</th>
                <th>View</th>

              </tr>

            </thead>


            <tbody>

              {documents.map((doc, index) => (

                <tr key={doc.id}>

                  <td>
                    {doc.id}
                  </td>

                  <td>
                    {doc.type}
                  </td>

                  <td>
                    {doc.description}
                  </td>

                  <td>

                    <input
                      type="file"
                      hidden
                      ref={(el) =>
                        (fileRefs.current[index] = el)
                      }
                      onChange={(e) =>
                        handleFileChange(index, e)
                      }
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />

                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() =>
                        fileRefs.current[index]?.click()
                      }
                    >
                      <FaCloudUploadAlt />
                      Upload
                    </button>

                    {doc.file && (

                      <div className="selected-file">
                        {doc.file.name}
                      </div>

                    )}

                  </td>

                  <td>

                   <button
  type="button"
  className="view-btn"
  disabled={!doc.file && !doc.savedFileName}
  onClick={() =>
    handleView(doc.file, doc.savedFileName)
  }
>
  <FaEye />
  View
</button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          EVALUATION A
      ================================================= */}

      <div className="evaluation-card">

        <div className="evaluation-card-header">

          <div className="evaluation-heading">

            <div className="evaluation-letter">
              A
            </div>

            <div>

              <h2>
                A. A well-defined performance appraisal and
                development system instituted for all the
                assessment years
              </h2>

            </div>

          </div>


          <div className="maximum-marks">

            <span>
              Maximum Marks:
            </span>

            <strong>
              04
            </strong>

          </div>

        </div>


        <div className="evaluation-content">

          <div className="evaluation-points">

            <div className="evaluation-point">

              <p>
                Notified performance appraisal and development
                system; Appraisal Parameters; Awareness
              </p>

            </div>

          </div>


          <div className="marks-box">

            <label>
              Marks <span>(Out of 04)</span>
            </label>

            <input
              type="number"
              min="0"
              max="4"
              value={marksA}
              onChange={handleMarksA}
            />

          </div>

        </div>


        <div className="remarks-section">

          <label>
            Remarks
          </label>

          <textarea
            value={remarksA}
            onChange={(e) =>
              setRemarksA(e.target.value)
            }
            placeholder="Enter remarks for Evaluation A..."
          />

        </div>

      </div>


      {/* =================================================
          EVALUATION B
      ================================================= */}

      <div className="evaluation-card">

        <div className="evaluation-card-header">

          <div className="evaluation-heading">

            <div className="evaluation-letter">
              B
            </div>

            <div>

              <h2>
                B. Its implementation and effectiveness
              </h2>

            </div>

          </div>


          <div className="maximum-marks">

            <span>
              Maximum Marks:
            </span>

            <strong>
              06
            </strong>

          </div>

        </div>


        <div className="evaluation-content">

          <div className="evaluation-points">

            <div className="evaluation-point">

              <p>
                Implementation, Transparency and Effectiveness.
              </p>

            </div>

          </div>


          <div className="marks-box">

            <label>
              Marks <span>(Out of 06)</span>
            </label>

            <input
              type="number"
              min="0"
              max="6"
              value={marksB}
              onChange={handleMarksB}
            />

          </div>

        </div>


        <div className="remarks-section">

          <label>
            Remarks
          </label>

          <textarea
            value={remarksB}
            onChange={(e) =>
              setRemarksB(e.target.value)
            }
            placeholder="Enter remarks for Evaluation B..."
          />

        </div>

      </div>


      {/* =================================================
          NBA CALCULATION
      ================================================= */}

      <div className="calculation-card">

        <div className="calculation-header">

          <FaStar />

          <div>

            <h2>
              NBA Calculation / Evaluation
            </h2>

          </div>

        </div>


        <div className="calculation-grid">

          <div className="calculation-item">

            <span>
              Section A
              <br />
              (Out of 04)
            </span>

            <strong>
              {Number(marksA).toFixed(2)}
            </strong>

          </div>


          <div className="calculation-item">

            <span>
              Section B
              <br />
              (Out of 06)
            </span>

            <strong>
              {Number(marksB).toFixed(2)}
            </strong>

          </div>


          <div className="calculation-item highlight">

            <span>
              Total Marks
              <br />
              (Out of 10)
            </span>

            <strong>
              {totalMarks.toFixed(2)}
            </strong>

          </div>


          <div className="calculation-item highlight">

            <span>
              Percentage
              <br />
              (%)
            </span>

            <strong>
              {percentage}%
            </strong>

          </div>


          <div className="calculation-item status-calculation">

            <span>
              Evaluation Status
            </span>

            <strong>
              {evaluationStatus}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons">

        <button
          type="button"
          className="action-btn previous-btn"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>


        <button
          type="button"
          className="action-btn clear-btn"
          onClick={handleClear}
        >
          <FaUndo />
          Clear
        </button>


        <button
          type="button"
          className="action-btn save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          <FaSave />
          {loading ? "Saving..." : "Save"}
        </button>


        
        <button
          type="button"
          className="action-btn delete-btn"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>


        <button
          type="button"
          className="action-btn print-btn"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>



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

export default Criteria913FPADS;