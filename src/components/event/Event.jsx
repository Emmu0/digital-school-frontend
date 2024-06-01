import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Main from '../layout/Main';
import schoolApi from '../../api/schoolApi';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Confirm from '../Confirm';


const Event = () => {
  const localizer = momentLocalizer(moment);

  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showModel,setShowModal] = useState(false);
  const [eventSelectedData, setEventSeletedData] = useState({});
  const [showDeleteModal,setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    const allEventData = await schoolApi.getAllEvents();
    console.log('allEventData===================>', allEventData);
    if(allEventData){
      setEvents(allEventData);
    }else{
      console.log('error msg ====>');
    }
    console.log('setEvents===================>', allEventData);

  };
  
  const onSelectEvent = (calEvent) =>{
    setEventSeletedData(calEvent);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const handleEdit = () =>{
    navigate('/addevent',{state:eventSelectedData});
  }

  const handleDeleteButton = () =>{
     const deleteEvent = schoolApi.deleteEvent(eventSelectedData.id);
     setShowDeleteModal(false)
     setShowModal(false);
     fetchAllEvents();
  }

  const eventPropGetter = (event) => {
    const eventProps = {};
    if (event && event.title) {
      const color = event.colorcode;
          eventProps.style = {
            backgroundColor: color
          };
    }
    return eventProps;
  };
  

  return (
    <Main>

{showDeleteModal &&
          <Confirm
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            handleDeleteButton={()=>handleDeleteButton()}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="deleteEvent"
          />}


<Modal show={showModel} backdrop="static"  centered  aria-labelledby="contained-modal-title-vcenter" onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Selected Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
              <Row>
               <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                      Event Title
                    </Form.Label><br/>
                     {eventSelectedData.title}
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                      Event Type
                    </Form.Label><br/>
                     {eventSelectedData.event_type}
                  </Form.Group>
                </Col>
              </Row>
              <br/>
              <Row>
              <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                     Start Date
                    </Form.Label><br/>
                     {eventSelectedData.start_date}
                  </Form.Group>
                </Col>
                <Col lg={6}>
                <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                     End Date
                    </Form.Label><br/>
                     {eventSelectedData.end_date}
                  </Form.Group>
                </Col>
              </Row>
              <br/>
              <Row>
              <Col lg={6}>
                <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        style={{font:'bold', fontSize:'17px'}}
                      >
                        Start Time
                      </Form.Label><br/>
                      {eventSelectedData.start_time}
                    </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                      End Time
                    </Form.Label><br/>
                     {eventSelectedData.end_time}
                  </Form.Group>
                </Col>
              </Row>
              <br/>
              <Row>
              <Col lg={12}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      style={{font:'bold', fontSize:'17px'}}
                    >
                      Description
                    </Form.Label><br/>
                     {eventSelectedData.description}
                  </Form.Group>
                </Col>
              </Row>
         </Form> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" 
                  onClick={handleEdit}
                  >
            Edit
          </Button>
          <Button variant="danger" 
                  onClick={()=>setShowDeleteModal(true)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <div className='mx-3 mt-3'>
           <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start_date"
            endAccessor="end_date_model"
            onSelectEvent={onSelectEvent}
            style={{ height: 600 }}
            eventPropGetter={eventPropGetter}
            views={['month', 'agenda']}
          />
        </div>
      </div>
      
    </Main>
  );
};

export default Event;

