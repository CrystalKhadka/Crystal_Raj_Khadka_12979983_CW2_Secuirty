import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import { googleLogout } from '@react-oauth/google';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    googleLogout();
    window.location.href="/login";
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const navbarStyle = {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
  };

  const brandStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #007bff, #00ff00)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const linkStyle = {
    fontSize: "18px",
    marginRight: "20px",
    color: "#333",
    transition: "color 0.3s ease",
  };

  const activeLinkStyle = {
    ...linkStyle,
    fontWeight: "bold",
    color: "#007bff",
  };

  const buttonStyle = {
    fontSize: "16px",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "all 0.3s ease",
  };

  return user?.isAdmin ? (
    <AdminNavbar />
  ) : (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top mb-5" style={navbarStyle}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/homepage" style={brandStyle}>
          Cold Films
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/homepage")}`}
                to="/homepage"
                style={isActive("/homepage") ? activeLinkStyle : linkStyle}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/coming-soon")}`}
                to="/coming-soon"
                style={isActive("/coming-soon") ? activeLinkStyle : linkStyle}
              >
                Coming Soon
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/tickets")}`}
                to="/tickets"
                style={isActive("/tickets") ? activeLinkStyle : linkStyle}
              >
                Tickets
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/aboutUs")}`}
                to="/aboutUs"
                style={isActive("/aboutUs") ? activeLinkStyle : linkStyle}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/contactUs")}`}
                to="/contactUs"
                style={isActive("/contactUs") ? activeLinkStyle : linkStyle}
              >
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ ...buttonStyle, minWidth: "150px" }}
                >
                  Welcome, {user.username}!
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2" style={buttonStyle}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" style={buttonStyle}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;