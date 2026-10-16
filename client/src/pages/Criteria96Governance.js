import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaLandmark,
  FaClipboardList,
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
  FaFileAlt,
} from "react-icons/fa";

import "./Criteria96Governance.css";

function Criteria96Governance() {
  const navigate = useNavigate();

  /* =========================================================
     FILE REFERENCES
  ========================================================= */

  const fileRefs = useRef([]);

  /* =========================================================
     9.6.1 GOVERNANCE
  ========================================================= */

  const [marks961, setMarks961] = useState({
    A: 0,
    B: 0,
    C: 0,
  });

  /* =========================================================
     9.6.2 TRANSPARENCY
  ========================================================= */

  const [marks962, setMarks962] = useState({
    A: 0,
    B: 0,
  });

  /* =========================================================
     REMARKS
  ========================================================= */

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

  /* =========================================================
     DATABASE
  ========================================================= */

  const [savedId, setSavedId] = useState(null);
/* =========================================================
   LOAD SAVED DATA FROM DATABASE
   PAGE LOAD / REFRESH / NEXT-BACK
========================================================= */

useEffect(() => {
  const loadSavedData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/criteria96/latest"
      );

      const record = response.data?.data;

      if (!record) {
        return;
      }

      /* ================= ID ================= */

      setSavedId(record.id);

      /* ================= 9.6.1 ================= */

      setMarks961({
        A: Number(record.section_961_marks_a || 0),
        B: Number(record.section_961_marks_b || 0),
        C: Number(record.section_961_marks_c || 0),
      });

      /* ================= 9.6.2 ================= */

      setMarks962({
        A: Number(record.section_962_marks_a || 0),
        B: Number(record.section_962_marks_b || 0),
      });

      /* ================= REMARKS ================= */

      setRemarks(record.remarks || "");

      /* ================= DOCUMENTS ================= */
if (response.data?.data?.id) {
  setSavedId(response.data.data.id);
}
      setFiles([
        record.document_1 || null,
        record.document_2 || null,
        record.document_3 || null,
        record.document_4 || null,
        record.document_5 || null,
        record.document_6 || null,
      ]);

    } catch (error) {
      console.error(
        "Criteria 9.6 Load Error:",
        error
      );
    }
  };

  loadSavedData();
}, []);
  /* =========================================================
     AUTO CALCULATION
  ========================================================= */

  const total961 =
    Number(marks961.A || 0) +
    Number(marks961.B || 0) +
    Number(marks961.C || 0);

  const total962 =
    Number(marks962.A || 0) +
    Number(marks962.B || 0);

  const grandTotal = total961 + total962;

  /* =========================================================
     MARK CHANGE - 9.6.1
  ========================================================= */

  const handleMarks961Change = (field, value, max) => {
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

    setMarks961((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  /* =========================================================
     MARK CHANGE - 9.6.2
  ========================================================= */

  const handleMarks962Change = (field, value, max) => {
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

    setMarks962((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  /* =========================================================
     FILE CHANGE
  ========================================================= */

const handleFileChange = async (index, event) => {

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  console.log("Selected File:", file);
  console.log("File Index:", index + 1);

  const updatedFiles = [...files];

  updatedFiles[index] = file;

  // UI state update
  setFiles(updatedFiles);

  try {

    const result = await handleSave(
      updatedFiles,
      true
    );

    console.log(
      "AUTO SAVE SUCCESS:",
      result
    );

    console.log(
      `Document ${index + 1} saved successfully`
    );

  } catch (error) {

    console.error(
      `Document ${index + 1} auto save failed`,
      error
    );

  }
};
  /* =========================================================
     VIEW FILE
  ========================================================= */

  const handleViewFile = (index) => {

  const file = files[index];

  if (!file) {

    alert("Please upload a document first.");

    return;
  }


  /* ================= NEW FILE ================= */

  if (file instanceof File) {

    const url = URL.createObjectURL(file);

    window.open(url, "_blank");

    return;
  }


  /* ================= DATABASE FILE ================= */

  const url =
    `http://localhost:5000/uploads/criteria96/${file}`;

  window.open(
    url,
    "_blank"
  );

};
 /* =========================================================
   SAVE / UPDATE
========================================================= */


const handleSave = async (
  filesToSave = files,
  isAutoSave = false
) => {

  try {

    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    const documentsToSave = Array.isArray(filesToSave)
      ? filesToSave
      : files;


    const formData = new FormData();


    /* =====================================================
       9.6.1
    ===================================================== */

    formData.append(
      "section_961_marks_a",
      Number(marks961.A || 0)
    );

    formData.append(
      "section_961_marks_b",
      Number(marks961.B || 0)
    );

    formData.append(
      "section_961_marks_c",
      Number(marks961.C || 0)
    );

    formData.append(
      "section_961_total",
      Number(total961 || 0)
    );


    /* =====================================================
       9.6.2
    ===================================================== */

    formData.append(
      "section_962_marks_a",
      Number(marks962.A || 0)
    );

    formData.append(
      "section_962_marks_b",
      Number(marks962.B || 0)
    );

    formData.append(
      "section_962_total",
      Number(total962 || 0)
    );


    /* =====================================================
       GRAND TOTAL
    ===================================================== */

    formData.append(
      "total_marks",
      Number(grandTotal || 0)
    );


    /* =====================================================
       REMARKS
    ===================================================== */

    formData.append(
      "remarks",
      remarks || ""
    );


    /* =====================================================
       DOCUMENTS
    ===================================================== */

    documentsToSave.forEach((file, index) => {

      if (file instanceof File) {

        formData.append(
          `document_${index + 1}`,
          file
        );

      }

    });


    /* =====================================================
       CREATE / UPDATE
    ===================================================== */

    const isUpdate = Boolean(savedId);

    let response;


    if (isUpdate) {

      response = await axios.put(
        `http://localhost:5000/api/criteria96/${savedId}`,
        formData
      );

    } else {

      response = await axios.post(
        "http://localhost:5000/api/criteria96",
        formData
      );

    }


    /* =====================================================
       SAVE ID
    ===================================================== */

    if (response.data?.data?.id) {

      setSavedId(
        response.data.data.id
      );

    }


    /* =====================================================
       SAVE DOCUMENT NAMES FROM DATABASE
    ===================================================== */

    if (response.data?.data) {

      const savedRecord =
        response.data.data;

      setFiles([
        savedRecord.document_1 || null,
        savedRecord.document_2 || null,
        savedRecord.document_3 || null,
        savedRecord.document_4 || null,
        savedRecord.document_5 || null,
        savedRecord.document_6 || null,
      ]);

    }


    /* =====================================================
       MANUAL SAVE MESSAGE ONLY
    ===================================================== */

    if (!isAutoSave) {

      alert(
        isUpdate
          ? "Criteria 9.6 updated successfully."
          : "Criteria 9.6 saved successfully."
      );

    }


    return response.data;


  } catch (error) {

    console.error(
      "Criteria 9.6 Save Error:",
      error
    );

    console.error(
      "Backend Response:",
      error.response?.data
    );

    if (!isAutoSave) {

      alert(
        error.response?.data?.error ||
        "Save failed. Please check backend."
      );

    }

    throw error;

  }

};
const handleClear = () => {

  setMarks961({
    A: 0,
    B: 0,
    C: 0,
  });

  setMarks962({
    A: 0,
    B: 0,
  });

  setRemarks("");

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
      `http://localhost:5000/api/criteria96/${savedId}`
    );

    alert("Record deleted successfully.");

    handleClear();

  } catch (error) {
    console.error("Delete Error:", error);

    alert(
      error.response?.data?.error ||
      "Delete failed."
    );
  }
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
    navigate("/criteria9/5");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/7");
  };

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents = [
    {
      name: "Governance Structure / Constitution Documents",
      description:
        "Documents of BoG / Committees and statutory bodies",
    },
    {
      name: "Meeting Records",
      description:
        "Agendas, minutes of meetings and ATR",
    },
    {
      name: "Service Rules & Policies",
      description:
        "Published service rules, policies and procedures",
    },
    {
      name: "Approval Documents",
      description:
        "Approval letters / notifications with year",
    },
    {
      name: "Website Disclosure Proof",
      description:
        "Screenshots / web links of disclosures on website",
    },
    {
      name: "Any Other Relevant Document",
      description:
        "Other supporting documents",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="governance96-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="governance96-header">

        <div className="governance96-header-left">

          <div className="governance96-number">
            9.6
          </div>

          <div className="governance96-header-text">
            <h1>
              Governance and Administration
            </h1>

            <p>
              Evaluate the effectiveness of governance and
              administrative systems.
            </p>
          </div>

        </div>

      </div>

      {/* =====================================================
          9.6.1 HEADER
      ===================================================== */}

      <div className="governance96-subheader">

        <div className="subheader-icon">
          <FaLandmark />
        </div>

        <div className="subheader-title">

          <strong>9.6.1</strong>

          <span>
            Governance (Policy, Administrative Setup,
            Functions of Various Bodies, Service Rules,
            Recruitment Procedure and Promotion Rules)
          </span>

        </div>

        <div className="subheader-marks">
          Marks: 10
        </div>

        <FaFileAlt className="subheader-file" />

      </div>

      {/* =====================================================
          TOP GRID
      ===================================================== */}

      <div className="governance96-top-grid">

        {/* ===================================================
            GUIDELINES
        =================================================== */}

        <div className="governance96-card guidelines96">

          <div className="governance96-card-title">

            <FaClipboardList />

            <h2>
              Evaluation Guidelines / Breakdown of Marks
            </h2>

          </div>

          <div className="table-wrapper96">

            <table className="evaluation96-table">

              <thead>
                <tr>

                  <th className="criteria-head96">
                    Criteria
                  </th>

                  <th className="description-head96">
                    Description / Indicators
                  </th>

                  <th className="marks-head96">
                    Marks
                  </th>

                </tr>
              </thead>

              <tbody>

                {/* ================= A ================= */}

                <tr>

                  <td className="criteria-code96">
                    A
                  </td>

                  <td className="description96">

                    <strong>
                      Composition of BoG/GB/Senate,
                      other administrative and academic bodies
                    </strong>

                    <ul>

                      <li>
                        Composition of BoG and statutory bodies
                      </li>

                      <li>
                        Functions and roles of various bodies
                      </li>

                      <li>
                        Representation / participation of
                        external members and stakeholders
                      </li>

                      <li>
                        Terms of reference and roles defined
                      </li>

                    </ul>

                  </td>

                  <td className="marks96">

                    <div className="marks-input-box96">

                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="1"
                        value={marks961.A}
                        onChange={(e) =>
                          handleMarks961Change(
                            "A",
                            e.target.value,
                            4
                          )
                        }
                      />

                      <span>/ 04</span>

                    </div>

                  </td>

                </tr>

                {/* ================= B ================= */}

                <tr>

                  <td className="criteria-code96">
                    B
                  </td>

                  <td className="description96">

                    <strong>
                      Agenda, minutes of the meetings
                      and action-taken report (ATR)
                    </strong>

                    <ul>

                      <li>
                        Agendas prepared and circulated
                      </li>

                      <li>
                        Minutes of meetings recorded and approved
                      </li>

                      <li>
                        Action Taken Report (ATR)
                      </li>

                    </ul>

                  </td>

                  <td className="marks96">

                    <div className="marks-input-box96">

                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="1"
                        value={marks961.B}
                        onChange={(e) =>
                          handleMarks961Change(
                            "B",
                            e.target.value,
                            4
                          )
                        }
                      />

                      <span>/ 04</span>

                    </div>

                  </td>

                </tr>

                {/* ================= C ================= */}

                <tr>

                  <td className="criteria-code96">
                    C
                  </td>

                  <td className="description96">

                    <strong>
                      The published service rules,
                      policies, and procedures with year
                      of approval by competent authority/Board
                      and publication
                    </strong>

                    <ul>

                      <li>
                        Availability of service rules,
                        policies and procedures
                      </li>

                      <li>
                        Approval by competent authority / Board
                      </li>

                      <li>
                        Year of approval and publication
                      </li>

                      <li>
                        Accessibility to stakeholders
                      </li>

                    </ul>

                  </td>

                  <td className="marks96">

                    <div className="marks-input-box96">

                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="1"
                        value={marks961.C}
                        onChange={(e) =>
                          handleMarks961Change(
                            "C",
                            e.target.value,
                            2
                          )
                        }
                      />

                      <span>/ 02</span>

                    </div>

                  </td>

                </tr>

                {/* ================= TOTAL ================= */}

                <tr className="total-row96">

                  <td colSpan="2">
                    Total Marks
                  </td>

                  <td>
                    {total961} / 10
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

        {/* ===================================================
            SIDE
        =================================================== */}

        <div className="governance96-side">

          {/* ================= INSTRUCTIONS ================= */}

          <div className="instructions96">

            <div className="side-title96">

              <FaInfoCircle />

              <h2>
                Instructions
              </h2>

            </div>

            <ul>

              <li>
                Provide documentary evidence for all
                the points under 9.6.1.
              </li>

              <li>
                Consider few relevant activities during
                the assessment period.
              </li>

              <li>
                Maximum marks are 10.
              </li>

            </ul>

          </div>

          {/* ================= EXHIBITS ================= */}

          <div className="exhibits96">

            <div className="side-title96">

              <FaFileAlt />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <p>
              <strong>A, B &amp; C:</strong>{" "}
              Appropriate documentary evidence.
            </p>

            <ul>

              <li>
                Constitution documents of BoG / committees
              </li>

              <li>
                Agendas, minutes of meetings and ATR
              </li>

              <li>
                Service rules, policies and procedures
              </li>

              <li>
                Approval letters / notifications with year
              </li>

              <li>
                Any other relevant supporting documents
              </li>

            </ul>

          </div>

        </div>

      </div>

      {/* =====================================================
          9.6.2 TRANSPARENCY
      ===================================================== */}

      <div className="governance96-transparency">

        <div className="transparency96-header">

          <div className="transparency96-icon">
            <FaLandmark />
          </div>

          <strong>
            9.6.2
          </strong>

          <span>
            Transparency
          </span>

          <div className="transparency96-marks">
            Marks: 05
          </div>

        </div>

        <div className="transparency96-content">

          {/* ================= TABLE ================= */}

          <div className="governance96-card">

            <div className="governance96-card-title">

              <FaClipboardList />

              <h2>
                Evaluation Guidelines / Breakdown of Marks
              </h2>

            </div>

            <div className="table-wrapper96">

              <table className="evaluation96-table">

                <thead>

                  <tr>

                    <th className="criteria-head96">
                      Criteria
                    </th>

                    <th className="description-head96">
                      Description / Indicators
                    </th>

                    <th className="marks-head96">
                      Marks
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* ================= A ================= */}

                  <tr>

                    <td className="criteria-code96">
                      A
                    </td>

                    <td className="description96">

                      <strong>
                        Mandatory disclosure as per
                        AICTE/AISHE/ONOD on the Institute website
                      </strong>

                    </td>

                    <td className="marks96">

                      <div className="marks-input-box96">

                        <input
                          type="number"
                          min="0"
                          max="3"
                          step="1"
                          value={marks962.A}
                          onChange={(e) =>
                            handleMarks962Change(
                              "A",
                              e.target.value,
                              3
                            )
                          }
                        />

                        <span>/ 03</span>

                      </div>

                    </td>

                  </tr>

                  {/* ================= B ================= */}

                  <tr>

                    <td className="criteria-code96">
                      B
                    </td>

                    <td className="description96">

                      <strong>
                        Availability of policies, rules,
                        and processes on the Institute website
                      </strong>

                    </td>

                    <td className="marks96">

                      <div className="marks-input-box96">

                        <input
                          type="number"
                          min="0"
                          max="2"
                          step="1"
                          value={marks962.B}
                          onChange={(e) =>
                            handleMarks962Change(
                              "B",
                              e.target.value,
                              2
                            )
                          }
                        />

                        <span>/ 02</span>

                      </div>

                    </td>

                  </tr>

                  {/* ================= TOTAL ================= */}

                  <tr className="total-row96">

                    <td colSpan="2">
                      Total Marks
                    </td>

                    <td>
                      {total962} / 05
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= TRANSPARENCY EXHIBITS ================= */}

          <div className="transparency-exhibits96">

            <div className="side-title96">

              <FaStar />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <ul>

              <li>
                Institute website
              </li>

              <li>
                Screenshots / web links of disclosed information
              </li>

              <li>
                Policy documents available on website
              </li>

            </ul>

          </div>

        </div>

      </div>

      {/* =====================================================
          SUPPORTING DOCUMENTS
      ===================================================== */}

      <div className="governance96-card documents96">

        <div className="governance96-card-title">

          <FaCloudUploadAlt />

          <h2>
            Supporting Documents (Upload)
          </h2>

        </div>

        <div className="document-table96">

          <div className="document-header96">

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

          {documents.map((doc, index) => (

            <div
              className="document-row96"
              key={index}
            >

              <div className="serial96">
                {index + 1}
              </div>

              <div className="document-name96">
                {doc.name}
              </div>

              <div className="document-description96">
                {doc.description}
              </div>

              <div className="upload96">

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

              <div className="view96">

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

      {/* =====================================================
          EVALUATION & MARKS
      ===================================================== */}

      <div className="evaluation-summary96">

        <div className="evaluation-summary-title96">

          <FaStar />

          <h2>
            Evaluation &amp; Marks
          </h2>

        </div>

        <div className="marks-summary96">

          <label>
            Marks Awarded (Out of 15)
          </label>

          <div className="marks-awarded96">
            {grandTotal} / 15
          </div>

        </div>

        <div className="remarks-summary96">

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

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="governance96-buttons">

        <button
          type="button"
          className="btn96 previous96"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>

        <button
          type="button"
          className="btn96 back96"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>

       <button
  type="button"
  className="btn96 save96"
  onClick={() => handleSave(files, false)}
>
  <FaSave />
  Save
</button>
        
        <button
          type="button"
          className="btn96 delete96"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>
        <button
  type="button"
  className="btn96 clear96"
  onClick={handleClear}
>
  <FaUndo />
  Clear
</button>

        <button
          type="button"
          className="btn96 print96"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>

        <button
          type="button"
          className="btn96 next96"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria96Governance;