import { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaBuilding, FaCheckCircle, FaImage } from "react-icons/fa";
import DaycareNavbar from "../components/DaycareNavbar";
import Footer from "../components/Footer";
import axios from "axios";

function DaycareRegister() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    license: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        // Validate file type and size (max 3MB, jpg/png/pdf)
        const validTypes = ["image/jpeg", "images/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type)) {
          setErrors((prev) => ({ ...prev, image: "Only JPG, PNG, or PDF allowed." }));
          setImagePreview(null);
          return;
        }
        if (file.size > 3 * 1024 * 1024) {
          setErrors((prev) => ({ ...prev, image: "File must be less than 3MB." }));
          setImagePreview(null);
          return;
        }
        setErrors((prev) => ({ ...prev, image: null }));
        setFormData((prev) => ({ ...prev, image: file }));
        if (file.type.startsWith("image/")) {
          setImagePreview(URL.createObjectURL(file));
        } else {
          setImagePreview(null);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form before submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.name) newErrors.name = "Daycare name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.license) newErrors.license = "License/Registration number is required";
    if (!formData.image) newErrors.image = "Logo or license document is required";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setAlertMsg("");
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("license", formData.license);
      if (formData.image) data.append("image", formData.image);
      data.append("user_type", "daycare");

      await axios.post(
        "http://localhost:8000/api/user-auth/daycares/register/", // <-- TRAILING SLASH
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setShowAlert(true);
      setAlertMsg("Registration request submitted. Await admin verification.");
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        address: "",
        license: "",
        image: null,
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        setAlertMsg("Registration failed. Please check the form.");
      } else {
        setAlertMsg("An error occurred. Please try again.");
      }
      setShowAlert(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <DaycareNavbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={7} lg={6} className="mt-5">
            <Card className="shadow-lg">
              <Card.Body>
                <h2 className="mb-4 text-center">Register Your Daycare</h2>
                {showAlert && (
                  <Alert variant={alertMsg.startsWith("Registration request") ? "success" : "danger"}>
                    {alertMsg}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label><FaLock className="me-2" />Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      placeholder="Enter password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      placeholder="Confirm password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label><FaBuilding className="me-2" />Daycare Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      placeholder="Enter daycare name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label><FaPhone className="me-2" />Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                      placeholder="Enter phone number"
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label><FaMapMarkerAlt className="me-2" />Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                      placeholder="Enter address"
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="license">
                    <Form.Label><FaCheckCircle className="me-2" />License/Registration No.</Form.Label>
                    <Form.Control
                      type="text"
                      name="license"
                      value={formData.license}
                      onChange={handleChange}
                      isInvalid={!!errors.license}
                      placeholder="Enter license or registration number"
                    />
                    <Form.Control.Feedback type="invalid">{errors.license}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="image">
                    <Form.Label>
                      <FaImage className="me-2" />
                      Logo or License Document (JPG, PNG, PDF, max 3MB)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      isInvalid={!!errors.image}
                      ref={fileInputRef}
                    />
                    <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ maxWidth: "180px", maxHeight: "120px", borderRadius: "0.5rem", border: "1px solid #eee" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                  <Button
                    type="submit"
                    className="btn-parent-primary w-100 mt-2"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner animation="border" size="sm" /> : "Register"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}
export default DaycareRegister;