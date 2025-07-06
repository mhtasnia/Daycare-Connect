import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Spinner,
  Nav,
  Navbar,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChild,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaUser,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import "../styles/BookingConfirmation.css";

function BookingConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock children and emergency contacts data
  const mockChildren = [
    { id: 1, name: "Aisha Rahman", age: 2, gender: "female" },
    { id: 2, name: "Omar Hassan", age: 3, gender: "male" }
  ];

  const mockEmergencyContacts = [
    { id: 1, name: "Rashida Begum", relationship: "Mother", phone: "01712345678" },
    { id: 2, name: "Ahmed Hassan", relationship: "Father", phone: "01798765432" },
    { id: 3, name: "Fatima Ahmed", relationship: "Grandmother", phone: "01634567890" }
  ];

  useEffect(() => {
    // Get booking data from navigation state
    if (location.state) {
      setBookingData(location.state);
    } else {
      // If no state, redirect back to search
      navigate("/parent/search");
    }
  }, [location.state, navigate]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/parent/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!emergencyContact) {
      alert("Please select an emergency contact");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setShowSuccess(true);
      
      // Redirect to bookings page after 3 seconds
      setTimeout(() => {
        navigate("/parent/bookings");
      }, 3000);

    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading booking details...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const { daycare, selectedChild, bookingDate, bookingType } = bookingData;
  const selectedChildData = mockChildren.find(child => child.id == selectedChild);

  const calculateCost = () => {
    switch (bookingType) {
      case "full-time":
        return daycare.monthlyFee;
      case "part-time":
        return daycare.dailyFee * 30; // Assuming 30 days
      case "hourly":
        return daycare.hourlyFee * 8 * 30; // 8 hours per day, 30 days
      default:
        return daycare.monthlyFee;
    }
  };

  if (showSuccess) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="success-card text-center">
                <Card.Body className="py-5">
                  <FaCheckCircle size={80} className="text-success mb-4" />
                  <h2 className="text-success mb-3">Booking Confirmed!</h2>
                  <p className="lead mb-4">
                    Your booking request has been submitted successfully. 
                    The daycare will contact you within 24 hours to confirm the details.
                  </p>
                  <div className="booking-summary">
                    <h5>Booking Summary</h5>
                    <p><strong>Daycare:</strong> {daycare.name}</p>
                    <p><strong>Child:</strong> {selectedChildData?.name}</p>
                    <p><strong>Start Date:</strong> {new Date(bookingDate).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</p>
                  </div>
                  <p className="text-muted">Redirecting to your bookings...</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-wrapper">
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
              <Nav.Link as={Link} to="/parent/bookings" className="nav-item">
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
        {/* Back Button */}
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              <FaArrowLeft className="me-2" />
              Back to Daycare Profile
            </Button>
          </Col>
        </Row>

        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="page-title">
                <FaCalendarAlt className="me-2" />
                Confirm Your Booking
              </h1>
              <p className="page-subtitle">
                Review your booking details and confirm your reservation
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Booking Summary */}
            <Card className="booking-summary-card mb-4">
              <Card.Header>
                <h4>Booking Summary</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="summary-section">
                      <h6>Daycare Information</h6>
                      <div className="info-item">
                        <strong>{daycare.name}</strong>
                        <Badge bg="success" className="ms-2">Verified</Badge>
                      </div>
                      <div className="info-item">
                        <FaMapMarkerAlt className="me-2" />
                        {daycare.address}
                      </div>
                      <div className="info-item">
                        <FaPhone className="me-2" />
                        {daycare.phone}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="summary-section">
                      <h6>Booking Details</h6>
                      <div className="info-item">
                        <FaChild className="me-2" />
                        <strong>Child:</strong> {selectedChildData?.name} ({selectedChildData?.age} years)
                      </div>
                      <div className="info-item">
                        <FaCalendarAlt className="me-2" />
                        <strong>Start Date:</strong> {new Date(bookingDate).toLocaleDateString()}
                      </div>
                      <div className="info-item">
                        <FaClock className="me-2" />
                        <strong>Type:</strong> {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}
                      </div>
                      <div className="info-item">
                        <FaDollarSign className="me-2" />
                        <strong>Estimated Cost:</strong> ৳{calculateCost().toLocaleString()}
                        {bookingType === "full-time" && "/month"}
                        {bookingType === "part-time" && "/month"}
                        {bookingType === "hourly" && "/month"}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Emergency Contact */}
            <Card className="form-card mb-4">
              <Card.Header>
                <h4>Emergency Contact</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Select Emergency Contact *</Form.Label>
                  <Form.Select
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    required
                  >
                    <option value="">Choose an emergency contact...</option>
                    {mockEmergencyContacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} ({contact.relationship}) - {contact.phone}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    This person will be contacted in case of emergencies and can pick up your child if needed.
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Special Instructions */}
            <Card className="form-card mb-4">
              <Card.Header>
                <h4>Special Instructions</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requirements, allergies, medical conditions, or other important information about your child..."
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Terms and Conditions */}
            <Card className="form-card mb-4">
              <Card.Header>
                <h4>Terms and Conditions</h4>
              </Card.Header>
              <Card.Body>
                <div className="terms-content">
                  <h6>Booking Terms:</h6>
                  <ul>
                    <li>Booking confirmation is subject to availability and daycare approval</li>
                    <li>Payment terms will be discussed directly with the daycare</li>
                    <li>Cancellation policy applies as per daycare guidelines</li>
                    <li>All children must have up-to-date vaccination records</li>
                    <li>Parents must provide emergency contact information</li>
                  </ul>
                  
                  <h6>Health and Safety:</h6>
                  <ul>
                    <li>Children with fever or contagious illness should not attend</li>
                    <li>All incidents will be reported to parents immediately</li>
                    <li>Daycare follows strict safety and hygiene protocols</li>
                  </ul>
                </div>

                <Form.Check
                  type="checkbox"
                  id="terms-checkbox"
                  label="I agree to the terms and conditions and daycare policies"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-3"
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Cost Breakdown */}
            <Card className="sidebar-card mb-4">
              <Card.Header>
                <h5>Cost Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div className="cost-item">
                  <span>Base Fee ({bookingType}):</span>
                  <span>৳{calculateCost().toLocaleString()}</span>
                </div>
                <div className="cost-item">
                  <span>Registration Fee:</span>
                  <span>৳500</span>
                </div>
                <hr />
                <div className="cost-total">
                  <strong>
                    <span>Total:</span>
                    <span>৳{(calculateCost() + 500).toLocaleString()}</span>
                  </strong>
                </div>
                <small className="text-muted">
                  * Final pricing will be confirmed by the daycare
                </small>
              </Card.Body>
            </Card>

            {/* Important Information */}
            <Card className="sidebar-card mb-4">
              <Card.Header>
                <h5>
                  <FaInfoCircle className="me-2" />
                  Important Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Alert variant="info" className="mb-3">
                  <FaExclamationTriangle className="me-2" />
                  This is a booking request. The daycare will contact you within 24 hours to confirm availability and discuss payment terms.
                </Alert>
                
                <div className="info-section">
                  <h6>Next Steps:</h6>
                  <ol>
                    <li>Submit your booking request</li>
                    <li>Wait for daycare confirmation</li>
                    <li>Complete registration process</li>
                    <li>Begin daycare services</li>
                  </ol>
                </div>

                <div className="info-section">
                  <h6>Required Documents:</h6>
                  <ul>
                    <li>Child's birth certificate</li>
                    <li>Vaccination records</li>
                    <li>Medical history</li>
                    <li>Parent ID copies</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>

            {/* Contact Daycare */}
            <Card className="sidebar-card">
              <Card.Header>
                <h5>Contact Daycare</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" href={`tel:${daycare.phone}`}>
                    <FaPhone className="me-2" />
                    Call {daycare.name}
                  </Button>
                  <Button variant="outline-secondary" href={`mailto:${daycare.email}`}>
                    <FaEnvelope className="me-2" />
                    Send Email
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Confirm Button */}
        <Row className="mt-4">
          <Col>
            <div className="text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmBooking}
                disabled={isLoading || !emergencyContact || !agreedToTerms}
                className="confirm-booking-btn"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Submitting Booking...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Confirm Booking Request
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingConfirmation;