import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [filteredDaycares, setFilteredDaycares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  // Mock data - will be replaced with API calls
  const mockDaycares = [
    {
      id: 1,
      name: "Little Stars Daycare",
      area: "Dhanmondi",
      address: "House 15, Road 7, Dhanmondi, Dhaka",
      phone: "01712345678",
      rating: 4.8,
      reviewCount: 24,
      isVerified: true,
      services: ["Full-time care", "Meals included", "Educational activities"],
      ageGroups: ["6 months - 2 years", "2-4 years"],
      capacity: 30,
      currentOccupancy: 22,
      monthlyFee: 8000,
      image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
      images: [
        "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/8613092/pexels-photo-8613092.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "A loving environment for your little ones with experienced caregivers.",
      operatingHours: "7:00 AM - 6:00 PM",
    },
    {
      id: 2,
      name: "Happy Kids Center",
      area: "Gulshan",
      address: "Plot 45, Road 11, Gulshan-2, Dhaka",
      phone: "01798765432",
      rating: 4.6,
      reviewCount: 18,
      isVerified: true,
      services: ["Part-time care", "Educational programs", "Outdoor activities"],
      ageGroups: ["1-3 years", "3-5 years"],
      capacity: 25,
      currentOccupancy: 20,
      monthlyFee: 12000,
      image: "https://images.pexels.com/photos/8613093/pexels-photo-8613093.jpeg?auto=compress&cs=tinysrgb&w=400",
      images: [
        "https://images.pexels.com/photos/8613093/pexels-photo-8613093.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/8613094/pexels-photo-8613094.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Modern facilities with qualified teachers and nutritious meals.",
      operatingHours: "8:00 AM - 5:00 PM",
    },
    {
      id: 3,
      name: "Sunshine Daycare",
      area: "Uttara",
      address: "Sector 7, Road 12, Uttara, Dhaka",
      phone: "01634567890",
      rating: 4.4,
      reviewCount: 31,
      isVerified: true,
      services: ["Full-time care", "Transportation", "Medical care"],
      ageGroups: ["6 months - 5 years"],
      capacity: 40,
      currentOccupancy: 35,
      monthlyFee: 10000,
      image: "https://images.pexels.com/photos/8613095/pexels-photo-8613095.jpeg?auto=compress&cs=tinysrgb&w=400",
      images: [
        "https://images.pexels.com/photos/8613095/pexels-photo-8613095.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/8613096/pexels-photo-8613096.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Comprehensive childcare with transportation and medical support.",
      operatingHours: "7:30 AM - 6:30 PM",
    },
    {
      id: 4,
      name: "Rainbow Kids Academy",
      area: "Banani",
      address: "Road 27, Banani, Dhaka",
      phone: "01556789012",
      rating: 4.9,
      reviewCount: 42,
      isVerified: true,
      services: ["Educational programs", "Art & crafts", "Music classes"],
      ageGroups: ["2-5 years"],
      capacity: 20,
      currentOccupancy: 18,
      monthlyFee: 15000,
      image: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=400",
      images: [
        "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/8613098/pexels-photo-8613098.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Premium early childhood education with creative learning programs.",
      operatingHours: "8:00 AM - 4:00 PM",
    },
  ];

  const areas = ["All Areas", "Dhanmondi", "Gulshan", "Uttara", "Banani", "Mirpur", "Wari"];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDaycares(mockDaycares);
      setFilteredDaycares(mockDaycares);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterDaycares();
  }, [searchTerm, selectedArea, minRating, sortBy, daycares]);

  const filterDaycares = () => {
    let filtered = daycares.filter((daycare) => {
      const matchesSearch = daycare.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           daycare.area.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = selectedArea === "" || selectedArea === "All Areas" || daycare.area === selectedArea;
      const matchesRating = daycare.rating >= minRating;
      
      return matchesSearch && matchesArea && matchesRating;
    });

    // Sort daycares
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.monthlyFee - b.monthlyFee;
        case "price-high":
          return b.monthlyFee - a.monthlyFee;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredDaycares(filtered);
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

  const handleBookNow = (daycareId) => {
    navigate(`/parent/book/${daycareId}`);
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
                          <option key={area} value={area}>
                            {area}
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
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
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
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Age Group</Form.Label>
                        <Form.Select>
                          <option>All Age Groups</option>
                          <option>6 months - 2 years</option>
                          <option>2-4 years</option>
                          <option>3-5 years</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Services</Form.Label>
                        <Form.Select>
                          <option>All Services</option>
                          <option>Full-time care</option>
                          <option>Part-time care</option>
                          <option>Meals included</option>
                          <option>Transportation</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Price Range</Form.Label>
                        <Form.Select>
                          <option>Any Price</option>
                          <option>Under ৳8,000</option>
                          <option>৳8,000 - ৳12,000</option>
                          <option>৳12,000 - ৳15,000</option>
                          <option>Above ৳15,000</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Availability</Form.Label>
                        <Form.Select>
                          <option>Any Availability</option>
                          <option>Has Available Slots</option>
                          <option>Nearly Full</option>
                        </Form.Select>
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
                Found {filteredDaycares.length} daycare{filteredDaycares.length !== 1 ? 's' : ''} 
                {selectedArea && selectedArea !== "All Areas" && ` in ${selectedArea}`}
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
                      src={daycare.image}
                      alt={daycare.name}
                      className="daycare-image"
                    />
                    <div className="daycare-badges">
                      {daycare.isVerified && (
                        <Badge bg="success" className="verified-badge">
                          <FaCheckCircle className="me-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge bg="primary" className="availability-badge">
                        {daycare.capacity - daycare.currentOccupancy} slots available
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
                          {daycare.rating} ({daycare.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="daycare-location">
                      <FaMapMarkerAlt className="me-1" />
                      {daycare.area} • {daycare.address}
                    </div>

                    <div className="daycare-info">
                      <Row>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaUsers className="me-1" />
                            <span>Capacity: {daycare.currentOccupancy}/{daycare.capacity}</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaClock className="me-1" />
                            <span>{daycare.operatingHours}</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaChild className="me-1" />
                            <span>{daycare.ageGroups.join(", ")}</span>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="info-item">
                            <FaDollarSign className="me-1" />
                            <span>৳{daycare.monthlyFee.toLocaleString()}/month</span>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="daycare-services">
                      {daycare.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} bg="light" text="dark" className="service-badge">
                          {service}
                        </Badge>
                      ))}
                      {daycare.services.length > 3 && (
                        <Badge bg="light" text="dark" className="service-badge">
                          +{daycare.services.length - 3} more
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
                        onClick={() => handleBookNow(daycare.id)}
                        disabled={daycare.currentOccupancy >= daycare.capacity}
                      >
                        <FaCalendarAlt className="me-1" />
                        {daycare.currentOccupancy >= daycare.capacity ? "Fully Booked" : "Book Now"}
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