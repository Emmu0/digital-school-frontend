/**
 * @author: Abdul Pathan
 */
import React, { useEffect, useState } from "react";
import Main from '../layout/Main'
import { Col, Container, Row, Button, Table, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { Link, useNavigate } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import moment from 'moment';
import Select from "react-select";
// import monthData from "./month_date.json";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    DatatableWrapper,
    // Filter,
    Pagination,
    PaginationOptions,
    // TableBody,
    // TableHeader
} from 'react-bs-datatable';

const ViewAttendanceLineItem = () => {
    const navigate = useNavigate();
    const [optionClass, setOptionClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState();

    const [optionSection, setOptionSection] = useState([]);
    const [selectedSection, setSelectedSection] = useState();

    // const [optionDayMonth, setOptionDayMonth] = useState([]);
    // const [selectedDayMonth, setSelectedDayMonth] = useState();

    const [attendanceLineItems, setAttendanceLineItems] = useState({ class_id: "", section_id: "", month: "", year: "", date: "" });

    const [body, setBody] = useState();
    const [allDays, setAllDays] = useState([]);

    useEffect(() => {
        fetchRecords();
    }, []);

    // fetch class Records
    const fetchRecords = async () => {
        const result = await schoolApi.getClassRecords('active'); //fetch class records
        if (result) {
            let ar = [];
            // eslint-disable-next-line array-callback-return
            result.map((item) => {
                var obj = {};
                obj.value = item.id;
                obj.label = item.classname;
                ar.push(obj);
            });
            setOptionClass(ar);
        }
    }

    // fetch section Records
    const fetchSectionRecord = async (classId) => {
        if (classId) {
            let sectionData = await schoolApi.getSectionRecordById(classId); //fetch session records
            if (sectionData.success) {
                let arr = [];
                // eslint-disable-next-line array-callback-return
                sectionData.record.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.name;
                    arr.push(obj);
                });
                setOptionSection(arr);
            } else {
                setOptionSection([])
            }
        }
    }


    //handle change class
    const handleChangeClass = (e) => {
        setSelectedSection(null);
        setSelectedClass(e);
        setAttendanceLineItems({ ...attendanceLineItems, class_id: e.value });
        fetchSectionRecord(e.value)
    }

    // handle change section
    const handleChangeSection = (e) => {
        setSelectedSection(e);
        setAttendanceLineItems({ ...attendanceLineItems, section_id: e.value });
    }

    // handle change month year
    const handleChange = (e) => {
        setAttendanceLineItems({ ...attendanceLineItems, [e.target.name]: e.target.value })
    }


    // Create table headers consisting of  columns.
    const header = [
        { title: 'Student Name', prop: 'student_name', isFilterable: true },
        ...(body
            ? body.map((data, index) => ({
                title: index + 1, // Use the date as the title
                prop: index, // You can adjust this as needed
            }))
            : [])
    ];

    //Randomize data of the table columns. Note that the fields are all using the `prop` field of the headers.
    const labels = {
        beforeSelect: " "
    }

    // fetch records
    const fetchTableRecords = (body, allDays) => {
        return body.map((student) => {
            const studentData = [];
            studentData.push(<td key={`student_name-${student.student_name}`}>{student.student_name}</td>);
            // studentData.push(<td key={`student-name-${student.student_name}`}>{student.student_name}</td>);

            allDays.forEach((date, index) => {
                // const formattedDate = date.padStart(2, '0');
                const attendanceRecord = student.attendance.find(
                    (report) => {
                        return moment(report.date).format("DD") === date;
                    });

                // console.log('attendanceRecord for date', date, attendanceRecord);

                const cellContent = (attendanceRecord && attendanceRecord.status !== null) ? (attendanceRecord.status === 'present') ? "P" : "A" : "H";
                const isAbsent = cellContent === "A";
                const isPresent = cellContent === "P";

                const cellStyle = {
                    // backgroundColor: isAbsent ? "#FF5D5D" : "#FFFFFF",
                    color: isAbsent ? "red" : isPresent ? '#008015' : 'blue',
                    fontSize: "medium",
                    fontFamily: "Times New Roman Times serif"
                };

                studentData.push(
                    <td key={`attendance-${student.student_name}-${date}`} style={cellStyle}>
                        {cellContent}
                    </td>
                );
            });

            return <tr key={`student-row-${student.student_name}`}>{studentData}</tr>;
        });
    };

    // month year accourding to day by day
    const selectMonthYear = (month, year) => {
        // console.log('Month year', month, year)
        // selectMonth = selectMonth.charAt(0).toUpperCase() + selectMonth.slice(1);
        const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD");
        const endDate = startDate.clone().endOf("month");

        const daysDate = [];
        let currentDate = startDate.clone();

        while (currentDate.isSameOrBefore(endDate)) {
            daysDate.push(currentDate.format("DD"));
            currentDate.add(1, "day");
        }
        setAllDays(daysDate)
        return daysDate;
    }

    //search record
    const handleSearch = async () => {
        // e.preventDefault();

        console.log('handle Search', attendanceLineItems)
        // console.log('setOptionMonth', optionDayMonth)

        if ((attendanceLineItems.class_id && attendanceLineItems.class_id.trim() !== "") &&
            (attendanceLineItems.section_id && attendanceLineItems.section_id.trim() !== "") &&
            (attendanceLineItems.month && attendanceLineItems.month.trim() !== "") &&
            (attendanceLineItems.year && attendanceLineItems.year.trim() !== "")
        ) {

            let abc = selectMonthYear(attendanceLineItems.month, attendanceLineItems.year);
            console.log('object abc', abc)

            const startDate = moment(`${attendanceLineItems.year}-${attendanceLineItems.month}-01`, "YYYY-MM-DD");
            const endDate = startDate.clone().endOf("month");
            const formattedStartDate = startDate.format('YYYY-MM-DD');
            const formattedEndDate = endDate.format('YYYY-MM-DD');


            const atLineItem = {
                class_id: attendanceLineItems.class_id,
                section_id: attendanceLineItems.section_id,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                date: ''
            }

            if (atLineItem) {
                const responceAtLineItem = await schoolApi.getAttendanceLineItemRecords(atLineItem);
                console.log('if handleSearch###', responceAtLineItem)
                if (responceAtLineItem.success) {
                    const groupedReports = {};
                    responceAtLineItem.records.forEach((item) => {
                        const key = `${item.student_name}`;
                        if (!groupedReports[key]) {
                            groupedReports[key] = {
                                student_name: item.student_name,
                                attendance: [],
                            };
                        }
                        groupedReports[key].attendance.push(item);
                    });

                    const flattenedReports = Object.values(groupedReports);
                    // console.log('flattenedReports', flattenedReports)
                    setBody(flattenedReports);
                }
                else {
                    setBody([]);
                }
            }


        } else {
            toast.error("Required field missing!", { position: toast.POSITION.TOP_RIGHT });
        }


    }

    const handleCancel = () => {
        navigate('/attendance_master')
    }

    return (
        <Main>

            <Container className="pb-5">
                <Row>
                    <Col lg={10} className="mx-4">
                        <Link className="nav-link" to="/attendance_master">Home <i className="fa-solid fa-chevron-right"></i> Attendance <i className="fa-solid fa-chevron-right"></i><strong> Attendance Line Item</strong> </Link>
                    </Col>
                    {/* <Col lg={12} className="pb-5"></Col> */}
                </Row>
            </Container>

            <Container className="mt-5">
                <Row className="mx-5">
                    <Col lg={12}>
                        <Row className="view-form-header align-items-center">
                            <Col lg={3}>Attendance Show According To Monthly</Col>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Button className="btn-sm mx-2" variant="danger" onClick={handleCancel}>Cancel</Button>
                                {/* <Button className="btn-sm mx-2" variant="success">Import</Button> */}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className="mx-5">
                    <Col lg={10}>
                        <Row className="mt-3">
                            <Col lg={2}>
                                {optionClass && (
                                    <Form.Group>
                                        <Form.Label className="form-view-label mx-2" htmlFor="formBasicClass" >Class Name</Form.Label>
                                        <Select
                                            required
                                            className="custom-select username"
                                            placeholder="Class name"
                                            name="class_id"
                                            onChange={handleChangeClass}
                                            value={selectedClass}
                                            options={optionClass}
                                        ></Select>
                                    </Form.Group>
                                )}
                            </Col>
                            <Col lg={2}>
                                {optionSection && (
                                    <Form.Group>
                                        <Form.Label className="form-view-label mx-2" htmlFor="formBasicClass" >Section Name</Form.Label>
                                        <Select
                                            required
                                            className="custom-select username"
                                            placeholder="Section name"
                                            name="section_id"
                                            onChange={handleChangeSection}
                                            value={selectedSection}
                                            options={optionSection}
                                        ></Select>
                                    </Form.Group>
                                )}
                            </Col>


                            {/* <Col lg={2}>
                                            {optionDayMonth && (
                                                <Form.Group>
                                                    <Form.Label className="form-view-label mx-3" htmlFor="formBasicClass" >Month Name</Form.Label>
                                                    <Select
                                                        required
                                                        className="custom-select username mx-2"
                                                        placeholder="Month name"
                                                        name="month"
                                                        onChange={handleChangeMonth}
                                                        value={selectedDayMonth}
                                                        options={optionDayMonth}
                                                    ></Select>
                                                </Form.Group>
                                            )}
                                        </Col> */}
                            <Col lg={2}>
                                <Form.Group >
                                    <Form.Label className="form-view-label" htmlFor="formBasicFirstName">Month Name</Form.Label>
                                    <Form.Select
                                        required
                                        type="text"
                                        name="month"
                                        value={attendanceLineItems.month}
                                        onChange={handleChange}
                                    >
                                        <option value="">None</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col lg={2}>
                                <Form.Group >
                                    <Form.Label className="form-view-label" htmlFor="formBasicFirstName">Session Year</Form.Label>
                                    <Form.Select
                                        required
                                        type="text"
                                        name="year"
                                        value={attendanceLineItems.year}
                                        onChange={handleChange}
                                    >
                                        <option value="">None</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col lg={2} className="mt-1">
                                <Button className="mt-4 mx-4" variant="primary" onClick={() => handleSearch()}>Search</Button>
                                {/* <Button className="mt-4 " variant="success">Import</Button> */}
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Container>


            <Container>
                <Row className="mx-5">
                    <Col lg={12}>

                        {body && (body ? (

                            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{ initialState: { rowsPerPage: 15, options: [5, 10, 15, 20] } }}>

                                <Row className="mb-4">
                                    <Col className="d-flex flex-col justify-content-end align-items-start" xs={12} sm={6} lg={12} >
                                        <div style={{ "marginTop": "5px" }}>
                                            <InfoPill left="Total Attendances " right={body?.length} />
                                        </div>
                                        <PaginationOptions labels={labels} />
                                    </Col>
                                </Row>

                                <Table striped className="data-table">
                                    {/* <TableHeader />
                                    <TableBody /> */}
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            {allDays && allDays.map((day, index) => (
                                                <th key={index}>{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchTableRecords(body, allDays)}
                                        {body.length === 0 ? (<div className="p-2 bd-highlight">No records found.</div>) : ('')}

                                    </tbody>

                                </Table>
                                <Pagination />
                            </DatatableWrapper>

                        )
                            : <ShimmerTable row={10} col={8} />
                        )}
                    </Col>
                    <Col lg={2}></Col>
                </Row>

            </Container>

            <ToastContainer />

        </Main>
    )
}

export default ViewAttendanceLineItem
