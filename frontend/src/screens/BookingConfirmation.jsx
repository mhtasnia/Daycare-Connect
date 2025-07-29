import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
import { bookingAPI, childrenAPI, emergencyContactAPI } from "../services/api";
import "../styles/BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data from ParentDaycareView modal
  const {
    daycare,
    selectedChildId,
    bookingDate,
    bookingType,
    paymentMethod,
    cost,
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChildData, setSelectedChildData] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/parent/login");
  };

  useEffect(() => {
    console.log("BookingConfirmation - location.state:", location.state);
    const { daycare } = location.state || {};
    console.log("BookingConfirmation - daycare from state:", daycare);
    if (!location.state || !daycare) {
      navigate("/parent/search");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const childrenRes = await childrenAPI.getChildren();
        const fetchedChildren = childrenRes.data || [];
        setChildren(fetchedChildren);
        const child = fetchedChildren.find((c) => c.id === selectedChildId);
        setSelectedChildData(child);

        const contactsRes = await emergencyContactAPI.getEmergencyContact();
        const contacts = Array.isArray(contactsRes.data)
          ? contactsRes.data
          : [contactsRes.data];
        setEmergencyContacts(contacts.filter((c) => c && c.id));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data. Please go back and try again.");
      } finally {
        setIsLoading(false);
        console.log("isLoading set to false after fetchData");
      }
    };

    fetchData();
  }, [location.state, daycare, selectedChildId, navigate]);

  useEffect(() => {
    if (showSuccess) {
      alert("Booking request sent successfully!");
      navigate("/parent/bookings");
    }
  }, [showSuccess, navigate]);

  const handleConfirmBooking = async () => {
    console.log("handleConfirmBooking called");
    console.log("selectedEmergencyContact:", selectedEmergencyContact);
    console.log("agreedToTerms:", agreedToTerms);

    if (!selectedEmergencyContact) {
      alert("Please select an emergency contact.");
      return;
    }
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    setIsBooking(true); // Use a separate state for booking process
    try {
      const bookingPayload = {
        daycare: daycare.id,
        child: selectedChildId,
        booking_type: bookingType,
        start_date: bookingDate,
        start_time: "09:00:00", // Default start time
        end_time: "17:00:00",   // Default end time
        payment_method: paymentMethod,
        emergency_contact: parseInt(selectedEmergencyContact),
        special_instructions: specialInstructions,
      };

      console.log("Sending booking payload:", bookingPayload);
      const response = await bookingAPI.createBooking(bookingPayload);
      console.log("Booking API response:", response);

      if (response.data && response.data.message) {
        alert("Booking request submitted successfully! The daycare will contact you soon.");
        navigate("/parent/bookings");
      } else {
        setError("Received an unexpected response from the server.");
      }
    } catch (err) {
      console.error("Booking creation error:", err);
      console.error("Full error response:", err.response);
      const errorMessage =
        err.response?.data?.detail ||
        (err.response?.data && JSON.stringify(err.response.data)) ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      alert(`Booking Error: ${errorMessage}`); // Provide immediate feedback
    } finally {
      setIsBooking(false);
    }
  };

  if (!daycare) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5 text-center">
          <Alert variant="danger">
            Invalid booking data. Please start the booking process again.
          </Alert>
          <Button as={Link} to="/parent/search" variant="primary">
            Find a Daycare
          </Button>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading confirmation details...</p>
        </Container>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5 text-center">
          <Alert variant="danger">{error}</Alert>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Container>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="booking-confirmation-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="success-card text-center">
                <Card.Body className="py-5">
                  <FaCheckCircle size={80} className="text-success mb-4" />
                  <h2 className="text-success mb-3">Booking Request Sent!</h2>
                  <p className="lead mb-4">
                    Your booking request has been submitted successfully. The
                    daycare will contact you within 24 hours to confirm the
                    details.
                  </p>
                  <div className="booking-summary">
                    <h5>Booking Summary</h5>
                    <p><strong>Daycare:</strong> {daycare.name}</p>
                    <p><strong>Child:</strong> {selectedChildData?.full_name}</p>
                    <p><strong>Start Date:</strong> {new Date(bookingDate).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> {bookingType === 'monthly' ? 'Monthly Care' : 'Daily Care'}</p>
                  </div>
                  <p className="text-muted mt-4">Redirecting to your bookings page...</p>
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
              <Nav.Link as={Link} to="/parent/home" className="nav-item"><FaHome className="me-1" /> Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/parent/profile" className="nav-item"><FaUser className="me-1" /> Profile</Nav.Link>
              <Nav.Link as={Link} to="/parent/search" className="nav-item"><FaSearch className="me-1" /> Search</Nav.Link>
              <Nav.Link as={Link} to="/parent/bookings" className="nav-item"><FaCalendarAlt className="me-1" /> Bookings</Nav.Link>
              <Nav.Link className="nav-item"><FaBell className="me-1" /> Notifications</Nav.Link>
            </Nav>
            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="ms-2">
              <FaSignOutAlt className="me-1" /> Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row className="mb-3">
          <Col>
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="back-btn">
              <FaArrowLeft className="me-2" /> Back to Daycare Profile
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="page-title"><FaCalendarAlt className="me-2" /> Confirm Your Booking</h1>
              <p className="page-subtitle">Review your booking details and confirm your reservation for {daycare.name}</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="booking-summary-card mb-4">
              <Card.Header><h4>Booking Summary</h4></Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="summary-section">
                      <h6>Daycare Information</h6>
                      <div className="info-item"><strong>{daycare.name}</strong><Badge bg="success" className="ms-2">Verified</Badge></div>
                      <div className="info-item"><FaMapMarkerAlt className="me-2" />{daycare.address}</div>
                      <div className="info-item"><FaPhone className="me-2" />{daycare.phone}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="summary-section">
                      <h6>Booking Details</h6>
                      <div className="info-item"><FaChild className="me-2" /><strong>Child:</strong> {selectedChildData?.full_name} ({selectedChildData?.age} years)</div>
                      <div className="info-item"><FaCalendarAlt className="me-2" /><strong>Start Date:</strong> {new Date(bookingDate).toLocaleDateString()}</div>
                      <div className="info-item"><FaClock className="me-2" /><strong>Type:</strong> {bookingType === 'monthly' ? 'Monthly Care' : 'Daily Care'}</div>
                      <div className="info-item"><FaDollarSign className="me-2" /><strong>Estimated Cost:</strong> ৳{cost?.toLocaleString()}{bookingType === 'monthly' ? '/month' : '/day'}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="form-card mb-4">
              <Card.Header><h4>Emergency Contact</h4></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Select Emergency Contact *</Form.Label>
                  <Form.Select value={selectedEmergencyContact} onChange={(e) => {
                    setSelectedEmergencyContact(e.target.value);
                    console.log("Selected Emergency Contact:", e.target.value);
                  }} required>
                    <option value="">Choose an emergency contact...</option>
                    {emergencyContacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.full_name} ({contact.relationship}) - {contact.phone_primary}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">This person will be contacted in case of emergencies.</Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="form-card mb-4">
              <Card.Header><h4>Special Instructions</h4></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control as="textarea" rows={4} value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="Any special requirements, allergies, medical conditions, or other important information..." />
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="form-card mb-4">
              <Card.Header><h4>Terms and Conditions</h4></Card.Header>
              <Card.Body>
                <div className="terms-content">
                  <ul>
                    <li>Booking confirmation is subject to availability and daycare approval.</li>
                    <li>Payment terms will be discussed directly with the daycare upon confirmation.</li>
                    <li>Cancellation policy applies as per daycare guidelines.</li>
                    <li>All children must have up-to-date vaccination records.</li>
                  </ul>
                </div>
                <Form.Check type="checkbox" id="terms-checkbox" label="I agree to the terms and conditions and daycare policies" checked={agreedToTerms} onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  console.log("Agreed to Terms:", e.target.checked);
                }} className="mt-3" />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="sidebar-card mb-4">
              <Card.Header><h5>Cost Breakdown</h5></Card.Header>
              <Card.Body>
                <div className="cost-item">
                  <span>Base Fee ({bookingType === 'monthly' ? 'Monthly' : 'Daily'}):</span>
                  <span>৳{cost?.toLocaleString()}</span>
                </div>
                <hr />
                <div className="cost-total">
                  <strong>
                    <span>Total Estimated Cost:</span>
                    <span>৳{cost?.toLocaleString()}</span>
                  </strong>
                </div>
                <small className="text-muted">* Final pricing and payment will be confirmed by the daycare.</small>
              </Card.Body>
            </Card>

            <Card className="sidebar-card mb-4">
              <Card.Header><h5><FaInfoCircle className="me-2" />Important Information</h5></Card.Header>
              <Card.Body>
                <Alert variant="info" className="mb-3">
                  <FaExclamationTriangle className="me-2" />
                  This is a booking request. The daycare will contact you to confirm.
                </Alert>
                <h6>Next Steps:</h6>
                <ol>
                  <li>Submit your booking request.</li>
                  <li>Wait for daycare confirmation.</li>
                  <li>Complete payment and registration.</li>
                </ol>
              </Card.Body>
            </Card>

            <div className="text-center">
              {console.log(`Button disabled state: isLoading=${isLoading}, selectedEmergencyContact=${selectedEmergencyContact}, agreedToTerms=${agreedToTerms}`)}
              <Button variant="primary" size="lg" onClick={handleConfirmBooking} disabled={isLoading || !selectedEmergencyContact || !agreedToTerms} className="confirm-booking-btn">
                {isLoading ? (
                  <><Spinner animation="border" size="sm" className="me-2" />Submitting...</>
                ) : (
                  <><FaCheckCircle className="me-2" />Confirm Booking Request</>
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
