import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { FaSearch, FaUserFriends, FaSchool } from "react-icons/fa";
import "../styles/Hero.css";

function Hero() {
  return (
    <Container className="text-center my-5">
      <Row className="justify-content-center">
        <Tilt tiltMaxAngleX={7} tiltMaxAngleY={7} scale={1.01}>
          <Card
            className="shadow-lg p-4 hero-card"
            style={{
              borderRadius: "2rem",
              background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
            }}
          >
            <Card.Body>
              <Card.Title as="h1" className="display-5 mb-3">
                Connecting You with Trusted Daycares Across Bangladesh
              </Card.Title>
              <Card.Text className="lead mb-4">
                Find verified daycare centers, book slots, receive updates, and
                ensure your child's safety — all in one place.
              </Card.Text>
              <br />
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Button variant="primary" size="lg">
                  <FaSearch className="me-2" />
                  Explore Daycares
                </Button>
                <br />
                <Button
                  as={Link}
                  to="/parent"
                  variant="outline-primary"
                  size="lg"
                >
                  <FaUserFriends className="me-2" />
                  I’m a Parent
                </Button>
                <Button
                  as={Link}
                  to="/daycare"
                  variant="outline-secondary"
                  size="lg"
                >
                  <FaSchool className="me-2" />
                  I’m a Daycare Provider
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tilt>
      </Row>
    </Container>
  );
}
export default Hero;
