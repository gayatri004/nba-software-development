import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentProjectView.css";  
import { useNavigate } from "react-router-dom";
function StudentProjectView() {

 const navigate = useNavigate();
 useEffect(() => {
    loadRecords();
}, []);

const [records, setRecords] = useState([]);
const loadRecords = async () => {

    try {

        const res = await axios.get(
            "http://localhost:5000/api/student-projects"
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
            `http://localhost:5000/api/student-projects/${id}`
        );

        loadRecords();

    } catch (error) {

        console.log(error);

        alert("Delete Failed");

    }

};
  return (

    <div className="student-view">

      <div className="view-header">
<h2>
6.1.6 Faculty Support in Student Innovative Projects
</h2>
        <button
          className="add-btn"
          onClick={() =>
            navigate("/criteria6/student-project/add")
          }
        >
          + Add New
        </button>

      </div>

      <table className="student-table">

       <thead>
<tr>
<th>Sr No</th>
<th>Faculty Name</th>
<th>Student Name</th>
<th>Project Title</th>
<th>Competition</th>
<th>Academic Year</th>
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

records.map((item,index)=>(

<tr key={item.id}>

<td>{index+1}</td>
<td>{item.faculty_name}</td>
<td>{item.student_name}</td>
<td>{item.project_title}</td>
<td>{item.competition}</td>
<td>{item.academic_year}</td>
<td>{item.document ? "Uploaded" : "-"}</td>

<td>
<button
className="action-btn delete-btn"
onClick={()=>handleDelete(item.id)}
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
            navigate("/criteria6/faculty-activities")
          }
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default StudentProjectView;