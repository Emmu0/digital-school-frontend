import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from "react-bs-datatable";
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const StudentAddmissionList = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [students, setStudents] = useState();
  useEffect(() => {
    async function init() {
      let student_id=null;
      const result = await schoolApi.fetchStudentAddmission(student_id);
      console.log('addmission result-->', result);
      if (result) {
        setBody(result);
        setStudents(result);
      } else {
        setBody([]);
        setStudents([]);
      }
    }
    init();
  }, []);

  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(students);
    } else {
      setBody(
        students.filter((data) => {
          if (
            (data.recordtypeid || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
          if (
            (data.location || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
          if ((data.city || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
        })
      );
    }
  };

  // Create table headers
  const header = [
    // {
    //   title: "Form No",
    //   prop: "formno",
    //   isFilterable: true,
    //   cell: (row) => (
    //     <Link to={"/studentaddmissions/" + row.id} state={row}>
    //       {row.formno}
    //     </Link>
    //   ),
    // },
    {
      title: "Student Name", prop: "studentname", isFilterable: true,
      cell: (row) => (
        <Link to={"/studentaddmissions/" + row.student_addmission_id} state={row}>
          {row.studentname}
        </Link>
      ),
    },
    { title: "Class Name", prop: "classname", isFilterable: true },
    { title: "Phone", prop: "phone", isFilterable: true },
    { title: "Email", prop: "email", isFilterable: true },
    { title: "Date Of Birth", prop: "dateofbirth", isFilterable: true },
  ];

  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createStudentAddmission = () => {
    navigate(`/student/e`);
  };

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <Col lg={5} className="mx-4">
        <Link className="nav-link" to="/">
          Home <i className="fa-solid fa-chevron-right"></i>
          <strong> StudentsAddmission</strong>
        </Link>
      </Col>
      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          {body ?
            (<DatatableWrapper body={body} headers={header} paginationOptionsProps={{
              initialState: {
                rowsPerPage: 15,
                options: [5, 10, 15, 20]
              }
            }}>
              <Row className="mb-4">
                <Col
                  xs={12}
                  lg={2}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>
                <Col
                  xs={12}
                  sm={5}
                  lg={6}
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
                  className="mb-2 d-flex flex-col justify-content-end align-items-end"
                >
                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    onClick={() => createStudentAddmission(true)}
                  >
                    New Admission
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
    </Main>
  );
};

export default StudentAddmissionList;
