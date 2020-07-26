import React from "react";
import { Route, Switch } from "react-router-dom";
import { Signin, Signup, SignInQuestions } from "./components/authentication";
import HomeScreen from "./components/HomeScreen";
import DashboardScreen from "./components/DashboardScreen";
const Routes = () => (
  <Switch>
    <Route exact path="/" component={HomeScreen} />
    <Route exact path="/dashboard" component={DashboardScreen} />
    <Route exact path="/signin" component={Signin} />
    <Route path="/signin_questions" component={SignInQuestions} />
    <Route path="/signup" component={Signup} />
  </Switch>
);

export default Routes;
