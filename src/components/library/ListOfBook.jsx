import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import AddBook from "./AddBook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "../Confirm";

const ListOfBook = () => {
  const [body, setBody] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();
  const [statusRow, setStatusRow] = useState(undefined);

  const fetchBookRecords = async () => {
    const result = await schoolApi.getBooksRecords();
    if (result) {
      setBody(result);
    }
  };

  useEffect(() => {
    fetchBookRecords();
  }, [statusRow]);

  const statusHandler = (val) => {
    setStatusRow(val);
  };

  const labels = {
    beforeSelect: " ",
  };

  const header = [
    {
      title: "Name",
      prop: "title",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/books/" + row.id} state={row}>
          {row.title}
        </Link>
      ),
    },
    { title: "Book Number", prop: "isbn", isFilterable: true },
    { title: "Author", prop: "author_name", isFilterable: true },
    { title: "Category", prop: "category_name", isFilterable: true },
    { title: "Language", prop: "language_name", isFilterable: true },
    { title: "Copies", prop: "total_copies", isFilterable: true },
    { title: "Issued", prop: "issued", isFilterable: true },
    { title: "Available", prop: "available", isFilterable: true },
    {
      title: "status",
      prop: "id",
      cell: (row) => {
        let myBoolean = row.status === "Active" ? "Active" : "In Active";
        return (
          <Button
            className="btn-sm mx-2"
            onClick={() => statusHandler(row)}
            style={{ width: "80px" }}
            variant={myBoolean === "Active" ? "success" : "danger"}
          >
            {myBoolean}
          </Button>
        );
      },
    },
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
          </>
        );
      },
    },
  ];

  const addBook = () => {
    setModalShow(true);
    setRowRecords([]);
  };

  const handleEdit = (row) => {
    setModalShow(true);
    setRowRecords(row);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    fetchBookRecords();
  };

  const classListHandler = async () => {
    const editRecord = {
      id: statusRow?.id,
      title: statusRow?.title,
      author_id: statusRow?.author_id,
      isbn: statusRow?.isbn,
      category_id: statusRow?.category_id,
      publisher_id: statusRow?.publisher_id,
      publish_date: statusRow?.publish_date,
      language_id: statusRow?.language_id,
      status: statusRow?.status === "Active" ? "In Active" : "Active",
    };
    let response = {};
    response = await schoolApi.updateBookRecord(editRecord);
    if (response.success) {
      toast.success(response.message, { position: toast.POSITION.TOP_RIGHT });
      setStatusRow(undefined);
    } else {
      toast.error(response.message, { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <Main>
      <Row className="g-0">
        <Col lg={2} className="mx-4">
          <Link className="nav-link" to="/">
            Home <i className="fa-solid fa-chevron-right"></i>{" "}
            <strong> Books</strong>
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
                    <InfoPill left="Total Books " right={body?.length} />
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
                    onClick={() => addBook(true)}
                  >
                    Add Book
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
        <AddBook
          show={modalShow}
          parent={rowRecords}
          onHide={() => setModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
      {statusRow && (
        <Confirm
          show={statusRow}
          onHide={() => setStatusRow(undefined)}
          changeClassStatus={classListHandler}
          title={`Confirm ${statusRow?.status === "Active" ? "In Active ?" : "Active ?"
            }`}
          message="You are going to update the status. Are you sure?"
          table="classList"
        />
      )}
      <ToastContainer />
    </Main>
  );
};
export default ListOfBook;