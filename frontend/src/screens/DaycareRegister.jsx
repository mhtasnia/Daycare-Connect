import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaBuilding, FaCheckCircle } from "react-icons/fa";
import DaycareNavbar from "../components/DaycareNavbar";
import Footer from "../components/Footer";

function DaycareRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    license: "",
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Daycare name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.license) newErrors.license = "License/Registration number is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setShowAlert(true);
      // Submit logic here
    }
  };

  return (
    <div className="auth-wrapper">
      <DaycareNavbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="shadow-lg">
              <Card.Body>
                <h2 className="mb-4 text-center">Register Your Daycare</h2>
                {showAlert && <Alert variant="success">Registration successful!</Alert>}
                <Form onSubmit={handleSubmit}>
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
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
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
                  <Button type="submit" className="btn-parent-primary w-100 mt-2" size="lg">
                    Register
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