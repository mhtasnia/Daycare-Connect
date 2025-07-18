import { Container, Row, Col } from 'react-bootstrap';
import { FaGlobe, FaPhoneAlt, FaFileAlt, FaLanguage, FaFacebook, FaTwitter, FaMobileAlt, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; // Make sure this path is correct

function Footer() {
  return (
    <footer className="footer-custom text-center text-md-start py-5">
      <Container fluid className="h-100 d-flex flex-column justify-content-between">
        <Row className="justify-content-center text-center text-md-start mb-4">
          {/* About Section */}
          <Col md={4} sm={12} className="mb-4 mb-md-0">
            <h5 className="footer-title">About Daycare Connect</h5>
            <p>
              Daycare Connect helps parents find the best daycare services for their children,
              connecting them with trusted providers and resources.
            </p>
            <Link to="/" className="footer-link d-inline-flex align-items-center">
              <FaGlobe className="me-2" /> Learn More
            </Link>
          </Col>

          {/* Quick Links / Navigation */}
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-list">
              <li>
                <Link to="/*" className="footer-link">
                  <FaPhoneAlt className="me-2" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/*" className="footer-link">
                  <FaFileAlt className="me-2" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/*" className="footer-link">
                  <FaFileAlt className="me-2" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#faq" className="footer-link">
                  <FaQuestionCircle className="me-2" /> FAQ
                </Link>
              </li>
            </ul>
          </Col>

          {/* Connect With Us / Social */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <h5 className="footer-title">Connect With Us</h5>
            <div className="footer-social-icons mb-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <FaTwitter />
              </a>
              <a href="#" className="mx-2"> {/* Assuming this is for a mobile app or similar */}
                <FaMobileAlt />
              </a>
            </div>
            {/* Language Selector */}
            <div className="language-selector d-flex align-items-center justify-content-center justify-content-md-start">
              <FaLanguage className="me-2" />
              <span>Bangla / English (Coming soon)</span>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        {/* Copyright */}
        <Row className="justify-content-center text-center">
          <Col xs={12}>
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Daycare Connect. All rights reserved.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;