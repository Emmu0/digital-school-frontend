
/**
 * @author: Pooja Vaishnav
 */

import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";

import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTimeTable = (props) => {
    console.log('AddTimeTable@@!@=>', props);
    const location = useLocation();
    console.log('location for edit page', location);
    const navigate = useNavigate();
    const [optionClasses, setOptionClasses] = useState([]);
    const [validated, setValidated] = useState(false);
    const [optionSection, setOptionSection] = useState([]);
    const [optionSubject, setoptionSubjects] = useState([]);
    const [optionContact, setOptionContact] = useState([]);
    const [optionTimeSlot, setoptionTimeSlots] = useState([]);
    const [timetable, setTimeTable] = useState({});

    useEffect(() => {
        if (location?.state) {
            setTimeTable(location?.state);
            console.log('timetable useEffect==>', timetable);
        } else {
            if (location.hasOwnProperty('pathname')) {
                setTimeTable({});
            }
        }
    }, [location?.state]);

    useEffect(() => {
        async function init() {
            let classList = await schoolApi.getActiveClassRecords();
            console.log('first classList-==>', classList)
            if (classList) {
                let ar = [];
                classList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.classname;
                    ar.push(obj);
                })
                setOptionClasses(ar);
            } else {
                setOptionClasses([]);
            }

            let teacherList = await schoolApi.getTeacherRecords();
            if (teacherList) {
                let ar = [];
                teacherList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.teachername;
                    ar.push(obj);
                })
                setOptionContact(ar);
            } else {
                setOptionContact([]);
            }
            let subjectList = await schoolApi.fetchSubject();
            console.log('vehicalList===>', subjectList);
            if (subjectList) {
                let ar = [];
                subjectList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.name;
                    ar.push(obj);
                })
                setoptionSubjects(ar);
            } else {
                setoptionSubjects([]);
            }

            let timeSlotList = await schoolApi.fetchTimeSlot();
            console.log('vehicalList===>', timeSlotList);
            if (timeSlotList) {
                let ar = [];
                timeSlotList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.type;
                    ar.push(obj);
                })
                setoptionTimeSlots(ar);
            } else {
                setoptionTimeSlots([]);
            }
        }
        init();
    }, []);

    const handleChange = (e) => {
        console.log('handleChange@@_>', e.target.value)
        setTimeTable({ ...timetable, [e.target.name]: e.target.value });
    };
    const handleClass = async (e) => {
        console.log('handleClass@@_>', e.target.value)
        if (e.target.name === 'class_id') {
            let sectionList = await schoolApi.getSectionRecordById(e.target.value);
            console.log('sectionList@@=>', sectionList);
            if (sectionList) {
                let ar = [];
                sectionList.record.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.name;
                    ar.push(obj);
                })
                setOptionSection(ar);
            } else {
                setOptionSection([]);
            }
        }
        setTimeTable({ ...timetable, [e.target.name]: e.target.value });
    };


    console.log('timetable#@#@@$==>', timetable);
    const checkRequredFields = () => {
        if ((timetable.class_id && timetable.class_id.trim() !== '') && (timetable.section_id && timetable.section_id.trim() !== '')
            && (timetable.contact_id && timetable.contact_id.trim() !== '') && (timetable.subject_id && timetable.subject_id.trim() !== '')
            && (timetable.time_slot_class_id && timetable.time_slot_class_id.trim() !== '') && (timetable.day && timetable.day.trim() !== '')
            && (timetable.start_time && timetable.start_time.trim() !== '') && (timetable.end_time && timetable.end_time.trim() !== '')
            && (timetable.status && timetable.status.trim() !== '')) {
            console.log('hey checkkk');
            return false;
        }
        console.log('out check');
        return true;
    }
    const handleSubmit = async (e) => {
        console.log('V@@@@=>')
        e.preventDefault();
        // if (checkRequredFields()) {
        //     console.log('checkRequredFields@@12');
        //     setValidated(true);
        //     return;
        // }
        if ((!timetable.class_id) || (!timetable.section_id) || (!timetable.contact_id) || (!timetable.subject_id) ||
            (!timetable.time_slot_class_id) || (!timetable.day) || (!timetable.start_time) || (!timetable.end_time)
            && (!timetable.status)) {
            toast.error("Please fill in all required fields!");
            return;
        }
        if (!timetable.start_time || !timetable.end_time || timetable.start_time > timetable.end_time) {
            toast.error("Start time should not be less than with end time!!!");
            return;
        }
        console.log('inside the handleAddTimeSlot==>', timetable);
        if (timetable.id) {
            console.log('wagt is in=>', timetable);
            const timetableInfo = await schoolApi.updateTimeTable(timetable);
            console.log('timetableInfo@@@##=>', timetableInfo)
            if (timetableInfo.success === true) {
                console.log('timetableInfo@@#@+>Sess', timetableInfo);
                toast.success("Record Updated Succesfully!", { position: toast.POSITION.TOP_RIGHT });
                navigate(`/timetable/${timetableInfo.result.id}`);
            } else {
                toast.success(timetableInfo.message, { position: toast.POSITION.TOP_RIGHT });
            }
        } else {
            let sessionId;
            const currentYear = new Date().getFullYear();
            const currentYearString = currentYear.toString();
            console.log(currentYearString);
            const session = await schoolApi.fetchSessions();
            session.forEach(element => {
                if (element.year === currentYearString) {
                    console.log('in', element.id)
                    sessionId = element.id;
                }
            });
            let res = {
                ...timetable,
                session_id: sessionId,
            }
            console.log('timetable@@@=>', res);
            const result = await schoolApi.createTimetable(res);
            if (result.success === true) {
                toast.success("Record Created Succesfully!", { position: toast.POSITION.TOP_RIGHT })
                navigate('/timetable');
            } else {
                toast.success(result.message, { position: toast.POSITION.TOP_RIGHT });
            }
        }
    };

    const handleCancel = () => {
        if (location?.state?.id) {
            navigate("/timetable/" + location?.state?.id);
        } else {
            navigate('/timetable');
        }
    };

    return (
        <>
            <Main>
                <Helmet> <title>{props?.tabName}</title> </Helmet>
                <PageNavigations id={location.state?.id} listName="Timetable" listPath="/timetable" colLg={10} colClassName="d-flex px-3 py-2" extrColumn={2} />
                <Container className="view-form">
                    <Row className="view-form">
                        <Col></Col>
                        <Col lg={8}>
                            <Form className="mt-3" onSubmit={handleSubmit} noValidate validated={validated}>
                                <Row className="view-form-header align-items-center">
                                    <Col lg={3}>
                                        Timetable Details
                                    </Col>
                                    <Col lg={9} className="d-flex justify-content-end">
                                        <Button className="btn-sm mx-2" onClick={handleSubmit}>
                                            Save
                                        </Button>

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
                                        <Button
                                            className="btn-sm"
                                            variant="danger"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        {console.log('tmTahh=>', timetable.classname)}
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Class Name
                                            </Form.Label>
                                            <Form.Select name="class_id" onChange={handleClass} required value={timetable.class_id}>
                                                <option value="">--Select Class--</option>
                                                {optionClasses.map((cls) => (
                                                    <option key={cls.value} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Section Name
                                            </Form.Label>
                                            <Form.Select
                                                name="section_id"
                                                onChange={handleChange}
                                                required
                                                value={timetable.section_id}
                                            >
                                                <option value="">-- Select Section --</option>
                                                {optionSection.map((cls, index) => (
                                                    <option key={cls.index} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Contact Name
                                            </Form.Label>
                                            <Form.Select
                                                name="contact_id"
                                                onChange={handleChange}
                                                required
                                                value={timetable.contact_id}
                                            >
                                                <option value="">-- Select Contact --</option>
                                                {optionContact.map((cls, index) => (
                                                    <option key={cls.index} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Subject Name
                                            </Form.Label>
                                            <Form.Select
                                                name="subject_id"
                                                onChange={handleChange}
                                                value={timetable.subject_id}
                                                required
                                            >
                                                <option value="">-- Select Subject --</option>
                                                {optionSubject.map((cls, index) => (
                                                    <option key={cls.index} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Timeslot Type
                                            </Form.Label>
                                            <Form.Select
                                                name="time_slot_class_id"
                                                onChange={handleChange}
                                                value={timetable.time_slot_class_id}
                                                required
                                            >
                                                <option value="">-- Select Timeslot Type --</option>
                                                {optionTimeSlot.map((cls, index) => (
                                                    <option key={cls.index} value={cls.value}>
                                                        {cls.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={5} className="mx-3 me-5">
                                        <Form.Group>
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                                                Day
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                name="day"
                                                onChange={handleChange}
                                                value={timetable.day}
                                            >
                                                <option value="none">---Select Days----</option>
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thrusday">Thrusday</option>
                                                <option value="Friday">Friday</option>
                                                <option value="Saturday">Saturday</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicPhone"
                                            >
                                                Start Time
                                            </Form.Label>
                                            <Form.Control type="time" name="start_time" placeholder="Enter Start Time" onChange={handleChange} required value={timetable.start_time} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicPhone"
                                            >
                                                End Time
                                            </Form.Label>
                                            <Form.Control type="time" name="end_time" placeholder="Enter Start Time" onChange={handleChange} required value={timetable.end_time} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12} className="mx-3">
                                        <Form.Group >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                                                Status
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                name="status"
                                                onChange={handleChange}
                                                value={timetable.status}
                                            >
                                                <option value="none">---Select Status----</option>
                                                <option value="none">None</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">InActive</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Col >
                        <Col></Col>
                    </Row >
                </Container >
            </Main>
        </>
    );
};

export default AddTimeTable;
