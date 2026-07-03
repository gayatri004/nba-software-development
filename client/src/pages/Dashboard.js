import { useState } from "react";

import {
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentCheck,
  
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

        {/* KPI Cards */}

       <section className="cards-section">

  <Card
    title="Faculty"
    number="145"
    percent="+8.2%"
    icon={<HiOutlineAcademicCap />}
    
    path="/faculty"
  />

  <Card
    title="Students"
    number="1850"
    percent="+12.5%"
    icon={<HiOutlineUserGroup />}
    
    path="/student"
  />

  <Card
    title="Departments"
    number="12"
    percent="+3.1%"
    icon={<HiOutlineBuildingOffice2 />}
    
    path="/department"
  />

  <Card
    title="Courses"
    number="28"
    percent="+5.7%"
    icon={<HiOutlineBookOpen />}
    
    path="/course"
  />

  <Card
    title="Attendance"
    number="92%"
    percent="+1.2%"
    icon={<HiOutlineClipboardDocumentCheck />}
    
    path="/attendance"
  />

  

</section>

        {/* Charts */}

        <section className="analytics-section">

         
          <div className="chart-small">

            <DepartmentChart />

          </div>

          <div className="chart-small">

            <AttendanceChart />

          </div>

        </section>
                {/* ================= Bottom Section ================= */}
{/* ================= Bottom Section ================= */}

<section className="bottom-section">

  {/* Left Panel */}
  <div className="left-panel">

    <RecentActivity />

    <div className="bottom-right">

      {/* Notice Board */}
      <div className="notice-card">

        <div className="card-header">
          <h3>Important Notices</h3>
        </div>

        <div className="notice-list">

          <div className="notice-item">
            <h4>NBA Meeting</h4>
            <p>Today • 11:00 AM</p>
          </div>

          <div className="notice-item">
            <h4>Faculty Meeting</h4>
            <p>Conference Hall</p>
          </div>

          <div className="notice-item">
            <h4>Semester Examination</h4>
            <p>Starts From 25 June</p>
          </div>

        </div>

      </div>

      {/* Upcoming Events */}
      <div className="events-card">

        <div className="card-header">
          <h3>Upcoming Events</h3>
        </div>

        <div className="event">

          <div className="event-date">
            <h2>24</h2>
            <span>Jun</span>
          </div>

          <div className="event-info">
            <h4>Faculty Workshop</h4>
            <small>Seminar Hall</small>
          </div>

        </div>

        <div className="event">

          <div className="event-date">
            <h2>27</h2>
            <span>Jun</span>
          </div>

          <div className="event-info">
            <h4>NBA Audit</h4>
            <small>Computer Department</small>
          </div>

        </div>

        <div className="event">

          <div className="event-date">
            <h2>30</h2>
            <span>Jun</span>
          </div>

          <div className="event-info">
            <h4>Result Declaration</h4>
            <small>MCA Semester</small>
          </div>

        </div>

      </div>

    </div>

  </div>

  {/* Right Panel */}
  <div className="right-panel">

    <QuickActions />

  </div>

</section>

        {/* ================= Footer ================= */}

        <footer className="dashboard-footer">

          <p>

            © 2026 NBA ERP Management System

          </p>

          

        </footer>

      </main>

    </div>

  );

}

export default Dashboard;