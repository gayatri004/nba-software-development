import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SwayamDevelopmentView.css";

function SwayamDevelopmentView() {

  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/swayam-development"
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
        `http://localhost:5000/api/swayam-development/${id}`
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

        <h2>
          6.1.3 Faculty Contribution in Development of SWAYAM MOOCs and other E-Content
        </h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/swayam-development/add")
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
            <th>Contribution Type</th>
            <th>Course / Content Title</th>
            <th>Platform</th>
            <th>Role</th>
            <th>Development Date</th>
            <th>Academic Year</th>
            <th>Document</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {records.length === 0 ? (

            <tr>

              <td colSpan="10">

                No Records Found

              </td>

            </tr>

          ) : (

            records.map((item, index) => (

              <tr key={item.id}>

                <td>{index + 1}</td>

                <td>{item.faculty_name}</td>

                <td>{item.contribution_type}</td>

                <td>{item.course_title}</td>

                <td>{item.platform}</td>

                <td>{item.role}</td>

                <td>{item.development_date}</td>

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
          onClick={() =>
            navigate("/criteria6/faculty-development")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default SwayamDevelopmentView;