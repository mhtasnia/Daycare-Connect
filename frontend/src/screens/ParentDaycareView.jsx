import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookingAPI, childrenAPI, emergencyContactAPI } from "../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Image,
  Spinner,
  Alert,
  Carousel,
  Nav,
  Navbar,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUsers,
  FaChild,
  FaDollarSign,
  FaCheckCircle,
  FaCalendarAlt,
  FaHome,
  FaUser,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaImages,
  FaQuoteLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
} from "react-icons/fa";
import "../styles/ParentDaycareView.css";

function ParentDaycareView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [daycare, setDaycare] = useState(null);
  const [children, setChildren] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingType, setBookingType] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState("");

  useEffect(() => {
    fetchDaycareDetails();
    fetchChildren();
    fetchEmergencyContacts();
  }, [id]);

  const fetchDaycareDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await bookingAPI.getDaycareDetail(id);
      setDaycare(response.data);
    } catch (error) {
      console.error("Error fetching daycare details:", error);
      setError("Failed to load daycare details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await childrenAPI.getChildren();
      setChildren(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const response = await emergencyContactAPI.getEmergencyContact();
      const contacts = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setEmergencyContacts(contacts.filter((contact) => contact && contact.id));
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      setEmergencyContacts([]);
    }
  };

  const calculatePrice = () => {
    if (!daycare || !daycare.pricing_tiers) return 0;
    const frequencyToFind =
      bookingType === "monthly"
        ? "Monthly"
        : bookingType === "daily"
        ? "Daily"
        : "";
    const pricing = daycare.pricing_tiers.find(
      (p) => p.frequency === frequencyToFind
    );
    return pricing ? pricing.price : 0;
  };

  const getEndDate = () => {
    if (!bookingDate) return "";
    const startDate = new Date(bookingDate);
    const endDate = new Date(startDate);
    if (bookingType === "monthly") {
      endDate.setDate(startDate.getDate() + 30);
    } else if (bookingType === "daily") {
      endDate.setDate(startDate.getDate() + 1);
    }
    return endDate.toISOString().split("T")[0];
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/parent/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProceedToConfirmation = () => {
    if (!selectedChild || !bookingDate) {
      alert("Please select a child and a start date to proceed.");
      return;
    }

    const bookingDetails = {
      daycare: daycare,
      selectedChildId: parseInt(selectedChild),
      bookingDate: bookingDate,
      bookingType: bookingType,
      paymentMethod: paymentMethod,
      cost: calculatePrice(),
    };

    navigate("/parent/bookings", { state: bookingDetails });
  };

  if (isLoading) {
    return (
      <div className="parent-daycare-view-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading daycare profile...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!daycare) {
    return (
      <div className="parent-daycare-view-wrapper">
        <Container className="py-5">
          <Alert variant="danger">
            <h4>
              {error ? "Error Loading Daycare" : "Daycare Not Found"}
            </h4>
            <p>
              {error ||
                "The daycare you're looking for doesn't exist or has been removed."}
            </p>
            <Button as={Link} to="/parent/search" variant="primary">
              Back to Search
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="parent-daycare-view-wrapper">
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
              Back to Search
            </Button>
          </Col>
        </Row>

        {/* Daycare Header */}
        <Row className="mb-4">
          <Col>
            <Card className="daycare-header-card">
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <div className="daycare-title-section">
                      <div className="d-flex align-items-center mb-2">
                        <h1 className="daycare-title">{daycare.name}</h1>
                        {daycare.isVerified && (
                          <Badge bg="success" className="verified-badge ms-3">
                            <FaCheckCircle className="me-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="daycare-rating mb-3">
                        <div className="stars">{renderStars(daycare.rating)}</div>
                        <span className="rating-text ms-2">
                          {daycare.rating} ({daycare.review_count} reviews)
                        </span>
                      </div>

                      <div className="daycare-location mb-3">
                        <FaMapMarkerAlt className="me-2" />
                        <span>{daycare.address}</span>
                      </div>

                      <div className="daycare-contact">
                        <div className="contact-item">
                          <FaPhone className="me-2" />
                          <a href={`tel:${daycare.phone}`}>{daycare.phone}</a>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} className="text-end">
                    <div className="booking-summary">
                      <div className="availability-info">
                        <h5>Availability</h5>
                        <p className="text-success">
                          <FaCheckCircle className="me-1" />
                          Available for booking
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="book-now-btn"
                        onClick={() => setShowBookingModal(true)}
                      >
                        <FaCalendarAlt className="me-2" />
                        Book Now
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Image Gallery */}
        <Row className="mb-4">
          <Col>
            <Card className="gallery-card">
              <Card.Header>
                <h4>
                  <FaImages className="me-2" />
                  Photo Gallery
                </h4>
              </Card.Header>
              <Card.Body>
                <Carousel>
                  {(daycare.images && daycare.images.length > 0
                    ? daycare.images
                    : [daycare.main_image_url]
                  ).map((image, index) => (
                    <Carousel.Item key={index}>
                      <Image
                        src={image}
                        alt={`${daycare.name} - Image ${index + 1}`}
                        className="gallery-image"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* About Section */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>About {daycare.name}</h4>
              </Card.Header>
              <Card.Body>
                <p className="description">{daycare.description}</p>

                <Row className="mt-4">
                  <Col md={6}>
                    <h6>Location</h6>
                    <div className="info-item">
                      <FaMapMarkerAlt className="me-2" />
                      {daycare.area_display}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6>Contact</h6>
                    <div className="info-item">
                      <FaPhone className="me-2" />
                      {daycare.phone}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Services Section */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>Services Offered</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {daycare.services &&
                    daycare.services.split(",").map((service, index) => (
                      <Col md={6} key={index} className="mb-2">
                        <div className="service-item">
                          <FaCheckCircle className="text-success me-2" />
                          {service.trim()}
                        </div>
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Reviews Section */}
            {daycare.reviews && daycare.reviews.length > 0 && (
              <Card className="info-card mb-4">
                <Card.Header>
                  <h4>Parent Reviews ({daycare.review_count})</h4>
                </Card.Header>
                <Card.Body>
                  {daycare.reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <strong>{review.parent_name}</strong>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="review-content">
                        <FaQuoteLeft className="quote-icon" />
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Availability Card */}
            {daycare.availability && daycare.availability.length > 0 && (
              <Card className="sidebar-card mb-4">
                <Card.Header>
                  <h5>Weekly Schedule</h5>
                </Card.Header>
                <Card.Body>
                  {daycare.availability.map((schedule) => (
                    <div key={schedule.day_of_week} className="policy-item">
                      <strong>{schedule.day_display}:</strong>
                      <p>
                        {schedule.is_available
                          ? `${schedule.opening_time} - ${schedule.closing_time} (${schedule.available_slots} slots)`
                          : "Closed"}
                      </p>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Pricing Card */}
            {daycare.pricing_tiers && daycare.pricing_tiers.length > 0 && (
              <Card className="sidebar-card mb-4">
                <Card.Header>
                  <h5>Pricing</h5>
                </Card.Header>
                <Card.Body>
                  {daycare.pricing_tiers.map((pricing) => (
                    <div key={pricing.frequency} className="policy-item">
                      <strong>{pricing.frequency}:</strong>
                      <p>৳{pricing.price}</p>
                      {pricing.description && (
                        <small className="text-muted">
                          {pricing.description}
                        </small>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="sidebar-card">
              <Card.Header>
                <h5>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() => setShowBookingModal(true)}
                  >
                    <FaCalendarAlt className="me-2" />
                    Book a Slot
                  </Button>
                  <Button
                    variant="outline-primary"
                    href={`tel:${daycare.phone}`}
                  >
                    <FaPhone className="me-2" />
                    Call Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Book a Slot at {daycare.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Child</Form.Label>
                  <Form.Select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    required
                  >
                    <option value="">Choose a child...</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.full_name} ({child.age} years old)
                      </option>
                    ))}
                  </Form.Select>
                  {children.length === 0 && (
                    <Form.Text className="text-muted">
                      No children found. Please add a child to your profile
                      first.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Care Type *</Form.Label>
                  <Form.Select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                  >
                    <option value="monthly">Monthly Care</option>
                    <option value="daily">Daily Care</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={getEndDate()}
                    disabled
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Automatically calculated based on care type.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Emergency Contact *</Form.Label>
                  <Form.Select
                    value={selectedEmergencyContact}
                    onChange={(e) =>
                      setSelectedEmergencyContact(e.target.value)
                    }
                    required
                  >
                    <option value="">Choose emergency contact...</option>
                    {emergencyContacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.full_name} ({contact.relationship}) -{" "}
                        {contact.phone_primary}
                      </option>
                    ))}
                  </Form.Select>
                  {emergencyContacts.length === 0 && (
                    <Form.Text className="text-muted">
                      No emergency contacts found. Please add one to your
                      profile first.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method *</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="upay">Upay</option>
                    <option value="sure_cash">SureCash</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Pricing Display */}
            {bookingDate && (
              <Row className="mb-3">
                <Col md={12}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6 className="mb-2">Booking Summary</h6>
                      <div className="d-flex justify-content-between">
                        <span>Care Type:</span>
                        <strong>
                          {bookingType === "monthly"
                            ? "Monthly Care"
                            : "Daily Care"}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Duration:</span>
                        <strong>
                          {bookingType === "monthly" ? "30 days" : "1 day"}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Start Date:</span>
                        <strong>
                          {new Date(bookingDate).toLocaleDateString()}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>End Date:</span>
                        <strong>
                          {getEndDate()
                            ? new Date(getEndDate()).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span>
                          <strong>Total Amount:</strong>
                        </span>
                        <strong className="text-primary">
                          ৳{calculatePrice().toLocaleString()}
                        </strong>
                      </div>
                      <small className="text-muted">
                        Payment will be discussed with the daycare after booking
                        confirmation.
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Special Requirements (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requirements or notes for your child..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBookingModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProceedToConfirmation}
            disabled={!selectedChild || !bookingDate || !selectedEmergencyContact}
          >
            Proceed to Confirmation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ParentDaycareView;
