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
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaChild,
  FaArrowLeft,
} from "react-icons/fa";
import "../styles/ParentAuth.css";
import ParentNavbar from '../components/ParentNavbar'; // Add this line

function ParentRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    childName: "",
    childAge: "",
    childGender: "",
    specialNeeds: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

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

    // Required field validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.childName.trim())
      newErrors.childName = "Child name is required";
    if (!formData.childAge) newErrors.childAge = "Child age is required";
    if (!formData.childGender)
      newErrors.childGender = "Child gender is required";
    if (!formData.emergencyContact.trim())
      newErrors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim())
      newErrors.emergencyPhone = "Emergency phone is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Bangladesh format)
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Bangladesh phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Child age validation
    if (
      formData.childAge &&
      (formData.childAge < 0 || formData.childAge > 12)
    ) {
      newErrors.childAge = "Child age must be between 0 and 12 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Registration data:", formData);
      setShowAlert(true);

      // Reset form after successful submission
      setTimeout(() => {
        setShowAlert(false);
        // Redirect to login or dashboard
      }, 3000);
    }
  };

  return (
    <div className="auth-wrapper">
      <ParentNavbar /> {/* Add this line */}
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={8} xl={7}>
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
                    Join Daycare Connect and find the perfect care for your
                    child
                  </p>
                </div>

                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    Registration successful! Welcome to Daycare Connect.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaUser className="me-2" />
                      Personal Information
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            isInvalid={!!errors.firstName}
                            placeholder="Enter your first name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            isInvalid={!!errors.lastName}
                            placeholder="Enter your last name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaEnvelope className="me-2" />
                            Email Address *
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            placeholder="Enter your email"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaPhone className="me-2" />
                            Phone Number *
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                            placeholder="01XXXXXXXXX"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaLock className="me-2" />
                            Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            placeholder="Create a password"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaLock className="me-2" />
                            Confirm Password *
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.confirmPassword}
                            placeholder="Confirm your password"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Address Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaMapMarkerAlt className="me-2" />
                      Address Information
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                        placeholder="Enter your full address"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        isInvalid={!!errors.city}
                      >
                        <option value="">Select your city</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Barisal">Barisal</option>
                        <option value="Rangpur">Rangpur</option>
                        <option value="Mymensingh">Mymensingh</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  {/* Child Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaChild className="me-2" />
                      Child Information
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Child's Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="childName"
                            value={formData.childName}
                            onChange={handleChange}
                            isInvalid={!!errors.childName}
                            placeholder="Enter child's name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.childName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Child's Age *</Form.Label>
                          <Form.Control
                            type="number"
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleChange}
                            isInvalid={!!errors.childAge}
                            placeholder="Age in years"
                            min="0"
                            max="12"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.childAge}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Child's Gender *</Form.Label>
                          <Form.Select
                            name="childGender"
                            value={formData.childGender}
                            onChange={handleChange}
                            isInvalid={!!errors.childGender}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.childGender}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Special Needs (Optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="specialNeeds"
                            value={formData.specialNeeds}
                            onChange={handleChange}
                            placeholder="Any special requirements"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Emergency Contact */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaPhone className="me-2" />
                      Emergency Contact
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Contact Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            isInvalid={!!errors.emergencyContact}
                            placeholder="Emergency contact person"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.emergencyContact}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Emergency Phone *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="emergencyPhone"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            isInvalid={!!errors.emergencyPhone}
                            placeholder="01XXXXXXXXX"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.emergencyPhone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      className="btn-auth-primary"
                      size="lg"
                    >
                      Create Account
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ParentRegister;
