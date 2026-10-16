import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaInfoCircle,
  FaUsers,
  FaCalculator,
  FaFileAlt,
  FaLightbulb,
  FaSave,
  FaEdit,
  FaTrash,
  FaPrint,
  FaUpload,
  FaArrowLeft,
  FaArrowRight,
  FaSyncAlt,
} from "react-icons/fa";

import "./Criteria55FacultyRetention.css";

function Criteria55FacultyRetention() {

  const navigate = useNavigate();
  const fileRef = useRef(null);

  /* =========================
      STATES
  ========================= */

  const [recordId, setRecordId] = useState(null);

  const [students, setStudents] = useState(0);

  const [faculty, setFaculty] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  });

  const [documentName, setDocumentName] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(false);

  /* =========================
      FETCH STUDENTS FROM SFR
  ========================= */

  const fetchStudents = async () => {

    try {

      setLoadingStudents(true);

      const res = await axios.get(
        "http://localhost:5000/api/criteria5/sfr/latest"
      );

      const value = Number(res.data.students) || 0;

      setStudents(value);

    } catch (err) {

      console.log("SFR Fetch Error:", err);

      setStudents(0);

    } finally {

      setLoadingStudents(false);

    }

  };

  useEffect(() => {

    fetchStudents();

  }, []);

  /* =========================
      FACULTY CHANGE
  ========================= */

  const handleFacultyChange = (category, value) => {

    const numberValue = Math.max(
      0,
      Number(value) || 0
    );

    setFaculty((prev) => ({
      ...prev,
      [category]: numberValue,
    }));

  };

  /* =========================
      CALCULATIONS
  ========================= */

  const A = Number(faculty.A) || 0;
  const B = Number(faculty.B) || 0;
  const C = Number(faculty.C) || 0;
  const D = Number(faculty.D) || 0;
  const E = Number(faculty.E) || 0;

  const availableFaculty =
    A + B + C + D + E;

  /* RF = DS / 20 */

  const requiredFaculty =
    students > 0
      ? students / 20
      : 0;

  /* Weighted calculations */

  const weightedA = A * 0;
  const weightedB = B * 1;
  const weightedC = C * 2;
  const weightedD = D * 3;
  const weightedE = E * 4;

  const totalWeighted =
    weightedA +
    weightedB +
    weightedC +
    weightedD +
    weightedE;

  /* FR Formula */

  let facultyRetentionScore = 0;

  if (requiredFaculty > 0) {

    facultyRetentionScore =
      (totalWeighted / requiredFaculty) * 2.5;

  }

  if (facultyRetentionScore > 10) {
    facultyRetentionScore = 10;
  }

  if (facultyRetentionScore < 0) {
    facultyRetentionScore = 0;
  }

  const finalMarks = facultyRetentionScore;

  const percentage =
    ((finalMarks / 10) * 100).toFixed(2);

  /* =========================
      GRADE
  ========================= */

  let grade = "Poor";

  if (finalMarks >= 9) {

    grade = "Excellent";

  } else if (finalMarks >= 7) {

    grade = "Very Good";

  } else if (finalMarks >= 5) {

    grade = "Good";

  } else if (finalMarks >= 3) {

    grade = "Average";

  } else {

    grade = "Poor";

  }

  /* =========================
      SAVE
  ========================= */

  const handleSave = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/criteria55",
        {
          A,
          B,
          C,
          D,
          E,
          students,
          af: availableFaculty,
          rf: requiredFaculty,
          weighted_sum: totalWeighted,
          fr_score: facultyRetentionScore,
          final_marks: finalMarks,
        }
      );

      setRecordId(res.data.id);

      alert("Faculty Retention Saved Successfully");

    } catch (err) {

      console.log("Save Error:", err);

      alert(
        err.response?.data?.error ||
        "Save Failed"
      );

    }

  };

  /* =========================
      UPDATE
  ========================= */

  const handleUpdate = async () => {

    if (!recordId) {

      alert("Please Save Record First");

      return;

    }

    try {

      await axios.put(
        `http://localhost:5000/api/criteria55/${recordId}`,
        {
          A,
          B,
          C,
          D,
          E,
          students,
          af: availableFaculty,
          rf: requiredFaculty,
          weighted_sum: totalWeighted,
          fr_score: facultyRetentionScore,
          final_marks: finalMarks,
        }
      );

      alert("Updated Successfully");

    } catch (err) {

      console.log("Update Error:", err);

      alert(
        err.response?.data?.error ||
        "Update Failed"
      );

    }

  };

  /* =========================
      DELETE
  ========================= */

  const handleDelete = async () => {

    if (!recordId) {

      alert("No Record Selected");

      return;

    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/criteria55/${recordId}`
      );

      handleClear();

      alert("Deleted Successfully");

    } catch (err) {

      console.log("Delete Error:", err);

      alert(
        err.response?.data?.error ||
        "Delete Failed"
      );

    }

  };

  /* =========================
      VIEW / LOAD LATEST
  ========================= */

  const handleView = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/criteria55"
      );

      if (
        !res.data ||
        res.data.length === 0
      ) {

        alert("No Faculty Retention Record Found");

        return;

      }

      const row = res.data[0];

      setRecordId(row.id);

      setFaculty({
        A: Number(row.a) || 0,
        B: Number(row.b) || 0,
        C: Number(row.c) || 0,
        D: Number(row.d) || 0,
        E: Number(row.e) || 0,
      });

      setStudents(
        Number(row.students) || 0
      );

      setDocumentName(
        row.document || ""
      );

      alert("Latest Record Loaded");

    } catch (err) {

      console.log("View Error:", err);

      alert("Unable to load record");

    }

  };

  /* =========================
      DOCUMENT UPLOAD
  ========================= */

  const handleUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (!recordId) {

      alert(
        "Please Save Faculty Retention Record First"
      );

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      return;

    }

    setDocumentName(file.name);

    try {

      const formData = new FormData();

      formData.append(
        "document",
        file
      );

      formData.append(
        "id",
        recordId
      );

      const res = await axios.post(
        "http://localhost:5000/api/criteria55/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      if (res.data?.data?.document) {

        setDocumentName(
          res.data.data.document
        );

      }

      alert("Document Uploaded Successfully");

    } catch (err) {

      console.log(
        "Upload Error:",
        err
      );

      alert(
        err.response?.data?.error ||
        "Document Upload Failed"
      );

    }

  };

  /* =========================
      CLEAR
  ========================= */

  const handleClear = () => {

    setRecordId(null);

    setFaculty({
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    });

    setDocumentName("");

    if (fileRef.current) {

      fileRef.current.value = "";

    }

    fetchStudents();

  };

  /* =========================
      PRINT
  ========================= */

  const handlePrint = () => {

    window.print();

  };

  /* =========================
      NAVIGATION
  ========================= */

  const handlePrevious = () => {

    navigate("/criteria5/visiting-faculty");

  };

  const handleNext = () => {

    navigate("/criteria6");

  };

  /* =========================
      RENDER
  ========================= */

  return (

    <div className="criteria55-page">

      <div className="criteria55-container">

        {/* ================= HEADER ================= */}

        <div className="criteria55-header">

          <div className="criteria55-number">
            5.5
          </div>

          <div className="criteria55-title">

            <h1>
              Faculty Retention
            </h1>

            <p>
              Evaluation as per NBA SAR Guidelines
            </p>

          </div>

          <div className="criteria55-maxmarks">

            <span>
              Maximum Marks
            </span>

            <strong>
              10
            </strong>

          </div>

        </div>


        {/* ================= FORMULA ================= */}

        <div className="criteria55-formula-card">

          <div className="formula-box">

            <div className="section-icon">
              <FaCalculator />
            </div>

            <h3>
              Formula
            </h3>

            <div className="formula-text">

              FR = (((A×0) + (B×1) + (C×2)
              + (D×3) + (E×4)) / RF) × 2.50

            </div>

            <strong className="formula-warning">
              (Points limited to 10)
            </strong>

          </div>

          <div className="formula-guidelines">

            <p>
              ❖ <b>RF</b> = No. of required faculty in
              the Department to adhere to the 20:1
              Student-Faculty ratio, with calculations
              based on both student numbers and faculty
              requirements as per section 5.1 of SAR;
              (RF = DS/20).
            </p>

            <p>
              ❖ <b>AF</b> = The no. of available faculty
              members in the Department.
            </p>

            <p>
              ❖ The programs, such as
              <b> MCA, BCA, Diploma (Engineering)</b>,
              and other non-engineering programs running
              in the Department, need to have sufficient
              faculty members to support them.
            </p>

            <p>
              ❖ <b>A</b> = Faculty members with less than
              1 year of experience.
            </p>

            <p>
              ❖ <b>B</b> = Faculty members with more than
              1 year and less than 2 years of experience.
            </p>

          </div>

        </div>


        {/* ================= MAIN TWO COLUMN ================= */}

        <div className="criteria55-main-grid">


          {/* ================= FACULTY DATA ================= */}

          <div className="faculty-data-card">

            <div className="card-heading">

              <FaUsers />

              <span>
                Faculty Data
              </span>

              <small>
                (At Current Institute)
              </small>

            </div>


            <table className="faculty-table">

              <thead>

                <tr>

                  <th>
                    Experience (Years)
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    No. of Faculty (AF)
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td>

                    <div className="experience-cell">

                      <span className="letter a">
                        A
                      </span>

                      <b>
                        Less than 1 year
                      </b>

                    </div>

                  </td>

                  <td>
                    No. of faculty members with
                    less than 1 year of experience
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      value={A}
                      onChange={(e) =>
                        handleFacultyChange(
                          "A",
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>


                <tr>

                  <td>

                    <div className="experience-cell">

                      <span className="letter b">
                        B
                      </span>

                      <b>
                        More than 1 year
                        <br />
                        and less than 2 years
                      </b>

                    </div>

                  </td>

                  <td>
                    No. of faculty members with
                    more than 1 year and less than
                    2 years of experience
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      value={B}
                      onChange={(e) =>
                        handleFacultyChange(
                          "B",
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>


                <tr>

                  <td>

                    <div className="experience-cell">

                      <span className="letter c">
                        C
                      </span>

                      <b>
                        More than 2 years
                        <br />
                        and less than 3 years
                      </b>

                    </div>

                  </td>

                  <td>
                    No. of faculty members with
                    more than 2 years and less than
                    3 years of experience
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      value={C}
                      onChange={(e) =>
                        handleFacultyChange(
                          "C",
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>


                <tr>

                  <td>

                    <div className="experience-cell">

                      <span className="letter d">
                        D
                      </span>

                      <b>
                        More than 3 years
                        <br />
                        and less than 4 years
                      </b>

                    </div>

                  </td>

                  <td>
                    No. of faculty members with
                    more than 3 years and less than
                    4 years of experience
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      value={D}
                      onChange={(e) =>
                        handleFacultyChange(
                          "D",
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>


                <tr>

                  <td>

                    <div className="experience-cell">

                      <span className="letter e">
                        E
                      </span>

                      <b>
                        More than 4 years
                      </b>

                    </div>

                  </td>

                  <td>
                    No. of faculty members with
                    more than 4 years of experience
                  </td>

                  <td>

                    <input
                      type="number"
                      min="0"
                      value={E}
                      onChange={(e) =>
                        handleFacultyChange(
                          "E",
                          e.target.value
                        )
                      }
                    />

                  </td>

                </tr>

              </tbody>

            </table>


            {/* AF */}

            <div className="calculation-input-row">

              <div>

                <b>
                  Total Available Faculty (AF)
                </b>

                <span>
                  = A + B + C + D + E
                </span>

              </div>

              <strong>
                {availableFaculty}
              </strong>

            </div>


            {/* STUDENTS */}

            <div className="calculation-input-row">

              <div>

                <b>
                  Student Count (DS)
                </b>

                <span>
                  From Criteria 5.1 SFR
                </span>

              </div>

              <strong>
                {loadingStudents
                  ? "Loading..."
                  : students}
              </strong>

            </div>


            {/* RF */}

            <div className="calculation-input-row rf-row">

              <div>

                <b>
                  Required Faculty (RF)
                </b>

                <span>
                  = DS / 20
                </span>

              </div>

              <strong>
                {requiredFaculty.toFixed(2)}
              </strong>

            </div>

          </div>


          {/* ================= CALCULATION ================= */}

          <div className="calculation-card">

            <div className="card-heading">

              <FaCalculator />

              <span>
                Calculation & Results
              </span>

            </div>


            <div className="weighted-list">

              <div className="weighted-row">

                <span>
                  A (Less than 1 year)
                </span>

                <b>{A}</b>

                <span>×</span>

                <b>0</b>

                <span>=</span>

                <strong>
                  {weightedA}
                </strong>

              </div>


              <div className="weighted-row">

                <span>
                  B (More than 1 year and less than 2 years)
                </span>

                <b>{B}</b>

                <span>×</span>

                <b>1</b>

                <span>=</span>

                <strong>
                  {weightedB}
                </strong>

              </div>


              <div className="weighted-row">

                <span>
                  C (More than 2 years and less than 3 years)
                </span>

                <b>{C}</b>

                <span>×</span>

                <b>2</b>

                <span>=</span>

                <strong>
                  {weightedC}
                </strong>

              </div>


              <div className="weighted-row">

                <span>
                  D (More than 3 years and less than 4 years)
                </span>

                <b>{D}</b>

                <span>×</span>

                <b>3</b>

                <span>=</span>

                <strong>
                  {weightedD}
                </strong>

              </div>


              <div className="weighted-row">

                <span>
                  E (More than 4 years)
                </span>

                <b>{E}</b>

                <span>×</span>

                <b>4</b>

                <span>=</span>

                <strong>
                  {weightedE}
                </strong>

              </div>

            </div>


            <div className="result-row">

              <span>
                Total Weighted Sum
                (A×0 + B×1 + C×2 + D×3 + E×4)
              </span>

              <strong>
                {totalWeighted}
              </strong>

            </div>


            <div className="result-row">

              <span>
                Faculty Retention Score (FR)
              </span>

              <strong className="green-result">

                {requiredFaculty > 0
                  ? `(${totalWeighted} / ${requiredFaculty.toFixed(2)}) × 2.50`
                  : "0.00"}

                <br />

                {facultyRetentionScore.toFixed(2)}

              </strong>

            </div>


            {/* FINAL SCORE */}

            <div className="final-score">

              <div>

                <FaCalculator />

                <span>
                  Final Score
                </span>

                <small>
                  (Points Limited to 10)
                </small>

              </div>

              <strong>
                {finalMarks.toFixed(2)} / 10
              </strong>

            </div>


            {/* EXHIBITS */}

            <div className="exhibits-card">

              <div className="exhibits-heading">

                <FaFileAlt />

                <b>
                  Exhibits / Context to be Observed / Assessed
                </b>

              </div>

              <ul>

                <li>
                  Documentary evidence.
                </li>

              </ul>

            </div>

          </div>

        </div>


        {/* ================= IMPORTANT NOTES ================= */}

        <div className="important-notes">

          <div className="notes-title">

            <FaLightbulb />

            <b>
              Important Notes
            </b>

          </div>

          <div className="notes-grid">

            <div>

              <p>
                ❖ RF = No. of required faculty in the
                Department to adhere to the 20:1
                Student-Faculty ratio.
              </p>

              <p>
                ❖ AF = No. of available faculty members
                in the Department.
              </p>

              <p>
                ❖ Programs such as MCA, BCA, Diploma
                (Engineering) and other non-engineering
                programs need sufficient faculty members.
              </p>

            </div>

            <div>

              <p>
                ❖ A = Faculty members with less than
                1 year experience.
              </p>

              <p>
                ❖ B = Faculty members with more than
                1 year and less than 2 years.
              </p>

              <p>
                ❖ C = Faculty members with more than
                2 years and less than 3 years.
              </p>

              <p>
                ❖ D = Faculty members with more than
                3 years and less than 4 years.
              </p>

              <p>
                ❖ E = Faculty members with more than
                4 years experience.
              </p>

            </div>

          </div>

        </div>


        {/* ================= BOTTOM CARDS ================= */}

        <div className="bottom-cards">


          {/* NBA CALCULATION */}

          <div className="nba-calc-card">

            <div className="bottom-card-header blue">

              <FaCalculator />

              <span>
                NBA Calculation
              </span>

            </div>

            <div className="nba-line">
              <span>A (&lt; 1 year)</span>
              <b>{A}</b>
            </div>

            <div className="nba-line">
              <span>B (&gt; 1 &amp; &lt; 2 years)</span>
              <b>{B}</b>
            </div>

            <div className="nba-line">
              <span>C (&gt; 2 &amp; &lt; 3 years)</span>
              <b>{C}</b>
            </div>

            <div className="nba-line">
              <span>D (&gt; 3 &amp; &lt; 4 years)</span>
              <b>{D}</b>
            </div>

            <div className="nba-line">
              <span>E (&gt; 4 years)</span>
              <b>{E}</b>
            </div>

            <div className="nba-line">
              <span>RF (DS/20)</span>
              <b className="blue-text">
                {requiredFaculty.toFixed(2)}
              </b>
            </div>

            <div className="fr-formula">

              <b>
                FR Formula
              </b>

              <p>
                (((A×0)+(B×1)+(C×2)+(D×3)+(E×4))
                /RF) × 2.50
              </p>

            </div>

            <div className="total-marks">

              <span>
                Total Marks
              </span>

              <strong>
                {finalMarks.toFixed(2)} / 10
              </strong>

            </div>

          </div>


          {/* NBA EVALUATION */}

          <div className="evaluation-card">

            <div className="bottom-card-header green">

              <FaCalculator />

              <span>
                NBA Evaluation
              </span>

            </div>

            <div className="evaluation-line">

              <span>
                Maximum Marks
              </span>

              <b>
                10
              </b>

            </div>

            <div className="evaluation-line">

              <span>
                Obtained Marks
              </span>

              <b className="red-text">
                {finalMarks.toFixed(2)} / 10
              </b>

            </div>

            <div className="evaluation-line">

              <span>
                Percentage
              </span>

              <b className="blue-text">
                {percentage}%
              </b>

            </div>

            <div className="evaluation-line">

              <span>
                Grade
              </span>

              <strong
                className={`grade ${grade
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {grade}
              </strong>

            </div>


            <table className="grade-table">

              <thead>

                <tr>

                  <th>
                    Marks Range
                  </th>

                  <th>
                    Grade
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>9 - 10</td>
                  <td className="excellent">
                    Excellent
                  </td>
                </tr>

                <tr>
                  <td>7 - 8.99</td>
                  <td className="very-good">
                    Very Good
                  </td>
                </tr>

                <tr>
                  <td>5 - 6.99</td>
                  <td className="good">
                    Good
                  </td>
                </tr>

                <tr>
                  <td>3 - 4.99</td>
                  <td className="average">
                    Average
                  </td>
                </tr>

                <tr>
                  <td>0 - 2.99</td>
                  <td className="poor">
                    Poor
                  </td>
                </tr>

              </tbody>

            </table>

          </div>


          {/* DOCUMENT */}

          <div className="document-card">

            <div className="bottom-card-header purple">

              <FaFileAlt />

              <span>
                Supporting Document
              </span>

            </div>

            <div className="upload-area">

              <FaUpload />

              <p>
                {documentName ||
                  "No File Uploaded"}
              </p>

            </div>

            <button
              className="upload-button"
              onClick={() =>
                fileRef.current.click()
              }
            >

              <FaUpload />

              Upload Supporting Document

            </button>

            <input
              type="file"
              hidden
              ref={fileRef}
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
            />

            <div className="document-note">

              <b>
                Note :
              </b>

              <p>
                Kindly upload relevant supporting
                documents as evidence.
              </p>

            </div>

          </div>

        </div>


        {/* ================= BUTTONS ================= */}

        <div className="bottom-actions">

          <button
            className="action previous"
            onClick={handlePrevious}
          >

            <FaArrowLeft />

            Previous

          </button>


          <button
            className="action save"
            onClick={handleSave}
          >

            <FaSave />

            Save

          </button>


          <button
            className="action update"
            onClick={handleUpdate}
          >

            <FaEdit />

            Update

          </button>


          <button
            className="action delete"
            onClick={handleDelete}
          >

            <FaTrash />

            Delete

          </button>


          <button
            className="action clear"
            onClick={handleClear}
          >

            <FaSyncAlt />

            Clear

          </button>


          <button
            className="action print"
            onClick={handlePrint}
          >

            <FaPrint />

            Print

          </button>


          <button
            className="action next"
            onClick={handleNext}
          >

            Next

            <FaArrowRight />

          </button>

        </div>


        {/* VIEW BUTTON */}

        <button
          className="hidden-view-button"
          onClick={handleView}
        >
          Load Saved Record
        </button>

      </div>

    </div>

  );

}

export default Criteria55FacultyRetention;