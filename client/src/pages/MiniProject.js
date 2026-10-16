import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEdit, FaEraser, FaArrowLeft, FaTrash } from "react-icons/fa";

const MiniProject = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_mini_projects_list_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    title: "",
    activityType: "",
    domain: "",
    githubUrl: "",
    posMapped: [],
    certificateFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [activityList, setActivityList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setActivityList(JSON.parse(saved));
    }
  }, [storageKey]);

  // PO Checkbox Toggle
  const togglePo = (po) => {
    setFormData((prev) => ({
      ...prev,
      posMapped: prev.posMapped.includes(po)
        ? prev.posMapped.filter((p) => p !== po)
        : [...prev.posMapped, po],
    }));
  };

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.activityType || !formData.domain) {
      alert("Krupaya Title, Activity Type aani Domain bhara!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      // Update existing item
      updatedList = activityList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...activityList, newItem];
    }

    setActivityList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard synchronisation sathi update
    localStorage.setItem(`nba_mini_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Mini Project / Seminar record successfully save zala!");
    setFormData(initialForm);
  };

  // Edit record
  const handleEdit = (item) => {
    setFormData(item);
  };

  // Delete record
  const handleDelete = (id) => {
    if (window.confirm("Ha record delete karaycha ahe ka?")) {
      const updated = activityList.filter((item) => item.id !== id);
      setActivityList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_mini_${currentStudent.prn}`, JSON.stringify(updated));
    }
  };

  // Clear form
  const handleClear = () => {
    setFormData(initialForm);
  };

  return (
    <div style={{ backgroundColor: "#e2e8f0", minHeight: "100vh", padding: "20px", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Top Back Navigation */}
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

      {/* Main Form Container */}
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
            2
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Mini Project & Seminar Form</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 2.4 (10 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Activity Details</div>

          {/* Title */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title of Mini Project / Seminar"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* Activity Type */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Activity Type *</label>
            <select
              required
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff" }}
            >
              <option value="">Select Type</option>
              <option value="Mini Project">Mini Project</option>
              <option value="Technical Seminar">Technical Seminar</option>
              <option value="Micro Project">Micro Project</option>
            </select>
          </div>

          {/* Technical Domain */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Technical Domain *</label>
            <input
              type="text"
              required
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="Select Domain (e.g. Full Stack, IoT, Cyber Security)"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* Github / Report Link */}
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155" }}>Github / Report Link</label>
            <input
              type="text"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/username/repo or Drive Link"
              style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px" }}
            />
          </div>

          {/* PO Mapping Checkboxes */}
          <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
              PO Mapping *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", fontSize: "11.5px", color: "#334155" }}>
              {["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11", "PO12"].map((po) => (
                <label key={po} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.posMapped.includes(po)}
                    onChange={() => togglePo(po)}
                    style={{ accentColor: "#0284c7" }}
                  />
                  {po}
                </label>
              ))}
            </div>
            <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "4px" }}>
              Selected: {formData.posMapped.length > 0 ? formData.posMapped.join(", ") : "None"}
            </div>
          </div>

          {/* Certificate / Document Upload */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Certificate / Document
            </label>
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

          {/* Submitted Activities Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Submitted Activities</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Title</th>
                <th style={{ padding: "6px" }}>Type</th>
                <th style={{ padding: "6px" }}>Domain</th>
                <th style={{ padding: "6px" }}>POs Mapped</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activityList.length > 0 ? (
                activityList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.title}</td>
                    <td style={{ padding: "6px" }}>{item.activityType}</td>
                    <td style={{ padding: "6px" }}>{item.domain}</td>
                    <td style={{ padding: "6px" }}>{item.posMapped?.join(", ") || "-"}</td>
                    <td style={{ padding: "6px", display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        style={{ background: "none", border: "none", color: "#0284c7", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "11px" }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "12px", color: "#94a3b8" }}>
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

export default MiniProject;