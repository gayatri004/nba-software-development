import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NBAContent from "./pages/NBAContent";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Department from "./pages/Department";
import FacultyManagement from "./pages/FacultyManagement";
import Leave from "./pages/Leave";
import Course from "./pages/Course";
import FacultyForm from "./pages/FacultyForm";
import DepartmentMaster from "./pages/DepartmentMaster";
import CollegeForm from "./pages/CollegeForm";
import CourseMaster from "./pages/CourseMaster";

// =========================================================
// CRITERIA 1
// =========================================================

import VisionMission from "./pages/VisionMission";
import Curriculum from "./pages/Curriculum";
import PoPso from "./pages/PoPso";
import CourseMatrix from "./pages/CourseMatrix";
import ArticulationMatrix from "./pages/ArticulationMatrix";

// =========================================================
// CRITERIA 2
// =========================================================

import QualityTeachingLearning from "./criteria/QualityTeachingLearning";
import CapstoneProject from "./criteria/CapstoneProject";
import Internship from "./criteria/Internship";
import SeminarMiniProject from "./criteria/SeminarMiniProject";
import CaseStudy from "./criteria/CaseStudy";
import NptelSwayam from "./criteria/NptelSwayam";
import SolvingComplexProblems from "./criteria/SolvingComplexProblems";
import IndustryInstitutePartnership from "./criteria/IndustryInstitutePartnership";

// =========================================================
// CRITERIA 5
// =========================================================

import Criteria5SFR from "./pages/Criteria5SFR";
import Criteria5Qual from "./pages/Criteria5Qual";
import FacultyCadreProportion from "./pages/FacultyCadreProportion";
import Criteria54VisitingFaculty from "./pages/Criteria54VisitingFaculty";
import Criteria55FacultyRetention from "./pages/Criteria55FacultyRetention";

// =========================================================
// CRITERIA 6
// =========================================================

import Criteria6 from "./pages/Criteria6";
import FacultyDevelopment from "./pages/FacultyDevelopment";
import FacultyActivities from "./pages/FacultyActivities";
import ResearchConsultancy from "./pages/ResearchConsultancy";
import MembershipAdd from "./pages/MembershipAdd";
import ResourcePersonAdd from "./pages/ResourcePersonAdd";
import ParticipationAdd from "./pages/ParticipationAdd";
import MoocsAdd from "./pages/MoocsAdd";
import FdpAdd from "./pages/FdpAdd";
import StudentProjectAdd from "./pages/StudentProjectAdd";
import InternshipAdd from "./pages/InternshipAdd";
import AcademicResearchAdd from "./pages/AcademicResearchAdd";
import PhdStudentAdd from "./pages/PhdStudentAdd";
import SponsoredResearchAdd from "./pages/SponsoredResearchAdd";
import ConsultancyAdd from "./pages/ConsultancyAdd";
import SeedMoneyAdd from "./pages/SeedMoneyAdd";

import MembershipView from "./pages/MembershipView";
import ResourcePersonView from "./pages/ResourcePersonView";
import ParticipationView from "./pages/ParticipationView";
import MoocsView from "./pages/MoocsView";
import FdpView from "./pages/FdpView";
import StudentProjectView from "./pages/StudentProjectView";
import InternshipView from "./pages/InternshipView";
import AcademicResearchView from "./pages/AcademicResearchView";
import PhdStudentView from "./pages/PhdStudentView";
import SponsoredResearchView from "./pages/SponsoredResearchView";
import ConsultancyView from "./pages/ConsultancyView";
import SeedMoneyView from "./pages/SeedMoneyView";
import SwayamDevelopmentAdd from "./pages/SwayamDevelopmentAdd";
import SwayamDevelopmentView from "./pages/SwayamDevelopmentView";
import DevelopmentActivityAdd from "./pages/DevelopmentActivityAdd";
import DevelopmentActivityView from "./pages/DevelopmentActivityView";

