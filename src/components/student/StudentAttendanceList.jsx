/**
 * This is Using for Student Attendance
 * @author      undefined
 * @date        Feb, 2023
 * @copyright   www.ibirdsservices.com  
 */

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
import Main from "../layout/Main"; // Make sure to import the 'Main' component.
// import Select from 'react-select';
import CenteredModal from "../modal/centeredModal";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";


const StudentAttendanceList = (props) => {
  let location = useLocation();
  let navigate = useNavigate();
  const [studentfilterValues, setStudentFilterValues] = useState({});
  const [studentlist, setstudentList] = useState([]);
  const [list, setlist] = useState([]);
  const [studentAttendanceList, setStudentAttendanceList] = useState([]);
  const [locationData, setlocationData] = useState(
    location.state ? location.state : {}
  );
  const [alldatastudent, setalldatastudent] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    // fetchAllStudentdata();
    fetchAllStudentList();
  }, []);

  const fetchAllStudentList = async () => {
    const result = await schoolApi.fetchStudentAddmission();
    console.log("result ==> fetch ", result);
    if (result) {
      result.map((value, index, array) => {
        value.present = true;
      });
      setstudentList(result);
      setlist(result);
    } else {
      setstudentList(result);
      setlist(result);
    }
  };

  const [updationrecord, setupdationrecord] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedFilterValues = {
      ...studentfilterValues,
      [name]: value,
    };
    setStudentFilterValues(updatedFilterValues);
    console.log("Handler Change Updated FilterValue =>", updatedFilterValues);
    if (updatedFilterValues.class && updatedFilterValues.section) {
      const filteredList = list?.filter(
        (student) =>
          student.classname === updatedFilterValues.class &&
          student.section === updatedFilterValues.section
      );
      console.log("filteredList", filteredList);
      if (filteredList) {
        setstudentList(filteredList);
      }
    }

    if (
      updatedFilterValues.attandancedate &&
      updatedFilterValues.class &&
      updatedFilterValues.section
    ) {
      console.log("if call");
      let query = `SELECT id,attandancedate,class,section,data FROM student_attendance WHERE DATE(attandancedate)= '${updatedFilterValues.attandancedate}' and class = '${updatedFilterValues.class}' and section = '${updatedFilterValues.section}'`;
      console.log("query", query);
      let result = await schoolApi.fetchFilterdstudent(query);
      console.log("result query", result);
      setupdationrecord(result);
      if (result) {
        setstudentList(result?.data);
      } else {
        //setstudentList(list)
      }
    }
  };

  const handleChangeStudentAttendance = (
    studentname,
    attendance,
    studentid,
    targetname,
    index
  ) => {
    if (targetname === "present") {
      const updatedStudentlist = [...studentlist]; // Create a new copy of the studentlist
      updatedStudentlist[index].present = attendance; // Update the attendance for the specific student
      updatedStudentlist[index].attandancedate =
        studentfilterValues.attandancedate; // Update the attendance for the specific student

      setstudentList(updatedStudentlist); // Update the state with the new copy of the studentlist
    }

    // Check if a record with the same studentid exists in the array
    const existingRecordIndex = studentlist.findIndex(
      (record) => record.studentid === studentid
    );

    // If a record with the same studentid exists, update its attendance value
    if (existingRecordIndex !== -1) {
      const updatedStudentAttendanceList = [...studentlist];
      updatedStudentAttendanceList[existingRecordIndex].present = attendance;
      updatedStudentAttendanceList[existingRecordIndex].attandancedate =
        studentfilterValues.attandancedate;
      setstudentList(updatedStudentAttendanceList);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let completedata = {};
    let result = {};
    if (updationrecord.id) {
      completedata = {
        attandancedate: updationrecord.attandancedate,
        class: updationrecord.class,
        section: updationrecord.section,
        data: studentlist,
      };
      console.log("completedata", completedata);
      let id = updationrecord.id;
      result = await schoolApi.saveStudentAttendance(completedata, id);
      console.log("edit result", result);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: "Record saved successfully",
      });
    } else {
      completedata = {
        attandancedate: studentfilterValues.attandancedate,
        class: studentfilterValues.class,
        section: studentfilterValues.section,
        data: studentlist,
      };
      console.log("completedata", completedata);
      result = await schoolApi.createstudentAttendance(completedata);
      console.log("create result", result);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Create",
        message: "Record Created successfully",
      });
    }
  };

  const handleModal = () =>{
    setModalShow(false);
    PubSub.publish('RECORD_SAVED_TOAST', { title: 'Attendence Record(s) Saved', message: 'Record saved successfully' });
  }

  return (
    <>
      <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <PageNavigations   colLg={2} colClassName="d-flex mx-4" extrColumn={12}/>
      
        <Container className="view-form">
          <Row>
            <Col></Col>
            <Col lg={12} className="mx-2">
              <Form className="mt-3">
                <Row className="view-form-header align-items-center">
                  <Col lg={3}>Student Attendance Management</Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button className="btn-sm mx-2" onClick={handleSubmit}>
                      Save
                    </Button>
                    <Button variant="secondary" onClick={() => setModalShow(true)} > Upload CSV </Button>
                    <CenteredModal show={modalShow} onHide={() => setModalShow(false)} title="Upload Student Attendence CSV" handleModal={handleModal} />
                  </Col>
                </Row>
                <Form>
                  <Row lg={12} style={{ marginLeft: "20%" }}>
                    <Col lg={3} className="mx-3">
                      <Form.Group className="mx-3">
                        <Form.Label
                          className="form-view-label"
                          htmlFor="formBasicEmail"
                        >
                          Attendance Date
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="attandancedate"
                          value={moment(
                            studentfilterValues.attandancedate
                          ).format("yyyy-MM-DD")}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={3}>
                      <Form.Group className="mx-3">
                        <Form.Label className="form-view-label">
                          Student Class
                        </Form.Label>
                        <Form.Select
                          name="class"
                          onChange={handleChange}
                          value={studentfilterValues.class}
                        >
                          <option value="">-- Select --</option>
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                          <option value="7th">7th</option>
                          <option value="8th">8th</option>
                          <option value="9th">9th</option>
                          <option value="10th">10th</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={3}>
                      <Form.Group className="mx-3">
                        <Form.Label className="form-view-label">
                          Student Section
                        </Form.Label>
                        <Form.Select
                          name="section"
                          onChange={handleChange}
                          value={studentfilterValues.section}
                        >
                          <option value="">-- Select --</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Form>
            </Col>
            <div className="container my-3">
              <div class="row">
                <div class="col">
                  <table
                    class="table table-striped table-bordered table-hover"
                    style={{ width: "50%", marginLeft: "27%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>Sr.No</th>
                        <th style={{ width: "60%" }}>Student Name</th>
                        <th style={{ width: "20%" }}>Present</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentlist?.map((value, index) => (
                        <tr key={value.id}>
                          <td>{index + 1}</td>
                          <td>{value.studentname}</td>
                          <td>
                            <Form>
                              <Form.Check // prettier-ignore
                                type="switch"
                                id="present"
                                name="present"
                                checked={value.present}
                                onChange={(e) =>
                                  handleChangeStudentAttendance(
                                    value.studentname,
                                    e.target.checked,
                                    value.id,
                                    "present",
                                    index
                                  )
                                }
                              />
                            </Form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </Main>
    </>
  );
};
export default StudentAttendanceList