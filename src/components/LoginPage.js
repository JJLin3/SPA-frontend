import React, { useState } from "react";
import { Button, Container, Form, InputGroup, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API, SIGNIN } from "../constants";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signin = async () => {
    const url = API + SIGNIN;
    try{
      const response = await axios.post(url, {username, password});
    const data = response.data;
    if (response.status === 200) {
      sessionStorage.setItem('token', data.token.access_token)
      sessionStorage.setItem('userId', data.token.user.id)
      navigate('/flightlog')
    } else {
      setError(response.message)
    }
    }catch(error){
      setError(error.message)
    }
  }

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">FlightLog Manager</Navbar.Brand>
        </Container>
      </Navbar>
      <Container id="login">
        <h1 className="my-3">Login to your account</h1>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Label>Password</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control type={togglePassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputGroup.Text id="basic-password-toggle"><FontAwesomeIcon icon={togglePassword ? "eye" : "eye-slash"} onClick={() => setTogglePassword(!togglePassword)} cursor={"pointer"} /></InputGroup.Text>
          </InputGroup>
          <Button
            variant="primary"
            onClick={async (e) => {
              setError("");
              signin()
              const canLogin = username && password;
              if (canLogin) {
                try {
                  navigate("/");
                } catch (error) {
                  setError(error.message);
                }
              } else {
                setError("Please fill in all the fields.")
              }
            }}
          >
            Login
          </Button>
        </Form>
        <p>{error}</p>
      </Container>
    </>
  );
}
