import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import '../../resources/css/Student.css';
import schoolApi from "../../api/schoolApi";
function PreviousSchoolingTab(props) {
  const [optionClasses, setOptionClasses] = useState([]);
  const [previousSchool, setPreviousSchool] = useState('');
  const [validatedForPreSchool, setValidatedForPreSchool] = useState(false);
  useEffect(() => {
    async function init() {
      let classList = await schoolApi.fetchClasses();
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
  useEffect(() => {
    if (props.validatedForPreSchool) {
      if (checkRequredFields()) {
        setValidatedForPreSchool(true);
      }
    }
  }, [props.validatedForPreSchool]);
  const handleChange = (event) => {
    setPreviousSchool({ ...previousSchool, [event.target.name]: event.target.value });
    props.handlePreviousSchool({ ...previousSchool, [event.target.name]: event.target.value })
  }
  const checkRequredFields = () => {
    if ((previousSchool.school_name && previousSchool.school_name.trim() !== '')) {
      return false;
    }
    return true;
  }
  const handleClasses = (e) => {
    setPreviousSchool({ ...previousSchool, class: e.target.value });
  }
  return (
    <>
      <Form
        noValidate
        validated={validatedForPreSchool}
      >
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label
                className="text-formatted"
                htmlFor="formBasicClass"
              >
                Class Name
              </Form.Label>
              <Form.Select size="lg" name="class" onChange={handleClasses}>
                <option value="">Select Class</option>
                {optionClasses.map((className, index) => (
                  <option key={index} value={className.value}>
                    {className.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label className="text-formatted">Grade</Form.Label>
              <Form.Control type="text" placeholder="Enter Grade" size="lg" name="grade" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label className="text-formatted">Passed Year</Form.Label>
              <Form.Control type="text" placeholder="Enter Passed Year" size="lg" name="passed_year" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCity">
              <Form.Label className="text-formatted">School Name</Form.Label>
              <Form.Control type="text" placeholder="Enter School Name" size="lg" name="school_name" required onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPostalCode">
              <Form.Label className="text-formatted">Phone</Form.Label>
              <Form.Control type="phone" placeholder="Enter Phone" size="lg" name="phone" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3 " controlId="formStreet">
              <Form.Label className="text-formatted">School Address</Form.Label>
              <Form.Control type="text" placeholder="Enter School Address" size="lg" name="school_address" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
}
export default PreviousSchoolingTab;
