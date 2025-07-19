/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Nav,
  Navbar,
  Spinner,
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
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import "../styles/ParentHome.css";

function ParentHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    profileComplete: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/parent/login", { replace: true });
      return;
    }
    
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await axios.get(
        "http://localhost:8000/api/user-auth/parents/profile/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const profileData = response.data;
      setUser({
        name: profileData.full_name || "Parent",
        email: profileData.email,
        profileComplete: !!(
          profileData.full_name &&
          profileData.phone &&
          profileData.address
        ),
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        localStorage.clear();
        navigate("/parent/login", { replace: true });
      } else {
        setError("Failed to load profile information");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");

      if (refresh && access) {
        const response = await axios.post(
          "http://localhost:8000/api/user-auth/parents/logout/",
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        console.log("Logout response:", response.data);
      } else {
        console.warn("Tokens missing");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      // Always clear storage and navigate
      localStorage.clear();
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

  if (isLoading) {
    return (
      <div className="parent-home-wrapper">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your dashboard...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

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
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div className="welcome-section">
              <h1 className="welcome-title">
                Welcome back, {user.name || "Parent"}! 👋
              </h1>
              <p className="welcome-subtitle">
                Manage your daycare connections and keep track of your child's
                care
              </p>
              {user.email && (
                <p className="welcome-email">
                  <small className="text-muted">Logged in as: {user.email}</small>
                </p>
              )}
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

        {/* Profile Complete Success Alert */}
        {user.profileComplete && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success" className="profile-alert">
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="me-2" />
                  <div>
                    <strong>Profile Complete!</strong>
                    <p className="mb-0">
                      Your profile is complete. You can now access all features.
                    </p>
                  </div>
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
                    {user.profileComplete
                      ? "Start searching for daycares to see your activity here"
                      : "Complete your profile and start searching for daycares to see your activity here"}
                  </p>
                  <Button 
                    as={Link} 
                    to={user.profileComplete ? "/parent/search" : "/parent/profile"} 
                    variant="primary"
                  >
                    {user.profileComplete ? "Search Daycares" : "Complete Profile"}
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