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
  FaImages,
  FaQuoteLeft,
  FaSignInAlt,
  FaUser,
  FaLock,
} from "react-icons/fa";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import "../styles/PublicDaycareView.css";

function PublicDaycareView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [daycare, setDaycare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock daycare data
  const mockDaycare = {
    id: parseInt(id),
    name: "Happy Kids Daycare",
    address: "123 Gulshan Avenue, Dhaka 1212",
    area_display: "Gulshan",
    phone: "01712345678",
    email: "info@happykids.com",
    rating: 4.8,
    review_count: 24,
    services: "Full-time care, Meals, Educational activities, Medical care, Transportation, Art & Crafts",
    description: "Happy Kids Daycare is a premier childcare facility dedicated to providing a safe, nurturing, and stimulating environment for children aged 6 months to 5 years. Our experienced and qualified staff are committed to supporting each child's individual development through play-based learning, creative activities, and structured educational programs.",
    main_image_url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    available_slots: 5,
    isVerified: true,
    capacity: 30,
    established: "2018",
    staff_count: 8,
    age_groups: ["Infants (6-12 months)", "Toddlers (1-2 years)", "Preschoolers (3-5 years)"],
    facilities: ["Indoor playground", "Outdoor garden", "Medical room", "Kitchen", "Nap rooms", "Art studio"],
    operating_hours: "7:00 AM - 6:00 PM",
    reviews: [
      {
        id: 1,
        parent_name: "Sarah Ahmed",
        rating: 5,
        comment: "Excellent care for my daughter. The staff is very professional and caring. Highly recommended!",
        created_at: "2024-01-15",
      },
      {
        id: 2,
        parent_name: "Mohammad Rahman",
        rating: 4,
        comment: "Great facilities and good communication with parents. My son loves going there every day.",
        created_at: "2024-01-10",
      },
      {
        id: 3,
        parent_name: "Fatima Khan",
        rating: 5,
        comment: "Very satisfied with the educational activities and the progress my child has made.",
        created_at: "2024-01-05",
      },
    ],
    availability: [
      { day_of_week: "monday", day_display: "Monday", is_available: true, opening_time: "07:00", closing_time: "18:00", available_slots: 5 },
      { day_of_week: "tuesday", day_display: "Tuesday", is_available: true, opening_time: "07:00", closing_time: "18:00", available_slots: 3 },
      { day_of_week: "wednesday", day_display: "Wednesday", is_available: true, opening_time: "07:00", closing_time: "18:00", available_slots: 7 },
      { day_of_week: "thursday", day_display: "Thursday", is_available: true, opening_time: "07:00", closing_time: "18:00", available_slots: 2 },
      { day_of_week: "friday", day_display: "Friday", is_available: true, opening_time: "07:00", closing_time: "18:00", available_slots: 4 },
      { day_of_week: "saturday", day_display: "Saturday", is_available: true, opening_time: "08:00", closing_time: "16:00", available_slots: 8 },
      { day_of_week: "sunday", day_display: "Sunday", is_available: false, opening_time: null, closing_time: null, available_slots: 0 },
    ],
  };

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
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

  if (isLoading) {
    return (
      <div className="public-daycare-view-wrapper">
        <LandingNavbar />
        <Container className="py-5" style={{ marginTop: "100px" }}>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading daycare profile...</p>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!daycare) {
    return (
      <div className="public-daycare-view-wrapper">
        <LandingNavbar />
        <Container className="py-5" style={{ marginTop: "100px" }}>
          <Alert variant="danger">
            <h4>Daycare Not Found</h4>
            <p>The daycare you're looking for doesn't exist or has been removed.</p>
            <Button as={Link} to="/public/daycares" variant="primary">
              Back to Search
            </Button>
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-daycare-view-wrapper">
      {/* Navigation Header */}
      <LandingNavbar />

      <Container className="py-4" style={{ marginTop: "100px" }}>
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

        {/* Login Alert */}
        <Row className="mb-4">
          <Col>
            <Alert variant="info">
              <FaLock className="me-2" />
              You're viewing as a guest. <Link to="/parent/register" className="fw-bold">Create an account</Link> or <Link to="/parent/login" className="fw-bold">sign in</Link> to book this daycare.
            </Alert>
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
                          {daycare.available_slots} slots available
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="book-now-btn"
                        onClick={() => navigate('/parent/register')}
                      >
                        <FaSignInAlt className="me-2" />
                        Sign Up to Book
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
                    <h6>Basic Information</h6>
                    <div className="info-item">
                      <FaMapMarkerAlt className="me-2" />
                      <strong>Location:</strong> {daycare.area_display}
                    </div>
                    <div className="info-item">
                      <FaUsers className="me-2" />
                      <strong>Capacity:</strong> {daycare.capacity} children
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt className="me-2" />
                      <strong>Established:</strong> {daycare.established}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6>Contact Information</h6>
                    <div className="info-item">
                      <FaPhone className="me-2" />
                      <strong>Phone:</strong> {daycare.phone}
                    </div>
                    <div className="info-item">
                      <FaClock className="me-2" />
                      <strong>Hours:</strong> {daycare.operating_hours}
                    </div>
                    <div className="info-item">
                      <FaChild className="me-2" />
                      <strong>Staff:</strong> {daycare.staff_count} qualified caregivers
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
                  {daycare.services && daycare.services.split(',').map((service, index) => (
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

            {/* Age Groups */}
            <Card className="info-card mb-4">
              <Card.Header>
                <h4>Age Groups We Serve</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {daycare.age_groups.map((group, index) => (
                    <Col md={4} key={index} className="mb-2">
                      <div className="age-group-item">
                        <FaChild className="text-warning me-2" />
                        {group}
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
                          <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
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
                          : "Closed"
                        }
                      </p>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="sidebar-card">
              <Card.Header>
                <h5>Ready to Book?</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">
                  Create your parent account to book slots and manage your child's daycare experience.
                </p>
                <div className="d-grid gap-2">
                  <Button variant="primary" as={Link} to="/parent/register">
                    <FaUser className="me-2" />
                    Create Account
                  </Button>
                  <Button variant="outline-primary" as={Link} to="/parent/login">
                    <FaSignInAlt className="me-2" />
                    Sign In
                  </Button>
                  <Button variant="outline-secondary" href={`tel:${daycare.phone}`}>
                    <FaPhone className="me-2" />
                    Call Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default PublicDaycareView;