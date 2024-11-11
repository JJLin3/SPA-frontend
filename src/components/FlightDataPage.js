import { Button, Container, Form, InputGroup, Modal, Nav, Navbar, Row } from "react-bootstrap";
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from "react";
import { API, FLIGHTLOGS, SIGNOUT } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import isTokenExpired from "../sessionToken";

export default function FlightDataPage() {
    const navigate = useNavigate();
    const [allFlightLog, setAllFlightLog] = useState(null);
    const [flightLogId, setFlightLogId] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [tailNumber, setTailNumber] = useState("");
    const [flightId, setFlightId] = useState("");
    const [takeoff, setTakeoff] = useState("");
    const [landing, setLanding] = useState("");
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [show, setShow] = useState(false);
    const [buttonStatus, setButtonStatus] = useState("")

    const handleClose = () => {
        setShow(false);
        setTailNumber("");
        setFlightId("");
        setTakeoff("");
        setLanding("");
        setHours(0);
        setMinutes(0);
    };
    const handleShow = () => setShow(true);

    const headerConfig = {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")} `
        }
    };

    const signout = async () => {
        const url = API + SIGNOUT;
        const response = await axios.post(url, {}, headerConfig);
        sessionStorage.removeItem('token')
        navigate('/')
    };

    async function getAllFlightLogs() {
        try {
            const response = await axios.get(API + FLIGHTLOGS, headerConfig);
            const results = response.data;
            setAllFlightLog(results);
        } catch (error) {
            console.error(error.message);
        }
    };

    async function getFlightLog() {
        try {
            const response = await axios.get(API + FLIGHTLOGS + "/" + searchValue, headerConfig);
            const results = response.data;
            setAllFlightLog(results);
        } catch (error) {
            console.error(error.message);
        }
    };

    async function addFlightLog(duration) {
        const flightLog = { tailNumber, flightId, takeoff, landing, duration };
        try {
            await axios.post(API + FLIGHTLOGS, flightLog, headerConfig);
            handleClose();
            getAllFlightLogs();
        } catch (error) {
            console.error(error.message);
        }
    };

    async function updateFlightLog(duration) {
        const flightLog = { tailNumber, flightId, takeoff, landing, duration };
        try {
            await axios.put(API + FLIGHTLOGS + "/" + flightLogId, flightLog, headerConfig);
            handleClose();
            getAllFlightLogs();
        } catch (error) {
            console.error(error.message);
        }
    };

    async function deleteFlightLog(id) {
        try {
            const url = API + FLIGHTLOGS + "/" + id;
            await axios.delete(url, headerConfig);
            getAllFlightLogs();
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const sessionToken = sessionStorage.getItem("token");
        if (sessionToken) {
            if (isTokenExpired(sessionToken)) {
                navigate('/');
                alert('Token has expired. Please login again')
                sessionStorage.removeItem('token');
            }
        } else {
            navigate('/');
        }
        getAllFlightLogs();

    }, []);


    return (
        <>
            <Navbar variant="light" bg="light">
                <Container>
                    <Navbar.Brand>FlightLog Manager</Navbar.Brand>
                    <Nav>
                        <Nav.Link href={`/users`}>Users</Nav.Link>
                        <Nav.Link onClick={signout}>🚪</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container style={{ marginTop: "2rem" }}>
                <Row style={{ marginBottom: "2rem" }}>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" value={searchValue} placeholder="Search by flightID" onChange={(e) => setSearchValue(e.target.value)} />
                        <Button variant="primary" id="button-addon1" onClick={getFlightLog}>
                            <FontAwesomeIcon icon="search" />
                        </Button>
                    </InputGroup>
                </Row>
                <Row style={{ marginBottom: "2rem" }}>
                    <Table bordered hover responsive>
                        <thead>
                            <tr >
                                <th>#</th>
                                <th>Tail Number</th>
                                <th>Flight ID</th>
                                <th>Takeoff</th>
                                <th>Landing</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allFlightLog ? allFlightLog.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.tailNumber}</td>
                                    <td>{item.flightId}</td>
                                    <td>{item.takeoff}</td>
                                    <td>{item.landing}</td>
                                    <td>{item.duration}</td>
                                    <td>
                                        <div className="d-flex justify-content-around">
                                            <FontAwesomeIcon
                                                icon={"pen-to-square"}
                                                onClick={() => {
                                                    handleShow();
                                                    setButtonStatus("update");
                                                    setFlightLogId(item.id);
                                                    setTailNumber(item.tailNumber);
                                                    setFlightId(item.flightId);
                                                    setTakeoff(item.takeoff);
                                                    setLanding(item.landing);
                                                    setHours(item.duration.split(" ")[0]);
                                                    setMinutes(item.duration.split(" ")[2]?item.duration.split(" ")[2]:0);
                                                }}
                                                cursor={"pointer"}
                                            />
                                            <FontAwesomeIcon icon={"trash"} onClick={() => { deleteFlightLog(item.id) }} cursor={"pointer"} />
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr></tr>}
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    <Button
                        onClick={() => {
                            handleShow();
                            setButtonStatus("add");
                        }}>
                        Add Flight Log
                    </Button>
                </Row>
            </Container>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{buttonStatus === "add" ? "Add New Flight Log" : "Update Flight Log"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tail Number</Form.Label>
                            <Form.Control
                                type="text"
                                value={tailNumber}
                                onChange={(e) => setTailNumber(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Flight ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={flightId}
                                onChange={(e) => setFlightId(e.target.value)}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Takeoff</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={takeoff}
                                onChange={(e) => setTakeoff(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Landing</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={landing}
                                onChange={(e) => setLanding(e.target.value)}
                            />
                        </Form.Group>

                        {/* <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </Form.Group> */}

                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    aria-label="hours"
                                    type="number"
                                    min={0}
                                    max={12}
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                />
                                <InputGroup.Text>hours</InputGroup.Text>
                                <Form.Control
                                    aria-label="minutes"
                                    type="number"
                                    min={0}
                                    max={60}
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                />
                                <InputGroup.Text>minutes</InputGroup.Text>

                            </InputGroup>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!tailNumber && !flightId && !takeoff && !landing && !hours && !minutes}
                        onClick={() => {
                            const duration = `${hours} ${hours>1?"hours":"hour"} ${minutes} ${minutes>1?"minutes":"minute"}`
                            buttonStatus === "add" ? addFlightLog(duration) : updateFlightLog(duration)
                        }
                        }>
                        {buttonStatus === "add" ? "Add" : "Update"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
