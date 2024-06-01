import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Modal, Button } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const AddBook = (props) => {
  const [rowRecord, setRowRecord] = useState({
    title: "",
    author_id: "",
    isbn: "",
    category_id: "",
    publisher_id: "",
    publish_date: "",
    language_id: "",
    status: "",
  });
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorsResult = await schoolApi.getAuthorsRecords();
        const availableAuthors = authorsResult?.filter(
          (author) => author.status === "Active"
        );
        setAuthors(availableAuthors);

        const categoriesResult = await schoolApi.getCategoryRecords();
        setCategories(categoriesResult);

        const publishersResult = await schoolApi.getPublishersRecords();
        const availablePublishers = publishersResult?.filter(
          (publisher) => publisher.status === "Available"
        );
        setPublishers(availablePublishers);

        const languagesResult = await schoolApi.getLanguagesRecords();
        setLanguages(languagesResult);
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

    const getAllBooks = await schoolApi.getBooksRecords();

    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        title: rowRecord.title,
        author_id: rowRecord.author_id,
        isbn: rowRecord.isbn,
        category_id: rowRecord.category_id,
        publisher_id: rowRecord.publisher_id,
        publish_date: rowRecord?.publish_date,
        language_id: rowRecord.language_id,
        status: rowRecord.status,
      };

      if (
        editRecord.title &&
        editRecord.title.trim() !== "" &&
        editRecord.author_id &&
        editRecord.author_id.trim() !== "" &&
        editRecord.status &&
        editRecord.status.trim() !== ""
      ) {

        const existingBook = getAllBooks?.find(book => book.title === editRecord.title && book.id !== editRecord.id);
        if (existingBook) {
          toast.error("Book with this title already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.updateBookRecord(editRecord);
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
      if (props?.category) rowRecord['category_id'] = props.category
      if (props?.author) rowRecord['author_id'] = props.author
      if (props?.publisher) rowRecord['publisher_id'] = props.publisher
      if (props?.language) rowRecord['language_id'] = props.language /* Add by Abhishek  */

      if (rowRecord.publish_date === '') {
        rowRecord['publish_date'] = null
      }
      if (
        rowRecord.title &&
        rowRecord.title.trim() !== "" &&
        rowRecord.author_id &&
        rowRecord.author_id.trim() !== "" &&
        rowRecord.category_id &&
        rowRecord.category_id.trim() !== "" &&
        rowRecord.publisher_id &&
        rowRecord.publisher_id.trim() !== "" &&
        rowRecord.language_id &&
        rowRecord.language_id.trim() !== "" &&
        rowRecord.status &&
        rowRecord.status.trim() !== ""
      ) {
        const existingBook = getAllBooks?.find(book => book.title === rowRecord.title && book.id !== rowRecord.id);
        if (existingBook) {
          toast.error("Book with this title already exists!", { position: toast.POSITION.TOP_RIGHT });
        } else {
          let response = await schoolApi.addBookRecord(rowRecord);
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
      size="lg"
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Book Record
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
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Book Name
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="title"
                        placeholder="--Book Name--"
                        value={rowRecord.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Author Name</Form.Label>
                      <Form.Select
                        name="author_id"
                        value={props?.author ? props.author : rowRecord.author_id}
                        onChange={handleChange}
                        required
                        disabled={props.author}
                      >
                        <option value="">--Select an Author--</option>
                        {authors?.map((author) => (
                          <option key={author.id} value={author.id}>
                            {author.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Book Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="isbn"
                        placeholder="--Enter Book Number--"
                        value={rowRecord.isbn}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category_id"
                        value={props?.category ? props.category : rowRecord.category_id}
                        onChange={handleChange}
                        required
                        disabled={props.category}
                      >
                        <option value="">--Select a Category--</option>
                        {categories?.map((category) => (
                          <option key={category?.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Publisher</Form.Label>
                      <Form.Select
                        name="publisher_id"
                        value={props?.publisher ? props.publisher : rowRecord.publisher_id}
                        onChange={handleChange}
                        required
                        disabled={props.publisher}
                      >
                        <option value="">--Select a Publisher--</option>
                        {publishers?.map((publisher) => (
                          <option key={publisher?.id} value={publisher.id}>
                            {publisher.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Publish Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="publish_date"
                        value={rowRecord?.publish_date ? moment(rowRecord.publish_date).format("YYYY-MM-DD")
                          : null}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Language</Form.Label>
                      <Form.Select
                        name="language_id"
                        onChange={handleChange}
                        required
                        value={props?.language ? props.language : rowRecord.language_id} /* Add by Abhishek  */
                        disabled={props.language}    /* Add by Abhishek  */
                      >
                        <option value="">--Select a Language--</option>
                        {languages?.map((language) => (
                          <option key={language?.id} value={language.id}>
                            {language.name}
                          </option>
                        ))}
                      </Form.Select>
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
export default AddBook;