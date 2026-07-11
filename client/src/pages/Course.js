import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaBook,
  FaUniversity,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "../styles/CourseMaster.css";

function Course({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [sidebarOpen] = useState(true);

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
  "https://nba-software-development-production.up.railway.app/course-master"
);

      setCourses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const viewCourse = (row) => {
    setSelectedCourse(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  const editCourse = (id) => {
    navigate(`/course-master?id=${id}`);
  };

  const deleteCourse = async (id) => {
    if (
      !window.confirm(
        "Delete this course permanently?"
      )
    )
      return;

    try {
      await axios.delete(
  `https://nba-software-development-production.up.railway.app/course-master/${id}`
);

      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    if (search.trim() !== "") {
      const keyword = search.toLowerCase();

      data = data.filter(
        (item) =>
          item.course_code?.toLowerCase().includes(keyword) ||
          item.course_name?.toLowerCase().includes(keyword) ||
          item.department?.toLowerCase().includes(keyword) ||
          item.course_level?.toLowerCase().includes(keyword)
      );
    }

    if (departmentFilter !== "All") {
      data = data.filter(
        (item) =>
          item.department === departmentFilter
      );
    }

    if (statusFilter !== "All") {
      data = data.filter(
        (item) =>
          item.course_status === statusFilter
      );
    }

    return data;
  }, [
    courses,
    search,
    departmentFilter,
    statusFilter,
  ]);

  const totalCourses = courses.length;

  const activeCourses = courses.filter(
    (item) => item.course_status === "Active"
  ).length;

  const inactiveCourses = courses.filter(
    (item) => item.course_status === "Inactive"
  ).length;

  const totalDepartments = [
    ...new Set(
      courses.map((item) => item.department)
    ),
  ].length;

  const totalPages = Math.ceil(
    filteredCourses.length / recordsPerPage
  );

  const indexOfLastRecord =
    currentPage * recordsPerPage;

  const indexOfFirstRecord =
    indexOfLastRecord - recordsPerPage;

  const currentCourses =
    filteredCourses.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

  const exportCourse = () => {
  window.open(
    "https://nba-software-development-production.up.railway.app/course/pdf",
    "_blank"
  );
};
  return (

  <div className="faculty-page">

    <Sidebar
      sidebarOpen={sidebarOpen}
      setIsLoggedIn={setIsLoggedIn}
    />

    <main className="faculty-main">

      <div className="faculty-card">

        {/* ================= HEADER ================= */}

        <div className="faculty-header">

          <div className="header-left">

            <h2>Course Management</h2>

            <p className="faculty-subtitle">
              Manage all course records efficiently
            </p>

          </div>

          <div className="header-right">

            <button
              className="export-btn"
              onClick={exportCourse}
            >
              <FaDownload />
              <span>Export</span>
            </button>

            <button
              className="faculty-add-btn"
              onClick={() => navigate("/course-master")}
            >
              <FaPlus />
              <span>Add Course</span>
            </button>

          </div>

        </div>

        {/* ================= DASHBOARD CARDS ================= */}

        <div className="faculty-stats">

          <div className="stat-box blue">

            <div className="stat-icon">
              <FaBook />
            </div>

            <div className="stat-content">

              <h3>{totalCourses}</h3>

              <span>Total Courses</span>

              <p className="card-desc">
                All Available Courses
              </p>

            </div>

          </div>

          <div className="stat-box green">

            <div className="stat-icon">
              <FaCheckCircle />
            </div>

            <div className="stat-content">

              <h3>{activeCourses}</h3>

              <span>Active Courses</span>

              <p className="card-desc">
                Currently Running
              </p>

            </div>

          </div>

          <div className="stat-box orange">

            <div className="stat-icon">
              <FaUniversity />
            </div>

            <div className="stat-content">

              <h3>{totalDepartments}</h3>

              <span>Departments</span>

              <p className="card-desc">
                Offering Courses
              </p>

            </div>

          </div>

          <div className="stat-box red">

            <div className="stat-icon">
              <FaTimesCircle />
            </div>

            <div className="stat-content">

              <h3>{inactiveCourses}</h3>

              <span>Inactive Courses</span>

              <p className="card-desc">
                Currently Closed
              </p>

            </div>

          </div>

        </div>

        {/* ================= SEARCH TOOLBAR ================= */}

        <div className="faculty-toolbar">

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search by Course Code, Course Name..."
              value={search}
              onChange={(e) => {

                setSearch(e.target.value);

                setCurrentPage(1);

              }}
            />

          </div>

          <select
            className="faculty-filter"
            value={departmentFilter}
            onChange={(e) => {

              setDepartmentFilter(e.target.value);

              setCurrentPage(1);

            }}
          >

            <option value="All">
              All Departments
            </option>

            {[...new Set(courses.map(item => item.department))]
              .filter(Boolean)
              .map((dept) => (

                <option
                  key={dept}
                  value={dept}
                >
                  {dept}
                </option>

              ))}

          </select>

          <select
            className="faculty-filter"
            value={statusFilter}
            onChange={(e) => {

              setStatusFilter(e.target.value);

              setCurrentPage(1);

            }}
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>
                {/* ================= TABLE ================= */}

        <div className="faculty-table-wrapper">

          <table className="faculty-table">

            <thead>

              <tr>

                <th>Course Code</th>

                <th>Course Name</th>

                <th>Department</th>

                <th>Course Level</th>

                <th>Duration</th>

                <th>Semesters</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="loading-row"
                  >
                    Loading Course Records...
                  </td>

                </tr>

              ) : currentCourses.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="loading-row"
                  >
                    No Course Records Found
                  </td>

                </tr>

              ) : (

                currentCourses.map((row) => (

                  <tr key={row.id}>

                    <td>{row.course_code}</td>

                    <td>

                      <div className="faculty-name">

                        <div className="faculty-avatar">

                          {row.course_name
                            ?.charAt(0)
                            ?.toUpperCase()}

                        </div>

                        <span>

                          {row.course_name}

                        </span>

                      </div>

                    </td>

                    <td>{row.department}</td>

                    <td>{row.course_level}</td>

                    <td>{row.duration}</td>

                    <td>{row.total_semesters}</td>

                    <td>

                      <span
                        className={
                          row.course_status === "Inactive"
                            ? "status-inactive"
                            : "status-active"
                        }
                      >

                        {row.course_status}

                      </span>

                    </td>

                    <td>

                      <div className="faculty-action-buttons">

                        <button
                          className="view-btn"
                          onClick={() =>
                            viewCourse(row)
                          }
                        >

                          <FaEye />

                        </button>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editCourse(row.id)
                          }
                        >

                          <FaEdit />

                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteCourse(row.id)
                          }
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
                {/* ================= PAGINATION ================= */}

        {totalPages > 1 && (
          <div className="pagination">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              Next
            </button>

          </div>
        )}

        {/* ================= VIEW MODAL ================= */}

        {showModal && selectedCourse && (

          <div className="modal-overlay">

            <div className="faculty-modal">

              <div className="modal-header">

                <div>

                  <h2>Course Details</h2>

                  <p>Complete Course Information</p>

                </div>

                <button
                  className="close-btn"
                  onClick={closeModal}
                >
                  ✕
                </button>

              </div>

              <div className="modal-body">

                <div className="detail-row">
                  <b>Course Code</b>
                  <span>{selectedCourse.course_code}</span>
                </div>

                <div className="detail-row">
                  <b>Course Name</b>
                  <span>{selectedCourse.course_name}</span>
                </div>

                <div className="detail-row">
                  <b>Course Type</b>
                  <span>{selectedCourse.course_type}</span>
                </div>

                <div className="detail-row">
                  <b>Department</b>
                  <span>{selectedCourse.department}</span>
                </div>

                <div className="detail-row">
                  <b>Course Level</b>
                  <span>{selectedCourse.course_level}</span>
                </div>

                <div className="detail-row">
                  <b>Duration</b>
                  <span>{selectedCourse.duration}</span>
                </div>

                <div className="detail-row">
                  <b>Total Semesters</b>
                  <span>{selectedCourse.total_semesters}</span>
                </div>

                <div className="detail-row">
                  <b>Intake Capacity</b>
                  <span>{selectedCourse.intake_capacity}</span>
                </div>

                <div className="detail-row">
                  <b>Course Status</b>
                  <span>{selectedCourse.course_status}</span>
                </div>

                <div className="detail-row">
                  <b>Approval Status</b>
                  <span>{selectedCourse.approval_status}</span>
                </div>

                <div className="detail-row">
                  <b>Coordinator</b>
                  <span>{selectedCourse.coordinator}</span>
                </div>

                <div className="detail-row">
                  <b>Contact Number</b>
                  <span>{selectedCourse.contact_number}</span>
                </div>

                <div className="detail-row">
                  <b>Tuition Fees</b>
                  <span>₹ {selectedCourse.tuition_fees}</span>
                </div>

                <div className="detail-row">
                  <b>Total Fees</b>
                  <span>₹ {selectedCourse.total_fees}</span>
                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>

  </div>

);

}

export default Course;