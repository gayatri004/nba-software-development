import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEdit, FaEraser, FaList, FaArrowLeft, FaTrash } from "react-icons/fa";

const CapstoneProject = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_capstone_list_${currentStudent.prn}`;

  // Form State
  const initialForm = {
    id: null,
    title: "",
    guideName: "",
    projectType: "",
    domain: "",
    selectedSdg: "",
    otherSdg: "",
    envRubric: "",
    safetyRubric: "",
    ethicsRubric: "",
    reportFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [projectList, setProjectList] = useState([]);
  const [selectedSdgsList, setSelectedSdgsList] = useState([9, 11]); // default tags like image

  // Load Saved Data
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setProjectList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Save or Add
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.guideName) {
      alert("Krupaya Title aani Guide Name bhara!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      // Update existing
      updatedList = projectList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      // Add new
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...projectList, newItem];
    }

    setProjectList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard sathi latest project save karne
    localStorage.setItem(`nba_capstone_${currentStudent.prn}`, JSON.stringify(formData));

    alert("Capstone Project record successfully save zala!");
    setFormData(initialForm);
  };

  // Edit Click
  const handleEdit = (item) => {
    setFormData(item);
  };

  // Delete Click
  const handleDelete = (id) => {
    if (window.confirm("Ha project record delete karaycha ahe ka?")) {
      const updated = projectList.filter((item) => item.id !== id);
      setProjectList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // Clear Form
  const handleClear = () => {
    setFormData(initialForm);
  };

  // SDG Tag Toggle
  const toggleSdg = (num) => {
    if (selectedSdgsList.includes(num)) {
      setSelectedSdgsList(selectedSdgsList.filter((n) => n !== num));
    } else {
      setSelectedSdgsList([...selectedSdgsList, num]);
    }
  };

  const sdgColors = [
    "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2",
    "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E",
    "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"
  ];

  return (
    <div style={{ backgroundColor: "#e2e8f0", minHeight: "100vh", padding: "20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Top Navigation */}
      <div style={{ maxWidth: "800px", margin: "0 auto 12px auto" }}>
        <button
          onClick={() => navigate("/student-dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#034694",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

      {/* Main Form Card */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Blue Header */}
        <div style={{ backgroundColor: "#034694", color: "#ffffff", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#034694",
              fontWeight: "900",
              borderRadius: "4px",
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            1
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Capstone / Major Project Form</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 2.2, 2.7, 3.5, 3.6 (55 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Project Details</div>

          {/* Project Title */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter Project Title"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* Guide Name */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Guide Name *</label>
            <input
              type="text"
              required
              value={formData.guideName}
              onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
              placeholder="Enter Guide / Supervisor Name"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* Project Type */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Project Type *</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff" }}
            >
              <option value="">Select Project Type</option>
              <option value="Product / Working Model">Product / Working Model</option>
              <option value="Application Development">Application Development</option>
              <option value="Research Oriented">Research Oriented</option>
              <option value="Review / Feasibility Study">Review / Feasibility Study</option>
            </select>
          </div>

          {/* Project Domain */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Project Domain *</label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="Select Domain (e.g. AI/ML, Cloud, IoT, Web)"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* UN SDG Mapping */}
          <div style={{ marginBottom: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
              UN SDG Mapping (Select SDG 1 to 17)
            </label>
            <select
              value={formData.selectedSdg}
              onChange={(e) => setFormData({ ...formData, selectedSdg: e.target.value })}
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", marginBottom: "8px", background: "#fff" }}
            >
              <option value="">Select SDG Number(s)</option>
              <option value="SDG 3: Good Health and Well-being">SDG 3: Good Health and Well-being</option>
              <option value="SDG 7: Affordable and Clean Energy">SDG 7: Affordable and Clean Energy</option>
              <option value="SDG 9: Industry, Innovation and Infrastructure">SDG 9: Industry, Innovation and Infrastructure</option>
              <option value="SDG 11: Sustainable Cities and Communities">SDG 11: Sustainable Cities and Communities</option>
              <option value="SDG 12: Responsible Consumption and Production">SDG 12: Responsible Consumption and Production</option>
              <option value="SDG 13: Climate Action">SDG 13: Climate Action</option>
            </select>

            {/* SDG Color Tiles (1 to 17) */}
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
              {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedSdgsList.includes(num);
                return (
                  <div
                    key={num}
                    onClick={() => toggleSdg(num)}
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: sdgColors[num - 1],
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "900",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "3px",
                      cursor: "pointer",
                      border: isSelected ? "2.5px solid #000" : "1px solid transparent",
                      boxShadow: isSelected ? "0 0 5px rgba(0,0,0,0.5)" : "none",
                    }}
                  >
                    {num}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: "10.5px", color: "#64748b" }}>Selected SDGs: {selectedSdgsList.join(", ") || "None"}</div>
          </div>

          {/* Rubrics Box */}
          <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
              Environment / Safety / Ethics Rubrics (Out of 25)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#64748b" }}>Environment (0/10)</span>
                <input
                  type="number"
                  max="10"
                  min="0"
                  value={formData.envRubric}
                  onChange={(e) => setFormData({ ...formData, envRubric: e.target.value })}
                  placeholder="0 / 10"
                  style={{ width: "100%", height: "30px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 6px", fontSize: "11px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#64748b" }}>Safety (0/10)</span>
                <input
                  type="number"
                  max="10"
                  min="0"
                  value={formData.safetyRubric}
                  onChange={(e) => setFormData({ ...formData, safetyRubric: e.target.value })}
                  placeholder="0 / 10"
                  style={{ width: "100%", height: "30px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 6px", fontSize: "11px", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#64748b" }}>Ethics (0/5)</span>
                <input
                  type="number"
                  max="5"
                  min="0"
                  value={formData.ethicsRubric}
                  onChange={(e) => setFormData({ ...formData, ethicsRubric: e.target.value })}
                  placeholder="0 / 5"
                  style={{ width: "100%", height: "30px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "0 6px", fontSize: "11px", boxSizing: "border-box" }}
                />
              </div>
            </div>
          </div>

          {/* Project Report File */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>Project Report / Document</label>
            <input type="file" style={{ fontSize: "11px" }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#0284c7",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "11.5px",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FaSave /> Save
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "11.5px",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FaEdit /> Update
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                backgroundColor: "#f59e0b",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "11.5px",
                fontWeight: "700",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FaEraser /> Clear
            </button>
          </div>

          {/* Submitted Projects Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Submitted Projects</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Title</th>
                <th style={{ padding: "6px" }}>Guide Name</th>
                <th style={{ padding: "6px" }}>Type</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {projectList.length > 0 ? (
                projectList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.title}</td>
                    <td style={{ padding: "6px" }}>{item.guideName}</td>
                    <td style={{ padding: "6px" }}>{item.projectType}</td>
                    <td style={{ padding: "6px", display: "flex", gap: "6px" }}>
                      <button type="button" onClick={() => handleEdit(item)} style={{ background: "none", border: "none", color: "#0284c7", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>Edit</button>
                      <button type="button" onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "11px" }}><FaTrash /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "12px", color: "#94a3b8" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default CapstoneProject;