/**
 * @author: Pooja Vaishnav
 */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import schoolApi from "../../api/schoolApi";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import Main from "../layout/Main";
import InfoPill from "../InfoPill";
import Confirm from "../Confirm";
import PubSub from "pubsub-js";
import { ShimmerTable } from "react-shimmer-effects";
import { ToastContainer, toast } from "react-toastify";
const TimetableList = () => {
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [timeTable, setTimeTable] = useState([]);

  useEffect(() => {
    fetchtimeTables();
  }, []);

  const fetchtimeTables = () => {
    async function inittimeTable() {
      try {
        const result = await schoolApi.fetchTimetable();
        console.log('result1222==>', result);
        setBody(result);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setBody([]);
      }
    }
    inittimeTable();
  };

  const deletetimeTable = async () => {
    try {
      console.log('deletetimeTable');
      const timeTable = await schoolApi.deletetimeTable(timeTable.id);
      console.log('timeTableTTT=>', timeTable);
      if (timeTable.success === true) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Deleted",
          message: "Record deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting timeTable:", error);
    }
  };

  const onFilterType = (event) => {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue === '') {
      setBody(timeTable);
    } else {
      setBody(
        timeTable.filter((data) => (
          (data.recordtype || '').toLowerCase() === filterValue ||
          (data.location || '').toLowerCase() === filterValue ||
          (data.religion || '').toLowerCase() === filterValue
        ))
      );
    }
  };

  const header = [
    {
      title: 'Class Name', prop: 'classname', isFilterable: true,
      cell: (row) => (
        <Link
          to={"/timetable/" + row.id}
          state={row}
        >
          {row.classname}
        </Link>
      )
    },
    { title: 'Section Name', prop: 'section_name', isFilterable: true },
    { title: 'Teacher Name', prop: 'contact_name' },
    { title: 'Subject Name', prop: 'subject_name', isFilterable: true },
    { title: 'Time Slot Type', prop: 'type', isFilterable: true }
  ];

  const labels = {
    beforeSelect: " "
  };

  //add record
  const addTimeTable = () => {
    console.log('addTimeTable@@@=>');
    navigate('/addtimetable');
  };

  const handleChange = (e) => {
    setTimeTable({ ...timeTable, [e.target.name]: e.target.value });
  }
  async function handleAddtimeTable(e) {
    e.preventDefault();
    console.log('inside the handleAddtimeTable==>', timeTable);
    if (timeTable.id) {
      const timeTable = await schoolApi.updatetimeTable(timeTable);
      toast.success("Record Updated Succesfully!", { position: toast.POSITION.TOP_RIGHT });
      setTimeTable({ ...timeTable, type: '', start_time: '', end_time: '', status: '' });
      refresh();
    } else {
      const result = await schoolApi.createtimeTable(timeTable);
      if (result.success === true) {
        toast.success("Record Created Succesfully!", { position: toast.POSITION.TOP_RIGHT });
        setTimeTable({ ...timeTable, type: '', start_time: '', end_time: '', status: '' });
        refresh();
      } else {
        toast.success(result.message, { position: toast.POSITION.TOP_RIGHT });
        setTimeTable({ ...timeTable, type: '', start_time: '', end_time: '', status: '' });
      }

    }
  };
  const refresh = () => {
    fetchtimeTables();
  };
  const handleModalClose = () => {
    setShow(false);
  }
  return (
    <Main>
      <Row className="g-0">
        {/* MODAL END */}
        <Col lg={5} className="mx-4">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>
            <strong> Timetable</strong>
          </Link>
        </Col>

        <Col lg={12} className="px-lg-4">
          {body ? (
            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
              initialState: {
                rowsPerPage: 15,
                options: [5, 10, 15, 20]
              }
            }}>
              <Row className="mb-4">
                <Col xs={12} lg={3} className="d-flex flex-col justify-content-end align-items-end">
                  <Filter />
                </Col>
                <Col xs={12} sm={5} lg={5} className="d-flex flex-col justify-content-start align-items-start">
                  {modalShow && (
                    <Confirm
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      deletetimeTable={deletetimeTable}
                      title="Confirm delete?"
                      message="You are going to delete the record. Are you sure?"
                      table="time_slot"
                    />
                  )}
                 
                  <PaginationOptions labels={labels} />
                  <div style={{ "marginTop": "5px" }} >
                    <InfoPill left="Total Slots" right={body.length} />
                  </div>
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2 d-flex flex-col justify-content-end align-items-end">
                  <Button
                    className="btn"
                    variant="outline-primary"
                    onClick={() => addTimeTable(true)}
                  >
                    Add Time Table
                  </Button>
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper>
          ) : <ShimmerTable row={10} col={8} />}
        </Col>
        <Col lg={2}>
          <Modal show={show} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Time Slot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mx-2">
                  <Col md={6}>
                    <Form.Group controlId="formType">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter type"
                        name="type"
                        onChange={handleChange}
                        value={timeTable.type}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group controlId="formStartTime">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        placeholder="Enter start time"
                        name="start_time"
                        onChange={handleChange}
                        value={timeTable.start_time}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mx-2">
                  <Col md={6}>
                    <Form.Group controlId="formEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        placeholder="Enter end time"
                        name="end_time"
                        onChange={handleChange}
                        value={timeTable.end_time}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Status"
                        name="status"
                        onChange={handleChange}
                        value={timeTable.status}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleAddtimeTable}>
                Add Time Slot
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
      <ToastContainer />
    </Main>
  );
};

export default TimetableList;
