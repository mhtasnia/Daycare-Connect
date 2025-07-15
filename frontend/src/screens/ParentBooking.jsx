import React from 'react';
import ParentNavbar from '../components/ParentNavbar';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Check, X } from 'lucide-react';
import '../styles/ParentBooking.css';

const ParentBooking = () => {
  const bookings = [
    { id: 1, daycare: 'Happy Kids Daycare', date: '2025-08-15', status: 'Pending' },
    { id: 2, daycare: 'Little Angels', date: '2025-08-18', status: 'Pending' },
  ];

  return (
    <div className="parent-booking-page">
      <ParentNavbar />
      <Container className="parent-booking-container mt-5 pt-5">
        <h2 className="text-center mb-4">Manage Your Bookings</h2>
        <Row>
          {bookings.map((booking) => (
            <Col md={6} key={booking.id} className="mb-4">
              <Card className="booking-card shadow-sm">
                <Card.Body>
                  <Card.Title>{booking.daycare}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{booking.date}</Card.Subtitle>
                  <Card.Text>
                    Status: <span className={`status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button variant="outline-success" className="me-2">
                      <Check size={18} /> Accept
                    </Button>
                    <Button variant="outline-danger">
                      <X size={18} /> Decline
                    </Button>
                  </div>
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

export default ParentBooking;
