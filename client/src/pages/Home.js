import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="paas-home">
      <div className="portal-container">

        <div className="portal-header">
          <h1>NBA Software Development</h1>
        </div>

        <div className="portal-grid">

          <div
            className="portal-card"
            onClick={() => navigate("/login")}
          >
            <div className="portal-icon">👨‍💼</div>
            <h2>Admin Login</h2>
            <p>Access dashboard and manage all modules.</p>
          </div>

          <div
            className="portal-card"
            onClick={() => navigate("/department-master")}
          >
            <div className="portal-icon">🏢</div>
            <h2>Department Registration</h2>
            <p>Add department details to the platform.</p>
          </div>

          <div
            className="portal-card"
            onClick={() => navigate("/faculty-form")}
          >
            <div className="portal-icon">🎓</div>
            <h2>Faculty Management</h2>
            <p>Manage faculty details and records.</p>
          </div>

          <div
            className="portal-card"
            onClick={() => navigate("/college-form")}
          >
            <div className="portal-icon">🏫</div>
            <h2>College Management</h2>
            <p>Manage college details and information.</p>
          </div>

          <div
            className="portal-card"
            onClick={() => navigate("/criteria")}
          >
            <div className="portal-icon">📋</div>
            <h2>Criteria Management</h2>
            <p>Manage NBA criteria details and documentation.</p>
          </div>

          <div
            className="portal-card"
            onClick={() => navigate("/course-master")}
          >
            <div className="portal-icon">📚</div>
            <h2>Course Master</h2>
            <p>Manage course details and records.</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;