import { Container, Row, Col } from 'react-bootstrap'
import { FaGlobe, FaPhoneAlt, FaFileAlt, FaLanguage, FaFacebook, FaTwitter, FaMobileAlt, FaSearch, FaUserFriends, FaCheckCircle, FaStar, FaQuestionCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer-custom text-center py-5">
      <Container fluid>
        {/* Navigation Links */}
        <Row className="justify-content-center mb-4">
          <Col xs={8}>
          </Col>
        </Row>
        {/* Info Columns */}
        <Row className="justify-content-center mb-3">
          <Col md={3} sm={6}>
            <div>
              <Link to="/" className="footer-link">
                <FaGlobe /> <b>About Daycare Connect</b>
              </Link>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div><FaPhoneAlt /> <b>Contact Us</b></div>
          </Col>
          <Col md={3} sm={6}>
            <div><FaFileAlt /> <b>Privacy & Terms</b></div>
          </Col>
          <Col md={3} sm={6}>
            <div><FaLanguage /> Bangla / English (Coming soon)</div>
          </Col>
        </Row>
        {/* Social Icons */}
        <div className="mb-3">
          <a href="#" className="mx-2"><FaMobileAlt /></a>
          <a href="#" className="mx-2"><FaTwitter /></a>
          <a href="#" className="mx-2"><FaFacebook /></a>
        </div>
        {/* Copyright */}
        <div>
          &copy; {new Date().getFullYear()} Daycare Connect. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
export default Footer