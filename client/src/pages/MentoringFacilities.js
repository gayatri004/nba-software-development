import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEraser, FaArrowLeft, FaTrash, FaStar } from "react-icons/fa";

const MentoringFacilities = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_mentoring_facilities_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    mentorName: "Prof. Sneha Deshmukh",
    meetingDate: "",
    currentCgpa: "",             // <-- Dynamic CGPA
    attendancePercentage: "",    // <-- Dynamic Attendance %
    actionTaken: "",
    facilityRatings: {
      labs: 5,
      wifi: 4,
      classrooms: 4,
      library: 5,
    },
    outreachActivity: "",
    outreachHours: "",
    proofFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [recordList, setRecordList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRecordList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Star Rating Handler
  const handleRating = (key, val) => {
    setFormData({
      ...formData,
      facilityRatings: {
        ...formData.facilityRatings,
        [key]: val,
      },
    });
  };

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.mentorName || !formData.meetingDate || !formData.currentCgpa || !formData.attendancePercentage) {
      alert("कृपया Mentor Name, Meeting Date, CGPA आणि Attendance भरा!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      updatedList = recordList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...recordList, newItem];
    }

    setRecordList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard च्या Mentoring डेटासाठी थेट सिंक करणे
    localStorage.setItem(`nba_mentoring_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Mentoring, Academic Record (CGPA/Attendance) & Facilities Feedback सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा फीडबॅक रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = recordList.filter((item) => item.id !== id);
      setRecordList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_mentoring_${currentStudent.prn}`, JSON.stringify(updated));
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
            10
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Mentoring & Facilities Feedback</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 9.2, 9.3.2, 9.14 (25 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>
            Mentoring & Academic Status Review
          </div>

          {/* Mentor Name & Meeting Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Mentor Name *
              </label>
              <select
                value={formData.mentorName}
                onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="Prof. Sneha Deshmukh">Prof. Sneha Deshmukh</option>
                <option value="Dr. P. S. Kadam">Dr. P. S. Kadam</option>
                <option value="Prof. A. R. Patil">Prof. A. R. Patil</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Meeting Date *
              </label>
              <input
                type="date"
                required
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* NEW: Dynamic Academic Assessment Inputs (CGPA & Attendance) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#034694", display: "block", marginBottom: "4px" }}>
                Current Cumulative CGPA * (Max 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                placeholder="उदा. 8.92"
                value={formData.currentCgpa}
                onChange={(e) => setFormData({ ...formData, currentCgpa: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #93c5fd", backgroundColor: "#f0f9ff", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box", fontWeight: "600" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#034694", display: "block", marginBottom: "4px" }}>
                Term Attendance Percentage (%) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                placeholder="उदा. 88.4"
                value={formData.attendancePercentage}
                onChange={(e) => setFormData({ ...formData, attendancePercentage: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #93c5fd", backgroundColor: "#f0f9ff", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box", fontWeight: "600" }}
              />
            </div>
          </div>

          {/* Action Taken / Suggestions */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Action Taken / Mentoring Suggestions
            </label>
            <input
              type="text"
              value={formData.actionTaken}
              onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
              placeholder="e.g. Attendance is compliant, Recommended NPTEL course for advanced credits"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Facilities Feedback (Rate 1 to 5 Stars) */}
          <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "6px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#034694", marginBottom: "8px" }}>
              Facilities Feedback (Rate 1 to 5 Stars)
            </div>

            {[
              { key: "labs", label: "Labs / Equipment" },
              { key: "wifi", label: "Wi-Fi / Internet" },
              { key: "classrooms", label: "Classrooms" },
              { key: "library", label: "Library" },
            ].map((fac) => (
              <div
                key={fac.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "5px 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: "11.5px",
                }}
              >
                <span style={{ color: "#334155", fontWeight: "600" }}>{fac.label}</span>
                <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleRating(fac.key, star)}
                      style={{
                        color: star <= formData.facilityRatings[fac.key] ? "#f59e0b" : "#cbd5e1",
                        fontSize: "14px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social Outreach / NSS Participation */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Social Outreach / NSS Participation
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
              <input
                type="text"
                value={formData.outreachActivity}
                onChange={(e) => setFormData({ ...formData, outreachActivity: e.target.value })}
                placeholder="Enter Activity Name (e.g. Digital Literacy Drive / Blood Donation)"
                style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
              <input
                type="text"
                value={formData.outreachHours}
                onChange={(e) => setFormData({ ...formData, outreachHours: e.target.value })}
                placeholder="Activity Hours (e.g. 20 Hrs)"
                style={{ height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Proof / Document Upload */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Proof / Document Upload
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

          {/* Feedback Records Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>
            Feedback & Mentoring Log Records
          </div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Mentor</th>
                <th style={{ padding: "6px" }}>Date</th>
                <th style={{ padding: "6px" }}>CGPA</th>
                <th style={{ padding: "6px" }}>Attendance</th>
                <th style={{ padding: "6px" }}>Action Taken</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recordList.length > 0 ? (
                recordList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.mentorName}</td>
                    <td style={{ padding: "6px" }}>{item.meetingDate}</td>
                    <td style={{ padding: "6px", color: "#034694", fontWeight: "700" }}>{item.currentCgpa || "-"}</td>
                    <td style={{ padding: "6px", color: "#16a34a", fontWeight: "700" }}>
                      {item.attendancePercentage ? `${item.attendancePercentage}%` : "-"}
                    </td>
                    <td style={{ padding: "6px" }}>{item.actionTaken || "-"}</td>
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
                  <td colSpan="7" style={{ textAlign: "center", padding: "12px", color: "#94a3b8" }}>
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

export default MentoringFacilities;