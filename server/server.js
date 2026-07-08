const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CIMDR Backend Running Successfully");
});

/* ================= EMPLOYEE ================= */

app.get("/employees", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM employees ORDER BY id"
    );

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

app.post("/employees", async (req, res) => {

  try {

    const {

      name,
      department,
      designation,
      mobile,
      email,
      status

    } = req.body;

    const result = await pool.query(

      `INSERT INTO employees
      (
      name,
      department,
      designation,
      mobile,
      email,
      status
      )

      VALUES
      ($1,$2,$3,$4,$5,$6)

      RETURNING *`,

      [

        name,
        department,
        designation,
        mobile,
        email,
        status

      ]

    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

});

/* ================= FACULTY ================= */

app.get("/faculty", async (req, res) => {

  try {

    const result = await pool.query(

      "SELECT * FROM faculty ORDER BY id DESC"

    );

    res.json(result.rows);

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

});

app.post("/faculty", async (req, res) => {

  try {

    const {

      faculty_id,
      faculty_name,
      father_name,
      dob,
      gender,
      marital_status,
      blood_group,
      nationality,
      religion,
      category,
      faculty_status,

      current_address,
      permanent_address,
      city,
      state,
      pin_code,
      country,

      pan_number,
      aadhaar_number,
      apar_id,

      department,
      designation,
      qualification,
      specialization,

      joining_date,
      employee_type,
      experience,
      previous_experience,

      email,
      mobile,
      alternate_mobile,
      salary

    } = req.body;

    const result = await pool.query(

`INSERT INTO faculty(

faculty_id,
faculty_name,
father_name,
dob,
gender,
marital_status,
blood_group,
nationality,
religion,
category,
faculty_status,

current_address,
permanent_address,
city,
state,
pin_code,
country,

pan_number,
aadhaar_number,
apar_id,

department,
designation,
qualification,
specialization,

joining_date,
employee_type,
experience,
previous_experience,

email,
mobile,
alternate_mobile,
salary

)

VALUES(

$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
$31,$32

)

RETURNING *`,

[

faculty_id,
faculty_name,
father_name,
dob,
gender,
marital_status,
blood_group,
nationality,
religion,
category,
faculty_status,

current_address,
permanent_address,
city,
state,
pin_code,
country,

pan_number,
aadhaar_number,
apar_id,

department,
designation,
qualification,
specialization,

joining_date,
employee_type,
experience,
previous_experience,

email,
mobile,
alternate_mobile,
salary

]

);

res.json(result.rows[0]);

}

catch(err){

res.status(500).json({

error:err.message

});

}

});

/* ================= COLLEGE ================= */

app.get("/college", async(req,res)=>{

try{

const result=await pool.query(

"SELECT * FROM college ORDER BY id DESC"

);

res.json(result.rows);

}

catch(err){

res.status(500).json({

error:err.message

});

}

});

app.post("/college",async(req,res)=>{

try{

const{

collegeName,
collegeCode,
estYear,
collegeType,
university,
affiliation,
accreditation,
naac,

address1,
address2,
city,
district,
state,
country,
pin,
phone,
alternatePhone,
email,
website,

principal,
principalContact,
principalEmail,

adminName,
adminContact,
adminEmail,

courses,
departments,
faculty,
students,

ug,
pg,
phd,
otherPrograms,

facilities,
otherInfo

}=req.body;
const result = await pool.query(

`INSERT INTO college(

college_name,
college_code,
established_year,
college_type,
university,
affiliation,
accreditation,
naac,

address1,
address2,
city,
district,
state,
country,
pin,
phone,
alternate_phone,
email,
website,

principal,
principal_contact,
principal_email,

admin_name,
admin_contact,
admin_email,

courses,
departments,
faculty,
students,

ug,
pg,
phd,
other_programs,

facilities,
other_info

)

VALUES(

$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
$31,$32,$33,$34,$35

)

RETURNING *`,

[

collegeName,
collegeCode,
estYear,
collegeType,
university,
affiliation,
accreditation,
naac,

address1,
address2,
city,
district,
state,
country,
pin,
phone,
alternatePhone,
email,
website,

principal,
principalContact,
principalEmail,

adminName,
adminContact,
adminEmail,

courses,
departments,
faculty,
students,

ug,
pg,
phd,
otherPrograms,

facilities,
otherInfo

]

);

res.status(201).json(result.rows[0]);

}

catch(err){

console.error(err);

res.status(500).json({

error:err.message

});

}

});

/* ================= FACULTY PDF ================= */

app.get("/faculty/pdf", async (req, res) => {

try{

const result = await pool.query(

"SELECT * FROM faculty ORDER BY id"

);

const doc = new PDFDocument({

margin:40,
size:"A4"

});

res.setHeader(

"Content-Type",
"application/pdf"

);

res.setHeader(

"Content-Disposition",
"attachment; filename=Faculty_Report.pdf"

);

doc.pipe(res);

doc.fontSize(20).text(

"Faculty Management Report",

{

align:"center"

}

);

doc.moveDown();

result.rows.forEach((faculty,index)=>{

doc.fontSize(14).text(

`Faculty ${index+1}`,

{

underline:true

}

);

doc.moveDown();

const data=[

["Faculty ID",faculty.faculty_id],
["Faculty Name",faculty.faculty_name],
["Father Name",faculty.father_name],
["DOB",faculty.dob],
["Gender",faculty.gender],
["Marital Status",faculty.marital_status],
["Blood Group",faculty.blood_group],
["Nationality",faculty.nationality],
["Religion",faculty.religion],
["Category",faculty.category],
["Faculty Status",faculty.faculty_status],
["Current Address",faculty.current_address],
["Permanent Address",faculty.permanent_address],
["City",faculty.city],
["State",faculty.state],
["PIN",faculty.pin_code],
["Country",faculty.country],
["PAN",faculty.pan_number],
["Aadhaar",faculty.aadhaar_number],
["APAR",faculty.apar_id],
["Department",faculty.department],
["Designation",faculty.designation],
["Qualification",faculty.qualification],
["Specialization",faculty.specialization],
["Joining Date",faculty.joining_date],
["Employee Type",faculty.employee_type],
["Experience",faculty.experience],
["Previous Experience",faculty.previous_experience],
["Email",faculty.email],
["Mobile",faculty.mobile],
["Alternate Mobile",faculty.alternate_mobile],
["Salary",faculty.salary]

];

let y=doc.y;
data.forEach((row)=>{

doc.rect(40,y,180,22).stroke();

doc.font("Helvetica-Bold")
.fontSize(10)
.text(row[0],45,y+6);

doc.rect(220,y,330,22).stroke();

doc.font("Helvetica")
.fontSize(10)
.text(String(row[1] ?? ""),225,y+6);

y+=22;

if(y>760){

doc.addPage();

y=40;

}

});

doc.y=y+10;

doc.moveDown();

doc.moveTo(40,doc.y)
.lineTo(550,doc.y)
.stroke();

doc.moveDown();

});

doc.end();

}

catch(err){

console.log(err);

res.status(500).send("PDF Error");

}

});

// ================= DEPARTMENT =================

// GET Department

app.get("/department", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM department ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// POST Department

app.post("/department", async (req, res) => {

  try {

    const {

      departmentCode,
      departmentType,
      hodName,
      reportingTo,
      establishedDate,
      status,
      building,
      floor,
      campus

    } = req.body;

    const result = await pool.query(

      `INSERT INTO department(

      department_code,
      department_type,
      hod_name,
      reporting_to,
      established_date,
      status,
      building,
      floor,
      campus

      )

      VALUES(

      $1,$2,$3,$4,$5,$6,$7,$8,$9

      )

      RETURNING *`,

      [

        departmentCode,
        departmentType,
        hodName,
        reportingTo,
        establishedDate,
        status,
        building,
        floor,
        campus

      ]

    );

    res.json({

      success: true,

      message: "Department Saved Successfully",

      data: result.rows[0]

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      error: err.message

    });

  }

});
/* ================= AUTHORITY ================= */

// GET Authority

app.get("/authority", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM authority ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

// POST Authority

app.post("/authority", async (req, res) => {

  try {

    const {

      authority_id,
      authority_name,
      employee_id,
      department,
      designation,
      authority_level,
      joining_date,
      status,

      username,
      password,
      email,

      mobile,
      office_extension,
      office_location,
      apar_id,
      office_address,

      remarks

    } = req.body;

    const result = await pool.query(

`INSERT INTO authority(

authority_id,
authority_name,
employee_id,
department,
designation,
authority_level,
joining_date,
status,

username,
password,
email,

mobile,
office_extension,
office_location,
apar_id,
office_address,

remarks

)

VALUES(

$1,$2,$3,$4,$5,$6,$7,$8,
$9,$10,$11,
$12,$13,$14,$15,$16,
$17

)

RETURNING *`,

[
authority_id,
authority_name,
employee_id,
department,
designation,
authority_level,
joining_date,
status,

username,
password,
email,

mobile,
office_extension,
office_location,
apar_id,
office_address,

remarks
]

);

    res.status(201).json({

      success: true,

      message: "Authority Saved Successfully",

      data: result.rows[0]

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      error: err.message

    });

  }

});

// DELETE Authority

app.delete("/authority/:id", async (req, res) => {

  try {

    await pool.query(

      "DELETE FROM authority WHERE id=$1",

      [req.params.id]

    );

    res.json({

      success: true,

      message: "Authority Deleted Successfully"

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  }

});
/* ================= COURSE MASTER ================= */

// GET Course Master

app.get("/course-master", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM course_master ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// POST Course Master

app.post("/course-master", async (req, res) => {
  try {

    const {

      courseCode,
      courseName,
      courseType,
      department,
      courseLevel,

      duration,
      totalSemesters,
      intakeCapacity,

      courseStatus,
      approvalStatus,

      startDate,
      endDate,

      coordinator,
      contactNumber,

      courseDescription,
      courseObjective,
      eligibilityCriteria,
      courseOutcome,

      tuitionFees,
      developmentFees,
      otherFees,
      totalFees

    } = req.body;

    const result = await pool.query(

`INSERT INTO course_master(

course_code,
course_name,
course_type,
department,
course_level,

duration,
total_semesters,
intake_capacity,

course_status,
approval_status,

start_date,
end_date,

coordinator,
contact_number,

course_description,
course_objective,
eligibility_criteria,
course_outcome,

tuition_fees,
development_fees,
other_fees,
total_fees

)

VALUES(

$1,$2,$3,$4,$5,
$6,$7,$8,
$9,$10,
$11,$12,
$13,$14,
$15,$16,$17,$18,
$19,$20,$21,$22

)

RETURNING *`,

[
courseCode,
courseName,
courseType,
department,
courseLevel,

duration,
totalSemesters,
intakeCapacity,

courseStatus,
approvalStatus,

startDate,
endDate,

coordinator,
contactNumber,

courseDescription,
courseObjective,
eligibilityCriteria,
courseOutcome,

tuitionFees,
developmentFees,
otherFees,
totalFees

]

);

    res.status(201).json({
      success: true,
      message: "Course Saved Successfully",
      data: result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});
/* ================= COLLEGE PDF ================= */

app.get("/college/pdf", async (req, res) => {

try{

const result=await pool.query(

"SELECT * FROM college ORDER BY id"

);

const doc=new PDFDocument({

margin:40,
size:"A4"

});

res.setHeader(

"Content-Type",
"application/pdf"

);

res.setHeader(

"Content-Disposition",
"attachment; filename=College_Report.pdf"

);

doc.pipe(res);

doc.fontSize(20).text(

"College Management Report",

{

align:"center"

}

);

doc.moveDown();

result.rows.forEach((college,index)=>{

doc.fontSize(14).text(

`College ${index+1}`,

{

underline:true

}

);

doc.moveDown();

const data=[

["College Name",college.college_name],
["College Code",college.college_code],
["Established Year",college.established_year],
["College Type",college.college_type],
["University",college.university],
["Affiliation",college.affiliation],
["Accreditation",college.accreditation],
["NAAC Grade",college.naac],

["Address Line 1",college.address1],
["City",college.city],
["District",college.district],
["State",college.state],
["Country",college.country],
["PIN",college.pin],
["Phone",college.phone],
["Email",college.email],
["Website",college.website],

["Principal",college.principal],


["Admin Officer",college.admin_name],

["Courses",college.courses],
["Departments",college.departments],
["Faculty",college.faculty],
["Students",college.students],

["UG",college.ug],
["PG",college.pg],
["PhD",college.phd],
["Other Programs",college.other_programs],

["Facilities",college.facilities],
["Other Information",college.other_info]

];

let y=doc.y;data.forEach((row)=>{

doc.rect(40,y,180,22).stroke();

doc.font("Helvetica-Bold")
.fontSize(10)
.text(row[0],45,y+6);

doc.rect(220,y,330,22).stroke();

doc.font("Helvetica")
.fontSize(10)
.text(String(row[1] ?? ""),225,y+6);

y+=22;

if(y>760){

doc.addPage();

y=40;

}

});

doc.y=y+10;

doc.moveDown();

doc.moveTo(40,doc.y)
.lineTo(550,doc.y)
.stroke();

doc.moveDown();

});

doc.end();

}

catch(err){

console.error(err);

res.status(500).send("PDF Error");

}

});
/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Email already exists?
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.json({
        success: false,
        message: "Email already registered"
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(full_name,email,password)
       VALUES($1,$2,$3)
       RETURNING *`,
      [fullName, email, hashedPassword]
    );

    res.json({
      success: true,
      message: "Registration Successful",
      user: result.rows[0]
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Email"
      });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        success: false,
        message: "Invalid Password"
      });
    }

    res.json({
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{

console.log(`✅ Server Running on Port ${PORT}`);

});