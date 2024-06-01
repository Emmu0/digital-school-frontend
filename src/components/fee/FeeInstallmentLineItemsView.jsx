import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Main from '../layout/Main';
import { Helmet } from 'react-helmet';
import PageNavigations from '../breadcrumbs/PageNavigations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import schoolApi from '../../api/schoolApi';
import {Badge, Button, Card, Col, Form, Container, Table, ListGroup, Modal, Row,Tabs,Tab } from "react-bootstrap";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import InfoPill from "../InfoPill";
import { ShimmerTable } from "react-shimmer-effects";
import Confirm from '../Confirm';

const FeeInstallmentLineItemsView = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  //const contact = location.state;
  const [feeMasterInstallment, setFeeMasterInstallment] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [feeLineItems, setLineItems] = useState([]);
  const [locations, setLocations] = useState([]);//shivam shrivastava
  const [selectedId, setSelectedId] = useState(null);//shivam shrivastava
  const [rowRecords, setRowRecords] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false); //added by shivam edit feeInstallment Line Item
  const [editedValues, setEditedValues] = useState({});

  console.log('feeMasterInstallment on line items-->', feeMasterInstallment);
  console.log('location.state-->',location.state);

  useEffect(() => {
    async function init() {
      try {
        const lineitems = await schoolApi.getLineItemsByFeeMasterId(location.state.id);
        console.log('lineitems:', lineitems);
  
        if (Array.isArray(lineitems)) {
            setLineItems(lineitems);
        } else {
          console.error('API response is not an array:', lineitems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    init();
  }, []);
  console.log('feeLineItems @@grand child-->',feeLineItems);

  const editFeeMaster = ()=>{
    console.log('edit button clicked!!');
  }

  const handleDeleteButton = (row) => {
    console.log("row.id", row.id)
    setSelectedId(row.id);

    setModalShow(true);

  }

  const handleDeleteAndNavigate = async () => {
    if (selectedId) {
      try {
        const response = await schoolApi.deleteFeeMasterLineItem(selectedId);

        if (response && response.message === "Record Delete Successfully") {
          const updateFeemasteritem = locations.filter(location => location.id !== selectedId);
          setLocations(updateFeemasteritem);

          setModalShow(false);

        } else {
          console.error('Deletion was not successful:', response);
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const handleEditButton = (row) => {
    console.log("row data for fee installment line item ", row.id);
    setEditedValues({
      general_amount: row.general_amount,
      obc_amount: row.obc_amount,
      sc_amount: row.sc_amount,
      st_amount: row.st_amount,
    });
    setRowRecords(row);
    setEditModalShow(true);
  };

  //added by shivam edit feeInstallment Line Item
  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  //added by shivam edit feeInstallment Line Item
  const handleModalSubmit = async () => {

    try {
      const result = await schoolApi.updateFeeMasterLine(rowRecords.id, editedValues);
      console.log('result after status change', result);

    } catch (error) {
      console.log("error is found");
    }


    // Perform the update logic here using the editedValues state
    // Close the modal
    setEditModalShow(false);
  };

  const header = [
    {
      title: "Class Name",
      prop: "classname"
      // cell: (row) => (
      //   <Link onClick={() => handleShowModal(row)}>{row.student_name}</Link>
      // ),
    },
    {
      title: 'Head Name',
      prop: 'head_name',
      isFilterable: true,
    },
    {
      title: "General Amount",
      prop: "general_amount",
    },
    {
      title: 'Obc Amount',
      prop: 'obc_amount',
    },
    {
      title: 'Sc Amount',
      prop: 'sc_amount',
    },
    {
      title: 'St Amount',
      prop: 'st_amount',
    },
    {
      title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary mx-2"
            onClick={() => handleEditButton(row)}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </div>
      )
    }
];

    const labels = {
      beforeSelect: " ",
    };

  return (
    <div>
       <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <div>
        {feeMasterInstallment && <Container>
          {/* {modalShow &&
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              deleteContact={deleteContact}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="contact"
            />} */}
            {modalShow && (
            <Confirm
              show={modalShow}
              onHide={() => setModalShow(false)}
              handleDeleteButton={() => handleDeleteAndNavigate()}
              title="Confirm delete?"
              message="You are going to delete the record. Are you sure?"
              table="feeInstallmentLineitemDelete"
            />
          )}
          <PageNavigations listName="Employee" listPath="/staffs" viewName="" viewPath="" colLg={2} colClassName="d-flex mx-3 mb-3" extrColumn={12} />

          <Row className="view-form">
            <Col lg={12}>
              <Row className="view-form-header align-items-center mx-2">
                <Col lg={3}>
                  <h5>Month</h5>
                  <h5> {feeMasterInstallment.month}</h5>
                </Col>
                <Col lg={9} className="d-flex justify-content-end">
                  <Button className="btn-sm mx-2" onClick={() => editFeeMaster(true)}>
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Button>
                  <Button
                    className="btn-sm"
                    variant="danger"
                    onClick={() => setModalShow(true)}
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
                      <span style={{ color: "black" }}>Installment Details of {feeMasterInstallment.month}</span>
                    </Col>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Month</label>
                  <span>
                    {feeMasterInstallment.month}
                  </span>
                </Col>
                <Col lg={5}>
                  <label>General Total Fee</label>
                  <span>{feeMasterInstallment.general_fee}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>Obc Total Fee</label>
                  <span>{feeMasterInstallment.obc_fee}</span>
                </Col>
                <Col lg={5}>
                  <label>Sc Total Fee</label>
                  <span>{feeMasterInstallment.sc_fee}</span>
                </Col>
                <Col lg={1}></Col>
                <Col lg={1}></Col>
                <Col lg={5}>
                  <label>St Total Fee</label>
                  <span>{feeMasterInstallment.st_fee}</span>
                </Col>
                <Col lg={5}>
                  <label>status</label>
                  <span>{feeMasterInstallment.status}</span>
                </Col>
                <Col lg={1}></Col>
              </Row>
            </Col>

            <Row>
                <Col lg={12} className='mt-3 mx-3'>
                    <Col className="section-header my-3">
                      <span style={{ color: "black" }}>Fee Installment Line Items</span>
                    </Col>
                </Col>
              </Row>

              <Row className="g-0">
      <Col lg={12} className="p-lg-4">

                  {feeLineItems ? (
              <DatatableWrapper
              body={feeLineItems.map(item => ({ ...item, fee_head_master_id: item.fee_head_master_id }))}
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
                <Col lg={4}></Col>
              </Row>
            <Col>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </Col>
          </DatatableWrapper> ) : ( <p>No Data Found!!!</p>)}
      </Col>
      <Col lg={2}></Col>
    </Row>

          </Row>
        </Container>}
      </div>
    </Main>
    </div>
  )
}

export default FeeInstallmentLineItemsView
