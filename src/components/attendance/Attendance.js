/**
 * @author: Abdul Pathan
 */

import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Col, Row, Table, Button, Container } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from 'react-bs-datatable';

const Attendance = () => {
    const navigate = useNavigate();
    const [body, setBody] = useState();

    // fetch fees head record
    const fetchAttendanceMasterRecords = async () => {
        const result = await schoolApi.getAttendanceRecords();//fees head records
        if (result) {
            setBody(result);
            console.log('Attendance Master Records: ', result)
        } else {
            setBody([]);
        }
    }

    useEffect(() => { fetchAttendanceMasterRecords(); }, []);

    // Create table headers consisting of  columns.
    const header = [
        { title: 'Student Name', prop: 'student_name', isFilterable: true },
        { title: 'Class Name', prop: 'class_name', isFilterable: true },
        { title: 'Section', prop: 'section_name', isFilterable: true },
        { title: 'Total Present', prop: 'present' },
        { title: 'Total Absent', prop: 'absent' },
        // { title: 'Session Year', prop: 'session_year', isFilterable: true },
    ];

    //Randomize data of the table columns. Note that the fields are all using the `prop` field of the headers.
    const labels = {
        beforeSelect: " "
    }

    // const monthlyAttendance = () => {
    //     navigate('/attendance_master');
    // }
    return (
        <Main>
            <Row className="g-0">
                <Col lg={10} className="mx-4">
                    <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Attendances <i className="fa-solid fa-chevron-right"></i><strong> Attendance</strong> </Link>
                </Col>
            </Row>

            <Container>
                <Row className="p-lg-5">
                    <Col lg={12} >
                        {body ?
                            <DatatableWrapper
                                body={body}
                                headers={header}
                                rowIndexColumn
                                paginationOptionsProps={{
                                    initialState: {
                                        rowsPerPage: 15,
                                        options: [5, 10, 15, 20]
                                    }
                                }}>
                                <Row className="mb-4">
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={3}
                                        className="d-flex flex-col align-items-end justify-content-start"
                                    >
                                        <Filter />
                                    </Col>
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={5}
                                        className="d-flex flex-col justify-content-start align-items-start"
                                    >
                                        <PaginationOptions labels={labels} />
                                        <div style={{ "marginTop": "5px" }}>
                                            <InfoPill left="Total Attendances" right={body?.length} />
                                        </div>
                                    </Col>
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        className="d-flex flex-col justify-content-end align-items-end"
                                    >
                                        {/* <Button variant="primary" className="mx-2" onClick={monthlyAttendance}><i className="fa-solid fa-list"></i></Button> */}
                                    </Col>
                                </Row>
                                <Table striped className="data-table custom-table">
                                    <TableHeader />
                                    <TableBody />
                                </Table>
                                <Pagination />
                            </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
                    </Col>
                    {/* <Col lg={2}></Col> */}
                </Row>
            </Container>

            <ToastContainer />
        </Main>
    )
}

export default Attendance
