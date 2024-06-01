import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import FormData from "form-data";
import axios from "axios";
import moment from "moment";
import PubSub from 'pubsub-js';

const FilesCreate = (props) => {
    const [files, setFiles] = useState([]);
    const [fileDescription, setFileDescription] = useState('');
    const MIMEType = new Map([
        ["text/csv", "csv"],
        ["application/msword", "doc"],
        ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
        ["image/gif", "gif"],
        ["text/html", "html"],
        ["image/jpeg", "jpeg"],
        ["image/jpg", "jpg"],
        ["application/json", "json"],
        ["audio/mpeg", "mp3"],
        ["video/mp4", "mp4"],
        ["image/png", "png"],
        ["application/pdf", "pdf"],
        ["application/vnd.ms-powerpoint", "ppt"],
        ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
        ["image/svg+xml", "svg"],
        ["text/plain", "txt"],
        ["application/vnd.ms-excel", "xls"],
        ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
        ["text/xm", "xml"],
        ["application/xml", "xml"],
        ["application/atom+xml", "xml"],
        ["application/zip", "zip"],
        ]);

    const handleChange = (event) => {
        // /*for (let i = 0; i < event.target.files.length; i++) {
        //     let file = event.target.files[i];
        //     let type = MIMEType.get(file.type);
        //     file.type = type;
        //     setFiles(file);*/
        setFiles(event.target.files);
    }

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        const token = sessionStorage.getItem("token");
        let current = new Date();
            var formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`files${i}`, files[i]);
                formData.append(`description`, fileDescription);
            }

            try {
                const result = await schoolApi.createFile(props.parent.id, formData);
                if (result) {
                  PubSub.publish('RECORD_SAVED_TOAST', {title: 'Record Saved', message: 'Record saved successfully'});
                  submitFiles();
                }
              } catch (error) {
                // Handle error here (e.g., show an error message)
                console.error("Error uploading file:", error);
              }
    }

    const submitFiles = () => {
        props.submitFiles();
    };

    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload Files
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label></Form.Label>
                    <Form.Control type="file" multiple onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicDescription"
                    >
                        Description
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Enter description"
                        onChange={(e) => setFileDescription(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <div className="submit">
                    <Button variant="success" onClick={handleSubmit}>Submit</Button>
                </div>
                <Button onClick={props.onHide} variant="light">Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default FilesCreate;
