import React, { useState, useEffect } from "react";
import { NavigationBar, NavigationBarForHome } from "../common";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SignInQuestions = () => {
  let history = useHistory();
  const [question, setQuestion] = useState();
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const username = localStorage.getItem("username");
    setUsername(username);
    fetch(
      "https://us-central1-severless-assignments.cloudfunctions.net/mediator-function",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: "get_question", username: username }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 1) {
          setQuestion(r.question);
          setLoading(false);
        } else alert("error");
      });
  }, []);

  const [answer, setAnswer] = useState();
  const [validated, setValidated] = useState(false);

  const handleSignIn = (event) => {
    console.log(username, answer);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
    }
    setValidated(true);
    fetch(
      "https://us-central1-severless-assignments.cloudfunctions.net/mediator-function",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "verify_answer",
          username: username,
          answer: answer,
        }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 1) history.push("/dashboard");
        else alert("Please provide correct answer");
      });
    event.stopPropagation();
    event.preventDefault();
  };
  const renderContent = () => {
    if (loading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else {
      return (
        <Card body outline color="success" className="mx-auto my-5">
          <Form noValidate validated={validated} onSubmit={handleSignIn}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{question}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
        </Card>
      );
    }
  };
  return (
    <>
      <NavigationBarForHome />
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">{renderContent()}</Col>
        </Row>
      </Container>
    </>
  );
};

export default SignInQuestions;
