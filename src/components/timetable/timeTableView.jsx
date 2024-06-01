/**
* @author: Pooja Vaishnav
*/
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { ToastContainer } from 'react-toastify';


const TimeTableView = (props) => {
  console.log('props@@@@1=>', props)
  const location = useLocation();
  const navigate = useNavigate();
  const [timetable, setTimeTable] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  console.log('timetable@@@!@=>', timetable);
  useEffect(() => {
    fetchTimeTable();
  }, []);


  const fetchTimeTable = () => {
    if (location.hasOwnProperty('pathname')) {
      timetable.id = location.pathname.split('/')[2];
      console.log('timetable.id@@@=>', timetable.id);
    }
    async function inittimetable() {

      let result = await schoolApi.getTimeTable(timetable.id);
      console.log('all result^%^&%&=>', result);
      if (result) {
        setTimeTable(result);
      } else {
        setTimeTable({});
      }
    }
    inittimetable();
  }

  const deletetimetable = async () => {
    const result = await schoolApi.deleteTimeTable(timetable.id);
    if (result.success) navigate(`/timetable`);
  };

  const edittimetable = () => {
    navigate(`/addtimetable/${timetable.id}/e`, { state: timetable });
  };

  const handleCancel = () => {
    navigate('/timetable');
  };
  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <div>
        {timetable && <Container>
          {modalShow &&
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteTimeTable={deletetimetable}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="timetable"
            />}
          <PageNavigations listName="Timetable" listPath="/timetable" viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

          <Row className="view-form">
            <Col lg={12}>
            <Col className="mx-3">
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}>Timetable Details</span>
                    </Col>
                  </Col>
              <Row className="view-form-header align-items-center mx-3">
                <Col lg={2}>
                  <h5>{timetable.type}</h5>
                </Col>
                <Col lg={10} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2" onClick={() => edittimetable(true)}>
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Button>
                  <Button
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={() => setModalShow(true)}
                  >
                    Delete
                  </Button>
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={handleCancel}
                  >
                    Cancel
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
                </Col>
              </Row>
            
              <Row>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Class Name</label>
                  <span>
                    {timetable.classname}
                  </span>
                </Col>
                <Col lg={5}>
                  <label>Section Name</label>
                  <span>{timetable.section_name}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Teacher Name</label>
                  <span>{timetable.contact_name}</span>
                </Col>
                <Col lg={5}>
                  <label>Subject Name</label>
                  <span>{timetable.subject_name}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>TImeslot Type</label>
                  <span>{timetable.type}</span>
                </Col>
                <Col lg={5}>
                  <label>Day</label>
                  <span>{timetable.day}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Start Time</label>
                  <span>{timetable.start_time}</span>
                </Col>
                <Col lg={5}>
                  <label>End Time</label>
                  <span>{timetable.end_time}</span>
                </Col>

                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Status</label>
                  <span>{timetable.status}</span>
                </Col>
              </Row>
            </Col>
            <Col></Col>
          </Row>
        </Container>}
      </div>
    </Main>
  )
}
export default TimeTableView