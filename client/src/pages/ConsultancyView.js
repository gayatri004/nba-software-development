import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ConsultancyView.css";

function ConsultancyView() {

  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/consultancy-work"
      );

      setRecords(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this record?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/consultancy-work/${id}`
      );

      loadRecords();

    } catch (err) {

      console.log(err);

      alert("Delete Failed");

    }

  };

  return (

    <div className="consultancy-view">

      <div className="view-header">

        <h2>6.2.5 Consultancy Work</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/consultancy/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="consultancy-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Consultancy Title</th>
            <th>Client / Organization</th>
            <th>Amount (₹)</th>
            <th>Duration</th>
            <th>Document</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {records.length === 0 ? (

            <tr>
              <td colSpan="8">No Records Found</td>
            </tr>

          ) : (

            records.map((item, index) => (

              <tr key={item.id}>

                <td>{index + 1}</td>
                <td>{item.faculty_name}</td>
                <td>{item.consultancy_title}</td>
                <td>{item.client_name}</td>
                <td>{item.amount}</td>
                <td>{item.duration}</td>

                <td>
                  {item.document ? (
                    <a
                      href={`http://localhost:5000/uploads/${item.document}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.document}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

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

export default ConsultancyView;