import { Button, Container, Form, InputGroup, Modal, Nav, Navbar, Row } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { API, SIGNOUT, USERS } from "../constants";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "../sessionToken";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deleteUserId, setDeleteUserId] = useState("");
  const [show, setShow] = useState(false);
  const [togglePassword , setTogglePassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  

  const navigate = useNavigate();
  const sessionToken = sessionStorage.getItem("token");
  const handleCloseDelete = () => setShowDelete(false)
  const handleOpenDelete = (userId) => {
    setShowDelete(true)
    setDeleteUserId(userId)
  };

  const headerConfig = {
    headers: {
       Authorization: `Bearer ${sessionStorage.getItem("token")} `
    }
 };

 const signout = async() => {
    const url = API + SIGNOUT;
    const response = await axios.post(url, {}, headerConfig);
      sessionStorage.removeItem('token')
      navigate(`/`)
  };

  async function getAllUsers() {
    const url = API + USERS;
    const response = await axios.get(url, headerConfig);
    
    const result = response.data;

    let users= [];
    if(result){
      users = result.map((item)=>{
        let newObj = {};
        newObj = item;
        newObj.togglePassword = false;
        return(newObj)
      })
    }
    setUsers(users);
  };

  async function addUser() {
    const user = { username, password };
    const url = API + USERS;
    try {
      await axios.post(url, user, headerConfig);
    } catch (error) {
      console.error(error.message);
    }
    setUsername("");
    setPassword("");
    getAllUsers();
    handleClose();
  };


  async function deleteUser() {
    const url = API + USERS + '/' + deleteUserId;
    await axios.delete(url, headerConfig);
    handleCloseDelete()
    getAllUsers()
  };

  const handleClose = () =>setShow(false)

  const handleShow = () => {
    setShow(true)
    setTogglePassword(false)
  };

  useEffect(() => {
    getAllUsers()
    if (sessionToken) {
      if (isTokenExpired(sessionToken)) {
        navigate('/');
        alert('Token has expired. Please login again')
        sessionStorage.removeItem('token');
      }
    } else {
      navigate('/');
    }
  }, []);


  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand href={`/flightLog`}>FlightLog Manager</Navbar.Brand>
          <Nav>
            <Nav.Link onClick={()=>signout()}>🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>

        <Row style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users ? users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <FontAwesomeIcon icon={"trash"} onClick={() => sessionStorage.getItem("userId") === user.user_id ? "" : handleOpenDelete(user.user_id)} cursor={sessionStorage.getItem("userId") === user.user_id? "" :"pointer"} />
                    </div>
                  </td>
                </tr>
              )):<tr></tr>}
            </tbody>
          </Table>
        </Row>
        <Row>
          <Button onClick={handleShow}>Add new User</Button>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{ "Add New User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Label>Password</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control type={togglePassword ?"text":"password" }placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputGroup.Text id="basic-password-toggle"><FontAwesomeIcon icon={togglePassword?"eye":"eye-slash"} onClick={() => setTogglePassword(!togglePassword)} cursor={"pointer"} /></InputGroup.Text>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addUser}>
            {"Add User"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteUser}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
