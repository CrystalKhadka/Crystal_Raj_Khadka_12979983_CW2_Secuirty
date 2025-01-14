import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included
import "./FooterB.css"; // Custom CSS file for additional styling
import logo from "./logo.png"; // Import the logo image

const FooterB = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user != null && user.isAdmin ? (
    <></>
  ) : (
    <footer className="bg-light text-center text-white">
      {/* Grid container */}
      <div className="container-fluid p-4">
        {/* Grid row */}
        <div className="row">
          {/* Grid column */}
          <div className="col-lg-12 mb-4 mb-md-0">
            <ul className="list-unstyled d-flex justify-content-center mb-0">
              <li className="mx-3">
                <Link to="/aboutUs" className="text-primary no-underline">
                  About Us
                </Link>
              </li>
              <li className="mx-3">
                <Link to="/contactUs" className="text-primary no-underline">
                  Contact Us
                </Link>
              </li>
              
            </ul>
            <h5 className="text-dark mt-4">Cold Films</h5>
          </div>
          {/* Grid column */}
        </div>
        {/* Grid row */}
        <div className="row mt-4">
          {/* Grid column */}
          <div className="col-lg-12 mb-2 mb-md-0">
            <img src={logo} alt="Cold Films Logo" style={{ height: "100px" }} />
            <p className="text-secondary mt-3">
              Bringing the magic of movies to life.
              <br />
              Enjoy the ultimate cinematic experience with us.
            </p>
          </div>
          {/* Grid column */}
        </div>
      </div>
      {/* Grid container */}

      {/* Copyright */}
      <div className="text-center p-3 text-secondary">
        © 2024 Copyright: Cold Films
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default FooterB;
