/**
 * @author: Abdul Pathan
 */

import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader
} from 'react-bs-datatable';
import { Link, useNavigate } from "react-router-dom";

import AddSection from "./AddSection";
import ActiveandIncative from "./ActiveandIncative";

const SectionList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [addModalShow, setAddModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState([]);
  const [showModalShow, setShowModalShow] = useState(false);

  const sectionRecords = async () => {
    const result = await schoolApi.getSectionRecords();
    console.log('result==>', result);
    if (result) {
      setBody(result);
      console.log('result22222', result)
    } else {
      setBody([]);
    }
  }

  useEffect(() => {
    // async function init() {
    sectionRecords();
    console.log('object')
    // }
    // init();
  }, []);

  const promoteHandler = (obj) => {
    navigate("/promotion", { state: obj });
  };

  // Create table headers consisting of 4 columns.
  const header = [

    {
      title: 'Class Name', prop: 'class_name', isFilterable: true,
      cell: (row) => (<Link to={"/section/" + row.section_id} state={row} > {row.class_name}  </Link>)
    },
    { title: 'Section Name', prop: 'section_name', isFilterable: true, },
    { title: 'Strength', prop: 'strength' },
    { title: 'Class Teacher', prop: 'contact_name', isFilterable: true, },
    {
      title: 'Actions',
      prop: 'id',
      isFilterable: true,
      cell: (row) => {
        let myBoolean = row.isactive === true ? "Active" : "Inactive";
        return (
          <>
            <Button className="btn-sm mx-2" variant="primary" onClick={() => handleEdit(row)}>
              <i className="fa-regular fa-pen-to-square"></i>
            </Button>

            <Button className="btn-sm mx-2" style={{ width: '80px' }} variant={myBoolean === 'Active' ? "success" : 'danger'} onClick={() => acctiveRecord(row)} >
              {myBoolean}
            </Button>
          </>
        );
      },
    },
    {
      title: "",
      prop: "",
      isFilterable: true,
      cell: (row) => {
        return (
          <>
            <Button
              className="btn-sm mx-2"
              variant="outline-warning"
              onClick={() => promoteHandler(row)}
            >
              Promote
            </Button>
          </>
        );
      },
    },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " "
  }
  //acctive/Inactive Record
  const acctiveRecord = (row) => {
    // console.log('row===>',row);
    setShowModalShow(true);
    setRowRecords(row);
  }
  //add Section
  const addSection = () => {
    setAddModalShow(true);
    setRowRecords([]);
  }
  //edit section
  const handleEdit = (row) => {
    console.log('handleEdit@@@=>', row);
    setAddModalShow(true);
    setRowRecords(row);
  }

  return (
    <Main>

      <Row className="g-0">


        {/* <Col lg={5} className="mx-4">
                    <Link className="nav-link" to="/">Home <i className="fa-solid fa-chevron-right"></i> Subjects
                    </Link>
                </Col> */}

        <Col lg={12} className="p-lg-5" style={{ marginTop: "-23px" }}>
          <Col lg={2} className="mx-4">
            <Link className="nav-link" to="/"> Home <i className="fa-solid fa-chevron-right"></i>Sections </Link>
          </Col>
          {body ?
            <DatatableWrapper
              body={body}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 15,
                  options: [5, 10, 15, 20]
                }
              }}>

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
                  lg={5}
                  className="d-flex flex-col justify-content-start align-items-start"
                >
                  <PaginationOptions labels={labels} />
                  <div style={{ "marginTop": "5px" }}>
                    <InfoPill left="Total Classes " right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Button variant="outline-primary" onClick={addSection}>Add Section</Button>
                </Col>
              </Row>
              <Table striped className="data-table custom-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
        </Col>
        <Col lg={2}></Col>
      </Row>



      {addModalShow && (
        <AddSection
          show={addModalShow}
          parent={rowRecords}
          onHide={() => setAddModalShow(false)}
          sectionRecords={sectionRecords}
        // table="section"
        />
      )}

      {showModalShow && (
        <ActiveandIncative
          show={showModalShow}
          parent={rowRecords}
          onHide={() => setShowModalShow(false)}
          title="Confirm Active?"
          message="You are going to active the record. Are you sure?"
          table="section"
        />
      )}
    </Main>
  );
};

export default SectionList;