import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaPlus,
  FaEye,
  FaTrash,
  FaInfoCircle,
  FaUsers,
} from "react-icons/fa";

import "./Criteria54VisitingFaculty.css";
import NBASidebar from "../pages/NBASidebar";

function Criteria54VisitingFaculty() {

  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [criteriaId, setCriteriaId] = useState(null);
  const [documentName, setDocumentName] = useState("");

  const [rows, setRows] = useState([
    {
      id: 1,
      name: "",
      category: "Visiting Faculty",
      organization: "",
      designation: "",
      hours: 0,
    },
  ]);

  /* ==============================
      TABLE FUNCTIONS
  ============================== */

  const handleChange = (index, field, value) => {

    const data = [...rows];

    data[index][field] =
      field === "hours"
        ? Number(value) || 0
        : value;

    setRows(data);
  };

  const addRow = () => {

    setRows([
      ...rows,
      {
        id: rows.length + 1,
        name: "",
        category: "Visiting Faculty",
        organization: "",
        designation: "",
        hours: 0,
      },
    ]);

  };

  const deleteRow = (index) => {

    const data = [...rows];

    data.splice(index, 1);

    setRows(data);
  };

  /* ==============================
        NBA CALCULATION
  ============================== */

  const totalHours = rows.reduce(
    (sum, row) =>
      sum + Number(row.hours || 0),
    0
  );

  const facultyAvailable = rows.some(
    (row) => row.name.trim() !== ""
  );

  const provisionMarks =
    facultyAvailable ? 1 : 0;

  let hoursMarks = 0;

  if (totalHours >= 50) {

    hoursMarks = 9;

  } else {

    hoursMarks =
      (totalHours / 50) * 9;

  }

  let totalMarks =
    provisionMarks + hoursMarks;

  if (totalMarks > 10)
    totalMarks = 10;

  const percentage = (
    (totalMarks / 10) * 100
  ).toFixed(2);

  let status = "Poor";

  if (totalMarks >= 9)
    status = "Excellent";

  else if (totalMarks >= 7)
    status = "Very Good";

  else if (totalMarks >= 5)
    status = "Good";

  else if (totalMarks >= 3)
    status = "Average";


  /* ==============================
          DOCUMENT
  ============================== */

  const handleUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setDocumentName(file.name);

    if (!criteriaId) {

      alert("First Save Record");

      return;

    }

    const formData = new FormData();

    formData.append(
      "document",
      file
    );

    formData.append(
      "id",
      criteriaId
    );

    try {

      await axios.post(
        "http://localhost:5000/api/criteria54/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Document Uploaded");

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
          VIEW
  ============================== */

  const handleView = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/criteria54"
      );

      console.log(res.data);

      if (res.data.length > 0) {

        const data = res.data[0];

        setCriteriaId(data.id);

        setRows(data.faculty_data);

        setDocumentName(
          data.document || ""
        );

      }

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
          SAVE
  ============================== */

  const handleSave = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/criteria54",
        {
          rows,
          totalHours,
          totalMarks,
        }
      );

      console.log(
        "Save Response :",
        res.data
      );

      setCriteriaId(res.data.id);

      console.log(
        "Criteria ID :",
        res.data.id
      );

      alert("Saved Successfully");

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
          UPDATE
  ============================== */

  const handleUpdate = async () => {

    if (!criteriaId) {

      alert("Save First");

      return;

    }

    try {

      await axios.put(
        `http://localhost:5000/api/criteria54/${criteriaId}`,
        {
          rows,
          totalHours,
          totalMarks,
        }
      );

      alert("Updated Successfully");

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
          DELETE
  ============================== */

  const handleDelete = async () => {

    if (!criteriaId) {

      alert("No Record Found");

      return;

    }

    try {

      await axios.delete(
        `http://localhost:5000/api/criteria54/${criteriaId}`
      );

      setCriteriaId(null);

      setRows([
        {
          id: 1,
          name: "",
          category: "Visiting Faculty",
          organization: "",
          designation: "",
          hours: 0,
        },
      ]);

      alert("Deleted Successfully");

    } catch (err) {

      console.log(err);

    }

  };


  /* ==============================
          CLEAR
  ============================== */

  const handleClear = () => {

    setCriteriaId(null);

    setDocumentName("");

    if (fileRef.current) {

      fileRef.current.value = "";

    }

    setRows([
      {
        id: 1,
        name: "",
        category: "Visiting Faculty",
        organization: "",
        designation: "",
        hours: 0,
      },
    ]);

  };


  /* ==============================
          PRINT
  ============================== */

  const handlePrint = () => {

    window.print();

  };


  /* ==============================
        NAVIGATION
  ============================== */

  const handlePrevious = () => {

    navigate("/criteria5/cadre");

  };

  const handleNext = () => {

    navigate(
      "/criteria5/faculty-retention"
    );

  };


  /* ==============================
          RETURN
  ============================== */

  return (

    <div className="criteria54-layout">

      {/* ================= SIDEBAR ================= */}

      <NBASidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="criteria54-content">

        <div className="criteria54-page">

          <div className="main-card">

            {/* ================= HEADER ================= */}

            <div className="criteria54-header">

              <div className="title-circle">
                5.4
              </div>

              <div className="header-content">

                <h2>
                  Visiting / Adjunct Faculty / Professor of Practice
                </h2>

                <p>
                  Professor of Practice / Industry Experts
                </p>

              </div>

              <div className="marks-box">

                <span>
                  Maximum Marks
                </span>

                <h3>
                  10
                </h3>

              </div>

            </div>


            {/* ================= GUIDELINES ================= */}

            <div className="guideline-card">

              <div className="guide-top">

                <div className="guide-left">

                  <FaInfoCircle className="guide-icon" />

                  <p>

                    Provision of visiting or adjunct faculty /
                    emeritus professor / professor of practice etc.

                    <b> (01)</b>

                  </p>

                </div>

                <div className="guide-right">

                  <p>

                    Minimum{" "}
                    <span className="red">
                      50
                    </span>{" "}
                    cumulative hours per year
                    interaction <b>(09)</b> : Marks should not be awarded for less than
                    50 hours per year (per year to obtain three marks:

                    <span className="red">
                      {" "}3 * 3 = 09
                    </span>

                  </p>

                </div>

              </div>

              <div className="guide-note">

                <b>Note :</b>

                Here, individuals who contribute to
                teaching, learning or practical work
                on part-time basis or hourly basis
                need to be included.

                There is no data repetition
                from Section 5.1.

              </div>

            </div>


            {/* ================= FACULTY TABLE ================= */}

            <div className="faculty-card">

              <div className="faculty-title">

                <div className="title-left">

                  <FaUsers />

                  <span>
                    Faculty Details
                  </span>

                </div>

                <button
                  className="addFacultyBtn"
                  onClick={addRow}
                >

                  <FaPlus />

                  Add New Faculty

                </button>

              </div>


              <div className="table-responsive">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Sr.No.
                      </th>

                      <th>
                        Faculty Name
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Organization
                      </th>

                      <th>
                        Designation
                      </th>

                      <th>
                        Hours / Year
                        <br />
                        (Cumulative)
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {rows.map(
                      (row, index) => (

                        <tr key={row.id}>

                          <td>
                            {index + 1}
                          </td>


                          <td>

                            <input
                              type="text"
                              placeholder="Faculty Name"
                              value={row.name}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          <td>

                            <select
                              value={row.category}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "category",
                                  e.target.value
                                )
                              }
                            >

                              <option>
                                Visiting Faculty
                              </option>

                              <option>
                                Adjunct Faculty
                              </option>

                              <option>
                                Professor of Practice
                              </option>

                              <option>
                                Emeritus Professor
                              </option>

                            </select>

                          </td>


                          <td>

                            <input
                              type="text"
                              placeholder="Organization"
                              value={row.organization}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "organization",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          <td>

                            <input
                              type="text"
                              placeholder="Designation"
                              value={row.designation}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "designation",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          <td>

                            <input
                              type="number"
                              placeholder="Hours"
                              value={row.hours}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "hours",
                                  e.target.value
                                )
                              }
                            />

                          </td>


                          <td className="action-cell">

                            <button
                              className="viewBtn"
                              onClick={handleView}
                            >

                              <FaEye />

                            </button>


                            <button
                              className="deleteBtn"
                              onClick={() =>
                                deleteRow(index)
                              }
                            >

                              <FaTrash />

                            </button>

                          </td>

                        </tr>

                      )
                    )}


                    <tr className="totalRow">

                      <td colSpan="5">

                        <b>
                          Total Teaching Hours ( Cumulative )
                        </b>

                      </td>

                      <td>

                        <b>
                          {totalHours}
                        </b>

                      </td>

                      <td></td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>


            {/* ================= NBA CARDS ================= */}

            <div className="cards-row">


              {/* NBA Calculation */}

              <div className="calc-card">

                <h3>
                  NBA Calculation
                </h3>

                <div className="calc-row">

                  <span>
                    Provision Available
                  </span>

                  <b
                    style={{
                      color:
                        facultyAvailable
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >

                    {facultyAvailable
                      ? "Yes"
                      : "No"}

                  </b>

                </div>


                <div className="calc-row">

                  <span>
                    Provision Marks
                  </span>

                  <b>
                    {provisionMarks} / 1
                  </b>

                </div>


                <div className="calc-row">

                  <span>
                    Total Teaching Hours
                  </span>

                  <b>
                    {totalHours}
                  </b>

                </div>


                <div className="calc-row">

                  <span>
                    Hours Marks (50+ hrs / year)
                  </span>

                  <b>
                    {hoursMarks.toFixed(2)} / 9
                  </b>

                </div>


                <hr />


                <div className="totalMarksBox">

                  <span>
                    Total Marks
                  </span>

                  <h2>
                    {totalMarks.toFixed(2)} / 10
                  </h2>

                </div>

              </div>


              {/* NBA Evaluation */}

              <div className="evaluation-card">

                <h3>
                  NBA Evaluation
                </h3>


                <div className="eval-row">

                  <span>
                    Maximum Marks
                  </span>

                  <b>
                    10
                  </b>

                </div>


                <div className="eval-row">

                  <span>
                    Obtained Marks
                  </span>

                  <b>
                    {totalMarks.toFixed(2)} / 10
                  </b>

                </div>


                <div className="eval-row">

                  <span>
                    Percentage
                  </span>

                  <b>
                    {percentage}%
                  </b>

                </div>


                <div className="eval-row">

                  <span>
                    Grade
                  </span>


                  <div
                    className="status-box"
                    style={{
                      background:
                        status === "Excellent"
                          ? "#16a34a"
                          : status === "Very Good"
                          ? "#2563eb"
                          : status === "Good"
                          ? "#f59e0b"
                          : status === "Average"
                          ? "#fb923c"
                          : "#dc2626",
                    }}
                  >

                    {status}

                  </div>

                </div>

              </div>


              {/* Supporting Document */}

              <div className="document-card">

                <h3>
                  Supporting Document
                </h3>


                <div className="file-box">

                  {documentName ||
                    "No File Uploaded"}

                </div>


                <button
                  className="upload-btn"
                  onClick={() =>
                    fileRef.current.click()
                  }
                >

                  Upload Supporting Document

                </button>


                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleUpload}
                />

              </div>

            </div>


            {/* ================= NOTE ================= */}

            <div className="note-card">

              <b>
                Note :
              </b>

              Individuals contributing on part-time or hourly basis from
              Industry, Research Organizations and Reputed Institutions
              are considered for NBA Evaluation.

            </div>


            {/* ================= BUTTONS ================= */}

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
                className="btn print"
                onClick={handlePrint}
              >
                Print
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

export default Criteria54VisitingFaculty;