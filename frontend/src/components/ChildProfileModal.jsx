import React, { useState } from 'react';
import { Modal, Tab, Nav, Row, Col, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ChildProfileModal.css'; // Assuming you have some custom styles
const ChildProfileModal = ({ show, onHide, booking }) => {
  if (!booking) return null;

  const [activeTab, setActiveTab] = useState('child');

  const { parent_profile, parent_profile: { emergency_contact, children } } = booking;
  const child = children?.[0];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{child?.full_name}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="child">Child Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="parent">Parent Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="emergency">Emergency Contact</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="child">
              <Row>
                <Col md={4}>
                  <Image src={child?.photo_url} rounded fluid />
                </Col>
                <Col>
                  <p><strong>Name:</strong> {child?.full_name}</p>
                  <p><strong>Age:</strong> {child?.age}</p>
                  <p><strong>Gender:</strong> {child?.gender}</p>
                  <p><strong>Date of Birth:</strong> {child?.date_of_birth}</p>
                  <p><strong>Special Needs:</strong> {child?.special_needs}</p>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="parent">
              <Row>
                <Col md={4}>
                  <Image src={parent_profile?.profile_image_url} rounded fluid />
                </Col>
                <Col>
                  <p><strong>Name:</strong> {parent_profile?.full_name}</p>
                  <p><strong>Email:</strong> {parent_profile?.email}</p>
                  <p><strong>Profession:</strong> {parent_profile?.profession}</p>
                  <p><strong>Phone:</strong> {parent_profile?.phone}</p>
                  <p><strong>Address:</strong> {parent_profile?.address?.full_address}</p>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="emergency">
              <Row>
                <Col md={4}>
                  <Image src={emergency_contact?.photo_url} rounded fluid />
                </Col>
                <Col>
                  <p><strong>Name:</strong> {emergency_contact?.full_name}</p>
                  <p><strong>Relationship:</strong> {emergency_contact?.relationship}</p>
                  <p><strong>Phone:</strong> {emergency_contact?.phone_primary}</p>
                  <p><strong>Email:</strong> {emergency_contact?.email}</p>
                  <p><strong>Authorized Pickup:</strong> {emergency_contact?.is_authorized_pickup ? "Yes" : "No"}</p>
                  <p><strong>Notes:</strong> {emergency_contact?.notes}</p>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default ChildProfileModal;
