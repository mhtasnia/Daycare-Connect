import { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/LandingNavbar.css';

function LandingNavbar() {
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'howitworks', 'whoitsfor', 'whychoose', 'reviews', 'faq'];
      let found = false;
      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 90 && rect.bottom >= 90 && !found) {
            document.querySelectorAll('.landing-navbar-links .nav-link').forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
            found = true;
          }
        }
      }
      if (!found) {
        document.querySelectorAll('.landing-navbar-links .nav-link').forEach(link => {
          link.classList.remove('active');
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar expand="lg" className="landing-navbar shadow-sm animate__animated animate__fadeInDown" bg="white" variant="light" fixed="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold landing-navbar-brand">
          Daycare <span className="brand-highlight">Connect</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="landingNavbar" />
        <Navbar.Collapse id="landingNavbar">
          <Nav className="ms-auto landing-navbar-links">
            <Nav.Link href="#hero">Home</Nav.Link>
            <Nav.Link href="#howitworks">How It Works</Nav.Link>
            <Nav.Link href="#whoitsfor">Who It's For</Nav.Link>
            <Nav.Link href="#whychoose">Why Choose</Nav.Link>
            <Nav.Link href="#reviews">Reviews</Nav.Link>
            <Nav.Link href="#faq">FAQ</Nav.Link>
            <Nav.Link href="#whoitsfor" className="btn modern-btn-daycare animate__animated animate__fadeInRight ms-2">
              Join Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
