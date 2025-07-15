/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/ParentAuth.css";
import ParentNavbar from "../components/ParentNavbar";
import OTPVerification from "../components/OTPVerification";
import axios from "axios";

function ParentRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Email/Password, 2: OTP Verification
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post('http://localhost:8000/api/user-auth/send-otp/', {
        email: formData.email,
        purpose: 'registration'
      });

      setAlertType("info");
      setAlertMessage("Verification code sent to your email!");
      setShowAlert(true);
      setCurrentStep(2);

    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.email) {
          setErrors({ email: errorData.email[0] });
        } else if (errorData.non_field_errors) {
          setAlertType("danger");
          setAlertMessage(errorData.non_field_errors[0]);
          setShowAlert(true);
        } else {
          setAlertType("danger");
          setAlertMessage("Failed to send verification code. Please try again.");
          setShowAlert(true);
        }
      } else {
        setAlertType("danger");
        setAlertMessage("Network error. Please try again.");
        setShowAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = (otpCode) => {
    setVerifiedOTP(otpCode);
    // Proceed to final registration
    handleFinalRegistration(otpCode);
  };

  const handleFinalRegistration = async (otpCode) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user-auth/parents/register/",
        {
          email: formData.email,
          password: formData.password,
          otp_code: otpCode,
        }
      );

      setAlertType("success");
      setAlertMessage("Registration successful! Welcome to Daycare Connect.");
      setShowAlert(true);

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/parent/login");
      }, 2000);

    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        setAlertType("danger");
        if (errorData.non_field_errors) {
          setAlertMessage(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          setAlertMessage(errorData.detail);
        } else {
          setAlertMessage("Registration failed. Please try again.");
        }
      } else {
        setAlertType("danger");
        setAlertMessage("Registration failed. Please try again.");
      }
      setShowAlert(true);
      
      // Go back to step 1 on registration failure
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setAlertType("info");
    setAlertMessage("New verification code sent!");
    setShowAlert(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
    setShowAlert(false);
    setErrors({});
  };

  return (
    <div className="auth-wrapper">
      <ParentNavbar />
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={7} sm={9}>
            <Card className="auth-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Link to="/parent" className="back-link">
                    <FaArrowLeft className="me-2" />
                    Back to Parent Portal
                  </Link>
                </div>

                <div className="text-center mb-4">
                  <h2 className="auth-title">Create Parent Account</h2>
                  <p className="auth-subtitle">
                    {currentStep === 1 
                      ? "Join Daycare Connect and find the perfect care for your child"
                      : "Verify your email to complete registration"
                    }
                  </p>
                </div>

                {showAlert && (
                  <Alert variant={alertType} className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

                {currentStep === 1 ? (
                  // Step 1: Email and Password Form
                  <Form onSubmit={handleSendOTP} className="form-with-extra-margin">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaEnvelope className="me-2" />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="Enter your email"
                        size="lg"
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaLock className="me-2" />
                        Password
                      </Form.Label>
                      <div className="password-input-wrapper">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          placeholder="Create a password"
                          size="lg"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          variant="link"
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                          type="button"
                          disabled={isLoading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>
                        <FaLock className="me-2" />
                        Confirm Password
                      </Form.Label>
                      <div className="password-input-wrapper">
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm your password"
                          size="lg"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          variant="link"
                          className="password-toggle"
                          onClick={toggleConfirmPasswordVisibility}
                          type="button"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="text-center mb-4">
                      <Button
                        type="submit"
                        className="btn-auth-primary"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending Verification Code...
                          </>
                        ) : (
                          "Send Verification Code"
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-4">
                      <p className="auth-link-text">
                        Already have an account?{" "}
                        <Link to="/parent/login" className="auth-link">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </Form>
                ) : (
                  // Step 2: OTP Verification
                  <div>
                    <OTPVerification
                      email={formData.email}
                      purpose="registration"
                      onVerificationSuccess={handleOTPVerification}
                      onResendOTP={handleResendOTP}
                      isLoading={isLoading}
                    />
                    
                    <div className="text-center mt-4">
                      <Button
                        variant="outline-secondary"
                        onClick={goBackToStep1}
                        disabled={isLoading}
                      >
                        <FaArrowLeft className="me-2" />
                        Change Email
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="auth-footer text-center py-3">
        <p className="mb-0 text-muted">
          &copy; {new Date().getFullYear()} Daycare Connect. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}

export default ParentRegister;