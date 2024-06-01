import React, { useState, useEffect } from "react"
import Main from '../layout/Main'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {Button, Col, Container, Row } from "react-bootstrap";
import CreateSyllabusModel from "./CreateSyllabusModel";
import Confirm from "../Confirm";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";

const SyllabusViewPage = () => {
    const location = useLocation();
    console.log('location ==========>', location);
    const navigate = useNavigate();
    const [syllabusData, setSyllabusData] = useState(location.state ? location.state : {});
    const [modalShow, setModalShow] = useState(false);
    const [btnName,setBtnName] = useState('Update');
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [rowDataId,setRowDataId]  = useState();

    const handleCancel = async (e) => {
        navigate('/syllabuslist');
    }

    const handleEditButton = async (e) => {
        setModalShow(true)
    }

    const handleCloseModal = () =>{
        setModalShow(false);
    }

    const handleDeleteButton = () =>{
        console.log('record-------->', )
        setShowDeleteModal(true)
        setRowDataId(syllabusData.id)
    }

    const handleDeleteSyllabusRecord = async () =>{
        if(rowDataId){
         try {
           const result  = await schoolApi.deleteSyllabus(rowDataId);
           if(result && result.message === "Successfully Deleted"){
            //  const deleteSyllabus = body.filter(rec => rec.id !== rowDataId);
            navigate('/syllabuslist');
             PubSub.publish('RECORD_SAVED_TOAST', {
              title: 'Record Deleted',
              message: 'Record Deleted successfully'
            });
            //  setBody(deleteSyllabus)
             setShowDeleteModal(false)
           }else{
             console.error('deletion was not successfull', result)
           }
         } catch (error) {
            console.error("Errror deleteing ", error);
         }
        }
       }


  return (
     <Main>
          
        {showDeleteModal &&
         <Confirm
           show={showDeleteModal}
           onHide={() => setShowDeleteModal(false)}
           handleDeleteButton={()=>handleDeleteSyllabusRecord()}
           title="Confirm delete?"
           message="You are going to delete the record. Are you sure?"
           table="deleteSyllabus"
         />}
         
         <CreateSyllabusModel 
                   modalShow={modalShow} 
                   handleCloseModal={handleCloseModal} 
                //    fetchAllSyllabus={fetchAllSyllabus}
                   syllabusData={syllabusData}
                   btnName={btnName}
           />

        <Col lg={2} className="mx-4">
          <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> syllabusView</Link>
        </Col>
    <div className="my-5">
       <Row className="view-form">
            <Col lg={12}>
            {/* <Col className="mx-3">
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}>Student Information</span>
                    </Col>
                  </Col> */}
              <Row className="view-form-header align-items-center mx-3">
                <Col lg={10}>
                  <h5>View Page</h5>
                </Col>
                <Col lg={2}>
                <Button className="btn-sm mx-2" onClick={handleEditButton}>
                    <i className="fa-regular fa-pen-to-square"></i>
                </Button>
                <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={handleDeleteButton}
                >
                    Delete
                </Button>
                <Button
                    className="btn-sm mx-2"
                    variant="danger"
                    onClick={handleCancel}
                >
                      Cancel
                </Button>
                </Col>
              </Row>
              <Row className="mx-2 my-2">
                <Col lg={6} className="my-2">
                  <label>Class</label>
                  <span>
                    {syllabusData.class}
                  </span>
                </Col>
                <Col lg={6} className="my-2">
                  <label>Section</label>
                  <span>{syllabusData.section}</span>
                </Col>
                <Col lg={6} className="my-2">
                  <label>Subject</label>
                  <span>{syllabusData.subject}</span>
                </Col>
                <Col lg={6} className="my-2">
                  <label>Session</label>
                  <span>{syllabusData.session}</span>
                </Col>
                <Col lg={12} className="my-2">
                  <label>Description</label>
                  <span>{syllabusData.description}</span>
                </Col>
                <Col lg={6} className="my-2">
                  <label>Status</label>
                  <span>{syllabusData.isactive}</span>
                </Col>
                <Col>
                </Col>
              </Row>
              <Row>
              </Row>
            </Col>
            
            <Col></Col>
          </Row>
          </div>
     </Main>
  )
}

export default SyllabusViewPage
