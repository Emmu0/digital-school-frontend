import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader
} from 'react-bs-datatable';
import schoolApi from "../../api/schoolApi";
import moment from 'moment';
import Confirm from "../Confirm";
import FilesEdit from './FilesEdit';
import FilesView from './FilesView';
import fileDownload from 'js-file-download';
import Image from 'react-bootstrap/Image';
import * as constants from '../../constants/CONSTANT';

const RelatedListFiles = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [downloads, setDownloads] = React.useState([]);
  const [modalShowFile, setModalShowFile] = React.useState(false);
  const [modalShowFileView, setModalShowFileView] = React.useState(false);
  const [body, setBody] = useState([]);
  const [imageData, setImageData] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // Add other form data if needed
      formData.append('parentId', props.parent.id);

      try {
        // Make the file upload API call
        const response = await schoolApi.uploadFile(formData);
        // Handle the response if needed
        console.log('File upload response:', response);

        // Clear the file input after successful upload
        setFile(null);

        // Refresh the files list after successful upload
        filesList();
      } catch (error) {
        // Handle any errors that occurred during file upload
        console.error('File upload error:', error);
      }
    }
  };

  const handleDelete = (row) => {
    setModalShow(true);
    setFile(row);
  };

  const deleteFile = async () => {
    try {
      const result = await schoolApi.deleteFile(file.id);
      console.log('delete successfully', result);
      if (result.success) {
        const filterFiles = body.filter((item) => item.id !== file.id);
        setBody(filterFiles);
        setModalShow(false);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFile = async (row) => {
    try {
      const result = await schoolApi.downloadFiles(row.id);
      if (result) {
        fileDownload(result, row.title);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const submitFiles = () => {
    setModalShowFile(false);
    filesList();
  };

  const editFile = (row) => {
    setModalShowFile(true);
    setFile(row);
  };

  const fileView = (row) => {
    setModalShowFileView(true);
    setFile(row);
  };

  const filesList = async () => {
    try {
      const files = await schoolApi.fetchFiles(props.parent.id);
      console.log('files',files)
      if (files && files.length > 0) {
        let arr = [];
        for (let i = 0; i < files.length; i++) {
          // Process files data if needed
          
        let logo = sessionStorage.getItem("logourl")

        let pieces = logo.split('/');
        const last = pieces[pieces.length - 1]
        let url = sessionStorage.getItem(`${props.parentid}/${files.title}`)
  
        let logo1 = await urlContentToDataUri(url);
     
        setImageData(logo1);
          arr.push(files[i]);

        }
        setBody(files);
      } else {
        setBody([]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setBody([]);
    }
  };

  useEffect(() => {
    filesList();
  }, [props.parent.id, props.refreshFileList]);

  const fileSize = (bytes) => {
    var exp = (bytes / 1024) / 1024;
    return exp.toFixed(2) + ' MB';
  };
  const urlContentToDataUri = (url) => {
    return fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((callback) => {
            let reader = new FileReader();
            reader.onload = function () {
              callback(this.result);
            };
            reader.readAsDataURL(blob);
          })
      );
  }
  const renderPreview = (type, body) => {
    // ... (The rest of the function remains unchanged)
  };

  const header = [
    {
      title: 'Title',
      prop: 'title',
      cell: (row) => (
        <>
          {/* Add your <img> tag here using the 'title' prop */}
          <img src={imageData} alt={row.title} />
          {/* Or use the 'title' prop for any other attribute */}
          {/* <img src={`images/${row.title}.jpg`} alt="Some description" /> */}
        </>
      )
    },
    { title: '', prop: 'body',cell: (row) => (
      <>
    
      <center>{renderPreview(row.filetype, row.body)}</center>
     
      
      </>

    ) },
    { title: 'File Type', prop: 'filetype',cell: (row) => row.filetype },

    { title: 'File Size', prop: 'filesize',cell: (row) => (fileSize(row.filesize))},
    { title: 'Created Date', prop: 'createddate', cell: (row) => (moment(row.createddate).format('DD-MM-YYYY')) },
    
    {
      title: 'Actions', prop: 'id', cell: (row) => (
        <><Button className='btn-sm mx-2'  onClick={() => editFile({ row })}><i className="fa-regular fa-pen-to-square"></i></Button>
          <Button className='btn-sm mx-2' variant='danger' onClick={() => handleDelete(row)} ><i className="fa-regular fa-trash-can"></i></Button>
          <Button className='btn-sm mx-2' variant='danger' onClick={() => downloadFile(row)} ><i className="fa fa-cloud-download"></i></Button>
          
        </>
      )
    }
  ];
  

  return (
    <>
      {modalShow &&
      <Confirm
        show={modalShow}
        onHide={() => setModalShow(false)}
        deleteFile={deleteFile}
        title="Confirm delete?"
        message="You are going to delete the record. Are you sure?"
        table="file"
      />}
     {modalShowFile &&
        <FilesEdit
          show={modalShowFile}
          onHide={() => setModalShowFile(false)}
          parent={props.parent}
          file={file}
          table="student_addmission"
          submitFiles={submitFiles}
        />
        }
        {modalShowFileView &&
        <FilesView
          show={modalShowFileView}
          onHide={() => setModalShowFileView(false)}
          file={file}
        />
        }
        {console.log('body',body)}
      {body.length ?



        <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
          initialState: {
            rowsPerPage: 5
          }
        }}>
          <Row className="mb-4">
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            >
            </Col>
            
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-start align-items-start"
            >
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
            </Col>
          </Row>
          <Table striped className="related-list-table">
            <TableHeader />
            <TableBody />
          </Table>
          <Pagination />
        </DatatableWrapper> : ''}
        <p style={{color:"red"}}>
        {downloads?.length > 0 ?  downloads.map((row, index) => ( 
            
            <img src={row} />
            
        )) : ''}  
        </p>
    </>

    
  )
}

export default RelatedListFiles