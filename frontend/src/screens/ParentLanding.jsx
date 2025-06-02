import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChild, FaSearch, FaCalendarAlt, FaShieldAlt, FaStar, FaComments } from 'react-icons/fa';
import '../styles/ParentLanding.css';

function ParentLanding() {
  return (
    <div className="parent-landing-wrapper">
      {/* Hero Section */}
      <section className="parent-hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-center text-lg-start">
              <div className="parent-hero-content animate__animated animate__fadeInLeft">
                <h1 className="parent-hero-title">
                  Find the Perfect <span className="text-highlight">Daycare</span> for Your Child
                </h1>
                <p className="parent-hero-subtitle">
                  Connect with verified daycare centers in Bangladesh. Search, compare, and book with confidence. 
                  Your child's safety and happiness is our priority.
                </p>
                <div className="parent-hero-buttons">
                  <Button as={Link} to="/parent/register" className="btn-parent-primary me-3">
                    <FaChild className="me-2" />
                    Get Started
                  </Button>
                  <Button as={Link} to="/parent/login" variant="outline-light" className="btn-parent-secondary">
                    Already a Member? Sign In
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="parent-hero-image animate__animated animate__fadeInRight">
                <div className="parent-hero-card">
                  <FaChild className="parent-hero-icon" />
                  <h3>Safe & Trusted</h3>
                  <p>All daycare centers are verified and reviewed by parents like you</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="parent-features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Parents Choose Daycare Connect</h2>
              <p className="section-subtitle">Everything you need to find the perfect daycare for your child</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body className="text-center">
                  <FaSearch className="feature-icon mb-3" />
                  <Card.Title>Easy Search</Card.Title>
                  <Card.Text>
                    Find daycare centers near you with our advanced search filters. 
                    Filter by location, age groups, facilities, and more.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body className="text-center">
                  <FaShieldAlt className="feature-icon mb-3" />
                  <Card.Title>Verified Centers</Card.Title>
                  <Card.Text>
                    All daycare centers are thoroughly verified and licensed. 
                    We ensure safety standards and quality care for your peace of mind.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body className="text-center">
                  <FaCalendarAlt className="feature-icon mb-3" />
                  <Card.Title>Easy Booking</Card.Title>
                  <Card.Text>
                    Book visits and reserve spots with just a few clicks. 
                    Manage your bookings and communicate directly with daycare providers.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="parent-how-it-works py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Get started in just 3 simple steps</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <h4>Create Account</h4>
                <p>Sign up for free and tell us about your child's needs and preferences.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <h4>Search & Compare</h4>
                <p>Browse verified daycare centers, read reviews, and compare facilities.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <h4>Book & Connect</h4>
                <p>Schedule visits, book spots, and stay connected with your chosen daycare.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="parent-testimonials py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">What Parents Say</h2>
              <p className="section-subtitle">Real experiences from real parents</p>
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
                    "Daycare Connect made finding the perfect daycare so easy! The verification process 
                    gave me confidence, and the reviews from other parents were incredibly helpful."
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Fatima Rahman</strong>
                    <small className="text-muted d-block">Mother of 2, Dhaka</small>
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
                    "The booking system is fantastic! I could schedule visits and communicate with 
                    daycare providers directly. My daughter loves her new daycare!"
                  </Card.Text>
                  <div className="testimonial-author">
                    <strong>Nasir Ahmed</strong>
                    <small className="text-muted d-block">Father of 1, Chittagong</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="parent-cta-section py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <div className="cta-content">
                <h2 className="cta-title">Ready to Find Your Perfect Daycare?</h2>
                <p className="cta-subtitle">
                  Join thousands of parents who trust Daycare Connect for their child's care
                </p>
                <div className="cta-buttons">
                  <Button as={Link} to="/parent/register" className="btn-parent-primary me-3" size="lg">
                    <FaChild className="me-2" />
                    Start Your Search
                  </Button>
                  <Button as={Link} to="/parent/login" variant="outline-light" size="lg">
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

export default ParentLanding;
