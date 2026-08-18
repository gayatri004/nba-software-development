import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SeedMoneyView.css";

function SeedMoneyView() {

  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/seed-money"
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
        `http://localhost:5000/api/seed-money/${id}`
      );

      loadRecords();

    } catch (err) {

      console.log(err);

      alert("Delete Failed");

    }

  };

  return (

    <div className="seedmoney-view">

      <div className="view-header">

        <h2>6.2.6 Institution Seed Money / Internal Research Grant</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/seed-money/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="seedmoney-table">

        <thead>

          <tr>

            <th>Sr No</th>
            <th>Faculty Name</th>
            <th>Project Title</th>
            <th>Grant Amount</th>
            <th>Academic Year</th>
            <th>Status</th>
            <th>Document</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {records.length === 0 ? (

            <tr>

              <td colSpan="8">

                No Records Found

              </td>

            </tr>

          ) : (

            records.map((item, index) => (

              <tr key={item.id}>

                <td>{index + 1}</td>

                <td>{item.faculty_name}</td>

                <td>{item.project_title}</td>

                <td>{item.grant_amount}</td>

                <td>{item.academic_year}</td>

                <td>{item.status}</td>

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
          onClick={() =>
            navigate("/criteria6/research")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default SeedMoneyView;