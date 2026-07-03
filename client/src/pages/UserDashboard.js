import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      <div className="sidebar">

        <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px" }}>
          USER PANEL
        </h2>

        <ul>
          <li>🏠 Dashboard</li>
          <li>👤 My Profile</li>
          <li>📄 Employee Details</li>
          <li>📅 Attendance</li>
          <li>💰 Salary</li>

          <li
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", color: "red" }}
          >
            🚪 Logout
          </li>
        </ul>

      </div>

      <main className="main-content">

        <h1>Welcome User 👋</h1>

        <div className="cards">

          <div className="stat-card">
            <h2>My Profile</h2>
            <p>View your profile information.</p>
          </div>

          <div className="stat-card">
            <h2>Attendance</h2>
            <p>92%</p>
          </div>

          <div className="stat-card">
            <h2>Salary</h2>
            <p>₹25,000</p>
          </div>

          <div className="stat-card">
            <h2>Employee ID</h2>
            <p>EMP001</p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default UserDashboard;