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
  ListGroup,
  Tab,
  Nav,
} from "react-bootstrap";
import { 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaImage, 
  FaEdit, 
  FaDollarSign,
  FaSave, 
  FaArrowLeft, 
  FaCheckCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaStar,
  FaBuilding,
  FaIdCard,
  FaImages,
  FaTimes,
  FaConciergeBell,
  FaInfoCircle
} from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/DaycareProfile.css";

function DaycareProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });
  const [activeTab, setActiveTab] = useState("info");


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    services: "",
    featured_services: "",
    area: "",
    images: [],
    imagePreviews: [],
    pricing_tiers: [],
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
        images: data.images || [],
        pricing_tiers: data.pricing_tiers || [], // <-- ADD THIS LINE
      });
      
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        services: data.services || "",
        featured_services: data.featured_services || "",
        area: data.area || "",
        images: [],
        imagePreviews: data.images ? data.images.map(img => img.image_url || img.image) : [],
        pricing_tiers: data.pricing_tiers || [], // <-- CHANGE THIS LINE
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

  // Handle pricing tier changes
  const handleTierChange = (index, event) => {
    const newTiers = formData.pricing_tiers.map((tier, i) => {
      if (index === i) {
        return { ...tier, [event.target.name]: event.target.value };
      }
      return tier;
    });
    setFormData((prev) => ({ ...prev, pricing_tiers: newTiers }));
  };

  // Add new pricing tier
  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricing_tiers: [...prev.pricing_tiers, { name: '', price: '', frequency: 'Monthly' }]
    }));
  };

  // Remove pricing tier
  const removeTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      pricing_tiers: prev.pricing_tiers.filter((_, i) => i !== index)
    }));
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
      data.append("featured_services", formData.featured_services);
      data.append("area", formData.area);
      
      // Add pricing tiers
     // Add pricing tiers
      const pricingTiers = formData.pricing_tiers.map(tier => ({
        name: tier.name,
        price: tier.price,
        frequency: tier.frequency,
        is_active: true 
      }));

      data.append("pricing_tiers", JSON.stringify(pricingTiers));

      console.log("DEBUG Frontend: pricingTiers before sending:", pricingTiers); // ADD THIS LINE
  // ...
      
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
            <Card className="profile-info-card h-100">
              <Card.Body className="text-center">
                <div className="profile-avatar mb-3">
                  {profileData.main_image_url ? (
                    <Image 
                      src={profileData.main_image_url} 
                      roundedCircle 
                      width={120} 
                      height={120}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <FaBuilding size={40} color="#23395d" />
                    </div>
                  )}
                </div>
                
                <h4 className="daycare-name">{formData.name || "Daycare Name"}</h4>
                
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
                  <p>
                    <FaEnvelope/>
                    {profileData.email}
                  </p>
                  <p>
                    <FaCalendarAlt/>
                    Joined {formatDate(profileData.joined_at)}
                  </p>
                  <p>
                    <FaIdCard/>
                    NID: {profileData.nid_number}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Profile Card */}
          <Col lg={8}>
            <Card className="profile-main-card">
               <Card.Body>
                {!editMode ? (
                  // View Mode
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="section-title" style={{marginBottom: 0}}>
                        <FaUser className="me-2" />
                        Daycare Information
                      </h4>
                      <Button
                        className="btn-edit-profile"
                        onClick={() => setEditMode(true)}
                      >
                        <FaEdit className="me-2" />
                        Edit Profile
                      </Button>
                    </div>
                    <hr/>

                    <div className="view-section">
                      <Row>
                        <Col md={6} className="mb-3">
                          <strong><FaBuilding className="me-2" />Daycare Name:</strong>
                          <p>{formData.name || "Not provided"}</p>
                        </Col>
                        <Col md={6} className="mb-3">
                          <strong><FaPhone className="me-2" />Phone:</strong>
                          <p>{formData.phone || "Not provided"}</p>
                        </Col>
                        <Col md={6} className="mb-3">
                          <strong><FaMapMarkerAlt className="me-2" />Area:</strong>
                          <p>{formData.area || "Not provided"}</p>
                        </Col>
                         <Col md={6} className="mb-3">
                          <strong><FaMapMarkerAlt className="me-2" />Full Address:</strong>
                          <p>{formData.address || "Not provided"}</p>
                        </Col>
                      </Row>
                    </div>
                     <div className="view-section">
                        <h5 className="section-title"><FaInfoCircle/> Description</h5>
                        <div
                          className="description-content"
                          dangerouslySetInnerHTML={{ __html: formData.description || "No description provided" }}
                        />
                    </div>

                    <div className="view-section">
                        <h5 className="section-title"><FaConciergeBell/> Services</h5>
                        <Row>
                            <Col md={6} className="mb-3">
                                <strong>Services:</strong>
                                <p>{formData.services || "Not provided"}</p>
                            </Col>
                            <Col md={6} className="mb-3">
                                <strong>Featured Services:</strong>
                                <p>{formData.featured_services || "Not provided"}</p>
                            </Col>
                        </Row>
                    </div>

                    <div className="view-section">
                      <h5 className="section-title"><FaDollarSign/> Pricing</h5>
                        {profileData.pricing_tiers && profileData.pricing_tiers.length > 0 ? (
                          <ListGroup variant="flush" style={{ maxWidth: '500px', margin: '0 auto' }}>
                            {profileData.pricing_tiers.map((tier, idx) => (
                              <ListGroup.Item
                                key={idx}
                                className="d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <strong style={{ color: "#23395d" }}>
                                    {tier.name || "Unnamed Plan"}
                                  </strong>
                                  <Badge bg="info" className="ms-2">
                                    {tier.frequency}
                                  </Badge>
                                </div>
                                <span className="h5" style={{ color: "#007bff" }}>
                                  ৳{tier.price}
                                </span>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <p>Not provided</p>
                        )}
                    </div>

                    <div className="view-section">
                      <h5 className="section-title"><FaImages/> Photo Gallery</h5>
                      <Row>
                        {profileData.images && profileData.images.length > 0 ? (
                          profileData.images.map((img, idx) => (
                            <Col md={4} sm={6} key={idx} className="mb-3">
                              <Image
                                src={img.image_url || img.image}
                                alt={`Gallery ${idx + 1}`}
                                className="gallery-image"
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
                      <h4 className="section-title" style={{marginBottom: 0}}>
                        <FaEdit className="me-2" />
                        Edit Daycare Information
                      </h4>
                    </div>
                    <hr/>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                          <Form.Label>
                            <FaBuilding className="me-2" />
                            Daycare Name
                          </Form.Label>
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
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label>
                            <FaPhone className="me-2" />
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="area">
                          <Form.Label>
                            <FaMapMarkerAlt className="me-2" />
                            Area
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Enter area/location"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="services">
                          <Form.Label>
                            Services Offered
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="services"
                            value={formData.services}
                            onChange={handleChange}
                            placeholder="e.g., Full-time care, Part-time care, Meals"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="address">
                          <Form.Label>
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
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="description">
                          <Form.Label>
                            Description
                          </Form.Label>
                          <ReactQuill
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe your daycare, facilities, philosophy, etc."
                          />
                        </Form.Group>
                      </Col>

                      {/* Pricing Tiers */}
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaDollarSign className="me-2" />
                            Pricing Tiers
                          </Form.Label>
                          
                          {formData.pricing_tiers.map((tier, index) => (
                            <Card body className="mb-2 pricing-tier-card" key={index}>
                              <div className="tier-edit-row">
                                <div className="tier-input-group">
                                  <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Tier Name (e.g., Full Day)"
                                    value={tier.name}
                                    onChange={(e) => handleTierChange(index, e)}
                                  />
                                  <Form.Control
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={tier.price}
                                    onChange={(e) => handleTierChange(index, e)}
                                  />
                                  <Form.Select
                                    name="frequency"
                                    value={tier.frequency}
                                    onChange={(e) => handleTierChange(index, e)}
                                  >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Daily">Daily</option>
                                  </Form.Select>
                                </div>
                                <Button
                                  variant="danger"
                                  className="btn-remove-tier"
                                  onClick={() => removeTier(index)}
                                >
                                  <FaTimes />
                                </Button>
                              </div>
                            </Card>
                          ))}
                          
                          <Button
                            variant="outline-primary"
                            onClick={addTier}
                          >
                            Add Tier
                          </Button>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="featured_services">
                          <Form.Label>
                            Featured Services
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="featured_services"
                            value={formData.featured_services}
                            onChange={handleChange}
                            placeholder="Highlight your best services (e.g., special programs, activities)"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3" controlId="images">
                          <Form.Label>
                            <FaImage className="me-2" />
                            Daycare Photos (multiple allowed)
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          
                          {/* Image Previews */}
                          {formData.imagePreviews.length > 0 && (
                            <div className="mt-3">
                              <Row>
                                {formData.imagePreviews.map((src, idx) => (
                                  <Col md={3} sm={4} xs={6} key={idx} className="mb-2">
                                    <div className="image-preview">
                                      <Image
                                        src={src}
                                        alt={`Preview ${idx + 1}`}
                                      />
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="btn-remove-image"
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
                        className="btn-cancel"
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