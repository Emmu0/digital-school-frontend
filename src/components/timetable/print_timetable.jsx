import { useEffect, useRef, useState } from "react";
import schoolApi from "../../api/schoolApi";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import PrintTeacherTimetable from "./print_teacher_timetable";
import PrintClassTimeTable from "./print_class_timetable";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function NewPrintTimeTable({ tabName }) {
  let [teacherList, setTeacherList] = useState([]);
  let [classList, setClassList] = useState([]);
  let [classTimeTable, setClassTimeTable] = useState([]);
  let [teacherId, setTeacherId] = useState("");
  let [sectionId, setSectionId] = useState("");
  let [classId, setClassId] = useState("");
  let [teacher, setTeacher] = useState(null);
  let [view, setView] = useState(null);
  let tableRef = useRef(null);

  useEffect(() => {
    console.log("Calling ");
    async function getTeachers() {
      const result = await schoolApi.getTeacherRecords(); //.then((result) => {
      console.log("Calling Use effect Result: ", result);
      if (result) {
        setTeacherList(result);
      }
    }

    async function getClass() {
      const classList = await schoolApi.getClassRecordsWithSections();
      console.log("Calling Use effect classList: ", classList);
      setClassList(classList);
    }
    getClass();
    getTeachers();
  }, []);

  useEffect(() => {
    console.log("Teacher changed useeffect",teacher);
  }, [teacher]);

  function onChangeTeacher(event) {
    const selectedTeacherId = event.target.value;
    console.log("selected teacher id:", selectedTeacherId);

    // Find the selected teacher object from teacherList based on the selected teacher ID
    const selectedTeacher = teacherList.find(
      (teacher) => teacher.id === selectedTeacherId
    );
    console.log("selected teacher:", selectedTeacher);

    setTeacher(selectedTeacher);
    if (selectedTeacher) {
      setView("teacher");
    } else {
      setView("");
    }
    // Set the selected teacher ID to the state
    setTeacherId(selectedTeacherId);
    setSectionId("");
  }

  function onChangeClass(event) {
    const selectedSectionId = event.target.value;

    // Find the selected class object from classList based on the selected Section ID
    const selectedClass = classList.find(
      (cls) => cls.section_id === selectedSectionId
    );
    console.log("selected selectedClass:", selectedClass);
    // Set the selected Class ID to the state
    setSectionId(selectedSectionId);

    if (selectedClass) {
      setClassId(selectedClass.class_id);
    } else {
      setClassId("");
      setView("");
    }
    setTeacherId("");
    setTeacher(null);
  }

  const fetchTimetable = async () => {
    let timetableResult = await schoolApi.fetchTimetableRecords(
      classId,
      sectionId
    );

    console.log("timetableResult: ", timetableResult);
    if (timetableResult && timetableResult.success === true) {
      setClassTimeTable(timetableResult);
      setView("class");
    } else {
      setClassTimeTable([]);
      setView("");
    }
  };

  useEffect(() => {
    if (classId && sectionId) {
      fetchTimetable();
    }
  }, [sectionId]);

  const onDownloadPDF = () => {
    console.log("tableRef.current", tableRef.current);
    const doc = new jsPDF({
      orientation: "landscape", // Set orientation to landscape
      unit: "mm", // Set measurement unit to millimeters
      format: "a4", // Set paper format to A4
    });

    doc.setFontSize(12);
    doc.text("Timetable", 10, 10);

    doc.autoTable({ html: tableRef.current });
    doc.save("timetable-1.pdf");
  };
  return (
    <Main>
      <Helmet>
        <title>{tabName}</title>
      </Helmet>
      <Row className="g-0">
        <Row>
          <Col lg={10} className="mx-4">
            <Link className="nav-link" to="/">
              Home <i className="fa-solid fa-chevron-right"></i> Time Table
            </Link>
          </Col>
        </Row>
        <Row>
          <Col lg={4} className="mx-2 p-4" id="tabledata">
            {classList && classList.length > 0 ? (
              <Form.Group>
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicClass"
                >
                  Class Name
                </Form.Label>
                <Form.Select
                  name="section_id"
                  value={sectionId}
                  onChange={onChangeClass}
                >
                  <option value="">-Select Class-</option>
                  {classList.map((cls, index) => (
                    <option key={index} value={cls.section_id}>
                      {cls.classname}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <></>
            )}
          </Col>
          <Col lg={4} className="mx-2 p-4">
            {teacherList && teacherList.length > 0 ? (
              <Form.Group>
                <Form.Label
                  className="form-view-label"
                  htmlFor="formBasicClass"
                >
                  Teacher Name
                </Form.Label>
                <Form.Select
                  name="teacher_id"
                  value={teacherId}
                  onChange={onChangeTeacher}
                >
                  <option value="">-Select Teacher-</option>
                  {teacherList.map((teacher, index) => (
                    <option key={index} value={teacher.id}>
                      {teacher.teachername}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="mx-2 p-4" style={{ textAlign: "right" }}>
            <Button className="mx-2" onClick={onDownloadPDF}>
              Download
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="mx-4">
            <div>
              {console.log("View: " , view)}
              {view === "teacher" ? (
                teacher ? (
                  <PrintTeacherTimetable
                    teacher={teacher}
                    tableRef={tableRef}
                  />
                ) : (
                  <>No Teacher Data Found!</>
                )
              ) : view === "class" ? (
                classTimeTable ? (
                  <PrintClassTimeTable
                    timeTableSlots={classTimeTable.timeSlotsResult}
                    tableRef={tableRef}
                  />
                ) : (
                  <>No Class Data Found!</>
                )
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
      </Row>
    </Main>
  );
}
