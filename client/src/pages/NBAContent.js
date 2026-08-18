import React from "react";
import "./NBAContent.css";

import {
  FaBell,
  FaChevronRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import NBASidebar from "./NBASidebar";


function NBAContent() {

  // =====================================================
  // NBA CONTENT DATA
  // =====================================================

  const rows = [

    {
      code: "PART A",
      item: "Institutional Information",
      path: "/part-a"
    },

    {
      code: "PART B",
      item: "Criteria Summary",
      path: "/part-b"
    },

    {
      section: "PROGRAM LEVEL CRITERIA"
    },

    {
      code: "Criterion 1",
      item: "Outcome-Based Curriculum",
      path: "/vision"
    },

    {
      code: "Criterion 2",
      item: "Outcome-Based Teaching Learning",
      path: "/criteria/2.1-quality-teaching-learning"
    },

    {
      code: "Criterion 3",
      item: "Outcome-Based Assessment",
      path: "/criteria/3.1"
    },

    {
      code: "Criterion 4",
      item: "Students' Performance",
      path: "/criteria/4.1"
    },

    {
      code: "Criterion 5",
      item: "Faculty Information",
      path: "/criteria5/sfr"
    },

    // =====================================================
    // CRITERION 6
    // GO TO SECTION → FACULTY DEVELOPMENT
    // =====================================================

    {
      code: "Criterion 6",
      item: "Faculty Contributions",
      path: "/criteria6/faculty-development"
    },

    {
      code: "Criterion 7",
      item: "Facilities and Technical Support",
      path: "/criteria/7.1"
    },

    {
      code: "Criterion 8",
      item: "Continuous Improvement",
      path: "/criteria/8.1"
    },

    {
      section: "INSTITUTE LEVEL CRITERIA"
    },

    {
      code: "Criterion 9",
      item: "Student Support and Governance",
      path: "/criteria/9.1"
    }

  ];


  return (

    <div className="layout">

      {/* =====================================================
          COMMON NBA SIDEBAR
      ===================================================== */}

      <NBASidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="main-content">


        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <div className="topbar">

          <div></div>

          <div className="admin">

            <FaBell className="bell" />

            <div className="avatar">
              NBA
            </div>

            <span>
              NBA Admin
            </span>

          </div>

        </div>


        {/* =====================================================
            BANNER
        ===================================================== */}

        <div className="banner">

          <div className="banner-left">

            <h1>
              NBA CONTENT
            </h1>

            <h3>
              National Board of Accreditation
            </h3>

          </div>


          <div className="banner-right">

            <div className="nba-logo">
              NBA
            </div>

          </div>

        </div>


        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="table-card">

          <table>

            <thead>

              <tr>

                <th>
                  Serial Code & Link to Item
                </th>

                <th>
                  Item
                </th>

                <th>
                  Go To Section
                </th>

              </tr>

            </thead>


            <tbody>

              {rows.map((row, index) => (

                row.section ? (

                  /* =================================================
                     SECTION HEADER
                  ================================================= */

                  <tr
                    key={index}
                    className="section"
                  >

                    <td colSpan="3">

                      {row.section}

                    </td>

                  </tr>

                ) : (

                  /* =================================================
                     NORMAL ROW
                  ================================================= */

                  <tr key={index}>

                    <td>

                      <b>
                        {row.code}
                      </b>

                    </td>


                    <td>

                      {row.item}

                    </td>


                    <td>

                      <Link to={row.path}>

                        <button
                          className="go-btn"
                          type="button"
                        >

                          Go to Section

                          <FaChevronRight />

                        </button>

                      </Link>

                    </td>

                  </tr>

                )

              ))}

            </tbody>

          </table>

        </div>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="footer">

          <h3>
            Promoting Quality and Excellence in Technical Education
          </h3>

          <p>
            © 2025 National Board of Accreditation. All Rights Reserved.
          </p>

        </div>


      </div>

    </div>

  );

}

export default NBAContent;