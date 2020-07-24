import React, { useState } from "react";
import { NavigationBar } from "../common";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Signin = () => {
  let history = useHistory();
  const [signInData, setSignInData] = useState({
    email: "",
    organization: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const handleChange = (key, value) => {
    setSignInData({ ...signInData, [key]: value });
  };

  const handleSignIn = (event) => {
    const username = signInData["email"] + "_" + signInData["organization"];
    console.log(username, signInData["password"]);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
    }
    setValidated(true);
    fetch(
      "https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/sign_in",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: signInData["password"],
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 1) {
          localStorage.setItem("username", username);
          localStorage.setItem("email", signInData["email"]);
          history.push("signin_questions");
        }else{
          alert(r['error'])
        }
      });
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card body outline color="success" className="mx-auto my-5">
              <Form noValidate validated={validated} onSubmit={handleSignIn}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={signInData.email}
                    onChange={(e) => {
                      handleChange("email", e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Organization: e.g. DAL, SMU"
                    value={signInData.organization}
                    onChange={(e) => {
                      handleChange("organization", e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={signInData.password}
                    onChange={(e) => {
                      handleChange("password", e.target.value);
                    }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Sign In
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signin;
