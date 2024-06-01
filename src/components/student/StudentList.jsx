import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from 'moment';
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import Confirm from "../Confirm";
import PubSub from "pubsub-js";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const StudentList = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();
  const navigate = useNavigate();
  const [leads, setLeads] = React.useState([]);
  const [body, setBody] = useState();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const result = await schoolApi.fetchlead();
    if (result) {
      setBody(result);
      setLeads(result);
    } else {
      setBody([]);
      setLeads([]);
    }
  }

  const handleEditButton = (row) => {
    console.log('row=======>', row);
    navigate(`/studentenquiry/${row.id}/e`, { state: row });
  };

  const handleDeleteButton = (row) => {
    console.log("Curent Row", row);
    if (row.id && (row.status === "Registered")) {
      toast.error("Record is registered, you can't delete this record!", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored",
        hideProgressBar: true
      });
    } else {
      setShowDeleteModal(true);
      setRowDataId(row);
    }
  };

  const handleDeleteModuleRecord = async () => {
    console.log("handleDeleteModuleRecord =>", rowDataId);
    if (rowDataId) {
      console.log("rowDataId===>", rowDataId);
      try {
        console.log("rowDataId ??????????=>", rowDataId);
        if (rowDataId.id && rowDataId.status === 'Not Registered') {
          const result = await schoolApi.deletelead(rowDataId.id);
          console.log("Data Result after deletion:", result);
          if (result && result.message === "Successfully Deleted") {
            const deleteStudent = body.filter((rec) => rec.id !== rowDataId.id);
            init();
            toast.success(result.message, {
              position: toast.POSITION.TOP_CENTER,
              hideProgressBar: true
            });
            setBody(deleteStudent);
            setShowDeleteModal(false);
          } else {
            console.error("deletion was not successful");
          }
        }
      } catch (error) {
        console.log('Delate==>', error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          toast.error(error.response.data.errors);
        } else {
          toast.error("Unknown error occurred. Please try again.", {
            style: { backgroundColor: "#f7040f", color: "white" },
          });
        }
      }
    }
  };


  const handleReg = async (row) => {
    if(row.status === 'Registered'){
      toast.error('Lead is already regiestered!!!');
    }else{
      navigate(`/student/e`,{state:row});
    }
  };

  const onFilterType = (event) => {
    if (event.target.value === '') {
      console.log('inside the ifff');
      setBody(leads);
    } else {
      console.log('inside the elsee');
      setBody(
        leads.filter((data) => {
          if ((data.recordtype || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
          if ((data.location || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
          if ((data.religion || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
        })
      );
    }
  };


  const header = [
    {
      title: 'Student Name', prop: 'firstname', isFilterable: true,
      cell: (row) => (
        <Link
          to={"/students/" + row.id}
          state={row}
        >
          {row.firstname + ' ' + row.lastname}
        </Link>
      )
    },
    { title: "classname", prop: "classname", isFilterable: true },
    { title: "Phone", prop: "phone", isFilterable: true },
    { title: "Email", prop: "email", isFilterable: true },
    { title: "Address", prop: "address", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Action",
      prop: "isactive",
      isFilterable: true,
      cell: (row) => {
        return (
          <>
            <button
              className="btn btn-sm btn-danger mx-2"
              onClick={() => handleDeleteButton(row)}
            >
              <i className="fa fa-trash"></i>
            </button>
            <Button
              className="btn-sm mx-2"
              variant="primary"
              onClick={() => handleEditButton(row)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
            <Button
              className="btn-sm mx-2"
              variant="primary"
              onClick={() => handleReg(row)}
            >
              Registration
            </Button>
          </>
        );
      },
    },
  ];

  const labels = {
    beforeSelect: " "
  }

  const createStudent = () => {
    console.log('createStudent list');
    navigate(`/studentenquiry`);
  }

  return (
    <Main>
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          deleteLead={() => handleDeleteModuleRecord()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="lead"
        />
      )}
      <Row className="g-0">
        <Col lg={5} className="mx-4">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>
            <strong> StudentsEnquiry</strong>
          </Link>
        </Col>

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
                  sm={5}
                  lg={5}
                  className="d-flex flex-col justify-content-start align-items-start"
                >
                  <Form.Group className="mt-4 mx-3" controlId="formBasicStatus">
                    <Form.Select aria-label="Enter status" name="religion" onChange={onFilterType}>
                      <option value="">--Select Religion--</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Jain">Jain</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                  <PaginationOptions labels={labels} />
                  <div style={{ "marginTop": "5px" }} >
                    <InfoPill left="Total Students" right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="mb-2 d-flex flex-col justify-content-end align-items-end"
                >
                  <Button className="btn-sm" variant="outline-primary" onClick={() => createStudent(true)} >New Student</Button>
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
      <ToastContainer />
    </Main>
  );
};

export default StudentList;
