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
  FaSchool,
  FaArrowLeft,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";
import "../styles/ProviderAuth.css";

function ProviderRegister() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Business Information
    daycareName: "",
    businessLicense: "",
    establishedYear: "",
    capacity: "",
    ageGroups: [],

    // Address Information
    address: "",
    city: "",
    area: "",

    // Services Information
    services: [],
    operatingHours: "",
    fees: "",

    // Documents
    licenseDocument: null,
    insuranceDocument: null,

    // Agreement
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ageGroupOptions = [
    "Infants (0-12 months)",
    "Toddlers (1-2 years)",
    "Preschoolers (3-4 years)",
    "School Age (5-12 years)",
  ];

  const serviceOptions = [
    "Full Day Care",
    "Half Day Care",
    "After School Care",
    "Weekend Care",
    "Educational Programs",
    "Meal Services",
    "Transportation",
    "Special Needs Support",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      if (name === "ageGroups" || name === "services") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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

    // Personal Information Validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";

    // Business Information Validation
    if (!formData.daycareName.trim())
      newErrors.daycareName = "Daycare name is required";
    if (!formData.businessLicense.trim())
      newErrors.businessLicense = "Business license number is required";
    if (!formData.establishedYear)
      newErrors.establishedYear = "Established year is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (formData.ageGroups.length === 0)
      newErrors.ageGroups = "Please select at least one age group";

    // Address Validation
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";

    // Services Validation
    if (formData.services.length === 0)
      newErrors.services = "Please select at least one service";
    if (!formData.operatingHours.trim())
      newErrors.operatingHours = "Operating hours are required";
    if (!formData.fees.trim()) newErrors.fees = "Fee information is required";

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
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Capacity validation
    if (
      formData.capacity &&
      (formData.capacity < 1 || formData.capacity > 200)
    ) {
      newErrors.capacity = "Capacity must be between 1 and 200 children";
    }

    // Established year validation
    const currentYear = new Date().getFullYear();
    if (
      formData.establishedYear &&
      (formData.establishedYear < 1950 ||
        formData.establishedYear > currentYear)
    ) {
      newErrors.establishedYear = `Year must be between 1950 and ${currentYear}`;
    }

    // Terms acceptance validation
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions";
    if (!formData.privacyAccepted)
      newErrors.privacyAccepted = "You must accept the privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Here you would typically send the data to your backend
        console.log("Provider registration data:", formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setShowAlert(true);

        // Redirect after successful submission
        setTimeout(() => {
          // Navigate to approval pending page or login
          console.log("Redirecting to approval pending page...");
        }, 3000);
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="provider-auth-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={10} xl={9}>
            <Card className="provider-auth-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Link to="/provider" className="back-link">
                    <FaArrowLeft className="me-2" />
                    Back to Provider Portal
                  </Link>
                </div>

                <div className="text-center mb-4">
                  <h2 className="auth-title">Register Your Daycare</h2>
                  <p className="auth-subtitle">
                    Join Daycare Connect and start growing your business with
                    verified families
                  </p>
                </div>

                {showAlert && (
                  <Alert variant="success" className="mb-4">
                    <div className="d-flex align-items-center">
                      <FaClock className="me-2" />
                      <div>
                        <strong>Registration Submitted Successfully!</strong>
                        <p className="mb-0 mt-1">
                          Your application is now under review. Our team will
                          verify your information and approve your account
                          within 2-3 business days. You'll receive an email
                          confirmation once your daycare is approved and ready
                          to start receiving bookings.
                        </p>
                      </div>
                    </div>
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
                            placeholder="Create a strong password"
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

                  {/* Business Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaSchool className="me-2" />
                      Business Information
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Daycare Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="daycareName"
                            value={formData.daycareName}
                            onChange={handleChange}
                            isInvalid={!!errors.daycareName}
                            placeholder="Enter your daycare name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.daycareName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Business License Number *</Form.Label>
                          <Form.Control
                            type="text"
                            name="businessLicense"
                            value={formData.businessLicense}
                            onChange={handleChange}
                            isInvalid={!!errors.businessLicense}
                            placeholder="Enter license number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.businessLicense}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Established Year *</Form.Label>
                          <Form.Control
                            type="number"
                            name="establishedYear"
                            value={formData.establishedYear}
                            onChange={handleChange}
                            isInvalid={!!errors.establishedYear}
                            placeholder="YYYY"
                            min="1950"
                            max={new Date().getFullYear()}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.establishedYear}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Total Capacity *</Form.Label>
                          <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            isInvalid={!!errors.capacity}
                            placeholder="Number of children"
                            min="1"
                            max="200"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.capacity}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Age Groups Served * (Select all that apply)
                      </Form.Label>
                      <div className="checkbox-group">
                        {ageGroupOptions.map((ageGroup, index) => (
                          <Form.Check
                            key={index}
                            type="checkbox"
                            name="ageGroups"
                            value={ageGroup}
                            label={ageGroup}
                            checked={formData.ageGroups.includes(ageGroup)}
                            onChange={handleChange}
                            className="mb-2"
                          />
                        ))}
                      </div>
                      {errors.ageGroups && (
                        <div className="text-danger small">
                          {errors.ageGroups}
                        </div>
                      )}
                    </Form.Group>
                  </div>

                  {/* Address Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaMapMarkerAlt className="me-2" />
                      Location Information
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Full Address *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                        placeholder="Enter complete address"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
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
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Area/Thana *</Form.Label>
                          <Form.Control
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            isInvalid={!!errors.area}
                            placeholder="Enter area or thana"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.area}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Services Information */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <FaFileAlt className="me-2" />
                      Services & Operations
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Services Offered * (Select all that apply)
                      </Form.Label>
                      <div className="checkbox-group">
                        {serviceOptions.map((service, index) => (
                          <Form.Check
                            key={index}
                            type="checkbox"
                            name="services"
                            value={service}
                            label={service}
                            checked={formData.services.includes(service)}
                            onChange={handleChange}
                            className="mb-2"
                          />
                        ))}
                      </div>
                      {errors.services && (
                        <div className="text-danger small">
                          {errors.services}
                        </div>
                      )}
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Operating Hours *</Form.Label>
                          <Form.Control
                            type="text"
                            name="operatingHours"
                            value={formData.operatingHours}
                            onChange={handleChange}
                            isInvalid={!!errors.operatingHours}
                            placeholder="e.g., 7:00 AM - 6:00 PM"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.operatingHours}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Monthly Fees *</Form.Label>
                          <Form.Control
                            type="text"
                            name="fees"
                            value={formData.fees}
                            onChange={handleChange}
                            isInvalid={!!errors.fees}
                            placeholder="e.g., 8,000 - 15,000 BDT"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fees}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-section">
                    <h5 className="section-title">Agreement</h5>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        isInvalid={!!errors.termsAccepted}
                        label={
                          <span>
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              target="_blank"
                              className="auth-link"
                            >
                              Terms and Conditions
                            </Link>
                          </span>
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.termsAccepted}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleChange}
                        isInvalid={!!errors.privacyAccepted}
                        label={
                          <span>
                            I agree to the{" "}
                            <Link
                              to="/privacy"
                              target="_blank"
                              className="auth-link"
                            >
                              Privacy Policy
                            </Link>
                          </span>
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.privacyAccepted}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      className="btn-provider-primary"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <FaSchool className="me-2" />
                          Submit Registration
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="auth-link-text">
                      Already have an account?{" "}
                      <Link to="/provider/login" className="auth-link">
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

export default ProviderRegister;
