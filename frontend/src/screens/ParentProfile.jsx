import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Nav,
  Tab,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaChild,
  FaUserFriends,
  FaIdCard,
  FaArrowLeft,
  FaHome,
  FaCalendarAlt,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import "../styles/ParentProfile.css";

function ParentProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    nidNumber: "",
    occupation: "",
    workPlace: "",

    // Contact Information
    email: "",
    phone: "",
    alternatePhone: "",

    // Address Information
    presentAddress: "",
    permanentAddress: "",
    city: "",
    district: "",
    postalCode: "",

    // Child Information
    children: [
      {
        name: "",
        dateOfBirth: "",
        age: "",
        gender: "",
        bloodGroup: "",
        allergies: "",
        medicalConditions: "",
        specialNeeds: "",
        favoriteActivities: "",
        dietaryRestrictions: "",
      },
    ],

    // Emergency Contact
    emergencyContacts: [
      {
        name: "",
        relationship: "",
        phone: "",
        alternatePhone: "",
        address: "",
        isAuthorizedPickup: false,
      },
    ],

    // Additional Information
    familySize: "",
    monthlyIncome: "",
    preferredDaycareType: "",
    maxDistance: "",
    budgetRange: "",
    additionalRequirements: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, section = null, index = null) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    if (section && index !== null) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [name]: fieldValue } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: fieldValue,
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

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          name: "",
          dateOfBirth: "",
          age: "",
          gender: "",
          bloodGroup: "",
          allergies: "",
          medicalConditions: "",
          specialNeeds: "",
          favoriteActivities: "",
          dietaryRestrictions: "",
        },
      ],
    }));
  };

  const removeChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        {
          name: "",
          relationship: "",
          phone: "",
          alternatePhone: "",
          address: "",
          isAuthorizedPickup: false,
        },
      ],
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleLogout = () => {
    navigate("/parent/login");
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation - you can expand this
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Here you would typically send the data to your backend
        console.log("Profile data:", formData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setAlertType("success");
        setAlertMessage("Profile updated successfully!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } catch (error) {
        console.error("Profile update error:", error);
        setAlertType("danger");
        setAlertMessage("Failed to update profile. Please try again.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
                  <FaEdit className="me-2" />
                  Update Profile
                </h1>
                <p className="page-subtitle">
                  Complete your profile to get the best daycare recommendations
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
              <Alert variant={alertType}>{alertMessage}</Alert>
            </Col>
          </Row>
        )}

        <Card className="profile-card">
          <Card.Body className="p-0">
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="profile-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="personal">
                    <FaUser className="me-2" />
                    Personal Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="address">
                    <FaMapMarkerAlt className="me-2" />
                    Address Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="children">
                    <FaChild className="me-2" />
                    Child Info
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="emergency">
                    <FaUserFriends className="me-2" />
                    Emergency Contact
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="additional">
                    <FaIdCard className="me-2" />
                    Additional Info
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="tab-content-wrapper">
                <Form onSubmit={handleSubmit}>
                  <Tab.Content>
                    {/* Personal Information Tab */}
                    <Tab.Pane eventKey="personal">
                      <div className="tab-section">
                        <h4 className="section-title">Personal Information</h4>

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
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Form.Select>
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
                              <Form.Label>Alternate Phone</Form.Label>
                              <Form.Control
                                type="tel"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleChange}
                                placeholder="01XXXXXXXXX (Optional)"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nationality</Form.Label>
                              <Form.Control
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="e.g., Bangladeshi"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>NID Number</Form.Label>
                              <Form.Control
                                type="text"
                                name="nidNumber"
                                value={formData.nidNumber}
                                onChange={handleChange}
                                placeholder="National ID Number"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Occupation</Form.Label>
                              <Form.Control
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                placeholder="Your profession"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Workplace</Form.Label>
                          <Form.Control
                            type="text"
                            name="workPlace"
                            value={formData.workPlace}
                            onChange={handleChange}
                            placeholder="Company/Organization name"
                          />
                        </Form.Group>
                      </div>
                    </Tab.Pane>

                    {/* Address Information Tab */}
                    <Tab.Pane eventKey="address">
                      <div className="tab-section">
                        <h4 className="section-title">Address Information</h4>

                        <Form.Group className="mb-3">
                          <Form.Label>Present Address *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="presentAddress"
                            value={formData.presentAddress}
                            onChange={handleChange}
                            placeholder="Enter your current address"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Permanent Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            placeholder="Enter your permanent address"
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>City *</Form.Label>
                              <Form.Select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
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
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>District</Form.Label>
                              <Form.Control
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Enter your district"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Postal Code</Form.Label>
                              <Form.Control
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Enter postal code"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Tab.Pane>

                    {/* Children Information Tab */}
                    <Tab.Pane eventKey="children">
                      <div className="tab-section">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="section-title">Child Information</h4>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={addChild}
                          >
                            <FaChild className="me-1" /> Add Another Child
                          </Button>
                        </div>

                        {formData.children.map((child, index) => (
                          <Card key={index} className="child-card mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">Child {index + 1}</h6>
                              {formData.children.length > 1 && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeChild(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </Card.Header>
                            <Card.Body>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Child's Name *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name"
                                      value={child.name}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Enter child's name"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                      type="date"
                                      name="dateOfBirth"
                                      value={child.dateOfBirth}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={4}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="age"
                                      value={child.age}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Age in years"
                                      min="0"
                                      max="12"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={4}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                      name="gender"
                                      value={child.gender}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                    >
                                      <option value="">Select gender</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                                <Col md={4}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Blood Group</Form.Label>
                                    <Form.Select
                                      name="bloodGroup"
                                      value={child.bloodGroup}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                    >
                                      <option value="">
                                        Select blood group
                                      </option>
                                      <option value="A+">A+</option>
                                      <option value="A-">A-</option>
                                      <option value="B+">B+</option>
                                      <option value="B-">B-</option>
                                      <option value="AB+">AB+</option>
                                      <option value="AB-">AB-</option>
                                      <option value="O+">O+</option>
                                      <option value="O-">O-</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Allergies</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="allergies"
                                      value={child.allergies}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Any known allergies"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Medical Conditions</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="medicalConditions"
                                      value={child.medicalConditions}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Any medical conditions"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Special Needs</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="specialNeeds"
                                      value={child.specialNeeds}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Any special needs or requirements"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Favorite Activities</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="favoriteActivities"
                                      value={child.favoriteActivities}
                                      onChange={(e) =>
                                        handleChange(e, "children", index)
                                      }
                                      placeholder="Child's favorite activities"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mb-3">
                                <Form.Label>Dietary Restrictions</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name="dietaryRestrictions"
                                  value={child.dietaryRestrictions}
                                  onChange={(e) =>
                                    handleChange(e, "children", index)
                                  }
                                  placeholder="Any dietary restrictions or preferences"
                                />
                              </Form.Group>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Tab.Pane>

                    {/* Emergency Contact Tab */}
                    <Tab.Pane eventKey="emergency">
                      <div className="tab-section">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4 className="section-title">Emergency Contact</h4>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={addEmergencyContact}
                          >
                            <FaUserFriends className="me-1" /> Add Contact
                          </Button>
                        </div>

                        {formData.emergencyContacts.map((contact, index) => (
                          <Card key={index} className="emergency-card mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">
                                Emergency Contact {index + 1}
                              </h6>
                              {formData.emergencyContacts.length > 1 && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeEmergencyContact(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </Card.Header>
                            <Card.Body>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Contact Name *</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name"
                                      value={contact.name}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          "emergencyContacts",
                                          index
                                        )
                                      }
                                      placeholder="Enter contact name"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Relationship *</Form.Label>
                                    <Form.Select
                                      name="relationship"
                                      value={contact.relationship}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          "emergencyContacts",
                                          index
                                        )
                                      }
                                    >
                                      <option value="">
                                        Select relationship
                                      </option>
                                      <option value="Spouse">Spouse</option>
                                      <option value="Parent">Parent</option>
                                      <option value="Sibling">Sibling</option>
                                      <option value="Grandparent">
                                        Grandparent
                                      </option>
                                      <option value="Friend">Friend</option>
                                      <option value="Relative">Relative</option>
                                      <option value="Other">Other</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Phone Number *</Form.Label>
                                    <Form.Control
                                      type="tel"
                                      name="phone"
                                      value={contact.phone}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          "emergencyContacts",
                                          index
                                        )
                                      }
                                      placeholder="01XXXXXXXXX"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Alternate Phone</Form.Label>
                                    <Form.Control
                                      type="tel"
                                      name="alternatePhone"
                                      value={contact.alternatePhone}
                                      onChange={(e) =>
                                        handleChange(
                                          e,
                                          "emergencyContacts",
                                          index
                                        )
                                      }
                                      placeholder="01XXXXXXXXX (Optional)"
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name="address"
                                  value={contact.address}
                                  onChange={(e) =>
                                    handleChange(e, "emergencyContacts", index)
                                  }
                                  placeholder="Enter contact address"
                                />
                              </Form.Group>

                              <Form.Group className="mb-3">
                                <Form.Check
                                  type="checkbox"
                                  name="isAuthorizedPickup"
                                  checked={contact.isAuthorizedPickup}
                                  onChange={(e) =>
                                    handleChange(e, "emergencyContacts", index)
                                  }
                                  label="Authorized to pick up child"
                                />
                              </Form.Group>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Tab.Pane>

                    {/* Additional Information Tab */}
                    <Tab.Pane eventKey="additional">
                      <div className="tab-section">
                        <h4 className="section-title">
                          Additional Information
                        </h4>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Family Size</Form.Label>
                              <Form.Select
                                name="familySize"
                                value={formData.familySize}
                                onChange={handleChange}
                              >
                                <option value="">Select family size</option>
                                <option value="2">2 members</option>
                                <option value="3">3 members</option>
                                <option value="4">4 members</option>
                                <option value="5">5 members</option>
                                <option value="6+">6+ members</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Monthly Income Range</Form.Label>
                              <Form.Select
                                name="monthlyIncome"
                                value={formData.monthlyIncome}
                                onChange={handleChange}
                              >
                                <option value="">Select income range</option>
                                <option value="Below 30,000">
                                  Below ৳30,000
                                </option>
                                <option value="30,000-50,000">
                                  ৳30,000 - ৳50,000
                                </option>
                                <option value="50,000-80,000">
                                  ৳50,000 - ৳80,000
                                </option>
                                <option value="80,000-120,000">
                                  ৳80,000 - ৳1,20,000
                                </option>
                                <option value="Above 120,000">
                                  Above ৳1,20,000
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Preferred Daycare Type</Form.Label>
                              <Form.Select
                                name="preferredDaycareType"
                                value={formData.preferredDaycareType}
                                onChange={handleChange}
                              >
                                <option value="">Select preference</option>
                                <option value="Home-based">Home-based</option>
                                <option value="Center-based">
                                  Center-based
                                </option>
                                <option value="Montessori">Montessori</option>
                                <option value="Play-based">Play-based</option>
                                <option value="Academic-focused">
                                  Academic-focused
                                </option>
                                <option value="No preference">
                                  No preference
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Maximum Distance (km)</Form.Label>
                              <Form.Select
                                name="maxDistance"
                                value={formData.maxDistance}
                                onChange={handleChange}
                              >
                                <option value="">Select distance</option>
                                <option value="1">Within 1 km</option>
                                <option value="2">Within 2 km</option>
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="15">Within 15 km</option>
                                <option value="No limit">No limit</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Budget Range (Monthly)</Form.Label>
                          <Form.Select
                            name="budgetRange"
                            value={formData.budgetRange}
                            onChange={handleChange}
                          >
                            <option value="">Select budget range</option>
                            <option value="Below 5,000">Below ৳5,000</option>
                            <option value="5,000-10,000">
                              ৳5,000 - ৳10,000
                            </option>
                            <option value="10,000-15,000">
                              ৳10,000 - ৳15,000
                            </option>
                            <option value="15,000-25,000">
                              ৳15,000 - ৳25,000
                            </option>
                            <option value="Above 25,000">Above ৳25,000</option>
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Additional Requirements</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="additionalRequirements"
                            value={formData.additionalRequirements}
                            onChange={handleChange}
                            placeholder="Any specific requirements or preferences for your child's daycare..."
                          />
                        </Form.Group>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>

                  {/* Submit Button */}
                  <div className="text-center py-4">
                    <Button
                      type="submit"
                      className="btn-profile-save"
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
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ParentProfile;
