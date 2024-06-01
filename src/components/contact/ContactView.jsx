import React, { useState, useEffect } from "react";
import { Button, Card, Col, Container, Nav, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CurrencyFormat from 'react-currency-format';
import Badge from 'react-bootstrap/Badge';

const ContactView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  //const contact = location.state;
  const [contact, setContact] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchContact();
  }, []);


 

  const handleSelect = (key) => {
  }

  const fetchContact = () => {
    // Coming from Email
    if (location.hasOwnProperty('pathname')) {
      contact.id = location.pathname.split('/')[2];
    }
    async function initContact() {

      let result = await schoolApi.fetchContact(contact.id);
      if (result) {
        setContact(result);
      } else {
        setContact({});
      }
    }
    initContact();
  }

  const deleteContact = async () => {
    let recordtype = contact.recordtype
    const result = await schoolApi.deleteContact(contact.id);
    if (result.success) navigate(`/contacts/${recordtype}`);
  };

  const editContact = () => {
    navigate(`/contacts/${contact.id}/e`, { state: contact });
  };

  return (
    <div>
      {contact && <Container>
        {modalShow &&
          <Confirm
            show={modalShow}
            onHide={() => setModalShow(false)}
            deleteContact={deleteContact}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="contact"
          />}
        <Row className="view-form">
          <Col lg={12}>
            <Row className="view-form-header align-items-center mx-2">
              <Col lg={3}>
                <h5>{contact.recordtype}</h5>
                <h5>{contact.salutation} {contact.firstname} {contact.lastname}</h5>
              </Col>
              <Col lg={9} className="d-flex justify-content-end">
                <Button className="btn-sm mx-2" onClick={() => editContact(true)}>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Button>
                <Button
                  className="btn-sm"
                  variant="danger"
                  onClick={() => setModalShow(true)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "blue" }}>Personal Information</span>
                  </Col>
                </Col>
              </Col>
            </Row>
            <Row>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Name</label>
                <span>
                  {contact.salutation} {contact.firstname} {contact.lastname}
                </span>
              </Col>
              <Col lg={5}>
                <label>Phone</label>
                <span>{contact.phone}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Street</label>
                <span>{contact.street}</span>
              </Col>
              <Col lg={5}>
                <label>City</label>
                <span>{contact.city}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>State</label>
                <span>{contact.state}</span>
              </Col>
              <Col lg={5}>
                <label>Pincode</label>
                <span>{contact.pincode}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Email</label>
                <span>{contact.email}</span>
              </Col>
              <Col lg={5}>
                <label>Date of Birth</label>
                <span>{(moment(contact.dob).format('DD-MM-YYYY'))}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Marriage Anniversary</label>
                <span>{(moment(contact.anniversarydate).format('DD-MM-YYYY'))}</span>
              </Col>
              <Col lg={5}>
                <label>Comapany Name</label>
                <span>{contact.company}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Location</label>
                <span>{contact.location}</span>
              </Col>
              <Col>
              {contact.recordtype === 'Client' &&
                <Col lg={5}>
                  <label>Alternate Phone</label>
                  <span>{contact.phone2}</span>
                </Col>
              }
              {contact.recordtype === 'Dealer' &&
                <Col lg={5}>
                  <label>GST Number</label>
                  <span>{contact.gstnumberdealer}</span>
                </Col>
              }
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "blue" }}>Payment Information</span>
                  </Col>
                </Col>
              </Col>
            </Row>
          </Col>
          <Col></Col>
        </Row>
        <Card bg="light" text="light" className="mb-2 mt-4">
          <Card.Header className="d-flex justify-content-between">
            <Tabs defaultActiveKey={contact.recordtype !== 'Dealer'?"visits":"payments"} id="uncontrolled-tab-example" onSelect={(key) => handleSelect(key)}>
              {contact.recordtype !== 'Dealer' &&  (<Tab eventKey="visits" title="Visits"></Tab>)}
              <Tab eventKey="payments" title="Payments"></Tab>
              <Tab eventKey="files" title="Files"></Tab>
            </Tabs>
          </Card.Header>
          <Card.Body>
          </Card.Body>
        </Card>
      </Container>}
    </div>
  )
}
export default ContactView