import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Nav,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaChild,
  FaCalendarAlt,
  FaSearch,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import "../styles/ParentHome.css";

function ParentHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user data - in real app this would come from authentication context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profileComplete: false,
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await axios.post(
          "http://localhost:8000/api/user-auth/parents/logout/",
          { refresh }
        );
      }
      // Remove tokens from storage
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } catch (error) {
      // Optionally handle error (e.g., show a message)
    } finally {
      navigate("/parent/login");
    }
  };

  const quickActions = [
    {
      title: "Complete Profile",
      description: "Add your personal and child information",
      icon: FaUser,
      link: "/parent/profile",
      variant: "primary",
      urgent: !user.profileComplete,
    },
    {
      title: "Search Daycares",
      description: "Find the perfect daycare for your child",
      icon: FaSearch,
      link: "/parent/search",
      variant: "success",
    },
    {
      title: "My Bookings",
      description: "View and manage your daycare bookings",
      icon: FaCalendarAlt,
      link: "/parent/bookings",
      variant: "info",
    },
    {
      title: "Add Child",
      description: "Add another child to your profile",
      icon: FaPlus,
      link: "/parent/add-child",
      variant: "outline-primary",
    },
  ];

  return (
    <div className="parent-home-wrapper">
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
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
                className="ms-2"
              >
                <FaSignOutAlt className="me-1" /> Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome back, {user.name}!</h1>
              <p className="welcome-subtitle">
                Manage your daycare connections and keep track of your child's
                care
              </p>
            </div>
          </Col>
        </Row>

        {/* Profile Completion Alert */}
        {!user.profileComplete && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" className="profile-alert">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Complete Your Profile</strong>
                    <p className="mb-0">
                      Add your personal information and child details to get the
                      most out of Daycare Connect
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to="/parent/profile"
                    variant="warning"
                    className="ms-3"
                  >
                    <FaEdit className="me-1" /> Complete Now
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <h3 className="section-title mb-3">Quick Actions</h3>
          </Col>
        </Row>

        <Row>
          {quickActions.map((action, index) => (
            <Col lg={3} md={6} className="mb-4" key={index}>
              <Card
                className={`quick-action-card h-100 ${
                  action.urgent ? "urgent" : ""
                }`}
              >
                <Card.Body className="text-center">
                  <div className="action-icon mb-3">
                    <action.icon size={32} />
                  </div>
                  <Card.Title className="action-title">
                    {action.title}
                  </Card.Title>
                  <Card.Text className="action-description">
                    {action.description}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={action.link}
                    variant={action.variant}
                    className="action-btn"
                  >
                    Get Started
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Activity */}
        <Row className="mt-5">
          <Col>
            <h3 className="section-title mb-3">Recent Activity</h3>
            <Card className="activity-card">
              <Card.Body>
                <div className="text-center py-4">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h5>No Recent Activity</h5>
                  <p className="text-muted">
                    Complete your profile and start searching for daycares to
                    see your activity here
                  </p>
                  <Button as={Link} to="/parent/profile" variant="primary">
                    Complete Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ParentHome;
