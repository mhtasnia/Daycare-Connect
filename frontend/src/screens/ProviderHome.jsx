import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaSchool, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBell, 
  FaCog, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserTie,
  FaFileAlt,
  FaShieldAlt
} from 'react-icons/fa';
import '../styles/ProviderHome.css';

function ProviderHome() {
  const [accountStatus, setAccountStatus] = useState('approved'); // approved, pending, rejected
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Account Approved!',
      message: 'Congratulations! Your daycare has been successfully verified and approved. You can now start receiving bookings from parents.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Complete Your Profile',
      message: 'Add photos and detailed descriptions to attract more parents to your daycare.',
      timestamp: '1 day ago',
      read: false
    }
  ]);

  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 24,
    activeChildren: 18,
    pendingRequests: 6,
    monthlyRevenue: 45000
  });

  const getStatusBadge = () => {
    switch (accountStatus) {
      case 'approved':
        return <Badge bg="success" className="status-badge"><FaCheckCircle className="me-1" />Approved & Active</Badge>;
      case 'pending':
        return <Badge bg="warning" className="status-badge"><FaClock className="me-1" />Under Review</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="status-badge"><FaExclamationTriangle className="me-1" />Action Required</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">Unknown Status</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (accountStatus) {
      case 'approved':
        return {
          type: 'success',
          title: 'Welcome to Your Daycare Dashboard!',
          message: 'Your daycare registration has been successfully approved and verified. You now have full access to all platform features including booking management, parent communication, and business analytics. Start building relationships with families in your community and grow your daycare business with confidence.',
          actions: [
            { label: 'Complete Profile Setup', link: '/provider/profile', variant: 'primary' },
            { label: 'View Booking Requests', link: '/provider/bookings', variant: 'outline-primary' }
          ]
        };
      case 'pending':
        return {
          type: 'warning',
          title: 'Application Under Review',
          message: 'Thank you for registering your daycare with Daycare Connect. Our verification team is currently reviewing your application and supporting documents. This process typically takes 2-3 business days. Once approved, you will receive an email confirmation and gain full access to start accepting bookings from verified parents.',
          actions: [
            { label: 'Check Application Status', link: '/provider/application-status', variant: 'warning' },
            { label: 'Upload Additional Documents', link: '/provider/documents', variant: 'outline-warning' }
          ]
        };
      case 'rejected':
        return {
          type: 'danger',
          title: 'Application Requires Attention',
          message: 'We were unable to approve your daycare registration at this time. This may be due to incomplete documentation, licensing issues, or other verification requirements. Please review the feedback provided and resubmit your application with the necessary corrections. Our support team is available to assist you through this process.',
          actions: [
            { label: 'View Feedback', link: '/provider/feedback', variant: 'danger' },
            { label: 'Contact Support', link: '/provider/support', variant: 'outline-danger' }
          ]
        };
      default:
        return {
          type: 'info',
          title: 'Account Status Unknown',
          message: 'We are unable to determine your account status at this time. Please contact our support team for assistance.',
          actions: [
            { label: 'Contact Support', link: '/provider/support', variant: 'info' }
          ]
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="provider-home-wrapper">
      <Container fluid>
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="dashboard-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="dashboard-title">
                    <FaSchool className="me-3" />
                    Daycare Dashboard
                  </h1>
                  <p className="dashboard-subtitle">Manage your daycare business efficiently</p>
                </div>
                <div className="header-actions">
                  {getStatusBadge()}
                  <Button variant="outline-primary" className="ms-3">
                    <FaCog className="me-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Status Alert Section */}
        <Row className="mb-4">
          <Col>
            <Alert variant={statusInfo.type} className="status-alert">
              <div className="d-flex align-items-start">
                <div className="alert-icon me-3">
                  {statusInfo.type === 'success' && <FaCheckCircle size={24} />}
                  {statusInfo.type === 'warning' && <FaClock size={24} />}
                  {statusInfo.type === 'danger' && <FaExclamationTriangle size={24} />}
                </div>
                <div className="flex-grow-1">
                  <h4 className="alert-title">{statusInfo.title}</h4>
                  <p className="alert-message">{statusInfo.message}</p>
                  <div className="alert-actions mt-3">
                    {statusInfo.actions.map((action, index) => (
                      <Button
                        key={index}
                        as={Link}
                        to={action.link}
                        variant={action.variant}
                        className="me-2 mb-2"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>

        {/* Dashboard Stats - Only show if approved */}
        {accountStatus === 'approved' && (
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <FaCalendarAlt className="stat-icon text-primary" />
                  <h3 className="stat-number">{dashboardStats.totalBookings}</h3>
                  <p className="stat-label">Total Bookings</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <FaUsers className="stat-icon text-success" />
                  <h3 className="stat-number">{dashboardStats.activeChildren}</h3>
                  <p className="stat-label">Active Children</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <FaBell className="stat-icon text-warning" />
                  <h3 className="stat-number">{dashboardStats.pendingRequests}</h3>
                  <p className="stat-label">Pending Requests</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="stat-card">
                <Card.Body className="text-center">
                  <FaChartLine className="stat-icon text-info" />
                  <h3 className="stat-number">৳{dashboardStats.monthlyRevenue.toLocaleString()}</h3>
                  <p className="stat-label">Monthly Revenue</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="quick-actions-card">
              <Card.Header>
                <h5 className="mb-0">
                  <FaUserTie className="me-2" />
                  Quick Actions
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="mb-3">
                    <Button 
                      as={Link} 
                      to="/provider/profile" 
                      variant="outline-primary" 
                      className="w-100 quick-action-btn"
                      disabled={accountStatus !== 'approved'}
                    >
                      <FaUserTie className="mb-2 d-block" size={24} />
                      Manage Profile
                    </Button>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Button 
                      as={Link} 
                      to="/provider/bookings" 
                      variant="outline-success" 
                      className="w-100 quick-action-btn"
                      disabled={accountStatus !== 'approved'}
                    >
                      <FaCalendarAlt className="mb-2 d-block" size={24} />
                      View Bookings
                    </Button>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Button 
                      as={Link} 
                      to="/provider/documents" 
                      variant="outline-info" 
                      className="w-100 quick-action-btn"
                    >
                      <FaFileAlt className="mb-2 d-block" size={24} />
                      Documents
                    </Button>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Button 
                      as={Link} 
                      to="/provider/support" 
                      variant="outline-secondary" 
                      className="w-100 quick-action-btn"
                    >
                      <FaShieldAlt className="mb-2 d-block" size={24} />
                      Support
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notifications */}
        <Row>
          <Col md={8}>
            <Card className="notifications-card">
              <Card.Header>
                <h5 className="mb-0">
                  <FaBell className="me-2" />
                  Recent Notifications
                </h5>
              </Card.Header>
              <Card.Body>
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="notification-title">{notification.title}</h6>
                        <p className="notification-message">{notification.message}</p>
                        <small className="text-muted">{notification.timestamp}</small>
                      </div>
                      {!notification.read && <Badge bg="primary">New</Badge>}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="help-card">
              <Card.Header>
                <h5 className="mb-0">
                  <FaShieldAlt className="me-2" />
                  Need Help?
                </h5>
              </Card.Header>
              <Card.Body>
                <p>Our support team is here to help you succeed with your daycare business.</p>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/provider/support" variant="primary">
                    Contact Support
                  </Button>
                  <Button as={Link} to="/provider/help" variant="outline-primary">
                    Help Center
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProviderHome;
