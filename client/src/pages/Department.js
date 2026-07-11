import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaUniversity,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import "../styles/Department.css";

function Department({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [sidebarOpen] = useState(true);

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [campusFilter, setCampusFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  useEffect(() => {

    fetchDepartments();

  }, []);

  const fetchDepartments = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://nba-software-development-production.up.railway.app/department"
      );

      setDepartments(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const viewDepartment = (row) => {

    setSelectedDepartment(row);

    setShowModal(true);

  };

  const closeModal = () => {

    setSelectedDepartment(null);

    setShowModal(false);

  };

  const editDepartment = (id) => {

    navigate(`/department-master?id=${id}`);

  };

  const deleteDepartment = async (id) => {

    if (
      !window.confirm(
        "Delete this department permanently?"
      )
    )
      return;

    try {

      await axios.delete(
        `https://nba-software-development-production.up.railway.app/department/${id}`
      );

      fetchDepartments();

    } catch (err) {

      console.log(err);

    }

  };
    /* ===============================
          FILTER + SEARCH
  =============================== */

  const filteredDepartments = useMemo(() => {

    let data = [...departments];

    if (search.trim() !== "") {

      const keyword = search.toLowerCase();

      data = data.filter((item) =>

        item.department_code
          ?.toLowerCase()
          .includes(keyword) ||

        item.department_type
          ?.toLowerCase()
          .includes(keyword) ||

        item.hod_name
          ?.toLowerCase()
          .includes(keyword) ||

        item.building
          ?.toLowerCase()
          .includes(keyword) ||

        item.campus
          ?.toLowerCase()
          .includes(keyword)

      );

    }

    if (campusFilter !== "All") {

      data = data.filter(

        (item) => item.campus === campusFilter

      );

    }

    if (statusFilter !== "All") {

      data = data.filter(

        (item) => item.status === statusFilter

      );

    }

    return data;

  }, [

    departments,

    search,

    campusFilter,

    statusFilter,

  ]);

  /* ===============================
          DASHBOARD CARDS
  =============================== */

  const totalDepartments =
    departments.length;

  const activeDepartments =
    departments.filter(

      (item) => item.status === "Active"

    ).length;

  const inactiveDepartments =
    departments.filter(

      (item) => item.status === "Inactive"

    ).length;

  const totalCampus = [

    ...new Set(

      departments.map(

        (item) => item.campus

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

  const currentDepartments =
    filteredDepartments.slice(

      indexOfFirstRecord,

      indexOfLastRecord

    );

  /* ===============================
            EXPORT
  =============================== */

  const exportDepartment = () => {
  window.open(
    "https://nba-software-development-production.up.railway.app/department/pdf",
    "_blank"
  );
};

  return (

    <div className="department-page">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="department-main">

        <div className="department-card">
          {/* ================= HEADER ================= */}

          <div className="department-header">

            <div className="header-left">

              <h2>Department Management</h2>

              <p className="department-subtitle">

                Manage all department records efficiently

              </p>

            </div>

            <div className="header-right">

              <button
                className="export-btn"
                onClick={exportDepartment}
              >

                <FaDownload />

                <span>Export</span>

              </button>

              <button
                className="department-add-btn"
                onClick={() =>
                  navigate("/department-master")
                }
              >

                <FaPlus />

                <span>Add Department</span>

              </button>

            </div>

          </div>

          {/* ================= DASHBOARD CARDS ================= */}

          <div className="department-stats">

            <div className="stat-box blue">

              <div className="stat-icon">

                <FaBuilding />

              </div>

              <div>

                <h3>{totalDepartments}</h3>

                <span>Total Departments</span>

              </div>

            </div>

            <div className="stat-box green">

              <div className="stat-icon">

                <FaCheckCircle />

              </div>

              <div>

                <h3>{activeDepartments}</h3>

                <span>Active Departments</span>

              </div>

            </div>

            <div className="stat-box orange">

              <div className="stat-icon">

                <FaUniversity />

              </div>

              <div>

                <h3>{totalCampus}</h3>

                <span>Total Campus</span>

              </div>

            </div>

            <div className="stat-box red">

              <div className="stat-icon">

                <FaTimesCircle />

              </div>

              <div>

                <h3>{inactiveDepartments}</h3>

                <span>Inactive Departments</span>

              </div>

            </div>

          </div>
                    {/* ================= TOOLBAR ================= */}

          <div className="department-toolbar">

  {/* Search */}

  <div className="search-box">

    <FaSearch className="search-icon" />

    <input
      type="text"
      placeholder="Search by Code, Department, HOD..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

  </div>

  {/* Campus */}

  <select
    className="department-filter"
    value={campusFilter}
    onChange={(e) => {
      setCampusFilter(e.target.value);
      setCurrentPage(1);
    }}
  >

    <option value="All">All Campus</option>

    {[...new Set(departments.map(item => item.campus))]
      .filter(Boolean)
      .map(campus => (

        <option
          key={campus}
          value={campus}
        >
          {campus}
        </option>

      ))}

  </select>

  {/* Status */}

  <select
    className="department-filter"
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

          <div className="department-table-wrapper">

            <table className="department-table">

              <thead>

                <tr>

                  <th>Department Code</th>

                  <th>Department Name</th>

                  <th>HOD Name</th>

                  <th>Building</th>

                  <th>Floor</th>

                  <th>Campus</th>

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
                      Loading Department Records...
                    </td>

                  </tr>

                ) : currentDepartments.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="loading-row"
                    >
                      No Department Records Found
                    </td>

                  </tr>

                ) : (

                  currentDepartments.map((row) => (

                    <tr key={row.id}>

                      <td>{row.department_code}</td>

                      <td>{row.department_type}</td>

                      <td>{row.hod_name}</td>

                      <td>{row.building}</td>

                      <td>{row.floor}</td>

                      <td>{row.campus}</td>

                      <td>

                        <span
                          className={
                            row.status === "Inactive"
                              ? "status-inactive"
                              : "status-active"
                          }
                        >

                          {row.status || "Active"}

                        </span>

                      </td>

                      <td>

                        <div className="department-action-buttons">

                          <button
                            className="view-btn"
                            onClick={() =>
                              viewDepartment(row)
                            }
                          >

                            <FaEye />

                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editDepartment(row.id)
                            }
                          >

                            <FaEdit />

                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteDepartment(row.id)
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

          

           

          {/* ================= TABLE FOOTER ================= */}

          
          {/* ================= VIEW MODAL ================= */}

          {showModal && selectedDepartment && (

            <div className="modal-overlay">

              <div className="department-modal">

                <div className="modal-header">

                  <div>

                    <h2>Department Details</h2>

                    <p>
                      Complete Department Information
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
                    <b>Department Code</b>
                    <span>{selectedDepartment.department_code}</span>
                  </div>

                  <div className="detail-row">
                    <b>Department Name</b>
                    <span>{selectedDepartment.department_type}</span>
                  </div>

                  <div className="detail-row">
                    <b>HOD Name</b>
                    <span>{selectedDepartment.hod_name}</span>
                  </div>

                  <div className="detail-row">
                    <b>Building</b>
                    <span>{selectedDepartment.building}</span>
                  </div>

                  <div className="detail-row">
                    <b>Floor / Room</b>
                    <span>{selectedDepartment.floor}</span>
                  </div>

                  <div className="detail-row">
                    <b>Campus</b>
                    <span>{selectedDepartment.campus}</span>
                  </div>

                  <div className="detail-row">
                    <b>Status</b>
                    <span>{selectedDepartment.status || "Active"}</span>
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

export default Department;