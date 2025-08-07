import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import parse from 'html-react-parser';
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
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaCheckCircle,
  FaChild,
  FaUsers,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import "../styles/ParentSearch.css";

function ParentSearch() {
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

  useEffect(() => {
    fetchDaycares();
  }, []);

  useEffect(() => {
    fetchDaycares();
  }, [searchTerm, selectedArea, minRating, sortBy, hasAvailability, services]);

  const fetchDaycares = async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedArea) params.area = selectedArea;
      if (minRating > 0) params.min_rating = minRating;
      if (hasAvailability) params.has_availability = 'true';
      if (services) params.services = services;
      if (sortBy) params.ordering = sortBy === 'rating' ? '-rating' : sortBy;

      const response = await bookingAPI.searchDaycares(params);
      setDaycares(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching daycares:", error);
      setError("Failed to load daycares. Please try again.");
      setDaycares([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");

      if (refresh && access) {
        // API call would go here
        console.log("Logout API call");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      navigate("/parent/login");
    }
  };

  const handleViewProfile = (daycareId) => {
    navigate(`/parent/daycare/${daycareId}`);
  };

  if (isLoading) {
    return (
      <div className="parent-search-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Finding the best daycares for you...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="parent-search-wrapper">
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
              <Nav.Link as={Link} to="/parent/search" className="nav-item active">
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
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="search-header">
              <h1 className="page-title">
                <FaSearch className="me-2" />
                Find Perfect Daycare
              </h1>
              <p className="page-subtitle">
                Discover verified daycare centers in your area and book with confidence
              </p>
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
                        <option value="-rating">Highest Rated</option>
                        <option value="name">Name A-Z</option>
                        <option value="-created_at">Newest First</option>
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
                            setSortBy("-rating");
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
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <div className="results-summary">
              <h5>
                Found {daycares.length} daycare{daycares.length !== 1 ? 's' : ''} 
                {selectedArea && ` in ${areas.find(a => a.value === selectedArea)?.label}`}
              </h5>
            </div>
          </Col>
        </Row>

        {/* Daycare Cards */}
        <Row>
          {daycares.length > 0 ? (
            daycares.map((daycare) => (
              <Col lg={6} className="mb-4" key={daycare.id}>
                <Card className="daycare-card h-100">
                  <div className="daycare-image-container">
                    <Image
                      src={daycare.main_image_url || "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400"}
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
                      {parse(daycare.description)}
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
                        onClick={() => handleViewProfile(daycare.id)}
                        disabled={daycare.available_slots <= 0}
                      >
                        <FaCalendarAlt className="me-1" />
                        {daycare.available_slots <= 0 ? "Fully Booked" : "View & Book"}
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
      </Container>
    </div>
  );
}

export default ParentSearch;