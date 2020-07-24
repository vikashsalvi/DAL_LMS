import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
const NavigationBar = () => {
  const [email, setEmail] = useState();
  useEffect(() => {
    const email = localStorage.getItem("email");
    setEmail(email);
  }, []);
  const renderLoginControls = () => {
    const username = localStorage.getItem("username");
    if (username !== undefined && username !== null) {
      return (
        <NavDropdown title={email}>
          <NavDropdown.Item
            href="#"
            onClick={() => {
              localStorage.removeItem("username");
              window.location.reload(false);
            }}
          >
            Sign Out
          </NavDropdown.Item>
        </NavDropdown>
      );
    } else {
      return (
        <NavDropdown title="Sign In">
          <NavDropdown.Item href="/signin">Sign In</NavDropdown.Item>
          <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
        </NavDropdown>
      );
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">DalServerlessLMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>
        {renderLoginControls()}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
