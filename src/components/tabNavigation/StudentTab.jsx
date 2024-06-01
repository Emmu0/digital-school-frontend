import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import '../../resources/css/Student.css';
import schoolApi from "../../api/schoolApi";
import Select from "react-select";
import AssignTransport from '../transport/AssignTransport';
import { toast } from 'react-toastify';

function StudentTab(props) {
  console.log('propds=>',props)
  const [optionClasses, setOptionClasses] = useState([]);
  const [optionSection, setOptionSection] = useState([]);
  const [optionVehicals, setoptionVehicals] = useState([]);
  const [optionSession, setOptionSession] = useState([]);
  const [validated, setValidated] = useState(false);
  const [student, setStudent] = useState('');
  const [isChecked, setIsChecked] = useState();
  const [discountRecords, setDiscountRecords] = useState();
  const [discountOptions, setDiscountOptions] = useState();
  const [feeType, setFeeType] = useState('');
  const [assignTransportRecord, setAssignTransportRecord] = useState({})
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);

  
  useEffect(() => {
    console.log('first useEffect');
    async function init() {
      console.log('Yesy');
      if (props?.lead?.class_id) {
        console.log('props?.lead?.class_id=>', props?.lead?.class_id);
        let feeMasterResult = await schoolApi.fetchFeeMasterByIdOrClassid(props?.lead?.class_id);
        console.log('feeMasterResult by classid-->', feeMasterResult);
        if (feeMasterResult) {
          let ar = [];
          feeMasterResult.forEach((item) => {
            var obj = {};
            obj.value = item.id;
            obj.label = item.type;
            ar.push(obj);
          });
          console.log('ar- fee master result->', ar);
          setFeeTypeOptions(ar);
        } else {
          setFeeTypeOptions([]);
        }
      }
    }
    init();
  }, [props?.lead?.class_id]);

  useEffect(() => {
    async function init() {
      if(props?.lead !== null){
        setStudent(props?.lead)
      }
      let classList = await schoolApi.fetchClasses();
      console.log('classListclassList-->',classList);
      if (classList) {
        let ar = [];
        classList.map((item) => {
          var obj = {};
          obj.value = item.class_id;
          obj.label = item.classname;
          ar.push(obj);
        })
        setOptionClasses(ar);
      } else {
        setOptionClasses([]);
      }
      let sectionList = await schoolApi.fetchSections();
      if (sectionList) {
        let ar = [];
        sectionList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.section_name;
          ar.push(obj);
        })
        setOptionSection(ar);
      } else {
        setOptionSection([]);
      }
      let sessionList = await schoolApi.fetchSessions();
      console.log('sessionList on student tab',sessionList);
      if (sessionList) {
        let ar = [];
        sessionList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.year;
          ar.push(obj);
        })
        setOptionSession(ar);
        
      } else {
        setOptionSession([]);
      }
      let vehicalList = await schoolApi.fetchVehicles();
      if (vehicalList) {
        let ar = [];
        vehicalList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.vehicle_no + ' ' + item.type;
          ar.push(obj);
        })
        setoptionVehicals(ar);
      } else {
        setoptionVehicals([]);
      }

      let discountResults = await schoolApi.fetchFeeDiscounts();
      if (discountResults) {
        let ar = [];
        discountResults.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.name;
          ar.push(obj);
        })
        setDiscountRecords(ar);
      } else {
        setDiscountRecords([]);
      }

    }
    init();
  }, []);

  console.log('props student',props.student);
  console.log('discountRecords-->',discountRecords);

  useEffect(() => {
    if (props.validated) {
      if (checkRequredFields()) {
        setValidated(true);
      }
    }
  }, [props.validated]);
  const handleCurrentSelectedDate = (event) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
    props.handleStudentTab({ ...student, [event.target.name]: event.target.value })
  }
  const handleChange = (event) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
    props.handleStudentTab({ ...student, [event.target.name]: event.target.value })
  }
  const handlePhoneChange = (event) => {
    const inputPhone = event.target.value.replace(/\D/g, '').slice(0, 10);
    handleChange({ target: { name: 'phone', value: inputPhone } });
  };
  const handleEmailChange = (event) => {
    const enteredEmail = event.target.value;
    handleChange({ target: { name: 'email', value: enteredEmail } });
  };
  const handleAadharNum = (event) => {
    const inputValue = event.target.value;
    handleChange({ target: { name: 'adharnumber', value: inputValue } });
  };
  const handleClasses =async (e) => {
    console.log('e.target.value@@@+>', e.target.value)
    setStudent({ ...student, classid: e.target.value });
    props.handleStudentTab({ ...student, classid: e.target.value })

      let feeMasterResult = await schoolApi.fetchFeeMasterByIdOrClassid(e.target.value);
      console.log('feeMasterResult by classid-->',feeMasterResult);
      if (feeMasterResult) {
        let ar = [];
        feeMasterResult.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.type;
          ar.push(obj);
        })
        console.log('ar- fee master result->', ar);
        setFeeTypeOptions(ar);

      } else {
        setFeeTypeOptions([]);
      }

  }

  const handleVehicals = (e) => {
    setStudent({ ...student, vehicleid: e.target.value });
    props.handleStudentTab({ ...student, vehicleid: e.target.value })
  }
  const handleSection = (e) => {
    setStudent({ ...student, section_id: e.target.value });
    props.handleStudentTab({ ...student, section_id: e.target.value })
  }
  const handleSession = (e) => {
    setStudent({ ...student, session_id: e.target.value });
    props.handleStudentTab({ ...student, session_id: e.target.value })
  }
  const handleDiscounts=(selectedOption)=>{
    console.log('selectedOption-->',selectedOption);
    setDiscountOptions(selectedOption);
    props.handleStudentTab({...student, discounts: selectedOption})
  }
  const handleCategory = (e) => {
    setStudent({ ...student, category: e.target.value });
    console.log('i am on handleCategory-->',e.target.value);
    props.handleStudentTab({ ...student, category: e.target.value })
  }

  const handleAssignTransport = (record) => {
    setAssignTransportRecord(record);
 props.handleStudentTab({...student, assign_transport: record})
  };
  console.log('assignTransportRecord--> on parent-->',assignTransportRecord);


  const handleFeeChange = (e)=>{
   // setStudent({ ...student, fee_type: e.target.value });
    setFeeType(e.target.value);
    props.handleStudentTab({...student, fee_type: e.target.value});
  }

  const handleCheckbox = (event) => {
    setIsChecked(!isChecked);
    if (!isChecked === true) {
      student.permanentcountry = student.country;
      student.permanentstate = student.state;
      student.permanentcity = student.city;
      student.permanentpostalcode = student.pincode;
      student.permanentstreet = student.street;
      props.handleStudentTab(student);
    } else {
      student.permanentcountry = '';
      student.permanentstate = '';
      student.permanentcity = '';
      student.permanentpostalcode = '';
      student.permanentstreet = '';
      props.handleStudentTab(student);
    }

  }
  const checkRequredFields = () => {
    if ((student.firstname && student.firstname.trim() !== '')) {
      return false;
    }
    return true;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <>
      <Form
        noValidate
        validated={validated}
      >
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label className="text-formatted">First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" size="lg" name="firstname" required onChange={handleChange} value={props?.lead?.firstname?props.lead.firstname:props.student.firstname} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label className="text-formatted">Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" size="lg" name="lastname" onChange={handleChange} value={props?.lead?.lastname?props.lead.lastname:props.student.lastname} />
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h3>Present Address :</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formCountry">
                <Form.Label className="text-formatted">Country</Form.Label>
                <Form.Control type="text" placeholder="Enter Country" size="lg" name="country" onChange={handleChange} value={props?.lead?.country?props.lead.country:props.student.country} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formState">
                <Form.Label className="text-formatted">State</Form.Label>
                <Form.Control type="text" placeholder="Enter State" size="lg" name="state" onChange={handleChange} value={props?.lead?.state?props.lead.state:props.student.state} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label className="text-formatted">City</Form.Label>
                <Form.Control type="text" placeholder="Enter City" size="lg" name="city" onChange={handleChange} value={props?.lead?.city?props.lead.city:props.student.city} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formPostalCode">
                <Form.Label className="text-formatted">Postal Code</Form.Label>
                <Form.Control type="text" placeholder="Enter Postal Code" size="lg" name="pincode" onChange={handleChange} value={props?.lead?.pincode?props.lead.pincode:props.student.pincode} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form>
              <Form.Group className="mb-3" controlId="formStreet">
                <Form.Label className="text-formatted">Street</Form.Label>
                <Form.Control type="text" placeholder="Enter Street" size="lg" name="street" onChange={handleChange} value={props?.lead?.street?props.lead.street:props.student.street} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h3>Permanent Address - check if address same :</h3>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group>
                <Form.Check type="checkbox" name="checkVal" style={{ marginLeft: "-19px", fontSize: "1.3rem", marginTop: "0.3rem" }} onClick={handleCheckbox} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <hr></hr>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formCountry">
                <Form.Label className="text-formatted">Country</Form.Label>
                <Form.Control type="text" placeholder="Enter Country" size="lg" name="permanentcountry" onChange={handleChange} value={props.student.permanentcountry} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formState">
                <Form.Label className="text-formatted">State</Form.Label>
                <Form.Control type="text" placeholder="Enter State" size="lg" name="permanentstate" onChange={handleChange} value={props.student.permanentstate} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formCity">
                <Form.Label className="text-formatted">City</Form.Label>
                <Form.Control type="text" placeholder="Enter City" size="lg" name="permanentcity" onChange={handleChange} value={props.student.permanentcity} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formPostalCode">
                <Form.Label className="text-formatted">Postal Code</Form.Label>
                <Form.Control type="text" placeholder="Enter Postal Code" size="lg" name="permanentpostalcode" onChange={handleChange} value={props.student.permanentpostalcode} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form>
              <Form.Group className="mb-3" controlId="formStreet">
                <Form.Label className="text-formatted">Street</Form.Label>
                <Form.Control type="text" placeholder="Enter Street" size="lg" name="permanentstreet" onChange={handleChange} value={props.student.permanentstreet} />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>Other Information :</h3>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col lg={4}>
            <Form.Group className=" mb-3" controlId="formDob">
              <Form.Label className="text-formatted">
                Dob
              </Form.Label>
              <Form.Control
                type="date"
                className="attendance-date"
                name="dateofbirth"
                onChange={(event) => handleCurrentSelectedDate(event)}
                style={{ fontSize: "1.2rem" }}
                value={props?.lead?.dateofbirth ? formatDate(props.lead.dateofbirth) : formatDate(props.student.dateofbirth)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formGender">
                <Form.Label className="text-formatted">Gender</Form.Label>
                <Form.Select size="lg" name="gender" onChange={handleChange} value={props?.lead?.gender?props.lead.gender:props.student.gender}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="text-formatted">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  size="lg"
                  name="email"
                  onChange={handleEmailChange}
                  value={props?.lead?.email?props.lead.email:props.student.email}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          {/* <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formParentContacts">
                <Form.Label className="text-formatted">Select Session</Form.Label>
                <Form.Select size="lg" name="session_id" onChange={handleSession} value={props.student.year} required>
                  <option value="">Select Session</option>
                  {optionSession.map((session, index) => (
                    <option key={index} value={session.value}>
                      {session.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Col> */}
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formClassName">
                <Form.Label
                  className="text-formatted"
                >
                  Class Name
                </Form.Label>
                <Form.Select size="lg" name="classid" required onChange={handleClasses} value={props?.lead?.class_id?props.lead.class_id:props.student.classid}>
                  <option value="">Select Class</option>
                  {optionClasses.map((className, index) => (
                    console.log('className.value@@=>',className.value),
                    <option key={index} value={className.value}>
                      {console.log('classNameclassName-->',className)}
                      {className.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formClassName">
                <Form.Label
                  className="text-formatted"
                >
                  Category
                </Form.Label>
                <Form.Select size="lg" name="category" required onChange={handleCategory} value={props?.lead?.category?props.lead.category:props.student.category}>
                <option value="">--Select Category--</option>
                  <option value="General">General</option>
                  <option value="Obc">Obc</option>
                  <option value="Sc">Sc</option>
                  <option value="St">St</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formAadharNumber">
                <Form.Label className="text-formatted">Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Aadhar Number"
                  size="lg"
                  name="adharnumber"
                  onChange={handleAadharNum}
                  value={props?.lead?.adharnumber?props.lead.adharnumber:props.student.adharnumber}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form>
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label className="text-formatted">Phone</Form.Label>
                <Form.Control type="phone" placeholder="Enter Phone" size="lg" value={props?.lead?.phone?props.lead.phone:props.student.phone} name="phone" required onChange={handlePhoneChange} />
              </Form.Group>
            </Form>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formReligion">
              <Form.Label className="text-formatted">Religion</Form.Label>
              <Form.Control type="text" placeholder="Enter Religion" size="lg" value={props?.lead?.religion?props.lead.religion:props.student.religion} name="religion" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3 pb-1" controlId="formDescription">
              <Form.Label className="text-formatted">Description</Form.Label>
              <textarea 
                className="form-control"
                placeholder="Enter Description"
                name="description"
                onChange={handleChange}
                value={props.student.description}
              ></textarea>
            </Form.Group>
          </Col>
        </Row>
        {/* ---------------------- Code Pawan ------------------------ */}
        <Row>
          <Col md={12}>
            <h3>Fees And Discount :</h3>
            <hr />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form>
            <Form.Group className=" mx-2">
                      <Form.Label
                        className="text-formatted"
                      >
                        Fee Installment Type
                      </Form.Label>
                      <Form.Select size="lg" 
                        required
                        name="fee_type"
                        value={props.student.fee_type}
                        onChange={handleFeeChange}
                        // style={{ fontSize: "14px" }}
                      >
                        <option value="">-- Select Type --</option>
                        {feeTypeOptions.length > 0 ? (
                            feeTypeOptions.map((res) => (
                              <option key={res.value} value={res.value}>
                                {res.label}
                              </option>
                            ))
                          ) : (
                            <option>No records found!!</option>
                          )}
                      </Form.Select>
                    </Form.Group>
            </Form>
          </Col>
          <Col md={4}>
            <Form>
            <Form.Group className="mx-3 fees">
                      <Form.Label
                       className="text-formatted"
                      >
                        Select Discounts
                      </Form.Label>
                      <Select
                        placeholder="Select discounts"
                        // value={fixedmonths}
                        value={discountOptions}
                        onChange={handleDiscounts}
                        options={discountRecords}
                        isMulti={true}
                        name="month"
                      ></Select>
                    </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col md={12}>
            <h3>Assign Transport :</h3>
            <hr />
          </Col>
          <Col lg={12}>
          <AssignTransport
        assignTransportRecord={assignTransportRecord}
        handleAssignTransport={handleAssignTransport}
      />
          </Col>
        </Row>
      </Form>
    </>
  );
}
export default StudentTab;
