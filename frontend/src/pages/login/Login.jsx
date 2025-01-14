// <----------------------------------------------------------------------->

import React, { useState } from "react";

import {
  loginUserApi,
  resetPasswordApi,
  forgotPasswordApi,
  getUserByGoogleEmail,
  loginWithGoogle,
} from "../../apis/Api";

import { toast } from "react-toastify";

import "./Login.css";

import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdPhone,
  MdLocalMovies,
} from "react-icons/md";

import { FaGoogle } from "react-icons/fa";

import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [otp, setOtp] = useState("");

  const [resetPassword, setResetPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isSentOtp, setIsSentOtp] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleEmail = (e) => setEmail(e.target.value);

  const handlePassword = (e) => setPassword(e.target.value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validate = () => {
    let isValid = true;

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

    return isValid;
  };

  const handleReset = (e) => {
    e.preventDefault();

    if (resetPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    resetPasswordApi({ phoneNumber, otp, password: resetPassword })
      .then(() => {
        toast.success("Password reset successfully");

        setPhoneNumber("");

        setOtp("");

        setResetPassword("");

        setConfirmPassword("");

        setIsSentOtp(false);

        setShowForgotPasswordModal(false);
      })

      .catch((err) =>
        toast.error(err.response?.data?.message || "Reset failed")
      );
  };

  const sentOtp = (e) => {
    e.preventDefault();

    if (phoneNumber.trim() === "") {
      toast.warning("Please enter phone number");

      return;
    }

    forgotPasswordApi({ phoneNumber })
      .then((res) => {
        toast.success(res.data.message);

        setIsSentOtp(true);
      })

      .catch((err) =>
        toast.error(err.response?.data?.message || "OTP send failed")
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    loginUserApi({ email, password })
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);

          localStorage.setItem("token", res.data.token);

          localStorage.setItem("user", JSON.stringify(res.data.userData));

          window.location.href = res.data.userData.isAdmin
            ? "/admin/dashboard"
            : "/Homepage";
        }
      })

      .catch(() => toast.error("Login failed"));
  };

  return (
    <div className="auth-container movie-themed">
      <div className="auth-card">
        <div className="movie-reel-animation">
          <MdLocalMovies className="movie-icon" />
        </div>
        <h1 className="auth-header">Login to your account</h1>
        <p className="auth-subheader">
          Your ticket to cinematic adventures awaits
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <InputGroup className="mb-3 movie-input ">
            <InputGroup.Text>
              <MdEmail />
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmail}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup className="mb-3 movie-input">
            <InputGroup.Text>
              <MdLock />
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePassword}
              isInvalid={!!passwordError}
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </Button>
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </InputGroup>
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="link"
              className="forgot-password-link"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot Password?
            </Button>
          </div>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3 login-button"
          >
            Login
          </Button>
          <div className="text-center mb-3">
            <span className="text-muted">Or login with</span>
          </div>
          <div align="center" className="mb-3">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);

                const credential = credentialResponse.credential;

                getUserByGoogleEmail({
                  token: credential,
                })
                  .then((res) => {
                    if (res.data.success === false) {
                      toast.error(res.data.message);
                    } else {
                      toast.success(res.data.message);
                      loginWithGoogle({
                        token: credential,
                      })
                        .then((res) => {
                          if (res.data.success === false) {
                            toast.error(res.data.message);
                          } else {
                            toast.success(res.data.message);
                            localStorage.setItem("token", res.data.token);
                            localStorage.setItem(
                              "user",
                              JSON.stringify(res.data.user)
                            );
                            window.location.href = "/Homepage";
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  })
                  .catch((err) => {
                    loginWithGoogle({
                      token: credential,
                      password: "12345678",
                    })
                      .then((res) => {
                        if (res.data.success === false) {
                          toast.error(res.data.message);
                        } else {
                          toast.success(res.data.message);
                          localStorage.setItem("token", res.data.token);
                          localStorage.setItem(
                            "user",
                            JSON.stringify(res.data.user)
                          );
                          window.location.href = "/Homepage";
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <a href="/register" className="register-now-link">
              Create one
            </a>
          </div>
        </form>
      </div>

      <Modal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>

              <InputGroup>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSentOtp}
                />

                <Button
                  variant="outline-primary"
                  onClick={sentOtp}
                  disabled={isSentOtp}
                >
                  Get OTP
                </Button>
              </InputGroup>
            </Form.Group>

            {isSentOtp && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>

                  <Form.Control
                    type="number"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleReset}>
                  Reset Password
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
