import React from "react";
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
import { useNavigate } from "react-router-dom";

import "./LaboratoryWorkshop.css";

function LaboratoryWorkshop() {
  const navigate = useNavigate();

  const documents = [
  {
    id: 1,
    documentName: "Rubrics Attachment",
    description: "Rubrics used for laboratory work and workshop evaluation.",
  },
  {
    id: 2,
    documentName: "Evidences",
    description: "Photos, reports and other evidences of laboratory work and workshops.",
  },
];

  const handleView = (row) => {
    console.log("View :", row);
  };

  

  const handleDownload = (row) => {
    console.log("Download :", row);
  };

 return (
  <div className="lab-wrapper">

    {/* Header Card */}
    <div className="lab-header-card">

      <div className="lab-title">

        <div className="lab-number">
          3.3
        </div>

        <div className="lab-title-text">
          <h2>Laboratory Work & Workshop</h2>
          <p>
            Upload and manage laboratory work and workshop related documents.
          </p>
        </div>

      </div>

    </div>

    {/* Table Card */}
    <div className="lab-card">

      <div className="lab-table-wrapper">

        <table className="lab-table">

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

                <td className="lab-sr">
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

                  <div className="lab-actions">

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

    <div className="lab-bottom-buttons">

      <button
        className="previous-btn"
        onClick={() => navigate("/criteria3-2")}
      >
        <FaArrowLeft />
        Previous
      </button>

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        Back
      </button>

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

      <button className="print-btn">
        <FaPrint />
        Print
      </button>

      <button
        className="next-btn"
        onClick={() => navigate("/criteria3-4")}
      >
        Next
        <FaArrowRight />
      </button>

    </div>

  </div>
);
}
export default LaboratoryWorkshop;