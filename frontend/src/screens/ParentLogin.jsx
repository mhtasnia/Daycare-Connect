import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa'; // Add FaGoogle, FaFacebookF
import '../styles/ParentAuth.css';
import ParentNavbar from '../components/ParentNavbar';

function ParentLogin() {
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
        console.log('Login data:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful login
        setAlertType('success');
        setAlertMessage('Login successful! Redirecting to your dashboard...');
        setShowAlert(true);
        
        // Redirect after successful login
        setTimeout(() => {
          // Navigate to parent dashboard
          console.log('Redirecting to parent dashboard...');
        }, 2000);
        
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
    <div className="auth-wrapper">
      <ParentNavbar />
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={7} sm={9}>
            <Card className="auth-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <Link to="/parent" className="back-link">
                    <FaArrowLeft className="me-2" />
                    Back to Parent Portal
                  </Link>
                </div>
                
                <div className="text-center mb-4">
                  <h2 className="auth-title">Welcome Back</h2>
                  <p className="auth-subtitle">Sign in to your parent account</p>
                </div>

                {showAlert && (
                  <Alert variant={alertType} className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className="form-with-extra-margin">
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
                      placeholder="Enter your email"
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
                    <Link to="/parent/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center mb-4">
                    <Button 
                      type="submit" 
                      className="btn-auth-primary" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="auth-link-text">
                      Don't have an account?{' '}
                      <Link to="/parent/register" className="auth-link">
                        Create one here
                      </Link>
                    </p>
                  </div>
                </Form>

                {/* Social Login Options */}
                <div className="social-login-section">
                  <div className="divider">
                    <span>Or continue with</span>
                  </div>
                  
                  <div className="social-buttons">
                    <Button variant="outline-secondary" className="social-btn">
                      <FaGoogle className="me-2" style={{ color: "#DB4437" }} />
                      Google
                    </Button>
                    <Button variant="outline-secondary" className="social-btn">
                      <FaFacebookF className="me-2" style={{ color: "#1877F3" }} />
                      Facebook
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="auth-footer text-center py-3">
        <p className="mb-0 text-muted">
          &copy; {new Date().getFullYear()} Daycare Connect. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default ParentLogin;
