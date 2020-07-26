import React, { useEffect } from "react";
import { NavigationBarForHome } from "./common";
import { Container, Jumbotron } from "react-bootstrap";
import { useHistory } from "react-router-dom";
const HomeScreen = () => {
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("username") != null) {
      history.replace("/dashboard");
    }
  }, []);
  return (
    <>
      <NavigationBarForHome />
      <Container fluid>
        <Jumbotron>
          <h2>Welcome to DALServerlessLMS</h2>
        </Jumbotron>
      </Container>
    </>
  );
};
export default HomeScreen;
