//Author - Shwetha Subash (B00852743)
//Code Reference - https://docs.amplify.aws/ui-legacy/interactions/chatbot/q/framework/react#usage

import React, { Component } from "react";
import Amplify, { Interactions } from "aws-amplify";
import { ChatBot, AmplifyTheme } from "aws-amplify-react";
import { NavigationBar } from "../common";
import { Container, Col, Row } from "react-bootstrap";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:ead50226-f0e9-438e-a0b7-73b15d5ebadc",
    region: "us-east-1",
  },
  Interactions: {
    bots: {
      LMS: {
        name: "LMS",
        alias: "Dal_LMS",
        region: "us-east-1",
      },
    },
  },
});

// Imported default theme can be customized by overloading attributes
const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: "#ff6600",
  },
};

class OnlineChat extends Component {
  handleComplete(err, confirmation) {
    if (err) {
      alert("Bot conversation failed");
      return;
    }
    // setTimeout(function(){ alert('Thanks for using Virtual Assistant!') }, 3000);
    // alert('Success: ' + JSON.stringify(confirmation, null, 2));
    alert("Thanks for using Virtual Assistant!");
    return "Thank you! what would you like to do next?";
  }

  render() {
    return (
      <>
        <NavigationBar />
        <Container fluid>
          <Row className="justify-content-md-center my-5">
            <Col md="auto">
              <ChatBot
                title="DAL LMS"
                theme={myTheme}
                botName="LMS"
                welcomeMessage="Hello! Your virtual assistant here!"
                onComplete={this.handleComplete.bind(this)}
                clearOnComplete={true}
                conversationModeOn={false}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default OnlineChat;
