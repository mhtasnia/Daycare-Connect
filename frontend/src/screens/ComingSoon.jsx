import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHourglassHalf, FaTools, FaLightbulb } from 'react-icons/fa'; // Icons for visual flair
import { Link } from 'react-router-dom';
import '../styles/ComingSoon.css'; // We'll create this CSS file next
import '../components/Footer';

function ComingSoonPage() {
  return (
    <div className="coming-soon-wrapper">
      <Container className="coming-soon-container text-center d-flex flex-column justify-content-center align-items-center">
        <Row className="mb-4">
          <Col>
            <div className="animated-icon icon-hourglass">
              <FaHourglassHalf />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h1 className="coming-soon-title">Exciting Things Are Brewing!</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <p className="coming-soon-message">
              We're tirelessly working on this feature to bring you the best experience.
              It will be available soon!
            </p>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <div className="animated-icon icon-tools">
              <FaTools />
            </div>
            <div className="animated-icon icon-lightbulb">
              <FaLightbulb />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/" className="btn btn-primary back-home-btn">
              Go Back Home
            </Link>
          </Col>
        </Row>
      </Container>
    
    </div>
  );
}

export default ComingSoonPage;