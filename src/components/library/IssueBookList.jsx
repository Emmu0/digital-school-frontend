import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import {
  Button,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import schoolApi from "../../api/schoolApi";
import moment from "moment";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import AddIssueBook from "./AddIssueBook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "../Confirm";

const IssueBookList = () => {
  const [body, setBody] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();
  const [statusRow, setStatusRow] = useState(undefined);

  const fetchRecords = async () => {
    const result = await schoolApi.getIssuesRecords();
    if (result) {
      setBody(result);
    }
  };

  const handleEditStatus = async (val) => {
    setStatusRow(val);
  };

  useEffect(() => {
    fetchRecords();
  }, [statusRow]);

  const labels = {
    beforeSelect: " ",
  };
  const header = [
    {
      title: "Issue Number", prop: "book_issue_num", isFilterable: true, cell: (row) => (
        <Link to={"/issue_book/" + row.id} state={row}>
          {row.book_issue_num}
        </Link>
      ),
    },
    {
      title: "Name",
      prop: "parent_name",
      isFilterable: true,
    },
    { title: "Registration Id", prop: "parent_eid", isFilterable: true },
    {
      title: "Book", prop: "book_title", isFilterable: true,
      cell: (row) => (
        <Link to={"/books/" + row.book_id} state={row}>
          {row.book_title}
        </Link>
      ),
    },
    {
      title: "Checkout Date",
      prop: "checkout_date",
      isFilterable: true,
      cell: (row) =>
        row.checkout_date
          ? moment(row.checkout_date).format("DD-MMM-YYYY")
          : "",
    },
    {
      title: "status",
      prop: "id",
      cell: (row) => {
        const handleStatusChange = (status) => {
          handleEditStatus({ ...row, status });
        };

        let currentStatus = "";
        let variant = "";

        if (row.status === "Issued") {
          currentStatus = "Issued";
          variant = "info";
        } else if (row.status === "Returned") {
          currentStatus = "Returned";
          variant = "outline-secondary";
        } else {
          currentStatus = "Missing";
          variant = "secondary";
        }
        return (
          <DropdownButton
            id="dropdown-status"
            title={currentStatus}
            variant={variant}
            size="sm"
            disabled={row.status === "Returned"}
            className='select-dropdown-btn'
          >
            <Dropdown.Item onClick={() => handleStatusChange("Issued")}>
              Issued
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("Returned")}>
              Returned
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("Missing")}>
              Missing
            </Dropdown.Item>
          </DropdownButton>
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

  const addIssueBook = () => {
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

  const classListHandler = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${date}`;
    const editRecord = {
      id: statusRow?.id,
      book_id: statusRow.book_id,
      parent_id: statusRow.parent_id,
      parent_type: statusRow.parent_type,
      checkout_date: statusRow.checkout_date,
      due_date: statusRow.due_date,
      remark: statusRow.remark,
      return_date: formattedDate,
      status: statusRow.status,
    };
    let response = {};
    response = await schoolApi.updateIssue(editRecord);
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
            <strong> Issue Book</strong>
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
                    <InfoPill left="Total Issues" right={body?.length} />
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
                    onClick={() => addIssueBook(true)}
                  >
                    Issue Book
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
        <AddIssueBook
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
          title={`Confirm ${statusRow.status}`}
          message="You are going to update the status. Are you sure?"
          table="classList"
        />
      )}
      <ToastContainer />
    </Main>
  );
};
export default IssueBookList;