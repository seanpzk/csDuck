import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ShowTaskInfo(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="outline"
        style={{
          color: "#555",
          borderColor: "#f5f5f5",
          fontFamily: "courier, monospace",
          fontSize: "calc(3px + 0.7vw)",
          fontWeight: "bold",
        }} // this is to camouflage the border
        onClick={handleShow}
      >
        {props.task.name}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.task.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.task.description}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowTaskInfo;
