import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bookingAPI } from "../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Nav,
  Navbar,
  Tab,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaHome,
  FaUser,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChild,
  FaMapMarkerAlt,
  FaPhone,
  FaDollarSign,
  FaComments,
} from "react-icons/fa";
import "../styles/ParentBookings.css";

function ParentBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await bookingAPI.getBookings();
      setBookings(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");

      if (refresh && access) {
        await bookingAPI.logout(refresh);
      }
      localStorage.clear();
      navigate("/parent/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/parent/login");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "warning", text: "Pending Approval" },
      confirmed: { bg: "success", text: "Confirmed" },
      active: { bg: "primary", text: "Active" },
      completed: { bg: "secondary", text: "Completed" },
      cancelled: { bg: "danger", text: "Cancelled" }
    };

    const config = statusConfig[status] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "active":
        return <FaCheckCircle className="text-success" />;
      case "pending":
        return <FaClock className="text-warning" />;
      case "cancelled":
        return <FaTimes className="text-danger" />;
      default:
        return <FaExclamationTriangle className="text-muted" />;
    }
  };

  const filterBookings = (status) => {
    switch (status) {
      case "active":
        return bookings.filter(b => ["confirmed", "active"].includes(b.status));
      case "pending":
        return bookings.filter(b => b.status === "pending");
      case "completed":
        return bookings.filter(b => b.status === "completed");
      case "cancelled":
        return bookings.filter(b => b.status === "cancelled");
      default:
        return bookings;
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);

    try {
      await bookingAPI.cancelBooking(selectedBooking.id, cancelReason);
      
      // Refresh bookings list
      await fetchBookings();

      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason("");
      
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel booking error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          "Failed to cancel booking. Please try again.";
      alert(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const BookingCard = ({ booking }) => (
    <Card className="booking-card mb-4">
      <Card.Body>
        <Row>
          <Col md={3}>
            <div className="daycare-info">
              <img 
                src={booking.daycare_image || "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                alt={booking.daycare_name}
                className="daycare-thumbnail"
              />
              <div className="daycare-details">
                <h6 className="daycare-name">{booking.daycare_name}</h6>
                <p className="daycare-location">
                  <FaMapMarkerAlt className="me-1" />
                  {booking.daycare_address}
                </p>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="booking-details">
              <div className="booking-header">
                <div className="d-flex align-items-center mb-2">
                  {getStatusIcon(booking.status)}
                  <span className="booking-id ms-2">Booking #{booking.id}</span>
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <Row className="booking-info">
                <Col sm={6}>
                  <div className="info-item">
                    <FaChild className="me-1" />
                    <strong>Child:</strong> {booking.child_name} ({booking.child_age} years)
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt className="me-1" />
                    <strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <FaDollarSign className="me-1" />
                    <strong>Fee:</strong> ৳{booking.total_amount ? booking.total_amount.toLocaleString() : 'N/A'}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-item">
                    <FaClock className="me-1" />
                    <strong>Type:</strong> {booking.booking_type_display}
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt className="me-1" />
                    <strong>End:</strong> {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : "Ongoing"}
                  </div>
                  <div className="info-item">
                    <FaDollarSign className="me-1" />
                    <strong>Payment:</strong> {booking.payment_method_display}
                  </div>
                </Col>
              </Row>

              {booking.special_instructions && (
                <div className="special-instructions">
                  <strong>Special Instructions:</strong> {booking.special_instructions}
                </div>
              )}

              <div className="emergency-contact-info">
                <strong>Emergency Contact:</strong> {booking.emergency_contact_name} ({booking.emergency_contact_phone})
              </div>
              {booking.cancellation_reason && (
                <div className="cancel-reason">
                  <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                </div>
              )}
            </div>
          </Col>

          <Col md={3}>
            <div className="booking-actions">
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/parent/daycare/${booking.daycare}`)}
                >
                  <FaEye className="me-1" />
                  View Daycare
                </Button>
                
                {booking.can_cancel && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancelBooking(booking)}
                  >
                    <FaTimes className="me-1" />
                    Cancel
                  </Button>
                )}

                <Button
                  variant="outline-info"
                  size="sm"
                  href={`tel:${booking.daycare_phone}`}
                >
                  <FaPhone className="me-1" />
                  Call Daycare
                </Button>

                {booking.can_review && (
                  <Button
                    variant="outline-warning"
                    size="sm"
                  >
                    <FaComments className="me-1" />
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="parent-bookings-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your bookings...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="parent-bookings-wrapper">
      {/* Navigation Header */}
      <Navbar bg="white" expand="lg" className="parent-navbar shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/parent/home" className="fw-bold">
            Daycare <span className="brand-highlight">Connect</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="parent-navbar" />
          <Navbar.Collapse id="parent-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/parent/home" className="nav-item">
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/parent/profile" className="nav-item">
                <FaUser className="me-1" /> Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/parent/search" className="nav-item">
                <FaSearch className="me-1" /> Search
              </Nav.Link>
              <Nav.Link as={Link} to="/parent/bookings" className="nav-item active">
                <FaCalendarAlt className="me-1" /> Bookings
              </Nav.Link>
              <Nav.Link className="nav-item">
                <FaBell className="me-1" /> Notifications
              </Nav.Link>
            </Nav>
            
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="ms-2"
            >
              <FaSignOutAlt className="me-1" /> Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <div className="page-header">
              <h1 className="page-title">
                <FaCalendarAlt className="me-2" />
                My Bookings
              </h1>
              <p className="page-subtitle">
                Manage your daycare bookings and track their status
              </p>
            </div>
          </Col>
        </Row>

        {/* Booking Tabs */}
        <Row className="mb-4">
          <Col>
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="booking-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="active">
                    <FaCheckCircle className="me-2" />
                    Active ({filterBookings("active").length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pending">
                    <FaClock className="me-2" />
                    Pending ({filterBookings("pending").length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="completed">
                    <FaCheckCircle className="me-2" />
                    Completed ({filterBookings("completed").length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="cancelled">
                    <FaTimes className="me-2" />
                    Cancelled ({filterBookings("cancelled").length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="mt-4">
                <Tab.Pane eventKey={activeTab}>
                  {filterBookings(activeTab).length > 0 ? (
                    filterBookings(activeTab).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <Card className="no-bookings-card">
                      <Card.Body className="text-center py-5">
                        <FaCalendarAlt size={48} className="text-muted mb-3" />
                        <h4>No {activeTab} bookings</h4>
                        <p className="text-muted">
                          {activeTab === "active" && "You don't have any active bookings at the moment."}
                          {activeTab === "pending" && "No bookings are waiting for approval."}
                          {activeTab === "completed" && "You haven't completed any bookings yet."}
                          {activeTab === "cancelled" && "No cancelled bookings found."}
                        </p>
                        {activeTab === "active" && (
                          <Button as={Link} to="/parent/search" variant="primary">
                            <FaSearch className="me-2" />
                            Find Daycares
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{bookings.length}</h3>
                <p className="stats-label">Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{filterBookings("active").length}</h3>
                <p className="stats-label">Active Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">{filterBookings("completed").length}</h3>
                <p className="stats-label">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="stats-number">
                  ৳{bookings.reduce((total, booking) => total + parseFloat(booking.total_amount || 0), 0).toLocaleString()}
                </h3>
                <p className="stats-label">Total Spent</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Cancel Booking Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Alert variant="warning">
                <FaExclamationTriangle className="me-2" />
                Are you sure you want to cancel your booking at {selectedBooking.daycare_name}?
              </Alert>

              <div className="mb-3">
                <strong>Booking Cost:</strong> ৳{selectedBooking.total_amount.toLocaleString()}
              </div>
              
              <Form.Group className="mb-3">
                <Form.Label>Reason for Cancellation *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this booking..."
                  required
                />
              </Form.Group>

              <Alert variant="info">
                <small>
                  Cancellation policies may apply. Please contact the daycare directly 
                  to discuss any refund or penalty terms.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Booking
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmCancelBooking}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              <>
                <FaTimes className="me-1" />
                Cancel Booking
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ParentBookings;