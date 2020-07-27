import React, { useState } from "react";
import { NavigationBar } from "./common";
import Axios from "axios";
import {
  Container,
  Row,
  Card,
  Button,
  Col,
  Spinner,
  ListGroup,
  Jumbotron,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
const DashbordScreen = () => {
  const [message, setMessage] = useState();
  const [isLoadingTagJson, setisLoadingTagJson] = useState(false);
  const history = useHistory();
  const tagJson = () => {
    fetch(
      "https://us-central1-serverless-project-283900.cloudfunctions.net/ingestChat"
    )
      .then((response) => response.json())
      .then((r) => {
        if (r.message === "OK") {
          return fetch(
            "https://so0wlri1tb.execute-api.us-east-1.amazonaws.com/tagjson/"
          );
        } else {
          setisLoadingTagJson(false);
          alert("Error in tagging json files try again in sometimes.");
        }
      })
      .then((r) => r.json())
      .then((r) => {
        setisLoadingTagJson(false);
        alert(r.body);
      });
  };
  const renderSpinner = () => {
    if (isLoadingTagJson) {
      return (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Jumbotron>
          <h2>Welcome to DALServerlessLMS</h2>
        </Jumbotron>

        <Row className="justify-content-xs-left">
          <Col xs="auto">
            <Card body outline>
              <h2> Data Processing module </h2>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      window.location.assign(
                        "https://wordcloud-y6r2d6i6oa-uk.a.run.app"
                      );
                    }}
                  >
                    Go to Process Data page
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      window.location.assign(
                        "https://analysefile-y6r2d6i6oa-uk.a.run.app"
                      );
                    }}
                  >
                    Go to Analyse Data page
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  {" "}
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      setisLoadingTagJson(true);
                      tagJson();
                    }}
                  >
                    {renderSpinner()} Tag chat Json
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col xs="auto">
            <Card body outline>
              <h2> Discussion module </h2>
              <ListGroup variant="flush">
                
                <ListGroup.Item>
                  <Button
                  onClick={async () => {
                    const sessionName  = await Axios.post("https://us-central1-rapid-rarity-278219.cloudfunctions.net/getSessionName")
                    if(sessionName.data.toString() === "-1"){
                        console.log("No session")
                        window.location.assign(
                          "/discuss?s=1"
                        );
                    }else{
                        console.log("hello "+sessionName.data)
                        window.location.assign(
                          "/discuss?s=2"
                        );
                    }
                  }}
                  >
                     Start discussion module
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default DashbordScreen;
