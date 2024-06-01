import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const LeadStatusConfirm = (props) => {
  return (
    <>
      <Modal {...props} backdrop="static" keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.messageBody}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.leadSelected}>{props.btnLabelYes}</Button>
          <Button variant="secondary" onClick={props.onHide}> {props.btnLabelNo} </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default LeadStatusConfirm;
