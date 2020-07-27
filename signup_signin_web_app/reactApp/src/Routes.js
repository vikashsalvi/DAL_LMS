import React from "react";
import { Route, Switch } from "react-router-dom";
import { Signin, Signup, SignInQuestions } from "./components/authentication";
import HomeScreen from "./components/HomeScreen";
import DashboardScreen from "./components/DashboardScreen";
import OnlineChat from "./components/chat_module/ChatBot";
import Discussion from "./components/Discussion/Discussion";
import Post from "./components/Discussion/Post";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomeScreen} />
    <Route exact path="/dashboard" component={DashboardScreen} />
    <Route exact path="/signin" component={Signin} />
    <Route path="/signin_questions" component={SignInQuestions} />
    <Route path="/signup" component={Signup} />
    <Route path="/chatbot" component={OnlineChat} />
    <Route exact path="/discuss" component={Discussion} />
    <Route exact path="/post" component={Post} />
  </Switch>
);

export default Routes;
