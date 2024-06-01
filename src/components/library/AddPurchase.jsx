import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Modal, Button } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPurchase = (props) => {
  const [rowRecord, setRowRecord] = useState({
    supplier_id: "",
    book_id: "",
    quantity: "",
    date: "",
  });
  const [supplier, setSupplier] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierResult = await schoolApi.getSupplierRecords();
        const availableSuppliers = supplierResult?.filter(
          (supplier) => supplier.status === "Available"
        );
        setSupplier(availableSuppliers);

        const bookResult = await schoolApi.getBooksRecords();
        const availableBooks = bookResult?.filter(
          (book) => book.status === "Active"
        );
        setBooks(availableBooks);
      } catch (error) {
        toast.error("Failed to fetch initial data!");
      }
    };
    fetchData();
  }, []);

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
    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        supplier_id: rowRecord.supplier_id,
        book_id: rowRecord.book_id,
        quantity: rowRecord.quantity,
        date: rowRecord.date,
      };

      if (
        editRecord.supplier_id &&
        editRecord.supplier_id.trim() !== "" &&
        editRecord.book_id &&
        editRecord.book_id.trim() !== ""
      ) {
        let response = {};
        response = await schoolApi.updatePurchase(editRecord);
        if (response.success) {
          toast.success(response.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          recordSaveSuccesfully();
        } else {
          toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
        }
      } else {
        toast.error("Required field missing!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      if (props?.bookId) rowRecord['book_id'] = props.bookId
      if (props?.supplierId) rowRecord['supplier_id'] = props.supplierId

      if (
        rowRecord.supplier_id &&
        rowRecord.supplier_id.trim() !== ""
        &&
        rowRecord.book_id &&
        rowRecord.book_id.trim() !== "" &&
        rowRecord.quantity &&
        rowRecord.quantity.trim() !== "" &&
        rowRecord.date &&
        rowRecord.date.trim() !== ""
      ) {

        let response = await schoolApi.createPurchase(rowRecord);
        if (response) {
          toast.success("Record saved successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          recordSaveSuccesfully();
        } else {
          toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
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
          Purchase Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="view-form">
          <Row>
            <Col lg={12}>
              <Form noValidate>
                <Row className="pb-4">
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Supplier Name</Form.Label>
                      <Form.Select
                        name="supplier_id"
                        value={props.supplierId ? props.supplierId : rowRecord.supplier_id}
                        onChange={handleChange}
                        required
                        disabled={props.supplierId}
                      >
                        <option value="">--Select an Supplier--</option>
                        {supplier?.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Book</Form.Label>
                      <Form.Select
                        name="book_id"
                        value={props.bookId ? props.bookId : rowRecord.book_id}
                        onChange={handleChange}
                        required
                        disabled={props.bookId}
                      >
                        <option value="">--Select a Book--</option>
                        {books?.map((book) => (
                          <option key={book?.id} value={book.id}>
                            {book.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="my-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Date
                      </Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="date"
                        value={rowRecord.date}
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
                        Quantity
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={rowRecord.quantity}
                        onChange={handleChange}
                        min="1"
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
export default AddPurchase;