import React, { useState} from "react";
import Form from 'react-bootstrap/Form';
import { Col, Container, Row } from 'react-bootstrap';
const DateRangePicker = ( {onValueChange} ) => {
  const [filterDates, setFilterDates] = useState({});

  const handleDateFilter = (e) => {
    const updatedFilterDates = {
      ...filterDates,
      [e.target.name]: e.target.value
    };
    console.log('updatedFilterDates@@+>',updatedFilterDates);
    
    setFilterDates(updatedFilterDates);
    console.log('filterDates@@+>',filterDates);
    console.log('updatedFilterDates.end_date>',updatedFilterDates.end_date);
    if(updatedFilterDates.start_date && updatedFilterDates.end_date){
      console.log('Yes22');
       onValueChange(updatedFilterDates);
    }
  
  };

  return (
    <>
      <Row>
        <Col lg={6}>
          <Form.Group className="">
            <Form.Label
              className="form-view-label"
              htmlFor="formBasicStartDate"
            >
              Start Date
            </Form.Label>
            <Form.Control
              type="Date"
              name="start_date"
              placeholder="Enter Start Date"
              onChange={handleDateFilter}
            />
          </Form.Group>
        </Col>
        <Col lg={6}>
          <Form.Group className="">
            <Form.Label
              className="form-view-label"
              htmlFor="formBasicStartTime"
            >
              End Date
            </Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              placeholder="Enter End Date"
              onChange={handleDateFilter}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default DateRangePicker;
