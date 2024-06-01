import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import schoolApi from "../../api/schoolApi";
import { useLocation } from "react-router-dom";
import Main from "../layout/Main";
import PubSub from "pubsub-js";
import { Helmet } from 'react-helmet';
import "../../resources/css/Student.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CityState from "../../constants/CityState.json"; 

const StudentEnquiry = (props) => {
    
    const navigate = useNavigate();
    const [optionClasses, setOptionClasses] = useState([]);
    const [lead, setlead] = useState({});
    const location = useLocation();
    const [validated, setValidated] = useState(false);
    const [states, setStates] = useState([]);   
    const [selectedState, setSelectedState] = useState(null); 
    const [selectedCity, setSelectedCity] = useState(null); 
    const [cities, setCities] = useState([]); 

    useEffect(() => {
        if (location?.state) {
            setlead(location?.state);
        } else {
            if (location.hasOwnProperty('pathname')) {
                setlead({});
            }
        }

        const uniqueStates = Array.from(
            new Set(CityState.map((item) => item.state))
        ).map((state) => ({ label: state, value: state }));

        setStates(uniqueStates);
    }, [location, CityState]);


    useEffect(() => {
        async function init() {
            let classList = await schoolApi.getActiveClassRecords();
            if (classList) {
                let ar = [];
                classList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.classname;
                    ar.push(obj);
                })
                setOptionClasses(ar);
            } else {
                setOptionClasses([]);
            }
        }
        init();
    }, []);

    // Add by Aamir khan 08-05-2024
    useEffect(() => {
        console.log('sdvsd');
        if (location?.state?.id) {
            console.log('Enter tha code');
            const selectedState = states.find(
                (state) => state.value === location.state.state
            );
            setSelectedState(selectedState);

            const filteredCities = CityState.filter(
                (item) => item.state === location.state.state
            ).map((city) => ({ label: city.name, value: city.name }));

            setCities(filteredCities);

            console.log('@#filteredCities==>', filteredCities);

            const selectedCity = filteredCities.find(
                (city) => city.value === location.state.city
            );

            setSelectedCity(selectedCity);
        } else {

            setSelectedState(null);
            setSelectedCity(null);
            setCities([]);
        }
    }, [location, states]);

    const handleChange = async (e) => {
        setlead({ ...lead, [e.target.name]: e.target.value });
    }

    //Add by Aamir khan 08-05-2024
    const handleStateChange = (e) => {
        setSelectedState(e.target.value);

        setCities(
            CityState.filter((item) => item.state === e.target.value).map(
                (city) => ({ label: city.name, value: city.name })
            )
        );
        console.log('@#Cities==>', cities);
        setlead({ ...lead, state: e.target.value });
    }

    //Add by Aamir khan 08-05-2024
    const handleCityChange = (e) => {


        const selectedCity = e.target.value;
        console.log('selectedCity==>', selectedCity);
        // (selectedCity);
        setlead({ ...lead, city: selectedCity });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (lead.firstname && lead.lastname && lead.phone && lead.class_id) {
            let result = {};
            if (lead.id) {
                console.log('lead.id====>', lead);
                result = await schoolApi.savelead(lead);
                if (result.success) {
                    // PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
                    toast.success('Record update successfully', {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                      });
                      setTimeout(() => {
                        navigate(`/students/${result.lead.resultCon.id}`, { state: lead });
                      }, 2000);
                }
            } else {
                if (Object.keys(lead).length > 0) {
                    result = await schoolApi.createlead(lead);
                    console.log('result=====-------->', result);
                    if (result) {
                        // PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record create successfully' });
                        // navigate(`/students/${result.id}`, { state: result });
                        toast.success('Record save successfully', {
                            position: toast.POSITION.TOP_CENTER,
                            hideProgressBar: true
                          });
                          setTimeout(() => {
                            navigate(`/students/${result.id}`, { state: result });
                          }, 2000);
                    }
                }
            }

        } else {
            return toast.error("Please Fill all the required fields", {
                position: toast.POSITION.TOP_CENTER,
                theme: "colored",
                hideProgressBar: true
            });
        }
    }
    const handleCancel = async (e) => {
        if (location?.state?.id) {
            navigate("/students/" + lead.id, { state: lead });
        } else {
            navigate('/students');
        }
    }

    const handlePhoneChange = (e) => {
        const inputPhone = e.target.value.replace(/\D/g, '').slice(0, 10);
        handleChange({ target: { name: 'phone', value: inputPhone } });
    };

    return (
        <>
            <Main>
                <Helmet> <title>{props?.tabName}</title> </Helmet>
                <Container className="view-form">
                    <Row>
                        <Col></Col>
                        <Col lg={8}>
                            <Form className="mt-3" onSubmit={handleSubmit} noValidate validated={validated}>
                                <Row className="view-form-header align-items-center">
                                    <Col lg={3}>
                                        Edit Lead Enquiry
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
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                First Name
                                            </Form.Label>
                                            <Form.Control required type="text" name="firstname" placeholder="Enter First Name" value={lead.firstname} onChange={handleChange} />
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
                                            <Form.Control type="text" name="lastname" placeholder="Enter Last Name" value={lead.lastname} onChange={handleChange} required />
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
                                            <Form.Control type="phone" name="phone" placeholder="Enter phone" value={lead.phone} onChange={handlePhoneChange} required />
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
                                                type="date"
                                                name="dateofbirth"
                                                placeholder="Enter Date of Birth"
                                                // value={lead ? moment(lead.dateofbirth).format('YYYY-MM-DD') : ''} 
                                                value={lead.dateofbirth}
                                                onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                name="class_id"
                                            >
                                                Class Name
                                            </Form.Label>
                                            <Form.Select required name="class_id" onChange={handleChange} value={lead.class_id}>
                                                <option value="">--Select Class--</option>
                                                {optionClasses.map((cls) => (
                                                    <option key={cls.value} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Gender
                                            </Form.Label>
                                            <Form.Select
                                                name="gender"
                                                onChange={handleChange}
                                                value={lead.gender}
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
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
                                                value={lead.email}
                                                onChange={handleChange}
                                            />
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
                                                placeholder="Enter Adhar Number"
                                                value={lead.adharnumber}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-2" controlId="formBasicsalutation">
                                            <Form.Label className="form-view-label" htmlFor="formBasicsalutation">
                                                Religion
                                            </Form.Label>
                                            <Form.Control style={{ height: "36px" }} as="select" type="text" name="religion" placeholder="Select your Religion" value={lead.religion} onChange={handleChange} >
                                                <option value="">--Select Religion--</option>
                                                <option value="Muslim">Muslim</option>
                                                <option value="Hindu">Hindu</option>
                                                <option value="Christian">Christian</option>
                                                <option value="Sikh">Sikh</option>
                                                <option value="Jain">Jain</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    {location?.state ? (<Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicStatus"
                                            >
                                                Status
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                type="text"
                                                name="status"
                                                value={lead.status}
                                                onChange={handleChange}
                                            >
                                                <option value="">--Select Status--</option>
                                                <option value="Registered">Registered</option>
                                                <option value="Not Registered">Not registered</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>) : ""}
                                    <Row />
                                    <Row className="view-form-header align-items-center mt-4" style={{ marginLeft: "4px" }}>
                                        <Col lg={3}>
                                            Address
                                        </Col>
                                    </Row>

                                    <Col lg={6}>
                                        <Form.Group className="mx-3" >
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicCountry"
                                            >
                                                Country
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="country"
                                                placeholder="Enter Country"
                                                value={lead.country}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    {/* Add By Aamir khan 03-05-202   State */}
                                    {<Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicstate"
                                            >
                                                State
                                            </Form.Label>

                                            <Form.Select
                                                name="state"
                                                value={lead?.state}
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
                                    </Col>}

                                    {/* Add By Aamir khan 08-05-2024*/}
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label className="form-view-label" htmlFor="formBasicCity">
                                                City
                                            </Form.Label>
                                            <Form.Select
                                                name="city"
                                                value={lead?.city}
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
                                                htmlFor="formBasicStreet"
                                            >
                                                Street
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="street"
                                                placeholder="Enter Street"
                                                value={lead.street}
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
                                                value={lead.pincode}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Row className="view-form-header align-items-center mt-4" style={{ marginLeft: "4px" }}>
                                        <Col lg={3}>
                                            Personal Information
                                        </Col>
                                    </Row>




                                    {/* <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicCountry"
                                            >
                                            Status:
                                            </Form.Label>
                                            <select id="status" name = "status" value={lead.status} onChange={handleChange} className="form-control">
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </Form.Group>
                                    </Col> */}

                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicCountry"
                                            >
                                                Father Name
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="father_name"
                                                placeholder="Enter Father Name"
                                                value={lead.father_name}
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
                                                Mother Name
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="mother_name"
                                                placeholder="Enter Mother Name"
                                                value={lead.mother_name}
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
                                                Father Qualification
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="father_qualification"
                                                placeholder="Enter Father Qualification"
                                                value={lead.father_qualification}
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
                                                Mother Qualification
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="mother_qualification"
                                                placeholder="Enter Mother Qualification"
                                                value={lead.mother_qualification}
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
                                                Father Occupation
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="father_occupation"
                                                placeholder="Enter Father Occupation"
                                                value={lead.father_occupation}
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
                                                Mother Occupation
                                            </Form.Label>
                                            <Form.Control
                                                style={{ height: "36px" }}
                                                type="text"
                                                name="mother_occupation"
                                                placeholder="Enter Mother Occupation"
                                                value={lead.mother_occupation}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicQualification"
                                            >
                                                Description
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Enter your description here"
                                                    name="description"
                                                    value={lead.description}
                                                    onChange={handleChange}
                                                />
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Col >
                        <Col></Col>
                    </Row >
                    <ToastContainer />
                </Container >
            </Main>
        </>
    )
}
export default StudentEnquiry;

