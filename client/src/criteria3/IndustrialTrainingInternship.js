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

import "./IndustrialTrainingInternship.css";

function IndustrialTrainingInternship() {

  const navigate = useNavigate();

  const documents = [
    {
      id: 1,
      documentName: "Rubrics",
      description:
        "Rubrics used for industrial training and internship evaluation.",
    },
    {
      id: 2,
      documentName: "Evidences",
      description:
        "Internship reports, completion certificates, photographs and other supporting evidences.",
    },
  ];

  const handleView = (row) => {
    console.log("View :", row);
  };

  const handleDownload = (row) => {
    console.log("Download :", row);
  };

  return (
    <div className="intern-wrapper">

      {/* Header */}

      <div className="intern-header-card">

        <div className="intern-title">

          <div className="intern-number">
            3.4
          </div>

          <div className="intern-title-text">

            <h2>
              Industrial Training / Internship
            </h2>

            <p>
              Upload and manage industrial training and internship related
              documents.
            </p>

          </div>

        </div>

      </div>

      {/* White Card */}

      <div className="intern-card">

        <div className="intern-table-wrapper">

          <table className="intern-table">

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

                  <td className="intern-sr">
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

                    <div className="intern-actions">
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

      {/* Bottom Buttons */}

      <div className="intern-bottom-buttons">

        <button
          className="previous-btn"
          onClick={() => navigate("/criteria3-3")}
        >
          <FaArrowLeft /> Previous
        </button>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>

        <button className="save-btn">
          <FaSave /> Save
        </button>

        <button className="delete-btn">
          <FaTrash /> Delete
        </button>

        <button className="submit-btn">
          <FaPaperPlane /> Submit
        </button>

        <button className="print-btn">
          <FaPrint /> Print
        </button>

        <button
          className="next-btn"
          onClick={() => navigate("/criteria3-5")}
        >
          Next <FaArrowRight />
        </button>
              </div>

    </div>

  );
}

export default IndustrialTrainingInternship;