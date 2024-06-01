
/**
 * @author: Pooja Vaishnav and Pawan Singh Sisodiya
 */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import PageNavigations from "../breadcrumbs/PageNavigations";
import Confirm from "../Confirm";
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
//import "./App.css";
const FeesHeadMasterList = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [feeHeadMaster, setFeeHeadMaster] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [rowRecords, setRowRecords] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchFeesHeadMaster();
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();
  }, [reload]);
  const labels = {
    beforeSelect: " ",
  };

  const header = [
    {
      title: "Name",
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
      title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
             <i className="fa-regular fa-pen-to-square"></i>
         </button>
           {/* <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
             <i className="fa fa-trash"></i>
           </button> */}
         </div>
       )
 },
  ];

  const handleEditButton=(row)=>{
    console.log('handle edit button clicked', row);
    setFeeHeadMaster(row);
    setShowModal(true);
    
  }

  const handleDeleteButton=(row)=>{
    console.log('handle Delete button clicked',row);
    setDeleteId(row.id);
    setDeleteModal(true);
  }
  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setFeeHeadMaster({});
  }
  const handleChange = (e) => {
    setFeeHeadMaster(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  console.log('feeHeadMaster-->',feeHeadMaster);

  const handleSaveNewTitle = async () => {
    console.log('feeHeadMaster--> 2',feeHeadMaster);

    if(!feeHeadMaster.name || !feeHeadMaster.status){
      toast.error("Fill all required values!!!");
        return;
    }
    setReload(false);

    if(feeHeadMaster.id){
      const result2 = await schoolApi.updateFeeHeadMaster(feeHeadMaster.id, feeHeadMaster);
      if(result2.success){
        setReload(true);
        setShowModal(false);
        setFeeHeadMaster({});
        toast.success("Record update successfully");
      }
      else{
        console.log('Error occured!!!');
      }
    }
    else{
      const result = await schoolApi.createFeeHeadMaster(feeHeadMaster);
      console.log('result after successfully record save-->',result);
      if(result.success){
        setReload(true);
        setShowModal(false);
        setFeeHeadMaster({});
        toast.success("Record saved successfully");
      }
      else{
        console.log('Error occured!!!');
      }
    }
  }

  const deleteFeeHeadMaster = async () => {
    try {
      const result = await schoolApi.deleteFeeHeadMaster(deleteId);
      console.log('deleted result => ', result);
  
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
        // navigate(`/examlist`);
      }
    } catch (error) {
      console.error('Error during deleteFeeHeadMaster:', error);
      toast.error(error.response.data.message);
    }
  };

  const changeHeadStatus = async () =>{
    console.log('enter----------------------->',rowRecords);
    if(rowRecords.status === 'Active'){
     rowRecords.status = 'InActive'
    }
    else{
     rowRecords.status = 'Active'
    }
     const result = await schoolApi.updateFeeHeadMaster(rowRecords.id, rowRecords);
     console.log('result after status change',result);

     if(result){
       setUpdateStatus(false)
     }
  }

  const onFilterType = async (event)=> {
      const status = event.target.value;
      setReload(false);
      if(status === ""){
        setReload(true);
        return;
      }
      console.log('status',status);
      const result = await schoolApi.getHeadMastersByStatus(status);
      if(result){
        console.log('getHeadMastersByStatus', result);
        setBody(result);
      }
      else{
        console.log('error occured');
      }
  };

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12} /> */}
      <Row className="g-0">
        <Col lg={3} className="mx-3">
          <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> FeesHeadMasterList</Link>
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

{updateStatus &&
        <Confirm
          show={updateStatus}
          onHide={() => setUpdateStatus(false)}
          changeHeadStatus={changeHeadStatus}
          titleupdate="Confirm update?"
          message="You are going to update the status. Are you sure?"
          table="fee_head_master"
        />
      }

      {deleteModal &&
        <Confirm
          show={deleteModal}
          onHide={() => setDeleteModal(false)}
          deleteFeeHeadMaster={deleteFeeHeadMaster}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="fee_head_master"
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
                <Col lg={2} >
                  <Form.Select aria-label="Fee Head Status" name="status" onChange={onFilterType}>
                    <option value="">--Select Status--</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Select>
                </Col>
                <Col lg={1} style={{ 'margin-top': '-18px' }}>
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={4} style={{ 'margin-top': '-13px' }} >
                  {/* <div > */}
                    <InfoPill left="Total Head Masters" right={body?.length} />
                  {/* </div> */}
                </Col>
                <Col lg={2} style={{ 'margin-top': '2px' }} className="d-flex flex-col justify-content-end align-items-end">
                  <Button className="btn-light" variant="outline-primary" onClick={() => setShowModal(true)}>New Fees Head Master</Button>
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

      <Modal show={showModal} backdrop="static" centered aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal} size="md">
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">Fee Head Master</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              <Col lg={6} className="mt-3">
                <Form.Group className="mx-3 fees">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="nameInput"
                  >
                    Name
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="nameInput"
                    name="name"
                    value={feeHeadMaster.name}
                    placeholder="Enter Fee head master"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col lg={6} className="mt-3">
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Status
                  </Form.Label>
                  <Form.Select required name="status" value={feeHeadMaster.status}  onChange={handleChange} 
                   >
                  <option value="">-- Select Status --</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* <Col lg={6} className="mt-3">
                <Form.Group className="mx-3 fees">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="nameInput"
                  >
                    Order no.
                  </Form.Label>
                  <Form.Control
                    // required
                    type="text"
                    name="order_no"
                    value={feeHeadMaster.order_no}
                    placeholder="Enter Order Number"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col> */}
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

export default FeesHeadMasterList;
