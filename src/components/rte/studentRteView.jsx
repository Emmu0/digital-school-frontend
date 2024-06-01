import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";
import { Helmet } from 'react-helmet';
import Main from "../layout/Main";
import PageNavigations from "../breadcrumbs/PageNavigations";
const StudentAddmissionView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentaddmission, setStudentAddmission] = useState({});
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchStudentAddmission();
  }, []);

  const fetchStudentAddmission = () => {
    async function initStudent() {
      let result = await schoolApi.fetchStudentAddmissionById(location?.state?.id);
      if (result) {
        setStudentAddmission(result);
      } else {
        setStudentAddmission({});
      }
    }
    initStudent();
  };
  const deleteStudentAddmission = async () => {
    const result = await schoolApi.deleteStudentAddmission(studentaddmission.id);
    if (result) navigate(`/studentaddmissions/`);
  };

  const editStudentAddmision = () => {
    navigate(`/studentaddmissions/${studentaddmission.id}/e`, {
      state: studentaddmission,
    });
  };
  const refresh = () => {
    fetchStudentAddmission();
  };
  const handleCancel = async (e) => {
    navigate('/rte');
}
  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <PageNavigations listName="Admissions List" listPath="/studentaddmissions" colLg={2} colClassName="d-flex mx-5 mb-4" extrColumn={12} />
      <div>
        {studentaddmission && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteStudent={deleteStudentAddmission}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="student"
              />
            )}
            <Row className="view-form">
              <Col lg={12}>
                <Row className="view-form-header align-items-center mx-2">
                  <Col lg={3}>
                    <h5>Student Addmission</h5>
                    <h5>{studentaddmission.studentname}</h5>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editStudentAddmision(true)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={handleCancel}
                   >
                      Cancel
                  </Button>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Col className="mx-3">
                      <Col className="section-header my-3">
                        <span style={{ color: "black" }}>
                          Student Information
                        </span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Student Name</label>
                    <span>{studentaddmission.studentname}</span>
                  </Col>
                  <Col lg={3}>
                    <label>Class Name</label>
                    <span>{studentaddmission.classname}</span>
                  </Col>
                  <Col lg={3}>
                    <label>Date of Addmission</label>
                    <span>
                      {moment(studentaddmission.dateofaddmission).format(
                        "DD-MM-YYYY"
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Year</label>
                    <span>{studentaddmission.year}</span>
                  </Col>
                  <Col lg={3}>
                    <label>Parent Name</label>
                    <span>{studentaddmission.parentname}</span>
                  </Col>
                </Row>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        )}
      </div>
    </Main>
  );
};
export default StudentAddmissionView;
