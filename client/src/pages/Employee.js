import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Employee({ setIsLoggedIn }) {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem("employees");
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (emp) => {
    setEditId(emp.id);
    setEditData(emp);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdit = () => {
    setEmployees(
      employees.map((emp) => (emp.id === editId ? editData : emp))
    );

    setEditId(null);
    setEditData({});
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (confirmDelete) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setIsLoggedIn={setIsLoggedIn} />

      <main className="main-content">
        <div className="page-card">
          <h2>Employee Management</h2>

          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No employee data found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>

                    <td>
                      {editId === emp.id ? (
                        <input
                          className="table-input"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                        />
                      ) : (
                        emp.name
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <input
                          className="table-input"
                          name="department"
                          value={editData.department}
                          onChange={handleEditChange}
                        />
                      ) : (
                        emp.department
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <input
                          className="table-input"
                          name="designation"
                          value={editData.designation}
                          onChange={handleEditChange}
                        />
                      ) : (
                        emp.designation
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <input
                          className="table-input"
                          name="mobile"
                          value={editData.mobile}
                          onChange={handleEditChange}
                        />
                      ) : (
                        emp.mobile
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <input
                          className="table-input"
                          name="email"
                          value={editData.email}
                          onChange={handleEditChange}
                        />
                      ) : (
                        emp.email
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <select
                          className="table-input"
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                        >
                          <option>Active</option>
                          <option>Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={
                            emp.status === "Active"
                              ? "active-status"
                              : "inactive-status"
                          }
                        >
                          {emp.status}
                        </span>
                      )}
                    </td>

                    <td>
                      {editId === emp.id ? (
                        <>
                          <button className="save-btn" onClick={saveEdit}>
                            Save
                          </button>
                          <button className="cancel-btn" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => startEdit(emp)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteEmployee(emp.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Employee;