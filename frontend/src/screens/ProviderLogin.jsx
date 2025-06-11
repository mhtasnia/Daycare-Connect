import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaSchool } from 'react-icons/fa';
import '../styles/ProviderAuth.css';

function ProviderLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
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
        console.log('Provider login data:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate different login scenarios
        const loginScenarios = [
          { status: 'approved', message: 'Login successful! Welcome to your dashboard.' },
          { status: 'pending', message: 'Your account is still under review. Please wait for approval.' },
          { status: 'rejected', message: 'Your application was not approved. Please contact support.' }
        ];
        
        // For demo, randomly select a scenario (in real app, this comes from backend)
        const scenario = loginScenarios[0]; // Always show approved for demo
        
        if (scenario.status === 'approved') {
          setAlertType('success');
          setAlertMessage(scenario.message);
          setShowAlert(true);
          
          // Redirect to provider home/dashboard
          setTimeout(() => {
            navigate('/provider/home');
          }, 2000);
        } else if (scenario.status === 'pending') {
          setAlertType('warning');
          setAlertMessage(scenario.message);
          setShowAlert(true);
        } else {
          setAlertType('danger');
          setAlertMessage(scenario.message);
          setShowAlert(true);
        }
        
      } catch (error) {
        setAlertType('danger');
        setAlertMessage('Login failed. Please check your credentials and try again.');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="provider-auth-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={7} sm={9}>
            <Card className="provider-auth-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Link to="/provider" className="back-link">
                    <FaArrowLeft className="me-2" />
                    Back to Provider Portal
                  </Link>
                </div>
                
                <div className="text-center mb-4">
                  <h2 className="auth-title">Provider Sign In</h2>
                  <p className="auth-subtitle">Access your daycare management dashboard</p>
                </div>

                {showAlert && (
                  <Alert variant={alertType} className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="Enter your registered email"
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Enter your password"
                        size="lg"
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        type="button"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      label="Remember me"
                      className="remember-me-check"
                    />
                    <Link to="/provider/forgot-password" className="auth-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center mb-4">
                    <Button 
                      type="submit" 
                      className="btn-provider-primary" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FaSchool className="me-2" />
                          Sign In to Dashboard
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="auth-link-text">
                      Don't have an account?{' '}
                      <Link to="/provider/register" className="auth-link">
                        Register your daycare
                      </Link>
                    </p>
                  </div>
                </Form>

                {/* Account Status Information */}
                <div className="account-status-info mt-4">
                  <div className="text-center">
                    <small className="text-muted">
                      <strong>Account Status Information:</strong>
                    </small>
                    <div className="status-info mt-2">
                      <small className="d-block text-muted mb-1">
                        ✅ <strong>Approved:</strong> Full access to dashboard and bookings
                      </small>
                      <small className="d-block text-muted mb-1">
                        ⏳ <strong>Under Review:</strong> Application being processed (2-3 business days)
                      </small>
                      <small className="d-block text-muted">
                        ❌ <strong>Action Required:</strong> Please contact support for assistance
                      </small>
                    </div>
                  </div>
                </div>

                {/* Support Contact */}
                <div className="support-section mt-4">
                  <div className="text-center">
                    <small className="text-muted">
                      Need help? Contact our support team at{' '}
                      <Link to="mailto:support@daycareconnect.com" className="auth-link">
                        support@daycareconnect.com
                      </Link>
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProviderLogin;
