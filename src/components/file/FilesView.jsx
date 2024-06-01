import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-bootstrap-typeahead/css/Typeahead.css";
import moment from 'moment';

const FilesView = (props) => {
    const [files, setFiles] = useState(props.file.row);
    const MIMEType = new Map([
        ["text/csv", "csv"],
        ["application/msword", "doc"],
        ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
        ["image/gif", "gif"],
        ["text/html", "html"],
        ["image/jpeg", "jpeg, jpg"],
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

    useEffect(() => {
        if (props.parent !== null && props.file !== null) {
            console.log('console.log(files);', files);
        }
    }, []);

    const fileSize = (bytes) => {
        var exp = (bytes / 1024) / 1024;
        return exp.toFixed(2) + " MB";
    }

    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    File View
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row>
                        <Col lg={12}>
                            <Form className="mt-3" controlId="pricebookCreate">
                                <Row>
                                    <Col>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicTitle"
                                                style={{fontWeight: 'bold'}}
                                            >
                                                Title
                                            </Form.Label>
                                            <Form.Text id="Title">
                                                {files.title}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicType"
                                                style={{fontWeight: 'bold'}}
                                            >
                                                File Type
                                            </Form.Label>
                                            <Form.Text id="filetype">

                                                {MIMEType.has(files.filetype) ? MIMEType.get(files.filetype) : files.filetype}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFileSize"
                                                style={{fontWeight: 'bold'}}
                                            >
                                                File Size
                                            </Form.Label>
                                            <Form.Text id="FileSize">
                                                {fileSize(files.filesize)}

                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                    <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasiccreatedDate"
                                                style={{fontWeight: 'bold'}}
                                            >
                                                Created Date
                                            </Form.Label>
                                            <Form.Text id="createdDate">
                                                {moment(files.createddate).format('DD-MM-YYYY')}
                                            </Form.Text>
                                        </Form.Group>
                                        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col >
                                    <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicDescription"
                                                style={{fontWeight: 'bold'}}
                                            >
                                                Description
                                            </Form.Label>
                                            <Form.Text id="Description" style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                                                {files.description}
                                            </Form.Text>
                                            
                                        </Form.Group>
                                       
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} variant="light">Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default FilesView;
