import { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBuildingOffice2,
  HiOutlineBookOpen,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";

import DepartmentChart from "../components/DepartmentChart";
import AttendanceChart from "../components/AttendanceChart";

import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/Action";

import "../styles/dashboard.css";

function Dashboard({ setIsLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div className="dashboard">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main
        className={
          sidebarOpen
            ? "main-content"
            : "main-content expand"
        }
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          search={search}
          setSearch={setSearch}
          setIsLoggedIn={setIsLoggedIn}
        />

        {/* ================= KPI CARDS ================= */}

        <section className="cards-section">

          <Card
            title="Faculty"
            number="145"
            color="#2563eb"
            icon={<HiOutlineAcademicCap />}
            path="/faculty"
          />

          <Card
            title="Departments"
            number="12"
            color="#10b981"
            icon={<HiOutlineBuildingOffice2 />}
            path="/department"
          />

          <Card
            title="Courses"
            number="28"
            color="#f59e0b"
            icon={<HiOutlineBookOpen />}
            path="/course"
          />

        </section>

        {/* ================= CHART SECTION ================= */}

        <section className="analytics-section">

          <DepartmentChart />

          <div className="chart-small">
            <AttendanceChart />
          </div>

        </section>

        {/* ================= BOTTOM SECTION ================= */}

        <section className="bottom-section">

          <div className="left-panel">
            <RecentActivity />
          </div>

          <div className="right-panel">
            <QuickActions />
          </div>

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="dashboard-footer">
          <p>© 2026 NBA ERP Management System</p>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;