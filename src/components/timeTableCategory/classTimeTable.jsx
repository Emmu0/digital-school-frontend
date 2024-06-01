import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import schoolApi from "../../api/schoolApi";
import { Helmet } from "react-helmet";
import "../../resources/css/Student.css";
import { ToastContainer } from 'react-toastify';
import Select from "react-select";
const ClassTimeTable = (props) => {
    const [openDays, setOpenDays] = useState({});
    const toggleCollapse = (day) => {
        setOpenDays(prevState => ({
            ...prevState,
            [day]: !prevState[day]
        }));
    };
    const [showTable, setShowTable] = useState(false);
    const [optionClass, setOptionClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState();
    const [optionSection, setOptionSection] = useState([]);
    const [selectedSection, setSelectedSection] = useState();
    const [selectedYear, setSelectedYear] = useState('');
    const [optionSession, setOptionSession] = useState([]);
    const [selectedSession, setSelectedSession] = useState();
    const [timeTable, setTimeTable] = useState([]);
    const [timeTableClass, setTimeTableClass] = useState([]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    function convertTo12HourFormat(time24Hour) {
        const [hours, minutes] = time24Hour.split(':').map(Number); // Parse hours and minutes as integers
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = (hours % 12) || 12;
        return `${hours12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
    }

    useEffect(() => {
        fetchRecords();
        fetchClassRecords();
    }, []);

    const fetchClassRecords = async () => {
        const result = await schoolApi.getClassRecords(true); //fetch class records
        if (result) {
            let ar = [];
            result.map((item) => {
                var obj = {};
                obj.value = item.id;
                obj.label = item.classname;
                ar.push(obj);
            });
            setOptionClass(ar);
        }

    }
    const fetchRecords = async () => {
        console.log('imside the fetchRecords');
        const sessionRecords = await schoolApi.fetchSessions(); //fetch session records
        console.log('##Session records', sessionRecords)
        if (sessionRecords) {
            let ar = [];
            sessionRecords.map((item) => {
                var obj = {};
                obj.value = item.id;
                obj.label = item.year;
                ar.push(obj);
            });
            setOptionSession(ar);
        }
    }
    const fetchSectionRecord = async (classId) => {
        if (classId) {
            let sectionData = await schoolApi.getSectionRecordById(classId); //fetch session records
            console.log('##sectionData', sectionData.record)
            if (sectionData.success) {
                let arr = [];
                sectionData.record.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.name;
                    arr.push(obj);
                });
                setOptionSection(arr);
            } else {
                setOptionSection()
            }
        }
    }
    const getTimeTableRecord = async (res) => {
        console.log('RESS78=>', res);
        const timetableData = await schoolApi.getTimeTableRecord(res.class_id, res.section_id);
        console.log('##timetableData', timetableData)
        if (timetableData.length > 0) {
            timetableData?.map((item) => {
                if (item.start_time && item.end_time) {
                    const startTime = convertTo12HourFormat((item.start_time));
                    const endTime = convertTo12HourFormat((item.end_time));
                    console.log('time12Hour$%%^%', startTime, endTime); // Output: "4:15 PM"
                    item.period_time = `${startTime} to ${endTime}`;
                }
            });
            console.log('what is n-->', timetableData)
            setTimeTableClass(timetableData);
        } else {
            setTimeTableClass([])
        }
    }

    // handle change session
    const handleChangeSession = (e) => {
        setSelectedSession(e);
    }
    //handle change class
    const handleChangeClass = (e) => {
        console.log('e.target.name%@^%^#=>', e.target);
        setSelectedSection(null);
        setSelectedClass(e);
        fetchSectionRecord(e.value)
        setTimeTable({ ...timeTable, class_id: e.value });
    };
    // handle change section
    const handleChangeSection = (e) => {
        setSelectedSection(e);
        setShowTable(true);
        let res = {
            ...timeTable,
            section_id: e.value
        }
        getTimeTableRecord(res);

    }

    return (
        <Main>
            <Helmet>
                <title>{props?.tabName}</title>
            </Helmet>
            <Card className="m-3 custom-card" style={{ background: "#1a293b", color: "white" }}>
                <Row className="g-0 ">
                    <Col lg={10} className="mx-4">
                        <span className="" style={{ fontWeight: "Arial", fontSize: "20px" }}>Time Table</span>
                        <Link className="mt-3 nav-link" to="/timetable" style={{ fontSize: "15px" }}>Home <i className="fa-solid fa-chevron-right"></i> <strong>Timetable <i className="fa-solid fa-chevron-right"></i></strong><strong> Class Wise Time Table</strong> </Link>
                    </Col>
                </Row>
            </Card>
            <Card className="m-4 custom-card">
                <Container fluid style={{ marginTop: '15px' }}>
                    <Row>
                        <Col lg={12} className="text-center">
                            <h3 style={{ fontWeight: "bold" }}>Class Time Table</h3>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col lg={4}>
                            {optionClass && (
                                <Form.Group>
                                    <Form.Label className="form-view-label feeElement" htmlFor="formBasicClass">Class Name</Form.Label>
                                    <Select
                                        required
                                        className="custom-select username"
                                        placeholder="Select Class Name"
                                        name="class_id"
                                        onChange={handleChangeClass}
                                        value={selectedClass}
                                        options={optionClass}
                                    ></Select>
                                </Form.Group>
                            )}
                        </Col>
                        <Col lg={4}>
                            <Form.Group>
                                <Form.Label className="form-view-label headingTimeTable" htmlFor="formBasicClass" >Section Name</Form.Label>
                                <Select
                                    required
                                    className="custom-select username mx-2"
                                    placeholder="Select Section Name"
                                    name="section_id"
                                    onChange={handleChangeSection}
                                    value={selectedSection}
                                    options={optionSection}
                                ></Select>
                            </Form.Group>
                        </Col>
                        <Col lg={4}>
                        </Col>
                    </Row>
                    {showTable &&
                        <Row className="mt-2">
                            <Col lg={12} className="">
                                <div>
                                    {timeTableClass && timeTableClass.length > 0 ? (
                                        timeTableClass.map((value, index) => (
                                            <div key={index} onClick={() => toggleCollapse(value.day)}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: "#1a293b",
                                                    color: "white",
                                                    paddingLeft: "3px",
                                                    paddingTop: "13px",
                                                    opacity: "0.7",
                                                    paddingBottom: "7px",
                                                    paddingRight: "3px",
                                                }}
                                                className="mt-5">
                                                <h5 style={{ paddingBottom: "1px" }}>
                                                    {openDays[value.day] ? <FaChevronUp /> : <FaChevronDown />} {value.day}
                                                </h5>
                                                
                                                {openDays[value.day] && (
                                                    <div style={{ backgroundColor: 'white', padding: '20px', color: "black" }}>
                                                        {console.log('value daysWWW=>', value)}
                                                        {value.map((innerValue, index) =>
                                                            <Row key={index} className="mt-2">
                                                                <Row>
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Class Name : </span> <span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.classname}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Section Name : </span><span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.section_name}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Teacher Name : </span><span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.contact_name}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mt-3">
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Subject Name : </span><span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.subject_name}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Period Time : </span> <span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.period_time}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col lg={4}>
                                                                        <Form.Group>
                                                                            <Form.Label><span style={{ fontWeight: "bold", fontFamily: "Arial", fontSize: "14px" }}>Time Slot Type : </span> <span style={{ fontSize: "13px", fontFamily: "Arial" }}>{innerValue.type}</span></Form.Label>
                                                                        </Form.Group>
                                                                    </Col>
                                                                </Row>
                                                            </Row>
                                                        )}
                                                    </div>

                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="mt-5 mx-2">
                                            <Card className="m-4 custom-card text-center" style={{ backgroundColor: "rgb(237 49 49)", color: "white" }}>
                                                <span style={{ fontSize: "15px", fontWeight: "bold" }}>Class time table records are not available</span>
                                            </Card>
                                        </div>
                                    )}

                                </div>
                            </Col>
                        </Row>
                    }
                    <ToastContainer />
                </Container>
            </Card>
        </Main>
    );
};
export default ClassTimeTable;