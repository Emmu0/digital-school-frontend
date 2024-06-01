
/**
 * @author: Pawan Singh Sisodiya
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

const FeeDiscount = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [discountRecords, setDiscountRecords] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [rowRecords, setRowRecords] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [sessionYear, setSessionYear] = useState([]);
  const [feeHeads, setFeeHeads] = useState([{}]);

  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchFeeDiscounts();
      console.log('result-->',result);
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();
  }, [reload]);

  useEffect(()=>{

    async function getSessions() {
      const sessions = await schoolApi.fetchSessions();
      const feeHeadsResult = await schoolApi.fetchFeesHeadMaster();

      if(feeHeadsResult){
          const updatedFeeHeads = feeHeadsResult.map(res => ({
            label: res.id,
            value: res.name
          }));

          console.log('updatedFeeHeads-->',updatedFeeHeads);
          setFeeHeads(updatedFeeHeads);
      }
      else{
        setFeeHeads([]);
      }
      console.log('sessions-->',sessions);
      if (sessions) {
        setSessionYear(sessions);
        console.log('setSessionYear--->',sessionYear);  
      } else {
        setSessionYear([]);
      }
    }
    getSessions();
    
  },[showModal]);

 

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
      title: "Percent (%)",
      prop: "percent",
      isFilterable: true,
    },
    {
      title: "Session",
      prop: "session",
      isFilterable: true,
    },
    {
      title: "Fee Head",
      prop: "headname",
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
         </div>
       )
 },
  ];

  const handleEditButton=(row)=>{
    console.log('handle edit button clicked', row);
    setDiscountRecords(row);
    setShowModal(true);
    
  }

  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setDiscountRecords({});
  }
  const handleChange = (e) => {
    setReload(false);
      setDiscountRecords(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  console.log('discountRecords-->',discountRecords);

  const handleSaveNewDiscount = async () => {

    // if(!discountRecords.name || !discountRecords.status){
    //   toast.error("Fill all required values!!!");
    //     return;
    // }
    // setReload(false);

    if(discountRecords.id){
      const id = discountRecords.id
      delete discountRecords.id
      const result2 = await schoolApi.updateFeeDiscounts(id, discountRecords);
      console.log('result after successfully record update-->',result2);
      if(result2.success){
        setReload(true);
        setShowModal(false);
        setDiscountRecords({});
        return toast.success("Record update successfully");
      }
      else{
        console.log('Error occured!!!');
      }
    }
    else{
      const result = await schoolApi.createFeeDiscounts(discountRecords);
      console.log('result after successfully record save-->',result);
      if(result.success){
        setReload(true);
        setShowModal(false);
        setDiscountRecords({});
        return toast.success("Record saved successfully");
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

  const changeDiscountStatus = async () =>{
    console.log('enter----------------------->',rowRecords);
    if(rowRecords.status === 'Active'){
     rowRecords.status = 'InActive'
    }
    else{
     rowRecords.status = 'Active'
    }
     const result = await schoolApi.updateFeeDiscounts(rowRecords.id, rowRecords);
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

  console.log('feeHeads-->', feeHeads);
  console.log('sessions-->', sessionYear);

  return (
    <Main>
      <Helmet>
        {" "}
        <title>{props?.tabName}</title>{" "}
      </Helmet>
      {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12} /> */}
      <Row className="g-0">
        <Col lg={3} className="mx-3">
          <Link className="nav-link mx-2" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            FeesHeadMasterList
          </Link>
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

        {updateStatus && (
          <Confirm
            show={updateStatus}
            onHide={() => setUpdateStatus(false)}
            changeDiscountStatus={changeDiscountStatus}
            title="Confirm update?"
            message="You are going to update the status. Are you sure?"
            table="discount"
          />
        )}

        {/* {deleteModal && (
          <Confirm
            show={deleteModal}
            onHide={() => setDeleteModal(false)}
            deleteFeeHeadMaster={deleteFeeHeadMaster}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="fee_head_master"
          />
        )} */}

        <Col lg={12} className="p-lg-4">
          {body ? (
            <DatatableWrapper
              body={body}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 15,
                  options: [5, 10, 15, 20],
                },
              }}
            >
              <Row className="mb-4">
                <Col lg={3}>
                  <Filter />
                </Col>
                <Col lg={2}>
                  <Form.Select
                    aria-label="Fee Head Status"
                    name="status"
                    onChange={onFilterType}
                  >
                    <option value="">--Select Status--</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Select>
                </Col>
                <Col lg={1} style={{ "margin-top": "-18px" }}>
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={4} style={{ "margin-top": "-13px" }}>
                  {/* <div > */}
                  <InfoPill left="Total Head Masters" right={body?.length} />
                  {/* </div> */}
                </Col>
                <Col
                  lg={2}
                  style={{ "margin-top": "2px" }}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-light"
                    variant="outline-primary"
                    onClick={() => setShowModal(true)}
                  >
                    New Fees Head Master
                  </Button>
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper>
          ) : (
            <ShimmerTable row={10} col={4} />
          )}
        </Col>
        <Col lg={2}></Col>
      </Row>
      {/*---------------------- New Exam Schedule Modal -----------------------------------*/}

      <Modal
        show={showModal}
        backdrop="static"
        centered
        aria-labelledby="contained-modal-title-vcenter"
        onHide={handleCloseModal}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Fee Head Master
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            <Row>
              <Col lg={6} className="mt-3">
                <Form.Group className="mx-3 fees">
                  <Form.Label className="form-view-label" htmlFor="nameInput">
                    Name
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={discountRecords.name}
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
                    Session
                  </Form.Label>
                  <Form.Select
                    name="sessionid"
                    value={discountRecords.sessionid}
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
            </Row>
            <Row>
            <Col lg={6} className="mt-3">
                <Form.Group className="mx-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Fee Head
                  </Form.Label>
                  <Form.Select
                    name="fee_head_id"
                    value={discountRecords.fee_head_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Session --</option>
                    {feeHeads.map((head) => (
                      <option key={head.label} value={head.label}>
                        {head.value}
                      </option>
                    ))}
                  </Form.Select>
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
                  <Form.Select
                    required
                    name="status"
                    value={discountRecords.status}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6} className="mt-3">
                <Form.Group className="mx-3 fees">
                  <Form.Label className="form-view-label" htmlFor="nameInput">
                    Percent
                  </Form.Label>
                  <Form.Control
                    type="numeric"
                    id="nameInput"
                    name="percent"
                    value={discountRecords.percent}
                    placeholder="Enter percent"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
             
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewDiscount}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Main>
  );
};

export default FeeDiscount;

