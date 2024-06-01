import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Table } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import schoolApi from "../../api/schoolApi";
import { Helmet } from "react-helmet";
import "../../resources/css/Student.css";
import { ToastContainer } from 'react-toastify';
import Select from "react-select";
const TeacherTimeTable = (props) => {
  const [showTable, setShowTable] = useState(false);
  const [optionClass, setOptionTeacher] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState();
  const [timeTable, setTimeTable] = useState([]);
  const [timeTableTeacher, setTimeTableTeacher] = useState([]);

  useEffect(() => {
    fetchTeacherRecords();
  }, []);

  const fetchTeacherRecords = async () => {
    const result = await schoolApi.getTeacherRecords(true); //fetch class records
    if (result) {
      let ar = [];
      result.map((item) => {
        var obj = {};
        obj.value = item.id;
        obj.label = item.teachername;
        ar.push(obj);
      });
      setOptionTeacher(ar);
    }
  }
  function convertTo12HourFormat(time24Hour) {
    const [hours, minutes] = time24Hour.split(':').map(Number); // Parse hours and minutes as integers
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = (hours % 12) || 12;
    return `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}
  const getTimeTableTeacher = async (res) => {
    console.log('RESS78=>', res.contact_id);
    const timetableData = await schoolApi.getTimeTableTeacherRec(res.contact_id);
    console.log('##timetableTeacher', timetableData)
    if (timetableData.length>0) {
      timetableData?.map((item) => {
        if(item.start_time && item.end_time){
            const startTime = convertTo12HourFormat((item.start_time));
            const endTime = convertTo12HourFormat((item.end_time));
            console.log('time12Hour$%%^%',startTime,endTime); // Output: "4:15 PM"
             item.period_time = `${startTime} to ${endTime}`;
        }
    });
    console.log('what is n-->',timetableData)
      setTimeTableTeacher(timetableData);
    } else {
      setTimeTableTeacher([])
    }
  }

  //handle change class
  const handleChangeTeacher = (e) => {
    console.log('e.target.name%@^%^#=>', e.target);
    setSelectedTeacher(e);
    setTimeTable({ ...timeTable, contact_id: e.value });
    setShowTable(true);
    let res = {
      ...timeTable, contact_id: e.value
    }
    getTimeTableTeacher(res);
  };
  console.log('timeTable*****=>', timeTableTeacher);
  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <Card className="m-3 custom-card" style={{ background: "#1a293b", color: "white" }}>
        <Row className="g-0 ">
          <Col lg={10} className="mx-4">
            <span className="" style={{ fontWeight: "Arial", fontSize: "20px" }}>Time Table</span>
            <Link className="mt-3 nav-link" to="/timetable" style={{ fontSize: "15px" }}>Home <i className="fa-solid fa-chevron-right"></i> <strong>Timetable <i className="fa-solid fa-chevron-right"></i></strong><strong> Teacher Wise Time Table</strong> </Link>
          </Col>
        </Row>
      </Card>
      <Card className="m-4 custom-card">
        <Container fluid style={{ marginTop: '15px' }}>
          <Row>
            <Col lg={12} className="text-center">
              <h3 style={{ fontWeight: "bold" }}>Teacher Time Table</h3>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={4}>
              {optionClass && (
                <Form.Group>
                  <Form.Label className="form-view-label feeElement" htmlFor="formBasicClass">Teacher Name</Form.Label>
                  <Select
                    required
                    className="custom-select username"
                    placeholder="Select Teacher Name"
                    name="contact_id"
                    onChange={handleChangeTeacher}
                    value={selectedTeacher}
                    options={optionClass}
                  ></Select>
                </Form.Group>
              )}
            </Col>
            <Col lg={4}>
            </Col>
            <Col lg={4}>
            </Col>
          </Row>
          {showTable &&
            <Row className="mt-5">
              <Col lg={12} className="">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Class Name</th>
                      <th>Section Name</th>
                      <th>Subject Name</th>
                      <th>Period Time</th>
                      <th>Day</th>
                      <th>Time Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeTableTeacher && timeTableTeacher.length > 0 ? (
                      timeTableTeacher.map((item, index) => (
                        <tr key={index}>
                          <td>{item.classname}</td>
                          <td>{item.section_name}</td>
                          <td>{item.subject_name}</td>
                          <td>{item.period_time}</td>
                          <td>{item.day}</td>
                          <td>{item.type}</td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{textAlign:"center"}}>
                        <td colSpan={6} style={{fontSize:"15px"}}>
                          Timetable records are not available for teachers!
                        </td>
                      </tr>
                    )}

                  </tbody>
                </Table>
              </Col>
            
          <Col lg={12}  className="mt-4">
              <Form.Group>
                  <Form.Label><span style={{fontFamily: "Arial", fontSize: "13px" }}>Break Time : 2 to 3</span></Form.Label>
              </Form.Group>
          </Col>
          </Row>
          }
          
          <ToastContainer />
        </Container>
      </Card>
    </Main>
  );
};
export default TeacherTimeTable;