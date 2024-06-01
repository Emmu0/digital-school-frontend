import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation, useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";
import PubSub from "pubsub-js";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const StudentView = (props) => {
  console.log("StudentView@@@@@@@", props);
  const location = useLocation();
  console.log("location=====?????====>", location);
  const navigate = useNavigate();
  const [lead, setLead] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);

  const handleCancel = async (e) => {
    navigate("/students");
  };

  const handleReg = async () => {
    navigate(`/student/e`, { state: lead });
  };

  const deleteLead = async () => {
    let recordtype = lead.recordtypeid;
    const result = await schoolApi.deletelead(lead.id);
    console.log('deleted lead result==========>', result);
    if (result.message === "Successfully Deleted") {
      toast.success(result.message, {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
      });
      setTimeout(() => {
        navigate(`/students`);
      }, 5000);
    }
  };

  const handleDeleteButton = () => {
    if (lead.id && lead.status === "Registered") {
      toast.error("Record is registered, you can't delete this record!", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
        hideProgressBar: true,
      });
    } else {
      setModalShow(true);
    }
  };

  const editLead = () => {
    navigate(`/studentenquiry/${lead.id}/e`, { state: lead });
  };

  return (
    <Main>
      <Helmet>
        {" "}
        <title>{props?.tabName}</title>{" "}
      </Helmet>
      <div>
        {lead && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteLead={deleteLead}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="lead"
              />
            )}
            <PageNavigations
              listName="leadList"
              listPath="/students"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />

            <Row className="view-form">
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "black" }}>Student Information</span>
                  </Col>
                </Col>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={9}>
                    <h5>{lead.recordtypeid}</h5>
                    <h5>
                      {lead.salutation} {lead.firstname} {lead.lastname}
                    </h5>
                  </Col>
                  <Col lg={3}>
                    <Button className="btn-sm" onClick={() => editLead(true)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm mx-2"
                      variant="primary"
                      onClick={handleReg}
                    >
                      Registration
                    </Button>
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={handleDeleteButton}
                    >
                      Delete
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
                <Row className="mx-2 my-2">
                  <Col lg={4} className="my-2">
                    <label>Name</label>
                    <span>
                      {lead.salutation} {lead.firstname} {lead.lastname}
                    </span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Religion</label>
                    <span>{lead.religion ? lead.religion : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Date of Birth</label>
                    <span>
                      {lead.dateofbirth ? (
                        moment(lead.dateofbirth).format("DD-MM-YYYY")
                      ) : (
                        <br />
                      )}
                    </span>
                    {/* <span>{(moment(lead.dateofbirth).format('DD-MM-YYYY'))}</span> */}
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Gender</label>
                    <span>{lead.gender ? lead.gender : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Email</label>
                    <span>{lead.email ? lead.email : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Adhar Number</label>
                    <span>{lead.adharnumber ? lead.adharnumber : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Phone</label>
                    <span>{lead.phone ? lead.phone : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Pincode</label>
                    <span>{lead.pincode ? lead.pincode : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Street</label>
                    <span>{lead.street ? lead.street : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>City</label>
                    <span>{lead.city ? lead.city : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>State</label>
                    <span>{lead.state ? lead.state : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Country</label>
                    <span>{lead.country ? lead.country : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Class Name</label>
                    <span>{lead.classname ? lead.classname : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Father Name</label>
                    <span>{lead.father_name ? lead.father_name : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Mother Name</label>
                    <span>{lead.mother_name ? lead.mother_name : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Father Qualification</label>
                    <span>
                      {lead.father_qualification ? (
                        lead.father_qualification
                      ) : (
                        <br />
                      )}
                    </span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Mother Qualification</label>
                    <span>
                      {lead.mother_qualification ? (
                        lead.mother_qualification
                      ) : (
                        <br />
                      )}
                    </span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Father Occupation</label>
                    <span>
                      {lead.father_occupation ? lead.father_occupation : <br />}
                    </span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Mother Occupation</label>
                    <span>
                      {lead.mother_occupation ? lead.mother_occupation : <br />}
                    </span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Status</label>
                    <span>{lead.status ? lead.status : <br />}</span>
                  </Col>
                  <Col lg={4} className="my-2">
                    <label>Description</label>
                    <span>{lead.description ? lead.description : <br />}</span>
                  </Col>
                  <Col></Col>
                </Row>
                <Row></Row>
              </Col>

              <Col></Col>
            </Row>
          </Container>
        )}
      </div>
      <ToastContainer />
    </Main>
  );
};

export default StudentView;
