import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import AddAuthor from "./AddAuthor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "../Confirm";

const AuthorLIst = () => {
  const [body, setBody] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();

  const fetchRecords = async () => {
    const result = await schoolApi.getAuthorsRecords();
    if (result) {
      const resultWithSerialNumbers = result?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));
      setBody(resultWithSerialNumbers);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const labels = {
    beforeSelect: " ",
  };

  const header = [
    { title: " #", prop: "serialNumber", isFilterable: false },
    {
      title: "Name", prop: "name", isFilterable: true, cell: (row) => (
        <Link to={"/author/" + row.id} state={row}>
          {row.name}
        </Link>
      ),
    },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Actions",
      prop: "id",
      cell: (row) => {
        return (
          <>
            <Button
              className="btn-sm mx-2"
              variant="primary"
              onClick={() => handleEdit(row)}
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

  const addAuthor = () => {
    setModalShow(true);
    setRowRecords([]);
  };

  const handleEdit = (row) => {
    setModalShow(true);
    setRowRecords(row);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    fetchRecords();
  };

  const handleDeleteButton = (row) => {
    setShowDeleteModal(true);
    setRowDataId(row.id);
  };

  const handleDeleteRecord = async () => {
    if (rowDataId) {
      try {
        const result = await schoolApi.deleteAuthor(rowDataId);
        if (result && result.message === "Successfully Deleted") {
          const deleteAuthor = body?.filter((rec) => rec.id !== rowDataId);
          PubSub.publish("RECORD_SAVED_TOAST", {
            title: "Record Deleted",
            message: "Record Deleted successfully",
          });
          setBody(deleteAuthor);
          setShowDeleteModal(false);
        } else {
          console.error("deletion was not successfull", result);
        }
      } catch (error) {
        console.error("Errror deleteing ", error);
      }
    }
  };

  return (
    <Main>
      <Row className="g-0">
        <Col lg={2} className="mx-4">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            <strong> Author</strong>
          </Link>
        </Col>
        <Col lg={12} className="p-lg-5">
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
                    <InfoPill left="Total Authors" right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-light"
                    variant="outline-primary"
                    onClick={() => addAuthor(true)}
                  >
                    Add Author
                  </Button>
                </Col>
              </Row>
              <Table striped className="data-table custom-table">
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

      {modalShow && (
        <AddAuthor
          show={modalShow}
          parent={rowRecords}
          onHide={() => setModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          handleDeleteButton={() => handleDeleteRecord()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="deleteSyllabus"
        />
      )}
      <ToastContainer />
    </Main>
  );
};
export default AuthorLIst;