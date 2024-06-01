/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import schoolApi from '../../api/schoolApi';
import { useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confirm from '../Confirm';
import PubSub from 'pubsub-js';


const FeeDepositeHistory = (props) => {

    const location = useLocation();    
    const [studentRecord, SetStudentRecord] = useState(location.state.row ? location.state.row : {});
    const [depositeHistory, setDepositeHistory] = useState([]);
    const [totalFeeCategory, setTotalFeeCategory] = useState();
    const tableRefs = useRef([]);
    const [fetchSuccess, setFetchSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [depositeRecord, setDepositeRecord] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [months, setMonths] = useState([]);


    useEffect(()=>{
      async function init(){
        let fee_by_cat = '';
        let total_by_fee_cat = '';

        if (location?.state?.row.category === "General") {
          setTotalFeeCategory("total_general_fee");
          fee_by_cat = "general_fee"
          total_by_fee_cat = "total_general_fee"
        } else if (location?.state?.row.category === "Obc") {
          setTotalFeeCategory("total_obc_fee");
          fee_by_cat = "obc_fee"
          total_by_fee_cat = "total_obc_fee"
        } else if (location?.state?.row.category === "Sc") {
          setTotalFeeCategory("total_sc_fee");
          fee_by_cat = "sc_fee"
          total_by_fee_cat = "total_sc_fee"
        } else if (location?.state?.row.category === "St") {
          setTotalFeeCategory("total_st_fee");
          fee_by_cat = "st_fee"
          total_by_fee_cat = "total_st_fee"
        }
  
      // console.log('studentRecord.student_addmission_id-->',studentRecord?.student_addmission_id);
      const result = await schoolApi.fetchFeeDepositsByStudentId(studentRecord?.student_addmission_id);
      console.log('deposite by student Addmission id-->',result);

      if (!result || result.success === false) {
        setFetchSuccess(false);
        return;
      }

    setFetchSuccess(true);
      if(result){
        console.log('result-->',result);
        
        result?.forEach((res, index) => {
          tableRefs.current[index] = React.createRef();

          setMonths((prevMonths) => {
            if (!prevMonths.some(month => month.value === res.month)) {
              return [...prevMonths, { key: res.id, value: res.month }];
            }
            return prevMonths; 
          });
          
          setDepositeHistory((history) => {
            if (history.some(story => story.id === res.id)) {
              return history.map((itm) => {
                if (itm.id === res.id) {
                  if (!itm.studentfee.some(st => st.line_item_id === res.line_items_id )) {
                  return {
                    ...itm,
                    studentfee: [...itm.studentfee, {
                      fee_by_cat: res[fee_by_cat], 
                      line_item_id: res.line_items_id,
                      headname: res.headname
                    }],
                  };
                }
                }
                return itm;
              });
            } else {
              return [...history, {
                ...res,
                studentfee: [{
                  fee_by_cat: res[fee_by_cat], 
                  line_item_id: res.line_items_id, 
                  headname: res.headname
                }]  
              }];
            }
          });
          
        });
        
        
      }
      }
      init();
    },[]);

    console.log('months-->',months);

    const handlePrint = (tableElement) => {
      const tableContent = tableElement.outerHTML;
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert('Please allow pop-ups for this site to print.');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              /* Define your print styles here */
              table {
                border-collapse: collapse;
                width: 100%;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
              }
            </style>
          </head>
          <body>
            ${tableContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    console.log('studentRecord-->',studentRecord);
    console.log('depositeHistory-->',depositeHistory);

  const handleEditButton= async(row)=>{
    // try {
      setShowModal(true)
      console.log('deposite id-->', row.id);
      setDepositeRecord(row);
     // const result = await schoolApi.fetchFeeDepositsById(row.id);
     // console.log('deposite by id-->',result);

      // if(result){
      //   setDepositeRecord(result);
      // }
      // else{
      //   setDepositeRecord([]);
      // }
    // } catch (error) {
    //   console.log('error',error);
    // }
  }

  const handleChange =(e)=>{
    console.log('handle change clicked!!!');
    setDepositeRecord({...depositeRecord, [e.target.name]: e.target.value});
  }

  const handleCloseModal=()=>{
    setShowModal(false);
    setDepositeRecord([]);
  }

  const handleUpdateDeposite= async ()=>{
    console.log('handle update deposite clicked!!!');
    const result = await schoolApi.updateFeeDepositsById(depositeRecord.id, depositeRecord);
    if(result){
      console.log('result after update-->', result);
      setShowModal(false);
      setDepositeRecord([]);
      setDeleteModal(false);
      setDeleteId();
    }
    else{
      console.log('error occured!!');
    }
  }

  console.log('depositeRecord-->', depositeRecord);
  const handleDeleteButton=(deposite_id)=>{
    console.log('delete button clicked', deposite_id);
    setDeleteId(deposite_id);
    setDeleteModal(true);
  }

  const handleCancelReceipt = ()=>{
    console.log('cancel receipt button clicked')
  }

  const deleteDeposite = async () => {
    try {
      console.log('deleteId-->',deleteId);
      const result = await schoolApi.deleteFeeDeposite(deleteId);
      console.log('deleted result => ', result);
  
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
      }
    } catch (error) {
      console.error('Error during deleteTitle:', error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Main>
      <Helmet>
        {" "}
        <title>{props?.tabName}</title>{" "}
      </Helmet>
      <Row className="g-0">
        <Col lg={2} className="mx-3">
          <Link className="nav-link mx-2" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            FeeDepositeHistory
          </Link>
        </Col>

        {deleteModal &&
        <Confirm
          show={deleteModal}
          onHide={() => setDeleteModal(false)}
          deleteDeposite={deleteDeposite}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="fee_deposite"
        />
      }

        <Row>
          <Col lg={12}>
            <Col className="section-header mx-3 my-3">
              <span style={{ color: "black" }}>Fee Deposite History</span>
            </Col>
          </Col>
        </Row>
        
        {fetchSuccess ? depositeHistory.map((res, index)=>{
          return (
            <>
             <Row className="mx-2">
                  <Col lg={12} className="d-flex justify-content-end">
                  {/* <Button
                      className="btn-sm mx-2"
                      variant="warning"
                      onClick={() => handleCancelReceipt(res.id)}
                    >
                      Cancel Receipt
                    </Button> */}
                    <Button className="btn-sm mx-2" onClick={() => handleEditButton(res)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm mx-2"
                      variant="danger"
                      onClick={() => handleDeleteButton(res.id)}
                    >
                      Delete
                    </Button>
                    <Button className='mx-2' onClick={() => handlePrint(tableRefs.current[index].current)} key={res.id}>Print</Button>

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
            <Row  id={`row-${index}`} className="mx-3 my-3 square border border-secondary">
            
              <Table
                // striped
                bordered
                ref={tableRefs.current[index]}
                // hover
                style={{
                  minWidth: "700px",
                  marginRight: "50px",
                  marginTop: "30px",
                }}
              >
                <thead>
                  {/* <tr>
                    <td colSpan="4" style={{ textAlign: "right" }}>
                       <Button onClick={() => handlePrint(tableRefs.current[index].current)} key={res.id}>Print</Button>
                    </td>
                  </tr> */}
                  <tr style={{ textAlign: "center" }}>
                    <th colSpan="4">
                      <b>{res.month}</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Student Name</th>
                    <td>
                      {studentRecord.firstname} {studentRecord.lastname}
                    </td>
                    <th>Class</th>
                    <td>{res.classname}</td>
                  </tr>
                  <tr>
                    <th>Paid By</th>
                    <td>{res.payment_method}</td>
                    <th>Total Amount</th>
                    <td>{res[totalFeeCategory]}</td>
                  </tr>
                  <tr>
                    <th colSpan="2">Payment Date</th>
                    <td colSpan="2">{res.payment_date}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ paddingTop: "30px" }}></td>
                  </tr>
                  <tr>
                    <th colSpan="3">Name</th>
                    <th colspan="1">Amount</th>
                  </tr>
                  {res.studentfee.map((record) => {
                    return (
                      <tr>
                        <td colSpan="3">{record.headname}</td>
                        <td colSpan="1">{record.fee_by_cat}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th colSpan="3" style={{ textAlign: "right" }}>
                      Total Amount
                    </th>
                    <td colSpan="1">{res[totalFeeCategory]}</td>
                  </tr>
                  <tr>
                    <th colSpan="3" style={{ textAlign: "right" }}>
                      Due Amount
                    </th>
                    <td colSpan="1">{res.due_amount}</td>
                  </tr>
                  <tr>
                    <th colSpan="3" style={{ textAlign: "right" }}>
                      Discount
                    </th>
                    <td colSpan="1">{res.discount}</td>
                  </tr>
                  <tr>
                    <th colSpan="3" style={{ textAlign: "right" }}>
                      Paid Amount
                    </th>
                    <td colSpan="1">{res.amount}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ paddingTop: "30px" }}></td>
                  </tr>
                  <tr>
                    <th colSpan="4" style={{ paddingBottom: "50px" }}>
                      Additional Note :{" "}
                    </th>
                  </tr>

                  <tr>
                    <th>School Seal</th>
                    <td style={{ paddingTop: "30px" }}>
                      <hr></hr>
                    </td>
                    <th>Authorised Signature</th>
                    <td style={{ paddingTop: "30px" }}>
                      <hr></hr>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            </>
          );
        }
        )
        :
        <p className='mx-3'>No records found!!!</p>
        }

        <Col lg={2}></Col>

        {/*---------------------- New Exam Schedule Modal -----------------------------------*/}

      <Modal show={showModal} backdrop="static"  centered  aria-labelledby="contained-modal-title-vcenter" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Fee Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form className="mt-3">
            <Row>
            <Col lg={6}>
                <Form.Group className="mx-3 mt-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Deposited Amount
                  </Form.Label>
                  <Form.Control type="number" value={depositeRecord?.amount} name="amount" placeholder="Enter Amount" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mx-3 mt-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Payment Date
                  </Form.Label>
                  <Form.Control type="date" value={depositeRecord?.payment_date} name="payment_date" placeholder="Select Payment Date" onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3 mt-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Discount
                  </Form.Label>
                  <Form.Control type="discount" value={depositeRecord?.discount} name="discount" placeholder="Enter Discount" onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mx-3 mt-3">
                  <Form.Label
                    className="form-view-label"
                    htmlFor="formBasicFirstName"
                  >
                    Due Amount
                  </Form.Label>
                  <Form.Control disabled type="due_amount" value={depositeRecord?.due_amount} name="due_amount" placeholder="Due Amount" onChange={handleChange} />
                </Form.Group>
              </Col>

            </Row>
         </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateDeposite}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      </Row>
    </Main>
  );
}

export default FeeDepositeHistory
