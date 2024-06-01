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
import CreateSyllabusModel from "./CreateSyllabusModel";
import Confirm from "../Confirm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SyllabusList = () => {
  const [body, setBody] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [btnName, setBtnName] = useState("Save");
  const [syllabusData, setSyllabusData] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowDataId, setRowDataId] = useState();

  useEffect(() => {
    fetchAllSyllabus();
  }, []);

  async function fetchAllSyllabus() {
    const result = await schoolApi.getAllSyllabus();
    console.log("result======>", result);
    if (result !== "No Data Found") {
      setBody(result);
    } else {
      setBody([]);
    }
  }

  const handleEditButton = (row) => {
    setModalShow(true);
    setSyllabusData(row);
    setBtnName("Update");
  };

  const handleDeleteButton = (row) => {
    setShowDeleteModal(true);
    setRowDataId(row.id);
  };

  const header = [
    {
      title: "Class Name",
      prop: "class",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/syllabusview/" + row.id} state={row}>
          {row.class}
        </Link>
      ),
    },
    { title: "Section", prop: "section", isFilterable: true },
    { title: "Subject", prop: "subject", isFilterable: true },
    { title: "Status", prop: "isactive", isFilterable: true },
    {
      title: "Action",
      prop: "isactive",
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

  //   const activeRecord = (row) => {
  //     setConfirmModalShow(true);
  //     setRowRecords(row);
  // }

  const labels = {
    beforeSelect: " ",
  };

  const createSyllabus = () => {
    setModalShow(true);
    setSyllabusData("");
    setBtnName("Save");
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const handleDeleteSyllabusRecord = async () => {
    if (rowDataId) {
      try {
        const result = await schoolApi.deleteSyllabus(rowDataId);
        console.log("DelateSylabas==>", result);
        if (result && result.message === "Successfully Deleted") {
          const deleteSyllabus = body.filter((rec) => rec.id !== rowDataId);
          fetchAllSyllabus();
          toast.success(result.message, {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true
          });
          setBody(deleteSyllabus);
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
      {showDeleteModal && (
        <Confirm
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          handleDeleteButton={() => handleDeleteSyllabusRecord()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="deleteSyllabus"
        />
      )}

      <CreateSyllabusModel
        modalShow={modalShow}
        handleCloseModal={handleCloseModal}
        fetchAllSyllabus={fetchAllSyllabus}
        syllabusData={syllabusData}
        btnName={btnName}
      />

      {/* <Helmet><title>{props?.tabName}</title> </Helmet>
    <PageNavigations   colLg={2} colClassName="d-flex mx-4 " extrColumn={12}/> */}
      <Col lg={2} className="mx-2">
        <Link className="nav-link" to="/">
          Home <i className="fa-solid fa-chevron-right"></i> Syllabus
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
                    <InfoPill left="Total Students" right={body?.length} />
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
                    onClick={() => createSyllabus()}
                  >
                    New Syllabus
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

export default SyllabusList;
