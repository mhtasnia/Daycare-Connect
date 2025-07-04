import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Nav,
  Tab,
  Badge,
  Image,
  Modal,
} from "react-bootstrap";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaChild,
  FaPlus,
  FaTimes,
  FaUserShield,
  FaCamera,
  FaTrash,
  FaBirthdayCake,
  FaHeart,
} from "react-icons/fa";
import "../styles/ParentProfile.css";

function ParentProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });
  const [activeTab, setActiveTab] = useState("personal");
  const [showChildModal, setShowChildModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    email: "",
    user_type: "",
    is_email_verified: false,
    joined_at: "",
    full_name: "",
    profession: "",
    phone: "",
    profile_image: null,
    profile_image_url: "",
    children: [],
    address: null,
    emergency_contacts: [],
  });

  // Form data state
  const [formData, setFormData] = useState({
    full_name: "",
    profession: "",
    phone: "",
    profile_image: null,
    street_address: "",
    city: "",
    state_division: "",
    postal_code: "",
    country: "Bangladesh",
  });

  // Child form data
  const [childFormData, setChildFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    special_needs: "",
    photo: null,
  });

  // Emergency contact form data
  const [contactFormData, setContactFormData] = useState({
    full_name: "",
    relationship: "",
    phone_primary: "",
    phone_secondary: "",
    email: "",
    address: "",
    photo: null,
    is_authorized_pickup: false,
    notes: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        navigate("/parent/login", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/user-auth/parents/profile/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = response.data;
      setProfileData(data);

      // Set form data
      setFormData({
        full_name: data.full_name || "",
        profession: data.profession || "",
        phone: data.phone || "",
        profile_image: null,
        street_address: data.address?.street_address || "",
        city: data.address?.city || "",
        state_division: data.address?.state_division || "",
        postal_code: data.address?.postal_code || "",
        country: data.address?.country || "Bangladesh",
      });
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: "Failed to load profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData((prev) => ({ ...prev, profile_image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ show: false, type: "success", msg: "" });

    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        "http://localhost:8000/api/user-auth/parents/profile/update/",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlert({
        show: true,
        type: "success",
        msg: "Profile updated successfully!",
      });

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Child management functions
  const handleChildSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();

      Object.keys(childFormData).forEach((key) => {
        if (childFormData[key] !== null && childFormData[key] !== "") {
          data.append(key, childFormData[key]);
        }
      });

      const url = editingChild
        ? `http://localhost:8000/api/user-auth/parents/children/${editingChild.id}/`
        : "http://localhost:8000/api/user-auth/parents/children/";

      const method = editingChild ? "put" : "post";

      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        msg: `Child ${editingChild ? "updated" : "added"} successfully!`,
      });

      setShowChildModal(false);
      setEditingChild(null);
      setChildFormData({
        full_name: "",
        date_of_birth: "",
        gender: "",
        special_needs: "",
        photo: null,
      });

      await fetchProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: `Failed to ${editingChild ? "update" : "add"} child.`,
      });
    } finally {
      setSaving(false);
    }
  };

  // Emergency contact management functions
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();

      Object.keys(contactFormData).forEach((key) => {
        if (contactFormData[key] !== null && contactFormData[key] !== "") {
          data.append(key, contactFormData[key]);
        }
      });

      const url = editingContact
        ? `http://localhost:8000/api/user-auth/parents/emergency-contacts/${editingContact.id}/`
        : "http://localhost:8000/api/user-auth/parents/emergency-contacts/";

      const method = editingContact ? "put" : "post";

      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        msg: `Emergency contact ${
          editingContact ? "updated" : "added"
        } successfully!`,
      });

      setShowContactModal(false);
      setEditingContact(null);
      setContactFormData({
        full_name: "",
        relationship: "",
        phone_primary: "",
        phone_secondary: "",
        email: "",
        address: "",
        photo: null,
        is_authorized_pickup: false,
        notes: "",
      });

      await fetchProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: `Failed to ${
          editingContact ? "update" : "add"
        } emergency contact.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      try {
        const accessToken = localStorage.getItem("access");
        await axios.delete(
          `http://localhost:8000/api/user-auth/parents/children/${childId}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAlert({
          show: true,
          type: "success",
          msg: "Child deleted successfully!",
        });

        await fetchProfile();
      } catch (error) {
        setAlert({
          show: true,
          type: "danger",
          msg: "Failed to delete child.",
        });
      }
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (
      window.confirm("Are you sure you want to delete this emergency contact?")
    ) {
      try {
        const accessToken = localStorage.getItem("access");
        await axios.delete(
          `http://localhost:8000/api/user-auth/parents/emergency-contacts/${contactId}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAlert({
          show: true,
          type: "success",
          msg: "Emergency contact deleted successfully!",
        });

        await fetchProfile();
      } catch (error) {
        setAlert({
          show: true,
          type: "danger",
          msg: "Failed to delete emergency contact.",
        });
      }
    }
  };

  const openChildModal = (child = null) => {
    if (child) {
      setEditingChild(child);
      setChildFormData({
        full_name: child.full_name,
        date_of_birth: child.date_of_birth,
        gender: child.gender,
        special_needs: child.special_needs || "",
        photo: null,
      });
    } else {
      setEditingChild(null);
      setChildFormData({
        full_name: "",
        date_of_birth: "",
        gender: "",
        special_needs: "",
        photo: null,
      });
    }
    setShowChildModal(true);
  };

  const openContactModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setContactFormData({
        full_name: contact.full_name,
        relationship: contact.relationship,
        phone_primary: contact.phone_primary,
        phone_secondary: contact.phone_secondary || "",
        email: contact.email || "",
        address: contact.address || "",
        photo: null,
        is_authorized_pickup: contact.is_authorized_pickup,
        notes: contact.notes || "",
      });
    } else {
      setEditingContact(null);
      setContactFormData({
        full_name: "",
        relationship: "",
        phone_primary: "",
        phone_secondary: "",
        email: "",
        address: "",
        photo: null,
        is_authorized_pickup: false,
        notes: "",
      });
    }
    setShowContactModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title">
                  <FaUser className="me-2" />
                  My Profile
                </h1>
                <p className="page-subtitle">
                  Manage your personal information, children, and emergency
                  contacts
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

        {/* Alert */}
        {alert.show && (
          <Row className="mb-4">
            <Col>
              <Alert
                variant={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
                dismissible
              >
                <div className="d-flex align-items-center">
                  {alert.type === "success" ? (
                    <FaCheckCircle className="me-2" />
                  ) : (
                    <FaEdit className="me-2" />
                  )}
                  {alert.msg}
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        <Row>
          {/* Profile Info Card */}
          <Col lg={4} className="mb-4">
            <Card className="profile-info-card h-100">
              <Card.Body className="text-center">
                <div className="profile-avatar mb-3">
                  {profileData.profile_image_url ? (
                    <Image
                      src={profileData.profile_image_url}
                      roundedCircle
                      width={120}
                      height={120}
                      style={{ objectFit: "cover", border: "4px solid #f48fb1" }}
                    />
                  ) : (
                    <div
                      className="avatar-placeholder d-flex align-items-center justify-content-center"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #f48fb1, #ce93d8)",
                        margin: "0 auto",
                      }}
                    >
                      <FaUser size={40} color="white" />
                    </div>
                  )}
                </div>

                <h4 style={{ color: "#23395d" }}>
                  {profileData.full_name || "Parent Name"}
                </h4>

                <div className="verification-badges mb-3">
                  <Badge
                    bg={profileData.is_email_verified ? "success" : "danger"}
                  >
                    {profileData.is_email_verified
                      ? "✓ Email Verified"
                      : "✗ Email Not Verified"}
                  </Badge>
                </div>

                <div className="profile-details text-start">
                  <p style={{ color: "#23395d" }}>
                    <FaEnvelope className="me-2" />
                    {profileData.email}
                  </p>
                  <p style={{ color: "#23395d" }}>
                    <FaCalendarAlt className="me-2" />
                    Joined {formatDate(profileData.joined_at)}
                  </p>
                  <p style={{ color: "#23395d" }}>
                    <FaChild className="me-2" />
                    {profileData.children?.length || 0} Children
                  </p>
                  <p style={{ color: "#23395d" }}>
                    <FaUserShield className="me-2" />
                    {profileData.emergency_contacts?.length || 0} Emergency
                    Contacts
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Profile Card */}
          <Col lg={8}>
            <Card className="profile-card">
              <Tab.Container
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
              >
                <Card.Header className="profile-tabs">
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="personal">
                        <FaUser className="me-2" />
                        Personal Info
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="children">
                        <FaChild className="me-2" />
                        Children ({profileData.children?.length || 0})
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="emergency">
                        <FaUserShield className="me-2" />
                        Emergency Contacts (
                        {profileData.emergency_contacts?.length || 0})
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body className="tab-content-wrapper">
                  <Tab.Content>
                    {/* Personal Information Tab */}
                    <Tab.Pane eventKey="personal">
                      <Form onSubmit={handleSaveProfile}>
                        <div className="tab-section">
                          <h5 className="section-title">
                            <FaUser className="me-2" />
                            Personal Information
                          </h5>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>
                                  <FaUser className="me-2" />
                                  Full Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="full_name"
                                  value={formData.full_name}
                                  onChange={handleChange}
                                  placeholder="Enter your full name"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Profession</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="profession"
                                  value={formData.profession}
                                  onChange={handleChange}
                                  placeholder="Enter your profession"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>
                                  <FaPhone className="me-2" />
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="Enter your phone number"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>
                                  <FaCamera className="me-2" />
                                  Profile Picture
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  name="profile_image"
                                  accept="image/*"
                                  onChange={handleChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        <div className="tab-section">
                          <h5 className="section-title">
                            <FaMapMarkerAlt className="me-2" />
                            Address Information
                          </h5>
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Street Address</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="street_address"
                                  value={formData.street_address}
                                  onChange={handleChange}
                                  placeholder="Enter your street address"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="Enter your city"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>State/Division</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="state_division"
                                  value={formData.state_division}
                                  onChange={handleChange}
                                  placeholder="Enter your state/division"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="postal_code"
                                  value={formData.postal_code}
                                  onChange={handleChange}
                                  placeholder="Enter postal code"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleChange}
                                  placeholder="Enter country"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>

                        <div className="text-center">
                          <Button
                            type="submit"
                            className="btn-profile-save"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="me-2"
                                />
                                Saving...
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
                    </Tab.Pane>

                    {/* Children Tab */}
                    <Tab.Pane eventKey="children">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="section-title">
                          <FaChild className="me-2" />
                          My Children
                        </h5>
                        <Button
                          variant="primary"
                          onClick={() => openChildModal()}
                        >
                          <FaPlus className="me-2" />
                          Add Child
                        </Button>
                      </div>

                      <Row>
                        {profileData.children?.map((child) => (
                          <Col md={6} key={child.id} className="mb-3">
                            <Card className="child-card">
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {child.photo_url ? (
                                    <Image
                                      src={child.photo_url}
                                      roundedCircle
                                      width={40}
                                      height={40}
                                      className="me-2"
                                      style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div
                                      className="child-avatar me-2"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background: "#f48fb1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FaChild color="white" />
                                    </div>
                                  )}
                                  <strong>{child.full_name}</strong>
                                </div>
                                <div>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openChildModal(child)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteChild(child.id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <p>
                                  <FaBirthdayCake className="me-2" />
                                  <strong>Age:</strong> {child.age} years old
                                </p>
                                <p>
                                  <strong>Gender:</strong>{" "}
                                  {child.gender.charAt(0).toUpperCase() +
                                    child.gender.slice(1)}
                                </p>
                                <p>
                                  <strong>Date of Birth:</strong>{" "}
                                  {formatDate(child.date_of_birth)}
                                </p>
                                {child.special_needs && (
                                  <p>
                                    <FaHeart className="me-2" />
                                    <strong>Special Needs:</strong>{" "}
                                    {child.special_needs}
                                  </p>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      {(!profileData.children ||
                        profileData.children.length === 0) && (
                        <div className="text-center py-5">
                          <FaChild size={48} className="text-muted mb-3" />
                          <h5>No Children Added</h5>
                          <p className="text-muted">
                            Add your children's information to get started with
                            daycare bookings.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => openChildModal()}
                          >
                            <FaPlus className="me-2" />
                            Add Your First Child
                          </Button>
                        </div>
                      )}
                    </Tab.Pane>

                    {/* Emergency Contacts Tab */}
                    <Tab.Pane eventKey="emergency">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="section-title">
                          <FaUserShield className="me-2" />
                          Emergency Contacts
                        </h5>
                        <Button
                          variant="primary"
                          onClick={() => openContactModal()}
                        >
                          <FaPlus className="me-2" />
                          Add Contact
                        </Button>
                      </div>

                      <Row>
                        {profileData.emergency_contacts?.map((contact) => (
                          <Col md={6} key={contact.id} className="mb-3">
                            <Card className="emergency-card">
                              <Card.Header className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  {contact.photo_url ? (
                                    <Image
                                      src={contact.photo_url}
                                      roundedCircle
                                      width={40}
                                      height={40}
                                      className="me-2"
                                      style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div
                                      className="contact-avatar me-2"
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background: "#90caf9",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FaUserShield color="white" />
                                    </div>
                                  )}
                                  <div>
                                    <strong>{contact.full_name}</strong>
                                    <br />
                                    <small className="text-muted">
                                      {contact.relationship.charAt(0).toUpperCase() +
                                        contact.relationship.slice(1)}
                                    </small>
                                  </div>
                                </div>
                                <div>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openContactModal(contact)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteContact(contact.id)
                                    }
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <p>
                                  <FaPhone className="me-2" />
                                  <strong>Primary:</strong>{" "}
                                  {contact.phone_primary}
                                </p>
                                {contact.phone_secondary && (
                                  <p>
                                    <FaPhone className="me-2" />
                                    <strong>Secondary:</strong>{" "}
                                    {contact.phone_secondary}
                                  </p>
                                )}
                                {contact.email && (
                                  <p>
                                    <FaEnvelope className="me-2" />
                                    {contact.email}
                                  </p>
                                )}
                                {contact.is_authorized_pickup && (
                                  <Badge bg="success" className="mb-2">
                                    ✓ Authorized for Pickup
                                  </Badge>
                                )}
                                {contact.notes && (
                                  <p>
                                    <small className="text-muted">
                                      {contact.notes}
                                    </small>
                                  </p>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      {(!profileData.emergency_contacts ||
                        profileData.emergency_contacts.length === 0) && (
                        <div className="text-center py-5">
                          <FaUserShield size={48} className="text-muted mb-3" />
                          <h5>No Emergency Contacts</h5>
                          <p className="text-muted">
                            Add emergency contacts for your children's safety and
                            security.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => openContactModal()}
                          >
                            <FaPlus className="me-2" />
                            Add Emergency Contact
                          </Button>
                        </div>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Tab.Container>
            </Card>
          </Col>
        </Row>

        {/* Child Modal */}
        <Modal
          show={showChildModal}
          onHide={() => setShowChildModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingChild ? "Edit Child" : "Add Child"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleChildSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={childFormData.full_name}
                      onChange={(e) =>
                        setChildFormData({
                          ...childFormData,
                          full_name: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={childFormData.date_of_birth}
                      onChange={(e) =>
                        setChildFormData({
                          ...childFormData,
                          date_of_birth: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={childFormData.gender}
                      onChange={(e) =>
                        setChildFormData({
                          ...childFormData,
                          gender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setChildFormData({
                          ...childFormData,
                          photo: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Special Needs/Medical Conditions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={childFormData.special_needs}
                      onChange={(e) =>
                        setChildFormData({
                          ...childFormData,
                          special_needs: e.target.value,
                        })
                      }
                      placeholder="Any allergies, medical conditions, or special needs..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowChildModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      {editingChild ? "Update" : "Add"} Child
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Emergency Contact Modal */}
        <Modal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleContactSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactFormData.full_name}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          full_name: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Select
                      value={contactFormData.relationship}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          relationship: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="friend">Friend</option>
                      <option value="neighbor">Neighbor</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactFormData.phone_primary}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          phone_primary: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Secondary Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactFormData.phone_secondary}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          phone_secondary: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={contactFormData.email}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          photo: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={contactFormData.address}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          address: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Authorized to pick up children"
                      checked={contactFormData.is_authorized_pickup}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          is_authorized_pickup: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={contactFormData.notes}
                      onChange={(e) =>
                        setContactFormData({
                          ...contactFormData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Additional notes about this contact..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      {editingContact ? "Update" : "Add"} Contact
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default ParentProfile;