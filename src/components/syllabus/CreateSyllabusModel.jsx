import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateSyllabusModel = (props) => {
  console.log("props--======>", props);
  const navigate = useNavigate();
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [sessionOptions, setSessionOptions] = useState([]);
  const [activeRecords, setActiveRecords] = useState([]);

  const [syllabusData, setSyllabusData] = useState({
    class_id: "",
    section_id: "",
    subject_id: "",
    session_id: "",
    isactive: "",
    description: "",
  });

  // console.log('AmirNew@#activeRecords==>',activeRecords);
  useEffect(() => {
    async function fetchAllClasses() {
      try {
       
        console.log('Colling This Part');
        
        // const result = await schoolApi.getActiveClassRecords("active"); // Add by Aamir khan 14-05-2024
        const result = await schoolApi.getSectionRecords();             // Add by Aamir khan 15-05-2024
        console.log('@@#classes==>',result);
        let ar = [];
        result.map((item) => {
          console.log("@#@##itemRecord==>",item);

          try{
            if (item.isactive == true){
              console.log("if Conditon Is excuted for Active Records ");
              var obj = {};
              obj.value = item.class_id;
              obj.label = item.class_name;
              ar.push(obj);
            }

          }
          catch (e){
            console.log('Error Pring',e);
            console.log('Print this Error');
          }
          console.log('ArrayPush==>',ar);
        });
        
        setClassOptions(ar);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
    fetchAllClasses();
  }, []);

  useEffect(() => {
    async function fetchAllSubjects() {
      try {
        const subjects = await schoolApi.fetchSubject();
        console.log("@#@subjectsSubjects==>", subjects);
        //const subjects = await schoolApi.getActiveClassRecords("active");
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
    async function fetchAllSections() {
      try {
        const sections = await schoolApi.fetchSectionRecords();
        const sectionOptions = sections.map((sec) => ({
          value: sec.section_id,
          label: sec.section_name,
        }));
        setSectionOptions(sectionOptions);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllSections();
  }, []);

  useEffect(() => {
    async function fetchAllSessions() {
      try {
        const sessions = await schoolApi.fetchSessions();
        const sessionOptions = sessions.map((sess) => ({
          value: sess.id,
          label: sess.year,
        }));
        setSessionOptions(sessionOptions);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllSessions();
  }, []);

  useEffect(() => {
    if (props.syllabusData) {
      setSyllabusData({
        class_id: props.syllabusData.class_id,
        section_id: props.syllabusData.section_id,
        subject_id: props.syllabusData.subject_id,
        session_id: props.syllabusData.session_id,
        isactive: props.syllabusData.isactive,
        description: props.syllabusData.description,
      });
    } else {
      setSyllabusData({
        class_id: "",
        section_id: "",
        subject_id: "",
        session_id: "",
        isactive: "",
        description: "",
      });
    }
  }, [props.syllabusData]);

  
  
  const handleChange = async (e) => {
    setSyllabusData({ ...syllabusData, [e.target.name]: e.target.value });

    if (e.target.name === "class_id") {
      const result = await schoolApi.fetchSectionRecordsWithClassId(e.target.value);
      let ar = [];
      result && result.map((item) => {
        console.log("@@##itemRecord==>", item);
          if (item.isactive != null && item.isactive == true) {
          if (item.class_id === e.target.value) {
            var obj = {};
            obj.value = item.section_id;
            obj.label = item.section_name;
            console.log('@#obj==>',obj);
            ar.push(obj);

          }
        }
      });
      setActiveRecords(ar);
    }
  };

  const handleSubmit = async () => {
    if (
      syllabusData.class_id &&
      syllabusData.section_id &&
      syllabusData.subject_id &&
      syllabusData.session_id
    ) {
      if (!syllabusData.isactive) {
        return toast.error("Please select status");
      }
      if (props.syllabusData) {
        try {
          const result = await schoolApi.updateSyllabus(
            props.syllabusData.id,
            syllabusData
          );
          if (result) {
            toast.success('Syllabus update successfully', {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
            });
            setTimeout(() => {
              props.handleCloseModal();
              props.fetchAllSyllabus();
              navigate('/syllabuslist');
              setSyllabusData({
                class_id: "",
                section_id: "",
                subject_id: "",
                session_id: "",
                isactive: "",
                description: "",
              });
            }, 3000);
          }
        } catch (error) {
          console.error("Error updating assignment:", error);
        }
      } else {
      
        try {
          console.log('EntersyllabusData',syllabusData);
          const result = await schoolApi.createSyllabus(syllabusData);

          console.log('@#result===>',result);
          if (result) {
            toast.success('Syllabus create successfully', {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
            });
            setTimeout(() => {
              props.handleCloseModal();
              props.fetchAllSyllabus();
              setSyllabusData({
                class_id: "",
                section_id: "",
                subject_id: "",
                session_id: "",
                isactive: "",
                description: "",
              });
            }, 3000);
          }
        } catch (error) {
          console.log('ErrorRecord==>',error);
          console.log('printError==>',error);
          console.error("Error creating assignment:",error);
        }
      }
    } else {
      return toast.error("Please fill all the required fields.");
    }
  };

  return (
    <Modal
      show={props.modalShow}
      centered
      // size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => {
        props.handleCloseModal();
        setSyllabusData({
          class_id: props.syllabusData?.class_id
            ? props.syllabusData?.class_id
            : "",
          section_id: props.syllabusData?.section_id
            ? props.syllabusData?.section_id
            : "",
          subject_id: props.syllabusData?.subject_id
            ? props.syllabusData?.subject_id
            : "",
          session_id: props.syllabusData?.session_id
            ? props.syllabusData?.session_id
            : "",
          isactive: props.syllabusData?.isactive
            ? props.syllabusData?.isactive
            : "",
          description: props.syllabusData?.description
            ? props.syllabusData?.description
            : "",
        });
      }}
    >
      <Modal.Header
        closeButton
        style={{
          // width: "20",
          maxHeight: "",
        }}
      >
        <Modal.Title>
          {props.syllabusData ? "Update Syllabus" : "Create Syllabus"}
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
                  value={syllabusData.class_id}
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
                  value={syllabusData.subject_id}
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
                <Form.Label className="form-view-label">Section</Form.Label>
                <Form.Select
                  name="section_id"
                  onChange={handleChange}
                  value={syllabusData.section_id}
                  required
                >
                  <option value="">-- Select Section --</option>
                  {activeRecords &&
                    activeRecords.map((res) => (
                      <option key={res.label} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Session</Form.Label>
                <Form.Select
                  name="session_id"
                  onChange={handleChange}
                  value={syllabusData.session_id}
                  required
                >
                  <option value="">-- Select Session --</option>
                  {sessionOptions &&
                    sessionOptions.map((res) => (
                      <option key={res.label} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mt-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Active"
                    name="isactive"
                    value="Active"
                    checked={syllabusData.isactive === "Active"}
                    onChange={(e) =>
                      setSyllabusData({ ...syllabusData, isactive: "Active" })
                    }
                    required
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Inactive"
                    name="isactive"
                    value="Inactive"
                    checked={syllabusData.isactive === "Inactive"}
                    onChange={(e) =>
                      setSyllabusData({ ...syllabusData, isactive: "Inactive" })
                    }
                    required
                  />
                </div>
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
                  value={syllabusData.description}
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
        <Button
          variant="light"
          onClick={() => {
            props.handleCloseModal();
            setSyllabusData({
              class_id: props.syllabusData?.class_id
                ? props.syllabusData?.class_id
                : "",
              section_id: props.syllabusData?.section_id
                ? props.syllabusData?.section_id
                : "",
              subject_id: props.syllabusData?.subject_id
                ? props.syllabusData?.subject_id
                : "",
              session_id: props.syllabusData?.session_id
                ? props.syllabusData?.session_id
                : "",
              isactive: props.syllabusData?.isactive
                ? props.syllabusData?.isactive
                : "",
              description: props.syllabusData?.description
                ? props.syllabusData?.description
                : "",
            });
          }}
        >
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer autoClose={4000}/>
    </Modal>
  );
};

export default CreateSyllabusModel;
