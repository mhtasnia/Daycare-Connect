import { Container, Row, Col, Card } from 'react-bootstrap'
import { FaCheckCircle, FaLock, FaBullhorn, FaShieldAlt } from 'react-icons/fa'
import '../styles/WhyChoose.css'

function WhyChoose() {
  const reasons = [
    { icon: <FaCheckCircle className="whychoose-icon text-success" />, text: <b>Verified Daycares Only</b>, desc: "All centers are strictly verified for your peace of mind." },
    { icon: <FaLock className="whychoose-icon text-primary" />, text: <b>Secure Bookings & Data</b>, desc: "Your information and bookings are always protected." },
    { icon: <FaBullhorn className="whychoose-icon text-info" />, text: <b>Direct Communication Tools</b>, desc: "Easily connect with providers and get instant updates." },
    { icon: <FaShieldAlt className="whychoose-icon text-warning" />, text: <b>Complaint & Investigation Support</b>, desc: "We support you with a transparent complaint process." }
  ]
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 section-header">Why Choose Daycare Connect</h2>
      <Row className="justify-content-center">
        {reasons.map((r, i) => (
          <Col md={3} sm={6} xs={12} key={i} className="mb-3">
            <Card className="text-center p-4 border-0 whychoose-card">
              <div>{r.icon}</div>
              <Card.Title className="mt-3 mb-2" style={{ fontSize: '1.15rem' }}>{r.text}</Card.Title>
              <Card.Text className="whychoose-desc">{r.desc}</Card.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
export default WhyChoose