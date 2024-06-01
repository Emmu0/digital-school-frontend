/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import Confirm from "../Confirm";
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExamList = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [sessionYear, setSessionYear] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [showModalShow, setShowModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [changeOption, setChangeOption] = useState('');

  // console.log('locationprint==>',location);


  const [newTitle, setNewTitle] = useState({
    // name:'',
    // status:'',
    // sessionid:''
  })

  useEffect(() => {
    async function init() {
      console.log('Colling this');
      const result = await schoolApi.fetchExamTitles();
      console.log('@#resultData==>', result);
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();
  }, [reload]);

  useEffect(() => {

    async function getSessions() {
      const sessions = await schoolApi.fetchSessions();
      console.log('sessions-->', sessions);
      if (sessions) {
        setSessionYear(sessions);
        console.log('setSessionYear--->', sessionYear);
      } else {
        setSessionYear([]);
      }
    }
    getSessions();

  }, [showModal]);


  console.log('Exams List ===>', body);

  const header = [
    {
      title: "Exam Title",
      prop: "name",
      isFilterable: true,
    },
    {
      title: "Status",
      prop: "status",
      isFilterable: true,
      cell: (row) => (
        <Button className="btn-sm mx-2"
          style={{ width: '80px' }}
          variant={row.status === 'Active' ? 'success' : 'danger'}
          onClick={() => toggleStatus(row)}>
          {row.status}
        </Button>
      ),
    },
    {
      title: "Session",
      prop: "year",
      isFilterable: true,
    },
    {
      title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      )
    },
  ];

  const labels = {
    beforeSelect: " ",
  };

  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  }

  console.log('rowrecord', rowRecords);

  const handleEditButton = (row) => {
    setNewTitle(row);
    setIsEdit(true);
    setShowModal(true);
    setDeleteModal(false);
  }

  const handleDeleteButton = (row) => {
    console.log('delete button clicked', row);
    setDeleteId(row.id);
    setDeleteModal(true);

  }

  const deleteTitle = async () => {
    try {
      const result = await schoolApi.deleteTitle(deleteId);
      console.log('deleted result => ', result);

      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
        navigate(`/examlist`);
      }
    } catch (error) {
      console.error('Error during deleteTitle:', error);
      toast.error(error.response.data.message);
    }
  };

  const changeStatus = async () => {
    console.log('enter----------------------->', rowRecords);
    if (rowRecords.status === 'Active') {
      rowRecords.status = 'InActive'
    }
    else {
      rowRecords.status = 'Active'
    }

    const result = await schoolApi.updateExamTitle(rowRecords.id, rowRecords);

    console.log('result after status change', result);

    if (result) {
      setUpdateStatus(false)
    }

  }

  const handleChange = (e) => {




    if (e.target.name === 'sessionid') {

      setNewTitle({
        ...newTitle,
        sessionid: e.target.value !== '' ? sessionYear[e.target.selectedIndex - 1].id : '',
        year: e.target.value !== '' ? e.target.value : '',
      });
    } else {
      setNewTitle({ ...newTitle, [e.target.name]: e.target.value });
    }


  }

  console.log('newTitle', newTitle);

  const handleSaveNewTitle = async () => {
    console.log('New Title saved:', newTitle);
    setReload(false);

    if (!newTitle.name || !newTitle.status) {
      toast.error("Fill all required values!!!");
      return;
    }

    if (newTitle.id) {
      console.log('RecSav==>', newTitle);
      const result = await schoolApi.updateExamTitle(newTitle.id, newTitle);
      console.log('result after edit-->', result);
      console.log('result', result);

      if (result.id) {
        setReload(true);
        console.log('result in method', result);
        setShowModal(false);
        setNewTitle({
          // name:'',
          // status:'',
          // sessionid:''
        })
      }

    }
    else {
      console.log('#createExamTitle==>', newTitle);
      const result = await schoolApi.createExamTitle(newTitle);
      console.log('I Result Fount this', result);
      if (result && result.success !== false) {
        console.log('Found5', result);
        setReload(true);
        console.log('result', result);
        setShowModal(false);
        setNewTitle({
          // name:'',
          // status:'',
          // sessionid:''
        })
      }
      //================= Add by Aamir khan 29-04-2024 code start ==================
      else {
        toast.error('Record already exists.');
      }
      //================= Code End ==============================

    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTitle({
      // name:'',
      // status:'',
      // sessionid:''
    })
  }

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12} /> */}
      <Row className="g-0">
        <Col lg={2} className="mx-3">
          <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> ExamList</Link>
        </Col>

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

        {deleteModal &&
          <Confirm
            show={deleteModal}
            onHide={() => setDeleteModal(false)}
            deleteTitle={deleteTitle}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="exam_title"
          />
        }

        {updateStatus &&
          <Confirm
            show={updateStatus}
            onHide={() => setUpdateStatus(false)}
            changeStatus={changeStatus}
            title={`Confirm ${rowRecords?.status === "Active" ? 'inActive' : 'Active'} ?`}
            message="You are going to update the status. Are you sure?"
            table="exam_title_status_update"
          />
        }
        <Col lg={12} className="p-lg-4">

          {body ?
            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
              initialState: {
                rowsPerPage: 15,
                options: [5, 10, 15, 20]
              }
            }}>
              <Row className="mb-4">
                <Col lg={3}>
                  <Filter />
                </Col>
                <Col lg={1} style={{ 'margin-top': '-18px' }}>
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={3} style={{ 'margin-top': '-13px' }} >
                  <div >
                    <InfoPill left="Total Exams" right={body?.length} />
                  </div>
                </Col>
                <Col lg={5} style={{ 'margin-top': '2px' }} className="d-flex flex-col justify-content-end align-items-end">
                  <Button className="btn-light" variant="outline-primary" onClick={() => setShowModal(true)}>New Exam</Button>
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper> : <ShimmerTable row={10} col={4} />}
        </Col>
        <Col lg={2}></Col>
      </Row>

      {/*---------------------- New Exam Schedule Modal -----------------------------------*/}

      <Modal show={showModal} backdrop="static" centered aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Exam Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Title Name
                  </Form.Label>
                  <Form.Control required type="text" value={newTitle.name} name="name" placeholder="Enter Title Name" onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Status
                  </Form.Label>
                  {/* <Form.Control required type="text" value={newTitle.status}  name="status" placeholder="Enter Status"  onChange={handleChange} /> */}
                  <Form.Select required name="status" value={newTitle.status} onChange={handleChange}>
                    <option value="">-- Select Status --</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6} className="mt-3">
                <Form.Group className="mx-3">
                  <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                    Session
                  </Form.Label>
                  <Form.Select
                    name="sessionid"
                    value={newTitle.year}
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

            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewTitle}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  );
};

export default ExamList;
