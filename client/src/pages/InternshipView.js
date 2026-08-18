import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InternshipView.css";

function InternshipView() {

  const navigate = useNavigate();
  useEffect(() => {
    loadRecords();
}, []);

const [records, setRecords] = useState([]);
const loadRecords = async () => {

    try {

        const res = await axios.get(
            "http://localhost:5000/api/internships"
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
            `http://localhost:5000/api/internships/${id}`
        );

        loadRecords();

    } catch (error) {

        console.log(error);

        alert("Delete Failed");

    }

};
  return (

    <div className="internship-view">

      <div className="view-header">
<h2>
6.1.7 Faculty Internship / Training / Collaboration with Industry
</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/internship/add")}
        >
          + Add New
        </button>

      </div>

      <table className="internship-table">

       <thead>

<tr>

<th>Sr No</th>

<th>Faculty Name</th>

<th>Company / Industry</th>

<th>Training Type</th>

<th>From Date</th>

<th>To Date</th>

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

records.map((item,index)=>(

<tr key={item.id}>

<td>{index+1}</td>

<td>{item.faculty_name}</td>

<td>{item.company_name}</td>

<td>{item.training_type}</td>

<td>{item.from_date?.substring(0,10)}</td>

<td>{item.to_date?.substring(0,10)}</td>

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
          onClick={() => navigate("/criteria6/faculty-activities")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default InternshipView;