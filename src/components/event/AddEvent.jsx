import React, { useEffect } from 'react';
import Main from '../layout/Main';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import schoolApi from '../../api/schoolApi';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import Circle from '@uiw/react-color-circle';
import { CompactPicker, TwitterPicker } from 'react-color';


const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState({
    title: location.state ? location.state.title : '',
    event_type: location.state ? location.state.event_type : '',
    start_date: location.state ? location.state.start_date : '',
    start_time: location.state ? location.state.start_time : '',
    end_date: location.state ? location.state.end_date : '',
    end_time: location.state ? location.state.end_time : '',
    description: location.state ? location.state.description : '',
    colorcode: location.state ? location.state.colorcode : '',
  });
  const [btnName, setBtnName] = useState('Save');
  const [hex, setHex] = useState('#F44E3B');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBtnName('Update');
    }
  }, [location.state]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
    console.log('setEvent =======>', event);
  };

  const handleSubmit = async () => {
    if (event.title && event.event_type && event.start_date && event.start_time && event.end_date && event.end_time) {
      if(event.start_date === event.end_date){
        if (event.start_date > event.end_date) {
          return toast.error('Start date must be before end date.');
        }
  
        if (event.start_time >= event.end_time) {
          return toast.error('End time must be after start time.');
        }
      }
     
      if (location.state && location.state.id) {
        console.log('enter with id =====>', location.state.id);
        console.log('event =====>', event);
        const updatedEventResult = await schoolApi.updateEvent(location.state.id, event);
        if (updatedEventResult) {
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Event Update',
            message: 'Event Update successfully',
          });
          setEvent({
            title: '',
            event_type: '',
            start_date: '',
            start_time: '',
            end_date: '',
            end_time: '',
            description: '',
            colorcode: '',
          });
          navigate('/eventscalender');
        }
      } else {
        const eventResult = await schoolApi.createEvent(event);
        if (eventResult) {
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Event Saved',
            message: 'Event saved successfully',
          });
          setEvent({
            title: '',
            event_type: '',
            start_date: '',
            start_time: '',
            end_date: '',
            end_time: '',
            description: '',
            colorcode: '',
          });
          navigate('/eventscalender');
        }
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handleColour = (color) => {
    // setHex(color.hex)
    setEvent({ ...event, colorcode: color.hex });
  };

  console.log('events after colors', event);

  const handleCancel = () => {
    // setEvent({
    //   title: '',
    //   event_type: '',
    //   start_date: '',
    //   start_time: '',
    //   end_date: '',
    //   end_time: '',
    //   description: '',
    // });
    navigate('/eventscalender');
  };

  const twitterStyle = {
    default: {
      input: {
        display: "none"
      },
      hash: {
        display: "none"
      }
    }
  };

  const handleColorPickerClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const today = new Date().toISOString().split('T')[0];


  return (
    <Main>
      <Container className="view-form">
        <Row>
          <Col></Col>
          <Col lg={8}>
            <Form className="mt-3" onSubmit={handleSubmit}>
              <Row className="view-form-header align-items-center">
                <Col lg={3}>Event</Col>
                <Col lg={9} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2" onClick={handleSubmit}>
                    {btnName}
                  </Button>
                  <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                  <Button className="btn-sm" variant="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>
              <Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicTitle">
                        Title
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="title"
                        placeholder="Enter Title Name"
                        value={event.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicEventType">
                        Event Type
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="event_type"
                        placeholder="Enter Event Type"
                        value={event.event_type}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicStartDate">
                        Start Date
                      </Form.Label>
                      <Form.Control
                        required
                        type="Date"
                        name="start_date"
                        placeholder="Enter Start Date"
                        value={event.start_date}
                        onChange={handleChange}
                        min={today}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicStartTime">
                        End Date
                      </Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="end_date"
                        placeholder="Enter End Date"
                        value={event.end_date}
                        onChange={handleChange}
                        min={today}
                      />
                    </Form.Group>

                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicStartTime">
                        Start Time
                      </Form.Label>
                      <Form.Control
                        required
                        type="time"
                        name="start_time"
                        value={event.start_time}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicEndTime">
                        End Time
                      </Form.Label>
                      <Form.Control
                        required
                        type="time"
                        name="end_time"
                        placeholder="Enter End Time"
                        value={event.end_time}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label" htmlFor="formBasicDescription">
                        Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Enter Description"
                        value={event.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12}>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicEventColor"
                    >
                      Select Event Color
                    </Form.Label>
                    <div
                      className="color-picker-input"
                      onClick={handleColorPickerClick}
                    >
                      <Form.Control
                        type="text"
                        name="colorcode"
                        placeholder="Select Event Color"
                        value={event.colorcode}
                        style={{ height: '48px' }}
                      />
                      {showColorPicker && (
                        <TwitterPicker
                          colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE',
                            '#13F6C6', '#30EEA0', '#CF16F0', '#28D2F4', '#16F17D', '#A0A223',
                            '#BD6D0E', '#B52AED', '#8895C7', '#4D5F11', '#904A4A', '#F48E8E',
                            '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
                            '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
                            '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'
                          ]}
                          color={event.colorcode}
                          onChange={handleColour}
                          styles={twitterStyle}
                        />
                      )}
                    </div>
                    </Form.Group>
                  </Col>


                </Row>
              </Row>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </Main>
  );
};

export default AddEvent;
