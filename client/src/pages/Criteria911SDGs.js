import React, {useEffect,useRef,useState} from "react";
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
} from "react-icons/fa";

import "./Criteria911SDGs.css";

function Criteria911SDGs() {
  const navigate = useNavigate();
  const fileRefs = useRef([]);

  /* ================= STATE ================= */

  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const [marks, setMarks] = useState(0);
  const [remarks, setRemarks] = useState("");

  /* ================= DOCUMENT LIST ================= */

  const documentsList = [
    {
      id: 1,
      type: "SDG Policy / Guidelines",
      description: "Policy documents related to SDGs",
    },
    {
      id: 2,
      type: "Green Energy Evidence",
      description: "Evidence of green energy initiatives",
    },
    {
      id: 3,
      type: "Waste Management / Recycling Evidence",
      description:
        "Evidence of waste management and recycling activities",
    },
    {
      id: 4,
      type: "Water Conservation Evidence",
      description:
        "Evidence of water conservation / preserving water",
    },
    {
      id: 5,
      type: "SDG Activities / Implementation Reports",
      description:
        "Reports of SDG-specific activities conducted",
    },
    {
      id: 6,
      type: "Any Other Relevant Document",
      description:
        "Any other supporting document related to SDGs",
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
/* ================= LOAD SAVED DATA ================= */

useEffect(() => {
  const loadSavedData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/criteria911/latest"
      );

      const data = response.data?.data || response.data;

      if (!data?.id) return;

      setRecordId(data.id);
      setMarks(Number(data.marks) || 0);
      setRemarks(data.remarks || "");

      setDocuments((prev) =>
        prev.map((doc, index) => {
          const fileName = data[`document_${index + 1}`];

          return {
            ...doc,
            fileName: fileName || "",
            uploaded: !!fileName,
            file: null,
          };
        })
      );
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("9.11 Load Error:", error);
      }
    }
  };

  loadSavedData();
}, []);
  /* ================= MARK CHANGE ================= */

  const handleMarksChange = (value) => {
    let newValue = Number(value);

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    if (newValue > 10) {
      newValue = 10;
    }

    setMarks(newValue);
  };

  /* ================= FILE CHANGE ================= */

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

  /* ================= VIEW DOCUMENT ================= */

  const handleViewDocument = (index) => {
  const doc = documents[index];

  if (doc.file) {
    const url = URL.createObjectURL(doc.file);
    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);

    return;
  }

  if (doc.fileName) {
    const url =
      `http://localhost:5000/uploads/criteria911/${doc.fileName}`;

    window.open(url, "_blank");
    return;
  }

  alert("Please upload the document first.");
};
  /* ================= FORM DATA ================= */

  const createFormData = () => {
    const formData = new FormData();

    formData.append("criterion", "9.11");
    formData.append("marks", Number(marks));
    formData.append("total_marks", Number(marks));
    formData.append("remarks", remarks);

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

  /* ================= SAVE ================= */

  const handleSave = async () => {
  try {
    setLoading(true);

    const formData = createFormData();

    const response = await axios.post(
      "http://localhost:5000/api/criteria911",
      formData
    );

    const id =
      response.data?.id ||
      response.data?.data?.id ||
      null;

    setRecordId(id);

    alert(
      `Criterion 9.11 saved successfully.\n\nTotal Marks: ${marks} / 10`
    );
  } catch (error) {
    console.error("9.11 Save Error:", error);
    console.error("Backend Response:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Save failed. Please check backend API /api/criteria911."
    );
  } finally {
    setLoading(false);
  }
};
  /* ================= UPDATE ================= */

 const handleUpdate = async () => {
  if (!recordId) {
    await handleSave();
    return;
  }

  try {
    setLoading(true);

    const formData = createFormData();

    await axios.put(
      `http://localhost:5000/api/criteria911/${recordId}`,
      formData
    );

    alert(
      `Criterion 9.11 updated successfully.\n\nTotal Marks: ${marks} / 10`
    );
  } catch (error) {
    console.error("9.11 Update Error:", error);
    console.error("Backend Response:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Unable to update Criterion 9.11."
    );
  } finally {
    setLoading(false);
  }
};
  /* ================= DELETE ================= */

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete Criterion 9.11 data?"
    );

    if (!confirmDelete) return;

    try {
      if (recordId) {
       await axios.delete(
  `http://localhost:5000/api/criteria911/${recordId}`
);
      }

      handleClear();

      alert(
        "Criterion 9.11 data deleted successfully."
      );
    } catch (error) {
      console.error(
        "9.11 Delete Error:",
        error
      );

      alert(
        "Unable to delete Criterion 9.11 data."
      );
    }
  };

  /* ================= CLEAR ================= */

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

  /* ================= NAVIGATION ================= */

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrevious = () => {
    navigate("/criteria9/continuous-internal-assessment");
  };
