import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import PubSub from 'pubsub-js';
import moment from "moment";

const ContactEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [options, setOptions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  //const [contact, setContact] = useState(location.state);
  const [contact, setContact] = useState({});

  useEffect(() => {
    if (location?.state) {
      setContact(location?.state);
    } else {
      // Coming from Email
      if (location.hasOwnProperty('pathname')) {
        let recordtype = location.pathname.split('/')[2];
        setContact({ ...contact, recordtype: recordtype });
      }

    }
  }, []);


  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };


  const checkRequredFields = () => {
    if ((contact.firstname && contact.firstname.trim() !== '') && (contact.lastname && contact.lastname.trim() !== '') && (contact.phone && contact.phone.trim() !== '')) {
      return false;
    }
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkRequredFields()) {
      setValidated(true);
      return;
    }
    console.log(contact)

    //========= Logic to perform Create or Edit ======
    let result2 = {};
    if (contact.id) {
      result2 = await schoolApi.saveContact(contact);
      if (result2.success) {
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
        navigate(`/contacts/${contact.id}`, { state: contact });
      }
    } else {
      result2 = await schoolApi.createContact(contact);
      if (result2) {
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
        navigate(`/contacts/${result2.id}`, { state: result2 });
      }
    }

  };

  const handleCancel = () => {
    if (location?.state?.id) {
      navigate("/contacts/" + contact.id, { state: contact });
    } else {
      navigate('/contacts/' + contact.recordtype);
    }

  };


  return (
    <Container className="view-form">
      <Row>
        <Col></Col>
        <Col lg={8}>
          <Form className="mt-3" onSubmit={handleSubmit} noValidate validated={validated}>
            <Row className="view-form-header align-items-center">
              <Col lg={3}>
                Edit {contact?.recordtype}
              </Col>
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
              <Col lg={2}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                  >
                    Salutation
                  </Form.Label>
                  <Form.Select
                    name="salutation"
                    onChange={handleChange}
                    value={contact.salutation}
                  >
                    <option value="">-- Select --</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    First Name
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="firstname"
                    placeholder="Enter First Name"
                    value={contact.firstname}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicLastName"
                  >
                    Last Name
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="lastname"
                    placeholder="Enter Last Name"
                    value={contact.lastname}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicPhone"
                  >
                    Phone
                  </Form.Label>
                  <Form.Control
                    required
                    type="phone"
                    name="phone"
                    placeholder="Enter phone"
                    value={contact.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              {contact.recordtype === 'Client' &&
                <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicPhone2"
                    >
                      Alternate Phone
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phone2"
                      placeholder="Enter Alternate Phone"
                      value={contact.phone2}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>}
                <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicStreet"
                  >
                    Street
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    placeholder="Enter Street"
                    value={contact.street}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicCity"
                  >
                    City
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    value={contact.city}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicState"
                  >
                    State
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    placeholder="Enter State"
                    value={contact.state}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicPin"
                  >
                    Pincode
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    placeholder="Enter pincode"
                    value={contact.pincode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicBirthdate"
                  >
                    Date of Birth
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="dob"
                    placeholder="Enter Date of Birth"
                    value={contact ? moment(contact.dob).format('YYYY-MM-DD') : ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
              <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicEmail"
                  >
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={contact.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              {contact.recordtype === 'Dealer' &&
                <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="gstnumberdealer"
                    >
                      GST Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="gstnumberdealer"
                      placeholder="Enter GST Number"
                      value={contact.gstnumberdealer}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>}
            </Row>
            <Row>
              
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicMarriageAnniversary"
                  >
                    Marriage Anniversary
                  </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="anniversarydate"
                    placeholder="Enter Marriage Anniversary"
                    value={contact ? moment(contact.anniversarydate).format('YYYY-MM-DD') : ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicAccount"
                  >
                    Comany Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="Enter Company Name"
                    value={contact.company}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicPin"
                  >
                    Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    value={contact.location}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col >
        <Col></Col>
      </Row >
    </Container >
  );
};

export default ContactEdit;
