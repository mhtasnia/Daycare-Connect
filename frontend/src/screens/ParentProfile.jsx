import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Navbar,
  Nav,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaHome,
  FaCalendarAlt,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaSave,
  FaEdit,
  FaBriefcase,
  FaUserShield,
} from "react-icons/fa";
import axios from "axios";
import "../styles/ParentProfile.css";

function ParentProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    email: "",
    user_type: "",
    is_email_verified: false,
    joined_at: "",
    full_name: "",
    profession: "",
    address: "",
    emergency_contact: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    full_name: "",
    profession: "",
    address: "",
    emergency_contact: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/parent/login", { replace: true });
      return;
    }
    
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.get(
        "http://localhost:8000/api/user-auth/parents/profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;
      setProfileData(data);
      setFormData({
        full_name: data.full_name || "",
        profession: data.profession || "",
        address: data.address || "",
        emergency_contact: data.emergency_contact || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/parent/login", { replace: true });
      } else {
        setAlertType("danger");
        setAlertMessage("Failed to load profile information");
        setShowAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (formData.phone && !formData.phone.match(/^(\+8801|01)[0-9]{9}$/)) {
      newErrors.phone = "Please enter a valid Bangladesh phone number";
    }

    if (formData.emergency_contact && !formData.emergency_contact.match(/^(\+8801|01)[0-9]{9}$/)) {
      newErrors.emergency_contact = "Please enter a valid Bangladesh phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.put(
        "http://localhost:8000/api/user-auth/parents/profile/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAlertType("success");
      setAlertMessage("Profile updated successfully!");
      setShowAlert(true);
      setIsEditing(false);

      // Update profile data with the response
      if (response.data.profile) {
        setProfileData(response.data.profile);
      }

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          setAlertMessage(errorData.non_field_errors[0]);
        } else if (typeof errorData === 'object') {
          setErrors(errorData);
          setAlertMessage("Please check the form for errors");
        } else {
          setAlertMessage("Failed to update profile. Please try again.");
        }
      } else {
        setAlertMessage("Network error. Please try again.");
      }
      setAlertType("danger");
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");

      if (refresh && access) {
        await axios.post(
          "http://localhost:8000/api/user-auth/parents/logout/",
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      navigate("/parent/login");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data to original profile data
      setFormData({
        full_name: profileData.full_name || "",
        profession: profileData.profession || "",
        address: profileData.address || "",
        emergency_contact: profileData.emergency_contact || "",
        phone: profileData.phone || "",
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="parent-profile-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your profile...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="parent-profile-wrapper">
      {/* Navigation Header */}
      <Navbar bg="white" expand="lg" className="parent-navbar shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/parent/home" className="fw-bold">
            Daycare <span className="brand-highlight">Connect</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="parent-navbar" />
          <Navbar.Collapse id="parent-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/parent/home" className="nav-item">
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/parent/profile"
                className="nav-item active"
              >
                <FaUser className="me-1" /> Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/parent/search" className="nav-item">
                <FaSearch className="me-1" /> Search
              </Nav.Link>
              <Nav.Link as={Link} to="/parent/bookings" className="nav-item">
                <FaCalendarAlt className="me-1" /> Bookings
              </Nav.Link>
              <Nav.Link className="nav-item">
                <FaBell className="me-1" /> Notifications
              </Nav.Link>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
                className="ms-2"
              >
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title">
                  <FaUser className="me-2" />
                  My Profile
                </h1>
                <p className="page-subtitle">
                  Manage your personal information and preferences
                </p>
              </div>
              <Button
                as={Link}
                to="/parent/home"
                variant="outline-secondary"
                className="back-btn"
              >
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
            </div>
          </Col>
        </Row>

        {showAlert && (
          <Row className="mb-4">
            <Col>
              <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
                {alertMessage}
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="profile-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Profile Information</h4>
                <Button
                  variant={isEditing ? "outline-secondary" : "outline-primary"}
                  onClick={toggleEdit}
                  disabled={isSaving}
                >
                  {isEditing ? (
                    <>
                      <FaArrowLeft className="me-1" /> Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="me-1" /> Edit Profile
                    </>
                  )}
                </Button>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Account Information (Read-only) */}
                <div className="account-info mb-4">
                  <h5 className="section-title">Account Information</h5>
                  <Row>
                    <Col md={6}>
                      <div className="info-item">
                        <label className="info-label">
                          <FaEnvelope className="me-2" />
                          Email Address
                        </label>
                        <div className="info-value">{profileData.email}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <label className="info-label">
                          <FaUserShield className="me-2" />
                          Account Type
                        </label>
                        <div className="info-value">
                          {profileData.user_type === 'parent' ? 'Parent' : profileData.user_type}
                          {profileData.is_email_verified && (
                            <span className="ms-2 badge bg-success">Verified</span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="info-item">
                        <label className="info-label">Member Since</label>
                        <div className="info-value">
                          {profileData.joined_at 
                            ? new Date(profileData.joined_at).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Personal Information Form */}
                <Form onSubmit={handleSubmit}>
                  <h5 className="section-title">Personal Information</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaUser className="me-2" />
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          isInvalid={!!errors.full_name}
                          placeholder="Enter your full name"
                          disabled={!isEditing || isSaving}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.full_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaBriefcase className="me-2" />
                          Profession
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="profession"
                          value={formData.profession}
                          onChange={handleChange}
                          placeholder="Enter your profession"
                          disabled={!isEditing || isSaving}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaPhone className="me-2" />
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          isInvalid={!!errors.phone}
                          placeholder="01XXXXXXXXX"
                          disabled={!isEditing || isSaving}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaPhone className="me-2" />
                          Emergency Contact
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="emergency_contact"
                          value={formData.emergency_contact}
                          onChange={handleChange}
                          isInvalid={!!errors.emergency_contact}
                          placeholder="01XXXXXXXXX"
                          disabled={!isEditing || isSaving}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.emergency_contact}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaMapMarkerAlt className="me-2" />
                      Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your complete address"
                      disabled={!isEditing || isSaving}
                    />
                  </Form.Group>

                  {isEditing && (
                    <div className="text-center">
                      <Button
                        type="submit"
                        className="btn-profile-save me-3"
                        size="lg"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        size="lg"
                        onClick={toggleEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ParentProfile;