import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Criteria5Qual.css";


function Criteria5Qual() {

const navigate = useNavigate();
const fileRef = useRef(null);


const initialData = [
  { id:1, name:"Ph.D.", m1:0, m2:0, m3:0 },
  { id:2, name:"M.Tech / M.E.", m1:0, m2:0, m3:0 },
  { id:3, name:"B.Tech", m1:0, m2:0, m3:0 },
  { id:4, name:"Others", m1:0, m2:0, m3:0 }
];


const [data,setData] = useState(initialData);

const [qualificationId,setQualificationId] = useState(null);

const [documentName,setDocumentName] = useState("");

const [selectedYear,setSelectedYear] = useState("m1");
const [students,setStudents] = useState(0);

useEffect(() => {
  fetchStudents();
}, []);

const fetchStudents = async () => {
  try {

    const res = await axios.get(
      "http://localhost:5000/api/criteria5/sfr/latest"
    );

    setStudents(Number(res.data.students));

  } catch (err) {
    console.log(err);
  }
};

/* ================= TABLE CHANGE ================= */

const handleChange = (index,field,value)=>{

const updated=[...data];

updated[index][field]=Number(value)||0;

setData(updated);

};



/* ================= TOTAL ================= */


const totalM1=data.reduce(
(sum,item)=>sum+Number(item.m1),0
);


const totalM2=data.reduce(
(sum,item)=>sum+Number(item.m2),0
);


const totalM3=data.reduce(
(sum,item)=>sum+Number(item.m3),0
);



const totalTeachers={
m1:totalM1,
m2:totalM2,
m3:totalM3
};



/* ================= PERCENTAGE ================= */


const calculatePercentage=(value,total)=>{

if(total===0)
return "0.00";

return ((value/total)*100).toFixed(2);

};




/* ================= FQI ================= */


const phd =
Number(data[0][selectedYear] || 0);


const mtech =
Number(data[1][selectedYear] || 0);

const rf =
students > 0
  ? Number((students / 20).toFixed(2))
  : 0;

const fqi =
rf > 0
  ? (
      2.5 *
      (((10 * phd) + (4 * mtech)) / rf)
    ).toFixed(2)
  : "0.00";
/* ================= NBA MARKS ================= */


let marks = Number(fqi);


if(marks>25)
marks=25;



const nbaPercentage =
((marks/25)*100).toFixed(2);



let status="Poor";


if(marks>=20)
status="Excellent";

else if(marks>=15)
status="Very Good";

else if(marks>=10)
status="Good";

else if(marks>=5)
status="Average";



/* ================= NAVIGATION ================= */


const handlePrevious=()=>{
navigate("/criteria5/sfr");
};


const handleNext=()=>{
navigate("/criteria5/cadre");
};
/* ================= SAVE ================= */

const handleSave = async()=>{

try{

const res = await axios.post(
"http://localhost:5000/api/criteria5/qualification",
{
 data,
 students,
 rf,
 fqi,
 marks
}
);


setQualificationId(res.data.id);


alert("Data Saved Successfully");


}
catch(err){

console.log(err);

alert("Save Failed");

}

};




/* ================= UPDATE ================= */


const handleUpdate = async()=>{


if(!qualificationId){

alert("Please Save Data First");

return;

}


try{


await axios.put(

`http://localhost:5000/api/criteria5/qualification/${qualificationId}`,

{
data
}

);


alert("Updated Successfully");


}
catch(err){

console.log(err);

alert("Update Failed");

}

};




/* ================= DELETE ================= */


const handleDelete=async()=>{


if(!qualificationId){

alert("Please Save Data First");

return;

}


try{


await axios.delete(

`http://localhost:5000/api/criteria5/qualification/${qualificationId}`

);


alert("Deleted Successfully");


setData(initialData);

setQualificationId(null);

setDocumentName("");


}

catch(err){

console.log(err);

alert("Delete Failed");

}

};




/* ================= CLEAR ================= */


const handleClear=()=>{


setData(initialData);

setSelectedYear("m1");

setDocumentName("");

setQualificationId(null);

setStudents(0);
if(fileRef.current){

fileRef.current.value="";

}


};




/* ================= UPLOAD ================= */


const handleUpload=async(e)=>{


const file=e.target.files[0];


if(!file)
return;



if(!qualificationId){

alert("Please Save Data First");

return;

}



try{


const formData=new FormData();


formData.append(
"document",
file
);


formData.append(
"id",
qualificationId
);



const res=await axios.post(

"http://localhost:5000/api/criteria5/qualification/upload",

formData,

{
headers:{
"Content-Type":"multipart/form-data"
}
}

);



setDocumentName(
res.data.data.document
);


alert("Document Uploaded Successfully");


}

catch(err){

console.log(err);

alert("Upload Failed");

}


};




return (

<div className="criteria5qual">


<div className="main-card">


<div className="table-container">



<div className="criteria5qual-header">


<div className="title-badge">

5.2

</div>


<div className="header-text">

<h2>
Faculty Qualifications
</h2>

<p>
Faculty Qualification Details
</p>

</div>


</div>




<div className="qualification-layout">


<div className="table-area">



<table>


<thead>


<tr>


<th rowSpan="2">
Sr.No
</th>


<th rowSpan="2">
Faculty Qualification
</th>


<th colSpan="2">
CAY M1
<br/>
(2024-25)
</th>


<th colSpan="2">
CAY M2
<br/>
(2023-24)
</th>


<th colSpan="2">
CAY M3
<br/>
(2022-23)
</th>



<th rowSpan="2">


<select

className="yearDropdown"

value={selectedYear}

onChange={(e)=>setSelectedYear(e.target.value)}

>


<option value="m1">
CAY M1
</option>


<option value="m2">
CAY M2
</option>


<option value="m3">
CAY M3
</option>


</select>


<br/>

Total Teachers


</th>


<th rowSpan="2">
%
</th>


</tr>




<tr>


<th>No.</th>
<th>%</th>

<th>No.</th>
<th>%</th>

<th>No.</th>
<th>%</th>


</tr>



</thead>




<tbody>


{
data.map((item,index)=>(


<tr key={item.id}>


<td>
{index+1}
</td>


<td className="left">
{item.name}
</td>



<td>

<input

type="number"

value={item.m1}

onChange={(e)=>
handleChange(index,"m1",e.target.value)
}

/>

</td>


<td>
{calculatePercentage(item.m1,totalM1)}%
</td>




<td>

<input

type="number"

value={item.m2}

onChange={(e)=>
handleChange(index,"m2",e.target.value)
}

/>

</td>



<td>
{calculatePercentage(item.m2,totalM2)}%
</td>




<td>

<input

type="number"

value={item.m3}

onChange={(e)=>
handleChange(index,"m3",e.target.value)
}

/>

</td>


<td>
{calculatePercentage(item.m3,totalM3)}%
</td>




<td>

{
item[selectedYear]
}

</td>



<td>

{
calculatePercentage(
item[selectedYear],
totalTeachers[selectedYear]
)
}%

</td>



</tr>


))

}




<tr className="total-row">


<td colSpan="2">

<b>
Total Full Time Teachers (F)
</b>

</td>


<td>
<b>{totalM1}</b>
</td>


<td>
100%
</td>


<td>
<b>{totalM2}</b>
</td>


<td>
100%
</td>



<td>
<b>{totalM3}</b>
</td>


<td>
100%
</td>


<td>
<b>
{totalTeachers[selectedYear]}
</b>
</td>


<td>
100%
</td>



</tr>



</tbody>



</table>



</div>



{/* ================= CARDS ================= */}



<div className="cards-row">



<div className="formula-card">


<h3>
FQI Calculation
</h3>

<div className="student-input">

<label>Total Students</label>

<input
type="number"
value={students}
readOnly
/>

</div>
<p>
FQI = 2.5 × [(10X + 4Y) / RF]
</p>


<p>
X (Ph.D.) = {phd}
</p>


<p>
Y (M.Tech/M.E.) = {mtech}
</p>


<p>
RF = {rf}
</p>


<hr/>


<h2>
{fqi}
</h2>


</div>





<div className="evaluation-card">


<h3>
NBA Evaluation
</h3>



<div className="eval-row">

<span>
Maximum Marks
</span>

<b>
25
</b>

</div>



<div className="eval-row">

<span>
Obtained Marks
</span>

<b>
{marks.toFixed(2)}/25
</b>

</div>




<div className="eval-row">

<span>
Percentage
</span>

<b>
{nbaPercentage}%
</b>

</div>



<div className="status">

{status}

</div>



</div>






<div className="document-card">


<h3>
Supporting Document
</h3>


<div className="file-box">

{
documentName || "No File Uploaded"
}

</div>



<button

className="upload-btn2"

onClick={()=>
fileRef.current.click()
}

>

Upload Supporting Document

</button>



</div>



</div>





<input

type="file"

hidden

ref={fileRef}

onChange={handleUpload}

/>





<div className="action-buttons">


<button 
className="btn previous"
onClick={handlePrevious}
>
Previous
</button>



<button
className="btn save"
onClick={handleSave}
>
Save
</button>




<button
className="btn update"
onClick={handleUpdate}
>
Update
</button>




<button
className="btn delete"
onClick={handleDelete}
>
Delete
</button>




<button
className="btn clear"
onClick={handleClear}
>
Clear
</button>




<button
className="btn next"
onClick={handleNext}
>
Next
</button>



</div>



</div>


</div>


</div>


</div>


);


}


export default Criteria5Qual;