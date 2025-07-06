import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import "../styles/DaycareProfile.css";

function DaycareProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [daycare, setDaycare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingType, setBookingType] = useState("full-time");

  // Mock data - will be replaced with API call
  const mockDaycare = {
    id: 1,
    name: "Little Stars Daycare",
    area: "Dhanmondi",
    address: "House 15, Road 7, Dhanmondi, Dhaka",
    phone: "01712345678",
    email: "info@littlestars.com",
    rating: 4.8,
    reviewCount: 24,
    isVerified: true,
    services: [
      "Full-time care",
      "Part-time care", 
      "Meals included",
      "Educational activities",
      "Outdoor play",
      "Art & crafts",
      "Music classes",
      "Nap time"
    ],
    ageGroups: ["6 months - 2 years", "2-4 years"],
    capacity: 30,
    currentOccupancy: 22,
    monthlyFee: 8000,
    dailyFee: 300,
    hourlyFee: 50,
    images: [
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8613092/pexels-photo-8613092.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8613093/pexels-photo-8613093.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8613094/pexels-photo-8613094.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Little Stars Daycare provides a nurturing and safe environment for children aged 6 months to 4 years. Our experienced caregivers focus on early childhood development through play-based learning, creative activities, and structured routines. We offer nutritious meals, educational programs, and a loving atmosphere where your child can grow and thrive.",
    operatingHours: "7:00 AM - 6:00 PM",
    operatingDays: "Monday - Friday",
    facilities: [
      "Air-conditioned rooms",
      "Secure playground",
      "CCTV monitoring",
      "Medical first aid",
      "Nutritious meals",
      "Educational toys",
      "Reading corner",
      "Art supplies"
    ],
    staff: [
      {
        name: "Ms. Fatima Rahman",
        role: "Head Teacher",
        experience: "8 years",
        qualification: "B.Ed in Early Childhood"
      },
      {
        name: "Ms. Nasreen Ahmed",
        role: "Assistant Teacher", 
        experience: "5 years",
        qualification: "Diploma in Child Care"
      }
    ],
    reviews: [
      {
        id: 1,
        parentName: "Rashida Begum",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent care for my daughter. The teachers are very loving and professional. Highly recommended!",
        helpful: 12,
        childAge: "2 years"
      },
      {
        id: 2,
        parentName: "Ahmed Hassan",
        rating: 4,
        date: "2024-01-10", 
        comment: "Good daycare with nice facilities. My son enjoys going there every day. The only issue is sometimes they're a bit crowded.",
        helpful: 8,
        childAge: "3 years"
      },
      {
        id: 3,
        parentName: "Salma Khatun",
        rating: 5,
        date: "2024-01-05",
        comment: "Amazing staff and clean environment. They take great care of the children and provide regular updates to parents.",
        helpful: 15,
        childAge: "18 months"
      }
    ],
    policies: {
      dropOffTime: "7:00 AM - 9:00 AM",
      pickUpTime: "4:00 PM - 6:00 PM", 
      sickPolicy: "Children with fever or contagious illness should stay home",
      mealPolicy: "Nutritious breakfast, lunch and snacks provided",
      emergencyContact: "01712345678"
    }
  };

  // Mock children data - would come from parent profile
  const mockChildren = [
    { id: 1, name: "Aisha Rahman", age: 2, gender: "female" },
    { id: 2, name: "Omar Hassan", age: 3, gender: "male" }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDaycare(mockDaycare);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />);
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

  const handleBooking = () => {
    if (!selectedChild || !bookingDate) {
      alert("Please select a child and booking date");
      return;
    }
    
    // Navigate to booking confirmation page
    navigate(`/parent/book/${id}`, {
      state: {
        daycare,
        selectedChild,
        bookingDate,
        bookingType
      }
    });
  };

  if (isLoading) {
    return (
      <div className="daycare-profile-wrapper">
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
      <div className="daycare-profile-wrapper">
        <Container className="py-5">
          <Alert variant="danger">
            <h4>Daycare Not Found</h4>
            <p>The daycare you're looking for doesn't exist or has been removed.</p>
            <Button as={Link} to="/parent/search" variant="primary">
              Back to Search
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="daycare-profile-wrapper">
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
                        <div className="stars">
                          {renderStars(daycare.rating)}
                        </div>
                        <span className="rating-text ms-2">
                          {daycare.rating} ({daycare.reviewCount} reviews)
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
                        <div className="contact-item">
                          <FaEnvelope className="me-2" />
                          <a href={`mailto:${daycare.email}`}>{daycare.email}</a>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} className="text-end">
                    <div className="booking-summary">
                      <div className="availability-info">
                        <h5>Availability</h5>
                        <div className="capacity-bar">
                          <div 
                            className="capacity-fill" 
                            style={{ width: `${(daycare.currentOccupancy / daycare.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <p>{daycare.capacity - daycare.currentOccupancy} of {daycare.capacity} slots available</p>
                      </div>
                      
                      <div className="pricing-info">
                        <h5>Pricing</h5>
                        <div className="price-item">Monthly: ৳{daycare.monthlyFee.toLocaleString()}</div>
                        <div className="price-item">Daily: ৳{daycare.dailyFee}</div>
                        <div className="price-item">Hourly: ৳{daycare.hourlyFee}</div>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="book-now-btn"
                        onClick={() => setShowBookingModal(true)}
                        disabled={daycare.currentOccupancy >= daycare.capacity}
                      >
                        <FaCalendarAlt className="me-2" />
                        {daycare.currentOccupancy >= daycare.capacity ? "Fully Booked" : "Book Now"}
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
                  {daycare.images.map((image, index) => (
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
                    <h6>Operating Hours</h6>
                    <div className="info-item">
                      <FaClock className="me-2" />
                      {daycare.operatingHours}
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt className="me-2" />
                      {daycare.operatingDays}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6>Age Groups</h6>
                    <div className="info-item">
                      <FaChild className="me-2" />
                      {daycare.ageGroups.join(", ")}
                    </div>
                    <div className="info-item">
                      <FaUsers className="me-2" />
                      Capacity: {daycare.capacity} children
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
                  {daycare.services.map((service, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <div className="service-item">
                        <FaCheckCircle className="text-success me-2" />
                        {service}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Facilities Section */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>Facilities</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {daycare.facilities.map((facility, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <div className="facility-item">
                        <FaCheckCircle className="text-primary me-2" />
                        {facility}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Staff Section */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>Our Staff</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {daycare.staff.map((member, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <div className="staff-member">
                        <h6>{member.name}</h6>
                        <p className="role">{member.role}</p>
                        <p className="experience">Experience: {member.experience}</p>
                        <p className="qualification">{member.qualification}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Reviews Section */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>Parent Reviews ({daycare.reviewCount})</h4>
              </Card.Header>
              <Card.Body>
                {daycare.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>{review.parentName}</strong>
                        <span className="child-age">• Child: {review.childAge}</span>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="review-content">
                      <FaQuoteLeft className="quote-icon" />
                      <p>{review.comment}</p>
                    </div>
                    <div className="review-actions">
                      <Button variant="outline-success" size="sm">
                        <FaThumbsUp className="me-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="ms-2">
                        <FaFlag className="me-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Policies Card */}
            <Card className="sidebar-card mb-4">
              <Card.Header>
                <h5>Policies & Guidelines</h5>
              </Card.Header>
              <Card.Body>
                <div className="policy-item">
                  <strong>Drop-off Time:</strong>
                  <p>{daycare.policies.dropOffTime}</p>
                </div>
                <div className="policy-item">
                  <strong>Pick-up Time:</strong>
                  <p>{daycare.policies.pickUpTime}</p>
                </div>
                <div className="policy-item">
                  <strong>Sick Policy:</strong>
                  <p>{daycare.policies.sickPolicy}</p>
                </div>
                <div className="policy-item">
                  <strong>Meal Policy:</strong>
                  <p>{daycare.policies.mealPolicy}</p>
                </div>
                <div className="policy-item">
                  <strong>Emergency Contact:</strong>
                  <p>{daycare.policies.emergencyContact}</p>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="sidebar-card">
              <Card.Header>
                <h5>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={() => setShowBookingModal(true)}>
                    <FaCalendarAlt className="me-2" />
                    Book a Slot
                  </Button>
                  <Button variant="outline-primary" href={`tel:${daycare.phone}`}>
                    <FaPhone className="me-2" />
                    Call Now
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
      </Container>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
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
                    {mockChildren.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name} ({child.age} years old)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Booking Type</Form.Label>
                  <Form.Select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                  >
                    <option value="full-time">Full-time (Monthly)</option>
                    <option value="part-time">Part-time (Daily)</option>
                    <option value="hourly">Hourly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Cost</Form.Label>
                  <div className="cost-display">
                    {bookingType === "full-time" && `৳${daycare.monthlyFee.toLocaleString()}/month`}
                    {bookingType === "part-time" && `৳${daycare.dailyFee}/day`}
                    {bookingType === "hourly" && `৳${daycare.hourlyFee}/hour`}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Special Requirements (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any special requirements or notes for your child..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBooking}>
            Continue to Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DaycareProfile;