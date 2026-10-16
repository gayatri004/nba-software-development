import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEdit, FaEraser, FaArrowLeft, FaTrash } from "react-icons/fa";

const InternshipRecord = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_internships_list_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    companyName: "",
    durationFrom: "",
    durationTo: "",
    totalWeeks: "",
    workDescription: "",
    stipend: "",
    certificateFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [internshipList, setInternshipList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setInternshipList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Duration आठवड्यांमध्ये मोजणे
  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (updated.durationFrom && updated.durationTo) {
      const from = new Date(updated.durationFrom);
      const to = new Date(updated.durationTo);
      const diffTime = to - from;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = diffDays > 0 ? (diffDays / 7).toFixed(1) : 0;
      updated.totalWeeks = weeks;
    }
    setFormData(updated);
  };

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.durationFrom || !formData.durationTo) {
      alert("कृपया कंपनीचे नाव आणि कालावधी (From/To) भरा!");
      return;
    }

    if (parseFloat(formData.totalWeeks) < 2) {
      const confirmShort = window.confirm(
        "NBA नियमांनुसार किमान २ आठवड्यांची इंटर्नशिप अनिवार्य आहे. तरीही हा रेकॉर्ड सेव्ह करायचा आहे का?"
      );
      if (!confirmShort) return;
    }

    let updatedList = [];
    if (formData.id) {
      updatedList = internshipList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...internshipList, newItem];
    }

    setInternshipList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard सोबत सिंक करण्यासाठी
    localStorage.setItem(`nba_internships_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Internship / Industrial Training रेकॉर्ड सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा इंटर्नशिप रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = internshipList.filter((item) => item.id !== id);
      setInternshipList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_internships_${currentStudent.prn}`, JSON.stringify(updated));
    }
  };

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
            3
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Internship & Industrial Training</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 2.3 & 3.4 (20 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Internship Details</div>

          {/* Company / Organization Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Company / Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter Company / Organization Name"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Duration (Min 2 Weeks) */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Duration (Min 2 Weeks) *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto 1fr auto", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#64748b" }}>From</span>
              <input
                type="date"
                required
                value={formData.durationFrom}
                onChange={(e) => handleDateChange("durationFrom", e.target.value)}
                style={{ height: "32px", padding: "0 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px" }}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>To</span>
              <input
                type="date"
                required
                value={formData.durationTo}
                onChange={(e) => handleDateChange("durationTo", e.target.value)}
                style={{ height: "32px", padding: "0 8px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11px" }}
              />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#034694", whiteSpace: "nowrap" }}>
                {formData.totalWeeks ? `(${formData.totalWeeks} Weeks)` : ""}
              </span>
            </div>
          </div>

          {/* Work Description */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Work Description *
            </label>
            <textarea
              required
              rows="3"
              value={formData.workDescription}
              onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
              placeholder="Describe the work / tasks performed"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Stipend (If Any) */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Stipend (If Any)
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="Enter Stipend Amount"
                style={{ flex: 1, height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
              <span style={{ fontSize: "11px", color: "#64748b" }}>Per Month</span>
            </div>
          </div>

          {/* Certificate Upload */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Certificate Upload *
            </label>
            <input type="file" style={{ fontSize: "11px" }} />
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>PDF / JPG (Max. 5 MB)</div>
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

          {/* Internship Records Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Internship Records</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Company Name</th>
                <th style={{ padding: "6px" }}>Duration</th>
                <th style={{ padding: "6px" }}>Stipend</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {internshipList.length > 0 ? (
                internshipList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.companyName}</td>
                    <td style={{ padding: "6px" }}>{item.totalWeeks ? `${item.totalWeeks} Wks` : `${item.durationFrom} - ${item.durationTo}`}</td>
                    <td style={{ padding: "6px" }}>{item.stipend ? `₹ ${item.stipend}` : "-"}</td>
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

export default InternshipRecord;