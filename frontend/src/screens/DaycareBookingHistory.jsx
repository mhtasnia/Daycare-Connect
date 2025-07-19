import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Navbar,
  Nav,
  Badge,
  Modal,
  Button,
  Form
} from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaHome,
  FaUser,
  FaSearch,
  FaBell,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import '../styles/DaycareBookingHistory.css';

const StarSelector = ({ rating, setRating, disabled }) => (
  <div className="star-selector">
    {[1,2,3,4,5].map(i => (
      <span
        key={i}
        className={`star-select ${i <= rating ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setRating(i)}
        onMouseOver={e => !disabled && setRating(i)}
        onMouseLeave={e => {}}
        style={{cursor: disabled ? 'not-allowed' : 'pointer'}}
      >
        <FaStar />
      </span>
    ))}
  </div>
);

const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[1,2,3,4,5].map(i => (
      i <= rating ?
        <FaStar key={i} className="star-filled" /> :
        <FaRegStar key={i} className="star-empty" />
    ))}
  </div>
);

const DaycareBookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalBooking, setModalBooking] = useState(null);
  const [modalRating, setModalRating] = useState(0);
  const [modalReview, setModalReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await bookingAPI.getDaycareBookingHistory();
      setHistory(response.data.booking_history || []);
    } catch (err) {
      setError('Failed to fetch booking history.');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick stats
  const totalBookings = history.length;
  const avgRating = history.length ? (
    history.reduce((sum, b) => sum + (b.rating || 0), 0) / history.length
  ).toFixed(1) : 0;
  const totalReviews = history.filter(b => b.review).length;

  const openReviewModal = (booking) => {
    setModalBooking(booking);
    setModalRating(booking.rating || 0);
    setModalReview(booking.review || "");
    setShowModal(true);
    setSubmitError("");
  };

  const closeReviewModal = () => {
    setShowModal(false);
    setModalBooking(null);
    setModalRating(0);
    setModalReview("");
    setSubmitError("");
  };

  const handleSubmitReview = async () => {
    if (!modalRating) {
      setSubmitError("Please select a rating.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await bookingAPI.submitDaycareBookingReview(modalBooking.id, {
        rating: modalRating,
        review: modalReview
      });
      // Update local state for immediate feedback
      setHistory(prev => prev.map(b => b.id === modalBooking.id ? {
        ...b,
        rating: modalRating,
        review: modalReview
      } : b));
      closeReviewModal();
    } catch (err) {
      setSubmitError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="daycare-booking-history-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading booking history...</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
  if (error) return (
    <div className="daycare-booking-history-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );

  return (
    <div className="daycare-booking-history-wrapper">
      {/* Navigation Header */}
      <Navbar bg="white" expand="lg" className="parent-navbar shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/daycare/dashboard" className="fw-bold">
            Daycare <span className="brand-highlight">Connect</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="daycare-navbar" />
          <Navbar.Collapse id="daycare-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/daycare/dashboard" className="nav-item">
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/profile" className="nav-item">
                <FaUser className="me-1" /> Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/bookings" className="nav-item">
                <FaCalendarAlt className="me-1" /> Bookings
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/search" className="nav-item">
                <FaSearch className="me-1" /> Search
              </Nav.Link>
              <Nav.Link className="nav-item">
                <FaBell className="me-1" /> Notifications
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="page-title">
                <FaCalendarAlt className="me-2" />
                Booking History
              </h1>
              <p className="page-subtitle">
                View your daycare's past bookings, ratings, and reviews
              </p>
            </div>
          </Col>
        </Row>
        {/* Quick Stats */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{totalBookings}</h3>
                <p className="stats-label">Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{avgRating} <FaStar className="text-warning ms-1" /></h3>
                <p className="stats-label">Average Rating</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{totalReviews}</h3>
                <p className="stats-label">Total Reviews</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Booking History List */}
        <Row>
          <Col>
            {history.length > 0 ? (
              history.map(booking => (
                <Card key={booking.id} className="history-card mb-4">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <div className="history-details">
                          <div className="d-flex align-items-center mb-2">
                            <span className="history-id me-3">Booking #{booking.id}</span>
                            {booking.rating && (
                              <Badge bg="success" className="me-2">Rated</Badge>
                            )}
                          </div>
                          <div className="info-item">
                            <strong>Parent:</strong> {booking.parent_name}
                          </div>
                          <div className="info-item">
                            <strong>Child:</strong> {booking.child_name}
                          </div>
                          <div className="info-item">
                            <strong>Date:</strong> {booking.date}
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-md-end text-start">
                        <div className="rating-section mb-2">
                          <span className="me-2"><strong>Rating:</strong></span>
                          <StarRating rating={booking.rating} />
                        </div>
                        {booking.review && (
                          <div className="review-section">
                            <span className="me-2"><strong>Review:</strong></span>
                            <span className="review-text">{booking.review}</span>
                          </div>
                        )}
                        {!booking.rating && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="mt-2 review-btn"
                            onClick={() => openReviewModal(booking)}
                          >
                            Rate & Review
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Card className="no-bookings-card">
                <Card.Body className="text-center py-5">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h4>No booking history found</h4>
                  <p className="text-muted">
                    You haven't completed any bookings yet.
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
      {/* Review/Rating Modal */}
      <Modal show={showModal} onHide={closeReviewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate & Review Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalBooking && (
            <>
              <div className="mb-3">
                <div className="mb-2"><strong>Parent:</strong> {modalBooking.parent_name}</div>
                <div className="mb-2"><strong>Child:</strong> {modalBooking.child_name}</div>
                <div className="mb-2"><strong>Date:</strong> {modalBooking.date}</div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Rating <span className="text-danger">*</span></Form.Label>
                <StarSelector rating={modalRating} setRating={setModalRating} disabled={isSubmitting} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={modalReview}
                  onChange={e => setModalReview(e.target.value)}
                  placeholder="Write your review (optional)"
                  disabled={isSubmitting}
                />
              </Form.Group>
              {submitError && <Alert variant="danger">{submitError}</Alert>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReviewModal} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitReview} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DaycareBookingHistory;
