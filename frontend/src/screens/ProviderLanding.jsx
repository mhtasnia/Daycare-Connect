import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSchool, FaUsers, FaChartLine, FaShieldAlt, FaStar, FaHandshake, FaClock, FaCheckCircle } from 'react-icons/fa';
import '../styles/ProviderLanding.css';

function ProviderLanding() {
  return (
    <div className="provider-landing-wrapper">
      {/* Hero Section */}
      <section className="provider-hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-center text-lg-start">
              <div className="provider-hero-content animate__animated animate__fadeInLeft">
                <h1 className="provider-hero-title">
                  Grow Your <span className="text-highlight">Daycare Business</span> with Daycare Connect
                </h1>
                <p className="provider-hero-subtitle">
                  Join Bangladesh's leading daycare platform. Connect with parents, manage bookings, 
                  and grow your business with our comprehensive management tools and verified parent network.
                </p>
                <div className="provider-hero-buttons">
                  <Button as={Link} to="/provider/register" className="btn-provider-primary me-3">
                    <FaSchool className="me-2" />
                    Start Your Journey
                  </Button>
                  <Button as={Link} to="/provider/login" variant="outline-light" className="btn-provider-secondary">
                    Already Registered? Sign In
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="provider-hero-image animate__animated animate__fadeInRight">
                <div className="provider-hero-card">
                  <FaSchool className="provider-hero-icon" />
                  <h3>Professional Platform</h3>
                  <p>Comprehensive tools to manage your daycare business efficiently and professionally</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="provider-benefits-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Choose Daycare Connect for Your Business</h2>
              <p className="section-subtitle">Powerful tools and features designed specifically for daycare providers</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="provider-benefit-card h-100">
                <Card.Body className="text-center">
                  <FaUsers className="benefit-icon mb-3" />
                  <Card.Title>Reach More Parents</Card.Title>
                  <Card.Text>
                    Connect with verified parents actively searching for quality daycare services. 
                    Expand your reach beyond traditional marketing methods.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="provider-benefit-card h-100">
                <Card.Body className="text-center">
                  <FaChartLine className="benefit-icon mb-3" />
                  <Card.Title>Business Growth</Card.Title>
                  <Card.Text>
                    Access analytics, manage bookings, track performance, and grow your business 
                    with data-driven insights and professional tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="provider-benefit-card h-100">
                <Card.Body className="text-center">
                  <FaShieldAlt className="benefit-icon mb-3" />
                  <Card.Title>Trust & Credibility</Card.Title>
                  <Card.Text>
                    Build trust with our verification system, parent reviews, and professional 
                    profile showcase. Establish credibility in the market.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="provider-how-it-works py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">How It Works for Providers</h2>
              <p className="section-subtitle">Simple steps to start growing your daycare business</p>
            </Col>
          </Row>
          <Row>
            <Col md={3} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <h4>Register & Verify</h4>
                <p>Complete your business registration and undergo our verification process for credibility.</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <h4>Setup Profile</h4>
                <p>Create your professional daycare profile with photos, services, and pricing information.</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <h4>Get Approved</h4>
                <p>Our team reviews your application and approves your profile for parent visibility.</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">4</div>
                <h4>Start Serving</h4>
                <p>Begin receiving bookings, managing clients, and growing your daycare business.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="provider-features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Everything you need to manage and grow your daycare business</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <div className="feature-item d-flex align-items-start">
                <FaHandshake className="feature-icon-small me-3 mt-1" />
                <div>
                  <h5>Booking Management</h5>
                  <p>Efficiently manage parent inquiries, bookings, and scheduling through our intuitive dashboard.</p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="feature-item d-flex align-items-start">
                <FaClock className="feature-icon-small me-3 mt-1" />
                <div>
                  <h5>24/7 Support</h5>
                  <p>Get round-the-clock support for technical issues, business guidance, and platform assistance.</p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="feature-item d-flex align-items-start">
                <FaStar className="feature-icon-small me-3 mt-1" />
                <div>
                  <h5>Review System</h5>
                  <p>Build reputation through authentic parent reviews and ratings that boost your credibility.</p>
                </div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="feature-item d-flex align-items-start">
                <FaCheckCircle className="feature-icon-small me-3 mt-1" />
                <div>
                  <h5>Quality Assurance</h5>
                  <p>Maintain high standards with our quality monitoring and continuous improvement programs.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Success Stories Section */}
      <section className="provider-testimonials py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Success Stories</h2>
              <p className="section-subtitle">Hear from daycare providers who've grown with us</p>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="stars mb-3">
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                  </div>
                  <Card.Text>
                    "Joining Daycare Connect transformed our business. We've increased our enrollment by 60% 
                    and now have a waiting list. The platform's professional tools make management so much easier."
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Rashida Begum</strong>
                    <small className="text-muted d-block">Little Angels Daycare, Dhaka</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="stars mb-3">
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                    <FaStar className="text-warning" />
                  </div>
                  <Card.Text>
                    "The verification process gave parents confidence in our services. We've built strong 
                    relationships with families and our reputation has never been better."
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Mohammad Karim</strong>
                    <small className="text-muted d-block">Sunshine Kids Care, Chittagong</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="provider-cta-section py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <div className="cta-content">
                <h2 className="cta-title">Ready to Transform Your Daycare Business?</h2>
                <p className="cta-subtitle">
                  Join hundreds of successful daycare providers who trust Daycare Connect for their business growth
                </p>
                <div className="cta-buttons">
                  <Button as={Link} to="/provider/register" className="btn-provider-primary me-3" size="lg">
                    <FaSchool className="me-2" />
                    Register Your Daycare
                  </Button>
                  <Button as={Link} to="/provider/login" variant="outline-light" size="lg">
                    Sign In
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default ProviderLanding;
