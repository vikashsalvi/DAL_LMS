import React, { useEffect, useState } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
const NavigationBar = () => {
  const history = useHistory();
  const [email, setEmail] = useState();
  useEffect(() => {
    const email = localStorage.getItem("email");
    setEmail(email);
  }, []);

  const handleSignout = (username) => {
    fetch(
      "https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/sign_out",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 1) {
          localStorage.removeItem("username");
          history.replace("/");
        } else {
          alert(r["error"]);
        }
      });
  };

  const renderLoginControls = () => {
    const username = localStorage.getItem("username");
    if (username !== undefined && username !== null) {
      return (
        <NavDropdown title={email}>
          <NavDropdown.Item href="#" onClick={() => handleSignout(username)}>
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
      <Navbar.Brand href="/dashboard">DalServerlessLMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/dashboard">Home</Nav.Link>
          <Nav.Link href="/chatbot">Assistance</Nav.Link>
          <Nav.Link href="/discuss">Discussion</Nav.Link>
        </Nav>
        {renderLoginControls()}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
