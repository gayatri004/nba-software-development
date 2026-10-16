import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEraser, FaArrowLeft, FaTrash } from "react-icons/fa";

const PlacementHigherStudies = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_placement_records_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    type: "Campus Placement",
    companyOrInstitute: "",
    designation: "",
    packageOrScore: "",
    joiningDate: "",
    startupDetails: "",
    proofFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [placementList, setPlacementList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setPlacementList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.companyOrInstitute || !formData.designation) {
      alert("कृपया Company / Institute Name आणि Designation / Course भरा!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      updatedList = placementList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...placementList, newItem];
    }

    setPlacementList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard च्या Placement विजेटसाठी सिंक करणे
    localStorage.setItem(`nba_placement_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Placement / Higher Studies / Startup रेकॉर्ड सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = placementList.filter((item) => item.id !== id);
      setPlacementList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_placement_${currentStudent.prn}`, JSON.stringify(updated));
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
            9
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Placement, Higher Studies & Startups</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 4.6, 9.4, 9.5 (45 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>
            Placement / Higher Studies / Startup Details
          </div>

          {/* Type */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
            >
              <option value="Campus Placement">Campus Placement Offer</option>
              <option value="Higher Studies">Higher Studies (GATE / GRE / CAT / M.Tech)</option>
              <option value="Startup / Entrepreneurship">Startup / Entrepreneurship</option>
            </select>
          </div>

          {/* Company / Institute Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Company / Institute Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyOrInstitute}
              onChange={(e) => setFormData({ ...formData, companyOrInstitute: e.target.value })}
              placeholder="Enter Company / Institute / Startup Name"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Designation & Package / Score */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Designation / Course *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Software Engineer / M.Tech"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Package (LPA) / GATE Score
              </label>
              <input
                type="text"
                value={formData.packageOrScore}
                onChange={(e) => setFormData({ ...formData, packageOrScore: e.target.value })}
                placeholder="e.g. 7.5 LPA / Score: 680"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Joining Date */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Joining Date / Admission Date
            </label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Entrepreneurship / Startup Details */}
          {formData.type === "Startup / Entrepreneurship" && (
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Entrepreneurship / Startup Details (Registration / MSME)
              </label>
              <textarea
                rows="2"
                value={formData.startupDetails}
                onChange={(e) => setFormData({ ...formData, startupDetails: e.target.value })}
                placeholder="Enter Startup domain, website, incubation support or registration number"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
          )}

          {/* Proof Upload */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Proof / Offer Letter / Document Upload *
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

          {/* Records Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Placement Records</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Type</th>
                <th style={{ padding: "6px" }}>Company / Institute</th>
                <th style={{ padding: "6px" }}>Designation</th>
                <th style={{ padding: "6px" }}>Package / Score</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {placementList.length > 0 ? (
                placementList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px" }}>{item.type}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.companyOrInstitute}</td>
                    <td style={{ padding: "6px" }}>{item.designation}</td>
                    <td style={{ padding: "6px", color: "#16a34a", fontWeight: "700" }}>
                      {item.packageOrScore || "-"}
                    </td>
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

export default PlacementHigherStudies;