// =========================================================
// APP
// =========================================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // =======================================================
  // PROTECTED ROUTE
  // =======================================================

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>

      {/* ===================================================
          DEFAULT / AUTH
      =================================================== */}

      <Route path="/" element={<Welcome />} />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={
          <Login setIsLoggedIn={setIsLoggedIn} />
        }
      />

      {/* ===================================================
          NBA CONTENT
      =================================================== */}

      <Route
        path="/nba-content"
        element={
          <ProtectedRoute>
            <NBAContent />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          HOME
      =================================================== */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          FORMS
      =================================================== */}

      <Route
        path="/faculty-form"
        element={<FacultyForm />}
      />

      <Route
        path="/department-master"
        element={<DepartmentMaster />}
      />

      <Route
        path="/college-form"
        element={<CollegeForm />}
      />

      <Route
        path="/course-master"
        element={<CourseMaster />}
      />

      {/* ===================================================
          DASHBOARD
      =================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          EMPLOYEE
      =================================================== */}

      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <Employee setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          DEPARTMENT
      =================================================== */}

      <Route
        path="/department"
        element={
          <ProtectedRoute>
            <Department setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          FACULTY
      =================================================== */}

      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <FacultyManagement setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          LEAVE
      =================================================== */}

      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <Leave setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          COURSE
      =================================================== */}

      <Route
        path="/course"
        element={
          <ProtectedRoute>
            <Course setIsLoggedIn={setIsLoggedIn} />
          </ProtectedRoute>
        }
      />

      {/* ===================================================
          CRITERIA 1
      =================================================== */}

      <Route
        path="/vision"
        element={<VisionMission />}
      />

      <Route
        path="/curriculum"
        element={<Curriculum />}
      />

      <Route
        path="/po-pso"
        element={<PoPso />}
      />

      <Route
        path="/course-matrix"
        element={<CourseMatrix />}
      />

      <Route
        path="/articulation-matrix"
        element={<ArticulationMatrix />}
      />

      {/* ===================================================
          CRITERIA 2
      =================================================== */}

      <Route
        path="/criteria/2.1-quality-teaching-learning"
        element={<QualityTeachingLearning />}
      />

      <Route
        path="/criteria/2.2-capstone-project"
        element={<CapstoneProject />}
      />

      <Route
        path="/internship"
        element={<Internship />}
      />

      <Route
        path="/seminar-mini-project"
        element={<SeminarMiniProject />}
      />

      <Route
        path="/case-study"
        element={<CaseStudy />}
      />

      <Route
        path="/nptel"
        element={<NptelSwayam />}
      />

      <Route
        path="/complex-problems"
        element={<SolvingComplexProblems />}
      />

      <Route
        path="/industry-partnership"
        element={<IndustryInstitutePartnership />}
      />

      {/* ===================================================
          CRITERIA 5
      =================================================== */}

      <Route
        path="/criteria5/sfr"
        element={<Criteria5SFR />}
      />

      <Route
        path="/criteria5/qualification"
        element={<Criteria5Qual />}
      />

      <Route
        path="/criteria5/cadre"
        element={<FacultyCadreProportion />}
      />

      <Route
        path="/criteria5/visiting-faculty"
        element={<Criteria54VisitingFaculty />}
      />

      <Route
        path="/criteria5/faculty-retention"
        element={<Criteria55FacultyRetention />}
      />

      {/* ===================================================
          CRITERIA 6
      =================================================== */}

      <Route
        path="/criteria6"
        element={<Criteria6 />}
      />

      <Route
        path="/criteria6/faculty-development"
        element={<FacultyDevelopment />}
      />

      <Route
        path="/criteria6/faculty-activities"
        element={<FacultyActivities />}
      />

      <Route
        path="/criteria6/research"
        element={<ResearchConsultancy />}
      />

      {/* =========================
          CRITERIA 6 ADD
      ========================= */}

      <Route
        path="/criteria6/membership/add"
        element={<MembershipAdd />}
      />

      <Route
        path="/criteria6/resource-person/add"
        element={<ResourcePersonAdd />}
      />

      <Route
        path="/criteria6/participation/add"
        element={<ParticipationAdd />}
      />

      <Route
        path="/criteria6/swayam-development"
        element={<SwayamDevelopmentView />}
      />

      <Route
        path="/criteria6/swayam-development/view"
        element={<SwayamDevelopmentView />}
      />

      <Route
        path="/criteria6/swayam-development/add"
        element={<SwayamDevelopmentAdd />}
      />

      <Route
        path="/criteria6/moocs/add"
        element={<MoocsAdd />}
      />

      <Route
        path="/criteria6/fdp/add"
        element={<FdpAdd />}
      />

      <Route
        path="/criteria6/student-project/add"
        element={<StudentProjectAdd />}
      />

      <Route
        path="/criteria6/internship/add"
        element={<InternshipAdd />}
      />

      <Route
        path="/criteria6/academic-research/add"
        element={<AcademicResearchAdd />}
      />

      <Route
        path="/criteria6/phd-student/add"
        element={<PhdStudentAdd />}
      />

      <Route
        path="/criteria6/development-activities/add"
        element={<DevelopmentActivityAdd />}
      />

      <Route
        path="/criteria6/sponsored-research/add"
        element={<SponsoredResearchAdd />}
      />

      <Route
        path="/criteria6/consultancy/add"
        element={<ConsultancyAdd />}
      />

      <Route
        path="/criteria6/seed-money/add"
        element={<SeedMoneyAdd />}
      />

      {/* =========================
          CRITERIA 6 VIEW
      ========================= */}

      <Route
        path="/criteria6/membership/view"
        element={<MembershipView />}
      />

      <Route
        path="/criteria6/resource-person/view"
        element={<ResourcePersonView />}
      />

      <Route
        path="/criteria6/participation/view"
        element={<ParticipationView />}
      />

      <Route
        path="/criteria6/swayam-development/view"
        element={<SwayamDevelopmentView />}
      />

      <Route
        path="/criteria6/moocs/view"
        element={<MoocsView />}
      />

      <Route
        path="/criteria6/fdp/view"
        element={<FdpView />}
      />

      <Route
        path="/criteria6/student-project/view"
        element={<StudentProjectView />}
      />

      <Route
        path="/criteria6/internship/view"
        element={<InternshipView />}
      />

      <Route
        path="/criteria6/academic-research/view"
        element={<AcademicResearchView />}
      />

      <Route
        path="/criteria6/phd-student/view"
        element={<PhdStudentView />}
      />

      <Route
        path="/criteria6/development-activities/view"
        element={<DevelopmentActivityView />}
      />

      <Route
        path="/criteria6/sponsored-research/view"
        element={<SponsoredResearchView />}
      />

      <Route
        path="/criteria6/consultancy/view"
        element={<ConsultancyView />}
      />

      <Route
        path="/criteria6/seed-money/view"
        element={<SeedMoneyView />}
      />

      {/* ===================================================
          UNKNOWN ROUTE
      =================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;