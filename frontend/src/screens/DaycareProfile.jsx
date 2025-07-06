import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
  Badge,
  Image,
} from "react-bootstrap";
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaImage, 
  FaEdit, 
  FaSave, 
  FaArrowLeft, 
  FaCheckCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaStar,
  FaBuilding,
  FaIdCard,
  FaImages,
  FaTimes
} from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function DaycareProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    services: "",
    area: "",
    images: [],
    imagePreviews: [],
  });

  const [profileData, setProfileData] = useState({
    email: "",
    user_type: "",
    is_verified: false,
    is_email_verified: false,
    joined_at: "",
    rating: 0,
    nid_number: "",
    main_image_url: "",
    images: []
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
      
      const res = await axios.get("http://localhost:8000/api/user-auth/daycare/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      const data = res.data;
      setProfileData({
        email: data.email || "",
        user_type: data.user_type || "",
        is_verified: data.is_verified || false,
        is_email_verified: data.is_email_verified || false,
        joined_at: data.joined_at || "",
        rating: data.rating || 0,
        nid_number: data.nid_number || "",
        main_image_url: data.main_image_url || "",
        images: data.images || []
      });
      
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        services: data.services || "",
        area: data.area || "",
        images: [],
        imagePreviews: data.images ? data.images.map(img => img.image_url || img.image) : [],
      });
    } catch (err) {
      setAlert({ show: true, type: "danger", msg: "Failed to load profile." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle description (rich text)
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
      imagePreviews: files.map((file) => URL.createObjectURL(file)),
    }));
  };

  // Remove image preview
  const removeImagePreview = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ show: false, type: "success", msg: "" });
    
    try {
      const accessToken = localStorage.getItem("access");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("services", formData.services);
      data.append("area", formData.area);
      
      // Only append images if there are any
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => data.append("images", img));
      }
      
      const response = await axios.put(
        "http://localhost:8000/api/user-auth/daycare/profile/update/", 
        data, 
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      setAlert({ show: true, type: "success", msg: "Profile updated successfully!" });
      setEditMode(false);
      
      // Refresh profile data
      await fetchProfile();
      
    } catch (err) {
      setAlert({ show: true, type: "danger", msg: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <div className="daycare-profile-wrapper" style={{ background: "linear-gradient(120deg, #99f2c8 0%, #e0eafc 60%, #90caf9 100%)", minHeight: "100vh" }}>
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
    <div className="daycare-profile-wrapper" style={{ background: "linear-gradient(120deg, #99f2c8 0%, #e0eafc 60%, #90caf9 100%)", minHeight: "100vh" }}>
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title" style={{ color: "#23395d" }}>
                  <FaBuilding className="me-2" />
                  Daycare Profile
                </h1>
                <p className="page-subtitle" style={{ color: "#23395d" }}>
                  Manage your daycare information and showcase your services
                </p>
              </div>
              <Button
                as={Link}
                to="/daycare/dashboard"
                variant="outline-secondary"
                className="back-btn"
                style={{ color: "#23395d", borderColor: "#90caf9" }}
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
              <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
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
            <Card className="profile-info-card h-100" style={{ border: "2px solid #90caf9", background: "rgba(153, 242, 200, 0.08)" }}>
              <Card.Body className="text-center">
                <div className="profile-avatar mb-3">
                  {profileData.main_image_url ? (
                    <Image 
                      src={profileData.main_image_url} 
                      roundedCircle 
                      width={120} 
                      height={120}
                      style={{ objectFit: 'cover', border: '4px solid #90caf9' }}
                    />
                  ) : (
                    <div 
                      className="avatar-placeholder d-flex align-items-center justify-content-center"
                      style={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #99f2c8, #90caf9)',
                        margin: '0 auto'
                      }}
                    >
                      <FaBuilding size={40} color="#23395d" />
                    </div>
                  )}
                </div>
                
                <h4 style={{ color: "#23395d" }}>{formData.name || "Daycare Name"}</h4>
                
                <div className="mb-3">
                  {renderStars(profileData.rating)}
                  <small className="text-muted d-block">({profileData.rating}/5.0)</small>
                </div>

                <div className="verification-badges mb-3">
                  <Badge 
                    bg={profileData.is_verified ? "success" : "warning"} 
                    className="me-2"
                  >
                    {profileData.is_verified ? "✓ Verified" : "⏳ Pending Verification"}
                  </Badge>
                  <Badge 
                    bg={profileData.is_email_verified ? "success" : "danger"}
                  >
                    {profileData.is_email_verified ? "✓ Email Verified" : "✗ Email Not Verified"}
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
            <Card className="profile-card" style={{ border: "2px solid #90caf9", background: "rgba(153, 242, 200, 0.08)" }}>
              <Card.Body>
                {!editMode ? (
                  // View Mode
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 style={{ color: "#23395d" }}>
                        <FaUser className="me-2" />
                        Daycare Information
                      </h4>
                      <Button
                        className="btn-edit-profile"
                        style={{
                          background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                          color: "#23395d",
                          border: "none",
                          borderRadius: "25px",
                          fontWeight: 600,
                        }}
                        onClick={() => setEditMode(true)}
                      >
                        <FaEdit className="me-2" />
                        Edit Profile
                      </Button>
                    </div>

                    <Row>
                      <Col md={6} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          <FaBuilding className="me-2" />
                          Daycare Name:
                        </strong>
                        <p style={{ color: "#555" }}>{formData.name || "Not provided"}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          <FaPhone className="me-2" />
                          Phone:
                        </strong>
                        <p style={{ color: "#555" }}>{formData.phone || "Not provided"}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          <FaMapMarkerAlt className="me-2" />
                          Area:
                        </strong>
                        <p style={{ color: "#555" }}>{formData.area || "Not provided"}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          Services:
                        </strong>
                        <p style={{ color: "#555" }}>{formData.services || "Not provided"}</p>
                      </Col>
                      <Col md={12} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          <FaMapMarkerAlt className="me-2" />
                          Full Address:
                        </strong>
                        <p style={{ color: "#555" }}>{formData.address || "Not provided"}</p>
                      </Col>
                      <Col md={12} className="mb-3">
                        <strong style={{ color: "#23395d" }}>
                          Description:
                        </strong>
                        <div
                          className="mt-2"
                          style={{ color: "#555" }}
                          dangerouslySetInnerHTML={{ __html: formData.description || "No description provided" }}
                        />
                      </Col>
                    </Row>

                    {/* Gallery */}
                    <div className="mt-4">
                      <h5 style={{ color: "#23395d" }}>
                        <FaImages className="me-2" />
                        Photo Gallery
                      </h5>
                      <Row>
                        {profileData.images && profileData.images.length > 0 ? (
                          profileData.images.map((img, idx) => (
                            <Col md={4} sm={6} key={idx} className="mb-3">
                              <Image
                                src={img.image_url || img.image}
                                alt={`Gallery ${idx + 1}`}
                                fluid
                                rounded
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  border: "2px solid #90caf9"
                                }}
                              />
                            </Col>
                          ))
                        ) : (
                          <Col>
                            <p style={{ color: "#666", fontStyle: "italic" }}>
                              No photos uploaded yet. Add some photos to showcase your daycare!
                            </p>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <Form onSubmit={handleSave} encType="multipart/form-data">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 style={{ color: "#23395d" }}>
                        <FaEdit className="me-2" />
                        Edit Daycare Information
                      </h4>
                    </div>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            <FaBuilding className="me-2" />
                            Daycare Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter daycare name"
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            <FaPhone className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="area">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            <FaMapMarkerAlt className="me-2" />
                            Area
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Enter area/location"
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="services">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            Services Offered
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            placeholder="e.g., Full-time care, Part-time care, Meals"
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="address">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            <FaMapMarkerAlt className="me-2" />
                            Full Address
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter complete address"
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="description">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            Description
                          </Form.Label>
                          <ReactQuill
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe your daycare, facilities, philosophy, etc."
                            style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "10px"
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="images">
                          <Form.Label style={{ color: "#23395d", fontWeight: 600 }}>
                            <FaImage className="me-2" />
                            Daycare Photos (multiple allowed)
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                              background: "rgba(255, 255, 255, 0.8)",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "10px"
                            }}
                          />
                          
                          {/* Image Previews */}
                          {formData.imagePreviews.length > 0 && (
                            <div className="mt-3">
                              <Row>
                                {formData.imagePreviews.map((src, idx) => (
                                  <Col md={3} sm={4} xs={6} key={idx} className="mb-2">
                                    <div className="position-relative">
                                      <Image
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                        fluid
                                        rounded
                                        style={{
                                          width: "100%",
                                          height: "100px",
                                          objectFit: "cover",
                                          border: "2px solid #90caf9"
                                        }}
                                      />
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0"
                                        style={{ 
                                          borderRadius: "50%", 
                                          width: "25px", 
                                          height: "25px",
                                          padding: 0,
                                          margin: "2px"
                                        }}
                                        onClick={() => removeImagePreview(idx)}
                                      >
                                        <FaTimes size={12} />
                                      </Button>
                                    </div>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-4">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="btn-save-profile flex-fill"
                        style={{
                          background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                          color: "#23395d",
                          border: "none",
                          borderRadius: "25px",
                          fontWeight: 600,
                          padding: "12px"
                        }}
                      >
                        {saving ? (
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
                        variant="outline-secondary" 
                        onClick={() => setEditMode(false)} 
                        disabled={saving}
                        style={{
                          borderRadius: "25px",
                          fontWeight: 600,
                          padding: "12px 24px"
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DaycareProfile;