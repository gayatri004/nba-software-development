import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUniversity,
  FaClipboardList,
  FaCloudUploadAlt,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaInfoCircle,
  FaStar,
  FaFileAlt
} from "react-icons/fa";

import "./Criteria98MonitoringReview.css";

function Criteria98MonitoringReview() {
  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [marks, setMarks] = useState({
    A: 0,
    B: 0
  });

  const [remarks, setRemarks] = useState("");

  const [files, setFiles] = useState(
    Array(7).fill(null)
  );

  const [savedFiles, setSavedFiles] = useState(
    Array(7).fill(null)
  );

  const [recordId, setRecordId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const fileRefs = useRef([]);

  const autoSaveTimer = useRef(null);

  /* =====================================================
     DOCUMENT LIST
  ===================================================== */

  const documents = [
    {
      name: "Budget Allocation Document",
      description:
        "Document showing budget allocation for three assessment years"
    },
    {
      name: "Annual Budget Statements",
      description:
        "Annual budget allocation statements for the assessment period"
    },
    {
      name: "Budget Utilization Statement",
      description:
        "Statement showing utilization of allocated budget"
    },
    {
      name: "Expenditure Reports",
      description:
        "Reports showing expenditure against allocated budget"
    },
    {
      name: "Audited Financial Statements",
      description:
        "Audited statements supporting budget utilization"
    },
    {
      name: "Utilization Certificates",
      description:
        "Budget utilization certificates and supporting evidence"
    },
    {
      name: "Any Other Relevant Document",
      description:
        "Any other supporting budget allocation/utilization document"
    }
  ];

  /* =====================================================
     TOTAL MARKS
  ===================================================== */

  const totalMarks =
    Number(marks.A || 0) +
    Number(marks.B || 0);

  /* =====================================================
     LOAD LATEST DATA
  ===================================================== */

  const loadSavedData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/criteria98/latest"
      );

      if (
        response.data &&
        response.data.id
      ) {
        const data = response.data;

        setRecordId(data.id);

        setMarks({
          A: Number(data.section_98_marks_a || 0),
          B: Number(data.section_98_marks_b || 0)
        });

        setRemarks(
          data.remarks || ""
        );

        const loadedFiles = [
          data.document_1 || null,
          data.document_2 || null,
          data.document_3 || null,
          data.document_4 || null,
          data.document_5 || null,
          data.document_6 || null,
          data.document_7 || null
        ];

        setSavedFiles(loadedFiles);
      }
    } catch (error) {
      console.log(
        "No previous Criteria 9.8 data found"
      );
    }
  }, []);

  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (index, event) => {

  const file = event.target.files?.[0];

  if (!file) return;

  setFiles((prev) => {
    const updated = [...prev];
    updated[index] = file;
    return updated;
  });

  setSavedFiles((prev) => {
    const updated = [...prev];
    updated[index] = file.name;
    return updated;
  });

  scheduleAutoSave();
};
  /* =====================================================
     VIEW FILE
  ===================================================== */

  const handleViewFile = (index) => {
    const file = files[index];

    if (file instanceof File) {
      const url =
        URL.createObjectURL(file);

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    const savedFile =
      savedFiles[index];

    if (savedFile) {
      window.open(
        `http://localhost:5000/uploads/criteria98/${savedFile}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  /* =====================================================
     REMOVE FILE
  ===================================================== */

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    setSavedFiles((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    if (
      fileRefs.current[index]
    ) {
      fileRefs.current[index].value =
        "";
    }

    scheduleAutoSave();
  };

  /* =====================================================
     MARK CHANGE
  ===================================================== */

  const handleMarkChange = (
    section,
    value
  ) => {
    let numericValue =
      Number(value);

    if (Number.isNaN(numericValue)) {
      numericValue = 0;
    }

    if (section === "A") {
      numericValue = Math.min(
        3,
        Math.max(0, numericValue)
      );
    }

    if (section === "B") {
      numericValue = Math.min(
        5,
        Math.max(0, numericValue)
      );
    }

    setMarks((prev) => ({
      ...prev,
      [section]: numericValue
    }));

    scheduleAutoSave();
  };

  /* =====================================================
     REMARKS CHANGE
  ===================================================== */

  const handleRemarksChange = (
    e
  ) => {
    setRemarks(e.target.value);

    scheduleAutoSave();
  };

  /* =====================================================
     BUILD FORM DATA
  ===================================================== */

  const buildFormData = () => {
    const formData =
      new FormData();

    formData.append(
      "criterion",
      "9.8"
    );

    formData.append(
      "section_98_marks_a",
      Number(marks.A || 0)
    );

    formData.append(
      "section_98_marks_b",
      Number(marks.B || 0)
    );

    formData.append(
      "total_marks",
      totalMarks
    );

    formData.append(
      "remarks",
      remarks || ""
    );

    files.forEach(
      (file, index) => {
        if (file instanceof File) {
          formData.append(
            `document_${index + 1}`,
            file
          );
        }
      }
    );

    return formData;
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async (
    showMessage = true
  ) => {
    try {
      setSaving(true);

      const formData =
        buildFormData();

      let response;

      if (recordId) {
        response =
          await axios.put(
            `http://localhost:5000/api/criteria98/${recordId}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );
      } else {
        response =
          await axios.post(
            "http://localhost:5000/api/criteria98",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );
      }

      if (
        response.data?.data?.id
      ) {
        setRecordId(
          response.data.data.id
        );
      }

      if (
        response.data?.data
      ) {
        const data =
          response.data.data;

        setSavedFiles([
          data.document_1 || null,
          data.document_2 || null,
          data.document_3 || null,
          data.document_4 || null,
          data.document_5 || null,
          data.document_6 || null,
          data.document_7 || null
        ]);

        setFiles(
          Array(7).fill(null)
        );
      }

      if (showMessage) {
        setMessage(
          "Criteria 9.8 saved successfully."
        );

        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
    } catch (error) {
      console.error(
        "Criteria 9.8 Save Error:",
        error
      );

      if (showMessage) {
        setMessage(
          "Unable to save Criteria 9.8."
        );
      }
    } finally {
      setSaving(false);
    }
  };
  

  /* =====================================================
     AUTO SAVE
  ===================================================== */

  const scheduleAutoSave =
    () => {
      if (
        autoSaveTimer.current
      ) {
        clearTimeout(
          autoSaveTimer.current
        );
      }

      autoSaveTimer.current =
        setTimeout(() => {
          handleSave(false);
        }, 1000);
    };

  /* =====================================================
     AUTO SAVE WHEN VALUES CHANGE
  ===================================================== */

  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {
    const confirmClear =
      window.confirm(
        "Are you sure you want to clear the entered marks, remarks and selected files?"
      );

    if (!confirmClear) return;

    setMarks({
      A: 0,
      B: 0
    });

    setRemarks("");

    setFiles(
      Array(7).fill(null)
    );

    fileRefs.current.forEach(
      (ref) => {
        if (ref) {
          ref.value = "";
        }
      }
    );
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

 const handlePrevious = () => {
  navigate("/criteria9/7");
};

const handleNext = () => {
  navigate("/criteria9/continuous-internal-assessment");
};
  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="criteria98-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="criteria98-header">

        <div className="criteria98-header-icon">
          <FaUniversity />
        </div>

        <div>
          <h1>
            9.8. Program Specific Budget Allocation, Utilization
          </h1>

          <p>
            Evaluate the budget allocation and utilization
            during the assessment period.
          </p>
        </div>

      </div>

      {/* =================================================
          CRITERION SUMMARY
      ================================================= */}

      <div className="criteria98-summary">

        <div className="criteria98-summary-icon">
          <FaClipboardList />
        </div>

        <div className="criteria98-summary-content">

          <div className="criteria98-section-row">

            <span className="criteria98-label">
              A.
            </span>

            <span>
              Quantum of budget allocation for three years
            </span>

            <strong>
              (03)
            </strong>

          </div>

          <div className="criteria98-section-row">

            <span className="criteria98-label">
              B.
            </span>

            <span>
              Budget utilization for three years
            </span>

            <strong>
              (05)
            </strong>

          </div>

        </div>

        <div className="criteria98-total-badge">
          Total Marks: <strong>08</strong>
        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="criteria98-main-grid">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="criteria98-left">

          <div className="criteria98-card">

            <div className="criteria98-card-title">
              <FaClipboardList />
              Evaluation Guidelines / Breakdown of Marks
            </div>

            <div className="criteria98-table-wrapper">

              <table className="criteria98-table">

                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th>Criteria</th>
                    <th>Description / Indicators</th>
                    <th>Marks</th>
                  </tr>
                </thead>

                <tbody>

                  {/* A */}

                  <tr>

                    <td className="criteria98-letter">
                      A.
                    </td>

                    <td className="criteria98-criteria-name">
                      Quantum of budget allocation
                      for three years
                    </td>

                    <td>

                      <ul>
                        <li>
                          Availability of budget allocation
                          for the assessment period
                        </li>

                        <li>
                          Adequacy of budget allocated
                          for program-specific activities
                        </li>

                        <li>
                          Allocation made consistently
                          during the three assessment years
                        </li>
                      </ul>

                    </td>

                    <td>

                      <div className="criteria98-mark-input">

                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={marks.A}
                          onChange={(e) =>
                            handleMarkChange(
                              "A",
                              e.target.value
                            )
                          }
                        />

                        <span>
                          / 03
                        </span>

                      </div>

                    </td>

                  </tr>

                  {/* B */}

                  <tr>

                    <td className="criteria98-letter">
                      B.
                    </td>

                    <td className="criteria98-criteria-name">
                      Budget utilization
                      for three years
                    </td>

                    <td>

                      <ul>
                        <li>
                          Effective utilization of
                          allocated budget
                        </li>

                        <li>
                          Utilization in accordance
                          with approved budget
                        </li>

                        <li>
                          Proper expenditure records
                          and supporting documents
                        </li>

                        <li>
                          Utilization maintained during
                          all three assessment years
                        </li>
                      </ul>

                    </td>

                    <td>

                      <div className="criteria98-mark-input">

                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={marks.B}
                          onChange={(e) =>
                            handleMarkChange(
                              "B",
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

                </tbody>

              </table>

            </div>

          </div>

          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria98-card criteria98-exhibits-card">

            <div className="criteria98-card-title">
              <FaFileAlt />
              Exhibits / Context to be Observed / Assessed
            </div>

            <div className="criteria98-exhibits">

              <p>
                <strong>A.</strong>{" "}
                Budget allocation documents for
                all three assessment years.
              </p>

              <p>
                <strong>B.</strong>{" "}
                Budget utilization statements,
                expenditure records and supporting
                financial documents.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="criteria98-right">

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <div className="criteria98-card criteria98-instructions">

            <div className="criteria98-card-title">
              <FaInfoCircle />
              Instructions
            </div>

            <ul>

              <li>
                Provide documentary evidence for
                all the points under 9.8.
              </li>

              <li>
                Consider the budget allocation and
                utilization for all three assessment years.
              </li>

              <li>
                Maximum marks are 08.
              </li>

              <li>
                Marks for A and B should be awarded
                based on documentary evidence.
              </li>

            </ul>

          </div>

          {/* =================================================
              EVALUATION
          ================================================= */}

          <div className="criteria98-card criteria98-evaluation-card">

            <div className="criteria98-card-title">
              <FaStar />
              Evaluation & Marks
            </div>

            <div className="criteria98-marks-label">
              Marks Awarded (Out of 08)
            </div>

            <div className="criteria98-total-marks">

              <span>
                {totalMarks}
              </span>

              <small>
                / 08
              </small>

            </div>

            <p className="criteria98-auto-text">
              Automatically calculated from A + B
            </p>

            <label>
              Remarks <span>(Optional)</span>
            </label>

            <textarea
              value={remarks}
              onChange={handleRemarksChange}
              placeholder="Enter remarks..."
            />

          </div>

        </div>

      </div>

      {/* =================================================
          SUPPORTING DOCUMENTS
      ================================================= */}

      <div className="criteria98-card criteria98-documents-card">

        <div className="criteria98-card-title">
          <FaCloudUploadAlt />
          Supporting Documents (Upload)
        </div>

        <div className="criteria98-documents-wrapper">

          <table className="criteria98-documents-table">

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

              {documents.map(
                (doc, index) => {

                  const selectedFile =
                    files[index];

                  const oldFile =
                    savedFiles[index];

                  const displayName =
                    selectedFile
                      ? selectedFile.name
                      : oldFile
                        ? oldFile
                        : "No file selected";

                  return (
                    <tr key={index}>

                      <td>
                        {index + 1}
                      </td>

                      <td className="criteria98-doc-name">
                        {doc.name}
                      </td>

                      <td>
                        {doc.description}
                      </td>

                      <td>

                        <div className="criteria98-upload">

                          <input
                            type="file"
                            ref={(el) => {
                              fileRefs.current[index] =
                                el;
                            }}
                            onChange={(e) =>
                              handleFileChange(
                                index,
                                e
                              )
                            }
                          />

                          <span
                            className={
                              selectedFile ||
                              oldFile
                                ? "criteria98-file-selected"
                                : ""
                            }
                          >
                            {displayName}
                          </span>

                        </div>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="criteria98-view-btn"
                          disabled={
                            !selectedFile &&
                            !oldFile
                          }
                          onClick={() =>
                            handleViewFile(
                              index
                            )
                          }
                        >
                          <FaEye />
                        </button>

                      </td>

                      

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          TOTAL
      ================================================= */}

      <div className="criteria98-bottom-total">

        Total Marks for Criterion 9.8

        <strong>
          {totalMarks} / 08
        </strong>

      </div>

      {/* =================================================
          STATUS
      ================================================= */}

      {message && (
        <div className="criteria98-message">
          {message}
        </div>
      )}

      {saving && (
        <div className="criteria98-saving">
          Saving...
        </div>
      )}

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="criteria98-actions">

        <button
          type="button"
          className="criteria98-btn previous"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>

        <button
          type="button"
          className="criteria98-btn clear"
          onClick={handleClear}
        >
          <FaTrash />
          Clear
        </button>

        <button
          type="button"
          className="criteria98-btn save"
          onClick={() =>
            handleSave(true)
          }
          disabled={saving}
        >
          <FaSave />
          {saving
            ? "Saving..."
            : "Save"}
        </button>

      <button
  type="button"
  className="criteria98-btn next"
  onClick={handleNext}
>
  Next
  <FaArrowRight />
</button>

      </div>

    </div>
  );
}

export default Criteria98MonitoringReview;