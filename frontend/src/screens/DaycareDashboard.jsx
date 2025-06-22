import { Container, Row, Col, Card } from "react-bootstrap";
import DaycareNavbar from "../components/DaycareNavbar";

function DaycareDashboard() {
  return (
    <div className="dashboard-bg">
      <DaycareNavbar />
      <Container fluid className="pt-5" style={{ minHeight: "100vh" }}>
        <Row>
          {/* Sidebar */}
          <Col
            md={3}
            className="d-none d-md-block sidebar-dashboard px-0"
            style={{
              background: "linear-gradient(135deg, #99f2c8 0%, #90caf9 100%)",
              minHeight: "calc(100vh - 64px)",
              boxShadow: "2px 0 12px 0 rgba(153,242,200,0.07)",
            }}
          >
            <div className="sidebar-sticky pt-4">
              <ul className="nav flex-column dashboard-nav">
                <li className="nav-item mb-3">
                  <a className="nav-link active" href="#">
                    <b>Dashboard</b>
                  </a>
                </li>
                <li className="nav-item mb-3">
                  <a className="nav-link disabled" href="#">
                    Profile
                  </a>
                </li>
                <li className="nav-item mb-3">
                  <a className="nav-link disabled" href="#">
                    Bookings
                  </a>
                </li>
                <li className="nav-item mb-3">
                  <a className="nav-link disabled" href="#">
                    History
                  </a>
                </li>
                <li className="nav-item mb-3">
                  <a className="nav-link disabled" href="#">
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          {/* Main Dashboard Content */}
          <Col md={9} className="pt-5 pt-md-4 px-4">
            <h2 className="mb-4 fw-bold" style={{ color: "#1f4037" }}>
              Daycare Dashboard
            </h2>
            <Row className="g-4">
              <Col md={4}>
                <Card className="shadow-sm dashboard-card">
                  <Card.Body>
                    <h5 className="mb-2">Today's Bookings</h5>
                    <div className="display-6 fw-bold" style={{ color: "#1f4037" }}>3</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm dashboard-card">
                  <Card.Body>
                    <h5 className="mb-2">Pending Requests</h5>
                    <div className="display-6 fw-bold" style={{ color: "#1f4037" }}>5</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm dashboard-card">
                  <Card.Body>
                    <h5 className="mb-2">Total Children</h5>
                    <div className="display-6 fw-bold" style={{ color: "#1f4037" }}>18</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card className="mt-5 shadow-sm">
              <Card.Body>
                <h4 className="mb-3">Welcome to your Daycare Dashboard!</h4>
                <p>
                  Here you can manage your daycare profile, view and approve bookings, track your history, and update your settings. Use the sidebar to navigate between sections.
                </p>
                <p className="text-muted mb-0">
                  (Sidebar tabs are disabled for now. Only the dashboard is active.)
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DaycareDashboard;