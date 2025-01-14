import React, { useState } from "react";
import { registerUserApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Register.css";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPhone,
  MdLocalMovies,
  MdTheaters,
} from "react-icons/md";

const Register = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePhoneNumber = (e) => setPhoneNumber(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("Username is required!");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (phoneNumber.trim() === "") {
      setPhoneNumberError("Phone Number is required!");
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    if (email.trim() === "") {
      setEmailError("Email is required!");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is required!");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Confirm Password is required!");
      isValid = false;
    } else if (confirmPassword.trim() !== password.trim()) {
      setConfirmPasswordError("Passwords don't match!");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = { username, phoneNumber, email, password };

    registerUserApi(data)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <div className="auth-container movie-themed">
      <div className="auth-card">
        <div className="movie-reel-animation">
          <MdLocalMovies className="movie-icon" />
          <MdTheaters className="movie-icon" />
        </div>
        <h1 className="auth-header">Create an account</h1>
        <p className="auth-subheader">
          Your ticket to cinematic adventures awaits{" "}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group movie-input">
            <MdPerson />
            <input
              onChange={handleUsername}
              type="text"
              className="form-control"
              placeholder="Enter your username"
            />
            {usernameError && <p className="text-danger">{usernameError}</p>}
          </div>

          <div className="form-group movie-input">
            <MdPhone />
            <input
              onChange={handlePhoneNumber}
              type="text"
              className="form-control"
              placeholder="Enter your phone number"
            />
            {phoneNumberError && (
              <p className="text-danger">{phoneNumberError}</p>
            )}
          </div>

          <div className="form-group movie-input">
            <MdEmail />
            <input
              onChange={handleEmail}
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
            {emailError && <p className="text-danger">{emailError}</p>}
          </div>

          <div className="form-group movie-input">
            <MdLock />
            <div className="input-group">
              
              <input
                onChange={handlePassword}
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>

          <div className="form-group movie-input">
            <MdLock />
            <div className="input-group">
              <input
                onChange={handleConfirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-danger">{confirmPasswordError}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 login-button">
            Register
          </button>

          <div className="text-center mt-3">
            <span className="text-muted">Already have a ticket? </span>
            <Link to="/login" className="register-now-link">
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
