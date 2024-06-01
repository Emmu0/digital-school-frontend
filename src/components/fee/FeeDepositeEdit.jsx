/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useState, useEffect } from "react";
import { Button, Col, Form, Table, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import moment from "moment";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstallmentTable from "./InstallmentTable"

const FeeDepositeEdit = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentRecord, SetStudentRecord] = useState(location.state.row ? location.state.row : {});
  const [settings, setSettings] = useState([]);
  const [frequency, setFrequency] = useState(3);
  const [studentInstallment, setStudentInstallment] = useState();
  const [feeDeposit, setFeeDeposit] = useState({});
  const [tempAmount, setTempAmount] = useState({});
  console.log("studentRecord-->", studentRecord);

  useEffect(() => {
    async function initClass() {

      const ResultSettings = await schoolApi.getSettingByKey("late_fee");
      if (ResultSettings.success) {
        setSettings(ResultSettings.data);
      } else {
        setSettings([]);
      }

      const insResult = await schoolApi.getallIntsallment(studentRecord?.student_addmission_id, studentRecord?.session_id);
      console.log('insResult-->',insResult);

      if(insResult.success){
        setStudentInstallment(insResult.result);
      }
    }

    initClass();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    const currentDate = `${year}-${month}-${day}`;
   setFeeDeposit({ ...feeDeposit, payment_date: currentDate });
    return currentDate;
  };

  const handleCloseModal = () => {
  setFeeDeposit({});
  setTempAmount({});
  };

  const feeDepositHandler = (installments) => {
    console.log('parent installments-->', installments);

    const totals = {
      totalAmount: 0,
      discount: 0,
      previous_due: 0,
      due_amount: 0,
      totalTransportFee: 0,
      grossPayableAmount: 0,
      late_fee: 0,
      netPayableAmount: 0,
      amount: 0,
      installments: []
    };
  
    const parseAmount = (amount) => parseInt(amount) || 0;
    const currentDate = new Date();
  
    installments.forEach((res, index) => {

      totals.installments.push({ id: res?.id });
      totals.totalAmount += parseAmount(res?.installment_amount);
      totals.discount += parseAmount(res?.discounted_amount);
      totals.previous_due += parseAmount(res?.previous_due);
      totals.totalTransportFee += parseAmount(res?.transport_fee);
      totals.grossPayableAmount += parseAmount(res?.grossPayableAmount);
      totals.netPayableAmount += parseAmount(res?.net_payable_amount);

      const dueDate = res?.due_date;
      if (dueDate && new Date(dueDate) < currentDate) {
        const differenceInDays = Math.ceil((currentDate - new Date(dueDate)) / (1000 * 3600 * 24));
        const netDueDays =  parseInt((differenceInDays + frequency) / frequency);
        console.log('netDueDays-->',netDueDays);
        totals.late_fee += Math.round(netDueDays * parseAmount(settings[0]?.value));
      }
    });
    
     totals.netPayableAmount += totals.late_fee;
  
    setFeeDeposit(totals);
    setTempAmount(totals);
    console.log('parent totals', totals);
  };

  const handleChange= (e)=>{
    e.preventDefault();
    
    if(e.target.name === 'amount'){
      const enteredValue = e.target.value;

      if (enteredValue <= feeDeposit?.netPayableAmount) {
        const dueAmount = feeDeposit?.netPayableAmount - enteredValue;

        setFeeDeposit({
          ...feeDeposit,
          [e.target.name]: enteredValue,
          due_amount: Math.round(dueAmount),
        });
        setTempAmount({
          ...tempAmount,
          [e.target.name]: enteredValue,
          due_amount: Math.round(dueAmount),
        });
      } else {
        toast.error("Entered amount exceeds total amount!");
      }
    }
    else if(e.target.name === 'late_fee'){
      let late = e.target.value;
      // let amount  = 0;
      // let netamount = 0;

      if (late) {
        console.log('latefee is greater then zero', late)
        if (feeDeposit.amount > 0) {
          setFeeDeposit({ ...feeDeposit, [e.target.name]: late, 
            amount: parseInt(tempAmount?.amount) + parseInt(late), 
            netPayableAmount: parseInt(tempAmount?.netPayableAmount) + parseInt(late)
          });
        }
        else {
          setFeeDeposit({ ...feeDeposit, [e.target.name]: late, 
            // amount: parseInt(tempAmount?.amount) + parseInt(late), 
            netPayableAmount: parseInt(tempAmount?.netPayableAmount) + parseInt(late)
          });
        }
      }
      else {
        console.log('latefee is less then zero', late)
        setFeeDeposit({ ...feeDeposit, [e.target.name]: late, 
          amount: parseInt(tempAmount?.amount) - 0, 
          netPayableAmount: parseInt(tempAmount?.netPayableAmount)-0
        });
      }
    }
    else{
      setFeeDeposit({...feeDeposit,[e.target.name]: e.target.value});
    }
  }

  const amountManager=()=>{
    if(feeDeposit.amount <=0){
      console.log('amount manager called');
      feeDeposit.amount = feeDeposit.netPayableAmount
    }
  }

  const handleSaveDeposites = async () => {
    try {
      console.log("handle save button clicked!!!", feeDeposit);

      amountManager();

      console.log('last time feeDeposite-->', feeDeposit);
      if (!feeDeposit.amount || !feeDeposit.payment_date || !feeDeposit.payment_method) {
        return toast.error('Fill all required values!!');
      }

      const arr = {
        totalAmount: feeDeposit?.totalAmount,
        netPayableAmount: feeDeposit?.netPayableAmount,
        student_addmission_id: studentRecord?.student_addmission_id,
        discount: feeDeposit?.discount,
        installments: feeDeposit?.installments,
        amount: feeDeposit?.amount,
        sessionid: studentRecord?.session_id,
        payment_date: feeDeposit?.payment_date,
        payment_method: feeDeposit?.payment_method,
        late_fee: feeDeposit?.late_fee ? feeDeposit?.late_fee : 0,
        remark: feeDeposit?.remark,
        due_amount: feeDeposit?.due_amount
      };

      console.log('arr value->', arr);

      if (arr) {
        const feeDepositResult = await schoolApi.createFeeDeposit(arr);
        if (feeDepositResult) {
          toast.success('Fees updated successfully!!');
          navigate('/feedeposite');
        }
        else {
          toast.error('Something went wrong!!');
        }
      }

    } catch (error) {
      console.log("error occured", error);
    }
  };

  console.log('feeDeposit', feeDeposit);
  
  return (
    <Main>
      <Helmet>
        {" "}
        <title>{props?.tabName}</title>{" "}
      </Helmet>
      <Row className="g-0">
        <Col lg={2} className="mx-3">
          <Link className="nav-link mx-2" to="/">
            Home <i className="fa-solid fa-chevron-right"></i> FeeDepositeCreate
          </Link>
        </Col>

        <Row className="view-form">
          <Row className="section-header my-2">
            <Col lg={9}>
              <span>Fee Deposite Edit</span>
            </Col>
            <Col lg={2} className="d-flex justify-content-end">
              {/* <Form.Group>
                <Form.Select
                  name="sessionid"
                  value={
                    feeDeposite.sessionid === ""
                      ? currentSession && currentSession.id
                      : feeDeposite.sessionid && feeDeposite.sessionid
                  }
                  onChange={(e) => handleChange(e, null, null)}
                >
                  <option value="">-- Select Session --</option>
                  {sessionYear.map((session) => (
                    <option key={session.id} value={session.id}>
                      {feeDeposite.sessionid === ""
                        ? currentSession && currentSession.year
                        : session && session.year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}
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
          <Row
            className="mx-3"
            style={{ backgroundColor: "white", borderRadius: "10px" }}
          >
            <Row className="pb-3">
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Student Name</label>
                <span>
                  {/* {studentRecord.firstname} {studentRecord.lastname} */}
                  {studentRecord.studentname}
                </span>
              </Col>
              <Col lg={5}>
                <label>Email</label>
                <span>{studentRecord.email}</span>
              </Col>
              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Date</label>
                <span>
                  {moment(studentRecord.dateofbirth).format("DD-MM-YYYY")}
                </span>
              </Col>
              <Col lg={5}>
                <label>Category</label>
                <span>{studentRecord.category}</span>
              </Col>

              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Phone</label>
                <span>{studentRecord.phone}</span>
              </Col>
              <Col lg={5}>
                <label>Total Fees (₹)</label>
                <span>{studentRecord.total_fees}</span>
              </Col>

              <Col lg={1}></Col>
              <Col lg={1}></Col>
              <Col lg={5}>
                <label>Discount (%)</label>
                {/* <span>{studentDiscount}</span> */}
              </Col>
              {/* <Col lg={5}>
                <label>Total Fees</label>
                <span>{studentRecord.total_fees}</span>
              </Col> */}

              <Col lg={1}></Col>

              <Col></Col>
            </Row>
          </Row>
          <Col lg={2}></Col>
        </Row>

        {studentInstallment &&
          <InstallmentTable data={studentInstallment} feeDepositHandler={feeDepositHandler} />
        }

         {feeDeposit?.totalAmount > 0 && (
          <>
            <Row>
              <Col lg={1}></Col>
              <Col lg={5} className="mb-3">
                <Row>
                  <Form.Group className="mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicEmail"
                    >
                      Total Amount
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="totalAmount"
                      placeholder="Enter Duration"
                      value={feeDeposit?.totalAmount}
                      onChange={(e) => handleChange(e)}
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Discount
                    </Form.Label>
                    <Form.Control
                      type="number"
                      disabled
                      value={feeDeposit?.discount}
                      name="discount"
                      placeholder="Enter Discount"
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Gross Payable
                    </Form.Label>
                    <Form.Control
                      type="number"
                      disabled
                      value={feeDeposit?.grossPayableAmount}
                      name="gross_payable"
                      placeholder="Enter Discount"
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className=" mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicEmail"
                    >
                      Prevoius Dues
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="previous_due"
                      placeholder="Total Dues"
                      value={feeDeposit?.previous_due}
                      onChange={(e) => handleChange(e)}
                      disabled
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Due Amount
                    </Form.Label>
                    <Form.Control
                      disabled
                      type="number"
                      value={feeDeposit?.due_amount}
                      name="due_amount"
                      placeholder="Enter Due Amount"
                      onChange={(e) => handleChange(e, null, null)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Late Fee
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={feeDeposit?.late_fee}
                      name="late_fee"
                      placeholder="Enter Late Fee"
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicEmail"
                    >
                      Net Payable Amount
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="net_payable_amount"
                      placeholder="Net Payable Amount"
                      value={feeDeposit?.netPayableAmount}
                      onChange={(e) => handleChange(e)}
                      disabled
                    />
                  </Form.Group>
                </Row>
              </Col>
              <Col lg={5}>
                <Row>
                  <Form.Group className=" mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Enter Amount
                    </Form.Label>
                    <Form.Control
                      required
                      type="number"
                      value={feeDeposit?.amount ? feeDeposit?.amount : feeDeposit?.netPayableAmount ? feeDeposit?.netPayableAmount : 0}
                      name="amount"
                      placeholder="Enter Deposite Amount"
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicLastName"
                    >
                      Deposite Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="payment_date"
                      placeholder="Select Date"
                      value={feeDeposit?.payment_date ? feeDeposit?.payment_date : getCurrentDate()}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicClass"
                    >
                      Payment Method
                    </Form.Label>
                    <Form.Select
                      required
                      name="payment_method"
                      value={feeDeposit?.payment_method}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Cash">Cash</option>
                      <option value="NEFT">NEFT</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Paytm">Paytm</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row style={{ height: "49%" }} className="mt-3 ms-2">                
                  <Form.Group>
                    <Form.Label
                      className="form-view-label"
                      htmlFor="formBasicFirstName"
                    >
                      Remark
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      value={feeDeposit?.remark}
                      name="remark"
                      placeholder="Enter Remark"
                      onChange={(e) => handleChange(e, null, null)}
                      style={{ height: "100%", width: "103%" }}
                    />
                  </Form.Group>
                </Row>

              </Col>
              <Col lg={1}></Col>
            </Row>
            <Row className={"justify-content-center"}>
              <Col lg={2}>
                <Button
                  className="mx-3 mt-3 mb-3"
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                <Button
                  className="mx-3 mt-3 mb-3"
                  variant="primary"
                  onClick={handleSaveDeposites}
                >
                  Save
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
          </>
        )} 
      </Row>
    </Main>
  );
};

export default FeeDepositeEdit;
