import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { FaUserFriends, FaSchool } from 'react-icons/fa'
import '../styles/WhoItsFor.css'

function WhoItsFor() {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 section-header">Who It's For</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="h-100 p-4 shadow-sm whoitsfor-card" style={{ borderRadius: '1.5rem' }}>
            <Card.Title className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.5rem' }}>
              <FaUserFriends /> For Parents
            </Card.Title>
            <ul className="list-unstyled mb-3">
              <li>• Create your child’s profile</li>
              <li>• Schedule drop-off and pickup</li>
              <li>• Add authorized pickup persons</li>
              <li>• Receive updates and emergency alerts</li>
            </ul>
            <Button 
              className="rounded-pill whoitsfor-btn-parent"
            >
              Create an Account
            </Button>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 p-4 shadow-sm whoitsfor-card" style={{ borderRadius: '1.5rem' }}>
            <Card.Title className="mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.5rem' }}>
              <FaSchool /> For Daycare Centers
            </Card.Title>
            <ul className="list-unstyled mb-3">
              <li>• Register and get verified</li>
              <li>• Showcase your services</li>
              <li>• Manage bookings and send updates</li>
              <li>• Build trust with parent reviews</li>
            </ul>
            <Button variant="outline-secondary" className="rounded-pill">Register Your Daycare</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
export default WhoItsFor