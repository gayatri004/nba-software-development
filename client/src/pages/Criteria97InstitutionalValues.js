import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
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

import "./Criteria97InstitutionalValues.css";

function Criteria97InstitutionalValues() {
  const navigate = useNavigate();
  const fileRefs = useRef([]);
const autoSaveTimer = useRef(null);
const savedIdRef = useRef(null);
const [saving, setSaving] = useState(false);
  /* =========================================================
     9.7 MARKS
     A = 04
     B = 06
     C = 02
     TOTAL = 12
  ========================================================= */

  const [marks, setMarks] = useState({
    A: 0,
    B: 0,
    C: 0,
  });

  const [remarks, setRemarks] = useState("");
  const [savedId, setSavedId] = useState(null);

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
   LOAD SAVED DATA
========================================================= */

useEffect(() => {

  const loadSavedData = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/criteria97/latest"
      );

      const data = response.data?.data;

      if (!data) {
        return;
      }

      setSavedId(data.id);
savedIdRef.current = data.id;
      setMarks({
        A: Number(data.section_97_marks_a) || 0,
        B: Number(data.section_97_marks_b) || 0,
        C: Number(data.section_97_marks_c) || 0
      });

      setRemarks(data.remarks || "");

      setFiles([
        data.document_1 || null,
        data.document_2 || null,
        data.document_3 || null,
        data.document_4 || null,
        data.document_5 || null,
        data.document_6 || null
      ]);

    } catch (error) {

      console.error(
        "Criteria 9.7 Load Error:",
        error
      );

    }

  };

  loadSavedData();

}, []);

  /* =========================================================
     CALCULATION
  ========================================================= */

  const totalMarks =
    Number(marks.A) +
    Number(marks.B) +
    Number(marks.C);


  const autoSaveData = useCallback(
  async (
    updatedMarks,
    updatedRemarks,
    updatedFiles
  ) => {

    try {

      setSaving(true);

      const formData = new FormData();

      /* =========================
         MARKS
      ========================= */

      formData.append(
        "section_97_marks_a",
        Number(updatedMarks.A) || 0
      );

      formData.append(
        "section_97_marks_b",
        Number(updatedMarks.B) || 0
      );

      formData.append(
        "section_97_marks_c",
        Number(updatedMarks.C) || 0
      );

      const updatedTotal =
        Number(updatedMarks.A || 0) +
        Number(updatedMarks.B || 0) +
        Number(updatedMarks.C || 0);

      formData.append(
        "total_marks",
        updatedTotal
      );

      formData.append(
        "remarks",
        updatedRemarks || ""
      );


      /* =========================
         DOCUMENTS
      ========================= */

      updatedFiles.forEach((file, index) => {

        if (file instanceof File) {

          console.log(
            `Uploading document_${index + 1}:`,
            file.name
          );

          formData.append(
            `document_${index + 1}`,
            file
          );
        }

      });


      /* =========================
         SAVE / UPDATE
      ========================= */

      let response;

      const currentId = savedIdRef.current;

      if (!currentId) {

        console.log(
          "Creating new Criteria 9.7 record..."
        );

        response = await axios.post(
          "http://localhost:5000/api/criteria97",
          formData
        );

        const newId =
          response.data?.data?.id ||
          response.data?.id;

        if (newId) {

          setSavedId(newId);

          savedIdRef.current = newId;

          console.log(
            "New Criteria 9.7 ID:",
            newId
          );
        }

      } else {

        console.log(
          "Updating Criteria 9.7 ID:",
          currentId
        );

        response = await axios.put(
          `http://localhost:5000/api/criteria97/${currentId}`,
          formData
        );

      }

      console.log(
        "Criteria 9.7 Auto Save Success",
        response?.data
      );

      return response?.data;

    } catch (error) {

      console.error(
        "Criteria 9.7 Auto Save Error:",
        error.response?.data || error.message
      );

      throw error;

    } finally {

      setSaving(false);

    }

  },
  []
);

 /* =========================================================
   MARK CHANGE + AUTO SAVE
========================================================= */

const handleMarksChange = (
  field,
  value,
  max
) => {

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


  const updatedMarks = {
    ...marks,
    [field]: newValue
  };


  setMarks(updatedMarks);


  /* =====================================================
     AUTO SAVE
  ===================================================== */

  clearTimeout(autoSaveTimer.current);

  autoSaveTimer.current = setTimeout(() => {

    autoSaveData(
      updatedMarks,
      remarks,
      files
    );

  }, 500);

};
/* =========================================================
   MANUAL SAVE
========================================================= */

const handleSave = async () => {

  try {

    await autoSaveData(
      marks,
      remarks,
      files
    );

    alert(
      "Criteria 9.7 data saved successfully."
    );

  } catch (error) {

    console.error(
      "Criteria 9.7 Save Error:",
      error
    );

    alert(
      "Save failed."
    );

  }

};
  /* =========================================================
     FILE CHANGE
  ========================================================= */

  /* =========================================================
   FILE CHANGE + AUTO SAVE
========================================================= */

