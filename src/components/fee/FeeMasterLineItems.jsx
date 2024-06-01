import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from 'moment';
import InfoPill from "../InfoPill";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import Confirm from "../Confirm";
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FeeMasterLineItems = (props) => {

  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [fees, setFees] = useState();
  const [showModal, setShowModal] = useState(false);
  const [feeHeadMastersRec, setFeeHeadMastersRec] = useState([]);
  const [feeMastersRec, setFeeMastersRec] = useState([]);
  const [sessionRecords, setSessionRecords] = useState([]);
  const [newFeeHeadMasters, setNewFeeHeadMasters] = useState({});
  const [reload, setReload] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();

  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchFeeMasterLineItems();
      console.log('FeeMasterLineItems records -->',result);
      if (result) {
        setBody(result);
        setFees(result);
      } else {
        setBody([]);
        setFees([]);

      }
    }
    init();
  }, [reload]);

  console.log('body records', body);

  useEffect(()=>{
    async function initsecond() {
        const feeHeadMastersResult = await schoolApi.fetchFeesHeadMaster();
        console.log('fee head masters record -->',feeHeadMastersResult);
        if (feeHeadMastersResult) {
          setFeeHeadMastersRec(feeHeadMastersResult);
        } else {
          setFeeHeadMastersRec([]);
        }

        const feeMastersResult = await schoolApi.fetchFeeMaster();
        console.log('fee masters record -->',feeMastersResult);
        if (feeMastersResult) {
          setFeeMastersRec(feeMastersResult);
        } else {
          setFeeMastersRec([]);
        }

        const sessionResult = await schoolApi.fetchSessions();
        console.log('SessionRecords -->',sessionResult);
        if (sessionResult) {
            setSessionRecords(sessionResult);
        } else {
            setSessionRecords([]);
        }
      }
      initsecond();
  },[showModal]);

  console.log('feeHeadMastersRec records in useEffect', feeHeadMastersRec);
  console.log('feeMastersRec records in useEffect', feeMastersRec);
  console.log('session records in useEffect', sessionRecords);

  const onFilterType = (event) => {
    if (event.target.value === '') {
      setBody(fees);
    } else {
      setBody(
        fees.filter((data) => {
          if ((data.classname || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
        })
      );
    }
  };

console.log("Header on feeList ",body)

  const header = [
    {
      title: 'name', prop: 'name', isFilterable: true,
      // cell: (row) => (
      //   <Link
      //     to={"/fees/"+ row.id}
      //     state={row}
      //   >
      //     {row.name}
      //   </Link>
      // )
    },
    { title: 'session', prop: 'session' },
    { title: 'status', prop: 'status' },
    { title: 'amount', prop: 'amount' },
    { title: 'month', prop: 'month', isFilterable: true },
    { title: 'fee_structure', prop: 'fee_structure' },
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
    beforeSelect: " "
  }

  const handleEditButton=(row)=>{
    console.log('single row record', row);
    setNewFeeHeadMasters(row)
    // setIsEdit(true);
    setShowModal(true);
    setDeleteModal(false);
  }

  const handleDeleteButton=(row)=>{
    console.log('delete button clicked', row);
    setDeleteId(row.id);
    setDeleteModal(true);

  }

  const createFee = () => {
    console.log('New Fee button clicked');
    setShowModal(true);
    // navigate('/fmasterlineitemedit');
  }

  const handleCloseModal=()=>{
    setShowModal(false);
    setNewFeeHeadMasters({});
  }

  
  const handleChange=(e)=>{
    setReload(false);
   console.log('handle change clicked!!!');
   setNewFeeHeadMasters({...newFeeHeadMasters, [e.target.name]: e.target.value})
      
   }

   console.log('newFeeHeadMasters',newFeeHeadMasters);

   const handleSaveNewHeadMaster=async()=>{

    if(!newFeeHeadMasters.amount ||
       !newFeeHeadMasters.fee_head_master_id ||
       !newFeeHeadMasters.fee_master_id ||
       !newFeeHeadMasters.session_id){
      toast.error("Fill all required values!!!"); 
      return;
    }

    console.log('handleSaveNewHeadMaster button clicked');

    if(newFeeHeadMasters.id){
      //---------------------- update ------------------
      const result2 = await schoolApi.updateFeeMasterLineItems(newFeeHeadMasters.id, newFeeHeadMasters);
      console.log('result after update',result2);
      if(result2.success){
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Updated', message: 'Record updated successfully' });
        setReload(true);
        setShowModal(false);
      }
      else{
        setShowModal(true);
      }
    }
    else{
      const result = await schoolApi.createFeeMasterLineItems(newFeeHeadMasters);
      console.log('result after save',result);
      if(result.success){
       
        PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
        setReload(true);
        setShowModal(false);
      }
      else{
        setShowModal(true);
      }
    }
   }

   const deleteFeeMasterLineItem = async () => {
    try {
      const result = await schoolApi.deleteFeeMasterLineItems(deleteId);
      console.log('deleted result => ', result);
  
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
        navigate(`/fmasterlineitem`);
      }
    } catch (error) {
      console.error('Error during deleteTitle:', error);
      toast.error(error.response.data.message);
    }
  };

  return (
   <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
     <PageNavigations   colLg={2} colClassName="d-flex mx-4" extrColumn={12}/>
     <Row className="g-0">
      <Col lg={12} className="px-lg-4">

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
          deleteFeeMasterLineItem={deleteFeeMasterLineItem}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="fee_master_line_items"
        />
      }

        {body ?
          <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
            initialState: {
              rowsPerPage: 15,
              options: [5, 10, 15, 20]
            }
          }}>
            <Row className="mb-4">
              <Col
                lg={3}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Filter />

              </Col>
              <Col
                lg={7}
                className="d-flex flex-col justify-content-start align-items-start"
              >
                {/* <Form.Group className="mx-3 mt-4" controlId="formBasicStatus">
                    <Form.Select aria-label="Enter status" name="location" onChange={onFilterType}>
                      <option value="">--Select Class--</option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4rd">4rd</option>
                      <option value="5th">5th</option>
                      <option value="6th">6th</option>
                      <option value="7nd">7nd</option>
                      <option value="8td">8td</option>
                      <option value="9th">9th</option>
                      <option value="10th">10th</option>
                      <option value="11th">11th</option>
                      <option value="12th">12th</option>
                  </Form.Select>
              </Form.Group> */}
                <PaginationOptions labels={labels} />
                <div style={{ "marginTop": "5px" }}>
                  <InfoPill left="Total Registered Classes Fee" right={body?.length} />
                </div>
              </Col>
              <Col
               
                lg={2}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button className="btn-sm" variant="outline-primary" onClick={() => createFee(true)}>New Fee Master Line Item</Button>
              </Col>
            </Row>
            <Table striped className="data-table">
              <TableHeader />
              <TableBody />
            </Table>
            <Pagination />
          </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
      </Col>
      <Col lg={2}></Col>
    </Row>

