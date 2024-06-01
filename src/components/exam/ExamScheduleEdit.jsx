
/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import PubSub from 'pubsub-js';

import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ExamScheduleEdit = (props) => {

  const location = useLocation();
  console.log('location for edit page',location );
  const navigate = useNavigate();
    const [examinor, setExaminor] = useState();
  const [subject, setSubject] = useState();
   const [classname, setClassname] = useState();
  const [title, setTitle] = useState();
  const [sessionYear, setSessionYear] = useState([]);  //Add by Aamir khan 08-05-2024


  const [scheduleRec, setScheduleRec] = useState({
    // exam_title_id: '',
    // schedule_date: '',
    // start_time: '',
    // end_time: '',
    // duration: '',
    // room_no: '',
    // examinor_id: '',
    // status: '',
    // subject_id: '',
    // class_id: '',
    // max_marks: '',
    // min_marks: '',
    // ispractical: 'false'
  });



  useEffect(() => {
    async function related() {
      const result = await schoolApi.fetchRelatedRecords();
      if (result) {
        console.log('related records', result);
        setExaminor(result[0]);
        setSubject(result[1]);
        setClassname(result[2]);
        setTitle(result[3]);
       
      } else {
        console.log('error');
      }

      //Add by Aamir khan 08-05-2024
      const sessions = await schoolApi.fetchSessions();
      console.log('sessions-->', sessions);
      if (sessions) {
        setSessionYear(sessions);
        
      } else {
        setSessionYear([]);
      }
    }
    related();
  }, []);

  useEffect(() => {
    async function init() {
      if(location.state){
        const result = await schoolApi.fetchExamSchedulesById(location.state.id);
        console.log('result by id==>',result);
        if (result) {
          console.log('result fetch by id',result);
          setScheduleRec(result);
        } else {
          setScheduleRec([]);
        }
      }
    }
    init();
  }, [location.state]);

 
  //Add by Aamir khan 09-05-2024
  const handleChange = (e) => {
    console.log('e.target.value ==>', e.target.value, ' e.target.name ==> ', e.target.name);
    const { name, value } = e.target;

   
    setScheduleRec((prevRecs) => {
   
        const updatedRecs = {
            ...prevRecs,
            [name]: value,
        };

      
        if (name === "start_time" || name === "end_time") {
            calculateDuration();
        }

       
        if (name === 'sessionid') {
            const sessionIndex = e.target.selectedIndex - 1;  // Adjusted for zero-based index if necessary
            if (value !== '' && sessionIndex >= 0 && sessionYear[sessionIndex]) {
                updatedRecs.sessionid = sessionYear[sessionIndex].id;
                updatedRecs.year = value;
            } else {
                updatedRecs.sessionid = '';
                updatedRecs.year = '';
            }
        }

        return updatedRecs;
    });
};
  
  const calculateDuration = () => {
    const startTime = new Date(`01/01/2000 ${scheduleRec.start_time}`);
    const endTime = new Date(`01/01/2000 ${scheduleRec.end_time}`);
    const diff = endTime - startTime;
    if (!isNaN(diff)) {
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const totalMinutes = hours * 60 + minutes;
      setScheduleRec((prevRecs) => ({
        ...prevRecs,
        duration: totalMinutes,
        status: 'Upcoming'
      }));
    }
  };
  useEffect(() => {
    calculateDuration();
  }, [scheduleRec.start_time, scheduleRec.end_time]);
  const handleCheckbox = (e)=>{
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setScheduleRec((prevRecs) => ({
      ...prevRecs,
      [e.target.name]: value === 'on' ? true : value === '' ? false : value,
    }));
  }

  console.log('scheduleRec',scheduleRec);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(scheduleRec.schedule_date);

    console.log('scheduleRec==>',scheduleRec);
    if (
      !scheduleRec.exam_title_id ||
      !scheduleRec.class_id ||
      !scheduleRec.subject_id ||
      !scheduleRec.examinor_id ||    // Add by Aamir khan 
      // !scheduleRec.examinor_id ||
      !scheduleRec.schedule_date ||
      // !scheduleRec.room_no ||
      !scheduleRec.start_time ||
      !scheduleRec.end_time
      // !scheduleRec.duration ||
     // !scheduleRec.status 
    ) {
     toast.error("Fill all required values!!!"); 
      return;
    }

    if (selectedDate <= currentDate) {
      toast.error("Schedule date should be greater than today's date!!!");
      return;
    }

    // if(scheduleRec.max_marks < scheduleRec.min_marks){
    //   toast.error("Min marks should less then max marks!!!");
    //   return;
    // }

    if(scheduleRec.duration === 0 || scheduleRec.duration < 0){
      toast.error("Enter valid duration!!!");
      return;
    }

    if (!scheduleRec.start_time || !scheduleRec.end_time || scheduleRec.start_time > scheduleRec.end_time) {
      toast.error("Start time should not be greater than end time!!!");
      return;
    }
  
    console.log('scheduleRec',scheduleRec);

      //========= Logic to perform Create or Edit ======
      let result2 = {};
      if (scheduleRec.id) {
        console.log('Schedule to be update id==>',scheduleRec.id);
        console.log('scheduleRec for update',scheduleRec);
        result2 = await schoolApi.updateExamSchedule(scheduleRec.id, scheduleRec);
        console.log("result after update--",result2)
        
        if (result2) {
          PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Updated', message: 'Record saved successfully' });
          navigate('/examschedule'); 
        }
      } else {
        console.log('schedule create', scheduleRec)
        result2 = await schoolApi.createExamSchedule(scheduleRec);
        console.log("Result after save =>",result2)
        console.log('result2.id==>',result2.id);
  
        if (result2) {
          PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
      
          try {
            if (result2 && result2.id){
                // Navigate only if result2 and result2.id are valid
                console.log('ENterName')
                 navigate(`/examscheduleview/${result2.id}`, { state: result2 });
                 
            } else {
            console.log('Invalid navgate');
              console.error('Invalid result2 or result2.id:', result2);
              // Handle the error or log it accordingly
            }
          
          } catch (error) {
              console.log('@#Error==>',error);
              console.error('Navigation error:', error);
              // Handle the error gracefully, such as showing a toast message or logging it
          }
      }
      
      }
  };

  const handleCancel = () => {
    if (location?.state?.id) {
      navigate("/examscheduleview/" + location?.state?.id);
    } else {
      navigate('/examschedule');
    }

  };
  return (
   <>
     <Main>
     <Helmet> <title>{props?.tabName}</title> </Helmet>
      <PageNavigations id={location.state?.id} listName={ props?.selectedDepartment  === 'scheduleEdit' ? '' : 'ScheduleNewExam'} listPath={location?.pathname?.split('/')[1] === "/examschedule" ? '' : "/examschedule" } viewName="Exam Edit" viewPath={"/examscheduleview/" +  location.state?.id} colLg={10} colClassName="d-flex px-3 py-2" extrColumn={2}/>
      <Container className="view-form">
      <Row>
        <Col></Col>
        <Col lg={8}>
          <Form className="mt-3" onSubmit={handleSubmit}>
            <Row className="view-form-header align-items-center">
              <Col lg={3}>
                Exam Details
              </Col>
              <Col lg={9} className="d-flex justify-content-end">
                <Button className="btn-sm mx-2" onClick={handleSubmit}>
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
                <Button
                  className="btn-sm"
                  variant="danger"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Col>
              </Row>
              <Row>
               <Col lg={6}>
                 <Form.Group className="mx-3">
                   <Form.Label
                     className="form-view-label"
                   >
                    Exam Title
                   </Form.Label>
                   <Form.Select name="exam_title_id" onChange={handleChange} value={scheduleRec.exam_title_id} required>
                   <option value="">--Select Title --</option>
                   {title && title.map((res) => (
                    <option key={res.title} value={res.id}>
                      {res.title}
                    </option>
                  ))}
                   </Form.Select>
                 </Form.Group>
               </Col>
               <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                  >
                    Class
                  </Form.Label>
                  <Form.Select
                    name="class_id"
                    onChange={handleChange}
                    value={scheduleRec.class_id}
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {console.log('classname==>',classname)}
                    {classname && classname.map((res) => (
                    <option key={res.classname} value={res.id}>
                      {res.classname}
                    </option>
                  ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                  >
                    Subject
                  </Form.Label>
                  <Form.Select
                    name="subject_id"
                    onChange={handleChange}
                    value={scheduleRec.subject_id}
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {subject && subject.map((res) => (
                    <option key={res.subject_name} value={res.id}>
                      {res.subject_name}
                    </option>
                  ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label className="form-view-label">Examinor</Form.Label>
                  <Form.Select
                    required
                    name="examinor_id"   //change by Aamir khan 09-05-2024
                    onChange={handleChange}
                    value={scheduleRec.examinor_id} // Assuming scheduleRec.examinor holds the selected ID  //change by Aamir khan 09-05-2024
                  >
                    <option value="">-- Select Examinor --</option>
                    {examinor && examinor.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.examinor_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicLastName"
                  >
                    Date
                  </Form.Label>
                  <Form.Control type="date" name="schedule_date" placeholder="Select Date" value={scheduleRec.schedule_date} onChange={handleChange} required/>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicBirthdate"
                  >
                    Room Number
                  </Form.Label>
                  <Form.Control type="text" name="room_no" placeholder="Enter Room Number" value={scheduleRec.room_no} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicPhone"
                  >
                    Start Time
                  </Form.Label>
                  <Form.Control type="time" name="start_time" placeholder="Enter Start Time" value={scheduleRec.start_time} onChange={handleChange} required />
                </Form.Group>
              </Col>
              
              <Col lg={6}>
              <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicEmail"
                  >
                    End Time
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    placeholder="Enter End Time"
                    value={scheduleRec.end_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
              <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicEmail"
                  >
                    Duration
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    placeholder="Enter Duration"
                    value={scheduleRec.duration}
                    onChange={handleChange}
                    // required
                    disabled
                  />
                </Form.Group>
              </Col>
                 <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                  >
                    Status
                  </Form.Label>
                  {/* <Form.Select
                    name="status"
                    value={scheduleRec.status} 
                    onChange={handleChange}
                    required
                  >
                   <option value="">--Select Status--</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Upcoming">Upcoming</option>
                  </Form.Select> */}
                  {scheduleRec.id &&
                     <Form.Select
                     name="status"
                     value={scheduleRec.status}
                     onChange={handleChange}
                     required
                   >
                    <option value="">--Select Status--</option>
                       <option value="Completed">Completed</option>
                       <option value="Pending">Pending</option>
                       <option value="Upcoming">Upcoming</option>
                   </Form.Select>
                  }
                  {!scheduleRec.id &&
                    <Form.Select
                    name="status"
                    value={scheduleRec.status}
                    onChange={handleChange}
                    // required
                    disabled
                  >
                   <option value="Upcoming">Upcoming</option>
                      {/* <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Upcoming">Upcoming</option> */}
                  </Form.Select>
              }
                </Form.Group>
              </Col>
               <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicQualification"
                  >
                    Max Marks
                  </Form.Label>
                  <Form.Control type="number" name="max_marks" placeholder="Enter Max Marks" value={scheduleRec.max_marks} onChange={handleChange} /> </Form.Group>
              </Col>
               <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicAdharnumber"
                  >
                    Min Marks
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="min_marks"
                    placeholder="Enter Min Marks"
                    value={scheduleRec.min_marks}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

                {/* Add by Aamir khan 08-05-2024 */}
                <Col lg={6} className="mt-3">
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                      Session
                    </Form.Label>
                    <Form.Select
                      name="sessionid"
                      value={scheduleRec.year}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Session --</option>
                      {sessionYear.map((session) => (
                        <option key={session.id} value={session.year}>
                          {session.year}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                              
              <Col lg={6} className="mx-2">
                <Form.Group className="p-2">
                    <Form.Label className="form-view-label" htmlFor="formBasicStreet" >
                    Is Practical
                    </Form.Label>
                    <Form.Check
                      type="checkbox"
                      id="formBasicCheckbox"
                      name="ispractical"
                      checked={scheduleRec.ispractical}
                      onChange={handleCheckbox}
                      // required
                    />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col >
        <Col></Col>
      </Row >
    </Container >
    </Main>
   </>
  );
};

export default ExamScheduleEdit;
