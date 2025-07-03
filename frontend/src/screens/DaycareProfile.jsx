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
} from "react-bootstrap";
import { FaUser, FaPhone, FaMapMarkerAlt, FaImage, FaEdit, FaSave, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


function DaycareProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "success", msg: "" });

  // Use profile from location state if available, else fetch
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    description: "",
    images: [],
    imagePreviews: [],
  });

  useEffect(() => {
    if (location.state && location.state.profile) {
      const data = location.state.profile;
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        description: data.description || "",
        images: [],
        imagePreviews: Array.isArray(data.images) ? data.images.map(img => img.image) : [],
      });
      setIsLoading(false);
    } else {
      // fallback: fetch from API
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
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
            description: data.description || "",
            images: [],
            imagePreviews: Array.isArray(data.images) ? data.images.map(img => img.image) : [],
          });
        } catch (err) {
          setAlert({ show: true, type: "danger", msg: "Failed to load profile." });
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [location.state, navigate]);

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
      // Only append images if there are any
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img) => data.append("images", img));
      }
      await axios.put("http://localhost:8000/api/user-auth/daycare/profile/update/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAlert({ show: true, type: "success", msg: "Profile updated successfully!" });
      setEditMode(false);
    } catch (err) {
      setAlert({ show: true, type: "danger", msg: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading your profile...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="daycare-profile-wrapper" style={{ background: "linear-gradient(120deg, #99f2c8 0%, #e0eafc 60%, #90caf9 100%)", minHeight: "100vh" }}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title" style={{ color: "#23395d" }}>
                  <FaEdit className="me-2" />
                  Daycare Profile
                </h1>
                <p className="page-subtitle" style={{ color: "#23395d" }}>
                  Present your daycare to parents. Add photos and a description!
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

        <Card className="profile-card" style={{ border: "2px solid #90caf9", background: "rgba(153, 242, 200, 0.08)" }}>
          <Card.Body>
            {!editMode ? (
              <div>
                <h4 style={{ color: "#23395d" }}>
                  <FaUser className="me-2" />
                  {formData.name}
                </h4>
                <p style={{ color: "#23395d" }}>
                  <FaPhone className="me-2" />
                  {formData.phone}
                </p>
                <p style={{ color: "#23395d" }}>
                  <FaMapMarkerAlt className="me-2" />
                  {formData.address}
                </p>
                <div>
                  <strong style={{ color: "#23395d" }}>Description:</strong>
                  <div
                    className="mt-2"
                    style={{ color: "#23395d" }}
                    dangerouslySetInnerHTML={{ __html: formData.description }}
                  />
                </div>
                <div className="d-flex flex-wrap mt-3">
                  {formData.imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      style={{
                        width: 120,
                        height: 90,
                        objectFit: "cover",
                        marginRight: 8,
                        borderRadius: 6,
                        border: "1px solid #eee",
                      }}
                    />
                  ))}
                </div>
                <Button
                  className="mt-4 btn-parent-primary"
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
            ) : (
              <Form onSubmit={handleSave} encType="multipart/form-data">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label style={{ color: "#23395d" }}>Daycare Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter daycare name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label style={{ color: "#23395d" }}>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label style={{ color: "#23395d" }}>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label style={{ color: "#23395d" }}>Description</Form.Label>
                  <ReactQuill
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe your daycare, facilities, philosophy, etc."
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="images">
                  <Form.Label style={{ color: "#23395d" }}>
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
                  <div className="d-flex flex-wrap mt-2">
                    {formData.imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        style={{
                          width: 100,
                          height: 80,
                          objectFit: "cover",
                          marginRight: 8,
                          borderRadius: 6,
                          border: "1px solid #eee",
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="btn-parent-primary w-100"
                    style={{
                      background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                      color: "#23395d",
                      border: "none",
                      borderRadius: "25px",
                      fontWeight: 600,
                    }}
                  >
                    {saving ? <Spinner animation="border" size="sm" /> : <><FaSave className="me-2" />Save</>}
                  </Button>
                  <Button variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default DaycareProfile;