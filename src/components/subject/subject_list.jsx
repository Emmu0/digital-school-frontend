/* eslint-disable no-unused-vars */
// @author: Pathan
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
// import { PlusSquare } from "react-bootstrap-icons";
import schoolApi from "../../api/schoolApi.jsx";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill.jsx";
import Confirm from "../Confirm.jsx";
import { Link } from "react-router-dom";
import Main from "../layout/Main.jsx";
import AddSubject from "./add_subject.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//=======================  Add Aamir khan import files Code Start  =============================
import { MdFilterAlt } from "react-icons/md";
import FilterComponent from "./filter_component.jsx";
import { MdFilterList as FilterListIcon } from "react-icons/md";


//=======================  Add Aamir khan import files Code End  =============================

import {
  DatatableWrapper,
  Filter,
  PaginationOptions,
  TableBody,
  TableHeader,
  Pagination,
} from "react-bs-datatable";
import { Label } from "reactstrap";
import { IconButton } from "@mui/material";

const SubjectList = () => {

  //=====================  Add by Aamir khan useState Code Start ===================================
  const [addSearchRecShow, setAddSearchRecShow] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [flaterData, setflaterData] = useState({});
  const [rowRecords, setRowRecords] = useState([]);
  const [optionnames, setOptionNames] = useState([]);
  const [colSize, setColSize] = useState({ tableSize: 12, filterSize: 0 });
  const [isFilter, setIsFilter] = useState(false);
  const [filterRecords, setFilterRecords] = useState({
    name: "",
    status: "",
    type: "",
  });
  const [varValue, setVarValue] = useState([]); 

   //=====================  Aamir khan useState Code End ===================================
  
  const [body, setBody] = useState([]);
  // const [deleteModalShow, setDeleteModalShow] = useState(false);  //Coment By Aamir khan
  const [addModalShow, setAddModalShow] = useState(false);
  const [rowData, setRowData] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [addModalFilterShow, setAddModalFilterShow] = useState(false);
 

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const [isHidden, setIsHidden] = useState(false); //Add By Aamir khan


  const delayedGetData = debounce(async (text) => {
    await getData(text);
  }, 900); // Adjust the delay as needed

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    delayedGetData(event.target.value);
  };

  const getData = async (text) => {
    try {
      const result = await schoolApi.getSubjectRecordName(text);

      console.log("result data==>", result);

      if (result !== undefined) {
        setBody(result);
      } else {
        setBody([]); // Set a default value
      }
      // setSearchResults(result);
    } catch (error) {
      console.error("Error fetching subject records:", error);
    }
  };

  console.log("filterRecords-->", filterRecords);

  const fetchSubjectRecords = async () => {
    console.log("Colling this");
    const result = await schoolApi.getSubjectRecord();
    console.log("@#SubRecData=>", result);
    //=============== Add by Aamir khan Code Start=================
    const extractedFields = {
      name: result.name,
      shortname: result.shortname,
      status: result.status,
      type: result.type,
    };
    //===============  Aamir khan Code End=================

    result.map((res) => {
      setOptionNames((prevVal) => [
        ...prevVal,
        { value: res.id, label: res.name },
      ]);
    });
    console.log("extractedFields :", extractedFields);
    if (result) {
      setBody(result);
    }
  };

  console.log("rowDataRec==>", rowData);

  useEffect(() => {
    fetchSubjectRecords();
  }, []);

  console.log("optionnames-->", optionnames);

  //============================ Add By Aamir khan Code Start =======================
  const toggleStatus = (row) => {
    setUpdateStatus(true);
    setRowRecords(row);
  };
  //============================ Aamir khan Code End ================================

  //============================ Add By Aamir khan changeStatus Code Start ===================================
  const changeStatus = async () => {
    console.log("enter----------------------->", rowRecords);
    if (rowRecords.status === "Active") {
      rowRecords.status = "InActive";
    } else {
      rowRecords.status = "Active";
    }
    const result = await schoolApi.updateSubjectRecord(rowRecords);
    console.log("result after status change", result);

    if (result) {
      setUpdateStatus(false);
    }
  };
  //============================ Add By Aamir khan changeStatus Code End ===================================

  //Table headers
  const header = [
    {
      title: "Subject Name",
      prop: "name",
      isFilterable: true,
    },
    { title: "Short Name", prop: "shortname", isFilterable: true }, // Add by Aamir khan
    // { title: "Category", prop: "category", isFilterable: true },  Comant by Aamir khan
    { title: "Type", prop: "type", isFilterable: true },
    {
      title: "Actions",
      prop: "id",
      cell: (row) => (
        <>
          <Button
            className="btn-sm mx-2"
            variant="primary"
            onClick={() => handleUpdate(row)}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </Button>

          {/* Coment by Aamir khan */}

          {/* <Button
            className="btn-sm mx-2"
            variant="danger"
            onClick={() => handleDelete(row)}
          >
            <i className="fa-regular fa-trash-can"></i>
          </Button> */}
        </>
      ),
    },
    //=============================Add By Aamir khan Status Code Start===========================
    {
      title: "Status",
      prop: "status",
      isFilterable: true,
      cell: (row) => (
        <Button
          className="btn-sm mx-2"
          style={{ width: "80px" }}
          variant={row.status === "Active" ? "success" : "danger"}
          onClick={() => toggleStatus(row)}
        >
          {row.status}
        </Button>
      ),
    },

    //=============================Aamir khan Status Code End===========================
  ];

  const addSubjectRecord = () => {
    setAddModalShow(true);
    setRowData([]);
  };

