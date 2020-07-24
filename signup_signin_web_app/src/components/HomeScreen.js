import React from "react";
import { NavigationBar } from "./common";
import { Container } from "react-bootstrap";
const HomeScreen = () => {
    return (
        <>
            <NavigationBar />
            <Container>
                <h1>Welcome to DALServerlessLMS </h1>
            </Container>
        </>
    )
}
export default HomeScreen;