import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Book, History } from "lucide-react";
import "../styles/ParentNavbar.css";

function ParentNavbar() {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm parent-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/parent" className="fw-bold">
          Daycare <span className="brand-highlight">Connect</span> <span className="text-muted small">| Parent</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="parentNavbar" />
        <Navbar.Collapse id="parentNavbar">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/parent"
              active={location.pathname === "/parent"}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parent/booking"
              active={location.pathname.startsWith("/parent/booking")}
            >
              <Book className="me-1" size={18} />
              Booking
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parent/history"
              active={location.pathname.startsWith("/parent/history")}
            >
              <History className="me-1" size={18} />
              History
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parent/register"
              active={location.pathname.startsWith("/parent/register")}
            >
              Register
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/parent/login"
              active={location.pathname.startsWith("/parent/login")}
            >
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ParentNavbar;