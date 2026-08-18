import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PhdStudentView.css";

function PhdStudentView() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const res = await axios.get(
  "http://localhost:5000/api/phd-students"
);
      setRecords(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await axios.delete(
  `http://localhost:5000/api/phd-students/${id}`
);
      loadRecords();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="development-view">
      <div className="view-header">
        <h2>Ph.D. Student Details</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/phd-student/add")
          }
        >
          + Add New
        </button>
      </div>

      <table className="development-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Scholar Name</th>
            <th>Enrollment No</th>
            <th>Research Title</th>
            <th>University</th>
            <th>Status</th>
            <th>Academic Year</th>
            <th>Document</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="10">No Records Found</td>
            </tr>
          ) : (
            records.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.faculty_name}</td>
                <td>{item.scholar_name}</td>
                <td>{item.enrollment_no}</td>
                <td>{item.research_title}</td>
                <td>{item.university}</td>
                <td>{item.status}</td>
                <td>{item.academic_year}</td>
                <td>{item.document ? "Uploaded" : "-"}</td>

                <td>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="bottom-buttons">
        <button
          className="back-btn"
          onClick={() => navigate("/criteria6/research")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default PhdStudentView;