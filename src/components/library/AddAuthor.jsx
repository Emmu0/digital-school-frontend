import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Modal, Button } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAuthor = (props) => {
  const [rowRecord, setRowRecord] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    if (props?.parent?.id) {
      setRowRecord(props?.parent);
    }
  }, []);

  const handleChange = (e) => {
    setRowRecord({ ...rowRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getAllAuthors = await schoolApi.getAuthorsRecords();

    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        name: rowRecord.name,
        status: rowRecord.status,
      };

      if ((editRecord.name && editRecord.name.trim() !== "") && (editRecord.status && editRecord.status.trim() !== "")) {
        const existingAuthor = getAllAuthors?.find(author => author.name === editRecord.name && author.id !== editRecord.id);
        if (existingAuthor) {
          toast.error("Authors with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.updateAuthor(editRecord);
          if (response.success) {
            toast.success(response.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            recordSaveSuccesfully();
          } else {
            toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
          }
        }
      } else {
        toast.error("Required field missing!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      if (
        rowRecord.name &&
        rowRecord.name.trim() !== "" &&
        rowRecord.status &&
        rowRecord.status.trim() !== ""
      ) {

        const existingAuthor = getAllAuthors?.find(author => author.name === rowRecord.name && author.id !== rowRecord.id);
        if (existingAuthor) {
          toast.error("Authors with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.createAuthor(rowRecord);
          if (response) {
            toast.success("Record saved successfully!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            recordSaveSuccesfully();
          } else {
            toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
          }
        }
      } else {
        toast.error("Required field missing!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const recordSaveSuccesfully = () => {
    props.recordSaveSuccesfully();
  };

  return (
    <Modal
      show={props.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Author Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="view-form">
          <Row>
            <Col lg={12}>
              <Form noValidate>
                <Row className="pb-4">
                  <Col lg={6}>
                    <Form.Group className="my-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Name
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={rowRecord.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Status
                      </Form.Label>
                      <Form.Select
                        required
                        name="status"
                        value={rowRecord.status}
                        onChange={handleChange}
                      >
                        <option value="">None</option>
                        <option value="Active">Active</option>
                        <option value="In Active">In Active</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          {props?.parent?.id ? 'Update' : 'Save'}
        </Button>
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};
export default AddAuthor;