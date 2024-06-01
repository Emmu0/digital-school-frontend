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
import CreateRoleModal from "./CreateRoleModal";
import PubSub from "pubsub-js";
import Confirm from "../Confirm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoleList = () => {
  const [body, setBody] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [btnName, setBtnName] = useState("Save");
  const [roleData, setRoleData] = useState();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();

  useEffect(() => {
    fetchAllRoles();
  }, []);

  async function fetchAllRoles() {
    const result = await schoolApi.getAllRoles();
    console.log("result======>", result);
    if (result !== 'No Data Found') {
      setBody(result);
    } else {
      setBody([]);
    }
  }

  const handleEditButton = (row) => {
    setModalShow(true);
    setRoleData(row);
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

  const createRole = () => {
    setModalShow(true);
    setRoleData("");
    setBtnName("Save");
  };

  const handleDeleteRoleRecord = async () => {
    if (rowDataId) {
      try {
        const result = await schoolApi.deleteRoles(rowDataId);
        console.log("Result after deletion:", result);

        if (result && result.message === "Role deleted successfully") {
          const deleteRole = body.filter((rec) => rec.id !== rowDataId);
          console.log("Updated body after deletion:", deleteRole);
          fetchAllRoles();
          // PubSub.publish('RECORD_SAVED_TOAST', {
          //   title: 'Record Deleted',
          //   message: 'Record Deleted successfully'
          // });
          toast.success(result.message, {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true
          });
          setBody(deleteRole);
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

  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <Main>
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          handleDelete={() => handleDeleteRoleRecord()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="deleteRole"
        />
      )}

      <CreateRoleModal
        modalShow={modalShow}
        handleCloseModal={handleCloseModal}
        fetchAllRoles={fetchAllRoles}
        roleData={roleData}
        btnName={btnName}
      />


      <Col lg={2} className="mx-2">
        <Link className="nav-link" to="/">
          Home <i className="fa-solid fa-chevron-right"></i> Role
        </Link>
      </Col>

      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          {body ? (
            <DatatableWrapper
              body={body ? body : ""}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 15,
                  options: [5, 10, 15, 20],
                },
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
                    <InfoPill left="Total Roles" right={body?.length} />
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
                    onClick={() => createRole()}
                  >
                    New Role
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

export default RoleList;
