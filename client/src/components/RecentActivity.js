import {
  FaUserGraduate,
  FaBook,
  FaBuilding,
  FaMoneyBillWave,
  FaClipboardCheck,
} from "react-icons/fa";

function RecentActivity() {

  const activities = [
    {
      id: 1,
      icon: <FaUserGraduate />,
      title: "New Faculty Added",
      description: "Dr. Rahul Patil joined Computer Department",
      time: "2 min ago",
      color: "#2563eb",
    },
    {
      id: 2,
      icon: <FaBook />,
      title: "Course Created",
      description: "Artificial Intelligence added successfully",
      time: "15 min ago",
      color: "#16a34a",
    },
    {
      id: 3,
      icon: <FaBuilding />,
      title: "Department Updated",
      description: "MBA Department information updated",
      time: "1 hour ago",
      color: "#7c3aed",
    },
    {
      id: 4,
      icon: <FaMoneyBillWave />,
      title: "Salary Generated",
      description: "Monthly payroll generated successfully",
      time: "3 hours ago",
      color: "#f59e0b",
    },
    {
      id: 5,
      icon: <FaClipboardCheck />,
      title: "Attendance Updated",
      description: "Today's attendance submitted",
      time: "Today",
      color: "#ef4444",
    },
  ];

  return (
    <div className="activity-card">

      <div className="activity-header">
        <h3>Recent Activities</h3>
        
      </div>

      <div className="activity-list">

        {activities.map((item) => (

          <div
            key={item.id}
            className="activity-item"
          >

            <div
              className="activity-icon"
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div className="activity-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>

            <div className="activity-time">
              {item.time}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentActivity;