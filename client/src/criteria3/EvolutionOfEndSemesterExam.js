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
import "./EvolutionOfEndSemesterExam.css";

function EvolutionOfEndSemesterExam() {
  const navigate = useNavigate();

  const documents = [
  {
    id: 1,
    documentName: "Question Paper",
    description: "University end semester question papers of all courses.",
  },
  {
    id: 2,
    documentName: "University Result",
    description: "Semester-wise university examination result sheets.",
  },
  {
    id: 3,
    documentName: "Student Assessment",
    description: "Student assessment reports and evaluation records.",
  },
  {
    id: 4,
    documentName: "Assignment Marks",
    description: "Assignment marks of students for each subject.",
  },
  {
    id: 5,
    documentName: "Lab Manual Marks",
    description: "Laboratory manual evaluation and marks records.",
  },
  {
    id: 6,
    documentName: "Internal Marks",
    description: "Internal assessment marks of all students.",
  },
  {
    id: 7,
    documentName: "External Marks",
    description: "External examination marks awarded by the university.",
  },
  {
    id: 8,
    documentName: "Micro Project (SLA)",
    description: "Micro project reports and SLA evaluation documents.",
  },
  {
    id: 9,
    documentName: "Mega Project",
    description: "Major/Mega project reports and final evaluation records.",
  },
];

  const handleView = (row) => {
    console.log("View :", row);
  };

  const handleUpload = (row) => {
    console.log("Upload :", row);
  };

  const handleDownload = (row) => {
    console.log("Download :", row);
  };

return (
  <div className="ese-container">

    {/* Header */}
    <div className="ese-header">
      <div className="ese-title-section">

        <div className="ese-badge">
          3.2
        </div>

        <div className="ese-title-text">
          <h2>Evolution of End Semester Exam</h2>
          <p>
            Upload and manage end semester examination related documents.
          </p>
        </div>

      </div>
    </div>

    {/* White Card */}
    <div className="ese-card">

      <div className="ese-table-wrapper">

        <table className="ese-table">

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

                <td className="sr-no">{item.id}</td>

                <td>{item.documentName}</td>

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
                    onChange={(e) => handleUpload(e, item)}
                  />

                  <div className="action-buttons">

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

    {/* Bottom Buttons - Card च्या बाहेर */}
    <div className="ese-bottom-buttons">

      <button className="previous-btn">
        <FaArrowLeft /> Previous
      </button>

      <button
        className="back-btn"
        onClick={() => navigate("/criteria3-1")}
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
        onClick={() => navigate("/criteria/3.3")}
      >
        Next <FaArrowRight />
      </button>

    </div>

  </div>
);
}

export default EvolutionOfEndSemesterExam;