import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Main from '../layout/Main';
import { Helmet } from 'react-helmet';
import PageNavigations from '../breadcrumbs/PageNavigations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import schoolApi from '../../api/schoolApi';
import { Badge, Button, Card, Col, Form, Container, Table, ListGroup, Modal, Row, Tabs, Tab } from "react-bootstrap";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import InfoPill from "../InfoPill";
import { ShimmerTable } from "react-shimmer-effects";
import Confirm from '../Confirm';

const FeeMasterView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  //const contact = location.state;
  const [feeMaster, setFeeMaster] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [feeMasterInstallment, setFeeMasterInstallment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sessionYear, setSessionYear] = useState([]);
  const [optionClasses, setOptionClasses] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [rowRecords, setRowRecords] = useState([]);
  console.log('feeMaster', feeMaster);

  // useEffect(() => {
  //   async function init() {
  //     try {
  //       const masterInstalments = await schoolApi.getMasterInstallmentByFeeMasterId(location.state.id);
  //       console.log('masterInstalments:', masterInstalments);

  //       if (Array.isArray(masterInstalments)) {
  //         setFeeMasterInstallment(masterInstalments);
  //       } else {
  //         console.error('API response is not an array:', masterInstalments);
  //         // Handle the case where the API response is not an array
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       // Handle the error
  //     }
  //   }
  //   init();
  // }, []);

  useEffect(() => {
    fetchData(location.state.id);
  }, [location.state.id]);

  const fetchData = async (feeMasterId) => {
    try {
      const masterInstalments = await schoolApi.getMasterInstallmentByFeeMasterId(feeMasterId);
      console.log('masterInstalments:', masterInstalments);

      if (Array.isArray(masterInstalments)) {
        setFeeMasterInstallment(masterInstalments);
      } else {
        console.error('API response is not an array:', masterInstalments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    async function initClass() {
      const sessions = await schoolApi.fetchSessions();
      console.log('sessions-->', sessions);
      if (sessions) {
        setSessionYear(sessions);
        console.log('setSessionYear--->', sessionYear);
      } else {
        setSessionYear([]);
      }

      const classList = await schoolApi.getActiveClassRecords();
      console.log('classList@@=>', classList);
      if (classList) {
        let ar = [];
        classList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.classname;
          ar.push(obj);
        });
        setOptionClasses(ar);
      } else {
        setOptionClasses([]);
      }
    }
    console.log('optionClasses', optionClasses);
    initClass();
  }, []);

  console.log('feeMasterInstallment @@pawan', feeMasterInstallment);

  const editFeeMaster = () => {
    console.log('edit button clicked!!');
  }

  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  }

  const changeStatusFeeMaster = async () => {
    if (rowRecords.status === 'Active') {
      rowRecords.status = 'InActive';
    } else {
      rowRecords.status = 'Active';
    }

    const result = await schoolApi.updateFeeMasterLine(rowRecords.id, rowRecords);
    console.log('result after status change', result);

    if (result) {

      setFeeMasterInstallment(prevState =>
        prevState.map(item =>
          item.id === rowRecords.id ? { ...item, status: rowRecords.status } : item
        )
      );

      setUpdateStatus(false);
    }
  };

  const header = [
    {
      title: "Month",
      prop: "month",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/feeinstallmentlineitems/" + row.id} state={row}>
       {console.log('row', row)} 
          {row.month}
        </Link>
      ),
    },
    {
      title: 'General Fee',
      prop: 'general_fee',
    },
    {
      title: 'Obc Fee',
      prop: 'obc_fee',
    },
    {
      title: 'Sc Fee',
      prop: 'sc_fee',
    },
    {
      title: 'St Fee',
      prop: 'st_fee',
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
    },];

  const labels = {
    beforeSelect: " ",
  };

  const handleChange = (e) => {
    setFeeMaster({ ...feeMaster, [e.target.name]: e.target.value });
  }

  console.log('feeMaster after change-->', feeMaster);

  const handleCloseModal = () => {
    console.log('handleclose modal clicked');
    setShowModal(false);
  }

  const handleSaveFeeMasterUpdate = async () => {
    console.log('handleclose modal clicked');
    try {
      const result = await schoolApi.updateFee(location.state.id, { feeMaster });

      console.log('result', result);
      if (result.success) {
        setShowModal(false);
        navigate("/feesmasterlist");
      }
      // onSuccess();
      // onHide();
      // onUpdateRec();
    } catch (error) {
      console.error('Error updating vehicle:', error);

    }
  }

  const handleDeleteButton = () => {
    console.log('delete called !');
    setModalShow(true);

  }

  const handleDeleteAndNavigate = async () => {
    console.log('handleDeleteAndNavigate called');
    try {
      if (feeMaster.id) {
        const response = await schoolApi.deleteFeeMaster(feeMaster.id);

        if (response && response.message === "Record Delete Successfully") {

          setFeeMasterInstallment(prevState => prevState.filter(item => item.id !== feeMaster.id));


          setSuccessMessage('Record Deleted Successfully');
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);


          navigate('/feesmasterlist');
        } else {
          console.error('Deletion was not successful:', response);
        }
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };


  return (
    <div>
      <Main>
        <Helmet> <title>{props?.tabName}</title> </Helmet>
        <div>
          {feeMaster && <Container>
            {/* {modalShow &&
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteContact={deleteContact}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="contact"
            />} */}
            {props.table === "fee_master_install_status_update" && (
              <Button
                onClick={props.changeFeeMasterStatus}
                variant="danger"
                className="mx-2"
              >
                Yes
              </Button>
            )}
            {updateStatus &&
              <Confirm
                show={updateStatus}
                onHide={() => setUpdateStatus(false)}
                changeFeeMasterStatus={changeStatusFeeMaster}
                title="Confirm update status"
                message=" Are you sure to update the status.?"
                table="fee_master_install_status_update"
              />
            }
            {modalShow && (
              <confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleDeleteButton={() => handleDeleteAndNavigate()}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="feeMasters"
              />
            )}
            <PageNavigations listName="Fee Master View" listPath="/staffs" viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

            <Row className="view-form">
              <Col lg={12}>
                <Row className="view-form-header align-items-center mx-2">
                  <Col lg={3}>
                    <h5>Class Name</h5>
                    <h5> {feeMaster.classname}</h5>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button className="btn-sm mx-2" onClick={() => setShowModal(true)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={() => handleDeleteButton()}
                    >
                      Delete
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
                  <Col lg={12}>
                    <Col className="mx-3">
                      <Col className="section-header my-3">
                        <span style={{ color: "black" }}>Fee Master Details</span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Class Name</label>
                    <span>
                      {feeMaster.classname}
                    </span>
                  </Col>
                  <Col lg={5}>
                    <label>Fee Structure</label>
                    <span>{feeMaster.fee_structure}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Session</label>
                    <span>{feeMaster.session}</span>
                  </Col>
                  <Col lg={5}>
                    <label>Status</label>
                    <span>{feeMaster.status}</span>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <label>Total Fee</label>
                    <span>{feeMaster.totalfees}</span>
                  </Col>
                  <Col lg={5}>
                    <label>type</label>
                    <span>{feeMaster.type}</span>
                  </Col>
                  <Col lg={1}></Col>

                  <Col lg={1}></Col>
                  <Col lg={1}></Col>

                  <Col>

                  </Col>
                </Row>
                <Row>

                </Row>
              </Col>
              <Col></Col>

              <Row>
                <Col lg={12}>
                  <Col>
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}>Fee Master Installment</span>
                    </Col>
                  </Col>
                </Col>
              </Row>

              <Row className="g-0">
                <Col lg={12} className="p-lg-4">

                  {feeMasterInstallment ? (
                    <DatatableWrapper
                      body={feeMasterInstallment.map(item => ({ ...item, id: item.id }))}
                      headers={header}
                      paginationOptionsProps={{
                        initialState: {
                          rowsPerPage: 15,
                          options: [5, 10, 15, 20]
                        }
                      }}
                    >
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Filter />
                        </Col>
                        <Col lg={1} style={{ 'margin-top': '-13px' }}>
                          <PaginationOptions labels={labels} />
                        </Col>
                        {/* <Col lg={3} style={{ 'margin-top': '-18px' }} >
                  <div>
                    <InfoPill left="Total Fee Master Installments" right={feeMasterInstallment?.length} />
                  </div>
                </Col> */}
                        <Col lg={4}></Col>
                      </Row>
                      <Col>
                        <Table striped className="data-table">
                          <TableHeader />
                          <TableBody />
                        </Table>
                        <Pagination />
                      </Col>
                    </DatatableWrapper>) : (<p>No Data Found!!!</p>)}
                </Col>
                <Col lg={2}></Col>
              </Row>
            </Row>
          </Container>}
        </div>

        {/* ----------------------------- Edit Fee Master Modal------------------------------------ */}

        <Modal show={showModal} backdrop="static" centered aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal} size="md">
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">Fee Head Master</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="mt-3">
              <Row>
                <Col lg={6}>
                  <Form.Group className="my-3 mx-2">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicClass"
                    >
                      Class Name
                    </Form.Label>
                    <Form.Select required name="classid"
                      value={feeMaster.classid}
                      onChange={handleChange}>
                      <option value="">-- Select Fee Head  --</option>
                      {optionClasses.map((res) => (
                        <option key={res.value} value={res.value}>
                          {res.label}
                        </option>
                      ))}</Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4} className="mt-3">
                  <Form.Group className="mx-3">
                    <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                      Type
                    </Form.Label>
                    <Form.Select name="type" value={feeMaster.type} onChange={handleChange}>
                      <option value="">-- Select Type --</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-Monthly">Bi-Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half Yearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="my-3 mx-2">
                    <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                      Session
                    </Form.Label>
                    <Form.Select
                      required
                      name="sessionid"
                      value={feeMaster.sessionid}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Session --</option>
                      {sessionYear.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.year}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="my-3 mx-2">
                    <Form.Label className="form-view-label" htmlFor="structureTypeRadio">
                      Structure Type<span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Row>
                      <Col lg={3}>
                        <Form.Check
                          type="radio"
                          id="newStructureRadio"
                          name="fee_structure"
                          label="New"
                          style={{ fontSize: '18px' }}
                          value="New"
                          checked={feeMaster.fee_structure === "New"}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col lg={3}>
                        <Form.Check
                          type="radio"
                          id="oldStructureRadio"
                          name="fee_structure"
                          style={{ fontSize: '18px' }}
                          label="Old"
                          checked={feeMaster.fee_structure === "Old"}
                          onChange={handleChange}
                          value="Old"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="my-3 mx-2">
                    <Form.Label className="form-view-label" htmlFor="statusRadio">
                      Status<span style={{ color: 'red' }}>*</span>
                    </Form.Label>
                    <Row>
                      <Col lg={3}>
                        <Form.Check
                          type="radio"
                          id="activeRadio"
                          label="Active"
                          style={{ fontSize: '18px' }}
                          name="status"
                          value="Active"
                          checked={feeMaster.status === "Active"}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col lg={3}>
                        <Form.Check
                          type="radio"
                          id="inactiveRadio"
                          label="Inactive"
                          style={{ fontSize: '18px' }}
                          name="status"
                          value="InActive"
                          checked={feeMaster.status === "InActive"}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveFeeMasterUpdate}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

      </Main>
    </div>
  )
}

export default FeeMasterView
