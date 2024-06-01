/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Main from "../layout/Main";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const AttendanceLineItem = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const location = useLocation();
    const [optionClass, setOptionClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState();

    const [optionSection, setOptionSection] = useState([]);
    const [selectedSection, setSelectedSection] = useState();

    const [attendanceLineItems, setAttendanceLineItems] = useState({ class_id: "", section_id: "", date: "" });
    const [tableShow, setTableShow] = useState(false);
    const [atLineItemListShow, setAtLineItemListShow] = useState(false);
    const [atLineItemList, setAtLineItemList] = useState([]);
    const [atList, setAtList] = useState([]);


    useEffect(() => {
        console.log('useEffect, atList', atList)
        fetchRecords();
    }, []);


    const fetchRecords = async () => {
        const result = await schoolApi.getClassRecords(true); //fetch class records
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

    const fetchSectionRecord = async (classId) => {
        if (classId) {
            let sectionData = await schoolApi.getSectionRecordById(classId); //fetch session records
            console.log('##sectionData', sectionData.record)
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
                setOptionSection()
                // setOptionSection([{ value: '', label: 'None' }]);
            }
        }
    }

    //handle change class
    const handleChangeClass = (e) => {
        setSelectedSection(null);
        setSelectedClass(e);
        setAttendanceLineItems({ ...attendanceLineItems, class_id: e.value });
        fetchSectionRecord(e.value)
    };
    // handle change section
    const handleChangeSection = (e) => {
        setSelectedSection(e);
        setAttendanceLineItems({ ...attendanceLineItems, section_id: e.value });
    }

    //handle change
    const handleChange = (e) => {
        setAttendanceLineItems({ ...attendanceLineItems, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        console.log('handleSearch , atList', atList)
        console.log('attendanceLineItems22' , attendanceLineItems)
        if ((attendanceLineItems.class_id && attendanceLineItems.class_id.trim() !== "") &&
            (attendanceLineItems.section_id && attendanceLineItems.section_id.trim() !== "") &&
            (attendanceLineItems.date && attendanceLineItems.date.trim() !== "")
        ) {
            console.log('attendanceLineItems', attendanceLineItems)
            let responce = await schoolApi.getAttendanceLineItemRecords(attendanceLineItems);
            console.log('getAttendanceLineItemRecords', responce.records)
            if (responce.success) {
                setAtLineItemList(responce.records);
                setAtList(responce.records)
                setAtLineItemListShow(true)
                setTableShow(true)
            } else {
                setAtLineItemList([])
                // setAtList([])
                setTableShow(true)
                setAtLineItemListShow(false)
            }
        }
        else {
            toast.error("Required field missing!", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    // index, item.id, item.student_id, e.target.checked, e.target.value
    // const handleChangeStudentAttendance = (index, attendance_line_item_id, student_id, target_name, target_value, listLineItems) => {
    const handleChangeStudentAttendance = (e, index, listLineItems) => {
        console.log('###e', e.target.checked)
        // console.log('###eww', e.target.value)

        if (e.target.checked) {
            console.log('inside the check44555');
            console.log('atLineItemList===>',atLineItemList);
            // const updatedStudentlist = [...atLineItemList];
            const updatedStudentlist = JSON.parse(JSON.stringify(atLineItemList));
            updatedStudentlist[index].status = 'present';
            // updatedStudentlist[index].extraValue = 'change value true';
            setAtLineItemList(updatedStudentlist)
            // console.log('updatedStudentlist', updatedStudentlist)
        } else {
            // const updatedStudentlist = [...atLineItemList];
            const updatedStudentlist = JSON.parse(JSON.stringify(atLineItemList));
            updatedStudentlist[index].status = 'absent';
            // updatedStudentlist[index].extraValue = 'change value false';
            setAtLineItemList(updatedStudentlist)
        }
    };
    console.log('atLineItemList==>',atLineItemList);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('setAtLineItemList', atLineItemList)
        console.log('setAtList', atList);

        let differentArray = [];
        for (let i = 0; i < atLineItemList.length; i++) {
            let item = atLineItemList[i];
            let matchingItem = atList.find((atListItem) => atListItem.id === item.id && atListItem.status === item.status);
            if (!matchingItem) {// If there is no matching item in atList, add the item to differentArray
                differentArray.push(item);
            }
        }
        console.log('Objects with different id or status:', differentArray);

        if (differentArray.length) {
            for (let obj of differentArray) {
                if (obj.id && obj.id.trim() !== "") {
                    let updateLineItem = {
                        id: obj.id,
                        attendance_id: obj.attendance_id,
                        status: obj.status
                    }
                    if (updateLineItem.id) {
                         console.log('updateLineItem', updateLineItem)
                        const responce = await schoolApi.updateAttendanceLineItemRecords(updateLineItem);
                         console.log('responce', responce)
                        if (responce.success) {
                            let updateAttendance = {};
                            let attResult = await schoolApi.getAttendanceRecordById(responce.record.attendance_id);
                            if (attResult) {
                                if (responce.record.status === 'present') {
                                    updateAttendance = {
                                        id: attResult.id,
                                        present: parseInt(attResult.present) + 1,
                                        absent: parseInt(attResult.absent) - 1
                                    }
                                } else {
                                    updateAttendance = {
                                        id: attResult.id,
                                        present: parseInt(attResult.present) - 1,
                                        absent: parseInt(attResult.absent) + 1
                                    }
                                }
                                // console.log('updateAttendance', updateAttendance)
                                if (updateAttendance.id) {
                                    let updateAttResponce = await schoolApi.updateAttendanceRecords(updateAttendance);
                                    console.log('update Attendance Responce', updateAttResponce);
                                     toast.success("Record updated Successfully!", { position: toast.POSITION.TOP_RIGHT });
                                    // navigate('/attendance_master');
                                }
                            }
                        } else {
                            // console.log('Record not found!')
                        }
                    }
                }
            }
        } else {
            toast.error("Please select one present/absent!", { position: toast.POSITION.TOP_RIGHT });
        }
    }

    const handleCancel = () => {
        navigate('/attendance_master');
    }

    return (
        <Main>

            <Row className="g-0 ">
                <Col lg={10} className="mx-4">
                    <Link className="nav-link" to="/attendance_master">Home <i className="fa-solid fa-chevron-right"></i> Attendance Master <i className="fa-solid fa-chevron-right"></i><strong> Attendance Line Item</strong> </Link>
                </Col>
                <Col lg={12} className="p-lg-5"></Col>
            </Row>

            <Container>
                <Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Row className="view-form-header align-items-center">
                            <Col lg={3}>Attendance Line Item Records</Col>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Button className="btn-sm mx-2" variant="danger" onClick={handleCancel}>Cancel</Button>
                                <Button className="btn-sm mx-2" variant="success" onClick={handleSubmit}>Save</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            <Container className="view-form">
                <Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Form noValidate >
                            <Row className="pb-4">

                                <Col lg={3}>
                                    {optionClass && (
                                        <Form.Group>
                                            <Form.Label className="form-view-label" htmlFor="formBasicClass" >Class Name</Form.Label>
                                            <Select
                                                required
                                                className="custom-select username"
                                                placeholder="Select class name"
                                                name="class_id"
                                                onChange={handleChangeClass}
                                                value={selectedClass}
                                                options={optionClass}
                                            ></Select>
                                        </Form.Group>
                                    )}
                                </Col>

                                <Col lg={3}>
                                        <Form.Group>
                                            <Form.Label className="form-view-label" htmlFor="formBasicClass" >Section Name</Form.Label>
                                            <Select
                                                required
                                                className="custom-select username mx-2"
                                                placeholder="Select section name"
                                                name="section_id"
                                                onChange={handleChangeSection}
                                                value={selectedSection}
                                                options={optionSection}
                                            ></Select>
                                        </Form.Group>
                                </Col>

                                <Col lg={3}>
                                    <Form.Group>
                                        <Form.Label className="form-view-label" htmlFor="formBasicEmail">Attendance Date</Form.Label>
                                        <Form.Control
                                            required
                                            className="mx-2"
                                            type="date"
                                            name="date"
                                            // value={moment(studentfilterValues.attandancedate).format('yyyy-MM-DD')}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={3} className="mt-3">
                                    <Button className="mt-4 mx-4" variant="primary" onClick={() => handleSearch()}>Search</Button>
                                    {/* <Button className="mt-4 " variant="success">Import</Button> */}
                                </Col>

                            </Row>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            {tableShow && (
                <Container>
                    <Row>
                        <Col></Col>
                        <Col lg={10}>
                            <table className="table table-striped table-bordered table-hover"  >
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Student Name</th>
                                        <th>Present/Absent</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {atLineItemListShow ? (
                                        atLineItemList?.map((item, index) => (
                                            <tr key={item.id} style={{ textAlign: "center" }}>
                                                <td>{index + 1}</td>
                                                <td>{item.student_name}</td>
                                                <td>
                                                    <Form>
                                                        <Form.Check
                                                            type="switch"
                                                            // id={item.id}
                                                            name="status"
                                                            checked={item.status === 'present' ? true : false}
                                                            value={item.status}
                                                            onChange={(e) => handleChangeStudentAttendance(e, index, item)}
                                                        // onChange={(e) => handleChangeStudentAttendance(index, item.id, item.student_id, e.target.checked, e.target.value, item)}
                                                        />
                                                    </Form>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr className="tbody-tr"><td style={{paddingLeft:"8px"}} className="tbody-td px-5" colspan="3">No results to be shown!</td></tr>)
                                    }
                                </tbody>
                            </table>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            )}

            <ToastContainer />
        </Main>
    )
}
export default AttendanceLineItem

