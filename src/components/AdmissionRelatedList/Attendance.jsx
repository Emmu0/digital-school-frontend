

import React, { useState, useEffect } from "react";
import { ShimmerTable } from "react-shimmer-effects";
import { Table, Button, Row, Col, Modal, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import Badge from 'react-bootstrap/Badge';

import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

function Attendance(studentId) {
  console.log("studentId!!@!->", studentId);
  const [attendance, setAttendance] = useState([]);
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const headerAtt = [
    { title: "Month", prop: "month", isFilterable: true },
    { title: "Total Lecture", prop: "total_lectures", isFilterable: true },
    { title: "Total Present", prop: "total_present" },
    { title: "Total Absent", prop: "total_absent" },
    {
      title: "Actions",
      prop: "id",
      cell: (id) => (
        <Button
          className="btn-sm mx-2 btnHover"
          variant="primary"
          onClick={() => handleMonthlyAttendance(id)}
        >
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleMonthlyAttendance = async (id, monthAttendance) => {
    console.log("row@@=>", id, monthAttendance);
    const attendanceData = [];
    Object.keys(monthAttendance).forEach((month) => {
      const monthData = monthAttendance[month];
      if (monthData && monthData.attendance) {
        attendanceData.push(...monthData.attendance);
      }
    });

    setExistingAttendance(attendanceData);
    setShowModel(true);
  };
  const handleCloseModal = () => {
    setShowModel(false);
  };
  const fetchAttendance = async () => {
    console.log("fetchAttendance@@@=>");
    let student_id = studentId.studenId;
    let month = null;
    if (student_id !== null) {
      const result = await schoolApi.fetchAttendanceFilterByData(
        student_id,
        month
      );
      console.log('result666=>', result)
      if (result.success === true) {
        setAttendance([result]);
      } else {
        setAttendance([result]);
      }
    }
  };
  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }
  return (
    <div>
      <Modal
        show={showModel}
        backdrop="static"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        onHide={handleCloseModal}
        size="lg"
      >
        <Modal.Header closeButton className="modalstyle">
          <Modal.Title className="ms-auto modalstyle222">Attendance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              <Col lg={3}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label attendance_label"
                    htmlFor="formBasicFirstName"
                  >
                    Date
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label attendance_label"
                    htmlFor="formBasicFirstName"
                  >
                    Status
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label attendance_label"
                    htmlFor="formBasicFirstName"
                  >
                    Date
                  </Form.Label>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label attendance_label"
                    htmlFor="formBasicFirstName"
                  >
                    Status
                  </Form.Label>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              {existingAttendance?.map((item, index) => (
                <React.Fragment key={index}>
                  <Col lg={3}>
                    <Form.Group className="mx-3">
                      <Form.Text className="text-muted" style={{ fontSize: '12px', fontFamily: 'Arial' }}>
                        {formatDate(item.date)}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group className="mx-3">
                      <Form.Text className="text-muted">
                        {item.status === 'present' ? <Badge bg="success" style={{ fontSize: '10px', marginBottom: '9px' }}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge> :
                          <Badge bg="danger" style={{ fontSize: '10px', marginBottom: '9px' }}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Badge>}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modalstyle">
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="mt-2">
        <Col lg={12}>
          {console.log('attendance@=>', attendance)}
          {console.log('attendance.length@=>', attendance.length)}

          {console.log('attendance[0]["success"] =>', attendance.length > 0 && attendance[0] !== undefined &&
            attendance[0].hasOwnProperty('success') ? attendance[0].success : ''
          )}

          {attendance.length > 0 && attendance[0] !== undefined &&
            attendance[0].hasOwnProperty('success') === true ? (
            attendance[0].success ? (
              <DatatableWrapper body={attendance} headers={headerAtt}>
                <Table striped className="data-table custom-table-subject-list">
                  <TableHeader />
                  <TableBody>
                    {attendance.map((item, index) => (
                      <tr key={index}>
                        {console.log('Hai=>', item.result)}
                        <td>{item.result.month}</td>
                        <td>{item.result.total_lectures}</td>
                        <td>{item.result.total_present}</td>
                        <td>{item.result.total_absent}</td>
                        <td>
                          <Button
                            className="btn-sm mx-2 btnHover"
                            variant="primary"
                            onClick={() =>
                              handleMonthlyAttendance(
                                item.result.id,
                                item.result.monthly_attendance
                              )
                            }
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </Table>
                <Pagination />
              </DatatableWrapper>
            ) : (
              <div>
                {console.log('No records found')}
                <DatatableWrapper body={attendance} headers={headerAtt}>
                  <Table striped className="data-table custom-table-subject-list">
                    <TableHeader />
                    <TableBody>
                      <tr>
                        <td colSpan={5} className="text-center">No Records Found!!!</td>
                      </tr>
                    </TableBody>
                  </Table>
                  <Pagination />
                </DatatableWrapper>
              </div>
            )
          ) : null}

        </Col>
      </Row>
    </div>
  );
}

export default Attendance;