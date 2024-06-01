/**
 * @author: Pooja Vaishnav
 */

import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import schoolApi from "../../api/schoolApi";
import Main from "../layout/Main";
import EditTimeTable from "./edit_timetable";
import PrintClassTimeTable from "./print_class_timetable";
const TimeTable = () => {
  const [timeTableScreen, setTimeTableScreen] = useState("");
  const [timeTableSlots, setTimeTableSlots] = useState([]);

  const [sectionId, setSectionId] = useState(null);
  const [classId, setClassId] = useState(null);

  let [sessions, setSessions] = useState([]);
  let [classList, setClassList] = useState([]);
  let [classMap, setClassMap] = useState(new Map());

  async function initClassList() {
    classList = await schoolApi.getClassRecordsWithSections();
    setClassList(classList);
    const tempClassMap = classList.reduce((map, item) => {
      map.set(item.section_id, item);
      return map;
    }, new Map());
    console.log("first classList-==>", classList);
    console.log("first tempClassMap-==>", tempClassMap);
    setClassMap(tempClassMap);
  }

  useEffect(() => {
    async function doInit() {
      const sessions = await schoolApi.fetchSessions(true);
      console.log("sessions", sessions);
      setSessions(sessions);
      await initClassList();
    }
    doInit();
  }, []);

  const fetchTimetable = async (loadView = null) => {
    let timetableResult = await schoolApi.fetchTimetableRecords(
      classId,
      sectionId
    );

    if (timetableResult.success === true) {
      setTimeTableSlots(timetableResult);
      if (loadView && timetableResult.is_edit === true) {
        setTimeTableScreen(loadView);
      } else {
        if (timetableResult.is_edit === true) {
          setTimeTableScreen("VIEW");
        } else {
          setTimeTableScreen("EDIT");
        }
      }
    }
  };

  const onChangeClass = async (e) => {
    const classObject = classMap?.get(e.target.value);
    console.log('$$classObject', classObject)
    setClassId(classObject?.class_id);
    setSectionId(e.target.value);
    setTimeTableScreen("");
  };

  useEffect(() => {
    if (classId && sectionId) {
      fetchTimetable();
    }
  }, [sectionId]);

  const changeView = async (view) => {
    await fetchTimetable(view);
  };

  return (
    <>
      <Main>
        <Row className="g-0">
          <Col lg={10} className="mx-4">
            <Link className="nav-link" to="/">
              Home <i className="fa-solid fa-chevron-right"></i> Class Time
              Table
            </Link>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col lg={4}>
            <Form.Group className="mx-3">
              <Form.Label className="form-view-label">Class Name</Form.Label>
              <Form.Select
                name="class_id"
                onChange={onChangeClass}
                value={sectionId}
              >
                <option value="">-Select Class-</option>
                {classList.map((item) => (
                  <option key={item.section_id} value={item.section_id}>
                    {item.classname}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {timeTableScreen === "VIEW" && (
          <Row className="mt-5 mx-2">
            <Col lg={12}>
              <PrintClassTimeTable
                timeTableSlots={timeTableSlots.timeSlotsResult}
                changeView={changeView}
                showDeleteButton={true}
              />
            </Col>
          </Row>
        )}
        {timeTableScreen === "EDIT" && (
          <Row className="mt-5 mx-2">
            <Col lg={12}>
              <EditTimeTable
                timeTableSlots={timeTableSlots.timeSlotsResult}
                sessionId={sessions[0].id}
                sectionId={sectionId}
                classId={classId}
                changeView={changeView}
              />
            </Col>
          </Row>
        )}
        <ToastContainer />
      </Main>
    </>
  );
};

export default TimeTable;
