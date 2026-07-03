import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBuilding,
  FaBook,
  FaChartBar,
  FaUserShield,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

function Sidebar({ sidebarOpen, setIsLoggedIn }) {

  const location = useLocation();

  const menu = [

    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },

    {
      name: "Faculty",
      icon: <FaUserGraduate />,
      path: "/faculty",
    },

    {
      name: "Department",
      icon: <FaBuilding />,
      path: "/department",
    },

    {
      name: "Course",
      icon: <FaBook />,
      path: "/course",
    },

    {
      name: "Authority",
      icon: <FaUserShield />,
      path: "/authority",
    },

    {
      name: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
    },

    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },

  ];

  const logout = () => {

    localStorage.removeItem("isLoggedIn");

    if (setIsLoggedIn) {

      setIsLoggedIn(false);

    }

  };

  return (

    <aside className={sidebarOpen ? "sidebar" : "sidebar close"}>

      {/* Logo */}

      <div className="sidebar-top">

        <div className="logo-circle">

          🎓

        </div>

        {sidebarOpen && (

          <div className="logo-content">

            <h2>NBA Software</h2>

            <span>Management System</span>

          </div>

        )}

      </div>

      {/* Menu */}

      <ul className="sidebar-menu">

        {menu.map((item) => (

          <li key={item.path}>

            <Link
              to={item.path}
              className={
                location.pathname === item.path
                  ? "active"
                  : ""
              }
            >

              <div className="menu-left">

                {item.icon}

                {sidebarOpen && (

                  <span>{item.name}</span>

                )}

              </div>

            </Link>

          </li>

        ))}

        {/* Logout */}

        <li className="logout-item">

          <button
            className="logout-btn"
            onClick={logout}
          >

            <FaSignOutAlt />

            {sidebarOpen && (

              <span>Logout</span>

            )}

          </button>

        </li>

      </ul>

    </aside>

  );

}

export default Sidebar;