import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
const NavigationBarForHome = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">DalServerlessLMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav>
        <NavDropdown title="Sign In">
          <NavDropdown.Item href="/signin">Sign In</NavDropdown.Item>
          <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBarForHome;
