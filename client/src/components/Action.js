import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaBook,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaChartBar,
  FaPlusCircle,
  FaUserShield,
} from "react-icons/fa";

function Action() {

  const navigate = useNavigate();

  const actions = [
   {
  title: "Add Faculty",
  icon: <FaPlusCircle />,
  color: "#14b8a6",
  path: "/faculty-form",
},
    {
      title: "Department",
      icon: <FaBuilding />,
      color: "#7c3aed",
      path: "/department",
    },
    {
      title: "Courses",
      icon: <FaBook />,
      color: "#16a34a",
      path: "/course",
    },
    {
      title: "Attendance",
      icon: <FaClipboardCheck />,
      color: "#ef4444",
      path: "/attendance",
    },
    {
      title: "Salary",
      icon: <FaMoneyBillWave />,
      color: "#f59e0b",
      path: "/salary",
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      color: "#0ea5e9",
      path: "/reports",
    },
    {
      title: "Authority",
      icon: <FaUserShield />,
      color: "#9333ea",
      path: "/authority",
    },
    {
      title: "Add Faculty",
      icon: <FaPlusCircle />,
      color: "#14b8a6",
      path: "/faculty",
    },
  ];

  return (
    <div className="quick-card">

      <div className="quick-header">
        <h3>Quick Actions</h3>
        <small>Frequently Used</small>
      </div>

      <div className="quick-grid">

        {actions.map((item, index) => (

          <button
            key={index}
            className="quick-btn"
            onClick={() => navigate(item.path)}
          >

            <div
              className="quick-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <span>{item.title}</span>

          </button>

        ))}

      </div>

    </div>
  );
}

export default Action;