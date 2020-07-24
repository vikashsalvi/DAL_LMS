import React, { useState, useEffect } from "react";
import { Form, Col, Button, Container } from "react-bootstrap";
import { NavigationBar } from "../common";
import { useHistory } from "react-router-dom";
const Signup = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    password: "",
    question: "",
    answer: "",
  });
  const [validPasswordFlag, setvalidPasswordFlag] = useState(true);
  const [confirmedPasswordFlag, setConfirmedPasswordFlag] = useState(true);
  const [validated, setValidated] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionAnswer, setQuestionAnswer] = useState([]);
  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  const checkValidPassword = (pwd) => {
    //Check for conditions here and uppdate accordingly
    setvalidPasswordFlag(true);
  };

  const fetchQuestions = () => {
    fetch(
      "https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/questions"
    )
      .then((r) => r.json())
      .then((r) => {
        setQuestions(r.questions);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSignup = (event) => {
    console.log(user);
    console.log(questionAnswer);
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
        body: JSON.stringify({ path: "sign_up", user: user }),
      }
    )
      .then((r) => r.json())
      .then((r) => {
        if(r.status === 1){
          history.push("/signin")
        }else{
          alert(r.error);
        }
      });
    event.stopPropagation();
    event.preventDefault();
  };

  const renderQuestions = () => {
    return (
      <Form.Row>
        <Form.Group as={Col} controlId="formGridLastName">
          <Form.Label>Question:</Form.Label>
          <Form.Control
            required
            as="select"
            onChange={(e) => {
              handleChange("question", e.target.value);
            }}
          >
            <option value="">Select Security question</option>
            {questions.map((question) => {
              return <option value={question.title}>{question.title}</option>;
            })}
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridLastName">
          <Form.Label>Answer:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Answer"
            value={user.answer}
            onChange={(e) => {
              handleChange("answer", e.target.value);
            }}
          />
        </Form.Group>
      </Form.Row>
    );
  };

  return (
    <>
      <NavigationBar />
      <Container>
        <Form noValidate validated={validated} onSubmit={handleSignup}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridFirstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) => {
                  handleChange("firstName", e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) => {
                  handleChange("lastName", e.target.value);
                }}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={(e) => {
                  handleChange("email", e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridOrganization">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Organization, e.g. DAL, SMU"
                value={user.organization}
                onChange={(e) => {
                  handleChange("organization", e.target.value);
                }}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                isInvalid={!validPasswordFlag}
                value={user.password}
                onChange={(e) => {
                  handleChange("password", e.target.value);
                  checkValidPassword(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setConfirmedPasswordFlag(e.target.value === user.password);
                }}
                isInvalid={!confirmedPasswordFlag}
              />
              <Form.Control.Feedback type="invalid">
                confirm password must match password
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          {renderQuestions()}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Signup;
