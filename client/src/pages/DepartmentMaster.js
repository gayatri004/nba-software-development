import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DepartmentMaster.css";

function DepartmentMaster() {

  const navigate = useNavigate();
  const topRef = useRef(null);

  const [department, setDepartment] = useState(() => {
    const savedDepartment = localStorage.getItem("departmentDraft");

    return savedDepartment
      ? JSON.parse(savedDepartment)
      : {
          departmentCode: "",
          departmentType: "",
          hodName: "",
          building: "",
          floor: "",
          campus: "",
        };
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(
      "departmentDraft",
      JSON.stringify(department)
    );
  }, [department]);

  const validateForm = () => {
    let newErrors = {};

    if (!department.departmentCode.trim())
      newErrors.departmentCode = "Department Code is required";

    if (!department.departmentType)
      newErrors.departmentType = "Department Type is required";

    if (!department.hodName.trim())
      newErrors.hodName = "HOD Name is required";

    if (!department.building.trim())
      newErrors.building = "Building / Block is required";

    if (!department.floor.trim())
      newErrors.floor = "Floor / Room No. is required";

    if (!department.campus)
      newErrors.campus = "Campus is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {

    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
  "https://nba-software-development-production.up.railway.app/department",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(department)
        }
      );

      const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);

alert(JSON.stringify(data));
      setDepartment({
        departmentCode: "",
        departmentType: "",
        hodName: "",
        building: "",
        floor: "",
        campus: ""
      });

    } catch (error) {
      console.log(error);
      alert("Save Failed");
    }

  };

  const handleUpdate = () => {

    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "departmentData",
      JSON.stringify(department)
    );

    alert("Department Updated Successfully");

  };

  const handleDelete = () => {

    localStorage.removeItem("departmentData");
    localStorage.removeItem("departmentDraft");

    setDepartment({
      departmentCode: "",
      departmentType: "",
      hodName: "",
      building: "",
      floor: "",
      campus: ""
    });

    setErrors({});

    alert("Department Deleted Successfully");

  };

const handleBack = () => {
  navigate("/dashboard");
};
  const handleClear = () => {

    setDepartment({
      departmentCode: "",
      departmentType: "",
      hodName: "",
      building: "",
      floor: "",
      campus: ""
    });

    setErrors({});

  };

  return (
    <div ref={topRef} className="department-container">

  <div className="department-card">

    <div className="page-header">
      <div>
        <h1>Department Master</h1>
      </div>
    </div>

    {/* Department Information */}

    <div className="section">

      <div className="section-title">
        <h2>Department Information</h2>
      </div>

      <div className="grid-3">

        <div>

          <label>Department Code </label>

          <input
            type="text"
            placeholder="Enter Department Code"
            className={errors.departmentCode ? "error-field" : ""}
            value={department.departmentCode}
            onChange={(e) =>
              setDepartment({
                ...department,
                departmentCode: e.target.value
              })
            }
          />

          {errors.departmentCode && (
            <span className="error-message">
              {errors.departmentCode}
            </span>
          )}

        </div>

        <div>

          <label>Department Type </label>

          <select
            className={errors.departmentType ? "error-field" : ""}
            value={department.departmentType}
            onChange={(e) =>
              setDepartment({
                ...department,
                departmentType: e.target.value
              })
            }
          >
            <option value="">Select Department Type</option>
            <option>Computer Science & Engineering</option>
            <option>Information Technology</option>
            <option>Artificial Intelligence & Data Science</option>
            <option>Electronics & Telecommunication</option>
            <option>Electrical Engineering</option>
            <option>Mechanical Engineering</option>
            <option>Civil Engineering</option>
            <option>MBA</option>
            <option>MCA</option>
            <option>BCA</option>
            <option>BBA</option>
            <option>Science</option>
            <option>Commerce</option>
            <option>Arts</option>
          </select>

          {errors.departmentType && (
            <span className="error-message">
              {errors.departmentType}
            </span>
          )}

        </div>

        <div>

          <label>HOD / Incharge Name </label>

          <input
            type="text"
            placeholder="Enter HOD Name"
            className={errors.hodName ? "error-field" : ""}
            value={department.hodName}
            onChange={(e) =>
              setDepartment({
                ...department,
                hodName: e.target.value
              })
            }
          />

          {errors.hodName && (
            <span className="error-message">
              {errors.hodName}
            </span>
          )}

        </div>

        <div></div>

      </div>

    </div>

    {/* Address Information */}
    <div className="section">

  <div className="section-title">
    <h2>Address Information</h2>
  </div>

  <div className="grid-4">

    <div>

      <label>Building / Block</label>

      <input
        type="text"
        placeholder="Enter Building / Block"
        className={errors.building ? "error-field" : ""}
        value={department.building}
        onChange={(e) =>
          setDepartment({
            ...department,
            building: e.target.value
          })
        }
      />

      {errors.building && (
        <span className="error-message">
          {errors.building}
        </span>
      )}

    </div>

    <div>

      <label>Floor / Room No. </label>

      <input
        type="text"
        placeholder="Enter Floor / Room No."
        className={errors.floor ? "error-field" : ""}
        value={department.floor}
        onChange={(e) =>
          setDepartment({
            ...department,
            floor: e.target.value
          })
        }
      />

      {errors.floor && (
        <span className="error-message">
          {errors.floor}
        </span>
      )}

    </div>

    <div>

      <label>Campus</label>

      <select
        className={errors.campus ? "error-field" : ""}
        value={department.campus}
        onChange={(e) =>
          setDepartment({
            ...department,
            campus: e.target.value
          })
        }
      >
        <option value="">Select Campus</option>
        <option>Main Campus</option>
        <option>North Campus</option>
        <option>South Campus</option>
        <option>Engineering Campus</option>
        <option>Management Campus</option>
      </select>

      {errors.campus && (
        <span className="error-message">
          {errors.campus}
        </span>
      )}

    </div>

  </div>

</div>

{/* Buttons */}
<div className="button-group">

  <button
    className="save-btn"
    onClick={handleSave}
  >
    Save
  </button>

  <button
    className="update-btn"
    onClick={handleUpdate}
  >
    Update
  </button>

  <button
    className="delete-btn"
    onClick={handleDelete}
  >
    Delete
  </button>

  <button
    className="back-btn"
    onClick={handleBack}
  >
    Back
  </button>

  <button
    className="clear-btn"
    onClick={handleClear}
  >
    Clear
  </button>

</div>

  </div>

</div>

  );
}

export default DepartmentMaster;