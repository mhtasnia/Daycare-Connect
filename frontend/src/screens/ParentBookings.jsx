import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Mock bookings data
  const mockBookings = [
    {
      id: 1,
      daycare: {
        id: 1,
        name: "Little Stars Daycare",
        address: "House 15, Road 7, Dhanmondi, Dhaka",
        phone: "01712345678",
        image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      child: {
        name: "Aisha Rahman",
        age: 2
      },
      bookingDate: "2024-02-01",
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      type: "full-time",
      status: "confirmed",
      monthlyFee: 8000,
      emergencyContact: "Rashida Begum",
      specialInstructions: "Allergic to peanuts",
      createdAt: "2024-01-20"
    },
    {
      id: 2,
      daycare: {
        id: 2,
        name: "Happy Kids Center",
        address: "Plot 45, Road 11, Gulshan-2, Dhaka",
        phone: "01798765432",
        image: "https://images.pexels.com/photos/8613093/pexels-photo-8613093.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      child: {
        name: "Omar Hassan",
        age: 3
      },
      bookingDate: "2024-01-25",
      startDate: "2024-03-01",
      endDate: "2024-04-01",
      type: "part-time",
      status: "pending",
      monthlyFee: 12000,
      emergencyContact: "Ahmed Hassan",
      specialInstructions: "",
      createdAt: "2024-01-25"
    },
    {
      id: 3,
      daycare: {
        id: 3,
        name: "Sunshine Daycare",
        address: "Sector 7, Road 12, Uttara, Dhaka",
        phone: "01634567890",
        image: "https://images.pexels.com/photos/8613095/pexels-photo-8613095.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      child: {
        name: "Aisha Rahman",
        age: 2
      },
      bookingDate: "2024-01-10",
      startDate: "2024-01-15",
      endDate: "2024-01-30",
      type: "hourly",
      status: "completed",
      monthlyFee: 5000,
      emergencyContact: "Fatima Ahmed",
      specialInstructions: "Needs afternoon nap",
      createdAt: "2024-01-10"
    },
    {
      id: 4,
      daycare: {
        id: 4,
        name: "Rainbow Kids Academy",
        address: "Road 27, Banani, Dhaka",
        phone: "01556789012",
        image: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      child: {
        name: "Omar Hassan",
        age: 3
      },
      bookingDate: "2024-01-05",
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      type: "full-time",
      status: "cancelled",
      monthlyFee: 15000,
      emergencyContact: "Ahmed Hassan",
      specialInstructions: "",
      createdAt: "2024-01-05",
      cancelReason: "Changed plans"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/parent/login");
    } catch (error) {
      console.error("Logout error:", error);
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking status
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, status: "cancelled", cancelReason }
          : b
      ));

      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancelReason("");
      
      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const BookingCard = ({ booking }) => (
    <Card className="booking-card mb-4">
      <Card.Body>
        <Row>
          <Col md={3}>
            <div className="daycare-info">
              <img 
                src={booking.daycare.image} 
                alt={booking.daycare.name}
                className="daycare-thumbnail"
              />
              <div className="daycare-details">
                <h6 className="daycare-name">{booking.daycare.name}</h6>
                <p className="daycare-location">
                  <FaMapMarkerAlt className="me-1" />
                  {booking.daycare.address}
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
                    <strong>Child:</strong> {booking.child.name} ({booking.child.age} years)
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt className="me-1" />
                    <strong>Start:</strong> {new Date(booking.startDate).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <FaDollarSign className="me-1" />
                    <strong>Fee:</strong> ৳{booking.monthlyFee.toLocaleString()}/month
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="info-item">
                    <FaClock className="me-1" />
                    <strong>Type:</strong> {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt className="me-1" />
                    <strong>End:</strong> {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="info-item">
                    <FaPhone className="me-1" />
                    <strong>Contact:</strong> {booking.emergencyContact}
                  </div>
                </Col>
              </Row>

              {booking.specialInstructions && (
                <div className="special-instructions">
                  <strong>Special Instructions:</strong> {booking.specialInstructions}
                </div>
              )}

              {booking.cancelReason && (
                <div className="cancel-reason">
                  <strong>Cancellation Reason:</strong> {booking.cancelReason}
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
                  as={Link}
                  to={`/parent/daycare/${booking.daycare.id}`}
                >
                  <FaEye className="me-1" />
                  View Daycare
                </Button>
                
                {booking.status === "confirmed" && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                  >
                    <FaEdit className="me-1" />
                    Modify
                  </Button>
                )}

                {["pending", "confirmed"].includes(booking.status) && (
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
                  href={`tel:${booking.daycare.phone}`}
                >
                  <FaPhone className="me-1" />
                  Call Daycare
                </Button>

                {booking.status === "completed" && (
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
                  ৳{bookings.reduce((total, booking) => total + booking.monthlyFee, 0).toLocaleString()}
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
                Are you sure you want to cancel your booking at {selectedBooking.daycare.name}?
              </Alert>
              
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
          <Button variant="danger" onClick={confirmCancelBooking}>
            <FaTimes className="me-1" />
            Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ParentBookings;