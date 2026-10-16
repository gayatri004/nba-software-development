import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBullhorn,
  FaClipboardList,
  FaInfoCircle,
  FaCloudUploadAlt,
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

import "./Criteria914OutreachActivities.css";

function Criteria914OutreachActivities() {
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

  const [marksA, setMarksA] = useState(0);
  const [marksB, setMarksB] = useState(0);

  /* =========================================================
     REMARKS
  ========================================================= */

  const [remarksA, setRemarksA] = useState("");
  const [remarksB, setRemarksB] = useState("");

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documentsList = [
    {
      id: 1,
      type: "Outreach Activity Reports",
      description: "Reports / summaries of outreach activities",
      file: null,
      savedFileName: "",
    },
    {
      id: 2,
      type: "Photos / Videos",
      description: "Photographs / videos of activities",
      file: null,
      savedFileName: "",
    },
    {
      id: 3,
      type: "Participation Records",
      description: "Attendance / participation of students",
      file: null,
      savedFileName: "",
    },
    {
      id: 4,
      type: "Certificates / Appreciation",
      description:
        "Certificates / appreciation letters / recognition",
      file: null,
      savedFileName: "",
    },
    {
      id: 5,
      type: "Testimonials / Feedback",
      description:
        "Testimonials / feedback from beneficiaries",
      file: null,
      savedFileName: "",
    },
    {
      id: 6,
      type: "Any Other Relevant Document",
      description:
        "Any other supporting documents",
      file: null,
      savedFileName: "",
    },
  ];

  const [documents, setDocuments] = useState(documentsList);

  /* =========================================================
     LOAD SAVED DATA
  ========================================================= */

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/criteria914/latest"
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

          setSubmitted(
            data.submitted === true ||
            data.submitted === "true"
          );

          setDocuments((prev) =>
            prev.map((doc, index) => {
              const fileName =
                data[`document_${index + 1}`];

              return {
                ...doc,
                file: null,
                savedFileName: fileName || "",
              };
            })
          );
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(
            "Criteria 9.14 Load Error:",
            error
          );
        }
      }
    };

    loadSavedData();
  }, []);

  /* =========================================================
     CALCULATION
  ========================================================= */

  const totalMarks =
    Number(marksA || 0) +
    Number(marksB || 0);

  const percentage =
    ((totalMarks / 5) * 100).toFixed(2);

  let evaluationStatus = "Not Evaluated";

  if (totalMarks >= 4.5) {
    evaluationStatus = "Excellent";
  } else if (totalMarks >= 3.5) {
    evaluationStatus = "Very Good";
  } else if (totalMarks >= 2.5) {
    evaluationStatus = "Good";
  } else if (totalMarks > 0) {
    evaluationStatus = "Needs Improvement";
  }

  /* =========================================================
     MARK A
  ========================================================= */

  const handleMarksA = (e) => {
    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 2) value = 2;

    setMarksA(value);
  };

  /* =========================================================
     MARK B
  ========================================================= */

  const handleMarksB = (e) => {
    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > 3) value = 3;

    setMarksB(value);
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
      savedFileName: "",
    };

    setDocuments(updated);
  };

  /* =========================================================
     VIEW FILE
  ========================================================= */

  const handleViewFile = (file, savedFileName) => {
    /* New selected file */

    if (file) {
      const url = URL.createObjectURL(file);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      return;
    }

    /* Previously saved file */

    if (savedFileName) {
      const url =
        `http://localhost:5000/uploads/criteria914/${savedFileName}`;

      window.open(url, "_blank");

      return;
    }

    alert("No document uploaded.");
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "criterion",
        "9.14"
      );

      formData.append(
        "marksA",
        marksA
      );

      formData.append(
        "marksB",
        marksB
      );

      formData.append(
        "remarksA",
        remarksA
      );

      formData.append(
        "remarksB",
        remarksB
      );

      formData.append(
        "totalMarks",
        totalMarks
      );

      formData.append(
        "percentage",
        percentage
      );

      formData.append(
        "submitted",
        "false"
      );

      documents.forEach((doc) => {
        if (doc.file) {
          formData.append(
            `document_${doc.id}`,
            doc.file
          );
        }
      });

      let response;

      /* If record already exists -> UPDATE */

      if (recordId) {
        formData.append(
          "id",
          recordId
        );

        response = await axios.put(
          "http://localhost:5000/api/criteria914",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      /* New record -> SAVE */

      else {
        response = await axios.post(
          "http://localhost:5000/api/criteria914",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      if (response.data) {
        const newId =
          response.data.id ||
          response.data.data?.id;

        if (newId) {
          setRecordId(newId);
        }
      }

      alert(
        "9.14 Outreach Activities saved successfully."
      );
    } catch (error) {
      console.error(
        "Criteria 9.14 Save Error:",
        error
      );

      alert(
        error.response?.data?.error ||
        "Error while saving 9.14 data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (marksA < 0 || marksA > 2) {
      alert(
        "Section A marks must be between 0 and 2."
      );
      return;
    }

    if (marksB < 0 || marksB > 3) {
      alert(
        "Section B marks must be between 0 and 3."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "criterion",
        "9.14"
      );

      formData.append(
        "marksA",
        marksA
      );

      formData.append(
        "marksB",
        marksB
      );

      formData.append(
        "remarksA",
        remarksA
      );

      formData.append(
        "remarksB",
        remarksB
      );

      formData.append(
        "totalMarks",
        totalMarks
      );

      formData.append(
        "percentage",
        percentage
      );

      formData.append(
        "submitted",
        "true"
      );

      documents.forEach((doc) => {
        if (doc.file) {
          formData.append(
            `document_${doc.id}`,
            doc.file
          );
        }
      });

      let response;

      if (recordId) {
        formData.append(
          "id",
          recordId
        );

        response = await axios.put(
          "http://localhost:5000/api/criteria914",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/criteria914",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      if (response.data) {
        const newId =
          response.data.id ||
          response.data.data?.id;

        if (newId) {
          setRecordId(newId);
        }
      }

      setSubmitted(true);

      alert(
        "9.14 Outreach Activities submitted successfully."
      );
    } catch (error) {
      console.error(
        "Criteria 9.14 Submit Error:",
        error
      );

      alert(
        error.response?.data?.error ||
        "Error while submitting 9.14 data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!recordId) {
      handleClear();
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this record?"
      );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await axios.delete(
        `http://localhost:5000/api/criteria914/${recordId}`
      );

      alert(
        "9.14 record deleted successfully."
      );

      handleClear();
    } catch (error) {
      console.error(
        "Criteria 9.14 Delete Error:",
        error
      );

      alert(
        error.response?.data?.error ||
        "Error while deleting record."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const handleClear = () => {
    const confirmClear =
      window.confirm(
        "Are you sure you want to clear all entered data?"
      );

    if (!confirmClear) return;

    setRecordId(null);

    setMarksA(0);
    setMarksB(0);

    setRemarksA("");
    setRemarksB("");

    setSubmitted(false);

    setDocuments(
      documentsList.map((doc) => ({
        ...doc,
        file: null,
        savedFileName: "",
      }))
    );

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
    navigate(
      "/criteria912/innovative-educational-initiatives"
    );
  };

  const handleBack = () => {
    navigate("/criteria9");
  };

  const handleNext = () => {
    navigate("/criteria9/fpads");
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="criteria914-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="criteria914-header">

        <div className="criteria914-number">
          9.14
        </div>

        <div className="criteria914-header-content">

          <h1>
            9.14. Outreach Activities
          </h1>

          <p>
            Evaluate the outreach activities, social
            connect initiatives and the involvement of
            students in such activities.
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN A / B POINTS
      ===================================================== */}

      <div className="criteria914-main-points">

        <div className="criteria914-bullhorn">
          <FaBullhorn />
        </div>

        <div className="criteria914-point-list">

          <div className="criteria914-main-point">

            <strong>A.</strong>

            <span>
              Initiatives taken towards outreach
              activities, social internships
            </span>

            <b>
              (02)
            </b>

          </div>


          <div className="criteria914-main-point">

            <strong>B.</strong>

            <span>
              Society connect activities undertaken
              by the students with achievements
            </span>

            <b>
              (03)
            </b>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="criteria914-content-grid">


        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="criteria914-left-column">


          {/* =================================================
              EVALUATION GUIDELINES
          ================================================= */}

          <div className="criteria914-card">

            <div className="criteria914-card-title">

              <FaClipboardList />

              <h2>
                Evaluation Guidelines with Indicative
                Exhibits/Context to be Observed/Assessed
                for the SAR (UG Engineering Programs
                (Tier-II))
              </h2>

            </div>


            <div className="criteria914-table-wrapper">

              <table className="criteria914-table">

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

                  <tr>

                    <td className="criteria-code">
                      A.
                    </td>

                    <td>
                      A. Initiatives taken towards
                      outreach activities, social
                      internships
                    </td>

                    <td className="marks-cell">
                      02
                    </td>

                  </tr>


                  <tr>

                    <td className="criteria-code">
                      B.
                    </td>

                    <td>
                      B. Society connect activities
                      undertaken by the students
                      with achievements
                    </td>

                    <td className="marks-cell">
                      03
                    </td>

                  </tr>


                  <tr className="total-row">

                    <td colSpan="2">
                      Total Marks
                    </td>

                    <td>
                      05
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              EVALUATION A
          ================================================= */}

          <div className="criteria914-evaluation-card">

            <div className="criteria914-evaluation-header">

              <div className="criteria914-letter">
                A
              </div>

              <div className="criteria914-evaluation-title">

                <h2>
                  A. Initiatives taken towards
                  outreach activities, social
                  internships
                </h2>

              </div>

              <div className="criteria914-max-marks">

                <span>
                  Maximum Marks:
                </span>

                <strong>
                  02
                </strong>

              </div>

            </div>


            <div className="criteria914-evaluation-content">

              <div className="criteria914-evaluation-point">

                <p>
                  Initiatives taken towards outreach
                  activities, social internships
                </p>

              </div>


              <div className="criteria914-marks-box">

                <label>
                  Marks
                  <span>
                    (Out of 02)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  max="2"
                  step="1"
                  value={marksA}
                  onChange={handleMarksA}
                />

              </div>

            </div>


            <div className="criteria914-remarks">

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

          <div className="criteria914-evaluation-card">

            <div className="criteria914-evaluation-header">

              <div className="criteria914-letter">
                B
              </div>

              <div className="criteria914-evaluation-title">

                <h2>
                  B. Society connect activities
                  undertaken by the students with
                  achievements
                </h2>

              </div>

              <div className="criteria914-max-marks">

                <span>
                  Maximum Marks:
                </span>

                <strong>
                  03
                </strong>

              </div>

            </div>


            <div className="criteria914-evaluation-content">

              <div className="criteria914-evaluation-point">

                <p>
                  Society connect activities
                  undertaken by the students
                  with achievements
                </p>

              </div>


              <div className="criteria914-marks-box">

                <label>
                  Marks
                  <span>
                    (Out of 03)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  max="3"
                  step="1"
                  value={marksB}
                  onChange={handleMarksB}
                />

              </div>

            </div>


            <div className="criteria914-remarks">

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

          <div className="criteria914-calculation-card">

            <div className="criteria914-calculation-header">

              <FaStar />

              <h2>
                NBA Calculation / Evaluation
              </h2>

            </div>


            <div className="criteria914-calculation-grid">


              {/* SECTION A */}

              <div className="criteria914-calculation-item">

                <span>
                  Section A
                  <br />
                  (Out of 02)
                </span>

                <strong>
                  {Number(marksA).toFixed(2)}
                </strong>

              </div>


              {/* SECTION B */}

              <div className="criteria914-calculation-item">

                <span>
                  Section B
                  <br />
                  (Out of 03)
                </span>

                <strong>
                  {Number(marksB).toFixed(2)}
                </strong>

              </div>


              {/* TOTAL */}

              <div className="criteria914-calculation-item">

                <span>
                  Total Marks
                  <br />
                  (Out of 05)
                </span>

                <strong>
                  {totalMarks.toFixed(2)}
                </strong>

              </div>


              {/* PERCENTAGE */}

              <div className="criteria914-calculation-item">

                <span>
                  Percentage
                  <br />
                  (%)
                </span>

                <strong>
                  {percentage}%
                </strong>

              </div>


              {/* STATUS */}

              <div className="criteria914-calculation-item">

                <span>
                  Evaluation Status
                </span>

                <strong>
                  {evaluationStatus}
                </strong>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="criteria914-right-column">


          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria914-exhibits-box">

            <div className="criteria914-box-heading green">

              <FaInfoCircle />

              <h2>
                Exhibits/Context to be
                Observed/Assessed:
              </h2>

            </div>


            <div className="criteria914-exhibit-text">

              <strong>
                ❖
              </strong>

              <span>
                A & B: Appropriate documentary
                evidence
              </span>

            </div>

          </div>


          {/* =================================================
              SUPPORTING DOCUMENTS
          ================================================= */}

          <div className="criteria914-documents-box">

            <div className="criteria914-box-heading blue">

              <FaCloudUploadAlt />

              <h2>
                Supporting Documents
                (Upload)
              </h2>

            </div>


            <div className="criteria914-document-table-wrapper">

              <table className="criteria914-document-table">

                <thead>

                  <tr>

                    <th>
                      Sr. No.
                    </th>

                    <th>
                      Document Type
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

                        <td>
                          {doc.id}
                        </td>


                        <td>
                          {doc.type}

                          {doc.savedFileName &&
                            !doc.file && (
                              <div
                                className="criteria914-saved-file"
                              >
                                {doc.savedFileName}
                              </div>
                            )}

                        </td>


                        <td>

                          <div className="criteria914-upload">

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
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />

                          </div>


                          {doc.file && (

                            <div className="criteria914-selected-file">

                              {doc.file.name}

                            </div>

                          )}

                        </td>


                        <td>

                          <button
                            type="button"
                            className="criteria914-view-btn"
                            disabled={
                              !doc.file &&
                              !doc.savedFileName
                            }
                            onClick={() =>
                              handleViewFile(
                                doc.file,
                                doc.savedFileName
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

      </div>


      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="criteria914-actions">


        {/* PREVIOUS */}

        <button
          type="button"
          className="criteria914-action previous"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>


        {/* BACK */}

        <button
          type="button"
          className="criteria914-action back"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>


        {/* SAVE */}

        <button
          type="button"
          className="criteria914-action save"
          onClick={handleSave}
          disabled={loading}
        >
          <FaSave />

          {loading
            ? "Saving..."
            : "Save"}
        </button>


       
        {/* DELETE */}

        <button
          type="button"
          className="criteria914-action delete"
          onClick={handleDelete}
          disabled={loading}
        >
          <FaTrash />
          Delete
        </button>


        {/* PRINT */}

        <button
          type="button"
          className="criteria914-action print"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>


        {/* NEXT */}

        <button
          type="button"
          className="criteria914-action next"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria914OutreachActivities;