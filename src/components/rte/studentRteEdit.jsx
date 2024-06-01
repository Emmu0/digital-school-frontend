import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import moment from "moment";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const StudentRteEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [studentaddmissionRte, setStudentAddmissionRte] = useState({});

  let classList;
  let vehicalList;

  useEffect(() => {
    console.log('inside the useEffect==>', location.state);
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.classid;
      temp2.label = location?.state.classname;
    }
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.parentid;
      temp2.label = location?.state.parentname;
    }
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.vehicleid;
      temp2.label = location?.state.vehicle_no;
    }
    if (location.state?.id) {
      setStudentAddmissionRte(location?.state);
    }
  }, []);

  const handleChange = (e) => {
    setStudentAddmissionRte({
      ...studentaddmissionRte, [e.target.name]: e.target.value,
    });
  };
  const checkRequredFields = () => {
    if (
      studentaddmissionRte.id &&
      studentaddmissionRte.id.trim() !== ""
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkRequredFields()) {
      setValidated(true);
      return;
    }
    //========= Logic to perform Create or Edit ======
    let result2 = {};

    if (studentaddmissionRte.id) {
      result2 = await schoolApi.saveStudentAddmission(studentaddmissionRte);
      if (result2.success) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/rte/${studentaddmissionRte.id}`, {
          state: studentaddmissionRte,
        });
      }
    } else {
      result2 = await schoolApi.createStudentAddmission(studentaddmissionRte);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/studentaddmissionRtes/${result2.id}`, { state: result2 });
      }
    }
  };

  const handleCancel = () => {
    if (location?.state?.id) {
      navigate("/rte/" + studentaddmissionRte.id, {
        state: studentaddmissionRte,
      });
    } else {
      navigate("/studentRtes/");
    }
  };
  return (
    <Main>
      <Helmet><title>{props?.tabName}</title></Helmet>
      <PageNavigations id={location?.state?.id} listName="Addmissons List" listPath="/studentaddmissionRtes"
        viewName="Addmission View" viewPath={"/studentaddmissionRtes/" + location?.state?.id}
        colLg={11} colClassName="d-flex px-3 py-2" extrColumn={1} />
      <Container className="view-form">
        <Row>
          <Col></Col>
          <Col lg={10}>
            <Form
              className="mt-3"
              onSubmit={handleSubmit}
              noValidate
              validated={validated}
            >
              <Row className="view-form-header align-items-center">
                <Col lg={3}>Edit Student Rte Addmission</Col>
                <Col lg={9} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label"> Student Name </Form.Label>
                    <Form.Control type="text" name="studentname" placeholder="Enter Student Name" value={studentaddmissionRte.studentname} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label"> Class Name </Form.Label>
                    <Form.Control type="text" name="classname" placeholder="Enter Class Name" value={studentaddmissionRte.classname} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label"> Date Of Addmission </Form.Label>
                    <Form.Control
                      type="date"
                      name="dateofaddmission"
                      placeholder="Enter date of addmission"
                      value={
                        studentaddmissionRte
                          ? moment(studentaddmissionRte.dateofaddmission).format(
                            "YYYY-MM-DD"
                          )
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicAddmissionDate"
                    >
                      Year
                    </Form.Label>
                    <Form.Control type="text" name="year" placeholder="Enter Year" value={studentaddmissionRte.year} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label"> Parent Name </Form.Label>
                    <Form.Control type="text" name="parentname" placeholder="Enter Parent Name" value={studentaddmissionRte.parentname} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </Main>
  );
};

export default StudentRteEdit;
