import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaUsers,
  FaUniversity,
  FaUserCheck,
  FaUserTimes,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "../styles/FacultyManagement.css";

function FacultyManagement({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [sidebarOpen] = useState(true);

  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedFaculty, setSelectedFaculty] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  useEffect(() => {

    fetchFaculty();

  }, []);

  const fetchFaculty = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/faculty"
      );

      setFaculty(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const viewFaculty = (row) => {

    setSelectedFaculty(row);

    setShowModal(true);

  };

  const closeModal = () => {

    setSelectedFaculty(null);

    setShowModal(false);

  };

  const editFaculty = (id) => {

    navigate(`/faculty-form?id=${id}`);

  };

  const deleteFaculty = async (id) => {

    if (
      !window.confirm(
        "Delete this faculty permanently?"
      )
    )
      return;

    try {

      await axios.delete(
        `nba-software-development-production.up.railway.app/faculty/${id}`
      );

      fetchFaculty();

    } catch (err) {

      console.log(err);

    }

  };
    /* ===============================
          FILTER + SEARCH
  =============================== */

  const filteredFaculty = useMemo(() => {

    let data = [...faculty];

    if (search.trim() !== "") {

      const keyword = search.toLowerCase();

      data = data.filter((item) =>

        item.faculty_id?.toLowerCase().includes(keyword) ||

        item.faculty_name?.toLowerCase().includes(keyword) ||

        item.department?.toLowerCase().includes(keyword) ||

        item.designation?.toLowerCase().includes(keyword) ||

        item.email?.toLowerCase().includes(keyword) ||

        item.mobile?.toLowerCase().includes(keyword)

      );

    }

    if (departmentFilter !== "All") {

      data = data.filter(

        (item) => item.department === departmentFilter

      );

    }

    if (statusFilter !== "All") {

      data = data.filter(

        (item) => item.faculty_status === statusFilter

      );

    }

    return data;

  }, [

    faculty,

    search,

    departmentFilter,

    statusFilter,

  ]);

  /* ===============================
          DASHBOARD CARDS
  =============================== */

  const totalFaculty = faculty.length;

  const activeFaculty = faculty.filter(

    (item) => item.faculty_status === "Active"

  ).length;

  const inactiveFaculty = faculty.filter(

    (item) => item.faculty_status === "Inactive"

  ).length;

  const totalDepartments = [

    ...new Set(

      faculty.map(

        (item) => item.department

      )

    ),

  ].length;

  /* ===============================
          PAGINATION
  =============================== */

  const indexOfLastRecord =

    currentPage * recordsPerPage;

  const indexOfFirstRecord =

    indexOfLastRecord - recordsPerPage;

  const currentFaculty = filteredFaculty.slice(

    indexOfFirstRecord,

    indexOfLastRecord

  );

   /* ===============================
            EXPORT
  =============================== */

  const exportFaculty = () => {

    alert(

      "Export Feature Coming Soon..."

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

              <h2>Faculty Management</h2>

              <p className="faculty-subtitle">

                Manage all faculty records efficiently

              </p>

            </div>

            <div className="header-right">

              <button
                className="export-btn"
                onClick={exportFaculty}
              >

                <FaDownload />

                <span>Export</span>

              </button>

              <button
                className="faculty-add-btn"
                onClick={() => navigate("/faculty-form")}
              >

                <FaPlus />

                <span>Add Faculty</span>

              </button>

            </div>

          </div>

          {/* ================= DASHBOARD CARDS ================= */}

          <div className="faculty-stats">

            <div className="stat-box blue">

  <div className="stat-icon">
    <FaUsers />
  </div>

  <div className="stat-content">

    <h3>{totalFaculty}</h3>

    <span>Total Faculty</span>

    <p className="card-desc">
      All Faculty Members
    </p>

  </div>

</div>

            <div className="stat-box green">

  <div className="stat-icon">
    <FaUserCheck />
  </div>

  <div className="stat-content">

    <h3>{activeFaculty}</h3>

    <span>Active Faculty</span>

    <p className="card-desc">
      Currently Active
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
      Total Departments
    </p>

  </div>

</div>
           <div className="stat-box red">

  <div className="stat-icon">
    <FaUserTimes />
  </div>

  <div className="stat-content">

    <h3>{inactiveFaculty}</h3>

    <span>Inactive Faculty</span>

    <p className="card-desc">
      Currently Inactive
    </p>

  </div>

</div>
          </div>
                    {/* ================= TOOLBAR ================= */}

         <div className="faculty-toolbar">

  {/* Search */}

  <div className="search-box">

    <FaSearch className="search-icon" />

    <input
      type="text"
      placeholder="Search by ID, Name, Department..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

  </div>

  {/* Department */}

  <select
    className="faculty-filter"
    value={departmentFilter}
    onChange={(e) => {
      setDepartmentFilter(e.target.value);
      setCurrentPage(1);
    }}
  >

    <option value="All">All Departments</option>

    {[...new Set(faculty.map(item => item.department))]
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

  {/* Status */}

  <select
    className="faculty-filter"
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
  >

    <option value="All">All Status</option>

    <option value="Active">Active</option>

    <option value="Inactive">Inactive</option>

  </select>

</div>

          {/* ================= TABLE ================= */}

          <div className="faculty-table-wrapper">

            <table className="faculty-table">

              <thead>

                <tr>

                  <th>Faculty ID</th>

                  <th>Faculty Name</th>

                  <th>Department</th>

                  <th>Designation</th>

                  <th>Qualification</th>

                  <th>Gender</th>

                  <th>Email</th>

                  <th>Mobile</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>
                                {loading ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="loading-row"
                    >
                      Loading Faculty Records...
                    </td>

                  </tr>

                ) : currentFaculty.length === 0 ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="loading-row"
                    >
                      No Faculty Records Found
                    </td>

                  </tr>

                ) : (

                  currentFaculty.map((row) => (

                    <tr key={row.id}>

                      <td>{row.faculty_id}</td>

                      <td>

                        <div className="faculty-name">

                          <div className="faculty-avatar">

                            {row.faculty_name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <span>

                            {row.faculty_name}

                          </span>

                        </div>

                      </td>

                      <td>{row.department}</td>

                      <td>{row.designation}</td>

                      <td>{row.qualification}</td>

                      <td>{row.gender}</td>

                      <td>{row.email}</td>

                      <td>{row.mobile}</td>

                      <td>

                        <span
                          className={
                            row.faculty_status === "Inactive"
                              ? "status-inactive"
                              : "status-active"
                          }
                        >

                          {row.faculty_status || "Active"}

                        </span>

                      </td>

                      <td>

                        <div className="faculty-action-buttons">

                          <button
                            className="view-btn"
                            onClick={() => viewFaculty(row)}
                          >

                            <FaEye />

                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editFaculty(row.id)
                            }
                          >

                            <FaEdit />

                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteFaculty(row.id)
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
                    {/* ================= VIEW MODAL ================= */}

          {showModal && selectedFaculty && (

            <div className="modal-overlay">

              <div className="faculty-modal">

                <div className="modal-header">

                  <div>

                    <h2>Faculty Details</h2>

                    <p>

                      Complete Faculty Information

                    </p>

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
                    <b>Faculty ID</b>
                    <span>{selectedFaculty.faculty_id}</span>
                  </div>

                  <div className="detail-row">
                    <b>Faculty Name</b>
                    <span>{selectedFaculty.faculty_name}</span>
                  </div>

                  <div className="detail-row">
                    <b>Father Name</b>
                    <span>{selectedFaculty.father_name}</span>
                  </div>

                  <div className="detail-row">
                    <b>Date of Birth</b>
                    <span>{selectedFaculty.dob?.split("T")[0]}</span>
                  </div>

                  <div className="detail-row">
                    <b>Gender</b>
                    <span>{selectedFaculty.gender}</span>
                  </div>

                  <div className="detail-row">
                    <b>Marital Status</b>
                    <span>{selectedFaculty.marital_status}</span>
                  </div>

                  <div className="detail-row">
                    <b>Blood Group</b>
                    <span>{selectedFaculty.blood_group}</span>
                  </div>

                  <div className="detail-row">
                    <b>Nationality</b>
                    <span>{selectedFaculty.nationality}</span>
                  </div>

                  <div className="detail-row">
                    <b>Religion</b>
                    <span>{selectedFaculty.religion}</span>
                  </div>

                  <div className="detail-row">
                    <b>Category</b>
                    <span>{selectedFaculty.category}</span>
                  </div>

                  <div className="detail-row">
                    <b>Department</b>
                    <span>{selectedFaculty.department}</span>
                  </div>

                  <div className="detail-row">
                    <b>Designation</b>
                    <span>{selectedFaculty.designation}</span>
                  </div>

                  <div className="detail-row">
                    <b>Qualification</b>
                    <span>{selectedFaculty.qualification}</span>
                  </div>

                  <div className="detail-row">
                    <b>Experience</b>
                    <span>{selectedFaculty.experience}</span>
                  </div>

                  <div className="detail-row">
                    <b>Email</b>
                    <span>{selectedFaculty.email}</span>
                  </div>

                  <div className="detail-row">
                    <b>Mobile</b>
                    <span>{selectedFaculty.mobile}</span>
                  </div>
                                    <div className="detail-row">
                    <b>Alternate Mobile</b>
                    <span>{selectedFaculty.alternate_mobile || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Joining Date</b>
                    <span>{selectedFaculty.joining_date?.split("T")[0]}</span>
                  </div>

                  <div className="detail-row">
                    <b>Faculty Status</b>
                    <span>{selectedFaculty.faculty_status}</span>
                  </div>

                  <div className="detail-row">
                    <b>Salary</b>
                    <span>₹ {selectedFaculty.salary}</span>
                  </div>

                  <div className="detail-row">
                    <b>Address</b>
                    <span>{selectedFaculty.address}</span>
                  </div>

                  <div className="detail-row">
                    <b>City</b>
                    <span>{selectedFaculty.city}</span>
                  </div>

                  <div className="detail-row">
                    <b>State</b>
                    <span>{selectedFaculty.state}</span>
                  </div>

                  <div className="detail-row">
                    <b>Country</b>
                    <span>{selectedFaculty.country}</span>
                  </div>

                  <div className="detail-row">
                    <b>Pincode</b>
                    <span>{selectedFaculty.pincode}</span>
                  </div>

                  <div className="detail-row">
                    <b>Aadhar Number</b>
                    <span>{selectedFaculty.aadhar_number || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>PAN Number</b>
                    <span>{selectedFaculty.pan_number || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Bank Name</b>
                    <span>{selectedFaculty.bank_name || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Account Number</b>
                    <span>{selectedFaculty.account_number || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>IFSC Code</b>
                    <span>{selectedFaculty.ifsc_code || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>UG Degree</b>
                    <span>{selectedFaculty.ug_degree || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>PG Degree</b>
                    <span>{selectedFaculty.pg_degree || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>PhD</b>
                    <span>{selectedFaculty.phd || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Specialization</b>
                    <span>{selectedFaculty.specialization || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Research Area</b>
                    <span>{selectedFaculty.research_area || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Remark</b>
                    <span>{selectedFaculty.remark || "-"}</span>
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

export default FacultyManagement;