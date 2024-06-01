import React, { useState, useEffect } from "react";
import schoolApi from "../../api/schoolApi";
import { Col, Row } from "react-bootstrap";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Card from "react-bootstrap/Card";
import Studentadmission from "../AdmissionRelatedList/Studentadmission";
import Parents from "../AdmissionRelatedList/Parents";
import moment from "moment";
import Sibling from "../AdmissionRelatedList/Sibling";
import Attendance from "../AdmissionRelatedList/Attendance";
import Fees from "../AdmissionRelatedList/Fees";


const StudentAddRelatedList = (props) => {
  console.log('props1222=>', props.studentaddmission.gender)
  console.log('studentid@@=>', props)
  const [selectedTab, setSelectedTab] = useState('Details');
  const [tabs, setTabs] = useState([
    "Details",
    "Parents",
    "Siblings",
    "StudentAdmission",
    "Attendance",
    "Fees"
  ]);
  const [student, setStudent] = useState(true);
  const [studentDetail, setStudentDetail] = useState([]);



  useEffect(() => {
    fetchStudents(); // Call fetchStudents when props.studentId changes
  }, [props.studentaddmission.studentid]);

  const fetchStudents = async () => {
    console.log('props.studnet->', props.studentaddmission)
    const result = await schoolApi.fetchStudentbyId(props?.studentaddmission?.studentid);
    console.log('result==>', result)
    if (result.success === true) {
      setStudentDetail(result);
    }
    else {
      setStudentDetail([]);
    }

  }
  const handleMainTab = async (e, tabname) => {
    try {
      if (tabname === "Details") {
        console.log("Details13233");
        setStudent(true);
        setSelectedTab(tabname);
      }
      if (tabname === "StudentAdmission") {
        console.log("StudentAdmission");
        setSelectedTab(tabname);
      }
      if (tabname === "Parents") {
        console.log("Parents");
        setSelectedTab(tabname);
      }
      if (tabname === "Siblings") {
        console.log("Siblings");
        setSelectedTab(tabname);
      }
      if (tabname === "Attendance") {
        console.log("Attendance");
        setSelectedTab(tabname);
      }
      if (tabname === "Fees") {
        console.log("Fees");
        setSelectedTab(tabname);
      }
    } catch (error) {
      console.log('error=>', error)
    }
  };


  return (
    <>
      {console.log('3233')}
      <Card>
        <TabContext>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList aria-label="lab API tabs example">
              {tabs.map((tab, index) => (
                <Tab
                  label={tab}
                  key={index}
                  onClick={(e) => handleMainTab(e, tab)}
                  style={{ color: 'black' }}
                  selected={selectedTab === tab}
                  sx={{
                    color: selectedTab === tab ? 'blue' : 'black',
                    borderBottom: selectedTab === tab ? '1px solid blue' : 'none'
                  }}
                >
                </Tab>
              ))}
            </TabList>
            {console.log('selectedtab=>', selectedTab)}
            {console.log('props.studentadmission=>', props.studentadmission)}
            {selectedTab === "Parents" && (
              <div>
                {console.log('Parents')}
                <Parents parentid={props.studentaddmission.parentid} />
              </div>
            )}
            {selectedTab === "Siblings" && (
              <div>
                {console.log('Siblings', props.studentaddmission)}
                <Sibling parentid={props.studentaddmission.parentid} studentid={props.studentaddmission.id} />
              </div>
            )}
            {selectedTab === "StudentAdmission" && (
              <div>
                {console.log('first')}
                <Studentadmission student_id={props.studentaddmission.id} />
              </div>
            )}
            {selectedTab === "Attendance" && (
              <div>
                {console.log('first')}
                <Attendance studenId={props.studentaddmission.id} />
              </div>
            )}
            {selectedTab === "Fees" && (
              <div>
                {console.log('first')}
                <Fees studenId={props.studentaddmission.id} />
              </div>
            )}

          </Box>
          {console.log('student@@=>@=>', student)}
          {console.log('stu==============>', studentDetail)}

          {(selectedTab == "Details" && student) && (
            <>
              <Row className="mb-2">
                <Col lg={12}></Col>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Serial No</label>
                    <span>{studentDetail.length > 0 ? studentDetail.srno : props.studentaddmission.srno}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Student Name</label>
                    <span>{studentDetail.length > 0 ? studentDetail.studentname : props.studentaddmission.studentname}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Religion</label>
                    <span>{studentDetail.length > 0 ? studentDetail.religion : props.studentaddmission.religion}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Date of Birth</label>
                    <span>
                      {moment(studentDetail.length > 0 ? studentDetail.dateofbirth : props.studentaddmission.dateofbirth).format(
                        "MMMM Do, YYYY"
                      )}{" "}
                    </span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Gender</label>
                    <span>{studentDetail.length > 0 ? studentDetail.gender : props.studentaddmission.gender}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Email</label>
                    <span>{studentDetail.length > 0 ? studentDetail.email : props.studentaddmission.email}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Adhar Number</label>
                    <span>{studentDetail.length > 0 ? studentDetail.adharnumber : props.studentaddmission.adharnumber}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Phone</label>
                    <span>{studentDetail.length > 0 ? studentDetail.email : props.studentaddmission.phone}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Pincode</label>
                    <span>{studentDetail.length > 0 ? studentDetail.pincode : props.studentaddmission.pincode}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Street</label>
                    <span>{studentDetail.length > 0 ? studentDetail.street : props.studentaddmission.street}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>City</label>
                    <span>{studentDetail.length > 0 ? studentDetail.city : props.studentaddmission.city}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>State</label>
                    <span>{studentDetail.length > 0 ? studentDetail.state : props.studentaddmission.state}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Country</label>
                    <span>{studentDetail.length > 0 ? studentDetail.country : props.studentaddmission.country}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Permanent Street</label>
                    <span>{studentDetail.length > 0 ? studentDetail.permanentstreet : props.studentaddmission.permanentstreet}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Permanent City</label>
                    <span>{studentDetail.length > 0 ? studentDetail.city : props.studentaddmission.city}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Permanent Postal Code</label>
                    <span>{studentDetail.length > 0 ? studentDetail.permanentpostalcode : props.studentaddmission.permanentpostalcode}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Permanent State</label>
                    <span>{studentDetail.length > 0 ? studentDetail.permanentstate : props.studentaddmission.permanentstate}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Permanent Country</label>
                    <span>{studentDetail.length > 0 ? studentDetail.permanentcountry : props.studentaddmission.permanentcountry}</span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Category</label>
                    <span>{studentDetail.length > 0 ? studentDetail.category : props.studentaddmission.category}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Class Name</label>
                    <span>{studentDetail.length > 0 ? studentDetail.classname : props.studentaddmission.classname}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Parent Name</label>
                    <span>{studentDetail.length > 0 ? studentDetail.parentname : props.studentaddmission.parentname}</span>
                  </Col>
                </Row>

                <Row>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Vehical Name</label>
                    <span>{studentDetail.length > 0 ? studentDetail.vehicle_name : props.studentaddmission.vehicle_name}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Section Name</label>
                    <span>{studentDetail.length > 0 ? studentDetail.section_name : props.studentaddmission.section_name}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={3}>
                    <label>Description</label>
                    <span>{props.studentaddmission.description}</span>
                  </Col>
                </Row>
              </Row>
            </>
          )}
        </TabContext>
      </Card>
    </>
  );
};
export default StudentAddRelatedList;