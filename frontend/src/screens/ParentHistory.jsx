import React from 'react';
import ParentNavbar from '../components/ParentNavbar';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Star } from 'lucide-react';
import '../styles/ParentHistory.css';

const ParentHistory = () => {
  const history = [
    { id: 1, daycare: 'Sunshine Daycare', date: '2025-07-20', reviewed: true },
    { id: 2, daycare: 'Playful Pals', date: '2025-07-22', reviewed: false },
  ];

  return (
    <div className="parent-history-page">
      <ParentNavbar />
      <Container className="parent-history-container mt-5 pt-5">
        <h2 className="text-center mb-4">Booking History & Reviews</h2>
        <Row>
          {history.map((item) => (
            <Col md={6} key={item.id} className="mb-4">
              <Card className="history-card shadow-sm">
                <Card.Body>
                  <Card.Title>{item.daycare}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{item.date}</Card.Subtitle>
                  {item.reviewed ? (
                    <div className="reviewed-section">
                      <p className="text-success">Already Reviewed</p>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} fill="gold" stroke="gold" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3" controlId={`rating-${item.id}`}>
                        <Form.Label>Your Rating</Form.Label>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} />
                          ))}
                        </div>
                      </Form.Group>
                      <Form.Group controlId={`review-${item.id}`}>
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                      </Form.Group>
                    </Form>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default ParentHistory;
