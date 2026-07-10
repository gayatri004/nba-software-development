import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTrash,
  FaPaperPlane,
  FaPrint,
} from "react-icons/fa";

import "./EvolutionOfProject.css";

function EvolutionOfProject() {

  const navigate = useNavigate();

  const documents = [
    {
      id: 1,
      documentName: "Project Data",
      description:
        "Project reports, documentation and other project related evidences.",
    },
  ];

  const handleView = (row) => {
    console.log("View :", row);
  };

  const handleDownload = (row) => {
    console.log("Download :", row);
  };

  return (
    <div className="project-container">

      {/* Header Card */}

      <div className="project-header-card">

        <div className="project-title">

          <div className="project-number">
            3.5
          </div>

          <div className="project-title-text">

            <h2>
              Evolution of Project
            </h2>

            <p>
              Upload and manage project related documents.
            </p>

          </div>

        </div>

      </div>

      {/* White Card */}

      <div className="project-card">

        <div className="project-table-wrapper">

          <table className="project-table">

            <thead>

              <tr>

                <th>Sr.No.</th>

                <th>Document Name</th>

                <th>Description</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {documents.map((item) => (

                <tr key={item.id}>

                  <td className="project-sr">
                    {item.id}
                  </td>

                  <td>
                    {item.documentName}
                  </td>

                  <td>

                    <textarea
                      className="description-box"
                      value={item.description}
                      readOnly
                    />

                  </td>

                  <td className="attachment-cell">

                    <input
                      type="file"
                      className="file-input"
                    />

                    <div className="project-actions">
                                              <button
                        className="view-btn"
                        onClick={() => handleView(item)}
                      >
                        <FaEye /> View
                      </button>

                      <button
                        className="download-btn"
                        onClick={() => handleDownload(item)}
                      >
                        <FaDownload /> Download
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

     {/* ================= BUTTON AREA ================= */}

<div className="navigation-buttons">

    <button 
      className="previous-btn"
      onClick={() => navigate("/criteria/3.4")}
    >
      ← Previous
    </button>


    <div className="bottom-actions">

        <button className="back-btn">
            ← Back
        </button>


        <button className="save-btn">
            Save
        </button>


        <button className="delete-btn">
            Delete
        </button>


        <button className="submit-btn">
            Submit
        </button>


        <button className="print-btn">
            Print
        </button>


    </div>


    <button 
      className="next-btn"
      onClick={() => navigate("/criteria/3.6")}
    >
        Next →
    </button>


</div>
</div>

  );

}

export default EvolutionOfProject;