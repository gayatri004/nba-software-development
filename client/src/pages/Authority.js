import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import "../styles/Authority.css";

function Authority({ setIsLoggedIn }) {

  const navigate = useNavigate();

  const [sidebarOpen] = useState(true);

  const [authority, setAuthority] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedAuthority, setSelectedAuthority] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 10;

  useEffect(() => {

    fetchAuthority();

  }, []);

  const fetchAuthority = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/authority"
      );

      setAuthority(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const viewAuthority = (row) => {

    setSelectedAuthority(row);

    setShowModal(true);

  };

  const closeModal = () => {

    setSelectedAuthority(null);

    setShowModal(false);

  };

  const editAuthority = (id) => {

    navigate(`/authority-form?id=${id}`);

  };

  const deleteAuthority = async (id) => {

    if (
      !window.confirm(
        "Delete this Authority permanently?"
      )
    )
      return;

    try {

      await axios.delete(
        `http://localhost:5000/authority/${id}`
      );

      fetchAuthority();

    } catch (err) {

      console.log(err);

    }

  };

  /* ===================================
          FILTER + SEARCH
  =================================== */

  const filteredAuthority = useMemo(() => {

    let data = [...authority];
        if (search.trim() !== "") {

      const keyword = search.toLowerCase();

      data = data.filter(

        (item) =>

          item.authority_id?.toLowerCase().includes(keyword) ||

          item.authority_name?.toLowerCase().includes(keyword) ||

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

        (item) => item.status === statusFilter

      );

    }

    return data;

  }, [

    authority,

    search,

    departmentFilter,

    statusFilter,

  ]);

  /* ===================================
          DASHBOARD CARDS
  =================================== */

  const totalAuthority = authority.length;

  const activeAuthority = authority.filter(

    (item) => item.status === "Active"

  ).length;

  const inactiveAuthority = authority.filter(

    (item) => item.status === "Inactive"

  ).length;

  const totalDepartments = [

    ...new Set(

      authority.map(

        (item) => item.department

      )

    ),

  ].length;

  /* ===================================
          PAGINATION
  =================================== */

  const totalPages = Math.ceil(

    filteredAuthority.length / recordsPerPage

  );

  const indexOfLastRecord =

    currentPage * recordsPerPage;

  const indexOfFirstRecord =

    indexOfLastRecord - recordsPerPage;

  const currentAuthority = filteredAuthority.slice(

    indexOfFirstRecord,

    indexOfLastRecord

  );

  /* ===================================
            EXPORT
  =================================== */

  const exportAuthority = () => {

    alert(

      "Export Feature Coming Soon..."

    );

  };

  return (

    <div className="authority-page">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="authority-main">

        <div className="authority-list-card">

          {/* ================= HEADER ================= */}

          <div className="authority-list-header">

            <div className="header-left">

              <h2>Authority Management</h2>

              <p className="authority-subtitle">

                Manage all authority records efficiently

              </p>

            </div>

            <div className="header-right">
                          <div className="header-right">

              {/* Export Button */}

              <button
                className="export-btn"
                onClick={exportAuthority}
              >

                <FaDownload />

                <span>Export</span>

              </button>

              {/* Add Authority */}

              <button
                className="authority-add-btn"
                onClick={() => navigate("/authority-form")}
              >

                <FaPlus />

                <span>Add Authority</span>

              </button>

            </div>

          </div>

          {/* ================= DASHBOARD CARDS ================= */}

          <div className="authority-stats">

            <div className="stat-box blue">

              <div className="stat-icon">

                <FaUserShield />

              </div>

              <div>

                <h3>{totalAuthority}</h3>

                <span>Total Authority</span>

              </div>

            </div>

            <div className="stat-box green">

              <div className="stat-icon">

                <FaUserCheck />

              </div>

              <div>

                <h3>{activeAuthority}</h3>

                <span>Active Authority</span>

              </div>

            </div>

            <div className="stat-box orange">

              <div className="stat-icon">

                <FaUserShield />

              </div>

              <div>

                <h3>{totalDepartments}</h3>

                <span>Departments</span>

              </div>

            </div>

            <div className="stat-box red">

              <div className="stat-icon">

                <FaUserTimes />

              </div>

              <div>

                <h3>{inactiveAuthority}</h3>

                <span>Inactive Authority</span>

              </div>

            </div>

          </div>

          {/* ================= TOOLBAR ================= */}

          <div className="authority-toolbar">

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
              className="authority-filter"
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >

              <option value="All">

                All Departments

              </option>

              {[...new Set(authority.map(item => item.department))]
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
              className="authority-filter"
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

          <div className="authority-table-wrapper">

            <table className="authority-table">

              <thead>

                <tr>

                  <th>Authority ID</th>

                  <th>Authority Name</th>

                  <th>Department</th>

                  <th>Designation</th>

                  <th>Authority Level</th>

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
                      colSpan="9"
                      className="loading-row"
                    >

                      Loading Authority Records...

                    </td>

                  </tr>

                ) : currentAuthority.length === 0 ? (

                  <tr>

                    <td
                      colSpan="9"
                      className="loading-row"
                    >

                      No Authority Records Found

                    </td>

                  </tr>

                ) : (

                  currentAuthority.map((row) => (

                    <tr key={row.id}>

                      {/* Authority ID */}

                      <td>

                        {row.authority_id}

                      </td>

                      {/* Authority Name */}

                      <td>

                        <div className="authority-name">

                          <div className="authority-avatar">

                            {row.authority_name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>

                          <span>

                            {row.authority_name}

                          </span>

                        </div>

                      </td>

                      {/* Department */}

                      <td>

                        {row.department}

                      </td>

                      {/* Designation */}

                      <td>

                        {row.designation}

                      </td>

                      {/* Authority Level */}

                      <td>

                        {row.authority_level}

                      </td>

                      {/* Email */}

                      <td>

                        {row.email}

                      </td>

                      {/* Mobile */}

                      <td>

                        {row.mobile}

                      </td>

                      {/* Status */}

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

                      {/* Action */}

                      <td>

                        <div className="authority-action-buttons">

                          <button
                            className="view-btn"
                            onClick={() =>
                              viewAuthority(row)
                            }
                          >

                            <FaEye />

                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editAuthority(row.id)
                            }
                          >

                            <FaEdit />

                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteAuthority(row.id)
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

          {/* =====================
              VIEW MODAL
          ===================== */}

          {showModal && selectedAuthority && (

            <div className="modal-overlay">

              <div className="authority-modal">

                <div className="modal-header">
                                    <div>

                    <h2>

                      Authority Details

                    </h2>

                    <p>

                      Complete Authority Information

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
                    <b>Authority ID</b>
                    <span>{selectedAuthority.authority_id}</span>
                  </div>

                  <div className="detail-row">
                    <b>Authority Name</b>
                    <span>{selectedAuthority.authority_name}</span>
                  </div>

                  <div className="detail-row">
                    <b>Employee ID</b>
                    <span>{selectedAuthority.employee_id}</span>
                  </div>

                  <div className="detail-row">
                    <b>Department</b>
                    <span>{selectedAuthority.department}</span>
                  </div>

                  <div className="detail-row">
                    <b>Designation</b>
                    <span>{selectedAuthority.designation}</span>
                  </div>

                  <div className="detail-row">
                    <b>Authority Level</b>
                    <span>{selectedAuthority.authority_level}</span>
                  </div>

                  <div className="detail-row">
                    <b>Joining Date</b>
                    <span>
                      {selectedAuthority.joining_date?.split("T")[0]}
                    </span>
                  </div>

                  <div className="detail-row">
                    <b>Email</b>
                    <span>{selectedAuthority.email}</span>
                  </div>

                  <div className="detail-row">
                    <b>Mobile</b>
                    <span>{selectedAuthority.mobile}</span>
                  </div>

                  <div className="detail-row">
                    <b>Office Extension</b>
                    <span>
                      {selectedAuthority.office_extension || "-"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <b>Office Location</b>
                    <span>
                      {selectedAuthority.office_location || "-"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <b>APAR ID</b>
                    <span>{selectedAuthority.apar_id || "-"}</span>
                  </div>

                  <div className="detail-row">
                    <b>Office Address</b>
                    <span>
                      {selectedAuthority.office_address || "-"}
                    </span>
                  </div>

                  <div className="detail-row">
                    <b>Status</b>
                    <span>{selectedAuthority.status}</span>
                  </div>

                  <div className="detail-row">
                    <b>Remarks</b>
                    <span>{selectedAuthority.remarks || "-"}</span>
                  </div>

                </div>

              </div>

            </div>

          )}

          {/* ======================
              PAGINATION
          ====================== */}

          {totalPages > 1 && (

            <div className="pagination">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(currentPage - 1)
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
                  setCurrentPage(currentPage + 1)
                }
              >

                Next

              </button>

            </div>

          )}

        </div>
        </div>

      </main>

    </div>

  );

}

export default Authority;