import { Container, Row, Col } from 'react-bootstrap'
import { FaGlobe, FaPhoneAlt, FaFileAlt, FaLanguage, FaFacebook, FaTwitter, FaMobileAlt, FaSearch, FaUserFriends, FaCheckCircle, FaStar, FaQuestionCircle } from 'react-icons/fa'
import '../styles/Footer.css'

function Footer() {
  return (
    <footer className="footer-custom text-center py-5">
      <Container fluid>
        {/* Navigation Links */}
        <Row className="justify-content-center mb-4">
          <Col xs={12}>
            <nav className="footer-nav d-flex flex-wrap justify-content-center gap-4 mb-3">
              <a href="#howitworks"><FaSearch className="me-2" />How It Works</a>
              <a href="#whoitsfor"><FaUserFriends className="me-2" />Who It's For</a>
              <a href="#whychoose"><FaCheckCircle className="me-2" />Why Choose</a>
              <a href="#reviews"><FaStar className="me-2" />Reviews</a>
              <a href="#faq"><FaQuestionCircle className="me-2" />FAQ</a>
            </nav>
          </Col>
        </Row>
        {/* Info Columns */}
        <Row className="justify-content-center mb-3">
          <Col md={3} sm={6}>
            <div><FaGlobe /> <b>About Daycare Connect</b></div>
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