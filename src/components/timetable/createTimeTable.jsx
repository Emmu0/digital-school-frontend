
/**
 * @author: Pooja Vaishnav
 */

import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
///import { cl } from "@fullcalendar/core/internal-common";

const CreateTimeTable = (props) => {
    console.log('AddTimeTable@@!@=>', props);
    const [showTable, setShowTable] = useState(false);
    const [optionClasses, setOptionClasses] = useState([]);
    const [validated, setValidated] = useState(false);
    const [optionSection, setOptionSection] = useState([]);
    const [optionSubject, setoptionSubjects] = useState([]);
    const [optionContact, setOptionContact] = useState([]);
    const [optionTimeSlot, setoptionTimeSlots] = useState([]);
    const [timetable, setTimeTable] = useState([]);
    const [newTimeSlot, setNewTimeSlot] = useState([]);
    const [classId, setClassId] = useState(false);
    const [buttonVal, setButtonVal] = useState('save');
    const [disableVal, setDisableVal] = useState(false);
    const [timeTableView, setTimeTableView] = useState(false);

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
            console.log('timeSlotList===>', timeSlotList);
            if (timeSlotList) {

                let tmSlot = [];
                timeSlotList.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.start_time + ' to ' + item.end_time;
                    tmSlot.push(obj);
                })
                setNewTimeSlot(tmSlot);
                let ar = [];
                timeSlotList.map((item) => {
                    var res = {
                        obj1: {
                            day: 'Monday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        },
                        obj2: {
                            day: 'Tuesday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        },
                        obj3: {
                            day: 'Wednesday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        },
                        obj4: {
                            day: 'Thrusday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        },
                        obj5: {
                            day: 'Friday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        },
                        obj6: {
                            day: 'Saturday',
                            value: item.id,
                            label: item.start_time + ' to ' + item.end_time,
                            class_id: '',
                            sessionid: '',
                        }
                    };

                    ar.push(res);
                })
                setoptionTimeSlots(ar);

                setTimeTable(ar);
            } else {
                setoptionTimeSlots([]);
            }
        }
        init();
    }, []);

    const handleClass = async (e) => {
        setClassId(e.target.value);
        console.log('first newTimeSlot-==>', newTimeSlot)
        let sessions = await schoolApi.fetchSessions();
        console.log('sessions@@@=>',sessions);
        let currentDate = new Date();  // Get the current date
            // Assuming sessions is an array of objects as shown in your example
            let currentYearId = null;

            for (let i = 0; i < sessions.length; i++) {
                let sessionStartDate = new Date(sessions[i].startdate);
                let sessionEndDate = new Date(sessions[i].enddate);

                // Check if the current date is within the range of the session's start and end dates
                if (currentDate >= sessionStartDate && currentDate <= sessionEndDate) {
                    currentYearId = sessions[i].id;
                    break;  // Exit the loop once we find a matching session
                }
            }
          //  console.log('currentYearId@@@=>',currentYearId);
        let timetable = await schoolApi.fetchTimetableByClassId(e.target.value,currentYearId);
        console.log('timetablecass==>',timetable);
        if (timetable && timetable.length > 0) {
            console.log('first timetable-==>', timetable)
            let matchedTimetable = {};
            newTimeSlot.forEach(slot => {
                let matchingEntries = timetable.filter(item => item.time_slot_id === slot.value);
                console.log('matchingEntries@@@=>', matchingEntries);

                if (matchingEntries.length > 0) {
                    // Aggregate data for the same time_slot_id
                    if (!matchedTimetable[slot.label]) {
                        matchedTimetable[slot.label] = [];
                    }

                    matchingEntries.forEach(entry => {
                        // Add the entry to the array for the time_slot_id
                        matchedTimetable[slot.label].push(entry);
                    });
                }

            });
            console.log('matchedTimetable@@@@', matchedTimetable);

            if (matchedTimetable) {
                setoptionTimeSlots(matchedTimetable);
            } else {
                setoptionTimeSlots([]);
            }
            setTimeTableView(true);
            setButtonVal('Edit');
            setDisableVal(true);
        } else {
            setShowTable(true);
        }

    }
    const handleChange = async(e, index) => {
        console.log('handleChange@@_>', e.target.value);
        console.log('preTimeTable=>', timetable);
        let sessions = await schoolApi.fetchSessions();
                console.log('sessions@@@=>',sessions);
                let currentDate = new Date();  // Get the current date
                    // Assuming sessions is an array of objects as shown in your example
                    let currentYearId = null;

                    for (let i = 0; i < sessions.length; i++) {
                        let sessionStartDate = new Date(sessions[i].startdate);
                        let sessionEndDate = new Date(sessions[i].enddate);

                        // Check if the current date is within the range of the session's start and end dates
                        if (currentDate >= sessionStartDate && currentDate <= sessionEndDate) {
                            currentYearId = sessions[i].id;
                            break;  // Exit the loop once we find a matching session
                        }
                    }
        setTimeTable((prevTimetable) => {
            const updatedTimetable = [...prevTimetable];

            // Copy the current object at the specified index
            const updatedObject = { ...updatedTimetable[index] };

            // Update teacher1 and subject1 properties for all objects
            for (let i = 1; i <= 6; i++) {
                if (e.target.name === `teacher${i}` || e.target.name === `subject${i}`) {
                    const teacherKey = `teacher${i}`;
                    const subjectKey = `subject${i}`;
                    const class_idKey = `class_id`;
                    const session_idKey = `sessionid`;
                    console.log('class_id@@@=>', class_idKey);
                    console.log('classId1111@@@=>', classId);
                    updatedObject[`obj${i}`][teacherKey] = e.target.name.startsWith('teacher') ? e.target.value : updatedObject[`obj${i}`][teacherKey];
                    updatedObject[`obj${i}`][subjectKey] = e.target.name.startsWith('subject') ? e.target.value : updatedObject[`obj${i}`][subjectKey];
                    updatedObject[`obj${i}`][class_idKey] = classId;
                    updatedObject[`obj${i}`][session_idKey] = currentYearId;
                }
            }

            updatedTimetable[index] = updatedObject;
            console.log('updatedTimetable@@@@=>', updatedTimetable);
            return updatedTimetable;
        });
    };

    console.log('timetable#@#@@$==>', timetable);

    const handleSubmit = async (e) => {
        console.log('V@@@@=>')
        e.preventDefault();
        console.log('hey vghdgsdg=>', timetable);
        if(buttonVal === 'Edit'){
            console.log('hghgfj edit');
            setDisableVal(false);
        }else{
            if (timetable.some(item => {
                for (let i = 1; i <= 6; i++) {
                    console.log('in the llop =>', item)
                    if (!item[`obj${i}`][`teacher${i}`] || !item[`obj${i}`][`subject${i}`]) {
                        return true; // Found an empty value, return true to show the error
                    }
    
                }
                return false; // No empty values found
            })) {
                console.log('in the GGGGG');
                toast.error("Please fill in all required fields!");
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
                } else {
                    toast.success(timetableInfo.message, { position: toast.POSITION.TOP_RIGHT });
                }
            } else {
                console.log('in the elseTTTT');
                
                console.log('wga is=>', timetable);
                let res = {
                    ...timetable,
                   // session_id: currentYearId,
                }
                console.log('timetable@@@=>', res);
                const result = await schoolApi.createTimetable(res);
                if (result.success === true) {
                    toast.success("Record Created Succesfully!", { position: toast.POSITION.TOP_RIGHT })
                } else {
                    toast.success(result.message, { position: toast.POSITION.TOP_RIGHT });
                }
            }
        }
       

        
    };

    return (
        <>
            <Main>
                <Row className="g-0">
                    <Col lg={10} className="mx-4">
                        <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Create Time Table</Link>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col lg={4}>
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
                </Row>
                {showTable &&
                    <Row className="mt-5">
                        <Col lg={12}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Time Slot</th>
                                        <th>Monday</th>
                                        <th>Tuesday</th>
                                        <th>Wednesday</th>
                                        <th>Thrusday</th>
                                        <th>Friday</th>
                                        <th>Saturday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {console.log('hhdfhfj=>', optionTimeSlot)}
                                    {optionTimeSlot && optionTimeSlot.length > 0 ? (
                                        optionTimeSlot.map((value, index) => (
                                            <tr key={index}>
                                                {console.log('hey in this==>', value.slot_time)}
                                                <td style={{ paddingTop: "35px" }}>{value.obj1.label}</td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={value.obj1.teacher1}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            value={value.obj1.subject1}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher2"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject2"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher3"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject3"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher4"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject4"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher5"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject5"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher6"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject6"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                            </tr>
                                        ))
                                    ) : null}
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "right" }}>
                                            <Button className="btn-md mx-2" onClick={handleSubmit}>
                                                Save
                                            </Button>
                                        </td>
                                    </tr>
                                    {/* {timeTableTeacher && timeTableTeacher.length > 0 ? (
                        timeTableTeacher.map((item, index) => (
                            <tr key={index}>
                            <td>{item.classname}</td>
                            <td>{item.section_name}</td>
                            <td>{item.subject_name}</td>
                            <td>{item.period_time}</td>
                            <td>{item.day}</td>
                            <td>{item.type}</td>
                            </tr>
                        ))
                        ) : (
                        <tr style={{textAlign:"center"}}>
                            <td colSpan={6} style={{fontSize:"15px"}}>
                            Timetable records are not available for teachers!
                            </td>
                        </tr>
                        )} */}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                }

                {timeTableView &&
                    <Row className="mt-5">
                        <Col lg={12}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Time Slot</th>
                                        <th>Monday</th>
                                        <th>Tuesday</th>
                                        <th>Wednesday</th>
                                        <th>Thrusday</th>
                                        <th>Friday</th>
                                        <th>Saturday</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {console.log('hhdfhfj view=>', optionTimeSlot)}
                                    {optionTimeSlot && Object.keys(optionTimeSlot).length > 0 ? (
                                        Object.keys(optionTimeSlot)?.map((timeSlotId, index) => (
                                            <React.Fragment key={index}>
                                                {console.log('hey view index==>', index)}
                                                {console.log('hey view timeSlotId==>', timeSlotId)}
                                                <tr>
                                                <td style={{ paddingTop: "35px" }}>{timeSlotId}</td>
                                                    {optionTimeSlot[timeSlotId]?.map((entry, subIndex) => (
                                                        <React.Fragment key={subIndex}>
                                                        {console.log('entry@@2=>',entry.contact_name)}
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={entry.contact_id}
                                                            disabled={disableVal}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            value={entry.subject_id}
                                                            required
                                                            disabled={disableVal}
                                                        >
                                                            <option value="">-- Select Subject --</option>
                                                            {optionSubject.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </td>
                                                {/* <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher2"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject2"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher3"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject3"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher4"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject4"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher5"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject5"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher6"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject6"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td> */} 
                                                        </React.Fragment>

                                                    ))}
                                                </tr>
                                                {/* <td style={{ paddingTop: "35px" }}>{value.obj1.label}</td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={value.obj1.teacher1}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject1"
                                                            onChange={(e) => handleChange(e, index)}
                                                            value={value.obj1.subject1}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher2"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject2"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher3"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject3"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher4"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject4"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher5"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject5"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td>
                                                <td>
                                                    <Form.Group className="mx-2">
                                                        <Form.Select
                                                            name="teacher6"
                                                            onChange={(e) => handleChange(e, index)}
                                                            required
                                                            value={timetable.contact_id}
                                                        >
                                                            <option value="">-- Select Teacher --</option>
                                                            {optionContact.map((cls, index) => (
                                                                <option key={cls.index} value={cls.value}>
                                                                    {cls.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                    <Form.Group className="mx-2 mt-3">
                                                        <Form.Select
                                                            name="subject6"
                                                            onChange={(e) => handleChange(e, index)}
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
                                                </td> */}
                                            </React.Fragment>
                                        ))
                                    ) : null}
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "right" }}>
                                            <Button className="btn-md mx-2" onClick={handleSubmit}>
                                                {buttonVal}
                                            </Button>
                                        </td>
                                    </tr>
                                    {/* {timeTableTeacher && timeTableTeacher.length > 0 ? (
                        timeTableTeacher.map((item, index) => (
                            <tr key={index}>
                            <td>{item.classname}</td>
                            <td>{item.section_name}</td>
                            <td>{item.subject_name}</td>
                            <td>{item.period_time}</td>
                            <td>{item.day}</td>
                            <td>{item.type}</td>
                            </tr>
                        ))
                        ) : (
                        <tr style={{textAlign:"center"}}>
                            <td colSpan={6} style={{fontSize:"15px"}}>
                            Timetable records are not available for teachers!
                            </td>
                        </tr>
                        )} */}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                }
                {/* <Container className="view-form">
                    <Row className="view-form">
                        
                    </Row >
                </Container > */}
                <ToastContainer />
            </Main>
        </>
    );
};

export default CreateTimeTable;
