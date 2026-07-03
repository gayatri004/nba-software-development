import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function EmployeeForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: "",
    designation: "",
    mobile: "",
    email: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = async () => {
    if (
      !formData.id ||
      !formData.name ||
      !formData.department ||
      !formData.designation ||
      !formData.mobile ||
      !formData.email
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      alert("Employee Form Submitted Successfully");

      setFormData({
        id: "",
        name: "",
        department: "",
        designation: "",
        mobile: "",
        email: "",
        status: "Active",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error saving employee");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Employee Form</h1>
        <p>Fill your employee details</p>

        <input
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="Employee ID"
        />

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Employee Name"
        />

        <input
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
        />

        <input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
        />

        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <select
          className="employee-select"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button onClick={submitForm}>
          Submit Form
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;