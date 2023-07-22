import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ShowUser = (props, reactRef) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    props.setIsBioOpen(false);
    setShow(false);
  }
  const handleShow = () => {
    props.setIsBioOpen(true);
    setShow(true);
  }

  return (
    <>
      <div
        style = {{
          cursor: "pointer",
          "font-weight": "bold",
          "font-size": "1.5rem",
          "padding-left": "10%",
          "grid-area": "1 / 1 / 2 / 2" }}
        onClick={handleShow}
      >
        {props.username}
        </div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.username}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.bio}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
            {/* <Button variant="primary">Understood</Button> */}
          </Modal.Footer>
        </Modal>
    </>
  );
};

export default ShowUser;
