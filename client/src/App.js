import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Department from "./pages/Department";
import FacultyManagement from "./pages/FacultyManagement";
import Leave from "./pages/Leave";
import Course from "./pages/Course";
import Authority from "./pages/Authority";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AuthorityManagement from "./pages/AuthorityManagement";
import FacultyForm from "./pages/FacultyForm";
import DepartmentMaster from "./pages/DepartmentMaster";
import CollegeForm from "./pages/CollegeForm";
import CourseMaster from "./pages/CourseMaster";
import Criteria from "./pages/Criteria";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn") === "true"
);

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
 {/* Default Page */}
        

        {/* Register */}
        <Route path="/register" element={<Register />} />

        <Route
  path="/login"
  element={<Login setIsLoggedIn={setIsLoggedIn} />}
/>

        <Route path="/" element={<Welcome />} />
<Route path="/home" element={
  <ProtectedRoute>
    <Home />
  </ProtectedRoute>
} />
        {/* Forms */}
        
        <Route path="/faculty-form" element={<FacultyForm />} />
        <Route path="/department-master" element={<DepartmentMaster />} />
        <Route path="/college-form" element={<CollegeForm />} />
        <Route path="/criteria" element={<Criteria />} />
        <Route path="/course-master" element={<CourseMaster />} />

        {/* Authority Form */}
        <Route
          path="/authority-form"
          element={
            <ProtectedRoute>
              <AuthorityManagement />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <Employee setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Department */}
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <Department setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Faculty */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute>
              <FacultyManagement setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Leave */}
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <Leave setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Course */}
        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Course setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Authority */}
        <Route
          path="/authority"
          element={
            <ProtectedRoute>
              <Authority setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />


        {/* Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;