import React, {useEffect,useRef,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaClipboardList,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaEye,
  FaArrowLeft,
  FaUndo,
  FaSave,
  FaPaperPlane,
  FaTrash,
  FaPrint,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

import "./Criteria95IndustryInteraction.css";

function Criteria95IndustryInteraction() {
  const navigate = useNavigate();

  const fileRefs = useRef([]);

  /* ================= MARKS ================= */

  const [marks, setMarks] = useState({
    A: 0,
    B: 0,
    C: 0,
  });

  const [remarks, setRemarks] = useState("");

  const [files, setFiles] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [savedId, setSavedId] = useState(null);
  useEffect(() => {

    const fetchLatestData = async () => {

      try {

        const response = await axios.get(
          "http://localhost:5000/api/criteria95/latest"
        );

        const data = response.data.data;

        if (!data) return;

        setSavedId(data.id);

        setMarks({
          A: Number(data.marks_a) || 0,
          B: Number(data.marks_b) || 0,
          C: Number(data.marks_c) || 0,
        });

        setRemarks(
          data.remarks || ""
        );

      } catch (error) {

        console.error(
          "Criteria 9.5 Fetch Error:",
          error
        );

      }

    };

    fetchLatestData();

  }, []);
  /* ================= TOTAL ================= */

  const totalMarks =
    Number(marks.A) +
    Number(marks.B) +
    Number(marks.C);

  /* ================= MARK CHANGE ================= */

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

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];

    if (!file) return;

    const updatedFiles = [...files];

    updatedFiles[index] = file;

    setFiles(updatedFiles);
  };

  /* ================= VIEW FILE ================= */

  const handleViewFile = (index) => {
    const file = files[index];

    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    const url = URL.createObjectURL(file);

    window.open(url, "_blank");
  };

  /* ================= SAVE ================= */

 const handleSave = async () => {
  try {

    const formData = new FormData();

    formData.append(
      "marks_a",
      Number(marks.A)
    );

    formData.append(
      "marks_b",
      Number(marks.B)
    );

    formData.append(
      "marks_c",
      Number(marks.C)
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
      "9.5"
    );


    /* =========================
       DOCUMENTS
    ========================= */

    files.forEach((file, index) => {

      if (file) {

        formData.append(
          `document_${index + 1}`,
          file
        );

      }

    });


    const response = await axios.post(
      "http://localhost:5000/api/criteria95",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    if (response.data) {

      setSavedId(
        response.data.id || null
      );

    }


    alert(
      "Industry Interaction data saved successfully."
    );

  } catch (error) {

    console.error(
      "Criteria 9.5 Save Error:",
      error
    );

    alert(
      "Save failed. Please check backend API."
    );

  }
};
  
  /* ================= DELETE ================= */

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
        `http://localhost:5000/api/criteria95/${savedId}`
      );

      alert("Record deleted successfully.");

      handleClear();
    } catch (error) {
      console.error(error);

      alert("Delete failed.");
    }
  };

  /* ================= CLEAR ================= */

  const handleClear = () => {
    setMarks({
      A: 0,
      B: 0,
      C: 0,
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

    setSavedId(null);

    fileRefs.current.forEach((ref) => {
      if (ref) {
        ref.value = "";
      }
    });
  };

  /* ================= PRINT ================= */

  const handlePrint = () => {
    window.print();
  };

  /* ================= NAVIGATION ================= */

  const handlePrevious = () => {
    navigate("/criteria9/4");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate("/criteria9/6");
  };

  /* ================= DOCUMENTS ================= */

  const documents = [
    {
      name: "Industry Interaction Cell / Committee Details",
      description:
        "Details of committee / cell, roles and responsibilities",
    },
    {
      name: "MoUs / Collaborations",
      description:
        "Signed MoUs / partnership documents",
    },
    {
      name: "Activity Reports",
      description:
        "Reports of industry interaction activities",
    },
    {
      name: "Attendance / Participation Records",
      description:
        "Attendance sheets / participation proofs",
    },
    {
      name: "Impact / Outcome Documents",
      description:
        "Impact analysis, feedback, placement outcomes etc.",
    },
    {
      name: "Any Other Relevant Document",
      description:
        "Other supporting documents",
    },
  ];

  return (
    <div className="criteria95-page">

      {/* ================= HEADER ================= */}

      <div className="criteria95-header">

        <div className="criteria95-header-left">

          <div className="criteria95-number">
            9.5
          </div>

          <div>
            <h1>
              Industry Interaction and Collaboration
            </h1>

            <p>
              Evaluate the initiatives and effectiveness of industry
              interaction and collaborations.
            </p>
          </div>

        </div>


      </div>


      {/* ================= SUB CRITERIA ================= */}

      <div className="criteria95-subcriteria">

        <div className="subcriteria-icon">
          <FaClipboardList />
        </div>

        <div className="subcriteria-item">
          <b>A.</b>
          <span>
            Facilities for industry interaction and collaboration (04)
          </span>
        </div>

        <div className="subcriteria-item">
          <b>B.</b>
          <span>
            Initiatives for interaction and collaboration (03)
          </span>
        </div>

        <div className="subcriteria-item">
          <b>C.</b>
          <span>
            Impact of interaction and collaboration (03)
          </span>
        </div>

      </div>


      {/* ================= TOP CONTENT ================= */}

      <div className="criteria95-top-grid">

        {/* GUIDELINES */}

        <div className="criteria95-card guidelines95">

          <div className="criteria95-card-title">

            <FaClipboardList />

            <h2>
              Evaluation Guidelines / Breakdown of Marks
            </h2>

          </div>

          <table className="criteria95-table">

            <thead>
              <tr>
                <th>Criteria</th>
                <th>Description</th>
                <th>Indicators / Key Points</th>
                <th>Marks</th>
              </tr>
            </thead>

            <tbody>

              <tr>

                <td className="criteria-letter">
                  A.
                </td>

                <td>
                  <strong>
                    Facilities for industry
                    <br />
                    interaction and
                    <br />
                    collaboration
                  </strong>
                </td>

                <td>
                  <ul>
                    <li>
                      Dedicated cell / committee for industry interaction
                    </li>
                    <li>
                      Industry advisory board / partnerships
                    </li>
                    <li>
                      MoUs / collaborations with industries
                    </li>
                    <li>
                      Resources and infrastructure support
                    </li>
                  </ul>
                </td>

                <td className="marks-cell">

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


              <tr>

                <td className="criteria-letter">
                  B.
                </td>

                <td>
                  <strong>
                    Initiatives for
                    <br />
                    interaction and
                    <br />
                    collaboration
                  </strong>
                </td>

                <td>
                  <ul>
                    <li>
                      Industrial visits / expert talks / guest lectures
                    </li>
                    <li>
                      Internships / in-plant training
                    </li>
                    <li>
                      Sponsored projects / consultancy
                    </li>
                    <li>
                      Workshops, FDPs, conferences with industry
                    </li>
                  </ul>
                </td>

                <td className="marks-cell">

                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={marks.B}
                    onChange={(e) =>
                      handleMarksChange(
                        "B",
                        e.target.value,
                        3
                      )
                    }
                  />

                  <span>
                    / 03
                  </span>

                </td>

              </tr>


              <tr>

                <td className="criteria-letter">
                  C.
                </td>

                <td>
                  <strong>
                    Impact of interaction
                    <br />
                    and collaboration
                  </strong>
                </td>

                <td>
                  <ul>
                    <li>
                      Contribution to curriculum / skill development
                    </li>
                    <li>
                      Placements / higher studies / entrepreneurship
                    </li>
                    <li>
                      Research, innovation and start-up support
                    </li>
                    <li>
                      Feedback and outcomes achieved
                    </li>
                  </ul>
                </td>

                <td className="marks-cell">

                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={marks.C}
                    onChange={(e) =>
                      handleMarksChange(
                        "C",
                        e.target.value,
                        3
                      )
                    }
                  />

                  <span>
                    / 03
                  </span>

                </td>

              </tr>


              <tr className="total-row95">

                <td colSpan="3">
                  Total Marks
                </td>

                <td>
                  {totalMarks} / 10
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* RIGHT SIDE */}

        <div className="criteria95-right">

          {/* INSTRUCTIONS */}

          <div className="criteria95-card instructions95">

            <div className="criteria95-card-title">

              <FaInfoCircle />

              <h2>
                Instructions
              </h2>

            </div>

            <ul>

              <li>
                Provide documentary evidence for all the sub-criteria.
              </li>

              <li>
                Consider few relevant activities conducted under
                industry interaction and collaboration.
              </li>

              <li>
                Maximum marks are 10.
              </li>

            </ul>

          </div>


          {/* EXHIBITS */}

          <div className="criteria95-card exhibits95">

            <div className="criteria95-card-title">

              <FaFileIcon />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>

            <div className="exhibit-content">

              <strong>
                ◆ A, B &amp; C:
              </strong>

              <span>
                Appropriate documentary evidence such as
              </span>

              <ul>

                <li>
                  MoUs, activity reports, attendance records
                </li>

                <li>
                  Photos, feedback, outcomes and impact analysis
                </li>

                <li>
                  Any other relevant supporting documents
                </li>

              </ul>

            </div>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM GRID ================= */}

      <div className="criteria95-bottom-grid">

        {/* DOCUMENTS */}

        <div className="criteria95-card documents95">

          <div className="criteria95-card-title">

            <FaCloudUploadAlt />

            <h2>
              Supporting Documents (Upload)
            </h2>

          </div>

          <div className="documents-wrapper95">

            <table>

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

                  <tr key={index}>

                    <td className="serial95">
                      {index + 1}
                    </td>

                    <td>
                      {doc.name}
                    </td>

                    <td>
                      {doc.description}
                    </td>

                    <td className="upload95">

                      <input
                        type="file"
                        ref={(el) =>
                          (fileRefs.current[index] = el)
                        }
                        onChange={(e) =>
                          handleFileChange(index, e)
                        }
                      />

                    </td>

                    <td className="view95">

                      <button
                        type="button"
                        title="View Document"
                        onClick={() =>
                          handleViewFile(index)
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


        {/* EVALUATION */}

        <div className="criteria95-card evaluation95">

          <div className="criteria95-card-title">

            <FaStar />

            <h2>
              Evaluation &amp; Marks
            </h2>

          </div>

          <div className="awarded95">

            <label>
              Marks Awarded (Out of 10)
            </label>

            <div className="awarded-value95">
              {totalMarks} / 10
            </div>

          </div>

          <div className="remarks95">

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

      </div>


      {/* ================= BUTTONS ================= */}

      <div className="criteria95-buttons">

        <button
          className="btn95 previous95"
          onClick={handlePrevious}
        >
          <FaArrowLeft />
          Previous
        </button>

        <button
          className="btn95 back95"
          onClick={handleBack}
        >
          <FaUndo />
          Back
        </button>

        <button
          className="btn95 save95"
          onClick={handleSave}
        >
          <FaSave />
          Save
        </button>

       

        <button
          className="btn95 delete95"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>

        <button
          className="btn95 print95"
          onClick={handlePrint}
        >
          <FaPrint />
          Print
        </button>

        <button
          className="btn95 next95"
          onClick={handleNext}
        >
          Next
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}


/* ================= FILE ICON ================= */

function FaFileIcon() {
  return (
    <span className="file-icon95">
      ▣
    </span>
  );
}

export default Criteria95IndustryInteraction;