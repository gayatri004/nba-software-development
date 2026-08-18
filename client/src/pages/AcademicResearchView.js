import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AcademicResearchView.css";

function AcademicResearchView() {

 const navigate = useNavigate();
 useEffect(() => {
    loadRecords();
}, []);

const [records, setRecords] = useState([]);
const loadRecords = async () => {

    try {

        const res = await axios.get(
            "http://localhost:5000/api/academic-research"
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
            `http://localhost:5000/api/academic-research/${id}`
        );

        loadRecords();

    } catch (error) {

        console.log(error);

        alert("Delete Failed");

    }

};

  return (

    <div className="research-view">

      <div className="view-header">

        <h2>Academic Research</h2>

        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/academic-research/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="research-table">

       <thead>

<tr>

<th>Sr No</th>

<th>Faculty Name</th>

<th>Journal Papers</th>

<th>Conference Papers</th>

<th>Books / Chapters</th>

<th>Academic Year</th>

<th>Document</th>

<th>Action</th>

</tr>

</thead>

        <tbody>

          <tr>

            <td colSpan="7">

              No Records Found

            </td>

          </tr>

        </tbody>
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

<td>{item.journal_papers}</td>

<td>{item.conference_papers}</td>

<td>{item.books_published}</td>

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
            navigate("/criteria6/research")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default AcademicResearchView;