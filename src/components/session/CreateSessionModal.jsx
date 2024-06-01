import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import schoolApi from '../../api/schoolApi';

const CreateSessionModal = (props) => {
     console.log('CreateSessionModal props=======>',props);
    const [sessionData, setSessionData] = useState({
        startdate: "",
        enddate: "",
        year: ""
      });

      useEffect(() => {
        if (props.sessionData) {
            setSessionData({
                startdate: props.sessionData.startdate.split("T")[0],
                enddate: props.sessionData.enddate.split("T")[0],
                year: props.sessionData.year
          });
        } else {
            setSessionData({
                startdate: "",
                enddate: "",
                year: ""
          });
        }
      }, [props.sessionData]);
   
      useEffect(() => {
        if (sessionData.startdate && sessionData.enddate) {
            const start = sessionData.startdate.split("-");
            const end = sessionData.enddate.split("-");
            const startYear = parseInt(start[0]);
            const endYear = parseInt(end[0]);
            const year = startYear + "-" + endYear;
            setSessionData(prevSessionData => ({
                ...prevSessionData,
                year: year
            }));
        }
    }, [sessionData.startdate, sessionData.enddate]);


      const handleChange = (event) => {
        setSessionData(prevSessionData => ({
            ...prevSessionData,
            [event.target.name]: event.target.value
        }));
       };
    
   

      const handleSubmit = async () => {
        console.log('enter handle submit ====>', sessionData);
        if(sessionData.startdate && sessionData.enddate && sessionData.year){
              if(props.sessionData){
                console.log('update========>', props.sessionData);
                try{
                    const result = await schoolApi.updateSession(props.sessionData.id, sessionData);
                    console.log('Update session created data =====>', result);
                    if(result){
                      props.handleCloseModal();
                      toast.success('Session update successfully', {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                      });
                      props.fetchAllSession();
                      setSessionData({
                          startdate: "",
                          enddate: "",
                          year: ""
                      });
                    }
                    
                }catch(error){

                }
              }else{
                try{
                    const result = await schoolApi.createSession(sessionData);
                    console.log('session created data =====>', result);

                    if(result){
                      props.handleCloseModal();
                      toast.success('Session create successfully', {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                      });
                      props.fetchAllSession();
                      setSessionData({
                          startdate: "",
                          enddate: "",
                          year: ""
                    });
                    }        
                }catch(error){

                }
              } 
        }else{
            return toast.error("Please fill all the required fields.",{
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true,
              theme : "colored"
            });
        }
      };

  return (
    <Modal
      show={props.modalShow}
      centered
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => {
        props.handleCloseModal();
        setSessionData({
            startdate: props.sessionData.startdate ? props.sessionData.startdate : "",
            enddate: props.sessionData.enddate ? props.sessionData.enddate : "",
            year: props.sessionData.year ? props.sessionData.year : ""
        });
      }}
    >
      <Modal.Header
        closeButton
        style={{ maxHeight: "",}}
      >
        <Modal.Title>
          {props.sessionData ? "Update Session" : "Create Session"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startdate"
                  placeholder="Enter Start Date"
                  value={sessionData.startdate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="enddate"
                  placeholder="Enter End Date"
                  value={sessionData.enddate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
            <Form.Group className="mx-3 mt-3">
                <Form.Label className="form-view-label">Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  placeholder="Enter your session year"
                  value={sessionData.year}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" 
                onClick={handleSubmit}
                >
          {props.btnName}
        </Button>
        <Button
          variant="light"
          onClick={() => {
            props.handleCloseModal();
            setSessionData({
                startdate: props.sessionData.startdate ? props.sessionData.startdate : "",
                enddate: props.sessionData.enddate ? props.sessionData.enddate : "",
                year: props.sessionData.year ? props.sessionData.year : ""
            });
          }}
        >
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer/>
    </Modal>
  )
}

export default CreateSessionModal
