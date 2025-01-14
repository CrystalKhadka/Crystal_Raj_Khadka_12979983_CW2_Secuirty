import React from "react";
import { NavLink } from "react-router-dom";

const AdminNavbar = () => {
  const admin = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="admin-navbar ">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-column">
        <div className="container-fluid flex-column">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse show" id="navbarNav">
            <ul className="navbar-nav flex-column">
              <li className="nav-item dropdown welcome">
                <span
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Welcome, {admin.username}!
                </span>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/admin/dashboard"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="admin/movieManagement"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  Movies Management
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/admin/showManagement"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  Shows management
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/admin/bookingsManagement"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  Bookings management
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/admin/customerManagement"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  Customers Management
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/admin/userFeedbacks"
                  className="nav-link"
                  activeClassName="active-link"
                >
                  User Feedbacks
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <style>{`
                .admin-navbar {
                    width: 250px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background-color: #000; /* Black background */
                    padding-top: 20px;
                    overflow-y: auto;
                }

                .welcome {
                    color: #78b5e3; /* White text */
                    padding: 15px 20px; /* Add padding to menu items */
                    margin: 5px 0; /* Add margin to create gaps between menu items */
                    border-radius: 5px; 
                }

                .navbar-dark .navbar-nav .nav-link {
                    color: #fff; /* White text */
                    padding: 15px 20px; /* Add padding to menu items */
                    margin: 5px 0; /* Add margin to create gaps between menu items */
                    border-radius: 5px; /* Optional: Add border radius for rounded corners */
                }

                .navbar-dark .navbar-nav .nav-link.active,
                .navbar-dark .navbar-nav .nav-link:hover {
                    background-color: #007bff; /* Blue background for active or hover state */
                    color: #fff; /* White text */
                }

                .navbar-toggler {
                    margin-bottom: 10px;
                }

                .dropdown-menu {
                    background-color: #343a40; /* Dark background for dropdown */
                }

                .dropdown-item {
                    color: #fff; /* White text for dropdown items */
                }

                .dropdown-item:hover {
                    background-color: #007bff; /* Blue background for hover state */
                    color: #fff; /* White text */
                }

                /* Add responsive adjustments for smaller screens */
                @media (max-width: 992px) {
                    .admin-navbar {
                        width: 100%;
                        position: relative;
                        height: auto;
                    }

                    .navbar-collapse {
                        margin-top: 10px;
                    }
                }
            `}</style>
    </div>
  );
};

export default AdminNavbar;
