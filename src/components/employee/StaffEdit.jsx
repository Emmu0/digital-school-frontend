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
import CityState from "../../constants/CityState.json";
import * as constants from "../../constants/CONSTANT";
import Select from "react-select";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffEdit = (props) => {
  console.log("StaffEdit props", props);
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  //const [contact, setContact] = useState(location.state);
  const [contact, setContact] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [states, setStates] = useState([]);
  const [option, setOption] = useState();
  const [optionvalue, setOptionValue] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  console.log('StaffEdit==>',cities);
  useEffect(() => {
    // Create an array of unique states
    const uniqueStates = Array.from(
      new Set(CityState.map((item) => item.state))
    ).map((state) => ({ label: state, value: state }));

    setStates(uniqueStates);
  }, [CityState]);

  console.log("props?.selectedRecordType = ", props?.selectedRecordType);

  useEffect(() => {
    console.log('Location.state==>',location.state);
    if (location?.state) {
      setContact(location?.state);
      console.log("setContact useEffect==>", contact);
    } else {
      if (location.hasOwnProperty("pathname")) {
        if (props?.selectedRecordType === "driver") {
          setContact({
            ...contact,
            recordtype: "Driver",
            department: "driver",
          });
        }
      }
    }

    if (location?.state?.id) {

      console.log('Amirkhan');
      const selectedState = states.find(
        (state) => state.value === location.state.state
      );
      console.log('selectedState==>', selectedState);
      setSelectedState(selectedState);

      const filteredCities = CityState.filter(
        (item) => item.state === location.state.state
      ).map((city) => ({ label: city.name, value: city.name }));

      console.log('@#filteredCities==>',filteredCities);
      setCities(filteredCities);

      const selectedCity = filteredCities.find(
        (city) => city.value === location.state.city
      );
      setSelectedCity(selectedCity);
    } else {
      console.log('Else Part Run');
      setSelectedState(null);
      setSelectedCity(null);
      setCities([]);
    }
  }, [location, states]);

  //Add By Aamir khan 03-05-2024
  const handleStateChange = (e) => {
   
    setSelectedState(e.target.value);
    setSelectedCity(null);
    setCities(
      CityState.filter((item) => item.state === e.target.value).map(
        (city) => ({ label: city.name, value: city.name })
      )
    );
    console.log('@Cities==>',cities);
    setContact({ ...contact, state: e.target.value });
  };


  //Add by Aamir khan 07-05-2024
  const handleCityChange = (e) => {

    const selectedCity = e.target.value;
    console.log('1@#selectedCity==>',selectedCity);
    // (selectedCity);
    setContact({ ...contact, city: selectedCity });
  };


  const handleChange = (e) => {
     console.log('e.target.value ==>', e.target.value, ' e.target.name ==> ', e.target.name);
    setContact((prevContact) => ({
      ...prevContact,
      [e.target.name]: e.target.value,
      // recordtype: getRecordType(e.target.name, e.target.value),
    }));
  };

  console.log("contact field > ", contact);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Employe Page");
    if (!contact.firstname || !contact.lastname || !contact.recordtype) {
      toast.error("Fill all required fileds!!!");
      return;
    }

    if (!contact.dateofbirth) {
      toast.error("Enter date of birth!!!");
      return;
    }

    if (contact.email) {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
      if (!emailRegex.test(contact.email)) {
        toast.error("Enter valid Email!!!");
        return;
      }
    }
    console.log("contact.dateofbirth@@@@=>", contact.dateofbirth);
    const dob = new Date(contact.dateofbirth);

    if (isNaN(dob) || dob > new Date()) {
      toast.error("Enter a valid date of birth (in the past).");
      return;
    }

    if (contact.adharnumber) {
      if (contact.adharnumber.length !== 12) {
        toast.error("Enter valid aadhar number!!!");
        return;
      }
    }

    //Add by Aamir khan  03-05-2024
    if (contact.phone) {
      if (contact.phone.length !== 10) {
        toast.error("Enter ten digit phone number!!!");
        return;
      }
    }

    console.log("Contact record while save", contact);

    //========= Logic to perform Create or Edit ======
    let result2 = {};
    if (contact.id) {
      console.log("contact==>", contact);
      contact.dateofbirth = moment(contact.dateofbirth).format("YYYY-MM-DD");
      console.log("StaffEdit==>", contact);
      result2 = await schoolApi.saveContact(contact);
      console.log("result2==>", contact);

      if (result2.success) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Updated",
          message: "Record updated successfully",
        }); //Aamir khan Changes Message
        navigate(`/driver/${contact.id}`, { state: contact });
      }
    } else {
      console.log("contact create ", contact);
      result2 = await schoolApi.createContact(contact);
      console.log("Contact Result =>", result2);
      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/driver/${result2.id}`, { state: result2 });
      }
    }
    if (isValid) {
      // handle form submission logic for a valid phone number
      console.log("Phone number is valid:", phoneNumber);
    } else {
      // handle form submission logic for an invalid phone number
      console.log("Invalid phone number");
    }
  };

  const handleCancel = () => {
    if (location?.state?.id) {
      navigate("/staff/" + contact.id, { state: contact });
    } else {
      navigate("/staffs");
    }
  };
  const validatePhoneNumber = (phoneNumber) => {
    // regular expression to match a valid phone number
    const phoneRegex = /^[2-9]{1}[0-9]{9}$/;
    return phoneRegex.test(phoneNumber);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    // validate phone number using the utility function
    setIsValid(validatePhoneNumber(value));
    setContact((prevContact) => ({
      ...prevContact,
      [e.target.name]: e.target.value,
      // recordtype: getRecordType(e.target.name, e.target.value),
    }));
  };

  console.log('pawan-->', contact);
  return (
    <>
      <Main>
        <Helmet>
          {" "}
          <title>{props?.tabName}</title>{" "}
        </Helmet>
        <PageNavigations
          id={location.state?.id}
          listName={
            props?.selectedRecordType === "staff"
              ? "Create New Employee"
              : props?.selectedRecordType === "driver"
                ? "Create New Driver"
                : ""
          }
          listPath={
            location?.pathname?.split("/")[1] === "/staffs" ||
              location?.pathname?.split("/")[1] === "/driver"
              ? ""
              : "/staffs"
          }
          viewName={
            props?.selectedRecordType === "driver"
              ? "Staff View"
              : "Employee Edit"
          }
          viewPath={"/staff/" + location.state?.id}
          colLg={10}
          colClassName="d-flex px-3 py-2"
          extrColumn={2}
        />

        <Container className="view-form mb-5">
          <Row>
            <Col></Col>
            <Col lg={8}>
              <Form
                className="mt-3"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                <Row className="view-form-header align-items-center">
                  <Col lg={3}>Employee Details</Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button className="btn-sm mx-2" onClick={handleSubmit}>
                      Save
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
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label">
                        Employee Type
                      </Form.Label>
                      <Form.Select
                        required
                        name="recordtype"
                        onChange={handleChange}
                        value={contact.recordtype}
                        disabled={location.pathname === "/driver/e"}
                      >
                        <option value="">--Select Employee Type--</option>
                        <option value="Principal">Principal</option>
                        <option value="Parent">Parent</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admin">Admin</option>
                        <option value="Librarian">Librarian</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Driver">Driver</option>
                        <option value="Peon">Peon</option>
                        <option value="Security Guard">Security Guard</option>
                        <option value="PTI">PTI</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label">
                        Salutation
                      </Form.Label>
                      <Form.Select
                        name="salutation"
                        onChange={handleChange}
                        value={contact.salutation}
                      >
                        <option value="">-- Select Salutation--</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
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

                  {/* Add by Aamir khan  03-05-2024   Date of Birth*/}
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
                        name="dateofbirth"
                        placeholder="Enter Date of Birth"
                        value={
                          contact && contact.dateofbirth
                            ? moment(contact.dateofbirth).format("YYYY-MM-DD")
                            : ""
                        }
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
                        type="number"
                        name="phone"
                        placeholder="Enter Phone"
                        value={contact.phone}
                        onChange={handleInputChange}
                      />
                      {/* {!isValid && <p style={{color:"red"}}>Please enter a valid phone number.</p>} */}
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
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label">
                        Gender
                      </Form.Label>
                      <Form.Select
                        name="gender"
                        onChange={handleChange}
                        value={contact.gender}
                      >
                        <option value="">-- Select Gender--</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Add by Aamir khan 06-05-2024 */}
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label">
                        Religion
                      </Form.Label>
                      <Form.Select
                        name="religion"
                        onChange={handleChange}
                        value={contact.religion}
                      >
                        <option value="">--Select Religion--</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicQualification"
                      >
                        Qualification
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="qualification"
                        placeholder="Enter Your Qualification"
                        value={contact.qualification}
                        onChange={handleChange}
                      />{" "}
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicAdharnumber"
                      >
                        Aadhar Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="adharnumber"
                        placeholder="Enter Aadhar Number"
                        value={contact.adharnumber}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
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
                  {/* Add By Aamir khan 03-05-202   State */}
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicstate"
                      >
                        State
                      </Form.Label>

                      <Form.Select
                        name="sessionid"
                        value={contact?.state}
                        onChange={handleStateChange}
                      >
                        <option value="">-- Select Session --</option>
                        {states.map((state) => (
                          <option key={state.label} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/* Add By Aamir khan 03-05-202   City */}
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicCity">
                        City
                      </Form.Label>
                      <Form.Select
                        name="city"
                        value={contact?.city}
                        onChange={handleCityChange}
                      >
                        <option value="">-- Select City --</option>
                        {cities.map(city => (
                          <option key={city.label} value={city.value}>
                            {city.label}
                          </option>
                        ))}
                      </Form.Select>
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
                        type="number"
                        name="pincode"
                        placeholder="Enter Pincode"
                        value={contact.pincode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicCountry"
                      >
                        Country
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        placeholder="Enter your Country"
                        value={contact.country}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </Main>
    </>
  );
};

export default StaffEdit;
