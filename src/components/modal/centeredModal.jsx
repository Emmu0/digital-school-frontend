import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from "react";
import schoolApi from '../../api/schoolApi';
import PubSub from 'pubsub-js';

const CenteredModal = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      console.log('setSelectedFile => ', selectedFile);
    };

    const handleCSVUploadFile = async () => {
      if(selectedFile){
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await schoolApi.uploadCSVFile(formData);
        console.log('attendence data done ', response);
        if(response?.data){
          props.handleModal();
        }
      }else{
        PubSub.publish('RECORD_ERROR_TOAST', { title: 'Record not saved.', message: 'Please select a file.' });
        return false;
      }
    };


  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control type="file" onClick={handleFileChange} />
      </Modal.Body>
      <Modal.Footer>
        <div className='submit'>
          <Button onClick={handleCSVUploadFile} variant="success">
            Upload
          </Button>
        </div>
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default CenteredModal;