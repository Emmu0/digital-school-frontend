/**
 * @author: Abdul Pathan
 */

import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
// import PubSub from "pubsub-js";
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from 'react-bs-datatable';
import AddClass from "./AddClass";
import AddSection from "../section/AddSection";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confirm from "../Confirm";

const ClassList = () => {
    const [body, setBody] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [rowRecords, setRowRecords] = useState();
    const [statusRow, setStatusRow] = useState(undefined);
    const [addModalShow, setAddModalShow] = useState(false);

    //fetch fees head record
    const fetchClassRecords = async () => {
        const result = await schoolApi.getClassRecords();
        if (result) {
            setBody(result);
            console.log('class List', result)
        }
    }

    useEffect(() => {
        fetchClassRecords();
    }, [statusRow]);

    const statusHandler = (val) => {
        setStatusRow(val);
    };

    //Randomize data of the table columns.Note that the fields are all using the `prop` field of the headers.
    const labels = {
        beforeSelect: " "
    }
    // Create add Section by Shahir Hussain 10-05-2024
    const handleSection = (row) => {
        console.log('handleEdit@@@@=>', row)
        setAddModalShow(true);
        setRowRecords(row);
    }
    //table headers
    const header = [
        { title: 'Class Name', prop: 'classname', isFilterable: true },
        {/*Create This Section By Shahir Hussain 13-05-2024*/
            title: 'Section', prop: 'section', isFilterable: true,
            cell: (row) => (
                <>
                    {row.section.map((sec, index) => (
                        <React.Fragment key={sec.section_id}>
                            <Link
                                to={{
                                    pathname: "/section/" + sec.section_id,
                                    state: { section: sec }
                                }}

                                state={{ section_id: sec.section_id, section_name: sec.section_name, classpath: '/classes' }}>
                                {sec.section_name}
                            </Link>
                            {index < row.section.length - 1 && ", "}
                        </React.Fragment>
                    ))}
                </>
            )

        },
        { title: 'Alias Name', prop: 'aliasname', isFilterable: true, },
        {
            title: 'Status',
            prop: 'id',
            cell: (row) => {
                let myBoolean = row.status === 'active' ? "Active" : "Inactive";
                return (
                    <Button className="btn-sm mx-2" onClick={() => statusHandler(row)} style={{ width: '80px' }} variant={myBoolean === 'Active' ? "success" : 'danger'}>{myBoolean}</Button>
                );
            },
        },
        {
            title: 'Actions',
            prop: 'id',
            cell: (row) => {
                return (
                    <>
                        <Button className="btn-sm mx-2" variant="primary" onClick={() => handleEdit(row)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                        </Button>
                        <Button className="btn-sm mx-2" variant="primary" onClick={() => handleSection(row)} disabled={row.status !== 'active' ? true : false}>
                            <i className="fa-regular fa-plus"></i>
                        </Button>
                    </>
                );
            },
        }
    ];

    //add record
    const addClass = () => {
        setModalShow(true);
        setRowRecords([]);
    }
    //edit record
    const handleEdit = (row) => {
        console.log('handleEdit@@@@=>', row)
        setModalShow(true);
        setRowRecords(row);
    }

    const recordSaveSuccesfully = () => {
        setModalShow(false);
        fetchClassRecords();
    }

    const classListHandler = async () => {
        const editRecord = {
            id: statusRow?.id,
            classname: statusRow.classname,
            aliasname: statusRow.aliasname,
            status: statusRow?.status === "active" ? "inactive" : "active",
        };
        let response = {};
        response = await schoolApi.updateClassRecord(editRecord);
        if (response.success) {
            toast.success(response.message, { position: toast.POSITION.TOP_CENTER });
            setStatusRow(undefined)
        } else {
            toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
        }
    };

    return (
        <Main>

            <Row className="g-0">

                <Col lg={12} className="p-lg-5" style={{ marginTop: "-23px" }}>

                    {body ?

                        <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
                            initialState: {
                                rowsPerPage: 15,
                                options: [5, 10, 15, 20]
                            }
                        }}>
                            {/* Add by Aamir khan 14-05-2024 */}
                            <Col lg={2} className="mt-2">
                                <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> <strong> Classes</strong></Link>
                            </Col>
                            <Row className="mb-4">
                                <Col
                                    xs={12}
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
                                        <InfoPill left="Total Classes " right={body?.length} />
                                    </div>
                                </Col>
                                <Col
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    className="d-flex flex-col justify-content-end align-items-end"
                                >
                                    <Button className="btn-light" variant="outline-primary" onClick={() => addClass(true)}>Add Class</Button>
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
            {/*create by shahir hussain 10-05-2024*/}
            {addModalShow && (
                <AddSection
                    show={addModalShow}
                    parent={rowRecords}
                    onHide={() => setAddModalShow(false)}
                // table="section"
                />
            )}

            {modalShow && (
                <AddClass
                    show={modalShow}
                    parent={rowRecords}
                    onHide={() => setModalShow(false)}
                    recordSaveSuccesfully={recordSaveSuccesfully}
                />
            )}
            {statusRow && (
                <Confirm
                    show={statusRow}
                    onHide={() => setStatusRow(undefined)}
                    changeClassStatus={classListHandler}
                    title={`Confirm ${statusRow?.status === "active" ? "inActive ?" : "Active ?"
                        }`}
                    message="You are going to update the status. Are you sure?"
                    table="classList"
                />)}
            <ToastContainer />
        </Main>
    )
}

export default ClassList
