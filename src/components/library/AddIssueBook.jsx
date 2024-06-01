import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Modal } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddIssueBook = (props) => {
  const [rowRecord, setRowRecord] = useState({
    parent_id: "",
    parent_type: "",
    parent_reg_id: "",
    book_id: "",
    checkout_date: "",
    due_date: "",
    return_date: "",
    status: "",
    remark: "",
  });
  const [staff, setStaff] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const staffResult = await schoolApi.fetchStaffContacts();
      let staffdemo = staffResult?.map((s) => ({
        value: s.id,
        label: s.contactno,
        staffname: s.staffname,
      }));
      setStaff(staffdemo);

      const studentResult = await schoolApi.fetchStudentAddmission();
      let studentdemo = studentResult?.map((s) => ({
        value: s.id,
        label: s.srno,
        studentname: s.studentname,
        classname: s.classname,
      }));
      setStudents(studentdemo);
      const bookResult = await schoolApi.getBooksRecords();
      const availableBooks = bookResult?.filter(
        (b) => b.status === "Active" && b.available > 0
      );
      const bookdemo = availableBooks?.map((b) => ({
        value: b.id,
        label: b.title,
      }));
      setBooks(bookdemo);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (props?.parent?.id) {
      setRowRecord(props?.parent);
    }
    setDefaultDates();
  }, []);

  const handleChange = (name, value) => {
    if (name === "parent_id") {
      const parent = students.concat(staff)?.find((item) => item.value === value);
      setRowRecord((prev) => ({
        ...prev,
        parent_id: value,
        parent_reg_id: parent ? parent.srno || parent.contactno : "",
      }));
    } else {
      setRowRecord((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setDefaultDates = () => {
    if (!props?.parent?.id) {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 10);
      setRowRecord({
        ...rowRecord,
        checkout_date: today.toISOString().split("T")[0],
        due_date: dueDate.toISOString().split("T")[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    // if (!rowRecord.parent_id || !rowRecord.book_id) {
    //   setIsRequired(true);
    //   toast.error("Required field missing!", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   return;
    // }

    e.preventDefault();
    if (props?.parent?.id) {
      const editRecord = {
        id: props?.parent?.id,
        parent_id: rowRecord.parent_id,
        parent_type: rowRecord.parent_type,
        book_id: rowRecord.book_id,
        checkout_date: rowRecord.checkout_date,
        due_date: rowRecord.due_date,
        return_date: rowRecord.return_date,
        status: rowRecord.status,
        remark: rowRecord.remark,
      };

      if (
        editRecord.parent_id &&
        editRecord.parent_id.trim() !== "" &&
        editRecord.book_id &&
        editRecord.book_id.trim() !== "" &&
        editRecord.status !== "Issued"
      ) {
        if (
          editRecord.status === "Returned" &&
          (!editRecord.return_date || editRecord.return_date.trim() === "")
        ) {
          toast.error("Return date is required for status 'Returned'", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          let response = {};
          response = await schoolApi.updateIssue(editRecord);
          if (response.success) {
            toast.success(response.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
            recordSaveSuccesfully();
          } else {
            setIsRequired(true)
            toast.error(response.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      } else {
        setIsRequired(true)
        toast.error("Required field missing!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      if (props?.bookId) rowRecord['book_id'] = props.bookId

      if (
        rowRecord.parent_id &&
        rowRecord.parent_id.trim() !== "" &&
        rowRecord.book_id &&
        rowRecord.book_id.trim() !== ""
      ) {
        rowRecord.status = "Issued";
        let response = await schoolApi.createIssue(rowRecord);
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
    <>
      <Modal
        show={props.show}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        onHide={props.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Issue Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="view-form">
            <Row>
              <Col lg={12}>
                <Form noValidate>
                  <Row className="pb-4">
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="mt-3">
                          <Form.Label
                            className="form-view-label"
                            htmlFor="formBasicFirstName"
                          >
                            Type
                          </Form.Label>
                          <Form.Select
                            className="book_and_isuue_input"
                            required
                            name="parent_type"
                            value={rowRecord.parent_type}
                            onChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          >
                            <option value="">None</option>
                            <option value="Student">Student</option>
                            <option value="Staff">Staff</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group>
                          <Form.Label>Registration Number (Name)</Form.Label>
                          <Select
                            name="parent_id"
                            placeholder="Select a Reg No"
                            value={
                              rowRecord?.parent_id
                                ? {
                                  value: rowRecord.parent_id,
                                  label: (() => {
                                    if (rowRecord.parent_type === "Student") {
                                      const student = students?.find((s) => s.value === rowRecord.parent_id);
                                      return `${student?.label || ''}${student?.studentname ? ` (${student.studentname})` : ''}`;
                                    } else if (rowRecord.parent_type === "Staff") {
                                      const staffMember = staff?.find((s) => s.value === rowRecord.parent_id);
                                      return `${staffMember?.label || ''}${staffMember?.staffname ? ` (${staffMember.staffname})` : ''}`;
                                    } else {
                                      return "";
                                    }
                                  })(),
                                }
                                : ""
                            }
                            onChange={(selectedOption) =>
                              handleChange(
                                "parent_id",
                                selectedOption ? selectedOption.value : null
                              )
                            }
                            options={
                              rowRecord.parent_type === "Student"
                                ? students?.map(student => ({
                                  value: student.value,
                                  label: `${student.label}${student.studentname ? ` (${student.studentname})` : ''}`
                                }))
                                : rowRecord.parent_type === "Staff"
                                  ? staff?.map(staffMember => ({
                                    value: staffMember.value,
                                    label: `${staffMember.label}${staffMember.staffname ? ` (${staffMember.staffname})` : ''}`
                                  }))
                                  : []
                            }
                          />
                          {isRequired && !rowRecord.parent_id && (
                            <p style={{ color: "red" }}>Please select a Reg No</p>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <Form.Group>
                          <Form.Label>Book</Form.Label>

                          {props.bookId &&
                            <Select
                              required
                              placeholder="Select a Book"
                              name="book_id"

                              value={props.bookId &&
                              {
                                value: props.bookId,
                                label: books?.find((b) => b.value === props.bookId)?.label,
                              }
                              }
                              onChange={(selectedOption) =>
                                handleChange(
                                  "book_id",
                                  selectedOption ? selectedOption.value : null
                                )
                              }
                              options={books}
                              isDisabled={props.bookId}
                            />
                          }
                          {!props.bookId &&
                            <Select
                              required
                              placeholder="Select a Book"
                              name="book_id"
                              value={
                                props.parent?.id
                                  ? {
                                    value: props.parent?.book_title,
                                    label: props.parent?.book_title,
                                  }
                                  : rowRecord?.book_id
                                    ? {
                                      value: rowRecord.book_id,
                                      label: books?.find(
                                        (b) => b.value === rowRecord.book_id
                                      )?.label,
                                    }
                                    : ""
                              }
                              onChange={(selectedOption) =>
                                handleChange(
                                  "book_id",
                                  selectedOption ? selectedOption.value : null
                                )
                              }
                              options={books}
                            />
                          }
                          {isRequired && !rowRecord.book_id && (
                            <p style={{ color: "red" }}>Please select a Book</p>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="my-3">
                          <Form.Label
                            className="form-view-label"
                            htmlFor="formBasicFirstName"
                          >
                            Checkout Date
                          </Form.Label>
                          <Form.Control
                            className="book_and_isuue_input"
                            type="date"
                            name="checkout_date"
                            placeholder="Checkout Date"
                            value={rowRecord.checkout_date}
                            onChange={(e) =>
                              handleChange("checkout_date", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="my-3">
                          <Form.Label
                            className="form-view-label"
                            htmlFor="formBasicFirstName"
                          >
                            Due Date
                          </Form.Label>
                          <Form.Control
                            className="book_and_isuue_input"
                            type="date"
                            name="due_date"
                            placeholder="Due Date"
                            value={rowRecord.due_date}
                            onChange={(e) =>
                              handleChange("due_date", e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      {props?.parent?.id && (
                        <Col lg={6}>
                          <Form.Group className="my-3">
                            <Form.Label
                              className="form-view-label"
                              htmlFor="formBasicFirstName"
                            >
                              Return Date
                            </Form.Label>
                            <Form.Control
                              className="book_and_isuue_input"
                              required
                              type="date"
                              name="return_date"
                              placeholder="Return Date"
                              value={rowRecord.return_date}
                              onChange={(e) =>
                                handleChange("return_date", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {props?.parent?.id && (
                        <Col lg={6}>
                          <Form.Group className="my-3">
                            <Form.Label
                              className="form-view-label"
                              htmlFor="formBasicFirstName"
                            >
                              Status
                            </Form.Label>
                            <Form.Select
                              className="book_and_isuue_input"
                              required
                              name="status"
                              value={rowRecord.status}
                              onChange={(e) =>
                                handleChange("status", e.target.value)
                              }
                              placeholder="Status"
                            >
                              <option value="Issued">Issued</option>
                              <option value="Returned">Returned</option>
                              <option value="Missing">Missing</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                    <Col lg={12}>
                      <Form.Group className="my-3">
                        <Form.Label
                          className="form-view-label"
                          htmlFor="formBasicFirstName"
                        >
                          Remark
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="remark"
                          placeholder="Remark"
                          value={rowRecord.remark}
                          onChange={(e) =>
                            handleChange("remark", e.target.value)
                          }
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
          {props?.parent?.id && (
            <Button variant="success" onClick={handleSubmit}>
              Update
            </Button>
          )}
          {!props?.parent?.id && (
            <Button variant="success" onClick={handleSubmit}>
              Issued
            </Button>
          )}
          <Button onClick={props.onHide} variant="light">
            Close
          </Button>
        </Modal.Footer>
        <ToastContainer />
      </Modal>
    </>
  );
};
export default AddIssueBook;