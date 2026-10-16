import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEraser, FaArrowLeft, FaTrash } from "react-icons/fa";

const StudentPublications = () => {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Student Name",
    prn: "PRN2024CS0101",
  };

  const storageKey = `nba_publications_list_${currentStudent.prn}`;

  const initialForm = {
    id: null,
    title: "",
    journalConference: "",
    issnIsbn: "",
    publicationType: "Conference",
    doiLink: "",
    bestPaperAward: "No",
    documentFile: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [publicationList, setPublicationList] = useState([]);

  // Load Saved Records
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setPublicationList(JSON.parse(saved));
    }
  }, [storageKey]);

  // Save / Update Handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.journalConference) {
      alert("कृपया Paper Title आणि Journal / Conference Name भरा!");
      return;
    }

    let updatedList = [];
    if (formData.id) {
      updatedList = publicationList.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      updatedList = [...publicationList, newItem];
    }

    setPublicationList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Dashboard च्या Publications डेटासाठी सिंक करणे
    localStorage.setItem(`nba_publications_${currentStudent.prn}`, JSON.stringify(updatedList));

    alert("Research Publication रेकॉर्ड सेव्ह झाला!");
    setFormData(initialForm);
  };

  const handleEdit = (item) => {
    setFormData(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("हा पब्लिकेशन रेकॉर्ड डिलीट करायचा आहे का?")) {
      const updated = publicationList.filter((item) => item.id !== id);
      setPublicationList(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.setItem(`nba_publications_${currentStudent.prn}`, JSON.stringify(updated));
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
            8
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "800" }}>Student Research Publications</div>
            <div style={{ fontSize: "10.5px", color: "#bae6fd" }}>Criterion 4.7.3 & 4.7.4 (10 Marks)</div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "18px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#034694", marginBottom: "12px" }}>Publication Details</div>

          {/* Paper Title */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Paper Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter Paper Title"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* Journal / Conference Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Journal / Conference Name *
            </label>
            <input
              type="text"
              required
              value={formData.journalConference}
              onChange={(e) => setFormData({ ...formData, journalConference: e.target.value })}
              placeholder="Enter Journal / Conference Name"
              style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
            />
          </div>

          {/* ISSN/ISBN Number & Publication Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                ISSN / ISBN Number
              </label>
              <input
                type="text"
                value={formData.issnIsbn}
                onChange={(e) => setFormData({ ...formData, issnIsbn: e.target.value })}
                placeholder="Enter ISSN / ISBN"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Publication Type *
              </label>
              <select
                value={formData.publicationType}
                onChange={(e) => setFormData({ ...formData, publicationType: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="Journal">Journal (Peer-Reviewed)</option>
                <option value="Conference">Conference Paper (IEEE/Springer)</option>
                <option value="Newsletter">Department Newsletter / Magazine</option>
              </select>
            </div>
          </div>

          {/* DOI Link & Best Paper Award */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                DOI Link
              </label>
              <input
                type="text"
                value={formData.doiLink}
                onChange={(e) => setFormData({ ...formData, doiLink: e.target.value })}
                placeholder="https://doi.org/10.xxxx/xxxx"
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                Best Paper Award
              </label>
              <select
                value={formData.bestPaperAward}
                onChange={(e) => setFormData({ ...formData, bestPaperAward: e.target.value })}
                style={{ width: "100%", height: "32px", padding: "0 10px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "11.5px", background: "#fff", boxSizing: "border-box" }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes (Award Won)</option>
              </select>
            </div>
          </div>

          {/* Document / Paper Upload */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
              Document / Paper Upload *
            </label>
            <input type="file" style={{ fontSize: "11px" }} />
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>PDF (Max. 5 MB)</div>
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

          {/* Publications Records Table */}
          <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#034694", marginBottom: "6px" }}>Publications Records</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left", border: "1px solid #e2e8f0" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
                <th style={{ padding: "6px" }}>Sr.No</th>
                <th style={{ padding: "6px" }}>Paper Title</th>
                <th style={{ padding: "6px" }}>Type</th>
                <th style={{ padding: "6px" }}>ISSN/ISBN</th>
                <th style={{ padding: "6px" }}>Best Paper</th>
                <th style={{ padding: "6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {publicationList.length > 0 ? (
                publicationList.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "6px" }}>{idx + 1}</td>
                    <td style={{ padding: "6px", fontWeight: "700" }}>{item.title}</td>
                    <td style={{ padding: "6px" }}>{item.publicationType}</td>
                    <td style={{ padding: "6px" }}>{item.issnIsbn || "-"}</td>
                    <td style={{ padding: "6px", color: item.bestPaperAward === "Yes" ? "#16a34a" : "#64748b", fontWeight: "700" }}>
                      {item.bestPaperAward}
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

export default StudentPublications;