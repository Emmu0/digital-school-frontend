import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Modal,
  Row,
  Tabs,
  Tab,
} from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";

// import CurrencyFormat from "react-currency-format";
import PubSub from "pubsub-js";
import Main from "../layout/Main";
// import { FilesCreate, RelatedListFiles } from "../file";
import { Helmet } from "react-helmet";
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  //const contact = location.state;
  const [contact, setContact] = useState(location.state ? location.state : {});
  console.log("coantactats", contact)
  const [modalShow, setModalShow] = useState(false);
  const [modalShowTaskfile, setModalShowFile] = useState(false);
  const [refreshFileList, setRefreshFileList] = useState();
  const [requiredDocuments, setrequiredDocuments] = useState({});

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = () => {
    // Coming from Email
    if (location.hasOwnProperty("pathname")) {
      contact.id = location.pathname.split("/")[2];
    }
    async function initContact() {
      let result = await schoolApi.fetchContact(contact.id);
      console.log("@Result of Staff List Single1111 =>", result);
      if (result) {
        setContact(result);
      } else {
        setContact({});
      }
    }
    initContact();
  };

  const deleteContact = async () => {
    try {
      // let recordtype = contact.recordtypeid
      const result = await schoolApi.deleteContact(contact.id);
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Deleted",
          message: "Record Deleted successfully",
        });
        navigate(`/staffs`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    // let recordtype = contact.recordtype
    // const result = await schoolApi.deleteContact(contact.id);
    // console.log('deleted result => ', result);
    // if (result) {
    //   PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Deleted', message: 'Record Deleted successfully' });
    //   navigate(`/staffs`);
    // }
  };

  const editContact = () => {
    console.log("contact@@edit=>", contact);
    navigate(`/staff/${contact.id}/e`, { state: contact });
  };

  //Added By Farhan Khan on 14-June-2023 This Method is Using to Submit Uplod File with Api Request in db.
  const submitfiles = () => {
    setModalShowFile(false);
    setRefreshFileList(Date.now());
    async function init() {
      const result = await schoolApi.createFile(contact.id);
      setrequiredDocuments(result);
    }
    init();
  };

  return (
    <Main>
      <Helmet>
        {" "}
        <title>{props?.tabName}</title>{" "}
      </Helmet>
      <div>
        {contact && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteContact={deleteContact}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="contact"
              />
            )}
            {/* Add by Aamir khan Employee View */}
            <PageNavigations
              listName="Employee View"
              listPath="/staffs"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />

            <Row className="view-form">
              <Col lg={12}>
                <Row className="view-form-header align-items-center mx-2">
                  <Col lg={3}>
                    <h5>{contact.recordtype}</h5>
                    <h5>
                      {contact.salutation} {contact.firstname}{" "}
                      {contact.lastname}
                    </h5>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editContact(true)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={() => setModalShow(true)}
                    >
                      Delete
                    </Button>
                    <ToastContainer
                      position="top-center"
                      autoClose={2000}
                      hideProgressBar
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="colored"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Col className="mx-3">
                      <Col className="section-header my-3">
                        <span style={{ color: "black" }}>Employee Details</span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                {/* ====================== Add by Aamir khan 07-05-2024 Start Code ============= */}
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Name</label>
                    <span>
                      {contact.salutation} {contact.firstname}{" "}
                      {contact.lastname}
                    </span>
                  </Col>

                  <Col lg={5}>
                    <label>Gender</label>
                    {contact.gender ? (
                      <span>{contact.gender}</span>
                    ) : (
                      <>
                        <span>
                          <br />
                        </span>
                      </>
                    )}
                  </Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Date of Birth</label>
                    {contact.dateofbirth ? (
                      <span>
                        {moment(contact.dateofbirth).format("DD-MM-YYYY")}
                      </span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  {console.log(
                    "contact.dateofbirth@@@@->",
                    contact.dateofbirth
                  )}
                  <Col lg={5}>
                    <label>Employee Type</label>
                    <span>{contact.recordtype}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>State</label>
                    {contact.state ? (
                      <span>{contact.state}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={5}>
                    <label>Pincode</label>
                    {contact.pincode ? (
                      <span>{contact.pincode}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Email</label>
                    {contact.email ? (
                      <span>{contact.email}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={5}>
                    <label>Phone</label>
                    {contact.phone ? (
                      <span>{contact.phone}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Aadhar number</label>
                    {contact.adharnumber ? (
                      <span>{contact.adharnumber}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={5}>
                    <label>Qualification</label>
                    {contact.qualification ? (
                      <span>{contact.qualification}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Religion</label>
                    {contact.religion ? (
                      <span>{contact.religion}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={5}>
                    <label>Street</label>
                    {contact.street ? (
                      <span>{contact.street}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>City</label>
                    {contact.city ? (
                      <span>{contact.city}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>

                  <Col lg={5}>
                    <label>Country</label>

                    {contact.country ? (
                      <span>{contact.country}</span>
                    ) : (
                      <span>
                        <br />
                      </span>
                    )}
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={1}></Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>

                  <Col></Col>
                </Row>
                {/* =========================== Code End ====================*/}
                <Row></Row>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        )}
      </div>
    </Main>
  );
};
export default ContactView;
