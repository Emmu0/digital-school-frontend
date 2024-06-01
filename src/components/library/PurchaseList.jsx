import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
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
import AddPurchase from "./AddPurchase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "../Confirm";

const PurchaseList = () => {
  const [body, setBody] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();
  const [statusRow, setStatusRow] = useState(undefined);

  const fetchRecords = async () => {
    const result = await schoolApi.getPurchasesRecords();
    if (result) {
      setBody(result);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusRow]);

  const labels = {
    beforeSelect: " ",
  };

  const header = [
    { title: "S.No.", prop: "serial", isFilterable: true },
    {
      title: "Book", prop: "book_title", isFilterable: true, cell: (row) => (
        <Link to={"/books/" + row.book_id} state={row}>
          {row.book_title}
        </Link>),
    },
    {
      title: "Supplier Name", prop: "supplier_name", isFilterable: true, cell: (row) => (
        <Link to={"/supplier/" + row.supplier_id} state={row}>
          {row.supplier_name}
        </Link>),
    },
    { title: "Quantity", prop: "quantity", isFilterable: true },
    {
      title: "Date",
      prop: "date",
      isFilterable: true,
      cell: (row) => (row.date ? moment(row.date).format("DD-MMM-YYYY") : ""),
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

  const addPurchase = () => {
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
    const editRecord = {
      id: statusRow?.id,
      classname: statusRow.classname,
      aliasname: statusRow.aliasname,
      status: statusRow?.status === "Active" ? "In Active" : "Active",
    };
    let response = {};
    response = await schoolApi.updateClassRecord(editRecord);
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
            Home <i className="fa-solid fa-chevron-right"></i>
            <strong> Purchase</strong>
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
                    <InfoPill left="Total Purchases " right={body?.length} />
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
                    onClick={() => addPurchase(true)}
                  >
                    Add Purchase
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
        <AddPurchase
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
export default PurchaseList;