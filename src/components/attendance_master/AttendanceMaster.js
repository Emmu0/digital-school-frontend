/**
 * @author: Abdul Pathan
 */

import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
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
import AddAttendanceMaster from "./AddAttendanceMaster";

const AttendanceMaster = () => {
    const navigate = useNavigate();
    const [body, setBody] = useState();
    const [rowRecords, setRowRecords] = useState();
    const [modalShow, setModalShow] = useState(false);

    //fetch Records
    const fetchAttendanceMasterRecords = async () => {
        const result = await schoolApi.getAttendanceMasterRecords();//fetch Attendance Master Records
        if (result) {
            setBody(result);
            console.log('Attendance Master Records: ', result)
        } else {
            setBody([]);
        }
    }

    // useEffect
    useEffect(() => { fetchAttendanceMasterRecords(); }, []);


    // Create table headers consisting of  columns.
    const header = [
        {
            title: "Class Name", prop: "class_name", isFilterable: true,
            // cell: (row) => (<Link to={"/line_item_attendance"} state={row}>{row.class_name}</Link>)
        },
        { title: 'Section Name', prop: 'section_name', isFilterable: true },
        { title: 'Lectures', prop: 'total_lectures', isFilterable: true },
        { title: 'Month', prop: 'month', isFilterable: true },
        { title: 'Year', prop: 'year', isFilterable: true },
        { title: 'Type', prop: 'type', isFilterable: true },
        {
            title: 'Actions',
            prop: 'id',
            cell: (row) => {
                return (
                    <>
                        <Button className="btn-sm mx-2 btnHover" variant="primary" onClick={() => handleClick(row)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                            <span class="tooltiptext">Edit</span>
                        </Button>
                        <Button className="btn-sm mx-2 btnHoverAtt" variant="primary" onClick={() => addAttendanceLineItemRecords(row)}>
                            <i className="fa-solid fa-users"></i>
                            <span class="tooltiptextAtt">Check Attendance</span>
                        </Button>
                    </>
                );
            },
        }
    ];


    //record
    const handleClick = (row) => {
        if (row.id) {
            setModalShow(true);
            setRowRecords(row);
        } else {
            setModalShow(true);
            setRowRecords({});
        }
    }

    const addAttendanceLineItemRecords = (row) => {
        console.log('what is in row==>',row)
        navigate('/add_attendance_line_item', { state: row })
    }
    const attendanceLineItemList = () => {
        navigate('/update_attendance_line_item');
        // navigate('/line_item_attendance', { state: row })
    }

    //Randomize data of the table columns. Note that the fields are all using the `prop` field of the headers.
    const labels = {
        beforeSelect: " "
    }

    const recordSaveSuccesfully = () => {
        fetchAttendanceMasterRecords();
        setModalShow(false);
    }


    return (
        <Main>
            <Row className="g-0">
                <Col lg={10} className="mx-4">
                    <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Attendances <i className="fa-solid fa-chevron-right"></i><strong> Attendance Master</strong> </Link>
                </Col>

                <Col lg={12} className="p-lg-5">
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
                                    className="d-flex flex-col justify-content-end align-items-end"
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
                                        <InfoPill left="Total Attendance Master" right={body?.length} />
                                    </div>
                                </Col>
                                <Col
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    className="d-flex flex-col justify-content-end align-items-end"
                                >
                                    <Button className="mx-2" variant="success" onClick={handleClick} >
                                        <i className="fa-solid fa-plus"></i>
                                    </Button>
                                    <Button className="mx-2" variant="primary" onClick={attendanceLineItemList}>
                                        <i className="fa-solid fa-user-pen fa-beat"></i>
                                    </Button>
                                </Col>

                            </Row>
                            <Table striped className="data-table custom-table">
                                <TableHeader />
                                <TableBody />
                            </Table>
                            <Pagination />
                        </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
                </Col>
                <Col lg={2}></Col>
            </Row>

            {modalShow && (
                <AddAttendanceMaster
                    show={modalShow}
                    parent={rowRecords}
                    onHide={() => setModalShow(false)}
                    recordSaveSuccesfully={recordSaveSuccesfully}
                />
            )}

            <ToastContainer />
        </Main>
    )
}

export default AttendanceMaster
