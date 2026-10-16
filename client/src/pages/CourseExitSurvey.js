import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEraser, FaArrowLeft, FaTrash, FaStar } from "react-icons/fa";

const CourseExitSurvey = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_course_surveys_list_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    academicYear: "2025-26",
    semester: "Semester 6",
    subjectCode: "",
    courseName: "",
    ratings: {
      CO1: 5,
      CO2: 4,
      CO3: 4,
      CO4: 5,
    },
    weakCos: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [surveyList, setSurveyList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSurveyList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Star Rating Handler
  const handleRating = (coKey, starValue) => {
    const updatedRatings = { ...formData.ratings, [coKey]: starValue };
    
    // Weak COs auto identify (ratings <= 2)
    const weakList = Object.entries(updatedRatings)
      .filter(([_, val]) => val <= 2)
      .map(([key]) => key);

    setFormData({
      ...formData,
      ratings: updatedRatings,
      weakCos: weakList.join(", "),
    });
  };

  // Average Rating Calculation
  const calculateAverage = (ratingsObj) => {
    const values = Object.values(ratingsObj);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(1);
  };

  // Save Survey Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.subjectCode || !formData.courseName) {
      alert("कृपया Subject Code आणि Course Name भरा!");
      return;
    }

    const avg = calculateAverage(formData.ratings);

    let updatedList = [];
    if (formData.id) {
      updatedList = surveyList.map((item) =>
        item.id === formData.id ? { ...formData, avgRating: avg } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        avgRating: avg,
      };
      updatedList = [...surveyList, newItem];
    }

    setSurveyList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard च्या indirect CO attainment साठी सिंक करणे
    localStorage.setItem(`nba_course_surveys_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Course Exit Survey रेकॉर्ड सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा सर्व्हे रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = surveyList.filter((item) => item.id !== id);
      setSurveyList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_course_surveys_${currentStudent.prn}`, JSON.stringify(updated));
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
            5
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Course Exit Survey Form</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 3.7.1 & 8.1.1 (25 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Course Details</div>

          {/* Academic Year & Semester */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Academic Year *
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>

          {/* Subject Code & Course Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                placeholder="e.g. CS602"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Course Name *
              </label>
              <input
                type="text"
                required
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="e.g. Design & Analysis of Algorithms"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* CO Feedback (Rate 1 to 5 Stars) */}
          <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "6px", marginBottom: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
              CO Feedback (Rate 1 to 5 Stars)
            </div>

            {["CO1", "CO2", "CO3", "CO4"].map((coKey) => (
              <div
                key={coKey}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: "11.5px",
                }}
              >
                <span style={{ fontWeight: "700", color: "#034694", width: "40px" }}>{coKey}</span>
                <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleRating(coKey, star)}
                      style={{
                        color: star <= formData.ratings[coKey] ? "#f59e0b" : "#cbd5e1",
                        fontSize: "15px",
                        transition: "color 0.1s",
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: "#64748b", fontSize: "11px", width: "50px", textAlign: "right" }}>
                  {formData.ratings[coKey]} / 5
                </span>
              </div>
            ))}
          </div>

          {/* Weak COs Identification */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Weak COs Identification
            </label>
            <input
              type="text"
              value={formData.weakCos}
              onChange={(e) => setFormData({ ...formData, weakCos: e.target.value })}
              placeholder="e.g. CO2 (Ratings <= 2 are flagged automatically)"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
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

          {/* Survey Records Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Survey Records</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Subject Code</th>
                <th style={{ padding: "6px" }}>Course Name</th>
                <th style={{ padding: "6px" }}>Avg. Rating</th>
                <th style={{ padding: "6px" }}>Weak CO</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {surveyList.length > 0 ? (
                surveyList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.subjectCode}</td>
                    <td style={{ padding: "6px" }}>{item.courseName}</td>
                    <td style={{ padding: "6px", fontWeight: "700", color: "#0284c7" }}>{item.avgRating} / 5</td>
                    <td style={{ padding: "6px", color: item.weakCos ? "#dc2626" : "#16a34a", fontWeight: "600" }}>
                      {item.weakCos || "None"}
                    </td>
                    <td style={{ padding: "6px" }}>
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

export default CourseExitSurvey;