import React, {useEffect, useRef,useState} from "react";
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

import "./Criteria99ContinuousInternalAssessment.css";

function Criteria99ContinuousInternalAssessment() {
  const navigate = useNavigate();
  const fileRefs = useRef([]);

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
 

  /* =====================================================
     MARKS
  ===================================================== */

  const [marks, setMarks] = useState({
    A: 0,
    B: 0,
  });

  const [remarks, setRemarks] = useState("");
useEffect(() => {
  const loadSavedData = async () => {
    try {
      const response = await axios.get(
        "/api/criteria99/latest"
      );

      const data = response.data;

      if (!data) return;

      setRecordId(data.id);

      setMarks({
        A: Number(data.marks_a) || 0,
        B: Number(data.marks_b) || 0,
      });

      setRemarks(data.remarks || "");

      setDocuments(
        documentsList.map((doc, index) => {
          const fileName =
            data[`document_${index + 1}`] || "";

          return {
            ...doc,
            file: null,
            fileName: fileName,
            uploaded: !!fileName,
          };
        })
      );

    } catch (error) {
      console.error(
        "Criteria 9.9 Load Error:",
        error
      );
    }
  };

  loadSavedData();
}, []);
  const totalMarks =
    Number(marks.A) +
    Number(marks.B);

  /* =====================================================
     SUPPORTING DOCUMENTS
  ===================================================== */

  const documentsList = [
    {
      id: 1,
      type: "E-Learning Resources",
      description:
        "List / evidence of relevant e-learning resources available for the program",
    },
    {
      id: 2,
      type: "Learning Management System",
      description:
        "LMS / online learning platform resources available to students",
    },
    {
      id: 3,
      type: "Digital Content",
      description:
        "Video lectures, e-books, PPTs, notes and other digital learning material",
    },
    {
      id: 4,
      type: "Student Accessibility Evidence",
      description:
        "Evidence showing accessibility of learning resources to students",
    },
    {
      id: 5,
      type: "ICT / Smart Classroom Resources",
      description:
        "Evidence of ICT enabled classrooms / digital learning facilities",
    },
    {
      id: 6,
      type: "Student Feedback",
      description:
        "Feedback regarding availability and accessibility of learning resources",
    },
    {
      id: 7,
      type: "Any Other Relevant Document",
      description:
        "Other supporting evidence related to learning resources",
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

  /* =====================================================
     MARK CHANGE
  ===================================================== */

  const handleMarksChange = (field, value, max) => {
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

    setMarks((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  /* =====================================================
     FILE CHANGE
  ===================================================== */

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

  /* =====================================================
     VIEW DOCUMENT
  ===================================================== */

  const handleViewDocument = (index) => {
  const doc = documents[index];

  // Newly selected file
  if (doc.file) {
    const url = URL.createObjectURL(doc.file);

    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);

    return;
  }

  // Existing database file
  if (doc.fileName) {
    const url =
      `/uploads/criteria99/${doc.fileName}`;

    window.open(url, "_blank");

    return;
  }

  alert("Please upload the document first.");
};
  /* =====================================================
     CREATE FORM DATA
  ===================================================== */

  const createFormData = () => {
    const formData = new FormData();

    formData.append("marks_a", Number(marks.A));
    formData.append("marks_b", Number(marks.B));
    formData.append("total_marks", Number(totalMarks));
    formData.append("remarks", remarks);
    formData.append("criterion", "9.9");

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

  /* =====================================================
     SAVE
  ===================================================== */

 const handleSave = async () => {
  try {
    setLoading(true);

    const formData = createFormData();

    console.log("========== CRITERIA 9.9 SAVE ==========");
    console.log("Marks A:", marks.A);
    console.log("Marks B:", marks.B);
    console.log("Total:", totalMarks);

    documents.forEach((doc, index) => {
      console.log(
        `document_${index + 1}:`,
        doc.file ? doc.file.name : "No file"
      );
    });

    const response = await axios.post(
      "http://localhost:5000/api/criteria99",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("SAVE RESPONSE:", response.data);

    if (response.data?.id) {
      setRecordId(response.data.id);
    }

    alert(
      `Criterion 9.9 saved successfully.\n\nTotal Marks: ${totalMarks} / 05`
    );

  } catch (error) {

    console.error("========== CRITERIA 9.9 SAVE ERROR ==========");
    console.error("ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("RESPONSE:", error.response?.data);

    alert(
      error.response?.data?.message ||
      `Save failed. Status: ${error.response?.status || "Server not reachable"}`
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
      await handleSave();
      return;
    }

    try {
      setLoading(true);

      const formData = createFormData();

      await axios.put(
        `/api/criteria99/${recordId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(
        `Criterion 9.9 updated successfully.\n\nTotal Marks: ${totalMarks} / 05`
      );
    } catch (error) {
      console.error("9.9 Update Error:", error);

      alert(
        "Unable to update Criterion 9.9."
      );
    } finally {
      setLoading(false);
    }
  };

 
  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete Criterion 9.9 data?"
    );

    if (!confirmDelete) return;

    try {
      if (recordId) {
        await axios.delete(
          `/api/criteria99/${recordId}`
        );
      }

      handleClear();

      alert(
        "Criterion 9.9 data deleted successfully."
      );
    } catch (error) {
      console.error("9.9 Delete Error:", error);

      alert(
        "Unable to delete Criterion 9.9 data."
      );
    }
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {
    setRecordId(null);

    setMarks({
      A: 0,
      B: 0,
    });

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

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrevious = () => {
    navigate("/criteria9/monitoring-review");
  };

  const handleNext = () => {
    navigate("/criteria9/10");
  };

  /* =====================================================
     PRINT
  ===================================================== */

  const handlePrint = () => {
    window.print();
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="criteria99-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="criteria99-header">

        <div className="criteria99-header-left">

          <div className="criteria99-number">
            9.9
          </div>

          <div className="criteria99-header-icon">
            <FaClipboardList />
          </div>

          <div>
            <h1>
              9.9&nbsp;&nbsp;Quality of Learning Resources
              (Hard/Soft)
            </h1>

            <p>
              Availability and accessibility of relevant
              learning resources for the program.
            </p>
          </div>

        </div>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="criteria99-summary">

        <div className="summary-icon">
          <FaClipboardList />
        </div>

        <div className="summary-content">

          <div className="summary-row">
            <span className="summary-letter">
              A.
            </span>

            <span>
              Availability of relevant e-learning
              resources of the program under consideration
            </span>

            <b>(02)</b>
          </div>

          <div className="summary-row">
            <span className="summary-letter">
              B.
            </span>

            <span>
              Accessibility of learning resources to
              students
            </span>

            <b>(03)</b>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="criteria99-main-grid">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="criteria99-left">

          {/* =================================================
              EVALUATION GUIDELINES
          ================================================= */}

          <div className="criteria99-card">

            <div className="criteria99-card-title">

              <FaClipboardList />

              <span>
                Evaluation Guidelines / Breakdown of Marks
              </span>

            </div>

            <div className="criteria99-table-wrapper">

              <table className="criteria99-guideline-table">

                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th>
                      Description / Indicators
                    </th>
                    <th>Marks</th>
                  </tr>
                </thead>

                <tbody>

                  {/* ================= A ================= */}

                  <tr>

                    <td>

                      <div className="criteria-title-row">

                        <strong>A.</strong>

                        <span>
                          Availability of relevant
                          e-learning resources
                        </span>

                      </div>

                    </td>

                    <td>

                      <ul>

                        <li>
                          Availability of relevant
                          e-learning resources for the
                          program
                        </li>

                        <li>
                          Digital learning content such
                          as e-books, videos, PPTs and
                          lecture material
                        </li>

                        <li>
                          Availability of LMS / online
                          learning platforms
                        </li>

                        <li>
                          Availability of ICT enabled
                          learning facilities
                        </li>

                      </ul>

                    </td>

                    <td className="marks-cell">

                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.5"
                        value={marks.A}
                        onChange={(e) =>
                          handleMarksChange(
                            "A",
                            e.target.value,
                            2
                          )
                        }
                      />

                      <span>/ 02</span>

                    </td>

                  </tr>

                  {/* ================= B ================= */}

                  <tr>

                    <td>

                      <div className="criteria-title-row">

                        <strong>B.</strong>

                        <span>
                          Accessibility of learning
                          resources to students
                        </span>

                      </div>

                    </td>

                    <td>

                      <ul>

                        <li>
                          Easy access to learning
                          resources by students
                        </li>

                        <li>
                          Availability of resources
                          through LMS / online platforms
                        </li>

                        <li>
                          Accessibility of digital
                          content anytime and anywhere
                        </li>

                        <li>
                          Student awareness and usage
                          of available resources
                        </li>

                      </ul>

                    </td>

                    <td className="marks-cell">

                      <input
                        type="number"
                        min="0"
                        max="3"
                        step="0.5"
                        value={marks.B}
                        onChange={(e) =>
                          handleMarksChange(
                            "B",
                            e.target.value,
                            3
                          )
                        }
                      />

                      <span>/ 03</span>

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

          <div className="criteria99-card documents-card">

            <div className="criteria99-card-title">

              <FaCloudUploadAlt />

              <span>
                Supporting Documents (Upload)
              </span>

            </div>

            <div className="criteria99-table-wrapper">

              <table className="criteria99-doc-table">

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
      handleFileChange(index, e)
    }
    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
  />

  {doc.fileName && (
    <div className="saved-file-name">
      <FaFileAlt />
      <span>{doc.fileName}</span>
    </div>
  )}

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

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="criteria99-right">

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <div className="criteria99-card instructions-card">

            <div className="right-card-title green-title">

              <FaInfoCircle />

              <span>
                Instructions
              </span>

            </div>

            <ul>

              <li>
                Provide documentary evidence for
                availability of relevant learning
                resources.
              </li>

              <li>
                Evidence should cover both hard and
                soft learning resources.
              </li>

              <li>
                Consider resources available during
                the assessment period.
              </li>

              <li>
                Maximum marks are 05.
              </li>

              <li>
                Marks for A and B should be awarded
                based on documentary evidence.
              </li>

            </ul>

          </div>

          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria99-card exhibits-card">

            <div className="right-card-title blue-title">

              <FaFileAlt />

              <span>
                Exhibits / Context to be Observed / Assessed
              </span>

            </div>

            <p className="exhibits-intro">

              <strong>
                A &amp; B:
              </strong>{" "}

              Availability of relevant learning
              resources

            </p>

            <ul>

              <li>
                E-learning resources
              </li>

              <li>
                Learning Management System (LMS)
              </li>

              <li>
                Digital learning content
              </li>

              <li>
                E-books, videos and online material
              </li>

              <li>
                ICT enabled learning facilities
              </li>

              <li>
                Evidence of student accessibility
              </li>

            </ul>

          </div>

          {/* =================================================
              EVALUATION
          ================================================= */}

          <div className="criteria99-card evaluation-card">

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

                <strong>
                  {totalMarks}
                </strong>

                <span>
                  / 05
                </span>

              </div>

              <small>
                Automatically calculated from A + B
              </small>

            </div>

            <div className="remarks-section">

              <label>
                Remarks <span>(Optional)</span>
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

      {/* =================================================
          FINAL TOTAL
      ================================================= */}

      <div className="criteria99-final-total">

        <span>
          Total Marks for Criterion 9.9
        </span>

        <strong>
          {totalMarks} / 05
        </strong>

      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="criteria99-actions">

        <button
          className="action-btn previous-btn"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>

        <button
          className="action-btn back-btn"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>

        <button
  className="action-btn save-btn"
  onClick={handleSave}
  disabled={loading}
>
  <FaSave />
  {loading ? "Saving..." : "Save"}
</button>
        
        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>

        <button
          className="action-btn print-btn"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>

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

export default Criteria99ContinuousInternalAssessment;