import React, { useEffect, useState } from "react";

import { Badge, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import BarChart from "../charts/BarChart";
import PieChart from "../charts/PieChart";
// import schoolApi from "../../api/schoolApi";
import Main from "../../components/layout/Main";
import { Helmet } from "react-helmet";

const Home = (props) => {
  // const [countOfParents, setCountOfParents] = useState([]);
  // const [countOfStaffs, setCountOfStaffs] = useState([]);
  // const [countOfstudents, setCountOfstudents] = useState([]);
  // const [countOfClasses, setCountOfClasses] = useState([]);

  useEffect(() => {
    async function init() {
      //const parents = await schoolApi.fetchCountOfParents();
      //const staffs = await schoolApi.fetchCountOfStaffs();
      // const students = await schoolApi.fetchCountOfStudents();
      // const classes = await schoolApi.fetchCountOfClasses();
      
      // if (classes && classes.length) {
      //   setCountOfClasses(classes[0].totalclases);
      // } else {
      //   setCountOfClasses([]);
      // }
      // if (parents && parents.length) {
      //   setCountOfParents(parents[0].totalparents);
      // } else {
      //   setCountOfParents([]);
      // }
      // if (staffs && staffs.length) {
      //   setCountOfStaffs(staffs[0].totalstaffs);
      // } else {
      //   setCountOfStaffs([]);
      // }
      // if (students && students.length) {
      //   setCountOfstudents(students[0].totalstudents);
      // } else {
      //   setCountOfstudents([]);
      // }
     
    }
    init();
  }, []);

  return (
    <Main>
     <Helmet> <title>{props?.tabName}</title> </Helmet>
      <Container>
        <Row>
          <Col lg={3}>
            <Link to="/classes" className="text-decoration-none text-reset">
              <div
                className="p-3 d-flex align-items-center m-3"
                style={{
                  backgroundColor: "white",
                  borderLeft: "4px solid #198754",
                }}
              >
                {/* <i className="flex-shrink-0 me-3 fa-solid fa-building fa-3x circle-icon" style={{color: 'green'}}></i> */}

                <span className="fa-stack small">
                  <i
                    className="fa-solid fa-circle fa-stack-2x"
                    style={{ color: "#198754" }}
                  ></i>
                  <i
                    className="fa-solid fa-shapes fa-stack-1x"
                    style={{ color: "white", fontSize: "2rem" }}
                  ></i>
                </span>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">REGISTERED CLASSES</h6>
                  {/* <h1 className="mb-0 d-inline ">{countOfClasses}</h1> */}
                  <h1 className="mb-0 d-inline ">12</h1>
                  <Badge bg="light" text="dark">
                    Classes
                  </Badge>
                </div>
              </div>
            </Link>
          </Col>
          <Col lg={3}>
            <Link to="/section" className="text-decoration-none text-reset">
              <div
                className="p-3 d-flex align-items-center m-3"
                style={{
                  backgroundColor: "white",
                  borderLeft: "4px solid tomato",
                }}
              >
                {/* <i className="flex-shrink-0 me-3 fa-solid fa-building fa-3x circle-icon" style={{color: 'green'}}></i> */}

                <span className="fa-stack small">
                  <i
                    className="fa-solid fa-circle fa-stack-2x"
                    style={{ color: "tomato" }}
                  ></i>
                  <i
                    className="fa-solid fa-person-walking fa-stack-1x"
                    style={{ color: "white", fontSize: "2rem" }}
                  ></i>
                </span>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1 ">COUNTS OF SECTIONS</h6>
                  {/* <h1 className="mb-0 d-inline ">{countOfParents}</h1> */}
                  <h1 className="mb-0 d-inline ">4</h1>
                  <Badge bg="light" text="dark">
                    Section
                  </Badge>
                </div>
              </div>
            </Link>
          </Col>
          <Col lg={3}>
            <Link
              to="/students"
              className="text-decoration-none text-reset"
            >
              <div
                className="p-3 d-flex align-items-center m-3"
                style={{
                  backgroundColor: "white",
                  borderLeft: "4px solid #1a293b",
                }}
              >
                {/* <i className="flex-shrink-0 me-3 fa-solid fa-building fa-3x circle-icon" style={{color: 'green'}}></i> */}

                <span className="fa-stack small">
                  <i
                    className="fa-solid fa-circle fa-stack-2x"
                    style={{ color: "#1a293b" }}
                  ></i>
                  <i
                    className="fa-solid fa-people-group fa-stack-1x"
                    style={{ color: "white", fontSize: "2rem" }}
                  ></i>
                </span>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">REGISTERED STUDENTS</h6>
                  {/* <h1 className="mb-0 d-inline ">{countOfstudents}</h1> */}
                  <h1 className="mb-0 d-inline ">70</h1>
                  <Badge bg="light" text="dark">
                    Students
                  </Badge>
                </div>
              </div>
            </Link>
          </Col>
          
          <Col lg={3}>
            <Link to="/contact/staff" className="text-decoration-none text-reset">
              <div
                className="p-3 d-flex align-items-center m-3"
                style={{
                  backgroundColor: "white",
                  borderLeft: "4px solid tomato",
                }}
              >
                {/* <i className="flex-shrink-0 me-3 fa-solid fa-building fa-3x circle-icon" style={{color: 'green'}}></i> */}

                <span className="fa-stack small">
                  <i
                    className="fa-solid fa-circle fa-stack-2x"
                    style={{ color: "tomato" }}
                  ></i>
                  <i
                    className="fa-solid fa-people-group fa-stack-1x"
                    style={{ color: "white", fontSize: "2rem" }}
                  ></i>
                </span>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1 ">REGISTERED STAFF</h6>
                  {/* <h1 className="mb-0 d-inline ">{countOfStaffs}</h1> */}
                  <h1 className="mb-0 d-inline ">25</h1>
                  <Badge bg="light" text="dark">
                    Staff
                  </Badge>
                </div> 
              </div>
            </Link>
          </Col>
         
        </Row>
        <Row className="mt-5">
          <Col lg={6} className="text-center ">
            <p>Monthly Income Expense</p>
            <div style={{ height: "400px" }}>
              <BarChart />
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <p className="d-block">Class Wise Student Strength</p>
            <div className="text-center" style={{ height: "400px" }}>
              <PieChart />
            </div>
          </Col>
        </Row>
      </Container>
    </Main>
  );
};

export default Home;
