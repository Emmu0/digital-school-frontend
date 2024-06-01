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
const TimeSlotList = () => {
  let [sessions, setSessions] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [body, setBody] = useState([]);
  const [timeslot, setTimeSlot] = useState([]);
  const [optionTimeSlot, setOptionTimeSlot] = useState([]);
  const [buttonName, setButtonName] = useState('Add Time Slot');

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async() => {
    sessions = await schoolApi.fetchSessions(true);
        console.log("sessions", sessions);
        setSessions(sessions);
    async function initTimeSlot() {
      try {
        const result = await schoolApi.fetchTimeSlot();
        setBody(result);
        setOptionTimeSlot(result);
        setShow(false);
      } catch (error) {
        console.error("Error fetching timeslots:", error);
        setBody([]);
        setOptionTimeSlot([]);
      }
    }
    initTimeSlot();
  };
console.log('what is in the =>',timeslot);
//console.log('what is in the1111 =>',timeslot[0].type);
  const handleDelete = (row) => {
    console.log('handleDelete',row.id);
    setModalShow(true);
    deleteTimeSlot(row.id);
  };

  const handleEdit = (row) => {
    setShow(true);
    setTimeSlot(row);
    setButtonName('Update');
  }
  const deleteTimeSlot = async (id) => {
    try {
      console.log('deleteTimeSlotRec',id);
      const timeSlot = await schoolApi.deleteTimeSlot(id);
      console.log('timeSlotTTT=>', timeSlot);
      if (timeSlot.success === true) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Deleted",
          message: "Record deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting timeslot:", error);
    }
  };

  const onFilterType = (event) => {
    console.log('event.target.value@@=>',event.target.value);
    if (event.target.value === '') {
      console.log('in');
      setBody(timeslot);
    }  else {
      console.log('else@@@=>')
      setBody(
        optionTimeSlot.filter((data) => {
          console.log('hhhh@@@=>')
          if ((data.recordtype || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
          if ((data.location || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
          if ((data.type || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
        })
      );
    }
  };

  const header = [
    { title: 'Slot Type', prop: 'type', isFilterable: true },
    { title: 'Start Time', prop: 'start_time' },
    { title: 'End Time', prop: 'end_time', isFilterable: true },
    { title: 'Status', prop: 'status', isFilterable: true },
    {
      title: 'Actions',
      prop: 'id',
      cell: (row) => {
        return (
          <>
            <Button className="btn-sm mx-2" variant="primary" onClick={() => handleEdit(row)}>
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
            <Button className="btn-sm mx-2" variant="primary" onClick={() => handleDelete(row)}>
              <i className="fa fa-trash"></i>
            </Button>
          </>
        );
      },
    }
  ];

  const labels = {
    beforeSelect: " "
  };

  //add record
  const addTimeSlot = () => {
    setShow(true);
  };

  const handleChange = async(e) => {
    setTimeSlot({ ...timeslot, [e.target.name]: e.target.value});
  }
  async function handleAddTimeSlot(e) {
    e.preventDefault();
    if (!timeslot.type || !timeslot.start_time || !timeslot.end_time || !timeslot.status) {
      toast.error("Please fill in all required fields!");
      return;
    }
    if (!timeslot.start_time || !timeslot.end_time || timeslot.start_time > timeslot.end_time) {
      toast.error("Start time should not be less than with end time!!!!!!");
      return;
    }
    if (timeslot.id) {
      const timeSlot = await schoolApi.updateTimeSlot(timeslot);
      toast.success("Record Updated Succesfully!", { position: toast.POSITION.TOP_RIGHT });
      setTimeSlot({ ...timeslot, type: '', start_time: '', end_time: '', status: '' });
      refresh();
      setShow(false);
    } else {
      const currentYear = new Date().getFullYear();
      const currentYearString = currentYear.toString();
      console.log(currentYearString);
      let res = {
        ...timeslot,
        session_id: sessions[0].id, 
      }
      console.log('timeslot@@@res=>',timeslot);
      const result = await schoolApi.createTimeSlot(res);
      if (result.success === true) { 
        toast.success("Record Created Succesfully!", { position: toast.POSITION.TOP_RIGHT });
        setTimeSlot({ ...timeslot, type: '', start_time: '', end_time: '', status: '' });
        refresh();
        handleModalClose();
      } else {
        toast.success(result.message, { position: toast.POSITION.TOP_RIGHT });
        setTimeSlot({ ...timeslot, type: '', start_time: '', end_time: '', status: '' });
      }

    }
  };
  const refresh = () => {
    fetchTimeSlots();
  };
  const handleModalClose = () => {
    setShow(false);
    setTimeSlot([]);
  }
  return (
    <Main>
      <Row className="g-0">
        {/* MODAL END */}
        <Col lg={5} className="mx-4">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>
            <strong> TimeSlot</strong>
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
                      deleteTimeSlot={deleteTimeSlot}
                      title="Confirm delete?"
                      message="You are going to delete the record. Are you sure?"
                      table="time_slot"
                    />
                  )}
                  <Form.Group className="mt-4 mx-3" controlId="formBasicStatus">
                    <Form.Select aria-label="Enter type" name="type" onChange={onFilterType}>
                    {console.log('optionTimeSlot',optionTimeSlot)}
                      <option value="">--Select Type--</option>
                       {optionTimeSlot.map((cls) => (
                          <option key={cls.id}>
                              {cls.type} 
                          </option>
                      ))} 
                    </Form.Select>
                  </Form.Group>
                  <PaginationOptions labels={labels} />
                  <div style={{ "marginTop": "5px" }} >
                    <InfoPill left="Total Slots" right={body.length} />
                  </div>
                </Col>
                <Col xs={12} sm={6} lg={4} className="mb-2 d-flex flex-col justify-content-end align-items-end">
                  <Button
                    className="btn"
                    variant="outline-primary"
                    onClick={() => addTimeSlot(true)}
                  >
                    Add Time Slot
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
                        value={timeslot.type}
                        required
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
                        value={timeslot.start_time}
                        required
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
                        value={timeslot.end_time}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formStatus">
                      <Form.Label>Status</Form.Label>
                        <Form.Select
                          required
                          name="status"
                          value={timeslot.status}
                          onChange={handleChange}
                        >
                          <option value="none">None</option>
                          <option value="active">Active</option>
                          <option value="inactive">InActive</option>
                        </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleAddTimeSlot}>
                {buttonName}
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
      <ToastContainer />
    </Main>
  );
};

export default TimeSlotList;
