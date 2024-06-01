import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
//import Confirm from "./Confirm";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import schoolApi from "../../api/schoolApi";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import InputGroup from "react-bootstrap/InputGroup";
import PubSub from "pubsub-js";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const UserAttendanceView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [packageObj, setPackage] = useState({});
  const [options, setOptions] = useState([]);
  const [date, setdate] = useState("");
  const [staffMember, setstaffMember] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [optionUsers, setOptionUsers] = useState([]);
  const [userAttendance, setUserAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  // const [updateAttendance, setupdateAttendance] = useState([]);
  let updateAttendance = [];
  let current = new Date();
  let rowId = 0; // Define a variable to keep track of the row IDs

  const [rowsData, setRowsData] = useState([]);
  const [rowsData1, setRowsData1] = useState([]);

  const handleUsers = (index, event) => {
    const list = [...rowsData];
    list[index]["contactid"] = event.value;
    list[index]["selectedUser"] = event;
    setSelectedUser(list[index].contactid);
    setRowsData(list);
  };

  useEffect(() => {
    async function init() {
      try {
        const result = await schoolApi.fetchStaffAttendances();
        console.log('attendance result => ', result);
        // let attendancedate = result[0].attendancedate;
        let arry = [];
        for (let item of result) {
          let ar = [];
          var obj = item;
          let temp = {};
          temp.value = item.contactid;
          temp.label = item.staffname;
          ar.push(temp);
          obj.selectedUser = ar;
          arry.push(obj);
        }

        let today = new Date().toISOString().substr(0, 10);
        setSelectedDate(moment(today).format("YYYY-MM-DD"));
        console.log('today => ', today)

        const filteredData = arry.filter((row) => {
          const attendanceDate = moment(row.attendancedate).format( "YYYY-MM-DD" );
          return attendanceDate === today;
        });
        setRowsData(filteredData);
        setRowsData1(arry);
      } catch (error) {
        console.error(error);
      }
      //Fetch Staff Name for Attendance.
      const result = await schoolApi.fetchStaffContacts();
      if (result) {
        let ar = [];
        result.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.firstname + " " + item.lastname;
          ar.push(obj);
        //   console.log("ID in useEffect of Contact =>", item.id);
        });
        setOptionUsers(ar);
      } else {
        setOptionUsers([]);
      }
    }

    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userAttendanceArray = [];
    let rowAttanDate = document.querySelector(
      '.attandanceDate [name="attendancedate"]'
    );
    let table = document.querySelector("#myTable");

    let trs = table.querySelectorAll(".data-row");

    for (const tr of trs) {
      let userAttendanceData = {};
      const id = tr.getAttribute("data-id");
      const username = tr.querySelector('.username [name="contactid"]');
      userAttendanceData.contactid = username.value;
      const timein = tr.querySelector(".timein");
      userAttendanceData.timein = timein.value;
      const timeout = tr.querySelector(".timeout");
      userAttendanceData.timeout = timeout.value;
      userAttendanceData.attendancedate = rowAttanDate.value;
      if (id) {
        userAttendanceData.id = id;
        userAttendanceArray.push(userAttendanceData);
      } else {
        userAttendanceArray.push(userAttendanceData);
      }
    }

    let filteredArraywithout = userAttendanceArray.filter((item) => !item.id);
    if (filteredArraywithout.length > 0) {
      console.log("Data of Attendance Before Insert =>", filteredArraywithout);
      const createResult = await schoolApi.createStaffAttendances(
        filteredArraywithout
      );
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: " Record Create successfully",
      });
      //window.location.reload();
    } else {
      let result = await schoolApi.saveStaffAttendance(userAttendanceArray);
      PubSub.publish("RECORD_SAVED_TOAST", {
        title: "Record Saved",
        message: " Record Update successfully",
      });
      navigate("/attendances/");
    }
  };

  const handleChange = (index, event) => {
    let newUserAttendance = [];

    const { name, value } = event.target;
    const list = [...rowsData];
    list[index][name] = value;
    // setRowsData(list);
    const isDuplicate = userAttendance.some(
      (record) => record.contactid === selectedUser
    );
    if (!isDuplicate) {
      newUserAttendance = [
        ...userAttendance,
        {
          [name]: value,
          contactid: selectedUser,
          attendancedate: selectedDate || "",
        },
      ];
    }
    setUserAttendance(newUserAttendance);
  };

  const addTableRows = () => {
    let rowsInput = [
      {
        contactid: "",
        selectedUser: [],
      },
    ];
    setRowsData([...rowsData, ...rowsInput]);
  };

  const deleteTableRows = async (index) => {
    const newRowsData = [...rowsData];
    const deleteId = newRowsData.filter(
      (value, indexx, array) => indexx === index
    )[0].id;
    newRowsData.splice(index, 1);
    setUserAttendance(newRowsData);
    setRowsData(newRowsData);
    const result = await schoolApi.deleteStaffAttend(deleteId);
  };

  const handleCurrentSelectedDate = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    console.log('selectedDate => ', selectedDate);

    const filteredData = rowsData1.filter((row) => {
        console.log('row => ', row, ' --- row.attendancedate => ', row.attendancedate, moment(row.attendancedate).format("YYYY-MM-DD") === selectedDate);
      const attendanceDate = moment(row.attendancedate).format("YYYY-MM-DD");
      return attendanceDate === selectedDate;
    });
    setRowsData(filteredData);
  };

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <PageNavigations colLg={2} colClassName="d-flex mx-5 my-4" extrColumn={12}/>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <Row className="view-form-header align-items-center mx-2">
                <Col lg={3}>Staff Attendance</Col>
                <Col lg={9} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2" type="submit">
                    Save
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row lg={12} className="attandanceDate">
            <Col lg={3}>
              <Form.Group className=" my-3 mx-2" controlId="formBasicCategory">
                <Form.Label className="form-view-label">
                  Attendance Date
                </Form.Label>
                <Form.Control
                  required
                  type="date"
                  className="attendance-date"
                  name="attendancedate"
                  value={selectedDate}
                  onChange={(event) => handleCurrentSelectedDate(event)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={3}></Col>
          </Row>
          <div className="my-5"></div>
          <div className="my-3"></div>
          <Row>
            <Col>
              <Table striped bordered hover id="myTable">
                <thead>
                  <tr>
                    <th>Staff Name </th>
                    <th>Checkin Time</th>
                    <th>CheckOut Time</th>
                    <th style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-outline-success"
                        onClick={addTableRows}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((data, index) => (
                    <tr key={index} data-id={data.id} className="data-row">
                      <td style={{ textAlign: "center", width: "30%" }}>
                        <Form.Group
                          className="mx-2"
                          controlId="formBasicCategory"
                        >
                          <Select
                            required
                            name="contactid"
                            value={data.selectedUser}
                            className="custom-select username"
                            onChange={(event) => handleUsers(index, event)}
                            options={optionUsers}
                            getOptionValue={(option) => option.value}
                          />

                          <Form.Control.Feedback type="invalid">
                            Please Select Attendent Staff.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          width: "25%",
                          height: "37px",
                        }}
                      >
                        <Form.Group controlId="formBasicCategory">
                          <Form.Control
                            type="time"
                            name="timein"
                            className="timein"
                            value={data.timein}
                            onChange={(event) => handleChange(index, event)}
                            // timeFormat="hh:mm A"
                          />
                        </Form.Group>
                      </td>
                      <td style={{ textAlign: "center", width: "25%" }}>
                        <Form.Group controlId="formBasicCategory">
                          <Form.Control
                            type="time"
                            className="timeout"
                            name="timeout"
                            value={data.timeout}
                            onChange={(event) => handleChange(index, event)}
                            // timeFormat="hh:mm A"
                          />
                        </Form.Group>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <Button
                          className="btn-sm mx-2"
                          variant="danger"
                          onClick={() => deleteTableRows(index)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Form>
      </Container>
    </Main>
  );
};

export default UserAttendanceView;
