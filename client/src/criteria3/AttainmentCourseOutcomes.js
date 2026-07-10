import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaArrowRight,
} from "react-icons/fa";

import "./AttainmentCourseOutcomes.css";

function AttainmentCourseOutcomes() {

  const navigate = useNavigate();

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentName: "Attainment given by Faculty",
      description:
        "Upload faculty-wise attainment calculation report.",
      file: null,
    },
    {
      id: 2,
      documentName: "Course Outcome Attachment",
      description:
        "Upload CO attainment supporting documents.",
      file: null,
    },
    {
      id: 3,
      documentName: "Theory Attainment",
      description:
        "Upload theory attainment report.",
      file: null,
    },
    {
      id: 4,
      documentName: "Practical Attainment",
      description:
        "Upload practical attainment report.",
      file: null,
    },
  ]);

  const handleFileChange = (index, file) => {
    const updated = [...documents];
    updated[index].file = file;
    setDocuments(updated);
  };

  const handleView = (file) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleDownload = (file) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handlePrint = (file) => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const url = URL.createObjectURL(file);

    const win = window.open(url);

    if (win) {
      win.onload = () => {
        win.print();
      };
    }
  };

 return (
  <div className="course-container">

    {/* ===========================
          PAGE HEADER
    =========================== */}

    <div className="page-header">

      <div className="header-left">

        <div className="criteria-circle">
          3.7
        </div>

        <div className="header-content">

          <h2>Attainment of Course Outcomes</h2>

          <p>
            Upload and manage attainment of course outcomes related documents.
          </p>

        </div>

      </div>

    </div>

    {/* ===========================
          TABLE CARD
    =========================== */}

    <div className="course-card">

      <table className="course-table">

        <thead>
          <tr>

            <th style={{ width: "8%" }}>
              Sr.No.
            </th>

            <th style={{ width: "30%" }}>
              Document Name
            </th>

            <th style={{ width: "35%" }}>
              Description
            </th>

            <th style={{ width: "27%" }}>
              Action
            </th>

          </tr>
        </thead>

    

          {/* documents.map() इथे सुरू होईल */}

          <tbody>

            {documents.map((doc, index) => (

              <tr key={doc.id}>

                <td>{doc.id}</td>

                <td>{doc.documentName}</td>

                <td>{doc.description}</td>

                <td>

                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(
                        index,
                        e.target.files[0]
                      )
                    }
                  />

                </td>

                <td>
                    <div className="action-buttons">

  <button
    className="view-btn"
    onClick={() => handleView(doc.file)}
  >
    <FaEye /> View
  </button>

  <button
    className="download-btn"
    onClick={() => handleDownload(doc.file)}
  >
    <FaDownload /> Download
  </button>

  <button
    className="print-btn"
    onClick={() => handlePrint(doc.file)}
  >
    <FaPrint /> Print
  </button>

</div>
                  

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ===========================
            BOTTOM BUTTONS
      =========================== */}

      <div className="bottom-buttons">

        <button
          className="back-btn"
          onClick={() => navigate("/criteria/3.6")}
        >
          <FaArrowLeft />
          Previous
        </button>

        <div className="right-buttons">

          <button className="save-btn">
            <FaSave />
            Save
          </button>

          <button className="delete-btn">
            <FaTrash />
            Delete
          </button>

          <button className="submit-btn">
            <FaPaperPlane />
            Submit
          </button>

          <button
            className="next-btn"
            onClick={() => navigate("/criteria/3.8")}
          >
            Next
            <FaArrowRight />
          </button>

        </div>

      </div>
          </div>
  );
}

export default AttainmentCourseOutcomes;