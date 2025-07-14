import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bookingAPI } from "../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Image,
  Spinner,
  Alert,
  InputGroup,
  Navbar,
  Nav,
} from "react-bootstrap";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaEye,
  FaCalendarAlt,
  FaFilter,
  FaHome,
  FaUser,
  FaSignInAlt,
  FaCheckCircle,
  FaChild,
  FaClock,
  FaLock,
} from "react-icons/fa";
import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import "../styles/PublicDaycareSearch.css";

function PublicDaycareSearch() {
  const navigate = useNavigate();
  const [daycares, setDaycares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [services, setServices] = useState("");

  const areas = [
    { value: "", label: "All Areas" },
    { value: "gulshan", label: "Gulshan" },
    { value: "banani", label: "Banani" },
    { value: "uttara", label: "Uttara" },
    { value: "mirpur", label: "Mirpur" },
    { value: "wari", label: "Wari" },
    { value: "dhanmondi", label: "Dhanmondi" },
  ];

  // Mock data for public viewing (since we don't have backend yet)
  const mockDaycares = [
    {
      id: 1,
      name: "Happy Kids Daycare",
      address: "123 Gulshan Avenue, Dhaka",
      area_display: "Gulshan",
      phone: "01712345678",
      rating: 4.8,
      review_count: 24,
      services: "Full-time care, Meals, Educational activities, Medical care",
      description: "A loving environment where children learn, play, and grow. We provide comprehensive care with qualified staff and modern facilities.",
      main_image_url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
      available_slots: 5,
      isVerified: true,
    },
    {
      id: 2,
      name: "Little Angels Care Center",
      address: "456 Banani Road, Dhaka",
      area_display: "Banani",
      phone: "01798765432",
      rating: 4.6,
      review_count: 18,
      services: "Part-time care, Preschool, Art & Crafts, Outdoor play",
      description: "Nurturing young minds with creative learning and safe play environments. Our experienced teachers focus on holistic child development.",
      main_image_url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
      available_slots: 3,
      isVerified: true,
    },
    {
      id: 3,
      name: "Sunshine Childcare",
      address: "789 Uttara Sector 7, Dhaka",
      area_display: "Uttara",
      phone: "01634567890",
      rating: 4.9,
      review_count: 31,
      services: "Full-time care, Transportation, Meals, Medical supervision",
      description: "Premium childcare facility with state-of-the-art amenities and highly qualified staff. We ensure your child's safety and development.",
      main_image_url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
      available_slots: 8,
      isVerified: true,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDaycares(mockDaycares);
      setIsLoading(false);
    }, 1000);
  }, []);

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

  const handleViewProfile = (daycareId) => {
    navigate(`/public/daycare/${daycareId}`);
  };

  const filteredDaycares = daycares.filter(daycare => {
    const matchesSearch = !searchTerm || 
      daycare.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      daycare.area_display.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = !selectedArea || daycare.area_display.toLowerCase() === selectedArea;
    const matchesRating = daycare.rating >= minRating;
    const matchesServices = !services || daycare.services.toLowerCase().includes(services.toLowerCase());
    const matchesAvailability = !hasAvailability || daycare.available_slots > 0;

    return matchesSearch && matchesArea && matchesRating && matchesServices && matchesAvailability;
  });

  if (isLoading) {
    return (
      <div className="public-daycare-search-wrapper">
        <LandingNavbar />
        <Container className="py-5" style={{ marginTop: "100px" }}>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Finding the best daycares for you...</p>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="public-daycare-search-wrapper">
      {/* Navigation Header */}
      <LandingNavbar />

      <Container className="py-4" style={{ marginTop: "100px" }}>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="search-header">
              <h1 className="page-title">
                <FaSearch className="me-2" />
                Explore Verified Daycares
              </h1>
              <p className="page-subtitle">
                Discover trusted daycare centers across Bangladesh
              </p>
              <Alert variant="info" className="mt-3">
                <FaLock className="me-2" />
                You're browsing as a guest. <Link to="/parent/register" className="fw-bold">Create an account</Link> or <Link to="/parent/login" className="fw-bold">sign in</Link> to book daycare services.
              </Alert>
            </div>
          </Col>
        </Row>

        {/* Search and Filters */}
        <Row className="mb-4">
          <Col>
            <Card className="search-filters-card">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Search Daycares</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by name or area..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Area</Form.Label>
                      <Form.Select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                      >
                        {areas.map((area) => (
                          <option key={area.value} value={area.value}>
                            {area.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Min Rating</Form.Label>
                      <Form.Select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                      >
                        <option value={0}>Any Rating</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Sort By</Form.Label>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="rating">Highest Rated</option>
                        <option value="name">Name A-Z</option>
                        <option value="newest">Newest First</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-100"
                    >
                      <FaFilter className="me-1" />
                      {showFilters ? "Hide" : "More"} Filters
                    </Button>
                  </Col>
                </Row>

                {showFilters && (
                  <Row className="mt-3 pt-3 border-top">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Services</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g., Full-time care, Meals"
                          value={services}
                          onChange={(e) => setServices(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          label="Has Available Slots"
                          checked={hasAvailability}
                          onChange={(e) => setHasAvailability(e.target.checked)}
                          className="mt-4"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedArea("");
                            setMinRating(0);
                            setServices("");
                            setHasAvailability(false);
                            setSortBy("rating");
                          }}
                          className="mt-4"
                        >
                          Clear All Filters
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Results Summary */}
        <Row className="mb-3">
          <Col>
            <div className="results-summary">
              <h5>
                Found {filteredDaycares.length} verified daycare{filteredDaycares.length !== 1 ? 's' : ''} 
                {selectedArea && ` in ${areas.find(a => a.value === selectedArea)?.label}`}
              </h5>
            </div>
          </Col>
        </Row>

        {/* Daycare Cards */}
        <Row>
          {filteredDaycares.length > 0 ? (
            filteredDaycares.map((daycare) => (
              <Col lg={6} className="mb-4" key={daycare.id}>
                <Card className="daycare-card h-100">
                  <div className="daycare-image-container">
                    <Image
                      src={daycare.main_image_url}
                      alt={daycare.name}
                      className="daycare-image"
                    />
                    <div className="daycare-badges">
                      <Badge bg="success" className="verified-badge">
                        <FaCheckCircle className="me-1" />
                        Verified
                      </Badge>
                      <Badge bg="primary" className="availability-badge">
                        {daycare.available_slots} slots available
                      </Badge>
                    </div>
                  </div>

                  <Card.Body>
                    <div className="daycare-header">
                      <h4 className="daycare-name">{daycare.name}</h4>
                      <div className="daycare-rating">
                        <div className="stars">
                          {renderStars(daycare.rating)}
                        </div>
                        <span className="rating-text">
                          {daycare.rating} ({daycare.review_count} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="daycare-location">
                      <FaMapMarkerAlt className="me-1" />
                      {daycare.area_display} • {daycare.address}
                    </div>

                    <div className="daycare-info">
                      <Row>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaChild className="me-1" />
                            <span>Available: {daycare.available_slots} slots</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaClock className="me-1" />
                            <span>Open Today</span>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="daycare-services">
                      {daycare.services && daycare.services.split(',').slice(0, 3).map((service, index) => (
                        <Badge key={index} bg="light" text="dark" className="service-badge">
                          {service.trim()}
                        </Badge>
                      ))}
                      {daycare.services && daycare.services.split(',').length > 3 && (
                        <Badge bg="light" text="dark" className="service-badge">
                          +{daycare.services.split(',').length - 3} more
                        </Badge>
                      )}
                    </div>

                    <p className="daycare-description">
                      {daycare.description}
                    </p>

                    <div className="daycare-actions">
                      <Button
                        variant="outline-primary"
                        onClick={() => handleViewProfile(daycare.id)}
                        className="me-2"
                      >
                        <FaEye className="me-1" />
                        View Profile
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/parent/register')}
                        className="book-btn"
                      >
                        <FaSignInAlt className="me-1" />
                        Sign Up to Book
                      </Button>
                    </div>

                    <div className="daycare-contact">
                      <FaPhone className="me-1" />
                      <a href={`tel:${daycare.phone}`} className="phone-link">
                        {daycare.phone}
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card className="no-results-card">
                <Card.Body className="text-center py-5">
                  <FaSearch size={48} className="text-muted mb-3" />
                  <h4>No Daycares Found</h4>
                  <p className="text-muted">
                    Try adjusting your search criteria or filters to find more options.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedArea("");
                      setMinRating(0);
                      setServices("");
                      setHasAvailability(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Call to Action */}
        <Row className="mt-5">
          <Col>
            <Card className="cta-card">
              <Card.Body className="text-center py-5">
                <h3 className="mb-3">Ready to Book a Daycare?</h3>
                <p className="text-muted mb-4">
                  Create your parent account to book slots, manage your children's profiles, and communicate directly with daycare providers.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button as={Link} to="/parent/register" variant="primary" size="lg">
                    <FaUser className="me-2" />
                    Create Parent Account
                  </Button>
                  <Button as={Link} to="/parent/login" variant="outline-primary" size="lg">
                    <FaSignInAlt className="me-2" />
                    Sign In
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

export default PublicDaycareSearch;