{/*---------------------- New Fee Master Line Items Modal -----------------------------------*/}

<Modal show={showModal} backdrop="static"  centered  aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Fee Master Line Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="mt-3">
            <Row>

              <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
              <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Fee Head
                  </Form.Label>
              <Form.Select required name="fee_head_master_id" value={newFeeHeadMasters.fee_head_master_id} onChange={handleChange}>
              <option value="">-- Select Fee Head  --</option>
                {feeHeadMastersRec.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name}
                  </option>
                ))}
              </Form.Select>
              </Form.Group>
            </Col> 
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3"> 
                <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                  Fee Master
                </Form.Label>
                <Form.Select
                  required
                  name="fee_master_id"
                  value={newFeeHeadMasters.fee_master_id}
                  onChange={handleChange}
                >
                  <option value="">-- Select Fee Master --</option>
                  {feeMastersRec.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.classname}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label" htmlFor="formBasicFirstName">
                  Session
                </Form.Label>
                <Form.Select
                  required
                  name="session_id"
                  value={newFeeHeadMasters.session_id}
                  onChange={handleChange}
                >
                  <option value="">-- Select Session --</option>
                  {sessionRecords.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.year}
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
                    Amount
                  </Form.Label>
                  <Form.Control required type="number" value={newFeeHeadMasters.amount} name="amount" placeholder="Enter Amount" onChange={handleChange} />
                </Form.Group>
              </Col>

              {/* <Col lg={6}>
              <Form.Group className="mx-3 mt-4" controlId="formBasicStatus">
                <Form.Select aria-label="Enter status" name="month" value={newFeeHeadMasters.month} onChange={handleChange}>
                  <option value="">--Select Month--</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </Form.Select>
              </Form.Group>
              </Col> */}

            </Row>
         </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewHeadMaster}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

   </Main>
  );
};

export default FeeMasterLineItems;
