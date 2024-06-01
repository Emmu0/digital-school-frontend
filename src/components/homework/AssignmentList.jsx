import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import Confirm from "../Confirm";
import CreateAssignmentModal from "./CreateAssignmentModal";
import { Link } from "react-router-dom";
import PubSub from "pubsub-js";



const AssignmentList = (props) => {
  console.log('props AssignmentList ', props)
  
  const [body, setBody] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [assignData,setAssignData] = useState();
  const [btnName,setBtnName] = useState('Save');
  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const [rowDataId,setRowDataId]  = useState();

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  async function fetchAllAssignments() {
    const result = await schoolApi.getAllAssignment();
    if (result) {
      setBody(result);
    } else {
      setBody([]);
    }
  }
 
  const handleEditButton = (row) =>{
    setModalShow(true);
    setAssignData(row);
    setBtnName('Update')
  }

  const handleDeleteButton = (row) =>{
    setShowDeleteModal(true)
    setRowDataId(row.id)
  }

  const header = [
    {title: 'Class Name', prop: 'class', isFilterable: true,},
    { title: 'Subject Name', prop: 'subject_name',isFilterable: true },
    { title: 'Date', prop: 'date', isFilterable: true},
    { title: 'Title', prop: 'title', isFilterable:true},
    { title: 'Status', prop: 'status', isFilterable: true },
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

  const createAssignment = () => {
    setModalShow(true);
    setAssignData('')
    setBtnName('Save')
  }

  const handleCloseModal = () =>{
    setModalShow(false);
  }


  const handleDeleteAssignmentRecord = async () =>{
    if(rowDataId){
     try {
       const result  = await schoolApi.deleteAssignment(rowDataId);
       if(result && result.message === "Successfully Deleted"){
         const deleteAssignment = body.filter(rteRec => rteRec.id !== rowDataId);
         setBody(deleteAssignment)
         setShowDeleteModal(false)
         //Add By Aamir khan only publish list add
         PubSub.publish('RECORD_SAVED_TOAST', {
          title: 'Record Deleted',
          message: 'Record Deleted successfully'
        });
       }else{
         console.error('deletion was not successfull', result)
       }
     } catch (error) {
        console.error("Errror deleteing ", error);
     }
    }
   }

  return (
   <Main>
     
     {showDeleteModal &&
          <Confirm
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            handleDeleteButton={()=>handleDeleteAssignmentRecord()}
            title="Confirm delete?"
            message="You are going to delete the record. Are you sure?"
            table="deleteAssignment"
          />}

           <CreateAssignmentModal 
                    modalShow={modalShow} 
                    handleCloseModal={handleCloseModal} 
                    fetchAllAssignments={fetchAllAssignments}
                    assignData={assignData}
                    btnName={btnName}
            />

     {/* <Helmet><title>{props?.tabName}</title> </Helmet>
     <PageNavigations   colLg={2} colClassName="d-flex mx-4 " extrColumn={12}/> */}
       <Col lg={2} className="mx-2">
          <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Assignments</Link>
        </Col>

     <Row className="g-0">
      <Col lg={12} className="px-lg-4">

        {body ?
          <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
            initialState: {
              rowsPerPage: 15,
              options: [5, 10, 15, 20]
            }
          }}>
            <Row className="mb-4">
              <Col
                xs={12}
                lg={3}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Filter />

              </Col>
              <Col
                xs={12}
                sm={6}
                lg={5}
                className="d-flex flex-col justify-content-start align-items-start"
              >
                <PaginationOptions labels={labels} />
                <div style={{ "marginTop": "5px" }}>
                  <InfoPill left="Total Assignments" right={body?.length} />
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button className="btn-sm" variant="outline-primary" onClick={() => createAssignment()}>New Assignment</Button>
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
   </Main>
  );
};

export default AssignmentList;

