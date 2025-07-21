import { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaBuilding, FaCheckCircle, FaImage, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import DaycareNavbar from "../components/DaycareNavbar";
import OTPVerification from "../components/OTPVerification";
import axios from "axios";

function DaycareRegister() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    nid_number: "", // changed from license
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [verifiedOTP, setVerifiedOTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Clear errors when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
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
    if (!formData.nid_number) newErrors.nid_number = "NID number is required"; // updated validation
    if (!formData.image) newErrors.image = "Logo or license document is required";
    return newErrors;
  };

  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setAlertMsg("");
    
    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);

    try {
      await axios.post('http://localhost:8000/api/user-auth/send-otp/', {
        email: formData.email,
        purpose: 'registration'
      });

      setAlertType("info");
      setAlertMsg("Verification code sent to your email!");
      setShowAlert(true);
      setCurrentStep(2);

    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.email) {
          setErrors({ email: errorData.email[0] });
        } else if (errorData.non_field_errors) {
          setAlertMsg(errorData.non_field_errors[0]);
        } else {
          setAlertMsg("Failed to send verification code. Please try again.");
        }
      } else {
        setAlertMsg("Network error. Please try again.");
      }
      setAlertType("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification success
  const handleOTPVerification = (otpCode) => {
    setVerifiedOTP(otpCode);
    handleFinalRegistration(otpCode);
  };

  // Handle final registration
  const handleFinalRegistration = async (otpCode) => {
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("otp_code", otpCode);
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("nid_number", formData.nid_number); // updated field
      if (formData.image) data.append("image", formData.image);
      data.append("user_type", "daycare");

      await axios.post(
        "http://localhost:8000/api/user-auth/daycares/register/",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAlertType("success");
      setAlertMsg("Registration request submitted successfully! Please await admin verification.");
      setShowAlert(true);
      
      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        address: "",
        nid_number: "", // updated field
        image: null,
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Go back to step 1 after success
      setTimeout(() => {
        setCurrentStep(1);
      }, 3000);

    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
        setAlertMsg("Registration failed. Please check the form.");
      } else {
        setAlertMsg("An error occurred. Please try again.");
      }
      setAlertType("danger");
      setShowAlert(true);
      
      // Go back to step 1 on error
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setAlertType("info");
    setAlertMsg("New verification code sent!");
    setShowAlert(true);
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
    setShowAlert(false);
    setErrors({});
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
                  <Alert variant={alertType}>
                    {alertMsg}
                  </Alert>
                )}

                {currentStep === 1 ? (
                  // Step 1: Registration Form
                  <Form onSubmit={handleSendOTP} encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="Enter email"
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
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
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                          style={{ border: "none", background: "transparent" }} // removed border
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Confirm password"
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          tabIndex={-1}
                          style={{ border: "none", background: "transparent" }} // removed border
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      </InputGroup>
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="nid_number">
                      <Form.Label><FaCheckCircle className="me-2" />NID Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="nid_number"
                        value={formData.nid_number}
                        onChange={handleChange}
                        isInvalid={!!errors.nid_number}
                        placeholder="Enter NID number"
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">{errors.nid_number}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="image">
                      <Form.Label>
                        <FaImage className="me-2" />
                        NID Photo (JPG, PNG, PDF, max 3MB)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        isInvalid={!!errors.image}
                        ref={fileInputRef}
                        disabled={isLoading}
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
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending Verification Code...
                        </>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </Form>
                ) : (
                  // Step 2: OTP Verification
                  <div>
                    <OTPVerification
                      email={formData.email}
                      purpose="registration"
                      onVerificationSuccess={handleOTPVerification}
                      onResendOTP={handleResendOTP}
                      isLoading={isLoading}
                    />
                    
                    <div className="text-center mt-4">
                      <Button
                        variant="outline-secondary"
                        onClick={goBackToStep1}
                        disabled={isLoading}
                      >
                        <FaArrowLeft className="me-2" />
                        Change Information
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center mt-3">
                  <span>Already registered? </span>
                  <Link to="/daycare/login" className="fw-bold" style={{ color: "#90caf9" }}>
                    Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
    </div>
  );
}

export default DaycareRegister;