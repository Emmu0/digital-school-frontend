import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const StudentSibling = (props) => {
  console.log('StudentSibling@@@@@@', props);
  const location = useLocation();
  const navigate = useNavigate();
  const [studentSibling, setstudentSibling] = useState(location.state ? location.state : {});

  const handleCancel = async (e) => {
    navigate('/studentsiblings');
  }
  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <div>
        {studentSibling && <Container>
          <PageNavigations listName="studentSiblingList" listPath="/students" viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

          <Row className="view-form">
            <Col lg={12}>
              <Col className="mx-3">
                <Col className="section-header my-3">
                  <span style={{ color: "black" }}>sibling Information</span>
                </Col>
              </Col>
              <Row className="view-form-header align-items-center mx-3">
                <Col lg={11}>
                  <h5>{studentSibling.recordtypeid}</h5>
                  <h5>{studentSibling.salutation} {studentSibling.firstname} {studentSibling.lastname}</h5>
                </Col>
                <Col lg={1}>
                  <Button
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
              <Row className="mx-2 my-2">
                <Col lg={4} className="my-2">
                  <label>Name</label>
                  <span>
                    {studentSibling.salutation} {studentSibling.firstname} {studentSibling.lastname}
                  </span>
                </Col>
                <Col lg={4} className="my-2">
                  <label>Parent Phone Number</label>
                  <span>{studentSibling.contactphone}</span>
                </Col>
                <Col lg={4} className="my-2">
                  <label>Parent Name</label>
                  <span>{studentSibling.parentname}</span>
                </Col>
                <Col lg={4} className="my-2">
                  <label>City</label>
                  <span>{studentSibling.gender}</span>
                </Col>
                <Col lg={4} className="my-2">
                  <label>Date of Birth</label>
                  <span>{(moment(studentSibling.dateofbirth).format('DD-MM-YYYY'))}</span>
                </Col>
                <Col lg={4} className="my-2">
                  <label>Religion</label>
                  <span>{studentSibling.religion}</span>
                </Col>
              </Row>
              <Row>
              </Row>
            </Col>

            <Col></Col>
          </Row>

        </Container>}
      </div>
    </Main>

  )
}
export default StudentSibling