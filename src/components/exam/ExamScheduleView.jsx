
/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useState, useEffect } from "react";
import { Badge, Button, Card, Col, Form, Container, Table, ListGroup, Modal, Row, Tabs, Tab } from "react-bootstrap";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';

import Confirm from "../Confirm";
import InfoPill from "../InfoPill";
import { ShimmerTable } from "react-shimmer-effects";
import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";
import PubSub from 'pubsub-js';
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExamScheduleView = (props) => {

  const location = useLocation();
  const paramId = useParams();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [record, setRecord] = useState();
  const [scheduleAndClassId, setScheduleAndClassId] = useState({
    classId: '',
    scheduleId: ''
  });
  const [resultRecords, setResultRecords] = useState();
  const [isResult, setIsResult] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [studentRecord, setStudentRecord] = useState({
    student_name: '',
    obtained_marks: '',
    ispresent: true,
    grade_master_id: '',
    exam_schedule_id: '',
    resultid: '',
  });

  const [fetchStudents, setFetchStudents] = useState(false);

  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchExamSchedulesById(paramId.id);
      console.log('resultDataResult==>',result);
      if (result) {
        setScheduleAndClassId({
          classId: result.class_id,
          scheduleId: paramId.id
        })
        setRecord(result);
      } else {
        setRecord([]);
      }
    }
    init();
  }, [resultRecords]);
  const students = () => {
    if (scheduleAndClassId) {
      schoolApi.fetchStudentsByIds(scheduleAndClassId).then((result) => {
        if (result) {
          setResultRecords(result);
        } else {
          setResultRecords([]);
        }
      })
    }
  }

  const editSchedule = () => {
    navigate(`/examschedule/${paramId.id}/e`, { state: record });
  }


  const deleteSchedule = async () => {
    const result = await schoolApi.deleteSchedule(record.id);
    if (result) {
      PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Deleted', message: 'Record Deleted successfully' });
      navigate(`/examschedule`);
    }
  };
  const header = [
    {
      title: "Student",
      prop: "student_name",
      isFilterable: true,
      cell: (row) => (
        <Link>{row.student_name}</Link>
      ),
    },
    {
      title: "Obtained Marks",
      prop: "obtained_marks",
      isFilterable: true,
      cell: (row) => (
        <>
          {studentRecord?.student_admissionid !== row.student_admissionid
            ? row.obtained_marks
            :
            <input
              type="number"
              name="obtained_marks"
              defaultValue={row.obtained_marks}
              placeholder="Enter Marks"
              onChange={(e) => handleChange(e, row)} />}
        </>
      ),
    },
    {
      title: 'Present',
      prop: 'ispresent',
      cell: (row) => (
        <div>
          <input type="checkbox" name="ispresent" defaultChecked={row.ispresent} disabled={studentRecord?.student_admissionid !== row.student_admissionid} onChange={(e) => studentRecord?.student_admissionid == row.student_admissionid && handleChange(e, row)} />
        </div>
      )
    },
    {
      title: '',
      prop: '',
      cell: (row) => (
        <div className="ml-5" onClick={(e) => handleShowModal(e, row)}>
          <i class={`${studentRecord?.student_admissionid !== row.student_admissionid ? "fa-regular fa-pen-to-square" : "fa-solid fa-check"}`}></i>
        </div>
      )
    }]

  const [resultIdArr, setResultArr] = useState([]);
  const [nonResultIdArr, setNonResultIdArr] = useState([]);

  const handleShowModal = (e, row) => {
    if (studentRecord?.student_admissionid !== row?.student_admissionid && studentRecord?.student_admissionid || studentRecord?.student_admissionid == row?.student_admissionid) {

      if (row.ispresent || (row.obtained_marks  && row.obtained_marks > 0)) {
        if ((!row.ispresent || row?.obtained_marks.length == 0) && (row.student_admissionid == studentRecord?.student_admissionid)) {
          toast.error(`Please check the student's presence.`);
          return;
        } else if (row.student_admissionid !== studentRecord?.student_admissionid) {
          setResultRecords()
          students()
        }
      }
      setStudentRecord()
    } else {
      setStudentRecord({
        exam_schedule_id: paramId.id,
        student_name: row.student_name,
        student_admissionid: row.student_admissionid,
        obtained_marks: row.obtained_marks,
        ispresent: row.ispresent,
        grade_master_id: '',
        resultid: row.resultid,
      })
    }
  }
  const handleChange = (e, row) => {
    if (e.target.name == "ispresent") {
      row.ispresent = !row.ispresent
    }
    if (e.target.name == "obtained_marks") {
      row.obtained_marks = e.target.value;
    }
    const stdObj = {
      exam_schedule_id: paramId.id,
      student_name: row.student_name,
      student_admissionid: row.student_admissionid,
      obtained_marks: row.obtained_marks.length == 0 || !row.obtained_marks ? 0 : row.obtained_marks,
      ispresent: row.ispresent,
      grade_master_id: '',
      resultid: row.resultid,
    }

    const existResultId_index = resultIdArr.findIndex(
      (vl) => vl.student_admissionid === row.student_admissionid
    );
    const existNonResultId_index = nonResultIdArr.findIndex(
      (vl) => vl.student_admissionid === row.student_admissionid
    );
    if (row.resultid) {
      if (stdObj.obtained_marks >= 0 && stdObj?.ispresent) {
        if (existResultId_index === -1) {
          resultIdArr.push(stdObj);
        } else if (resultIdArr[existResultId_index].obtained_marks !== row.obtained_marks || resultIdArr[existResultId_index].ispresent !== row.ispresent) {
          resultIdArr[existResultId_index] = stdObj;
        }
      } else {
        resultIdArr.splice(existResultId_index, 1);
      }
    } else {
      if (stdObj.obtained_marks >= 0 && stdObj?.ispresent) {
        if (existNonResultId_index === -1) {
          nonResultIdArr.push(stdObj);
        } else if (nonResultIdArr[existNonResultId_index].obtained_marks !== row.obtained_marks) {
          nonResultIdArr[existNonResultId_index] = stdObj;
        }
      } else {
        nonResultIdArr.splice(existNonResultId_index, 1);
      }
    }

  };

  const handleSaveStudentResult = async () => {

    const optainMarks1 = resultIdArr.some((item) => parseInt(item.obtained_marks) >= 100);
    const optainMarks2 = nonResultIdArr.some((item) => parseInt(item.obtained_marks) >= 100);

    if (optainMarks1 || optainMarks2) {
      toast.error('Optain marks Should be less than Max marks');
      return;
    }
    // return false

    // if (studentRecord.ispresent && !studentRecord.obtained_marks) {
    //   toast.error("If present, please enter obtained marks");
    //   return;
    // }

    // if (!studentRecord.ispresent && studentRecord.obtained_marks) {
    //   toast.error("If absent, do not enter obtained marks");
    //   return;
    // }

    // if (studentRecord.obtained_marks < 0 || studentRecord.obtained_marks > 100) {
    //   toast.error("Marks should be between 1 and 100");
    //   return;
    // }

    if (resultIdArr.length > 0) {
      const result2 = await schoolApi.updateResult(resultIdArr);
      if (result2?.success && scheduleAndClassId) {
        toast.success(result2.message)
        setResultArr([]);
        setNonResultIdArr([]);
        setResultRecords();
        students();
      }
    }
    if (nonResultIdArr.length > 0) {
      const result2 = await schoolApi.createResult(nonResultIdArr);
      if (result2.success) {
        toast.success(result2.message)
        setResultArr([]);
        setNonResultIdArr([]);
        setResultRecords();
        students();
      }
    }
  }

  const handleCloseModal = () => {
    // setshowModal(false);
  }


  const labels = {
    beforeSelect: " ",
  };

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <div>
        {record && <Container>
          {modalShow &&
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteSchedule={deleteSchedule}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="exam_schedule"
            />}
          <PageNavigations listName="Exam Detail" listPath="/examschedule" viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

          <Row className="view-form">
            <Col lg={12}>
              <Row className="view-form-header align-items-center mx-2">
                <Col lg={3}>
                  <h5>{record.exam_title_name}4444</h5>
                  {/* <h5>{record.exam_title_name}</h5> */}
                </Col>
                <Col lg={9} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2"
                    onClick={() => editSchedule(true)}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Button>
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={() => setModalShow(true)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Col className="mx-3">
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}></span>
                    </Col>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Title</label>
                  <span>
                    {record.exam_title_name}
                  </span>
                </Col>
                <Col lg={5}>
                  <label>Class</label>
                  <span>{record.class_name}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Date</label>
                  <span>{(moment(record.schedule_date).format('DD-MM-YYYY'))}</span>
                </Col>
                <Col lg={5}>
                  <label>Examinor</label>
                  <span>{record.examinor_info}</span>
                </Col>

                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Subject</label>
                  <span>{record.subject_name}</span>
                </Col>
                <Col lg={5}>
                  <label>Max Marks</label>
                  <span>{record.max_marks}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Min Marks</label>
                  <span>{record.min_marks}</span>
                </Col>
                <Col lg={5}>
                  <label>Duration</label>
                  <span>{record.duration}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Start Time</label>
                  <span>{record.start_time}</span>
                </Col>

                <Col lg={5}>
                  <label>End Time</label>
                  <span>{record.end_time}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>status</label>
                  <span>{record.status}</span>
                </Col>

                <Col lg={5}>
                  <label>Room Number</label>
                  <span>{record.room_no}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Is Practical</label>
                  <span>{record.ispractical === true ? 'Yes' : 'No'}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>


                <Col lg={1}></Col>
                <Col lg={1}></Col>

                <Col>

                </Col>
              </Row>
              <Row>

              </Row>
            </Col>
            <Col></Col>
          </Row>
        </Container>}
      </div>

      <Row>
        <Col lg={12}>
          <Col className="mx-3">
            <Col className="section-header my-3">
              <span className="d-flex justify-content-between" style={{ color: "black" }}>Exam Result
                <Button className="btn-sm mx-3" variant="outline-primary" onClick={() => students()}>Add Result</Button>
              </span>
            </Col>
          </Col>
        </Col>
      </Row>

      {resultRecords?.length > 0 && (

        <Row className="g-0">
          <Col lg={12} className="p-lg-4">

            {resultRecords?.length > 0 ?
              <DatatableWrapper

                body={resultRecords}
                headers={header}
                paginationOptionsProps={{
                  initialState: {
                    rowsPerPage: 15,
                    options: [5, 10, 15, 20]
                  }
                }}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Filter />
                  </Col>
                  <Col lg={1} style={{ 'margin-top': '-18px' }}>
                    <PaginationOptions labels={labels} />
                  </Col>
                  <Col lg={3} style={{ 'margin-top': '-13px' }} >
                    <div >
                      <InfoPill left="Total Exams" right={resultRecords?.length} />
                    </div>
                  </Col>

                </Row>
                <Table striped className="data-table">
                  <TableHeader />
                  <TableBody />
                </Table>
                <Pagination />
                {(resultIdArr.length > 0 || nonResultIdArr.length > 0) &&
                  <Button variant="primary" className=" float-end" onClick={handleSaveStudentResult}>
                    Save
                  </Button>}
              </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
          </Col>

          <Col lg={2}></Col>

        </Row>
      )}
      {/* <ToastContainer position="top-center" autoClose={5000} hideProgressBar /> */}

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
      {/* ---------------------- New Exam Schedule Modal ----------------------------------- */}

      {/* <Modal show={showModal} backdrop="static"  centered  aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Result Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="mt-3">
            <Row>
            <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Student Name
                  </Form.Label>
                  <Form.Control type="text" name="student_name" value={studentRecord.student_name}  readOnly />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Obtained Marks
                  </Form.Label>
                  <Form.Control type="number" name="obtained_marks" value={studentRecord.obtained_marks} placeholder="Enter Marks"  onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col lg={6} className="mt-3 mx-3">
              <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Present 
                  </Form.Label>
                  <input type="checkbox" name="ispresent"  checked={studentRecord.ispresent} onChange={handleChange}/>
            </Col> 

            </Row>
         </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveStudentResult}>
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
        </Modal.Footer>
      </Modal>  */}

    </Main>
  )
}
export default ExamScheduleView