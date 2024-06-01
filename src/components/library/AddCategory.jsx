import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Modal } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = (props) => {
  const [rowRecord, setRowRecord] = useState({
    name: "",
    description: "",
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
    const categoriesResponse = await schoolApi.getCategoryRecords();

    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        name: rowRecord.name,
        description: rowRecord.description,
      };

      if (editRecord.name && editRecord.name.trim() !== "") {


        const existingCategory = categoriesResponse?.find(category => category.name === editRecord.name && category.id !== editRecord.id);
        if (existingCategory) {
          toast.error("Category with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.updateCategory(editRecord);
          if (response.success) {
            toast.success(response.message, { position: toast.POSITION.TOP_RIGHT });
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
      if (rowRecord.name && rowRecord.name.trim() !== "") {


        const existingCategory = categoriesResponse?.find(category => category.name === rowRecord.name);
        if (existingCategory) {
          toast.error("Category with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.createCategory(rowRecord);
          if (response) {
            toast.success("Record saved successfully!", { position: toast.POSITION.TOP_RIGHT });
            recordSaveSuccesfully();
          } else {
            toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
          }
        }
      } else {
        toast.error("Required field missing!", { position: toast.POSITION.TOP_RIGHT });
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
          Category Record
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
                    <Form.Group className="my-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Description
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={rowRecord.description}
                        onChange={handleChange}
                      />
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
export default AddCategory;