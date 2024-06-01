
/**
 * @author: Pooja Vaishnav
 */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
import { toast } from "react-toastify";
import Confirm from "../Confirm";
import PubSub from 'pubsub-js';

//import "./App.css";
const FeeMasterList = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [rowRecords, setRowRecords] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchFeeMaster();
      console.log('feesHead==>',result);
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();
  }, []);

  const labels = {
    beforeSelect: " ",
  };

  const header = [
    {
      title: "Class Name",
      prop: "classname",
      isFilterable: true,
      // cell: (row) => (
      //   <Link to={"/feemasterview/" + row.id} state={row}>
      //     {row.classname}
      //   </Link>
      // ),
    },
    {
      title: "General Fees",
      prop: "total_general_fees",
      isFilterable: true,
    },
    {
      title: "Obc Fees",
      prop: "total_obc_fees",
      isFilterable: true,
    },
    {
      title: "Sc Fees",
      prop: "total_sc_fees",
      isFilterable: true,
    },
    {
      title: "St Fees",
      prop: "total_st_fees",
      isFilterable: true,
    },
    {
         title: "Fee Structure",
         prop: "fee_structure",
         isFilterable: true,
       },
    {
        title: "Status",
        prop: "status",
        isFilterable: true,
    },
    {
        title: "Session",
        prop: "session",
        isFilterable: true,
    },
    {
        title: "Type",
        prop: "type",
        isFilterable: true,
    },{
      title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          {/* <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
             <i className="fa-regular fa-pen-to-square"></i>
         </button> */}
          <Link to={"/feesmasteredit/" + row.id} state={row} className="btn btn-sm btn-primary mx-2">
          <i className="fa-regular fa-pen-to-square"></i>
        </Link>
           <button className="btn btn-sm btn-danger mx-2" onClick={() => setDeleteModal(true)}>
             <i className="fa fa-trash"></i>
           </button>

           {deleteModal &&
        <Confirm
          show={deleteModal}
          onHide={() => setDeleteModal(false)}
          deleteFeeMaster={()=> deleteFeeMaster(row)}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="fee_master"
        />
      }
         </div>
       )
 },
  ];

  const deleteFeeMaster= async (row)=>{
    console.log('delete method called!!', row.id);
      try {
        const result = await schoolApi.deleteFeeMaster(row.id);
        console.log('deleted result => ', result);
    
        if (result.success === false) {
          toast.error(result.message);
          return;
        } else if (result.success === true) {
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Record Deleted',
            message: 'Record Deleted successfully'
          });
          setDeleteModal(false);
          // navigate(`/examlist`);
        }
      } catch (error) {
        console.error('Error during deleteFeeMaster:', error);
        toast.error(error.response.data.message);
      }
  }
  
  // const handleDeleteButton = async (row)=>{
  //   console.log('handle delete button clicked!!!', row.id);
  //   const resultInstallmentdelete = await schoolApi.deleteFeeMaster(row.id);
  //   console.log('resultInstallmentdelete-->', resultInstallmentdelete);

  //   if(resultInstallmentdelete.success){
  //     toast.success(resultInstallmentdelete.message);
  //   }
    
  // }

  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }
  const handleChange = (e) => {
    
  }
  const handleSaveNewTitle = async () => {
    setReload(false);
  }
  const handleFeeMaster = async () => {
    navigate(`/feesmastercreate`);
  }
  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12} /> */}
      <Row className="g-0">
        <Col lg={2} className="mx-3">
          <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> FeesMasterList</Link>
        </Col>
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
                <Col lg={4} style={{ 'margin-top': '-13px' }} >
                  <div >
                    <InfoPill left="Total Exams" right={body?.length} />
                  </div>
                </Col>
                <Col lg={4} style={{ 'margin-top': '2px' }} className="d-flex flex-col justify-content-end align-items-end">
                  <Button className="btn-light" variant="outline-primary" onClick={handleFeeMaster}>New Fees Master</Button>
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

    </Main>
  );
};

export default FeeMasterList;
