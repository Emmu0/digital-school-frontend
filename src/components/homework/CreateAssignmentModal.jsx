import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';

const CreateAssignmentModal = (props) => {

  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [assignmentData, setAssignmentData] = useState({
    class_id: "",
    subject_id: "",
    date: "",
    status: "",
    title: "",
    description: "",
  });
  const [assignmentStatus, setAssignmentStatus] = useState([
    { value: "assigned", label: "Assigned" },
    { value: "inprogress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    // { value: "onhold", label: "On Hold" },
    // { value: "postponed", label: "Postponed" },
    { value: "cancelled", label: "Cancelled" },
  ]);

  useEffect(() => {
    async function fetchAllClasses() {
      try {
        const classes = await schoolApi.fetchClasses();
        const classOptions = classes.map((cls) => ({
          value: cls.id,
          label: cls.classname,
        }));
        setClassOptions(classOptions);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
    fetchAllClasses();
  }, []);
  console.log("setClassOptions ", classOptions);

  useEffect(() => {
    async function fetchAllSubjects() {
      try {
        const subjects = await schoolApi.fetchSubject();
        const subjectOptions = subjects.map((sub) => ({
          value: sub.id,
          label: sub.name,
        }));
        setSubjectOptions(subjectOptions);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllSubjects();
  }, []);

  useEffect(() => {
    if (props.assignData) {
      setAssignmentData({
        class_id: props.assignData.class_id,
        subject_id: props.assignData.subject_id,
        date: props.assignData.date,
        status: props.assignData.status,
        title: props.assignData.title,
        description: props.assignData.description,
      });
    } else {
      setAssignmentData({
        class_id: "",
        subject_id: "",
        date: "",
        status: "",
        title: "",
        description: "",
      });
    }
  }, [props.assignData]);

  const handleChange = (e) => {
    setAssignmentData({ ...assignmentData, [e.target.name]: e.target.value });
    console.log("setAssignmentData ======>", assignmentData);
  };

  const handleStatusChange = (selectedOption) => {
    setAssignmentData({ ...assignmentData, status: selectedOption.value });
  };

  const handleSubmit = async () => {
    if (assignmentData.class_id && assignmentData.title && assignmentData.subject_id && assignmentData.status && assignmentData.date) {
      if (props.assignData) {
        try {
          const result = await schoolApi.updateAssignment(
            props.assignData.id,
            assignmentData
          );
          if (result.message === 'This record already exists') {
            return toast.error(result.message);
          }
          if (result) {
            props.handleCloseModal();
            props.fetchAllAssignments();
            setAssignmentData({
              class_id: "",
              subject_id: "",
              date: "",
              status: "",
              title: "",
              description: "",
            });
          }
        } catch (error) {
          console.error("Error updating assignment:", error);
        }
      } else {
        try {
          const result = await schoolApi.createAssignment(assignmentData);
          if (result.message === 'This record already exists') {
            return toast.error(result.message);
          }
          if (result) {
            props.handleCloseModal();
            props.fetchAllAssignments();
            setAssignmentData({
              class_id: "",
              subject_id: "",
              date: "",
              status: "",
              title: "",
              description: "",
            });
          }
        } catch (error) {
          console.error("Error creating assignment:", error);
        }
      }

    } else {
      return toast.error('Please fill all the required fields.');
    }
  };

  //   const handleUpdate = async () => {
  //     try {
  //       const result = await schoolApi.updateAssignment(props.assignData.id, assignmentData);
  //       if (result) {
  //         props.handleCloseModal();
  //         props.fetchAllAssignments();
  //       }
  //     } catch (error) {
  //       console.error('Error updating assignment:', error);
  //     }
  //   };

  return (
    <Modal
      show={props.modalShow} centered
      // size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => {
        props.handleCloseModal();
        setAssignmentData({
          class_id: props.assignData.class_id ? props.assignData.class_id : '',
          subject_id: props.assignData.subject_id ? props.assignData.subject_id : '',
          date: props.assignData.date ? props.assignData.date : '',
          status: props.assignData.status ? props.assignData.status : '',
          title: props.assignData.title ? props.assignData.title : '',
          description: props.assignData.description ? props.assignData.description : '',
        });
      }}
    >
      <Modal.Header closeButton style={{
        // width: "20", 
        maxHeight: "",
      }}>
        <Modal.Title>
          {props.assignData ? "Update Assignment" : "Create Assignment"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Class</Form.Label>
                <Form.Select
                  name="class_id"
                  onChange={handleChange}
                  value={assignmentData.class_id}
                  required
                >
                  <option key="default" value="">
                    -- Select Class --
                  </option>
                  {classOptions &&
                    classOptions.map((res) => (
                      <option key={res.value} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Subject</Form.Label>
                <Form.Select
                  name="subject_id"
                  onChange={handleChange}
                  value={assignmentData.subject_id}
                  required
                >
                  <option key="default" value="">
                    -- Select Subject --
                  </option>
                  {subjectOptions &&
                    subjectOptions.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  placeholder="Select date"
                  value={assignmentData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Status</Form.Label>
                <Form.Select
                  name="status"
                  onChange={handleChange}
                  value={assignmentData.status}
                  required
                >
                  <option value="">-- Select Status --</option>
                  {assignmentStatus &&
                    assignmentStatus.map((res) => (
                      <option key={res.label} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  required
                  placeholder="Enter title"
                  value={assignmentData.title}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  placeholder="Enter description"
                  value={assignmentData.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          {props.btnName}
        </Button>
        <Button variant="light" onClick={() => {
          props.handleCloseModal();
          setAssignmentData({
            class_id: props.assignData.class_id ? props.assignData.class_id : '',
            subject_id: props.assignData.subject_id ? props.assignData.subject_id : '',
            date: props.assignData.date ? props.assignData.date : '',
            status: props.assignData.status ? props.assignData.status : '',
            title: props.assignData.title ? props.assignData.title : '',
            description: props.assignData.description ? props.assignData.description : '',
          });
        }}>
          Close
        </Button>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAssignmentModal;
