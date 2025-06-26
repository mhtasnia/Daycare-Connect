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
  FaCalendarAlt,
  FaClipboardList,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaSchool,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Bar,
  Pie,
  Line,
  Doughnut,
} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import "../styles/ParentHome.css"; // Reuse for layout, override colors below
import axios from "axios";
import { useEffect } from "react";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);


function DaycareDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Happy Kids Daycare",
    email: "info@happykids.com",
    profileComplete: true,
  });

  //Users cant go Back and access the dashboard after logout 
  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/daycare/login", { replace: true });
    }
  }, []);


  //logou handler
  // This function handles the logout process, clears local storage, and redirects to the login page
  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const refresh = localStorage.getItem("refresh");
      const access = localStorage.getItem("access");
      console.log("Tokens:", { refresh, access }); // Add this line

      if (refresh && access) {
        const res = await axios.post(
          "http://localhost:8000/api/user-auth/daycares/logout/",
          { refresh },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        console.log("Logout response:", res.data);
      } else {
        console.warn("Tokens missing");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      // Always clear storage and navigate
      localStorage.clear();
      navigate("/daycare/login");
    }
  };

  // Feature list (customize as needed)
  const features = [
    {
      title: "Profile",
      description: "View and update your daycare profile",
      icon: FaUser,
      link: "/daycare/profile",
      variant: "daycare",
    },
    {
      title: "Bookings",
      description: "Manage and approve parent bookings",
      icon: FaClipboardList,
      link: "/daycare/bookings",
      variant: "daycare",
    },
    {
      title: "History",
      description: "See your booking and attendance history",
      icon: FaHistory,
      link: "/daycare/history",
      variant: "daycare",
    },
    {
      title: "Settings",
      description: "Configure your daycare account settings",
      icon: FaCog,
      link: "/daycare/settings",
      variant: "daycare",
    },
  ];

  // Example chart data
  const bookingsBarData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Bookings",
        data: [12, 19, 8, 15, 10],
        backgroundColor: "rgba(153, 242, 200, 0.7)",
        borderColor: "#90caf9",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const childrenPieData = {
    labels: ["Infants", "Toddlers", "Preschoolers"],
    datasets: [
      {
        label: "Children by Age Group",
        data: [8, 12, 6],
        backgroundColor: [
          "#99f2c8",
          "#90caf9",
          "#23395d"
        ],
        borderWidth: 1,
      },
    ],
  };

  const attendanceLineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance",
        data: [20, 18, 22, 19],
        fill: false,
        borderColor: "#23395d",
        backgroundColor: "#90caf9",
        tension: 0.3,
        pointBackgroundColor: "#99f2c8",
        pointBorderColor: "#23395d",
      },
    ],
  };

  const satisfactionDoughnutData = {
    labels: ["Satisfied", "Neutral", "Unsatisfied"],
    datasets: [
      {
        label: "Parent Satisfaction",
        data: [30, 5, 2],
        backgroundColor: [
          "#99f2c8",
          "#90caf9",
          "#bdbdbd"
        ],
        borderWidth: 1,
      },
    ],
    
  };
  


  


  return (
    <div className="daycare-dashboard-wrapper">
      {/* Navigation Header */}
      <Navbar
        expand="lg"
        className="parent-navbar shadow-sm"
        style={{
          background: "linear-gradient(45deg, #99f2c8, #90caf9)",
          borderBottom: "2px solid #90caf9",
        }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/daycare/dashboard" className="fw-bold" style={{ color: "#23395d" }}>
            Daycare <span className="brand-highlight" style={{ color: "#90caf9" }}>Connect</span>
            <span className="text-muted small daycare-highlight">| Daycare</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="daycare-navbar" />
          <Navbar.Collapse id="daycare-navbar">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/daycare/dashboard" className="nav-item" style={{ color: "#23395d" }}>
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/profile" className="nav-item" style={{ color: "#23395d" }}>
                <FaUser className="me-1" /> Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/bookings" className="nav-item" style={{ color: "#23395d" }}>
                <FaClipboardList className="me-1" /> Bookings
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/history" className="nav-item" style={{ color: "#23395d" }}>
                <FaHistory className="me-1" /> History
              </Nav.Link>
              <Nav.Link as={Link} to="/daycare/settings" className="nav-item" style={{ color: "#23395d" }}>
                <FaCog className="me-1" /> Settings
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
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <div
              className="welcome-section"
              style={{
                background: "linear-gradient(90deg, #99f2c8 0%, #90caf9 100%)",
                color: "#23395d",
              }}
            >
              <h1 className="welcome-title" style={{ color: "#23395d" }}>
                Welcome, {user.name}!
              </h1>
              <p className="welcome-subtitle" style={{ color: "#23395d" }}>
                Manage your daycare, bookings, and connect with parents.
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
                      Add your daycare details to get the most out of Daycare Connect.
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to="/daycare/profile"
                    variant="warning"
                    className="ms-3"
                  >
                    <FaCheckCircle className="me-1" /> Complete Now
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Feature Cards */}
        <Row>
          {features.map((feature, idx) => (
            <Col lg={3} md={6} className="mb-4" key={idx}>
              <Card
                className="quick-action-card h-100"
                style={{
                  border: "2px solid #90caf9",
                  background: "rgba(153, 242, 200, 0.08)",
                }}
              >
                <Card.Body className="text-center">
                  <div className="action-icon mb-3" style={{ color: "#90caf9" }}>
                    <feature.icon size={32} />
                  </div>
                  <Card.Title className="action-title" style={{ color: "#23395d" }}>
                    {feature.title}
                  </Card.Title>
                  <Card.Text className="action-description" style={{ color: "#23395d" }}>
                    {feature.description}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={feature.link}
                    style={{
                      background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                      color: "#23395d",
                      border: "none",
                      borderRadius: "25px",
                      fontWeight: 600,
                    }}
                    className="action-btn"
                  >
                    Go
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Dashboard Charts */}
        <Row className="mt-4">
          <Col md={6} xs={12} className="mb-4">
            <Card className="h-100">
              <Card.Body style={{ padding: "0.5rem" }}>
                <Card.Title style={{ color: "#23395d", fontSize: "0.95rem" }}>Bookings This Week</Card.Title>
                <div style={{ width: "100%", height: "200px" }}>
                  <Bar
                    data={bookingsBarData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } },
                      maintainAspectRatio: false,
                    }}
                    height={110}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xs={12} className="mb-4">
            <Card className="h-100">
              <Card.Body style={{ padding: "0.5rem" }}>
                <Card.Title style={{ color: "#23395d", fontSize: "0.95rem" }}>Children by Age Group</Card.Title>
                <div style={{ width: "100%", height: "200px" }}>
                  <Pie
                    data={childrenPieData}
                    options={{
                      plugins: { legend: { position: "bottom" } },
                      maintainAspectRatio: false,
                    }}
                    height={110}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xs={12} className="mb-4">
            <Card className="h-100">
              <Card.Body style={{ padding: "0.5rem" }}>
                <Card.Title style={{ color: "#23395d", fontSize: "0.95rem" }}>Attendance Trend</Card.Title>
                <div style={{ width: "100%", height: "200px" }}>
                  <Line
                    data={attendanceLineData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true } },
                      maintainAspectRatio: false,
                    }}
                    height={110}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xs={12} className="mb-4">
            <Card className="h-100">
              <Card.Body style={{ padding: "0.5rem" }}>
                <Card.Title style={{ color: "#23395d", fontSize: "0.95rem" }}>Parent Satisfaction</Card.Title>
                <div style={{ width: "100%", height: "200px" }}>
                  <Doughnut
                    data={satisfactionDoughnutData}
                    options={{
                      plugins: { legend: { position: "bottom" } },
                      maintainAspectRatio: false,
                    }}
                    height={110}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row className="mt-5">
          <Col>
            <h3 className="section-title mb-3" style={{ color: "#23395d" }}>
              Recent Activity
            </h3>
            <Card className="activity-card">
              <Card.Body>
                <div className="text-center py-4">
                  <FaCalendarAlt size={48} className="text-muted mb-3" />
                  <h5>No Recent Activity</h5>
                  <p className="text-muted">
                    Manage bookings and interact with parents to see your activity here.
                  </p>
                  <Button as={Link} to="/daycare/bookings" style={{
                    background: "linear-gradient(45deg, #99f2c8, #90caf9)",
                    color: "#23395d",
                    border: "none",
                    borderRadius: "25px",
                    fontWeight: 600,
                  }}>
                    View Bookings
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

export default DaycareDashboard;