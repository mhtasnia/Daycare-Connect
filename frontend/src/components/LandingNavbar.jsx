import { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/LandingNavbar.css";

function LandingNavbar() {
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "howitworks",
        "whoitsfor",
        "whychoose",
        "reviews",
        "faq",
      ];
      let found = false;
      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 90 && rect.bottom >= 90 && !found) {
            document
              .querySelectorAll(".landing-navbar-links .nav-link")
              .forEach((link) => {
                link.classList.toggle(
                  "active",
                  link.getAttribute("href") === `#${id}`
                );
              });
            found = true;
          }
        }
      }
      if (!found) {
        document
          .querySelectorAll(".landing-navbar-links .nav-link")
          .forEach((link) => {
            link.classList.remove("active");
          });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className="landing-navbar shadow-sm animate__animated animate__fadeInDown"
      bg="white"
      variant="light"
      fixed="top"
    >
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
            <NavDropdown
              title="Parent"
              id="parent-dropdown"
              className="parent-dropdown"
            >
              <NavDropdown.Item as={Link} to="/parent">
                Parent Portal
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/parent/register">
                Register as Parent
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/parent/login">
                Parent Login
              </NavDropdown.Item>
            </NavDropdown>
<<<<<<< HEAD
            <Nav.Link href="#provider" className="provider-link">
              Provider
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parent"
              className="btn modern-btn-daycare animate__animated animate__fadeInRight ms-2"
=======
            <NavDropdown
              title="Daycare Provider"
              id="daycare-dropdown"
              className="daycare-dropdown ms-2"
>>>>>>> 7f034523dd7cb1b2d82f3fdbe5ee6cd9c04d6d14
            >
              <NavDropdown.Item as={Link} to="/daycare">
                Daycare Portal
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/daycare/register">
                Register as Daycare
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/daycare/login">
                Daycare Login
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
