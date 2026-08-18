import React from "react";
import "./Criteria6.css";
import NBASidebar from "./NBASidebar";

function Criteria6() {
  return (
    <div className="criteria6-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <NBASidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="criteria6-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="criteria6-header">

          <h2>
            Criterion 6
          </h2>

          <p>
            Faculty Performance & Contributions
          </p>

        </div>


        {/* =====================================================
            FILTER SECTION
        ===================================================== */}

        <div className="criteria6-filter">

          <select defaultValue="">
            <option value="" disabled>
              Academic Year
            </option>

            <option value="2025-26">
              2025-26
            </option>

            <option value="2024-25">
              2024-25
            </option>

          </select>


          <select defaultValue="">
            <option value="" disabled>
              Department
            </option>

            <option value="MCA">
              MCA
            </option>

            <option value="CSE">
              CSE
            </option>

          </select>


          <select defaultValue="">
            <option value="" disabled>
              Semester
            </option>

            <option value="I">
              I
            </option>

            <option value="II">
              II
            </option>

          </select>

        </div>


        {/* =====================================================
            CRITERIA 6.1.1
        ===================================================== */}

        <div className="criteria-card">

          <div className="criteria-card-header">

            <div className="criteria-card-info">

              <h3>
                6.1.1 Memberships in Professional Societies at
                National / International Levels
              </h3>

              <p>
                Upload membership details and supporting documents.
              </p>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="action-buttons">

              <button
                className="view-btn"
                type="button"
              >
                👁 View
              </button>


              <button
                className="add-btn"
                type="button"
              >
                + Add
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Criteria6;