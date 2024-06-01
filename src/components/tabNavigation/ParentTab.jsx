import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import schoolApi from "../../api/schoolApi";
const ParentTab = (props) => {
  console.log('ParentTab props=>',props)
  const [parentFather, setParentFather] = useState('');
  const [parentMother, setParentMother] = useState('');
  const [ParentGuardian, setParentGuardian] = useState('');
  const [validatedForParent, setValidatedForParent] = useState(false);
  //const [familyInfo, setFamilyInfo] = useState('');
  const [familyInfo, setFamilyInfo] = useState({
    fatherfirstname: props?.lead?.father_name.split(' ')[0] || "",
    fatherlastname: props?.lead?.father_name.split(' ')[1] || "",
    fatherphone: props?.lead?.father_phone || "",
    fatheremail: "",
    motherfirstname: props?.lead?.mother_name.split(' ')[0] || "",
    motherlastname: props?.lead?.mother_name.split(' ')[1] || "",
    motherphone: props?.lead?.mother_phone || "",
    motheremail: "",  
    guardianfirstname: "",
    guardianlastname: "",
    guardianphone: "",
    guardianemail: "",
    recordtype: ""
  });
  
  const [parentIds, setParentIds] = useState([]);
  let parentArray = [];
  useEffect(() => {
    // if(props?.lead){
    //   setFamilyInfo(props?.lead)
    // }
    if (props.validatedForParent) {
      if (checkRequredFields()) {
        setValidatedForParent(true);
      }
    }
  }, [props.validatedForParent]);
  const checkRequredFields = () => {
    if ((familyInfo.fatherfirstname && familyInfo.fatherfirstname.trim() !== '')) {
      return false;
    }
    return true;
  }
  const handleSearch = async (e) => {
    let contPhone = e.target.value;
    let allParentContact = await schoolApi.fetchParentContacts();
    if (allParentContact) {
      let datafilterarray = allParentContact.filter((value) => value.phone === contPhone)
      if(datafilterarray.length>0){
        parentArray.push(datafilterarray[0].id);
        setParentIds((parentValues) => [...parentValues, ...parentArray]);
      }
      let parentFatherInfo = datafilterarray.filter((value) => value.recordtype === 'Parent_Father')
      if (parentFatherInfo.length > 0) {
        props.handleParentTab(parentFatherInfo)
        setParentFather(parentFatherInfo);
      }
      let parentMotherInfo = datafilterarray.filter((value) => value.recordtype === 'Parent_Mother')
      if (parentMotherInfo.length > 0) {
        setParentMother(parentMotherInfo);
        props.handleParentTab(parentMotherInfo)
      }
      let parentGuardianInfo = datafilterarray.filter((value) => value.recordtype === 'Parent_Guardian')
      if (parentGuardianInfo.length > 0) {
        setParentGuardian(parentGuardianInfo);
        props.handleParentTab(parentGuardianInfo)
      }
    }
  };
  props.handleParentsInfo(parentIds);
  const handleParentChange = async (e) => {
    setFamilyInfo({ ...familyInfo, [e.target.name]: e.target.value });
    props.handleInsertedParents({ ...familyInfo, [e.target.name]: e.target.value })
  }
  const handlePhoneChange = (event) => {
    const inputPhone = event.target.value.replace(/\D/g, '').slice(0, 10);
    if (event.target.name === 'fatherphone') {
      handleParentChange({ target: { name: 'fatherphone', value: inputPhone } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: inputPhone })
    } else if (event.target.name === 'motherphone') {
      handleParentChange({ target: { name: 'motherphone', value: inputPhone } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: inputPhone })
    } else if (event.target.name === 'guardianphone') {
      handleParentChange({ target: { name: 'guardianphone', value: inputPhone } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: inputPhone })
    }
  };
  const handleEmailChange = (event) => {
    const enteredEmail = event.target.value;
    if (event.target.name === 'fatheremail') {
      handleParentChange({ target: { name: 'fatheremail', value: enteredEmail } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: enteredEmail })
    } else if (event.target.name === 'motheremail') {
      handleParentChange({ target: { name: 'motheremail', value: enteredEmail } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: enteredEmail })
    } else if (event.target.name === 'guardianemail') {
      handleParentChange({ target: { name: 'guardianemail', value: enteredEmail } });
      props.handleInsertedParents({ ...familyInfo, [event.target.name]: enteredEmail })
    }
  };
  return (
    <>
      <Row>
        <Col md={4}></Col>
        <Col md={4}></Col>
        <Col md={4}>
          <div>
            <Form>
              <Form.Group className="text-right" controlId="parentPhone">
                <Form.Control type="text" placeholder="Search Phone Number" size="lg" name="phone" onChange={handleSearch} />
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
      {parentFather ? (
        <>
          <Row>
            <Col md={12}>
              <h3>Father Details:</h3>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherFirstName">
                  <Form.Label className="text-formatted">First Name</Form.Label>
                  <Form.Control type="text" name="fatherfirstname" placeholder="Enter Father's First Name" size="lg" value={parentFather[0].firstname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherLastName">
                  <Form.Label className="text-formatted">Last Name</Form.Label>
                  <Form.Control type="text" name="fatherlastname" placeholder="Enter Father's Last Name" size="lg" value={parentFather[0].lastname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherQualification">
                  <Form.Label className="text-formatted">Qualification</Form.Label>
                  <Form.Control type="text" name="fatherqualificatin" placeholder="Enter Qualification" size="lg" value={parentFather[0].qualification} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherOccupation">
                  <Form.Label className="text-formatted">Occupation</Form.Label>
                  <Form.Control type="text" name="fatherprofession" placeholder="Enter Occupation" size="lg" value={parentFather[0].profession} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherPhone">
                  <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                  <Form.Control type="text" name="fatherphone" placeholder="Enter Phone No.." size="lg" value={parentFather[0].phone} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="fatherEmail">
                  <Form.Label className="text-formatted">Email</Form.Label>
                  <Form.Control type="email" name="fatheremail" placeholder="Enter Email" size="lg" value={parentFather[0].email} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Form
            noValidate
            validated={validatedForParent}
          >
            <Row>
              <Col md={12}>
                <h3>Father Details:</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="FirstName">
                  <Form.Label className="text-formatted">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father's First Name"
                    size="lg"
                    onChange={handleParentChange}
                    name="fatherfirstname"
                    required
                    value={props?.lead?.father_name?props.lead.father_name.split(' ')[0]:props.familyInfo.fatherfirstname}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="fatherLastName">
                  <Form.Label className="text-formatted">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Father's Last Name"
                    size="lg"
                    onChange={handleParentChange}
                    name="fatherlastname"
                    value={props?.lead?.father_name?props.lead.father_name.split(' ')[1]:props.familyInfo.fatherlastname}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="fatherQualification">
                  <Form.Label className="text-formatted">Qualification</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Qualification"
                    size="lg"
                    onChange={handleParentChange}
                    name="fatherqualification"
                    value={props?.lead?.father_qualification?props.lead.father_qualification:props.familyInfo.fatherqualification}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="fatherOccupation">
                  <Form.Label className="text-formatted">Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Occupation"
                    size="lg"
                    onChange={handleParentChange}
                    name="fatherprofession"
                    value={props?.lead?.father_occupation?props.lead.father_occupation:props.familyInfo.fatherprofession}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="fatherPhone">
                  <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                  <Form.Control
                    type="phone"
                    placeholder="Enter Phone No.."
                    size="lg"
                    onChange={handlePhoneChange}
                    name="fatherphone"
                    value={props?.lead?.fatherphone?props.lead.fatherphone:props.familyInfo.fatherphone}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="fatherEmail">
                  <Form.Label className="text-formatted">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    size="lg"
                    onChange={handleEmailChange}
                    name="fatheremail"
                    value={props.familyInfo.fatheremail}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </>
      )}

      {parentMother ? (
        <>
          {/* Mother Details */}
          <Row>
            <Col md={12}>
              <h3>Mother Details:</h3>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="motherFirstName">
                  <Form.Label className="text-formatted">First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Mother's First Name" name="motherfirstname" size="lg" value={parentMother[0].firstname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="motherLastName">
                  <Form.Label className="text-formatted">Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Mother's Last Name" name="motherlastname" size="lg" value={parentMother[0].lastname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherQualification">
                    <Form.Label className="text-formatted">Qualification</Form.Label>
                    <Form.Control type="text" placeholder="Enter Qualification" name="motherqualification" size="lg" value={parentMother[0].qualification} onChange={handleParentChange} />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherOccupation">
                    <Form.Label className="text-formatted">Occupation</Form.Label>
                    <Form.Control type="text" placeholder="Enter Occupation" name="motherprofession" size="lg" value={parentMother[0].profession} onChange={handleParentChange} />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherPhone">
                    <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                    <Form.Control type="text" placeholder="Enter Phone No.." name="motherphone" size="lg" value={parentMother[0].phone} onChange={handleParentChange} />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherEmail">
                    <Form.Label className="text-formatted">Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" size="lg" name="motheremail" value={parentMother[0].email} onChange={handleParentChange} />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Row>
        </>
      ) : (
        <>
          <Form
            noValidate
            validated={validatedForParent}
          >
            {/* Mother Details */}
            <Row>
              <Col md={12}>
                <h3>Mother Details:</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherFirstName">
                    <Form.Label className="text-formatted">First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Mother's First Name" name="motherfirstname" size="lg" onChange={handleParentChange} value={props?.lead?.mother_name?props.lead.mother_name.split(' ')[0]:props.familyInfo.motherfirstname} required />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="motherLastName">
                    <Form.Label className="text-formatted">Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Mother's Last Name" name="motherlastname" size="lg" onChange={handleParentChange} value={props?.lead?.mother_name?props.lead.mother_name.split(' ')[1]:props.familyInfo.motherlastname} required />
                  </Form.Group>
                </Form>
              </Col>
              <Row>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3" controlId="motherQualification">
                      <Form.Label className="text-formatted">Qualification</Form.Label>
                      <Form.Control type="text" placeholder="Enter Qualification" size="lg" name="motherqualification" onChange={handleParentChange} value={props?.lead?.mother_qualification?props.lead.mother_qualification:props.familyInfo.motherqualification} />
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3 mx-2" controlId="motherOccupation">
                      <Form.Label className="text-formatted">Occupation</Form.Label>
                      <Form.Control type="text" placeholder="Enter Occupation" size="lg" name="motherprofession" onChange={handleParentChange} value={props?.lead?.mother_occupation?props.lead.mother_occupation:props.familyInfo.motherprofession} />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3" controlId="motherPhone">
                      <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                      <Form.Control type="phone" placeholder="Enter Phone No.." name="motherphone" size="lg" onChange={handlePhoneChange} value={props?.lead?.motherphone?props.lead.motherphone:props.familyInfo.motherphone} required />
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={6}>
                  <Form>
                    <Form.Group className="mb-3 mx-2" controlId="motherEmail">
                      <Form.Label className="text-formatted">Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter Email" size="lg" name="motheremail" onChange={handleEmailChange} value={props?.familyInfo?.motheremail} />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Row>
          </Form>
        </>
      )}
      {ParentGuardian ? (
        <>
          {/* Guardian Details */}
          <Row>
            <Col md={12}>
              <h3>Guardian Details:</h3>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianFirstName">
                  <Form.Label className="text-formatted">First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Guardian's First Name" name="guardianfirstname" size="lg" value={ParentGuardian[0].firstname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianLastName">
                  <Form.Label className="text-formatted">Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Guardian's Last Name" name="guardianlastname" size="lg" value={ParentGuardian[0].lastname} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianQualification">
                  <Form.Label className="text-formatted">Qualification</Form.Label>
                  <Form.Control type="text" placeholder="Enter Qualification" size="lg" name="guardianqualification" value={ParentGuardian[0].qualification} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianOccupation">
                  <Form.Label className="text-formatted">Occupation</Form.Label>
                  <Form.Control type="text" placeholder="Enter Occupation" name="guardianprofession" size="lg" value={ParentGuardian[0].profession} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianPhone">
                  <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                  <Form.Control type="text" placeholder="Enter Phone No.." name="guardianphone" size="lg" value={ParentGuardian[0].phone} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
            <Col md={6}>
              <Form>
                <Form.Group className="mb-3" controlId="guardianEmail">
                  <Form.Label className="text-formatted">Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter Email" size="lg" name="guardianemail" value={ParentGuardian[0].email} onChange={handleParentChange} />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Guardian Details */}
          <Form
            noValidate
            validated={validatedForParent}
          >
            <Row>
              <Col md={12}>
                <h3>Guardian Details:</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianFirstName">
                    <Form.Label className="text-formatted">First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Guardian's First Name" name="guardianfirstname" size="lg" onChange={handleParentChange} value={props.familyInfo.guardianfirstname} required />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianLastName">
                    <Form.Label className="text-formatted">Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Guardian's Last Name" name="guardianlastname" size="lg" onChange={handleParentChange} value={props.familyInfo.guardianlastname} required />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianQualification">
                    <Form.Label className="text-formatted">Qualification</Form.Label>
                    <Form.Control type="text" placeholder="Enter Qualification" size="lg" name="guardianqualification" onChange={handleParentChange} value={props.familyInfo.guardianqualification} />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianOccupation">
                    <Form.Label className="text-formatted">Occupation</Form.Label>
                    <Form.Control type="text" placeholder="Enter Occupation" size="lg" name="guardianprofession" onChange={handleParentChange} value={props.familyInfo.guardianprofession} />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianPhone">
                    <Form.Label className="text-formatted">Mobile Phone</Form.Label>
                    <Form.Control type="phone" placeholder="Enter Phone No.." size="lg" name="guardianphone" onChange={handlePhoneChange} value={props.familyInfo.guardianphone} required />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={6}>
                <Form>
                  <Form.Group className="mb-3" controlId="guardianEmail">
                    <Form.Label className="text-formatted">Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email" size="lg" name="guardianemail" onChange={handleEmailChange} value={props.familyInfo.guardianemail} />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
}
export default ParentTab;
