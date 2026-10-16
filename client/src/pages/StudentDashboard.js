import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaIndustry,
  FaLaptopCode,
  FaCertificate,
  FaPoll,
  FaGraduationCap,
  FaTrophy,
  FaBookOpen,
  FaBriefcase,
  FaUserFriends,
  FaFilePdf,
  FaThLarge,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaUserGraduate,
  FaTasks,
  FaClock
} from "react-icons/fa";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const currentStudent = JSON.parse(localStorage.getItem("currentStudent")) || {
    name: "Shrikant Kulkarni",
    prn: "PRN2024CS0101",
    department: "Computer Engineering (B.Tech)",
    semester: "Semester 6",
  };

  const [capstone, setCapstone] = useState(null);
  const [miniProjects, setMiniProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [nptel, setNptel] = useState([]);
  const [courseExit, setCourseExit] = useState([]);
  const [programExit, setProgramExit] = useState(null);
  const [events, setEvents] = useState([]);
  const [publications, setPublications] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [mentoring, setMentoring] = useState([]);

  useEffect(() => {
    const prn = currentStudent.prn;
    
    // 10 Forms Data Fetching
    const cData = localStorage.getItem(`nba_capstone_${prn}`);
    if (cData) setCapstone(JSON.parse(cData));

    const mData = localStorage.getItem(`nba_mini_projects_list_${prn}`);
    if (mData) setMiniProjects(JSON.parse(mData));

    const iData = localStorage.getItem(`nba_internships_list_${prn}`);
    if (iData) setInternships(JSON.parse(iData));

    const nData = localStorage.getItem(`nba_nptel_list_${prn}`);
    if (nData) setNptel(JSON.parse(nData));

    const ceData = localStorage.getItem(`nba_course_surveys_${prn}`);
    if (ceData) setCourseExit(JSON.parse(ceData));

    const peData = localStorage.getItem(`nba_program_exit_survey_${prn}`);
    if (peData) setProgramExit(JSON.parse(peData));

    const eData = localStorage.getItem(`nba_events_hackathons_${prn}`);
    if (eData) setEvents(JSON.parse(eData));

    const pubData = localStorage.getItem(`nba_publications_list_${prn}`);
    if (pubData) setPublications(JSON.parse(pubData));

    const pData = localStorage.getItem(`nba_placement_records_${prn}`);
    if (pData) setPlacements(JSON.parse(pData));

    const menData = localStorage.getItem(`nba_mentoring_facilities_${prn}`);
    if (menData) setMentoring(JSON.parse(menData));
  }, [currentStudent.prn]);

  // Criteria wise submission check
  const crit2Done = [capstone?.title, miniProjects.length > 0, internships.length > 0, nptel.length > 0].filter(Boolean).length;
  const crit3Done = [courseExit.length > 0, programExit !== null].filter(Boolean).length;
  const crit4Done = [events.length > 0, publications.length > 0, placements.length > 0].filter(Boolean).length;
  const crit9Done = mentoring.length > 0 ? 1 : 0;

  const totalSubmitted = crit2Done + crit3Done + crit4Done + crit9Done;

  // Dynamic Credits from Form 4
  const totalEarnedCredits = nptel.reduce((sum, item) => sum + Number(item.creditsClaimed || 0), 0);

  // Dynamic Placement from Form 9
  const latestPackage = placements.length > 0 ? (placements[0].packageOrScore || "Offer Logged") : "Pending";

  // Check for weak CO in Form 5
  const weakCoRecord = courseExit.find(c => c.weakCos && c.weakCos.trim() !== "");

  const sidebarLinks = [
    { title: "Overview Dashboard", icon: <FaThLarge />, path: "/student-dashboard", active: true },
    { section: "CRITERION 2 & 3: ACADEMIC & PROJECTS" },
    { title: "Form 1: Capstone Project", icon: <FaProjectDiagram />, path: "/student/capstone-project" },
    { title: "Form 2: Mini Project & Seminar", icon: <FaLaptopCode />, path: "/student/mini-project" },
    { title: "Form 3: Internship Training", icon: <FaIndustry />, path: "/student/internship" },
    { title: "Form 4: NPTEL & MOOCs Ledger", icon: <FaCertificate />, path: "/student/nptel" },
    { section: "CRITERION 3: ATTAINMENT SURVEYS" },
    { title: "Form 5: Course Exit Survey (COs)", icon: <FaPoll />, path: "/student/course-exit-survey" },
    { title: "Form 6: Program Exit Survey (POs)", icon: <FaGraduationCap />, path: "/student/program-exit-survey" },
    { section: "CRITERION 4 & 9: CAREER & MENTORING" },
    { title: "Form 7: Hackathons & Competitions", icon: <FaTrophy />, path: "/student/achievements" },
    { title: "Form 8: Research Publications", icon: <FaBookOpen />, path: "/student/publications" },
    { title: "Form 9: Placement & Higher Studies", icon: <FaBriefcase />, path: "/student/placement" },
    { title: "Form 10: Mentoring & Facilities", icon: <FaUserFriends />, path: "/student/mentoring-log" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      
      {/* 1. PROFESSIONAL SLEEK SIDEBAR */}
      <aside style={{ width: "280px", backgroundColor: "#0b1329", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #0284c7, #034694)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px" }}>
              <FaUserGraduate />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "#f8fafc", letterSpacing: "0.5px" }}>NBA TIER-II</div>
              <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "600" }}>Student Audit Portal</div>
            </div>
          </div>
        </div>

        {/* Scrollable Clean Links */}
        <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {sidebarLinks.map((item, idx) => {
              if (item.section) {
                return (
                  <div key={idx} style={{ fontSize: "9.5px", fontWeight: "800", color: "#475569", textTransform: "uppercase", padding: "14px 10px 4px 10px", letterSpacing: "0.8px" }}>
                    {item.section}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "9px 12px",
                    borderRadius: "7px",
                    fontSize: "12px",
                    fontWeight: item.active ? "700" : "500",
                    color: item.active ? "#ffffff" : "#94a3b8",
                    backgroundColor: item.active ? "#0284c7" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.backgroundColor = "#112240"; }}
                  onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span style={{ fontSize: "13px" }}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div style={{ padding: "16px", borderTop: "1px solid #1e293b", backgroundColor: "#060b17" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc" }}>{currentStudent.name}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{currentStudent.prn}</div>
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              title="Logout"
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. EXECUTIVE OVERVIEW MAIN AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ height: "70px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#0f172a" }}>Student Accreditation Overview</h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              {currentStudent.department} &bull; {currentStudent.semester} (Academic Year 2025-26)
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCheckCircle /> {totalSubmitted} / 10 Forms Completed
            </div>
            <button
              onClick={() => navigate("/reporting")}
              style={{
                backgroundColor: "#034694",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <FaFilePdf /> Export Audit Dossier
            </button>
          </div>
        </header>

        {/* Clean Dashboard Content */}
        <main style={{ padding: "32px 36px", overflowY: "auto", flex: 1 }}>
          
          {/* TOP 4 KEY PERFORMANCE METRICS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "28px" }}>
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Cumulative CGPA</div>
              <div style={kpiValStyle}>8.92</div>
              <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", marginTop: "4px" }}>First Class with Distinction</div>
            </div>
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Attendance Record</div>
              <div style={kpiValStyle}>88.4%</div>
              <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", marginTop: "4px" }}>Criteria 4 Compliant (&gt;75%)</div>
            </div>
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>MOOCs Credits Claimed</div>
              <div style={kpiValStyle}>{totalEarnedCredits > 0 ? `+${totalEarnedCredits} Credits` : "0 Credits"}</div>
              <div style={{ fontSize: "11px", color: "#0284c7", fontWeight: "700", marginTop: "4px" }}>PO12 Lifelong Learning</div>
            </div>
            <div style={kpiBoxStyle}>
              <div style={kpiLabelStyle}>Placement Status</div>
              <div style={kpiValStyle}>{latestPackage}</div>
              <div style={{ fontSize: "11px", color: placements.length > 0 ? "#16a34a" : "#64748b", fontWeight: "700", marginTop: "4px" }}>
                {placements.length > 0 ? "Offer Letter Validated" : "Awaiting Verification"}
              </div>
            </div>
          </div>

          {/* TWO MAIN SECTION PANELS: CRITERIA ATTAINMENT & EARLY WARNING */}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "22px", marginBottom: "28px" }}>
            
            {/* PANEL 1: CRITERIA SUBMISSION & WEIGHTAGE TABLE */}
            <div style={panelContainerStyle}>
              <div style={panelHeaderStyle}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>NBA Tier-II Criteria Evaluation Summary</h3>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Self-Assessment Weightage</span>
              </div>
              
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  
                  {/* Criterion 2 */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>
                      <span>Criterion 2: Teaching-Learning Processes (100 Marks)</span>
                      <span style={{ color: crit2Done === 4 ? "#16a34a" : "#f59e0b" }}>{crit2Done} / 4 Forms Logged</span>
                    </div>
                    <div style={progressBarBg}><div style={{ ...progressBarFill, width: `${(crit2Done / 4) * 100}%`, background: "#0284c7" }}></div></div>
                  </div>

                  {/* Criterion 3 */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>
                      <span>Criterion 3: Course & Program Outcomes (175 Marks)</span>
                      <span style={{ color: crit3Done === 2 ? "#16a34a" : "#f59e0b" }}>{crit3Done} / 2 Surveys Logged</span>
                    </div>
                    <div style={progressBarBg}><div style={{ ...progressBarFill, width: `${(crit3Done / 2) * 100}%`, background: "#10b981" }}></div></div>
                  </div>

                  {/* Criterion 4 */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>
                      <span>Criterion 4: Students' Performance (100 Marks)</span>
                      <span style={{ color: crit4Done === 3 ? "#16a34a" : "#f59e0b" }}>{crit4Done} / 3 Records Logged</span>
                    </div>
                    <div style={progressBarBg}><div style={{ ...progressBarFill, width: `${(crit4Done / 3) * 100}%`, background: "#6366f1" }}></div></div>
                  </div>

                  {/* Criterion 9 */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "5px" }}>
                      <span>Criterion 9: Student Support & Facilities (50 Marks)</span>
                      <span style={{ color: crit9Done === 1 ? "#16a34a" : "#f59e0b" }}>{crit9Done} / 1 Logged</span>
                    </div>
                    <div style={progressBarBg}><div style={{ ...progressBarFill, width: `${crit9Done * 100}%`, background: "#f59e0b" }}></div></div>
                  </div>

                </div>
              </div>
            </div>

            {/* PANEL 2: AUDIT ACTION ALERTS & WEAK CO MONITOR (FULLY DYNAMIC) */}
            <div style={panelContainerStyle}>
              <div style={panelHeaderStyle}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Continuous Improvement & Alerts</h3>
                <FaTasks style={{ color: "#0284c7" }} />
              </div>

              <div style={{ padding: "18px 20px" }}>
                
                {/* 1. Dynamic Weak CO Box */}
                {weakCoRecord ? (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b91c1c", fontWeight: "800", fontSize: "12px" }}>
                      <FaExclamationTriangle /> Weak Course Outcome Flagged
                    </div>
                    <p style={{ margin: "5px 0 0 0", fontSize: "11.5px", color: "#7f1d1d" }}>
                      Form 5 Survey: <strong>{weakCoRecord.subjectCode} ({weakCoRecord.weakCos})</strong> is below threshold. Remedial actions required.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px", marginBottom: "14px", fontSize: "11.5px", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCheckCircle style={{ color: "#16a34a" }} />
                    {courseExit.length > 0 
                      ? "All Course Outcomes achieved satisfactory attainment levels." 
                      : "No academic risk flagged. (Submit Form 5 to calculate CO attainment)"}
                  </div>
                )}

                {/* 2. Dynamic Mentoring Review Box */}
                {mentoring.length > 0 ? (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", fontWeight: "800", fontSize: "12px" }}>
                      <FaCheckCircle /> Mentoring Review Verified
                    </div>
                    <p style={{ margin: "5px 0 0 0", fontSize: "11.5px", color: "#14532d" }}>
                      Official mentoring log with <strong>{mentoring[0].mentorName}</strong> recorded on {mentoring[0].meetingDate}.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "12px", fontSize: "11.5px", color: "#b45309", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaClock />
                    Mentoring meeting not logged yet. Please submit Form 10.
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* QUICK AUDIT DIRECTORY NOTICE */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#0f172a" }}>Need to update specific criteria data?</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Please select the appropriate Form 1 to 10 directly from the sidebar navigation.</div>
            </div>
            <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: "700" }}>
              Sidebar Navigation Active &bull; PRN Isolated
            </div>
          </div>

        </main>
      </div>

    </div>
  );
};

// EXECUTIVE STYLING OBJECTS
const kpiBoxStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
};

const kpiLabelStyle = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const kpiValStyle = {
  fontSize: "22px",
  fontWeight: "900",
  color: "#034694",
  marginTop: "4px",
};

const panelContainerStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  overflow: "hidden",
};

const panelHeaderStyle = {
  padding: "14px 20px",
  borderBottom: "1px solid #f1f5f9",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

const progressBarBg = {
  height: "7px",
  backgroundColor: "#f1f5f9",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  borderRadius: "4px",
  transition: "width 0.4s ease",
};

export default StudentDashboard;