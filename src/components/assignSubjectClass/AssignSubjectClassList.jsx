/**
 * @author: Abdul Pathan
 */

import React, { useState, useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import schoolApi from "../../api/schoolApi";
import { useNavigate } from "react-router-dom";

import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader,
} from "react-bs-datatable";

// ---------------code pawan----------------
import Confirm from "../Confirm";
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignSubjectClassList = () => {
    const navigate = useNavigate();
    const [body, setBody] = useState();
    const [deleteId, setDeleteId] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    useEffect(() => {
        async function init() {
            const result = await schoolApi.getAssignSubjectClassRecords(); //fetch Records
            console.log("####getAssignSubjectClassRecords", result.records);

            if (result.success) {
                console.log("####getAssignSubjectClassRecords", result.records);

                // Group data by classid START
                let data = result.records;
                const groupedData = data.reduce((groups, item) => {
                    const key = `${item.class_id}-${item.classname}`;
                    if (!groups[key]) {
                        groups[key] = {
                            id: item.id,
                            classId: item.class_id,
                            classname: item.classname,
                            subjectname: [],
                        };
                    }
                    groups[key].subjectname.push(item.subjectname);
                    return groups;
                }, {});
                const resultArray = Object.values(groupedData);
                setBody(resultArray);
                console.log("resultArray==>", resultArray);
            } else {
                setBody([]);
            }
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Note that the fields are all using the `prop` field of the headers.
    const labels = {
        beforeSelect: " ",
    };


    //Table headers
    const header = [
        // { title: "Class Name", prop: "classname", isFilterable: true, cell: (row) => <Link to={"/assignsubjectclass"}>{row.classname}</Link> },
        { title: "Class Name", prop: "classname", isFilterable: true, cell: (row) => row.classname },
        { title: "Subject Name", prop: "subjectname", isFilterable: true, cell: (row) => row.subjectname.join(","), },
        {
            title: "Actions",
            prop: "className",
            cell: (row) => (
                <div>
                    <Button className="btn-sm" variant="primary" onClick={() => updateAssignSubjectClass(row)} >
                        <i className="fa-regular fa-pen-to-square"> </i>
                    </Button>
                    <Button className="btn btn-sm btn-danger mx-2" variant="danger" onClick={() => handleDeleteButton(row)} >
                        <i className="fa fa-trash"></i>
                    </Button>
                </div>
                //<Button className="btn-sm" variant="primary" onClick={() => updateAssignSubjectClass(row)} > <i className="fa-regular fa-pen-to-square"> </i> </Button>
            ),
        },
    ];
    //handleDeleteButton
    const handleDeleteButton = (row) => {
        console.log('delete button clicked', row);
        console.log('delete button clicked row.id==>', row.id);
        setDeleteId(row.id);
        setDeleteModal(true);

    }
    const deleteAssignSubjectClass = async (row) => {
        try {

            const result = await schoolApi.deleteAssignSubjectClassRecord(deleteId);
            console.log('result assignsubjectclass', result);
            if (result && result.message === "Successfully Deleted") {
                const deleteSyllabus = body.filter(rec => rec.id !== deleteId);

                console.log('deleteSyllabus===>', deleteSyllabus);
                PubSub.publish('RECORD_SAVED_TOAST', {
                    title: 'Record Deleted',
                    message: 'Record Deleted successfully'
                });
                setBody(deleteSyllabus)
                // setShowDeleteModal(false)
            } else {
                console.error('deletion was not successfull', result)
            }
        } catch (error) {
            console.error('Error during deleteTitle:', error);
        }
    }
    //update Assign Subject Class
    const updateAssignSubjectClass = (row) => {
        navigate(`/assignsubjectclass/edit`, { state: row });
    }

    //add Assign Subject Class
    const addAssignSubjectClass = () => {
        navigate(`/assignsubjectclass/add`);
    }

    return (
        <Main>
            <Row className="g-0">
                <Col lg={10} className="mx-4">
                    <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Assign Subject Class</Link>
                    {/* <Link className="nav-link" to="/assignsubjectclass">
                        Home <i className="fa-solid fa-chevron-right"></i> 
                        <strong> Assign Subject Class</strong>
                    </Link> */}
                </Col>
            </Row>
            {deleteModal &&
                <Confirm
                    show={deleteModal}
                    onHide={() => setDeleteModal(false)}
                    deleteAssignSubjectClass={deleteAssignSubjectClass}
                    title="Confirm delete?"
                    message="You are going to delete the record. Are you sure?"
                    table="assign_subject"
                />
            }
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <Row className="g-0 mt-4">
                <Col lg={12} className="p-lg-5">
                    {body ? (
                        <DatatableWrapper
                            body={body}
                            headers={header}
                            paginationOptionsProps={{
                                initialState: {
                                    rowsPerPage: 15,
                                    options: [5, 10, 15, 20],
                                },
                            }}
                        >
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
                                    <div style={{ marginTop: "5px" }}>
                                        <InfoPill
                                            left="Total Assign Subject Class"
                                            right={body?.length}
                                        />
                                    </div>
                                </Col>
                                <Col
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    className="d-flex flex-col justify-content-end align-items-end"
                                >
                                    <Button
                                        className="btn"
                                        variant="outline-primary"
                                        onClick={() => addAssignSubjectClass(true)}
                                    >
                                        Add Subject Class
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped className="data-table custom-table-subject-list">
                                <TableHeader />
                                <TableBody />
                            </Table>
                            <Pagination />
                        </DatatableWrapper>
                    ) : (
                        <ShimmerTable row={10} col={8} />
                    )}
                </Col>
            </Row>
        </Main>
    )
}

export default AssignSubjectClassList
