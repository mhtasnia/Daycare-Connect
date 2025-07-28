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
  FaBuilding,
  FaIdCard,
  FaImages,
  FaPlus,
  FaTimes,
  FaTrash,
  FaStar,
  FaConciergeBell,
  FaUsers,
  FaCamera,
} from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/DaycareProfile.css";

function DaycareProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Area choices for dropdown
  const areaChoices = [
    { value: "gulshan", label: "Gulshan" },
    { value: "banani", label: "Banani" },
    { value: "uttara", label: "Uttara" },
    { value: "mirpur", label: "Mirpur" },
    { value: "wari", label: "Wari" },
    { value: "dhanmondi", label: "Dhanmondi" },
  ];

  // Profile data state
  const [profileData, setProfileData] = useState({
    email: "",
    user_type: "",
    is_verified: false,
    is_email_verified: false,
    joined_at: "",
    rating: 0,
    nid_number: "",
    main_image_url: "",
    images: [],
    staff: [],
    services: [],
  });

  // Daycare form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    area: "",
    images: [],
    imagePreviews: [],
  });

  // Service form data
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  // Staff form data
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    role: "",
    photo: null,
  });

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        navigate("/daycare/login", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/user-auth/daycare/profile/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = response.data;
      setProfileData(data);

      // Set form data
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        area: data.area || "",
        images: [],
        imagePreviews: data.images
          ? data.images.map((img) => img.image_url || img.image)
          : [],
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
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: files,
        imagePreviews: Array.from(files).map((file) =>
          URL.createObjectURL(file)
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ show: false, type: "success", msg: "" });

    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          for (let i = 0; i < formData.images.length; i++) {
            data.append("images", formData.images[i]);
          }
        } else if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      await axios.put(
        "http://localhost:8000/api/user-auth/daycare/profile/update/",
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

  // Service management functions
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const accessToken = localStorage.getItem("access");
      const url = editingService
        ? `http://localhost:8000/api/daycare/services/${editingService.id}/`
        : "http://localhost:8000/api/daycare/services/";

      const method = editingService ? "put" : "post";

      await axios[method](url, serviceFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAlert({
        show: true,
        type: "success",
        msg: `Service ${editingService ? "updated" : "added"} successfully!`,
      });

      setShowServiceModal(false);
      setEditingService(null);
      setServiceFormData({
        name: "",
        description: "",
        price: "",
      });

      await fetchProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: `Failed to ${editingService ? "update" : "add"} service.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const accessToken = localStorage.getItem("access");
        await axios.delete(
          `http://localhost:8000/api/daycare/services/${serviceId}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAlert({
          show: true,
          type: "success",
          msg: "Service deleted successfully!",
        });

        await fetchProfile();
      } catch (error) {
        setAlert({
          show: true,
          type: "danger",
          msg: "Failed to delete service.",
        });
      }
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        name: service.name,
        description: service.description,
        price: service.price,
      });
    } else {
      setEditingService(null);
      setServiceFormData({
        name: "",
        description: "",
        price: "",
      });
    }
    setShowServiceModal(true);
  };

  // Staff management functions
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();
      Object.keys(staffFormData).forEach((key) => {
        data.append(key, staffFormData[key]);
      });

      const url = editingStaff
        ? `http://localhost:8000/api/daycare/staff/${editingStaff.id}/`
        : "http://localhost:8000/api/daycare/staff/";

      const method = editingStaff ? "put" : "post";

      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({
        show: true,
        type: "success",
        msg: `Staff ${editingStaff ? "updated" : "added"} successfully!`,
      });

      setShowStaffModal(false);
      setEditingStaff(null);
      setStaffFormData({
        name: "",
        role: "",
        photo: null,
      });

      await fetchProfile();
    } catch (error) {
      setAlert({
        show: true,
        type: "danger",
        msg: `Failed to ${editingStaff ? "update" : "add"} staff.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const accessToken = localStorage.getItem("access");
        await axios.delete(
          `http://localhost:8000/api/daycare/staff/${staffId}/`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setAlert({
          show: true,
          type: "success",
          msg: "Staff member deleted successfully!",
        });

        await fetchProfile();
      } catch (error) {
        setAlert({
          show: true,
          type: "danger",
          msg: "Failed to delete staff member.",
        });
      }
    }
  };

  const openStaffModal = (staff = null) => {
    if (staff) {
      setEditingStaff(staff);
      setStaffFormData({
        name: staff.name,
        role: staff.role,
        photo: null,
      });
    } else {
      setEditingStaff(null);
      setStaffFormData({
        name: "",
        role: "",
        photo: null,
      });
    }
    setShowStaffModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-warning" : "text-muted"}
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="daycare-profile-wrapper">
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
    <div className="daycare-profile-wrapper">
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title">
                  <FaBuilding className="me-2" />
                  Daycare Profile
                </h1>
                <p className="page-subtitle">
                  Manage your daycare information and showcase your services
                </p>
              </div>
              <Button
                as={Link}
                to="/daycare/dashboard"
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
                  {profileData.main_image_url ? (
                    <Image
                      src={profileData.main_image_url}
                      roundedCircle
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        border: "4px solid #90caf9",
                      }}
                    />
                  ) : (
                    <div
                      className="avatar-placeholder d-flex align-items-center justify-content-center"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                        margin: "0 auto",
                      }}
                    >
                      <FaBuilding size={40} color="#23395d" />
                    </div>
                  )}
                </div>

                <h4 style={{ color: "#23395d" }}>
                  {formData.name || "Daycare Name"}
                </h4>

                <div className="mb-3">
                  {renderStars(profileData.rating)}
                  <small className="text-muted d-block">
                    ({profileData.rating}/5.0)
                  </small>
                </div>

                <div className="verification-badges mb-3">
                  <Badge
                    bg={profileData.is_verified ? "success" : "warning"}
                    className="me-2"
                  >
                    {profileData.is_verified
                      ? "✓ Verified"
                      : "⏳ Pending Verification"}
                  </Badge>
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
                    <FaIdCard className="me-2" />
                    NID: {profileData.nid_number}
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
                      <Nav.Link eventKey="profile">
                        <FaBuilding className="me-2" />
                        Profile
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="services">
                        <FaConciergeBell className="me-2" />
                        Services & Pricing
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="gallery">
                        <FaImages className="me-2" />
                        Gallery
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="staff">
                        <FaUsers className="me-2" />
                        Staff
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>

                <Card.Body className="tab-content-wrapper">
                  <Tab.Content>
                    {/* Profile Tab */}
                    <Tab.Pane eventKey="profile">
                      <Form onSubmit={handleSaveProfile}>
                        <div className="tab-section">
                          <h5 className="section-title">
                            <FaBuilding className="me-2" />
                            Daycare Information
                          </h5>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Daycare Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="Enter daycare name"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="Enter phone number"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  name="address"
                                  value={formData.address}
                                  onChange={handleChange}
                                  placeholder="Enter full address"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Area</Form.Label>
                                <Form.Select
                                  name="area"
                                  value={formData.area}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Area</option>
                                  {areaChoices.map((area) => (
                                    <option key={area.value} value={area.value}>
                                      {area.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <ReactQuill
                                  value={formData.description}
                                  onChange={handleDescriptionChange}
                                  placeholder="Describe your daycare..."
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

                    {/* Services Tab */}
                    <Tab.Pane eventKey="services">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="section-title">
                          <FaConciergeBell className="me-2" />
                          Our Services
                        </h5>
                        <Button
                          variant="primary"
                          onClick={() => openServiceModal()}
                        >
                          <FaPlus className="me-2" />
                          Add Service
                        </Button>
                      </div>
                      <Row>
                        {profileData.services?.map((service) => (
                          <Col md={6} key={service.id} className="mb-3">
                            <Card className="service-card">
                              <Card.Body>
                                <div className="d-flex justify-content-between">
                                  <Card.Title>{service.name}</Card.Title>
                                  <div>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => openServiceModal(service)}
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteService(service.id)
                                      }
                                    >
                                      <FaTrash />
                                    </Button>
                                  </div>
                                </div>
                                <Card.Text>{service.description}</Card.Text>
                                <Card.Text className="fw-bold">
                                  {service.price}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      {(!profileData.services ||
                        profileData.services.length === 0) && (
                        <div className="text-center py-5 empty-state">
                          <FaConciergeBell
                            size={48}
                            className="text-muted mb-3"
                          />
                          <h5>No Services Added</h5>
                          <p className="text-muted">
                            Add your services to let parents know what you
                            offer.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => openServiceModal()}
                          >
                            <FaPlus className="me-2" />
                            Add Your First Service
                          </Button>
                        </div>
                      )}
                    </Tab.Pane>

                    {/* Gallery Tab */}
                    <Tab.Pane eventKey="gallery">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="section-title">
                          <FaImages className="me-2" />
                          Photo Gallery
                        </h5>
                      </div>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaCamera className="me-2" />
                          Upload Photos
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Row>
                        {formData.imagePreviews.map((src, idx) => (
                          <Col md={4} key={idx} className="mb-3">
                            <Image
                              src={src}
                              alt={`Preview ${idx}`}
                              fluid
                              rounded
                            />
                          </Col>
                        ))}
                      </Row>
                    </Tab.Pane>

                    {/* Staff Tab */}
                    <Tab.Pane eventKey="staff">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="section-title">
                          <FaUsers className="me-2" />
                          Our Staff
                        </h5>
                        <Button
                          variant="primary"
                          onClick={() => openStaffModal()}
                        >
                          <FaPlus className="me-2" />
                          Add Staff
                        </Button>
                      </div>
                      <Row>
                        {profileData.staff?.map((staff) => (
                          <Col md={6} key={staff.id} className="mb-3">
                            <Card className="staff-card">
                              <Card.Body className="d-flex align-items-center">
                                <Image
                                  src={staff.photo_url}
                                  roundedCircle
                                  width={60}
                                  height={60}
                                  className="me-3"
                                />
                                <div>
                                  <Card.Title>{staff.name}</Card.Title>
                                  <Card.Text>{staff.role}</Card.Text>
                                </div>
                                <div className="ms-auto">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openStaffModal(staff)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteStaff(staff.id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                      {(!profileData.staff ||
                        profileData.staff.length === 0) && (
                        <div className="text-center py-5 empty-state">
                          <FaUsers size={48} className="text-muted mb-3" />
                          <h5>No Staff Added</h5>
                          <p className="text-muted">
                            Add your staff members to build trust with parents.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => openStaffModal()}
                          >
                            <FaPlus className="me-2" />
                            Add Your First Staff Member
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

        {/* Service Modal */}
        <Modal
          show={showServiceModal}
          onHide={() => setShowServiceModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingService ? "Edit Service" : "Add Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleServiceSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Service Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={serviceFormData.name}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={serviceFormData.description}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          description: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="text"
                      value={serviceFormData.price}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          price: e.target.value,
                        })
                      }
                      placeholder="e.g., 5000 BDT/month"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowServiceModal(false)}
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
                      {editingService ? "Update" : "Add"} Service
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Staff Modal */}
        <Modal
          show={showStaffModal}
          onHide={() => setShowStaffModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleStaffSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={staffFormData.name}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      value={staffFormData.role}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          role: e.target.value,
                        })
                      }
                      placeholder="e.g., Teacher, Assistant"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          photo: e.target.files[0],
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowStaffModal(false)}
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
                      {editingStaff ? "Update" : "Add"} Staff
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

export default DaycareProfile;
