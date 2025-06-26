import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaBullhorn, FaChartBar, FaEnvelopeOpenText, FaCheckCircle, FaUserPlus, FaClipboardCheck, FaCalendarCheck, FaQuoteLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import DaycareNavbar from "../components/DaycareNavbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import IntelligentSearchBar from "../components/IntelligentSearchBar";

function DaycareLanding() {
  return (
    <div className="full-width-theme">
      <DaycareNavbar />
      <div style={{ marginTop: "6rem" }} />
      {/* Hero Section */}
      <section className="text-center py-5">
        <Container>
          <h1 className="display-5 fw-bold mb-3">
            Grow Your Daycare Business with <span className="text-highlight">Daycare Connect</span>
          </h1>
          <p className="lead mb-4">
            Reach more parents. Manage your listings. Get discovered.
          </p>
          <IntelligentSearchBar />
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button as={Link} to="/daycare/register" className="btn-parent-primary" size="lg">
              Get Started
            </Button>
            <Button variant="outline-primary" href="#howitworks" size="lg">
              See How It Works
            </Button>
          </div>
        </Container>
      </section>
      {/* Benefits Section */}
      <section id="benefits" className="py-5">
        <Container>
          <Row className="mb-4">
            <Col className="text-center">
              <h2 className="section-title">Why Join Daycare Connect?</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body>
                  <FaBullhorn className="feature-icon mb-3" size={36} color="#fbb034" />
                  <Card.Title>More Visibility</Card.Title>
                  <Card.Text>Parents can find you through search and filters.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body>
                  <FaChartBar className="feature-icon mb-3" size={36} color="#90caf9" />
                  <Card.Title>Get Analytics</Card.Title>
                  <Card.Text>See views, inquiries, and performance stats.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body>
                  <FaEnvelopeOpenText className="feature-icon mb-3" size={36} color="#f48fb1" />
                  <Card.Title>Direct Communication</Card.Title>
                  <Card.Text>Chat directly with interested parents.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              <Card className="parent-feature-card h-100">
                <Card.Body>
                  <FaCheckCircle className="feature-icon mb-3" size={36} color="#81c784" />
                  <Card.Title>Verified Badge</Card.Title>
                  <Card.Text>Get a verified profile to build trust.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      {/* How It Works */}
      <section id="howitworks" className="py-5 bg-light">
        <Container>
          <Row className="mb-4">
            <Col className="text-center">
              <h2 className="section-title">How It Works</h2>
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <div className="step-card">
                <FaUserPlus size={40} className="mb-2" color="#fbb034" />
                <h5>Create Profile</h5>
                <p>Sign up and add your daycare details.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card">
                <FaClipboardCheck size={40} className="mb-2" color="#90caf9" />
                <h5>Get Verified</h5>
                <p>Submit documents and get your badge.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card">
                <FaCalendarCheck size={40} className="mb-2" color="#81c784" />
                <h5>Receive Bookings</h5>
                <p>Start connecting with parents and manage bookings.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Testimonials */}
      <section className="py-5">
        <Container>
          <Row className="mb-4">
            <Col className="text-center">
              <h2 className="section-title">What Daycare Owners Say</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="testimonial-card">
                <Card.Body>
                  <FaQuoteLeft className="mb-2" color="#fbb034" />
                  <Card.Text>
                    "Daycare Connect helped us reach more families and made our booking process so much easier!"
                  </Card.Text>
                  <div className="testimonial-author mt-3">
                    <strong>Shirin Akter</strong>
                    <small className="text-muted d-block">Owner, Little Stars Daycare</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      {/* CTA */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="cta-title mb-3">
            Ready to reach more families and simplify your daycare operations?
          </h2>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/daycare/register" className="btn-parent-primary" size="lg">
              Register Now
            </Button>
            <Button as={Link} to="/daycare/login" variant="outline-primary" size="lg">
              Log In
            </Button>
          </div>
        </Container>
      </section>
      <Footer />
      <Chatbot />
    </div>
  );
}
export default DaycareLanding;