const handleFileChange = async (index, event) => {

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  console.log(
    `Selected document_${index + 1}:`,
    file.name
  );

  const updatedFiles = [...files];

  updatedFiles[index] = file;

  setFiles(updatedFiles);

  try {

    await autoSaveData(
      marks,
      remarks,
      updatedFiles
    );

    console.log(
      `document_${index + 1} auto saved successfully`
    );

  } catch (error) {

    console.error(
      `document_${index + 1} upload failed:`,
      error
    );

    alert(
      `Document upload failed: ${file.name}`
    );

  }

};
  /* =========================================================
     VIEW FILE
  ========================================================= */

  const handleViewFile = (index) => {

  const file = files[index];

  if (!file) {
    alert("No document available.");
    return;
  }


  /* =====================================================
     NEWLY SELECTED FILE
  ===================================================== */

  if (file instanceof File) {

    const url =
      URL.createObjectURL(file);

    window.open(url, "_blank");

    return;
  }


  /* =====================================================
     SAVED SERVER FILE
  ===================================================== */

  const url =
    `http://localhost:5000/uploads/criteria97/${file}`;

  window.open(url, "_blank");

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

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/criteria97/${savedId}`
      );

      alert("Record deleted successfully.");

      handleClear();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Delete failed.");
    }
  };

  /* =========================================================
     CLEAR
  ========================================================= */

 /* =========================================================
   CLEAR FORM ONLY
   DATABASE DATA WILL NOT BE DELETED
========================================================= */

const handleClear = () => {

  setMarks({
    A: 0,
    B: 0,
    C: 0
  });

  setRemarks("");

  setFiles([
    null,
    null,
    null,
    null,
    null,
    null
  ]);


  /* =====================================================
     CLEAR FILE INPUTS
  ===================================================== */

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
    navigate("/criteria9/6");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/monitoring-review");
  };

  /* =========================================================
     DOCUMENTS
  ========================================================= */

  const documents = [
    {
      name: "Budget Allocation Statement",
      description:
        "Year-wise budget allocation for the last three financial years",
    },
    {
      name: "Budget Utilization Statement",
      description:
        "Year-wise budget utilization for the last three financial years",
    },
    {
      name: "Audited Financial Statements",
      description:
        "Audited statements for the last three financial years",
    },
    {
      name: "Institute Website Evidence",
      description:
        "Screenshot / evidence showing availability of audited statements on institute website",
    },
    {
      name: "Approval by Competent Authority",
      description:
        "Approval documents related to budget allocation",
    },
    {
      name: "Any Other Relevant Document",
      description:
        "Any other supporting document related to Criterion 9.7",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="institutional97-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="institutional97-header">

        <div className="institutional97-header-left">

          <div className="institutional97-number">
            9.7
          </div>

          <div>

            <h1>
              Budget Utilization, Allocation and Public
              Accounting at Institute Level
            </h1>

            <p>
              Evaluate the budget allocation, utilization and
              availability of audited statements at institute level.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CRITERIA SUMMARY
      ===================================================== */}

      <div className="institutional97-summary">

        <div className="summary97-icon">
          <FaClipboardList />
        </div>

        <div className="summary97-list">

          <div>
            <strong>A.</strong>

            <span>
              Quantum of budget allocation for three years
            </span>

            <b>(04)</b>
          </div>

          <div>
            <strong>B.</strong>

            <span>
              Budget utilization for three years
            </span>

            <b>(06)</b>
          </div>

          <div>
            <strong>C.</strong>

            <span>
              Availability of audited statements on the
              Institute website
            </span>

            <b>(02)</b>
          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="institutional97-main-grid">

        {/* ================= GUIDELINES ================= */}

        <div className="institutional97-card guidelines97">

          <div className="institutional97-card-title">

            <FaClipboardList />

            <h2>
              Evaluation Guidelines / Breakdown of Marks
            </h2>

          </div>


          <table className="evaluation97-table">

            <thead>

              <tr>

                <th>
                  Criteria
                </th>

                <th>
                  Evaluation Criteria
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

                <td className="criteria-code97">
                  A.
                </td>

                <td>

                  <strong>
                    Quantum of budget
                    <br />
                    allocation for
                    <br />
                    three years
                  </strong>

                </td>

                <td>

                  <ul>

                    <li>
                      Clear statement of budget allocation
                      for the last three financial years.
                    </li>

                    <li>
                      Year-wise budget allocation for
                      recurring and non-recurring heads.
                    </li>

                    <li>
                      Approval by the competent authority.
                    </li>

                  </ul>

                </td>

                <td className="marks97">

                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={marks.A}
                    onChange={(e) =>
                      handleMarksChange(
                        "A",
                        e.target.value,
                        4
                      )
                    }
                  />

                  <span>
                    / 04
                  </span>

                </td>

              </tr>


              {/* ================= B ================= */}

              <tr>

                <td className="criteria-code97">
                  B.
                </td>

                <td>

                  <strong>
                    Budget utilization
                    <br />
                    for three years
                  </strong>

                </td>

                <td>

                  <ul>

                    <li>
                      Year-wise utilization statement
                      for the last three financial years.
                    </li>

                    <li>
                      Comparison of allocation
                      versus utilization.
                    </li>

                    <li>
                      Proper utilization as per
                      approved budget heads.
                    </li>

                  </ul>

                </td>

                <td className="marks97">

                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={marks.B}
                    onChange={(e) =>
                      handleMarksChange(
                        "B",
                        e.target.value,
                        6
                      )
                    }
                  />

                  <span>
                    / 06
                  </span>

                </td>

              </tr>


              {/* ================= C ================= */}

              <tr>

                <td className="criteria-code97">
                  C.
                </td>

                <td>

                  <strong>
                    Availability of
                    <br />
                    audited statements
                    <br />
                    on Institute website
                  </strong>

                </td>

                <td>

                  <ul>

                    <li>
                      Audited financial statements
                      for the last three financial years.
                    </li>

                    <li>
                      Easily accessible on the
                      Institute website.
                    </li>

                    <li>
                      Evidence of public disclosure.
                    </li>

                  </ul>

                </td>

                <td className="marks97">

                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={marks.C}
                    onChange={(e) =>
                      handleMarksChange(
                        "C",
                        e.target.value,
                        2
                      )
                    }
                  />

                  <span>
                    / 02
                  </span>

                </td>

              </tr>


              {/* ================= TOTAL ================= */}

              <tr className="total-row97">

                <td colSpan="3">
                  Total Marks
                </td>

                <td>
                  {totalMarks} / 12
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="institutional97-side">

          {/* INSTRUCTIONS */}

          <div className="instructions97">

            <div className="side-title97">

              <FaInfoCircle />

              <h2>
                Instructions
              </h2>

            </div>

            <ul>

              <li>
                Provide documentary evidence for all
                the points under 9.7.
              </li>

              <li>
                Consider three financial years during
                the assessment period.
              </li>

              <li>
                Ensure that budget allocation and
                utilization statements are authentic.
              </li>

              <li>
                Maximum marks are 12.
              </li>

            </ul>

          </div>


          {/* EXHIBITS */}

          <div className="exhibits97">

            <div className="side-title97">

              <FaFileAlt />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <p>

              <strong>
                A, B &amp; C:
              </strong>{" "}
              Appropriate documentary evidence such as:

            </p>

            <ul>

              <li>
                Budget allocation statements
              </li>

              <li>
                Utilization certificates / statements
              </li>

              <li>
                Audited financial statements
              </li>

              <li>
                Evidence of publication on institute website
              </li>

              <li>
                Approval documents from competent authority
              </li>

              <li>
                Any other relevant documents
              </li>

            </ul>

          </div>

        </div>

      </div>


      {/* =====================================================
          SUPPORTING DOCUMENTS
      ===================================================== */}

      <div className="institutional97-card documents97">

        <div className="institutional97-card-title">

          <FaCloudUploadAlt />

          <h2>
            Supporting Documents (Upload)
          </h2>

        </div>


        <div className="document-table97">

          <div className="document-header97">

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
              className="document-row97"
              key={index}
            >

              <div className="serial97">
                {index + 1}
              </div>

              <div className="document-name97">
                {doc.name}
              </div>

              <div className="document-description97">
                {doc.description}
              </div>

             <div className="upload97">

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
              <div className="view97">

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

      <div className="evaluation-summary97">

        <div className="evaluation-summary-title97">

          <FaStar />

          <h2>
            Evaluation &amp; Marks
          </h2>

        </div>


        <div className="marks-summary97">

          <label>
            Marks Awarded (Out of 12)
          </label>

          <div className="marks-awarded97">
            {totalMarks} / 12
          </div>

        </div>


        <div className="remarks-summary97">

          <label>
            Remarks (Optional)
          </label>

          <textarea
  placeholder="Enter remarks..."
  value={remarks}
  onChange={(e) => {

    const value = e.target.value;

    setRemarks(value);

    clearTimeout(
      autoSaveTimer.current
    );

    autoSaveTimer.current =
      setTimeout(() => {

        autoSaveData(
          marks,
          value,
          files
        );

      }, 800);

  }}
/>
        </div>

      </div>


      {/* =====================================================
          FINAL TOTAL
      ===================================================== */}

      <div className="final-total97">

        <span>
          Total Marks for Criterion 9.7
        </span>

        <strong>
          {totalMarks} / 12
        </strong>

      </div>


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="institutional97-buttons">

        <button
          className="btn97 previous97"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>


        <button
          className="btn97 back97"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>


        <button
          className="btn97 save97"
          onClick={handleSave}
        >
          <FaSave />
          Save
        </button>


        


        <button
          className="btn97 delete97"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>


        <button
          className="btn97 print97"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>


        <button
          className="btn97 next97"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default Criteria97InstitutionalValues;