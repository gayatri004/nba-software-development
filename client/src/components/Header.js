import { useState } from "react";
import {
  
  FaSearch,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header({
  sidebarOpen,
  setSidebarOpen,
  search,
  setSearch,
  setIsLoggedIn,
}) {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }

    navigate("/login");
  };

  return (
    <header className="top-header">

      {/* Left */}

      <div className="header-left">

        

        <h2>Dashboard</h2>

      </div>

      {/* Search */}

      <div className="header-search">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Right */}

      <div className="header-right">

        
        {/* Notification */}

        <div
          className="icon-box"
          onClick={() => setShowNotification(!showNotification)}
        >

          <FaBell />

          <span className="badge">5</span>

          {showNotification && (

            <div className="notification-dropdown">

              <h4>Notifications</h4>

              <div className="notification-item">
                👨‍🏫 New Faculty Added
              </div>

              <div className="notification-item">
                📚 New Course Created
              </div>

              <div className="notification-item">
                📅 Attendance Updated
              </div>

              

            </div>

          )}

        </div>

        {/* Profile */}

        <div
          className="profile-box"
          onClick={() => setShowProfile(!showProfile)}
        >

          <FaUserCircle className="profile-icon" />

          <div className="profile-info">

            <h4>Admin</h4>

            <small>Administrator</small>

          </div>

          <FaChevronDown />

          {showProfile && (

            <div className="profile-dropdown">

              <div className="profile-item">

                👤 My Profile

              </div>

              <div className="profile-item">

                ⚙ Settings

              </div>

              <div
                className="profile-item logout"
                onClick={handleLogout}
              >

                <FaSignOutAlt />

                <span>Logout</span>

              </div>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Header;