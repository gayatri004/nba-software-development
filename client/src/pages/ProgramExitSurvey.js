import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEraser, FaArrowLeft, FaStar, FaCheckCircle } from "react-icons/fa";

const ProgramExitSurvey = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
    department: "Computer Engineering",
  };

  const storageKey = `nba_program_exit_survey_${currentStudent.prn}`;

  const poList = [
    { id: "PO1", name: "PO1: Engineering Knowledge", desc: "Apply knowledge of mathematics, science, engineering fundamentals to solve complex problems." },
    { id: "PO2", name: "PO2: Problem Analysis", desc: "Identify, formulate, review research literature, and analyze complex engineering problems." },
    { id: "PO3", name: "PO3: Design/Development of Solutions", desc: "Design solutions for complex problems with consideration of public health, safety, and culture." },
    { id: "PO4", name: "PO4: Conduct Investigations", desc: "Use research-based knowledge and methods including design of experiments to provide valid conclusions." },
    { id: "PO5", name: "PO5: Modern Tool Usage", desc: "Create, select, and apply appropriate modern engineering and IT tools (IDE, Git, Cloud)." },
    { id: "PO6", name: "PO6: The Engineer and Society", desc: "Apply reasoning informed by contextual knowledge to assess societal, health, and legal issues." },
    { id: "PO7", name: "PO7: Environment & Sustainability", desc: "Understand impact of professional engineering solutions in environmental contexts and sustainability." },
    { id: "PO8", name: "PO8: Ethics", desc: "Apply ethical principles and commit to professional ethics and responsibilities." },
    { id: "PO9", name: "PO9: Individual & Team Work", desc: "Function effectively as an individual, and as a member or leader in diverse and multidisciplinary teams." },
    { id: "PO10", name: "PO10: Communication", desc: "Communicate effectively on complex engineering activities with community and write effective reports." },
    { id: "PO11", name: "PO11: Project Management", desc: "Demonstrate knowledge and understanding of management principles and apply to manage projects." },
    { id: "PO12", name: "PO12: Life-long Learning", desc: "Recognize the need for, and have preparation and ability to engage in independent life-long learning." },
  ];

  const psoList = [
    { id: "PSO1", name: "PSO1: Modular Architecture", desc: "Design and develop full-stack enterprise computing software with optimal algorithms." },
    { id: "PSO2", name: "PSO2: AI & Cloud Integration", desc: "Apply cloud services, AI/ML pipelines, and cybersecurity protocols to industry applications." },
  ];

  const initialForm = {
    batch: "2022-2026",
    poRatings: {
      PO1: 5, PO2: 4, PO3: 5, PO4: 4, PO5: 5, PO6: 4,
      PO7: 5, PO8: 5, PO9: 4, PO10: 4, PO11: 4, PO12: 5,
    },
    psoRatings: {
      PSO1: 5,
      PSO2: 4,
    },
  };

  const [formData, setFormData] = useState(initialForm);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [storageKey]);

  const handlePoRate = (poId, star) => {
    setFormData({
      ...formData,
      poRatings: { ...formData.poRatings, [poId]: star },
    });
  };

  const handlePsoRate = (psoId, star) => {
    setFormData({
      ...formData,
      psoRatings: { ...formData.psoRatings, [psoId]: star },
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Attainment % Calculate
    const poVals = Object.values(formData.poRatings);
    const psoVals = Object.values(formData.psoRatings);
    const allVals = [...poVals, ...psoVals];
    const sum = allVals.reduce((acc, curr) => acc + curr, 0);
    const avgScore = (sum / allVals.length).toFixed(2);
    const attainmentPercentage = `${((avgScore / 5) * 100).toFixed(1)}%`;

    const payload = {
      ...formData,
      avgScore,
      attainmentPercentage,
      submittedDate: new Date().toLocaleDateString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(payload));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    alert(`Program Exit Survey सेव्ह झाला! एकूण अटेनमेंट स्कोअर: ${attainmentPercentage}`);
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
            6
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Program Exit Survey Form</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 3.8 & 9.3 (35 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          {success && (
            <div style={{ background: "#dcfce7", color: "#166534", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCheckCircle /> Program Outcomes Attainment Survey Recorded!
            </div>
          )}

          {/* Graduating Batch */}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Graduating Batch *
            </label>
            <select
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
            >
              <option value="2022-2026">2022 - 2026 (Final Year Graduating Batch)</option>
              <option value="2021-2025">2021 - 2025</option>
            </select>
          </div>

          {/* Program Outcomes (PO1 - PO12) Ratings */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", display: "block", marginBottom: "6px" }}>
              Program Outcomes (PO1 - PO12) Ratings
            </label>
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "8px 12px",
                background: "#f8fafc",
              }}
            >
              {poList.map((po) => (
                <div
                  key={po.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "11.5px",
                  }}
                >
                  <div style={{ paddingRight: "10px", flex: 1 }}>
                    <strong style={{ color: "#0f172a" }}>{po.name}</strong>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>{po.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "120px", justifyContent: "flex-end" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handlePoRate(po.id, star)}
                        style={{
                          color: star <= (formData.poRatings[po.id] || 0) ? "#f59e0b" : "#cbd5e1",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                    <span style={{ fontSize: "11px", fontWeight: "700", width: "24px", textAlign: "right", color: "#334155" }}>
                      {formData.poRatings[po.id]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Specific Outcomes (PSOs) */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", display: "block", marginBottom: "6px" }}>
              Program Specific Outcomes (PSO)
            </label>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", background: "#f8fafc" }}>
              {psoList.map((pso) => (
                <div
                  key={pso.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "11.5px",
                  }}
                >
                  <div style={{ paddingRight: "10px", flex: 1 }}>
                    <strong style={{ color: "#0f172a" }}>{pso.name}</strong>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>{pso.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "120px", justifyContent: "flex-end" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handlePsoRate(pso.id, star)}
                        style={{
                          color: star <= (formData.psoRatings[pso.id] || 0) ? "#f59e0b" : "#cbd5e1",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                    <span style={{ fontSize: "11px", fontWeight: "700", width: "24px", textAlign: "right", color: "#334155" }}>
                      {formData.psoRatings[pso.id]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#0284c7",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px",
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
                padding: "6px 16px",
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
            <button
              type="button"
              onClick={() => alert(`Cumulative Exit Survey Attainment Calculated: ${formData.batch} Batch.`)}
              style={{
                backgroundColor: "#64748b",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 16px",
                fontSize: "11.5px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              View Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramExitSurvey;