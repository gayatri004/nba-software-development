import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MoocsView.css";

function MoocsView() {

  const navigate = useNavigate();
  useEffect(() => {
  loadRecords();
}, []);
const [records, setRecords] = useState([]);
const loadRecords = async () => {

  try {

    const res = await axios.get(
      "http://localhost:5000/api/moocs"
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
      `http://localhost:5000/api/moocs/${id}`
    );

    loadRecords();

  } catch (error) {

    console.log(error);

  }

};
  return (

    <div className="moocs-view">

      <div className="view-header">
<h2>6.1.4 Faculty Certification of MOOCs through SWAYAM / NPTEL</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/criteria6/moocs/add")}
        >
          + Add New
        </button>

      </div>

      <table className="moocs-table">

        <thead>

          <tr>
<th>Sr No</th>
<th>Faculty Name</th>
<th>Course Name</th>
<th>Platform</th>
<th>Duration</th>
<th>Certificate</th>
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

<td>{item.course_name}</td>

<td>{item.platform}</td>

<td>{item.duration}</td>

<td>{item.certificate_number}</td>

<td>{item.document}</td>

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
          onClick={() => navigate("/criteria6/faculty-development")}
        >
          ← Back
        </button>

      </div>

    </div>

  );

}

export default MoocsView;