const handleNext = () => {
  navigate("/criteria9/12");
};

  /* ================= PRINT ================= */

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="criteria911-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="criteria911-header">

        <div className="criteria911-header-left">

          <div className="criteria911-number">
            9.11
          </div>

          <div className="criteria911-header-icon">
            <FaClipboardList />
          </div>

          <div>
            <h1>
              9.11&nbsp;&nbsp;Initiatives and Implementation
              of Sustainable Development Goals (SDGs)
            </h1>

            <p>
              Evaluate the policy and implementation of
              SDGs-specific activities conducted during
              the assessment period.
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          EVALUATION POINT + EXHIBITS
      ===================================================== */}

      <div className="criteria911-top-grid">

        <div className="criteria911-evaluation-point">

          <div className="evaluation-point-icon">
            <FaClipboardList />
          </div>

          <div>
            <h3>Evaluation Point:</h3>

            <p>
              Policy and implementation of SDGs-specific
              activities conducted during the assessment
              period.
            </p>
          </div>

        </div>

        <div className="criteria911-exhibits-top">

          <div className="top-exhibits-title">
            <FaEye />
            <span>
              Exhibits / Context to be Observed / Assessed:
            </span>
          </div>

          <p>
            ❖ Evidence on green energy, waste management,
            preserving water, net zero, quality education,
            reuse, recycle, less use to renewables, etc.
          </p>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="criteria911-main-grid">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="criteria911-left">

          {/* ================= GUIDELINES ================= */}

          <div className="criteria911-card">

            <div className="criteria911-card-title">

              <FaClipboardList />

              <span>
                Evaluation Guidelines / Breakdown of Marks
              </span>

            </div>

            <div className="criteria911-table-wrapper">

              <table className="criteria911-guideline-table">

                <thead>

                  <tr>
                    <th>Criteria</th>
                    <th>Description / Indicators</th>
                    <th>Marks</th>
                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td className="criteria-cell">

                      <div className="criteria-title-row">

                        <strong>A.</strong>

                        <span>
                          Initiatives and Implementation
                          of Sustainable Development
                          Goals (SDGs)
                        </span>

                      </div>

                    </td>

                    <td>

                      <ul>

                        <li>
                          Policy and implementation of
                          SDGs-specific activities conducted
                          during the assessment period.
                        </li>

                        <li>
                          Evidence of green energy,
                          waste management and recycling.
                        </li>

                        <li>
                          Initiatives for preserving water,
                          net zero and environmental
                          sustainability.
                        </li>

                        <li>
                          Initiatives related to quality
                          education, reuse and reduced
                          resource consumption.
                        </li>

                      </ul>

                    </td>

                    <td className="marks-cell">

                      <div className="marks-input-box">

                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={marks}
                          onChange={(e) =>
                            handleMarksChange(
                              e.target.value
                            )
                          }
                        />

                        <span>/ 10</span>

                      </div>

                    </td>

                  </tr>

                  <tr className="total-row">

                    <td colSpan="2">
                      Total Marks
                    </td>

                    <td>
                      <strong>
                        {marks}
                      </strong>
                      {" / 10"}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= SUPPORTING DOCUMENTS ================= */}

          <div className="criteria911-card documents-card">

            <div className="criteria911-card-title">

              <FaCloudUploadAlt />

              <span>
                Supporting Documents (Upload)
              </span>

            </div>

            <div className="criteria911-table-wrapper">

              <table className="criteria911-doc-table">

                <thead>

                  <tr>
                    <th>Sr. No.</th>
                    <th>Document Type</th>
                    <th>Description</th>
                    <th>Upload File</th>
                    <th>View</th>
                  </tr>

                </thead>

                <tbody>

                  {documents.map((doc, index) => (

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
                            handleViewDocument(index)
                          }
                        >
                          <FaEye />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="criteria911-right">

          {/* ================= INSTRUCTIONS ================= */}

          <div className="criteria911-card instructions-card">

            <div className="right-card-title green-title">

              <FaInfoCircle />

              <span>
                Instructions
              </span>

            </div>

            <ul>

              <li>
                Provide documentary evidence for SDG
                initiatives and implementation.
              </li>

              <li>
                Consider relevant activities during the
                assessment period.
              </li>

              <li>
                Maximum marks are 10.
              </li>

              <li>
                Marks should be awarded based on the
                documentary evidence provided.
              </li>

            </ul>

          </div>

          {/* ================= EXHIBITS ================= */}

          <div className="criteria911-card exhibits-card">

            <div className="right-card-title blue-title">

              <FaEye />

              <span>
                Exhibits / Context to be Observed / Assessed
              </span>

            </div>

            <p className="exhibits-intro">

              <strong>
                SDG Initiatives:
              </strong>

            </p>

            <ul>

              <li>
                E-governance / sustainable initiatives
                where relevant
              </li>

              <li>
                Green energy initiatives
              </li>

              <li>
                Waste management and recycling
              </li>

              <li>
                Water conservation / preserving water
              </li>

              <li>
                Net zero and environmental sustainability
              </li>

              <li>
                Quality education and SDG-related
                activities
              </li>

              <li>
                Reuse, recycle and reduced resource
                consumption
              </li>

            </ul>

          </div>

          {/* ================= EVALUATION ================= */}

          <div className="criteria911-card evaluation-card">

            <div className="right-card-title purple-title">

              <FaStar />

              <span>
                Evaluation &amp; Marks
              </span>

            </div>

            <div className="marks-section">

              <label>
                Marks Awarded (Out of 10)
              </label>

              <div className="marks-display">

                <strong>
                  {marks}
                </strong>

                <span>
                  / 10
                </span>

              </div>

              <small>
                Marks awarded for SDGs Initiatives
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

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="criteria911-actions">

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

export default Criteria911SDGs;