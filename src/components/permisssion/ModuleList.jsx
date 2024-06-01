import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import InfoPill from "../InfoPill";
import { ShimmerTable } from "react-shimmer-effects";
import schoolApi from "../../api/schoolApi";
import CreateModuleModal from "./CreateModuleModal";
import PubSub from "pubsub-js";
import Confirm from "../Confirm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authApi from "../../api/authApi";

const ModuleList = () => {
  const [body, setBody] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [btnName, setBtnName] = useState("Save");
  const [moduleData, setModuleData] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();

  useEffect(() => {
    fetchAllModules();
  }, []);

  async function fetchAllModules() {
    if (authApi.companyDetail().companyid) {
      const result = await schoolApi.getAllModules(authApi.companyDetail().companyid);
      console.log("result======???????----->", result);
      if (result !== 'No Data Found') {
        setBody(result);
      } else {
        setBody([]);
      }
    }
  }

  const handleEditButton = (row) => {
    setModalShow(true);
    setModuleData(row);
    setBtnName("Update");
  };

  const handleDeleteButton = (row) => {
    setShowDeleteModal(true);
    setRowDataId(row.id);
  };

  const header = [
    { title: "Name", prop: "name", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Action",
      prop: "",
      isFilterable: true,
      cell: (row) => {
        return (
          <>
            <Button
              className="btn-sm mx-2"
              variant="primary"
              onClick={() => handleEditButton(row)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>
            <button
              className="btn btn-sm btn-danger mx-2"
              onClick={() => handleDeleteButton(row)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        );
      },
    },
  ];

  const labels = {
    beforeSelect: " ",
  };

  const handleDeleteModuleRecord = async () => {
    if (rowDataId) {
      try {
        const result = await schoolApi.deleteModule(rowDataId);
        console.log("Result after deletion:", result);

        if (result && result.message === "module deleted successfully") {
          const deleteModule = body.filter((rec) => rec.id !== rowDataId);
          console.log("Updated body after deletion:", deleteModule);
          fetchAllModules();
          toast.success(result.message, {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true
          });
          // PubSub.publish('RECORD_SAVED_TOAST', {
          //   title: 'Record Deleted',
          //   message: 'Record Deleted successfully'
          // });

          // setBody(deleteModule);
          setShowDeleteModal(false);
        } else {
          console.error("deletion was not successful", result);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          toast.error(error.response.data.errors);
        } else {
          toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
        }
      }
    }
  };

  const createModule = () => {
    setModalShow(true);
    setModuleData("");
    setBtnName("Save");
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const [paginationOptions, setPaginationOptions] = useState({
    rowsPerPage: 5,
    options: [5, 10, 15, 20],
  });

  const handlePaginationChange = (newPaginationOptions) => {
    setPaginationOptions(newPaginationOptions);
  };
  return (
    <Main>
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          handleDelete={() => handleDeleteModuleRecord()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="deleteModule"
        />
      )}

      <CreateModuleModal
        modalShow={modalShow}
        handleCloseModal={handleCloseModal}
        fetchAllModules={fetchAllModules}
        moduleData={moduleData}
        btnName={btnName}
      />


      <Col lg={2} className="mx-2">
        <Link className="nav-link" to="/">
          Home <i className="fa-solid fa-chevron-right"></i> Module
        </Link>
      </Col>

      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          {body ? (
            <DatatableWrapper
              body={body ? body : ""}
              headers={header}
              paginationOptionsProps={{
                initialState: paginationOptions,
                onChange: handlePaginationChange,
              }}
            >
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
                  <div style={{ marginTop: "5px" }}>
                    <InfoPill left="Total Modules" right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    onClick={() => createModule()}
                  >
                    New Module
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
            <ShimmerTable row={10} col={8} />
          )}
        </Col>
        <Col lg={2}></Col>
      </Row>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </Main>
  );
};

export default ModuleList;
