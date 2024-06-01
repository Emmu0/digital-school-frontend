/* eslint-disable react-hooks/exhaustive-deps */
/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import schoolApi from "../../api/schoolApi";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import PubSub from "pubsub-js";

const AddClass = (props) => {

    console.log('props======>', props);
    // const navigate = useNavigate();

    const [rowRecord, setRowRecord] = useState({
        classname: "",
        aliasname: "",
        status: "   ",
    });

    useEffect(() => {
        if (props?.parent?.id) {
            setRowRecord(props?.parent);
        }
    }, []);

    const handleChange = (e) => {
        setRowRecord({ ...rowRecord, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log('enter in handle submint=====>',rowRecord);
    //     if(rowRecord.classname && rowRecord.aliasname && rowRecord.status){

    //     }else{
    //         return toast.error('Please fill all the required fields.');
    //     }
       
    // };

    //SaveRecord
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (props?.parent?.id) {//editClass
            const editRecord = {
                id: props?.parent?.id,
                classname: rowRecord.classname,
                aliasname: rowRecord.aliasname,
                status: rowRecord.status
            }

            if ((editRecord.status && editRecord.status.trim() !== "") && (editRecord.classname && editRecord.classname.trim() !== "") &&  (editRecord.aliasname && editRecord.aliasname.trim() !== "")) {
                let response = {};
                response = await schoolApi.updateClassRecord(editRecord);
                if (response.success) {
                    toast.success(response.message, { position: toast.POSITION.TOP_CENTER, hideProgressBar: true });
                    recordSaveSuccesfully();
                } else {
                    toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
                }
            }
            else {
                toast.error("Required field missing!", { position: toast.POSITION.TOP_CENTER, 
                    theme:"colored", 
                    hideProgressBar:true});
            }
        }
        else {//addClass
            //Add by Aamir khan 14-05-2024   this line-->   (rowRecord.status && rowRecord.status.trim() !== "")
            if ((rowRecord.classname && rowRecord.classname.trim() !== "") && (rowRecord.status && rowRecord.status.trim() !== "") && (rowRecord.aliasname && rowRecord.aliasname.trim() !== "")) {
                console.log('rowRecord', rowRecord);
                let response  = await schoolApi.addClassRecord(rowRecord);
                console.log('response', response);
                if (response.success) {
                    toast.success("Record saved successfully!", { position: toast.POSITION.TOP_CENTER,  hideProgressBar: true  });
                    recordSaveSuccesfully();
                } else {
                    toast.error(response.message, { position: toast.POSITION.TOP_CENTER });
                }
            }
            else {
                toast.error("Required field missing!", { position: toast.POSITION.TOP_CENTER, 
                                                         theme:"colored", 
                                                         hideProgressBar:true});
            }

        }
    };

    // eslint-disable-next-line no-unused-vars
    const recordSaveSuccesfully = () => {
        props.recordSaveSuccesfully();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton onClick={props.onHide}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Class Record
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row>
                        <Col lg={12}>
                            <Form
                                noValidate
                            >
                                <Row className="pb-4">
                                    <Col lg={6}>
                                        <Form.Group  >
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Class Name
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="classname"
                                                placeholder="Class Name"
                                                value={rowRecord.classname}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className='my-3'>
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Alias Name
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="aliasname"
                                                placeholder="Alias Name"
                                                value={rowRecord.aliasname}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group >
                                            <Form.Label className="form-view-label" htmlFor="formBasicFirstName" >
                                                Status
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                name="status"
                                                value={rowRecord.status}
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
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success"
                    onClick={handleSubmit}
                >
                    {props?.parent?.id ? "Update" : "Save"}
                </Button>
                <Button onClick={props.onHide} variant="light">
                    Close
                </Button>
            </Modal.Footer>
            {/* <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                /> */}
        </Modal>
    )
}

export default AddClass
