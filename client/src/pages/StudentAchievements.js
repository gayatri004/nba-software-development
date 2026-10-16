import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy, FaCertificate, FaUpload, FaCheckCircle } from "react-icons/fa";

const StudentAchievements = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Hackathon / Coding Competition",
    organizer: "",
    level: "National Level",
    positionWon: "Winner / 1st Prize",
    cashPrize: "₹ 50,000",
    eventDate: "",
    teamOrSolo: "Team Event",
    projectUrl: "",
    description: "",
  });

  const [proofUploaded, setProofUploaded] = useState(false);

  const handleProofUpload = (e) => {
    if (e.target.files[0]) {
      setProofUploaded(true);
      alert("Certificate / Proof successfully attached!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSave = {
      ...formData,
      proofStatus: proofUploaded ? "Verified Certificate Attached" : "Self-Attested",
      submissionDate: new Date().toLocaleDateString(),
    };

    // Save to local storage for Digital Academic Portfolio
    const existingAchievements = JSON.parse(localStorage.getItem("nba_student_achievements") || "[]");
    existingAchievements.push(dataToSave);
    localStorage.setItem("nba_student_achievements", JSON.stringify(existingAchievements));

    alert("Achievement यशस्वीरीत्या नोंदवले गेले! Digital Portfolio व Report R7 अपडेट झाले.");
    navigate("/student-dashboard");
  };

  return (
    <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/student-dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          color: "#0284c7",
          fontWeight: "700",
          cursor: "pointer",
          marginBottom: "18px",
          fontSize: "13px",
        }}
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      {/* Main Container */}
      <div
        style={{
          maxWidth: "740px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#0284c7", letterSpacing: "0.5px" }}>
            NBA CRITERION 4.2
          </span>
          <h2 style={{ margin: "4px 0", fontSize: "20px", color: "#0f172a", fontWeight: "800" }}>
            Student Technical Achievements & Awards Record
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
            Log external hackathons, research publications, and state/national engineering competition awards.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title / Competition Name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              Event / Competition / Research Paper Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Smart India Hackathon 2026 - Edge AI Precision Track"
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "7px",
                border: "1px solid #cbd5e1",
                fontSize: "12.5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Category & Level */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Achievement Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <option value="Hackathon / Coding Competition">Hackathon / Coding Competition</option>
                <option value="IEEE / Scopus Paper Publication">IEEE / Scopus Paper Publication</option>
                <option value="Technical Project Competition">Technical Project Expo</option>
                <option value="Patent / Copyright Filed">Patent / Copyright Filed</option>
                <option value="Sports / Co-Curricular National">Sports / Cultural National</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Event Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <option value="National Level">National Level</option>
                <option value="International Level">International Level</option>
                <option value="State / University Level">State / University Level</option>
                <option value="Inter-Collegiate Level">Inter-Collegiate Level</option>
              </select>
            </div>
          </div>

          {/* Organizer & Position Won */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Organizing Body / Institution *
              </label>
              <input
                type="text"
                required
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="e.g. Ministry of Education / IIT Bombay"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Position / Prize Won *
              </label>
              <input
                type="text"
                required
                value={formData.positionWon}
                onChange={(e) => setFormData({ ...formData, positionWon: e.target.value })}
                placeholder="e.g. 1st Prize Winner / Top 5 Finalist"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Cash Prize & Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Cash Reward / Scholarship (if any)
              </label>
              <input
                type="text"
                value={formData.cashPrize}
                onChange={(e) => setFormData({ ...formData, cashPrize: e.target.value })}
                placeholder="e.g. ₹ 75,000 (or Nil)"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                Event Month & Year *
              </label>
              <input
                type="text"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                placeholder="e.g. January 2026"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "7px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12.5px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
              Brief Technical Synopsis of Solution / Achievement *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the solution architecture, models deployed, and the real-world engineering impact..."
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "7px",
                border: "1px solid #cbd5e1",
                fontSize: "12.5px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Certificate Proof Upload */}
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "2px dashed #cbd5e1", textAlign: "center", marginBottom: "22px" }}>
            <input type="file" id="achievement-proof" onChange={handleProofUpload} style={{ display: "none" }} />
            <label htmlFor="achievement-proof" style={{ cursor: "pointer" }}>
              <FaUpload style={{ fontSize: "26px", color: "#0284c7", marginBottom: "6px" }} />
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Upload Certificate / Proof of Award (PDF/JPG)</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Mandatory document for NBA Tier-1 accreditation audit proof</div>
            </label>
            {proofUploaded && (
              <div style={{ marginTop: "8px", color: "#16a34a", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <FaCheckCircle /> Certificate Attached Successfully
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "11px",
              background: "#0284c7",
              color: "#fff",
              border: "none",
              borderRadius: "7px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
            }}
          >
            Save Achievement to Portfolio (Report R7)
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAchievements;