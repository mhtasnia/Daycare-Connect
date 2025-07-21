import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import DaycareNavbar from "../components/DaycareNavbar";
import { Link, useNavigate } from "react-router-dom";

function DaycareLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/user-auth/daycares/login/",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        setShowAlert(true);
        setAlertVariant("success");
        setAlertMsg("Login successful!");
        // Save tokens to localStorage
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        console.log("Tokens saved:", {
          access: localStorage.getItem('access'),
          refresh: localStorage.getItem('refresh')
        });
        setTimeout(() => {
          navigate("/daycare/dashboard");
        }, 2000);
        // Save tokens or redirect as needed
      } catch (error) {
        setShowAlert(true);
        setAlertVariant("danger");
        if (error.response && error.response.data && error.response.data.detail) {
          setAlertMsg(error.response.data.detail);
        } else {
          setAlertMsg("Login failed. Please try again.");
        }
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <DaycareNavbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="mt-5">
            <Card className="shadow-lg">
              <Card.Body>
                <h2 className="mb-4 text-center">Daycare Login</h2>
                {showAlert && <Alert variant={alertVariant}>{alertMsg}</Alert>}
                <Form onSubmit={handleSubmit} autocomplete="off">
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
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label><FaLock className="me-2" />Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Enter password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        style={{ border: "none" }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Button
                    type="submit"
                    className="btn-parent-primary w-100 mt-2"
                    size="lg"
                  >
                    Log In
                  </Button>
                  <div className="text-center mt-3">
                    <span>New to Daycare Connect? </span>
                    <Link to="/daycare/register" className="fw-bold" style={{ color: "#90caf9" }}>
                      Register to get verified
                    </Link>
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
export default DaycareLogin;