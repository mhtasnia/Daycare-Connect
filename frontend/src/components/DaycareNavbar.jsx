import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../styles/ParentNavbar.css";

function DaycareNavbar() {
  const location = useLocation();
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm parent-navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/daycare" className="fw-bold">
          Daycare <span className="brand-highlight">Connect</span> <span className="text-muted small">| Daycare</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="daycareNavbar" />
        <Navbar.Collapse id="daycareNavbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/daycare" active={location.pathname === "/daycare"}>Home</Nav.Link>
            <Nav.Link href="#howitworks">How It Works</Nav.Link>
            <Nav.Link href="#benefits">Benefits</Nav.Link>
            <Nav.Link as={Link} to="/daycare/login" active={location.pathname === "/daycare/login"}>Login</Nav.Link>
            <Nav.Link as={Link} to="/daycare/register" active={location.pathname === "/daycare/register"}>Register as Daycare</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default DaycareNavbar;