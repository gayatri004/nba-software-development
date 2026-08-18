import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SponsoredResearchView.css";

function SponsoredResearchView() {

const navigate = useNavigate();
useEffect(() => {
    loadRecords();
}, []);
const [records, setRecords] = useState([]);
const loadRecords = async () => {

    try {

        const res = await axios.get(
            "http://localhost:5000/api/sponsored-research"
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
            `http://localhost:5000/api/sponsored-research/${id}`
        );

        loadRecords();

    } catch (error) {

        console.log(error);

        alert("Delete Failed");

    }

};
  return (

    <div className="sponsored-view">

      <div className="view-header">

       <h2>6.2.4 Sponsored Research Projects</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/sponsored-research/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="sponsored-table">

       <thead>

<tr>

<th>Sr No</th>

<th>Project Title</th>

<th>PI Name</th>

<th>Co-PI</th>

<th>Department</th>

<th>Funding Agency</th>

<th>Amount</th>

<th>Duration</th>

<th>Sanction Year</th>
<th>Project Status</th>
<th>Academic Year</th>
<th>Progress</th>
<th>Action</th>
<th>Document</th>


</tr>

</thead>

        <tbody>

{records.length === 0 ? (

<tr>

<td colSpan="14">

No Records Found

</td>

</tr>

) : (

records.map((item,index)=>(
<tr key={item.id}>

  <td>{index + 1}</td>

  <td>{item.project_title}</td>

  <td>{item.pi_name}</td>

  <td>{item.co_pi_name}</td>

  <td>{item.department}</td>

  <td>{item.funding_agency}</td>

  <td>{item.sanction_amount}</td>

  <td>{item.duration}</td>

  <td>{item.sanction_year}</td>

  <td>{item.project_status}</td>

  <td>{item.academic_year}</td>

  <td>{item.project_progress}</td>

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
            navigate("/criteria6/research")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default SponsoredResearchView;