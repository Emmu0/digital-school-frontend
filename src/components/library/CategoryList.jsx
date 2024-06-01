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
import AddCategory from "./AddCategory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "../Confirm";

const CategoryList = () => {
  const [body, setBody] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();
  const [moreLess, setMoreLess] = useState(0);
  const fetchRecords = async () => {
    const result = await schoolApi.getCategoryRecords();
    if (result) {
      setBody(result);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const labels = {
    beforeSelect: " ",
  };

  function handleShowLess(id) { setMoreLess(id) }

  const header = [
    {
      title: "Name",
      prop: "name",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/category/" + row.id} state={row}>
          {row.name}
        </Link>
      ),
    },
    {
      title: "Description",
      prop: "description",
      isFilterable: true,
      cell: (row) => {
        const isCheck = row.id === moreLess;
        return (<>
          {isCheck ? (row.description) : (row.description.substring(0, 100))}
          {isCheck ? (<span onClick={() => handleShowLess(0)}> Show Less</span>) : row.description.length > 100 ? (<span onClick={() => handleShowLess(row.id)}> ...Show More</span>) : ''}
        </>)
      }
    }
    ,

    {
      title: "Action",
      prop: "id",
      cell: (row) => {
        return (
          <div style={{ whiteSpace: "nowrap" }}>
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
          </div>
        );
      },
    },

  ];

  const addCategory = () => {
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
        const result = await schoolApi.deleteCategory(rowDataId);
        if (result && result.message === "Successfully Deleted") {
          const deleteCategory = body?.filter((rec) => rec.id !== rowDataId);
          PubSub.publish("RECORD_SAVED_TOAST", {
            title: "Record Deleted",
            message: "Record Deleted successfully",
          });
          setBody(deleteCategory);
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
            Home <i className="fa-solid fa-chevron-right"></i>
            <strong> Category</strong>
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
                    <InfoPill left="Total Categories" right={body?.length} />
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
                    onClick={() => addCategory(true)}
                  >
                    Add Category
                  </Button>
                </Col>
              </Row>
              <Table striped className="data-table custom-table categoryList">
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
        <AddCategory
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
export default CategoryList;