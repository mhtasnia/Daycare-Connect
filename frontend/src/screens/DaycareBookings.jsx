import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
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
  Modal
} from 'react-bootstrap';
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
  FaClipboardList,
  FaClock,
  FaHistory,  
  FaCog,
  FaExclamationTriangle,
  FaChild,
  FaPhone,
  FaDollarSign
} from 'react-icons/fa';
import '../styles/DaycareBookings.css';
import ChildProfileModal from '../components/ChildProfileModal';

const DaycareBookings = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await bookingAPI.getDaycareBookings();
      setBookings(response.data.results || response.data);
    } catch (error) {
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "warning", text: "Pending Approval" },
      confirmed: { bg: "success", text: "Confirmed" },
      active: { bg: "primary", text: "Active" },
      completed: { bg: "secondary", text: "Completed" },
      cancelled: { bg: "danger", text: "Cancelled" },
      accepted: { bg: "info", text: "Accepted" }
    };
    const config = statusConfig[status?.toLowerCase()] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "active":
      case "accepted":
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
        return bookings.filter(b => ["confirmed", "active", "accepted"].includes(b.status?.toLowerCase()));
      case "pending":
        return bookings.filter(b => b.status?.toLowerCase() === "pending");
      case "completed":
        return bookings.filter(b => b.status?.toLowerCase() === "completed");
      case "cancelled":
        return bookings.filter(b => b.status?.toLowerCase() === "cancelled");
      default:
        return bookings;
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingAPI.updateDaycareBookingStatus(id, status);
      fetchBookings();
    } catch {
      setError('Failed to update booking status.');
    }
  };
 
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");
      console.log("Tokens:", { refresh, access }); // Add this line

      if (refresh && access) {
        const res = await axios.post(
          "http://localhost:8000/api/user-auth/daycares/logout/",
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        console.log("Logout response:", res.data);
      } else {
        console.warn("Tokens missing");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      // Always clear storage and navigate
      localStorage.clear();
      navigate("/daycare/login");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingAPI.cancelBooking(bookingId, "Cancelled by daycare");
      fetchBookings();
    } catch (error) {
      setError("Failed to cancel booking.");
    }
  };

  const handleMarkAsCompleted = (booking) => {
    setBookingToComplete(booking);
    setShowCompleteModal(true);
  };

  const confirmCompleteBooking = async () => {
    if (!bookingToComplete) return;
    try {
      await bookingAPI.updateDaycareBookingStatus(bookingToComplete.id, "completed");
      fetchBookings();
      setShowCompleteModal(false);
      setBookingToComplete(null);
    } catch (error) {
      setError("Failed to mark booking as completed.");
    }
  };

  const BookingCard = ({ booking }) => {
    const isCompletable = new Date(booking.end_date) < new Date();

    return (
      <Card className="booking-card mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="daycare-info">
                <img
                  src={booking.child_profile_image || "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400"}
                  alt={booking.child_name}
                  className="daycare-thumbnail"
                />
                <div className="daycare-details">
                  <h6 className="daycare-name">{booking.child_name}</h6>
                  <p className="daycare-location">
                    <FaUser className="me-1" />
                    Parent: {booking.parent_profile?.full_name || "N/A"}
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
                      <strong>Fee:</strong> ৳{booking.total_amount?.toLocaleString()}
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
                      <FaPhone className="me-1" />
                      <strong>Contact:</strong> {booking.parent_profile?.phone || "N/A"}
                    </div>
                  </Col>
                </Row>
                {booking.special_instructions && (
                  <div className="special-instructions">
                    <strong>Special Instructions:</strong> {booking.special_instructions}
                  </div>
                )}
                {booking.cancellation_reason && (
                  <div className="cancel-reason">
                    <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                  </div>
                )}
              </div>
            </Col>
            <Col md={3}>
              <div className="booking-actions d-grid gap-2">
                {booking.status?.toLowerCase() === "pending" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(booking.id, "Accepted")}
                  >
                    <FaCheckCircle className="me-1" /> Accept
                  </Button>
                )}
                {booking.status?.toLowerCase() === "pending" && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCancel(booking.id)}
                  >
                    <FaTimes className="me-1" /> Cancel
                  </Button>
                )}
                {["confirmed", "active", "accepted"].includes(booking.status?.toLowerCase()) && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMarkAsCompleted(booking)}
                    disabled={!isCompletable}
                  >
                    <FaCheckCircle className="me-1" /> Mark as Completed
                  </Button>
                )}
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => { setSelectedBooking(booking); setShowChildModal(true); }}
                >
                  <FaEye className="me-1" /> View Child Profile
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="daycare-bookings-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading bookings...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="daycare-bookings-wrapper">
      {/* Navigation Header */}
      <Navbar
            expand="lg"
            className="parent-navbar shadow-sm"
            style={{
              background: "linear-gradient(45deg, #99f2c8, #90caf9)",
              borderBottom: "2px solid #90caf9",
            }}
          >
            <Container>
              <Navbar.Brand as={Link} to="/daycare/dashboard" className="fw-bold" style={{ color: "#23395d" }}>
                Daycare <span className="brand-highlight" style={{ color: "#90caf9" }}>Connect</span>
                <span className="small daycare-highlight" style={{ fontSize: '0.85rem', color: "#004a99" }}> | Daycare</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="daycare-navbar" />
              <Navbar.Collapse id="daycare-navbar">
                <Nav className="ms-auto align-items-center">
                  <Nav.Link as={Link} to="/daycare/dashboard" className="nav-item" style={{ color: "#23395d" }}>
                    <FaHome className="me-1" /> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/daycare/profile" className="nav-item" style={{ color: "#23395d" }}>
                    <FaUser className="me-1" /> Profile
                  </Nav.Link>
                  <Nav.Link as={Link} to="/daycare/bookings" className="nav-item" style={{ color: "#23395d" }}>
                    <FaClipboardList className="me-1" /> Bookings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/daycare/history" className="nav-item" style={{ color: "#23395d" }}>
                    <FaHistory className="me-1" /> History
                  </Nav.Link>
                  <Nav.Link as={Link} to="/daycare/settings" className="nav-item" style={{ color: "#23395d" }}>
                    <FaCog className="me-1" /> Settings
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
                Daycare Bookings
              </h1>
              <p className="page-subtitle">
                Manage all bookings and track their status
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
                          {activeTab === "active" && "No active bookings at the moment."}
                          {activeTab === "pending" && "No bookings are waiting for approval."}
                          {activeTab === "completed" && "No completed bookings yet."}
                          {activeTab === "cancelled" && "No cancelled bookings found."}
                        </p>
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
                <p className="stats-label">Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Child Profile Modal */}
      <ChildProfileModal
        show={showChildModal}
        onHide={() => setShowChildModal(false)}
        booking={selectedBooking}
      />
      {/* Completion Confirmation Modal */}
      <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Completion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this booking as completed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmCompleteBooking}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DaycareBookings;
