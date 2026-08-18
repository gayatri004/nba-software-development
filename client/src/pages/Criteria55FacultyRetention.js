import React, { useState } from "react";
import {
  FaInfoCircle,
  FaUsers,
  FaCalculator,
  FaTrophy,
  FaFileAlt,
  FaLightbulb,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaPrint,
  FaCloudUploadAlt,
} from "react-icons/fa";

import "./Criteria55FacultyRetention.css";
import NBASidebar from "../pages/NBASidebar";

const Criteria55FacultyRetention = () => {
  const [faculty, setFaculty] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  });

  const [file, setFile] = useState(null);

  const handleChange = (key, value) => {
    const num = Math.max(0, Number(value) || 0);

    setFaculty((prev) => ({
      ...prev,
      [key]: num,
    }));
  };

  const totalAF =
    faculty.A +
    faculty.B +
    faculty.C +
    faculty.D +
    faculty.E;

  // DS / 20
  const DS = 0;
  const RF = DS / 20;

  const weightedSum =
    faculty.A * 0 +
    faculty.B * 1 +
    faculty.C * 2 +
    faculty.D * 3 +
    faculty.E * 4;

  const FR =
    RF > 0
      ? (weightedSum / RF) * 2.5
      : 0;

  const finalScore = Math.min(10, FR);

  const percentage = (finalScore / 10) * 100;

  let grade = "Poor";

  if (finalScore >= 9) {
    grade = "Excellent";
  } else if (finalScore >= 7) {
    grade = "Very Good";
  } else if (finalScore >= 5) {
    grade = "Good";
  } else if (finalScore >= 3) {
    grade = "Average";
  }

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setFaculty({
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    });

    setFile(null);
  };

  const rows = [
    {
      key: "A",
      title: "Less than 1 year",
      description:
        "No. of faculty members with less than 1 year of experience",
    },
    {
      key: "B",
      title: "More than 1 year and less than 2 years",
      description:
        "No. of faculty members with more than 1 year and less than 2 years of experience",
    },
    {
      key: "C",
      title: "More than 2 years and less than 3 years",
      description:
        "No. of faculty members with more than 2 years and less than 3 years of experience",
    },
    {
      key: "D",
      title: "More than 3 years and less than 4 years",
      description:
        "No. of faculty members with more than 3 years and less than 4 years of experience",
    },
    {
      key: "E",
      title: "More than 4 years",
      description:
        "No. of faculty members with more than 4 years of experience",
    },
  ];

  return (
    <div className="criteria55-page">

      {/* =====================================================
          NBA SIDEBAR
      ===================================================== */}

      <NBASidebar />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="criteria55-header">

        <div className="criteria55-number">
          5.5
        </div>

        <div className="criteria55-title">
          <h1>Faculty Retention</h1>
          <p>Evaluation as per NBA SAR Guidelines</p>
        </div>

        <div className="criteria55-max">
          <span>Maximum Marks</span>
          <strong>10</strong>
        </div>

      </div>


      {/* =====================================================
          FORMULA + GUIDELINES
      ===================================================== */}

      <div className="criteria55-info">

        <div className="criteria55-formula">

          <div className="criteria55-section-title">
            <FaInfoCircle />
            <span>Formula</span>
          </div>

          <div className="criteria55-formula-text">
            FR = (((A*0) + (B*1) + (C*2) + (D*3) + (E*4))/RF) * 2.50
          </div>

          <div className="criteria55-red-text">
            (Points limited to 10)
          </div>

        </div>


        <div className="criteria55-guidelines">

          <div className="criteria55-bullet">
            ❖ RF = No. of required faculty in the Department to adhere to the
            20:1 Student-Faculty ratio, with calculations based on both student
            numbers and faculty requirements as per section 5.1 of SAR;
            (RF = DS/20).
          </div>

          <div className="criteria55-bullet">
            ❖ AF = The no. of available faculty members in the Department.
          </div>

          <div className="criteria55-bullet">
            ❖ The programs, such as <b>MCA, BCA, Diploma (Engineering)</b>, and
            other non-engineering programs running in the Department, need to
            have sufficient faculty members to support them and exclude the
            faculty members listed in Table No. 5.5.1 (AF).
          </div>

          <div className="criteria55-bullet">
            ❖ A = The no. of faculty members at the current institute with less
            than 1 year of experience (A in AF)
          </div>

          <div className="criteria55-bullet">
            ❖ B = The no. of faculty members at the current institute with more
            than 1 year and less than 2 years of experience (B in AF)
          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN TWO COLUMN AREA
      ===================================================== */}

      <div className="criteria55-main-grid">


        {/* =================================================
            FACULTY DATA
        ================================================= */}

        <div className="criteria55-card">

          <div className="criteria55-card-heading">
            <FaUsers />

            <span>
              Faculty Data <small>(At Current Institute)</small>
            </span>
          </div>


          <div className="criteria55-table">

            <div className="criteria55-table-head">
              <div>Experience (Years)</div>
              <div>Description</div>
              <div>No. of Faculty (AF)</div>
            </div>


            {rows.map((row) => (

              <div
                className="criteria55-table-row"
                key={row.key}
              >

                <div className="criteria55-experience">

                  <span
                    className={`criteria55-letter criteria55-${row.key}`}
                  >
                    {row.key}
                  </span>

                  <span>
                    {row.title}
                  </span>

                </div>


                <div className="criteria55-description">
                  {row.description}
                </div>


                <div className="criteria55-input-box">

                  <input
                    type="number"
                    min="0"
                    value={faculty[row.key]}
                    onChange={(e) =>
                      handleChange(row.key, e.target.value)
                    }
                  />

                </div>

              </div>

            ))}


            <div className="criteria55-total-row">

              <strong>
                Total Available Faculty (AF) = A + B + C + D + E
              </strong>

              <input
                type="text"
                value={totalAF}
                readOnly
              />

            </div>


            <div className="criteria55-rf-row">

              <span>
                Required Faculty (RF = DS / 20)
              </span>

              <input
                type="text"
                value={RF}
                readOnly
              />

            </div>

          </div>

        </div>


        {/* =================================================
            CALCULATION
        ================================================= */}

        <div className="criteria55-right-column">

          <div className="criteria55-card">

            <div className="criteria55-card-heading">
              <FaCalculator />
              <span>Calculation &amp; Results</span>
            </div>


            <div className="criteria55-calculation">

              {[
                ["A", "Less than 1 year", 0],
                ["B", "More than 1 year and less than 2 years", 1],
                ["C", "More than 2 years and less than 3 years", 2],
                ["D", "More than 3 years and less than 4 years", 3],
                ["E", "More than 4 years", 4],
              ].map(([key, label, multiplier]) => (

                <div
                  className="criteria55-calc-row"
                  key={key}
                >

                  <span>
                    {key} ({label})
                  </span>

                  <strong>
                    {faculty[key]}
                  </strong>

                  <span>
                    ×
                  </span>

                  <strong>
                    {multiplier}
                  </strong>

                  <span>
                    =
                  </span>

                  <strong>
                    {faculty[key] * multiplier}
                  </strong>

                </div>

              ))}


              <div className="criteria55-calc-total">

                <span>
                  Total Weighted Sum (A*0 + B*1 + C*2 + D*3 + E*4)
                </span>

                <strong>
                  {weightedSum}
                </strong>

              </div>


              <div className="criteria55-fr-row">

                <span>
                  Faculty Retention Score (FR)
                </span>

                <span>
                  ({weightedSum} / {RF}) × 2.50
                </span>

                <strong>
                  {FR.toFixed(2)}
                </strong>

              </div>

            </div>


            <div className="criteria55-final-score">

              <div>
                <FaTrophy />
                <span>
                  Final Score (Points Limited to 10)
                </span>
              </div>

              <strong>
                {finalScore.toFixed(2)} / 10
              </strong>

            </div>

          </div>


          {/* =================================================
              EXHIBITS
          ================================================= */}

          <div className="criteria55-card criteria55-exhibit">

            <div className="criteria55-card-heading">

              <FaFileAlt />

              <span>
                Exhibits / Context to be Observed / Assessed
              </span>

            </div>

            <ul>

              <li>
                Documentary evidence.
              </li>

            </ul>

          </div>

        </div>

      </div>


      {/* =====================================================
          IMPORTANT NOTES
      ===================================================== */}

      <div className="criteria55-notes">

        <div className="criteria55-notes-title">
          <FaLightbulb />
          <span>Important Notes</span>
        </div>


        <div className="criteria55-notes-grid">

          <div>

            <ul>

              <li>
                RF = No. of required faculty in the Department to adhere to the
                20:1 Student-Faculty ratio, with calculations based on both
                student numbers and faculty requirements as per section 5.1 of
                SAR; (RF = DS/20).
              </li>

              <li>
                AF = The no. of available faculty members in the Department.
              </li>

              <li>
                The programs, such as MCA, BCA, Diploma (Engineering), and
                other non-engineering programs running in the Department, need
                to have sufficient faculty members to support them and exclude
                the faculty members listed in Table No. 5.5.1 (AF).
              </li>

            </ul>

          </div>


          <div>

            <ul>

              <li>
                A = The no. of faculty members at the current institute with
                less than 1 year of experience (A in AF)
              </li>

              <li>
                B = The no. of faculty members at the current institute with
                more than 1 year and less than 2 years of experience (B in AF)
              </li>

              <li>
                C = The no. of faculty members at the current institute with
                more than 2 years and less than 3 years of experience (C in AF)
              </li>

              <li>
                D = The no. of faculty members at the current institute with
                more than 3 years and less than 4 years of experience (D in AF)
              </li>

              <li>
                E = The no. of faculty members at the current institute with
                more than 4 years of experience (E in AF)
              </li>

            </ul>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM THREE CARDS
      ===================================================== */}

      <div className="criteria55-bottom-grid">


        {/* =================================================
            NBA CALCULATION
        ================================================= */}

        <div className="criteria55-bottom-card">

          <div className="criteria55-bottom-header blue">
            <FaCalculator />
            NBA Calculation
          </div>


          <div className="criteria55-nba-table">

            <div>
              <span>
                A (&lt; 1 year)
              </span>

              <strong>
                {faculty.A}
              </strong>
            </div>


            <div>
              <span>
                B (&gt; 1 &amp; &lt; 2 years)
              </span>

              <strong>
                {faculty.B}
              </strong>
            </div>


            <div>
              <span>
                C (&gt; 2 &amp; &lt; 3 years)
              </span>

              <strong>
                {faculty.C}
              </strong>
            </div>


            <div>
              <span>
                D (&gt; 3 &amp; &lt; 4 years)
              </span>

              <strong>
                {faculty.D}
              </strong>
            </div>


            <div>
              <span>
                E (&gt; 4 years)
              </span>

              <strong>
                {faculty.E}
              </strong>
            </div>


            <div>
              <span>
                RF (DS/20)
              </span>

              <strong className="blue-text">
                {RF}
              </strong>
            </div>

          </div>


          <div className="criteria55-small-formula">

            <strong>
              FR Formula
            </strong>

            <p>
              (((A*0) + (B*1) + (C*2) + (D*3) + (E*4))/RF) * 2.50
            </p>

          </div>


          <div className="criteria55-total-marks">

            <span>
              Total Marks
            </span>

            <strong>
              {finalScore.toFixed(2)}
              <small> / 10</small>
            </strong>

          </div>

        </div>


        {/* =================================================
            NBA EVALUATION
        ================================================= */}

        <div className="criteria55-bottom-card">

          <div className="criteria55-bottom-header green">

            <FaTrophy />

            NBA Evaluation

          </div>


          <div className="criteria55-evaluation">

            <div>

              <span>
                Maximum Marks
              </span>

              <strong>
                10
              </strong>

            </div>


            <div>

              <span>
                Obtained Marks
              </span>

              <strong className="red-text">
                {finalScore.toFixed(2)} / 10
              </strong>

            </div>


            <div>

              <span>
                Percentage
              </span>

              <strong className="blue-text">
                {percentage.toFixed(2)}%
              </strong>

            </div>


            <div>

              <span>
                Grade
              </span>

              <strong className="grade-pill">
                {grade}
              </strong>

            </div>

          </div>


          <div className="criteria55-grade-table">

            <div className="grade-head">

              <span>
                Marks Range
              </span>

              <span>
                Grade
              </span>

            </div>


            <div>

              <span>
                9 - 10
              </span>

              <strong>
                Excellent
              </strong>

            </div>


            <div>

              <span>
                7 - 8.99
              </span>

              <strong>
                Very Good
              </strong>

            </div>


            <div>

              <span>
                5 - 6.99
              </span>

              <strong>
                Good
              </strong>

            </div>


            <div>

              <span>
                3 - 4.99
              </span>

              <strong>
                Average
              </strong>

            </div>


            <div>

              <span>
                0 - 2.99
              </span>

              <strong>
                Poor
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            SUPPORTING DOCUMENT
        ================================================= */}

        <div className="criteria55-bottom-card">

          <div className="criteria55-bottom-header purple">

            <FaFileAlt />

            Supporting Document

          </div>


          <div className="criteria55-upload">

            <label
              htmlFor="supportingFile"
              className="criteria55-upload-box"
            >

              <FaCloudUploadAlt />

              <span>
                {file
                  ? file.name
                  : "No File Uploaded"}
              </span>

            </label>


            <input
              id="supportingFile"
              type="file"
              onChange={handleFile}
              hidden
            />


            <label
              htmlFor="supportingFile"
              className="criteria55-upload-button"
            >
              Upload Supporting Document
            </label>


            <div className="criteria55-upload-note">

              <strong>
                Note :
              </strong>

              <p>
                Kindly upload relevant supporting documents as evidence.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM ACTION BUTTONS
      ===================================================== */}

      <div className="criteria55-actions">

        <button className="previous">

          <FaChevronLeft />

          Previous

        </button>


        <button className="save">

          <FaSave />

          Save

        </button>


        <button className="update">

          <FaEdit />

          Update

        </button>


        <button className="delete">

          <FaTrash />

          Delete

        </button>


        <button
          className="clear"
          onClick={handleClear}
        >

          <FaSyncAlt />

          Clear

        </button>


        <button
          className="print"
          onClick={handlePrint}
        >

          <FaPrint />

          Print

        </button>


        <button className="next">

          Next

          <FaChevronRight />

        </button>

      </div>

    </div>
  );
};

export default Criteria55FacultyRetention;