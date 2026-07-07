import axios from "axios";
import React, { useState } from "react";
import "../styles/CollegeForm.css";

function CollegeForm() {

  const [formData, setFormData] = useState({

    collegeName: "",
    collegeCode: "",
    estYear: "",
    collegeType: "",
    university: "",
    affiliation: "",
    accreditation: "",
    naac: "",
    aishe: "",
    ownership: "",
    minority: "",
    coEducation: "",

    address1: "",
    address2: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",

    principal: "",
    principalContact: "",
    principalEmail: "",

    adminName: "",
    adminContact: "",
    adminEmail: "",

    courses: "",
    departments: "",
    faculty: "",
    students: "",

    ug: "",
    pg: "",
    phd: "",
    otherPrograms: "",

    academicMonth: "",
    admissionMonth: "",

    facilities: "",
    otherInfo: ""

  });

  const [errors, setErrors] = useState({});

  const requiredFields = [

    "collegeName",
    "collegeCode",
    "estYear",
    "collegeType",
    "university",
    "affiliation",
    "accreditation",
    "naac",

    "address1",
    "city",
    "district",
    "state",
    "country",
    "pin",
    "phone",
    "email",

    "principal",
    "principalContact",
    "principalEmail",

    "adminName",
    "adminContact",
    "adminEmail",

    "courses",
    "departments",
    "faculty",
    "students",

    "ug",
    "pg",
    "phd",

    "facilities"

  ];

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({

      ...formData,
      [name]: value

    });

    setErrors({

      ...errors,
      [name]: ""

    });

  };

  const validate = () => {

    let newErrors = {};

    requiredFields.forEach((field) => {

      if (!formData[field] || formData[field].toString().trim() === "") {

        newErrors[field] = "This field is required";

      }

    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSave = async () => {

    if (!validate()) return;

    try {

      const response = await axios.post(

        "nba-software-development-production.up.railway.app/college",

        formData

      );

      alert("College Details Saved Successfully");

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert("Error Saving Data");

    }

  };

  const handlePDF = () => {

  window.open(
    "http://localhost:5000/college/pdf",
    "_blank"
  );

};

  return (
    <div className="college-container">

{/* HEADER */}

<div className="college-header">

  <div>

    <h1>College Management</h1>

  </div>

</div>

{/* ================= BASIC INFORMATION ================= */}

<div className="college-card">

  <h2>Basic Information</h2>

  <div className="grid-4">

    {/* College Name */}

    <div>

      <label>College Name</label>

      <input
        type="text"
        name="collegeName"
        placeholder="Enter College Name"
        value={formData.collegeName}
        onChange={handleChange}
        className={errors.collegeName ? "error-input" : ""}
      />

      {errors.collegeName && (
        <small className="error-text">
          {errors.collegeName}
        </small>
      )}

    </div>

    {/* College Code */}

    <div>

      <label>College Code</label>

      <input
        type="text"
        name="collegeCode"
        placeholder="College Code"
        value={formData.collegeCode}
        onChange={handleChange}
        className={errors.collegeCode ? "error-input" : ""}
      />

      {errors.collegeCode && (
        <small className="error-text">
          {errors.collegeCode}
        </small>
      )}

    </div>

    {/* Established Year */}

    <div>

      <label>Established Year</label>

      <input
        type="date"
        name="estYear"
        value={formData.estYear}
        onChange={handleChange}
        className={errors.estYear ? "error-input" : ""}
      />

      {errors.estYear && (
        <small className="error-text">
          {errors.estYear}
        </small>
      )}

    </div>

    {/* College Type */}

    <div>

      <label>College Type</label>

      <select
        name="collegeType"
        value={formData.collegeType}
        onChange={handleChange}
        className={errors.collegeType ? "error-input" : ""}
      >

        <option value="">Select</option>
        <option>Government</option>
        <option>Private</option>
        <option>Autonomous</option>
        <option>University</option>

      </select>

      {errors.collegeType && (
        <small className="error-text">
          {errors.collegeType}
        </small>
      )}

    </div>

    {/* University */}

    <div>

      <label>Affiliated University</label>

      <select
  name="university"
  value={formData.university}
  onChange={handleChange}
  className={errors.university ? "error-input" : ""}
>
  <option value="">Select Affiliated University</option>

  <option value="Shivaji University, Kolhapur">
    Shivaji University, Kolhapur
  </option>

  <option value="Savitribai Phule Pune University">
    Savitribai Phule Pune University
  </option>

  <option value="University of Mumbai">
    University of Mumbai
  </option>

  <option value="Rashtrasant Tukadoji Maharaj Nagpur University">
    Rashtrasant Tukadoji Maharaj Nagpur University
  </option>

  <option value="Dr. Babasaheb Ambedkar Marathwada University">
    Dr. Babasaheb Ambedkar Marathwada University
  </option>

  <option value="Sant Gadge Baba Amravati University">
    Sant Gadge Baba Amravati University
  </option>

  <option value="Kavayitri Bahinabai Chaudhari North Maharashtra University">
    Kavayitri Bahinabai Chaudhari North Maharashtra University
  </option>

  <option value="Punyashlok Ahilyadevi Holkar Solapur University">
    Punyashlok Ahilyadevi Holkar Solapur University
  </option>

  <option value="Swami Ramanand Teerth Marathwada University">
    Swami Ramanand Teerth Marathwada University
  </option>

  <option value="Gondwana University">
    Gondwana University
  </option>

  <option value="SNDT Women's University">
    SNDT Women's University
  </option>

  <option value="KBC North Maharashtra University">
    KBC North Maharashtra University
  </option>

  <option value="Delhi University">
    Delhi University
  </option>

  <option value="Jawaharlal Nehru University">
    Jawaharlal Nehru University
  </option>

  <option value="Banaras Hindu University">
    Banaras Hindu University
  </option>

  <option value="Aligarh Muslim University">
    Aligarh Muslim University
  </option>

  <option value="Anna University">
    Anna University
  </option>

  <option value="Osmania University">
    Osmania University
  </option>

  <option value="Visvesvaraya Technological University">
    Visvesvaraya Technological University
  </option>

  <option value="Gujarat University">
    Gujarat University
  </option>

  <option value="University of Calcutta">
    University of Calcutta
  </option>

  <option value="University of Madras">
    University of Madras
  </option>

  <option value="Bharathiar University">
    Bharathiar University
  </option>

  <option value="Kerala University">
    University of Kerala
  </option>

  <option value="Mahatma Gandhi University">
    Mahatma Gandhi University
  </option>

  <option value="Barkatullah University">
    Barkatullah University
  </option>

  <option value="Utkal University">
    Utkal University
  </option>

  <option value="University of Rajasthan">
    University of Rajasthan
  </option>

  <option value="Panjab University">
    Panjab University
  </option>

</select>

{errors.university && (
  <small className="error-text">
    {errors.university}
  </small>
)}

    </div>

    

    {/* Accreditation */}

    <div>

      <label>Accreditation</label>

      <select
        name="accreditation"
        value={formData.accreditation}
        onChange={handleChange}
        className={errors.accreditation ? "error-input" : ""}
      >

        <option value="">Select Accreditation</option>
        <option>NAAC</option>
        <option>NBA</option>
        <option>UGC</option>
        <option>AICTE</option>

      </select>

      {errors.accreditation && (
        <small className="error-text">
          {errors.accreditation}
        </small>
      )}

    </div>

    {/* NAAC Grade */}

    <div>

      <label>NAAC Grade</label>

      <select
        name="naac"
        value={formData.naac}
        onChange={handleChange}
        className={errors.naac ? "error-input" : ""}
      >

        <option value="">Select Grade</option>
        <option>A++</option>
        <option>A+</option>
        <option>A</option>
        <option>B++</option>
        <option>B+</option>

      </select>

      {errors.naac && (
        <small className="error-text">
          {errors.naac}
        </small>
      )}

    </div>

  </div>

</div>
{/* ================= ADDRESS INFORMATION ================= */}

<div className="college-card">

  <h2>Address Information</h2>

  <div className="grid-4">

    {/* Address Line 1 */}

    <div>

      <label>Address Line </label>

      <input
        type="text"
        name="address1"
        placeholder="Address Line 1"
        value={formData.address1}
        onChange={handleChange}
        className={errors.address1 ? "error-input" : ""}
      />

      {errors.address1 && (
        <small className="error-text">
          {errors.address1}
        </small>
      )}

    </div>



    {/* City */}

    <div>

      <label>City</label>

     <select
name="city"
value={formData.city}
onChange={handleChange}
className={errors.city ? "error-input" : ""}
>

<option value="">Select City</option>

<option>Ahmednagar</option>
<option>Akola</option>
<option>Amravati</option>
<option>Aurangabad (Chhatrapati Sambhajinagar)</option>
<option>Baramati</option>
<option>Chandrapur</option>
<option>Dhule</option>
<option>Ichalkaranji</option>
<option>Jalgaon</option>
<option>Jalna</option>
<option>Karad</option>
<option>Kolhapur</option>
<option>Latur</option>
<option>Malegaon</option>
<option>Miraj</option>
<option>Mumbai</option>
<option>Nagpur</option>
<option>Nanded</option>
<option>Nashik</option>
<option>Pandharpur</option>
<option>Parbhani</option>
<option>Pimpri-Chinchwad</option>
<option>Pune</option>
<option>Ratnagiri</option>
<option>Sangli</option>
<option>Satara</option>
<option>Solapur</option>
<option>Thane</option>
<option>Ulhasnagar</option>
<option>Wardha</option>
<option>Yavatmal</option>

</select>

{errors.city && (
<small className="error-text">{errors.city}</small>
)}
    </div>

    {/* District */}

    <div>

      <label>District</label>

     <select
name="district"
value={formData.district}
onChange={handleChange}
className={errors.district ? "error-input" : ""}
>

<option value="">Select District</option>

<option>Ahmednagar</option>
<option>Akola</option>
<option>Amravati</option>
<option>Beed</option>
<option>Bhandara</option>
<option>Buldhana</option>
<option>Chandrapur</option>
<option>Dhule</option>
<option>Gadchiroli</option>
<option>Gondia</option>
<option>Hingoli</option>
<option>Jalgaon</option>
<option>Jalna</option>
<option>Kolhapur</option>
<option>Latur</option>
<option>Mumbai City</option>
<option>Mumbai Suburban</option>
<option>Nagpur</option>
<option>Nanded</option>
<option>Nandurbar</option>
<option>Nashik</option>
<option>Dharashiv (Osmanabad)</option>
<option>Palghar</option>
<option>Parbhani</option>
<option>Pune</option>
<option>Raigad</option>
<option>Ratnagiri</option>
<option>Sangli</option>
<option>Satara</option>
<option>Sindhudurg</option>
<option>Solapur</option>
<option>Thane</option>
<option>Wardha</option>
<option>Washim</option>
<option>Yavatmal</option>

</select>

{errors.district && (
<small className="error-text">{errors.district}</small>
)}
    </div>

    {/* State */}

    <div>

      <label>State</label>

     <select
  name="state"
  value={formData.state}
  onChange={handleChange}
  className={errors.state ? "error-input" : ""}
>

<option value="">Select State</option>

<option>Andhra Pradesh</option>
<option>Arunachal Pradesh</option>
<option>Assam</option>
<option>Bihar</option>
<option>Chhattisgarh</option>
<option>Goa</option>
<option>Gujarat</option>
<option>Haryana</option>
<option>Himachal Pradesh</option>
<option>Jharkhand</option>
<option>Karnataka</option>
<option>Kerala</option>
<option>Madhya Pradesh</option>
<option>Maharashtra</option>
<option>Manipur</option>
<option>Meghalaya</option>
<option>Mizoram</option>
<option>Nagaland</option>
<option>Odisha</option>
<option>Punjab</option>
<option>Rajasthan</option>
<option>Sikkim</option>
<option>Tamil Nadu</option>
<option>Telangana</option>
<option>Tripura</option>
<option>Uttar Pradesh</option>
<option>Uttarakhand</option>
<option>West Bengal</option>

<option>Andaman and Nicobar Islands</option>
<option>Chandigarh</option>
<option>Dadra and Nagar Haveli and Daman and Diu</option>
<option>Delhi</option>
<option>Jammu and Kashmir</option>
<option>Ladakh</option>
<option>Lakshadweep</option>
<option>Puducherry</option>

</select>

{errors.state && (
<small className="error-text">{errors.state}</small>
)}

    </div>

    {/* Country */}

    <div>

      <label>Country</label>

      <select
  name="state"
  value={formData.state}
  onChange={handleChange}
  className={errors.state ? "error-input" : ""}
>
  <option value="">Select State</option>

  <option value="Andhra Pradesh">Andhra Pradesh</option>
  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
  <option value="Assam">Assam</option>
  <option value="Bihar">Bihar</option>
  <option value="Chhattisgarh">Chhattisgarh</option>
  <option value="Goa">Goa</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Haryana">Haryana</option>
  <option value="Himachal Pradesh">Himachal Pradesh</option>
  <option value="India">India</option>
  <option value="Jharkhand">Jharkhand</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Kerala">Kerala</option>
  <option value="Madhya Pradesh">Madhya Pradesh</option>
  <option value="Maharashtra">Maharashtra</option>
  <option value="Manipur">Manipur</option>
  <option value="Meghalaya">Meghalaya</option>
  <option value="Mizoram">Mizoram</option>
  <option value="Nagaland">Nagaland</option>
  <option value="Odisha">Odisha</option>
  <option value="Punjab">Punjab</option>
  <option value="Rajasthan">Rajasthan</option>
  <option value="Sikkim">Sikkim</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="Telangana">Telangana</option>
  <option value="Tripura">Tripura</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Uttarakhand">Uttarakhand</option>
  <option value="West Bengal">West Bengal</option>

  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Dadra and Nagar Haveli and Daman and Diu">
    Dadra and Nagar Haveli and Daman and Diu
  </option>
  <option value="Delhi">Delhi</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
  <option value="Ladakh">Ladakh</option>
  <option value="Lakshadweep">Lakshadweep</option>
  <option value="Puducherry">Puducherry</option>

</select>

{errors.state && (
  <small className="error-text">
    {errors.state}
  </small>
)}
    </div>

    {/* PIN Code */}

    <div>

      <label>PIN Code</label>

      <input
        type="text"
        name="pin"
        placeholder="PIN Code"
        value={formData.pin}
        onChange={handleChange}
        className={errors.pin ? "error-input" : ""}
      />

      {errors.pin && (
        <small className="error-text">
          {errors.pin}
        </small>
      )}

    </div>

    {/* Phone */}

    <div>

      <label>Phone Number</label>

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className={errors.phone ? "error-input" : ""}
      />

      {errors.phone && (
        <small className="error-text">
          {errors.phone}
        </small>
      )}

    </div>

    

    {/* Email */}

    <div>

      <label>Email</label>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? "error-input" : ""}
      />

      {errors.email && (
        <small className="error-text">
          {errors.email}
        </small>
      )}

    </div>

    {/* Website */}

    <div>

      <label>Website</label>

      <input
        type="text"
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
      />

    </div>

  </div>

</div>
{/* ================= COLLEGE ADMINISTRATION ================= */}

<div className="college-card">

  <h2>College Administration</h2>

  <div className="grid-3">

    {/* Principal Name */}

    <div>

      <label>Principal Name</label>

      <input
        type="text"
        name="principal"
        placeholder="Principal Name"
        value={formData.principal}
        onChange={handleChange}
        className={errors.principal ? "error-input" : ""}
      />

      {errors.principal && (
        <small className="error-text">
          {errors.principal}
        </small>
      )}

    </div>

    

    

    {/* Administrative Officer */}

    <div>

      <label>Administrative Officer</label>

      <input
        type="text"
        name="adminName"
        placeholder="Administrative Officer"
        value={formData.adminName}
        onChange={handleChange}
        className={errors.adminName ? "error-input" : ""}
      />

      {errors.adminName && (
        <small className="error-text">
          {errors.adminName}
        </small>
      )}

    </div>

    

  </div>

</div>
{/* ================= ACADEMIC INFORMATION ================= */}

<div className="college-card">

  <h2>Academic Information</h2>

  <div className="grid-4">

    {/* Total Courses */}

    <div>

      <label>Total Courses</label>

      <input
        type="number"
        name="courses"
        placeholder="Total Courses"
        value={formData.courses}
        onChange={handleChange}
        className={errors.courses ? "error-input" : ""}
      />

      {errors.courses && (
        <small className="error-text">
          {errors.courses}
        </small>
      )}

    </div>

    {/* Total Departments */}

    <div>

      <label>Total Departments</label>

      <input
        type="number"
        name="departments"
        placeholder="Departments"
        value={formData.departments}
        onChange={handleChange}
        className={errors.departments ? "error-input" : ""}
      />

      {errors.departments && (
        <small className="error-text">
          {errors.departments}
        </small>
      )}

    </div>

    {/* Total Faculty */}

    <div>

      <label>Total Faculty</label>

      <input
        type="number"
        name="faculty"
        placeholder="Faculty"
        value={formData.faculty}
        onChange={handleChange}
        className={errors.faculty ? "error-input" : ""}
      />

      {errors.faculty && (
        <small className="error-text">
          {errors.faculty}
        </small>
      )}

    </div>

    {/* Total Students */}

    <div>

      <label>Total Students</label>

      <input
        type="number"
        name="students"
        placeholder="Students"
        value={formData.students}
        onChange={handleChange}
        className={errors.students ? "error-input" : ""}
      />

      {errors.students && (
        <small className="error-text">
          {errors.students}
        </small>
      )}

    </div>

    {/* UG Programs */}

    <div>

      <label>UG Programs</label>

      <input
        type="number"
        name="ug"
        placeholder="UG Programs"
        value={formData.ug}
        onChange={handleChange}
        className={errors.ug ? "error-input" : ""}
      />

      {errors.ug && (
        <small className="error-text">
          {errors.ug}
        </small>
      )}

    </div>

    {/* PG Programs */}

    <div>

      <label>PG Programs</label>

      <input
        type="number"
        name="pg"
        placeholder="PG Programs"
        value={formData.pg}
        onChange={handleChange}
        className={errors.pg ? "error-input" : ""}
      />

      {errors.pg && (
        <small className="error-text">
          {errors.pg}
        </small>
      )}

    </div>

    {/* PhD Programs */}

    <div>

      <label>PhD Programs</label>

      <input
        type="number"
        name="phd"
        placeholder="PhD Programs"
        value={formData.phd}
        onChange={handleChange}
        className={errors.phd ? "error-input" : ""}
      />

      {errors.phd && (
        <small className="error-text">
          {errors.phd}
        </small>
      )}

    </div>

    {/* Other Programs */}

    <div>

      <label>Other Programs</label>

      <input
        type="number"
        name="otherPrograms"
        placeholder="Other Programs"
        value={formData.otherPrograms}
        onChange={handleChange}
      />

    </div>

    {/* Academic Year Start Month */}

    <div>

      <label>Academic Year Start Month</label>

      <input
        type="month"
        name="academicMonth"
        value={formData.academicMonth}
        onChange={handleChange}
      />

    </div>

    {/* Admission Start Month */}

    <div>

      <label>Admission Start Month</label>

      <input
        type="month"
        name="admissionMonth"
        value={formData.admissionMonth}
        onChange={handleChange}
      />

    </div>

  </div>

</div>
{/* ================= ADDITIONAL INFORMATION ================= */}

<div className="college-card">

  <h2>Additional Information</h2>

  <div className="grid-2">

    {/* Facilities */}

    <div>

      <label>Facilities Available</label>

      <textarea
        name="facilities"
        rows="10"
        placeholder="Library, Hostel, Sports, Wi-Fi, Labs..."
        value={formData.facilities}
        onChange={handleChange}
        className={errors.facilities ? "error-input" : ""}
      />

      {errors.facilities && (
        <small className="error-text">
          {errors.facilities}
        </small>
      )}

    </div>

    {/* Other Information */}

    <div>

      <label>Other Information</label>

      <textarea
        name="otherInfo"
        rows="10"
        placeholder="Any Other Information..."
        value={formData.otherInfo}
        onChange={handleChange}
      />

    </div>

  </div>

</div>

{/* ================= CRUD BUTTONS ================= */}

<div className="crud-buttons">

  <button
className="save-btn"
type="button"
onClick={handleSave}
>
Save
</button>

  <button
    className="update-btn"
    type="button"
  >
    Update
  </button>

  <button
    className="delete-btn"
    type="button"
  >
    Delete
  </button>

  <button
    className="clear-btn"
    type="button"
    onClick={() => {

      setFormData({

        collegeName:"",
        collegeCode:"",
        estYear:"",
        collegeType:"",
        university:"",
        affiliation:"",
        accreditation:"",
        naac:"",
        aishe:"",
        ownership:"",
        minority:"",
        coEducation:"",

        address1:"",
        address2:"",
        city:"",
        district:"",
        state:"",
        country:"",
        pin:"",
        phone:"",
        alternatePhone:"",
        email:"",
        website:"",

        principal:"",
        principalContact:"",
        principalEmail:"",

        adminName:"",
        adminContact:"",
        adminEmail:"",

        courses:"",
        departments:"",
        faculty:"",
        students:"",
        ug:"",
        pg:"",
        phd:"",
        otherPrograms:"",
        academicMonth:"",
        admissionMonth:"",

        facilities:"",
        otherInfo:""

      });

      setErrors({});

    }}
  >
    Clear
  </button>

 <button
  className="pdf-btn"
  type="button"
  onClick={handlePDF}
>
  Export PDF
</button>
</div>

</div>

);

}

export default CollegeForm;