import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Criteria93FeedbackAnalysis.css";

import {
  FaChartBar,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaArrowLeft,
  FaUndo,
  FaSave,
  FaPaperPlane,
  FaTrash,
  FaPrint,
  FaArrowRight,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";



function Criteria93FeedbackAnalysis() {
  const navigate = useNavigate();

  /* =========================================================
     FILE REFS
  ========================================================= */

  const fileRefs1 = useRef([]);
  const fileRefs2 = useRef([]);

  /* =========================================================
     SECTION 9.3.1
  ========================================================= */

  const [marks931, setMarks931] = useState({
    A: 0,
    B: 0,
    C: 0,
  });

  const [remarks931, setRemarks931] = useState("");

  const [files931, setFiles931] = useState([
    null,
    null,
    null,
    null,
  ]);

  /* =========================================================
     SECTION 9.3.2
  ========================================================= */

  const [marks932, setMarks932] = useState({
    A: 0,
    B: 0,
    C: 0,
  });

  const [remarks932, setRemarks932] = useState("");

  const [files932, setFiles932] = useState([
    null,
    null,
    null,
    null,
  ]);

  /* =========================================================
     DATABASE ID
  ========================================================= */

  const [savedId, setSavedId] = useState(null);

  /* =========================================================
     MARK CALCULATION
  ========================================================= */

  const total931 =
    Number(marks931.A) +
    Number(marks931.B) +
    Number(marks931.C);

  const total932 =
    Number(marks932.A) +
    Number(marks932.B) +
    Number(marks932.C);

  const grandTotal = total931 + total932;

  /* =========================================================
     SECTION 9.3.1 MARK CHANGE
  ========================================================= */

  const handleMarks931Change = (field, value, max) => {
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

    setMarks931((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  /* =========================================================
     SECTION 9.3.2 MARK CHANGE
  ========================================================= */

  const handleMarks932Change = (field, value, max) => {
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

    setMarks932((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  /* =========================================================
     FILE CHANGE 9.3.1
  ========================================================= */

  const handleFile931Change = (index, event) => {
    const file = event.target.files[0];

    if (!file) return;

    const updated = [...files931];

    updated[index] = file;

    setFiles931(updated);
  };

  /* =========================================================
     FILE CHANGE 9.3.2
  ========================================================= */

  const handleFile932Change = (index, event) => {
    const file = event.target.files[0];

    if (!file) return;

    const updated = [...files932];

    updated[index] = file;

    setFiles932(updated);
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

    /* ================= 9.3.1 MARKS ================= */

    formData.append(
      "section_931_marks_a",
      Number(marks931.A)
    );

    formData.append(
      "section_931_marks_b",
      Number(marks931.B)
    );

    formData.append(
      "section_931_marks_c",
      Number(marks931.C)
    );

    formData.append(
      "section_931_total",
      total931
    );

    formData.append(
      "section_931_remarks",
      remarks931
    );


    /* ================= 9.3.2 MARKS ================= */

    formData.append(
      "section_932_marks_a",
      Number(marks932.A)
    );

    formData.append(
      "section_932_marks_b",
      Number(marks932.B)
    );

    formData.append(
      "section_932_marks_c",
      Number(marks932.C)
    );

    formData.append(
      "section_932_total",
      total932
    );

    formData.append(
      "section_932_remarks",
      remarks932
    );


    /* ================= GRAND TOTAL ================= */

    formData.append(
      "total_marks",
      grandTotal
    );


    /* ================= ID FOR UPDATE ================= */

    if (savedId) {
      formData.append("id", savedId);
    }


    /* ================= 9.3.1 DOCUMENTS ================= */

    files931.forEach((file, index) => {

      if (file) {

        formData.append(
          `document_931_${index + 1}`,
          file
        );

      }

    });


    /* ================= 9.3.2 DOCUMENTS ================= */

    files932.forEach((file, index) => {

      if (file) {

        formData.append(
          `document_932_${index + 1}`,
          file
        );

      }

    });


    const response = await axios.post(
      "http://localhost:5000/api/criteria93",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    /* IMPORTANT */

    if (response.data?.data?.id) {

      setSavedId(
        response.data.data.id
      );

    }


    alert(
      savedId
        ? "Criteria 9.3 updated successfully."
        : "Criteria 9.3 saved successfully."
    );

  } catch (error) {

    console.error(
      "Criteria 9.3 Save Error:",
      error
    );

    alert(
      error.response?.data?.error ||
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
      `http://localhost:5000/api/criteria93/${savedId}`
    );

    alert("Feedback Analysis record deleted successfully.");

    handleClear();

  } catch (error) {

    console.error("Delete Error:", error);

    alert("Delete failed. Please check backend API.");

  }
};
  /* =========================================================
     CLEAR
  ========================================================= */

  const handleClear = () => {
    setMarks931({
      A: 0,
      B: 0,
      C: 0,
    });

    setMarks932({
      A: 0,
      B: 0,
      C: 0,
    });

    setRemarks931("");
    setRemarks932("");

    setFiles931([
      null,
      null,
      null,
      null,
    ]);

    setFiles932([
      null,
      null,
      null,
      null,
    ]);

    setSavedId(null);

    fileRefs1.current.forEach((ref) => {
      if (ref) {
        ref.value = "";
      }
    });

    fileRefs2.current.forEach((ref) => {
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
    navigate("/criteria9/2");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/4");
  };

  /* =========================================================
     DOCUMENT DATA
  ========================================================= */

  const documents931 = [
    {
      name: "Feedback Questionnaire Used",
    },
    {
      name: "Methodology / Analysis Document",
    },
    {
      name: "Record of Corrective Measures Taken",
    },
    {
      name: "Impact Analysis Report",
    },
  ];

  const documents932 = [
    {
      name: "Feedback Questionnaire Used",
    },
    {
      name: "Frequency of Feedback Collection & Analysis Report",
    },
    {
      name: "Record of Corrective Measures Taken",
    },
    {
      name: "Any Other Relevant Document",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="feedback93-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="feedback93-header">

        <div className="feedback93-header-left">

          <div className="feedback93-number">
            9.3
          </div>

          <div>
            <h1>
              Feedback Analysis
            </h1>

            <p>
              Analyze feedback from various stakeholders and take corrective measures.
            </p>
          </div>

        </div>



      </div>


      {/* =====================================================
          SECTION 9.3.1
      ====================================================== */}

      <div className="feedback93-section">

        <div className="feedback93-section-header">

          <div className="section-icon">
            <FaChartBar />
          </div>

          <div className="section-title">

            <strong>
              9.3.1
            </strong>

            <span>
              Feedback on Teaching and Learning Process
              <br />
              and Corrective Measures Taken, if any
            </span>

          </div>

          <div className="section-marks">
            Marks: 10
          </div>

          <FaFileAlt className="section-document-icon" />

        </div>


        {/* ===================================================
            SECTION CONTENT
        ==================================================== */}

        <div className="feedback93-grid">

          {/* GUIDELINES */}

          <div className="feedback93-card guidelines93">

            <div className="feedback93-card-title">

              <FaChartBar />

              <h2>
                Evaluation Guidelines / Breakdown of Marks
              </h2>

            </div>

            <table className="evaluation93-table">

              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Description</th>
                  <th>Description</th>
                  <th>Marks</th>
                </tr>
              </thead>

              <tbody>

                <tr>

                  <td>A</td>

                  <td>
                    Feedback questionnaire used
                  </td>

                  <td>
                    Type of feedback questionnaire used
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={marks931.A}
                      onChange={(e) =>
                        handleMarks931Change(
                          "A",
                          e.target.value,
                          3
                        )
                      }
                    />
                    <span>/ 03</span>
                  </td>

                </tr>

                <tr>

                  <td>B</td>

                  <td>
                    Methodology based on feedback analysis
                    and its effectiveness
                  </td>

                  <td>
                    Methodology for analysis of feedback
                    and its effectiveness
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={marks931.B}
                      onChange={(e) =>
                        handleMarks931Change(
                          "B",
                          e.target.value,
                          3
                        )
                      }
                    />
                    <span>/ 03</span>
                  </td>

                </tr>

                <tr>

                  <td>C</td>

                  <td>
                    Record of corrective measures
                    taken and impact
                  </td>

                  <td>
                    Corrective measures taken and
                    impact of the actions
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={marks931.C}
                      onChange={(e) =>
                        handleMarks931Change(
                          "C",
                          e.target.value,
                          4
                        )
                      }
                    />
                    <span>/ 04</span>
                  </td>

                </tr>

                <tr className="total-row">

                  <td colSpan="3">
                    Total Marks
                  </td>

                  <td>
                    {total931} / 10
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          {/* DOCUMENTS */}

          <div className="feedback93-card documents93">

            <div className="feedback93-card-title">

              <FaCloudUploadAlt />

              <h2>
                Supporting Documents (Upload)
              </h2>

            </div>

            <div className="document-table93">

              <div className="document-header93">

                <div>Sr. No.</div>

                <div>Document Type</div>

                <div>Upload File</div>

                <div>View</div>

              </div>

              {documents931.map((doc, index) => (

                <div
                  className="document-row93"
                  key={index}
                >

                  <div>
                    {index + 1}
                  </div>

                  <div>
                    {doc.name}
                  </div>

                  <div>

                    <input
                      type="file"
                      ref={(el) =>
                        (fileRefs1.current[index] = el)
                      }
                      onChange={(e) =>
                        handleFile931Change(index, e)
                      }
                    />

                  </div>

                  <div>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewFile(files931[index])
                      }
                    >
                      <FaEye />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* EVALUATION */}

          <div className="feedback93-card evaluation93">

            <div className="feedback93-card-title">

              <FaStar />

              <h2>
                Evaluation &amp; Marks
              </h2>

            </div>

            <div className="awarded93">

              <label>
                Marks Awarded (Out of 10)
              </label>

              <div className="awarded-value93">
                {total931} / 10
              </div>

            </div>

            <div className="remarks93">

              <label>
                Remarks (Optional)
              </label>

              <textarea
                placeholder="Enter remarks..."
                value={remarks931}
                onChange={(e) =>
                  setRemarks931(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        {/* EXHIBITS */}

        <div className="exhibits93">

          <div className="exhibits-title93">

            <FaInfoCircle />

            <strong>
              Exhibits / Context to be Observed / Assessed:
            </strong>

          </div>

          <p>
            ◆ A, B &amp; C: Feedback questionnaires, collection
            process, analysis, actions taken, effectiveness
          </p>

        </div>

      </div>


      {/* =====================================================
          SECTION 9.3.2
      ====================================================== */}

      <div className="feedback93-section">

        <div className="feedback93-section-header">

          <div className="section-icon">
            <FaChartBar />
          </div>

          <div className="section-title">

            <strong>
              9.3.2
            </strong>

            <span>
              Feedback on Academic Facilities
              <br />
              and Corrective Measures Taken
            </span>

          </div>

          <div className="section-marks">
            Marks: 10
          </div>

          <FaFileAlt className="section-document-icon" />

        </div>


        <div className="feedback93-grid">

          {/* GUIDELINES */}

          <div className="feedback93-card guidelines93">

            <div className="feedback93-card-title">

              <FaChartBar />

              <h2>
                Evaluation Guidelines / Breakdown of Marks
              </h2>

            </div>

            <table className="evaluation93-table">

              <thead>

                <tr>
                  <th>Criteria</th>
                  <th>Description</th>
                  <th>Description</th>
                  <th>Marks</th>
                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>A</td>

                  <td>
                    Feedback questionnaire used
                  </td>

                  <td>
                    Type of feedback questionnaire used
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={marks932.A}
                      onChange={(e) =>
                        handleMarks932Change(
                          "A",
                          e.target.value,
                          3
                        )
                      }
                    />

                    <span>/ 03</span>

                  </td>

                </tr>

                <tr>

                  <td>B</td>

                  <td>
                    Frequency of feedback collection
                    and analysis
                  </td>

                  <td>
                    How frequently feedback is collected
                    and analyzed
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={marks932.B}
                      onChange={(e) =>
                        handleMarks932Change(
                          "B",
                          e.target.value,
                          3
                        )
                      }
                    />

                    <span>/ 03</span>

                  </td>

                </tr>

                <tr>

                  <td>C</td>

                  <td>
                    Record of corrective measures taken
                  </td>

                  <td>
                    Corrective measures taken based
                    on feedback
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={marks932.C}
                      onChange={(e) =>
                        handleMarks932Change(
                          "C",
                          e.target.value,
                          4
                        )
                      }
                    />

                    <span>/ 04</span>

                  </td>

                </tr>

                <tr className="total-row">

                  <td colSpan="3">
                    Total Marks
                  </td>

                  <td>
                    {total932} / 10
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          {/* DOCUMENTS */}

          <div className="feedback93-card documents93">

            <div className="feedback93-card-title">

              <FaCloudUploadAlt />

              <h2>
                Supporting Documents (Upload)
              </h2>

            </div>

            <div className="document-table93">

              <div className="document-header93">

                <div>Sr. No.</div>

                <div>Document Type</div>

                <div>Upload File</div>

                <div>View</div>

              </div>

              {documents932.map((doc, index) => (

                <div
                  className="document-row93"
                  key={index}
                >

                  <div>
                    {index + 1}
                  </div>

                  <div>
                    {doc.name}
                  </div>

                  <div>

                    <input
                      type="file"
                      ref={(el) =>
                        (fileRefs2.current[index] = el)
                      }
                      onChange={(e) =>
                        handleFile932Change(index, e)
                      }
                    />

                  </div>

                  <div>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewFile(files932[index])
                      }
                    >
                      <FaEye />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* EVALUATION */}

          <div className="feedback93-card evaluation93">

            <div className="feedback93-card-title">

              <FaStar />

              <h2>
                Evaluation &amp; Marks
              </h2>

            </div>

            <div className="awarded93">

              <label>
                Marks Awarded (Out of 10)
              </label>

              <div className="awarded-value93">
                {total932} / 10
              </div>

            </div>

            <div className="remarks93">

              <label>
                Remarks (Optional)
              </label>

              <textarea
                placeholder="Enter remarks..."
                value={remarks932}
                onChange={(e) =>
                  setRemarks932(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        {/* EXHIBITS */}

        <div className="exhibits93">

          <div className="exhibits-title93">

            <FaInfoCircle />

            <strong>
              Exhibits / Context to be Observed / Assessed:
            </strong>

          </div>

          <p>
            ◆ A, B &amp; C: Feedback on academic facilities,
            questionnaires, collection process, analysis,
            actions taken, effectiveness
          </p>

        </div>

      </div>


      {/* =====================================================
          TOTAL
      ====================================================== */}

      <div className="feedback93-total">

        <span>
          Total Marks for Criterion 9.3
        </span>

        <strong>
          {grandTotal} / 20
        </strong>

      </div>


      {/* =====================================================
          BUTTONS
      ====================================================== */}

      <div className="feedback93-buttons">

        <button
          className="btn93 previous93"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>

        <button
          className="btn93 back93"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>

        <button
          className="btn93 save93"
          onClick={handleSave}
        >
          <FaSave />
          Save
        </button>

       
        <button
          className="btn93 delete93"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>

        <button
          className="btn93 print93"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>

        <button
          className="btn93 next93"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria93FeedbackAnalysis;