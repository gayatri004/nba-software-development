import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEdit, FaEraser, FaArrowLeft, FaTrash, FaCertificate } from "react-icons/fa";

const NptelCertification = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_nptel_list_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    platform: "",
    courseName: "",
    score: "",
    category: "",
    creditsClaimed: "3",
    certificateFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [courseList, setCourseList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCourseList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Score वरून Category ऑटो-सिलेक्ट करणे
  const handleScoreChange = (val) => {
    let cat = formData.category;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num >= 90) cat = "Elite + Gold";
      else if (num >= 75) cat = "Elite + Silver";
      else if (num >= 60) cat = "Elite";
      else if (num >= 40) cat = "Successfully Completed";
      else cat = "No Certificate";
    }
    setFormData({ ...formData, score: val, category: cat });
  };

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.platform || !formData.courseName || !formData.score) {
      alert("कृपया Platform, Course Name आणि Final Score भरा!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      updatedList = courseList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...courseList, newItem];
    }

    setCourseList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard च्या Credits आणि NPTEL लिस्टसाठी सिंक करणे
    localStorage.setItem(`nba_nptel_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("SWAYAM / NPTEL / MOOCs रेकॉर्ड यशस्वीरीत्या सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा कोर्स रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = courseList.filter((item) => item.id !== id);
      setCourseList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_nptel_${currentStudent.prn}`, JSON.stringify(updated));
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
            4
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>SWAYAM / NPTEL / MOOCs Ledger</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 2.6 (10 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Course Details</div>

          {/* Platform Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Platform Name *
            </label>
            <select
              required
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
            >
              <option value="">Select Platform</option>
              <option value="SWAYAM / NPTEL">SWAYAM / NPTEL</option>
              <option value="Coursera">Coursera</option>
              <option value="edX">edX</option>
              <option value="Udemy">Udemy</option>
              <option value="Other MOOCs">Other MOOCs</option>
            </select>
          </div>

          {/* Course Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Course Name *
            </label>
            <input
              type="text"
              required
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="Enter Course Name (e.g. Cloud Computing / Deep Learning)"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Score & Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Final Score / Percentage *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={formData.score}
                onChange={(e) => handleScoreChange(e.target.value)}
                placeholder="Enter Score / % (e.g. 84)"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Elite / Silver / Gold Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="">Select Category</option>
                <option value="Elite + Gold">Elite + Gold (&gt;=90%)</option>
                <option value="Elite + Silver">Elite + Silver (75-89%)</option>
                <option value="Elite">Elite (60-74%)</option>
                <option value="Successfully Completed">Successfully Completed (40-59%)</option>
              </select>
            </div>
          </div>

          {/* Academic Credits Claimed */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Academic Credits Claimed *
            </label>
            <input
              type="number"
              min="1"
              max="6"
              required
              value={formData.creditsClaimed}
              onChange={(e) => setFormData({ ...formData, creditsClaimed: e.target.value })}
              placeholder="Enter Credits (e.g. 3 or 4)"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
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

          {/* Course Ledger Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Course Ledger</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Platform</th>
                <th style={{ padding: "6px" }}>Course Name</th>
                <th style={{ padding: "6px" }}>Score</th>
                <th style={{ padding: "6px" }}>Credits</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courseList.length > 0 ? (
                courseList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px" }}>{item.platform}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.courseName}</td>
                    <td style={{ padding: "6px" }}>{item.score}% ({item.category || "-"})</td>
                    <td style={{ padding: "6px", fontWeight: "700", color: "#0284c7" }}>+{item.creditsClaimed}</td>
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

export default NptelCertification;