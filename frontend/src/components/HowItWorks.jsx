import { Container, Row, Col, Card } from 'react-bootstrap'
import Tilt from 'react-parallax-tilt'
import { FaSearch, FaCalendarAlt, FaCameraRetro, FaStar } from 'react-icons/fa'
import '../styles/HowItWorks.css'

function HowItWorks() {
  const steps = [
    { icon: <FaSearch className="howitworks-icon text-primary" />, title: "Search", desc: "Discover nearby verified daycare centers." },
    { icon: <FaCalendarAlt className="howitworks-icon text-info" />, title: "Book", desc: "Reserve flexible slots for your child." },
    { icon: <FaCameraRetro className="howitworks-icon text-success" />, title: "Stay Informed", desc: "Get real-time updates, photos, and notifications." },
    { icon: <FaStar className="howitworks-icon text-warning" />, title: "Rate & Review", desc: "Share your experience to help others." }
  ]
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 section-header">How Daycare Connect Works</h2>
      <Row className="justify-content-center">
        {steps.map((step, i) => (
          <Col md={3} sm={6} xs={12} key={i} className="mb-4">
            <Tilt tiltMaxAngleX={7} tiltMaxAngleY={7} scale={1.01}>
              <Card className="h-100 text-center p-3 border-0 shadow-sm howitworks-card animate__animated animate__fadeInUp" style={{ borderRadius: '1.5rem', animationDelay: `${i * 0.13 + 0.1}s` }}>
                <div>{step.icon}</div>
                <Card.Title className="mt-3">{step.title}</Card.Title>
                <Card.Text>{step.desc}</Card.Text>
              </Card>
            </Tilt>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
export default HowItWorks