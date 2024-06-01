/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const AddAttendanceMaster = (props) => {
    const [optionClass, setOptionClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState();

    const [optionSection, setOptionSection] = useState([]);
    const [selectedSection, setSelectedSection] = useState();

    // const [optionSession, setOptionSession] = useState([]);
    // const [selectedSession, setSelectedSession] = useState();

    // const [feesHeadRecord, setFeesHeadRecord] = useState({ name: "", status: "active", });
    const [attendanceMasterRecord, setAttendanceMasterRecord] = useState({
        class_id: "",
        section_id: "",
        total_lectures: "",
        type: "",
        month: "",
        year: ""
    });



    const fetchRecords = async () => {
        console.log('imside the fetchRecords');
        const result = await schoolApi.getClassRecords('active'); //fetch class records
        // console.log('##Class result', result)
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

        // const sessionRecords = await schoolApi.getSessionRecordById('active'); //fetch session records
        // // console.log('##Session records', sessionRecords)
        // if (sessionRecords) {
        //     let ar = [];
        //     // eslint-disable-next-line array-callback-return
        //     sessionRecords.map((item) => {
        //         var obj = {};
        //         obj.value = item.id;
        //         obj.label = item.year;
        //         ar.push(obj);
        //     });
        //     setOptionSession(ar);
        // }
    }

    useEffect(() => {
        if (props?.parent?.id) {
            console.log('location ', props?.parent)
            setAttendanceMasterRecord(props?.parent);

            let selectClass = {};
            selectClass.value = props?.parent?.class_id;
            selectClass.label = props?.parent?.class_name;
            setSelectedClass(selectClass);

            let selectSection = {};
            selectSection.value = props?.parent?.section_id;
            selectSection.label = props?.parent?.section_name;
            setSelectedSection(selectSection);

            // let selectYear = {};
            // selectYear.value = props?.parent?.session_id;
            // selectYear.label = props?.parent?.session_year;
            // setSelectedSession(selectYear);

        } else {
            setSelectedClass();
            setSelectedSection();
            // setSelectedSession();
        }
        fetchRecords();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log('setAttendanceMasterRecord', attendanceMasterRecord)

    const fetchSectionRecord = async (classId) => {
        console.log('fetchSectionRecord==>',classId)
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

    //handle change
    const handleChange = (e) => {
        setAttendanceMasterRecord({ ...attendanceMasterRecord, [e.target.name]: e.target.value });
    };
    console.log('attendanceMasterRecord waht',attendanceMasterRecord)
    //handle change class
    const handleChangeClass = (e) => {
        console.log('handleChangeClass===>',e);
        setSelectedSection(null);
        setSelectedClass(e);
        setAttendanceMasterRecord({ ...attendanceMasterRecord, class_id: e.value });
        fetchSectionRecord(e.value) 
    };  
    // handle change section
    const handleChangeSection = (e) => {
        setSelectedSection(e);
        setAttendanceMasterRecord({ ...attendanceMasterRecord, section_id: e.value });
    }
    // handle change session
    // const handleChangeSession = (e) => {
    //     setSelectedSession(e);
    //     setAttendanceMasterRecord({ ...attendanceMasterRecord, session_id: e.value });
    // }

    //SaveRecord
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('attendanceMasterRecord', attendanceMasterRecord)
        console.log('propsSS=>',props);
        if (props?.parent?.id) {//editRecord
            const editRecord = {
                id: props?.parent?.id,
                class_id: attendanceMasterRecord.class_id,
                section_id: attendanceMasterRecord.section_id,
                // session_id: attendanceMasterRecord.session_id,
                total_lectures: attendanceMasterRecord.total_lectures,
                type: attendanceMasterRecord.type,
                month: attendanceMasterRecord.month,
                year: attendanceMasterRecord.year,
            }
            console.log('editRecord++',editRecord);
            if ((editRecord.class_id && editRecord.class_id.trim() !== "") &&
                (editRecord.section_id && editRecord.section_id.trim() !== "") &&
                (editRecord.total_lectures && editRecord.total_lectures.trim() !== "") &&
                (editRecord.type && editRecord.type.trim() !== "")
            ) {
                let response = await schoolApi.updateAttendanceMasterRecords(editRecord);
                if (response.success) {
                    toast.success(response.message, { position: toast.POSITION.TOP_RIGHT });
                    recordSaveSuccesfully();

                } else {
                    toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
                }
            }
            else {
                toast.error("Required field missing!", { position: toast.POSITION.TOP_RIGHT });
            }
        }
        else {//addClass
            if ((attendanceMasterRecord.class_id && attendanceMasterRecord.class_id.trim() !== "") &&
                (attendanceMasterRecord.section_id && attendanceMasterRecord.section_id.trim() !== "") &&
                // (attendanceMasterRecord.session_id && attendanceMasterRecord.session_id.trim() !== "") &&
                (attendanceMasterRecord.total_lectures && attendanceMasterRecord.total_lectures.trim() !== "") &&
                (attendanceMasterRecord.type && attendanceMasterRecord.type.trim() !== "")) {

                let response = await schoolApi.addAttendanceMasterRecords(attendanceMasterRecord);
                if (response.success) {
                    recordSaveSuccesfully();
                    toast.success("Record save successfully", { position: toast.POSITION.TOP_RIGHT });
                } else {
                    toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
                }
            }
            else {
                toast.error("Required field missing!", { position: toast.POSITION.TOP_RIGHT });
            }

        }
    };

    const recordSaveSuccesfully = () => {
        props.recordSaveSuccesfully();
    }


    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
            <Modal.Header closeButton onClick={props.onHide} >
                <Modal.Title id="contained-modal-title-vcenter">
                    Attendance Master Record
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row className="g-0">
                        <Col lg={12}>
                            <Form noValidate>
                                <Row className="pb-2">
                                    <Col lg={6}>
                                        {optionClass && (
                                            <Form.Group>
                                                <Form.Label className="form-view-label" htmlFor="formBasicClass" >Class Name</Form.Label>
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
                                    <Col lg={6}>
                                            <Form.Group>
                                                <Form.Label className="form-view-label" htmlFor="formBasicClass" >Section Name</Form.Label>
                                                <Select
                                                    required
                                                    className="custom-select username"
                                                    placeholder="Select Section Name"
                                                    name="section_id"
                                                    onChange={handleChangeSection}
                                                    value={selectedSection}
                                                    options={optionSection}
                                                ></Select>
                                            </Form.Group>
                                    </Col>
                                </Row>  
                                {console.log('attendanceMasterRecord.type update@@@+>',attendanceMasterRecord.type)}
                                <Row className="pb-2">
                                    <Col lg={6}>
                                        <Form.Group >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName" >
                                                Type
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                type="text"
                                                name="type"
                                                value={attendanceMasterRecord.type}
                                                onChange={handleChange}
                                            >
                                                <option value="">--Select Type--</option>
                                                <option value="daily">Daily</option>
                                                <option value="monthly">Monthly</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    {/* <Col lg={6}>
                                        {optionSession && (
                                            <Form.Group>
                                                <Form.Label className="form-view-label" htmlFor="formBasicClass" >Session Year</Form.Label>
                                                <Select
                                                    required
                                                    className="custom-select username"
                                                    placeholder="Select session year"
                                                    name="session_id"
                                                    onChange={handleChangeSession}
                                                    value={selectedSession}
                                                    options={optionSession}
                                                ></Select>
                                            </Form.Group>
                                        )}
                                    </Col> */}
                                    <Col lg={6}>
                                        <Form.Group  >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName" >
                                                Total Lectures
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="total_lectures"
                                                placeholder="Enter Total Lecture"
                                                value={attendanceMasterRecord.total_lectures}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="pb-4">
                                    <Col lg={6}>
                                        <Form.Group >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName" >
                                                Month
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                type="text"
                                                name="month"
                                                value={attendanceMasterRecord.month}
                                                onChange={handleChange}
                                            >
                                                <option value="">--Select Month--</option>
                                                <option value="January">January</option>
                                                <option value="February">February</option>
                                                <option value="March">March</option>
                                                <option value="April">April</option>
                                                <option value="May">May</option>
                                                <option value="June">June</option>
                                                <option value="July">July</option>
                                                <option value="August">August</option>
                                                <option value="September">September</option>
                                                <option value="October">October</option>
                                                <option value="November">November</option>
                                                <option value="December">December</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group  >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName" >
                                                Year
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="year"
                                                placeholder="Enter Year"
                                                value={attendanceMasterRecord.year}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSubmit} > Save </Button>
                <Button onClick={props.onHide} variant="light">Close</Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>
    )
}

export default AddAttendanceMaster
