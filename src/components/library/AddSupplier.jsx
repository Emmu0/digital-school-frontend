import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Modal } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSupplier = (props) => {
  const [rowRecord, setRowRecord] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
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
    const supplierResponse = await schoolApi.getSupplierRecords();

    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        name: rowRecord.name,
        contact_person: rowRecord.contact_person,
        phone: rowRecord.phone,
        email: rowRecord.email,
        address: rowRecord.address,
        status: rowRecord.status,
      };

      if (editRecord.name && editRecord.name.trim() !== "" && editRecord.status && editRecord.status.trim() !== "") {
        const existingSupplier = supplierResponse?.find(supplier => supplier.name === editRecord.name && supplier.id !== editRecord.id);
        if (existingSupplier) {
          toast.error("Supplier with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.updateSupplier(editRecord);
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
        rowRecord.contact_person &&
        rowRecord.contact_person.trim() !== "" &&
        rowRecord.phone &&
        rowRecord.phone.trim() !== "" &&
        rowRecord.address &&
        rowRecord.address.trim() !== "" &&
        rowRecord.status &&
        rowRecord.status.trim() !== ""
      ) {
        const existingSupplier = supplierResponse?.find(supplier => supplier.name === rowRecord.name && supplier.id !== rowRecord.id);
        if (existingSupplier) {
          toast.error("Supplier with this name already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.createSupplier(rowRecord);
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
          Supplier Record
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
                        Contact Person
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="contact_person"
                        placeholder="Contact Person"
                        value={rowRecord.contact_person}
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
                        Phone
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="phone"
                        placeholder="Phone"
                        value={rowRecord.phone}
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
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={rowRecord.email}
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
                        Address
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={rowRecord.address}
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
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
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
export default AddSupplier;