//============================ Add By Aamir khan Method Code Start ======================
  const addSub = () => {
    
    setAddSearchRecShow(!addSearchRecShow);
    setIsFilter(!isFilter);
    if (!addSearchRecShow) {
      setColSize({ tableSize: 9, filterSize: 3 });
    } else {
      console.log("ElsePart-->", isFilter);
      setColSize({ tableSize: 12, filterSize: 0 });
    }
    setRowData([]);
  };
//============================ Aamir khan Method Code End ======================  

  //Add by Aamir khan
  // const recordSavedFilterSuccessfully = () => {
  //   setAddModalFilterShow(false);
  //   fetchSubjectRecords();
  // };

  //editModelShow
  const handleUpdate = async (row) => {
    console.log("Subject Row==>", row);
    setAddModalShow(true);
    setRowData(row);
  };

  //delete record
  const handleDelete = (row) => {
    // setDeleteModalShow(true);
    // setDeleteRecord(row);
    setRowData(row);
  };

  const deleteSubjectRecord = async () => {
    if (rowData) {
      const result = await schoolApi.deleteSubjectRecord(rowData.id); //delete subject record
      console.log("result==>", result);
      if (result.success) {
        //setDeleteModalShow(false);
        fetchSubjectRecords();
      } else {
        toast.error(result.message, { position: toast.POSITION.TOP_RIGHT });
      }
    }
  };

  // Note that the fields are all using the `prop` field of the headers.
  const labels = { beforeSelect: " " };

  const recordSavedSuccessfully = () => {
    setAddModalShow(false);
    fetchSubjectRecords();
  };

  //Add by Aamir khan handlefilter method
  const handlefilter = async (event) => {
    event.preventDefault();
    const text = event.target.value;
    setflaterData({
      ...flaterData,
      [event.target.name]: event.target.value,
    });

    console.log("text==>", text);
    // const result = await schoolApi.getSubjectRecordName(text);
    // console.log("result Datat-->", result);
    // if (result) {
    //   setBody(result);
    // }
    const { name, value } = event.target;
    setFilterRecords((prevRecords) => ({
      ...prevRecords,
      [name]: value,
    }));
  };

  //Add by Aamir khan
  const handleFilterClick = () => {
    // Handle filter button click event here
    console.log("Filter button clicked");
  };

  //Add by Aamir khan
  const FilterIconButton = ({ onClick }) => {
    return (
      <IconButton onClick={onClick} color="primary">
        <FilterListIcon />
      </IconButton>
    );
  };

  console.log("isFilter-->", isFilter);

  //Add By Aamir khan SearchButton
  // const SearchButton = async () => {
  //   const result = await schoolApi.getSubjectRecordName(flaterData);
  //   if (result) {
  //     setBody(result);
  //   }
  // };

  return (
    <Main>
      {/*======================== Add By Aamir khan Model Code Start ====================== */}
      {updateStatus && (
        <Confirm
          show={updateStatus}
          onHide={() => setUpdateStatus(false)}
          changeStatus={changeStatus}
          title={`Confirm ${
            rowRecords?.status == "Active" ? "in Active" : "Active"
          } ?`}
          message="You are going to update the status. Are you sure?"
          table="exam_title_status_update"
        />
      )}

      {/*======================== Add By Aamir khan Model Code End ====================== */}

      <Row className="g-0">
        {addModalShow && (
          <AddSubject
            show={addModalShow}
            parent={rowData}
            onHide={() => setAddModalShow(false)}
            recordSavedSuccessfully={recordSavedSuccessfully}
          />
        )}

        {/* {addModalFilterShow && (
          <FilterRecords
            show={addModalFilterShow}
            componentname= "subjects"
            onHide={() => setAddModalFilterShow(false)}
            recordSavedSuccessfully={recordSavedFilterSuccessfully}
          />
        )} */}

        {/* MODAL END */}

        {/* TABLE START */}
        {/* ====== Add by Aamir khan Code Start =====*/}
        <Col lg={12} className="p-lg-5">
          {body ? (
            //======== Aamir khan Code End    ===========
            <DatatableWrapper
              body={body}
              headers={header}
              rowIndexColumn
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 10,
                  options: [5, 10, 15, 20],
                },
              }}
            >
              <Col lg={5} className="mx-4" style={{marginRight:"90px"}}>
                <Link className="nav-link" to="/" >
                  Home <i className="fa-solid fa-chevron-right"></i> Subjects
                </Link>
              </Col>
              <Row className="mb-4">
                <Col
                  xs={12}
                  sm={6}
                  lg={3}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>

                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-start align-items-start"
                >
                  <PaginationOptions labels={labels} />
                  <div style={{ marginTop: "5px" }}>
                    <InfoPill left="Total Subject " right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={5}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn"
                    variant="outline-primary"
                    onClick={addSubjectRecord}
                  >
                    Add Subject
                  </Button>
                  {/* ================= Add MdFilterAlt Button Code Start============================ */}
                  <Button
                    className="btn"
                    variant="outline-secondary"
                    onClick={addSub}
                    style={{ marginTop: "18px", marginLeft: "10px" }}
                  >
                    <span className="d-inline-flex align-items-center">
                      <MdFilterAlt
                        style={{
                          marginRight: "0px",
                          paddingTop: "2px",
                          fontSize: "15px",
                        }}
                      />
                    </span>
                  </Button>
                  {/* ================= Aamir khan MdFilterAlt Button Code End============================ */}
                </Col>
              </Row>

              {/* ================= Add Aamir khan Subject List And Model  Code Start============================ */}
              <Row>
                <Col lg={`${colSize.tableSize}`}>
                  <Table
                    striped
                    className="data-table custom-table-subject-list"
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                  <Pagination />
                </Col>
                {console.log("Subject_List")}
                <Col lg={colSize.filterSize}>
                  {addSearchRecShow && (
                    <FilterComponent
                      show={addSearchRecShow}
                      parent={rowData}
                      onHide={() => setAddSearchRecShow(false)}
                      setBody={setBody}
                      // recordSavedSuccessfully={recordSavedSuccessfully}
                    />
                  )}
                </Col>
              </Row>
              {/* ================= Add Aamir khan Subject List And Model  Code End============================ */}
            </DatatableWrapper>
          ) : (
            //  ================  Add by Aamir khan Code Start ===============================
            <ShimmerTable row={10} col={8} />
          )}
          {/* ================  Add by Aamir khan Code End ===============================               */}
        </Col>
      </Row>

      <ToastContainer />
    </Main>
  );
};

export default SubjectList;
