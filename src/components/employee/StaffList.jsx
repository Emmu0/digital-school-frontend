import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const StaffList = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [contacts, setContacts] = useState();
  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchStaffContacts();
      if (result) {
        setBody(result);
        setContacts(result);
        console.log('@@ contact records', body);
      } else {
        setBody([]);
        setContacts([]);
      }
    }
    init();
  }, []);


  const onFilterType = (event) => {
    if (event.target.value === "") {
      setBody(contacts);
    } else {
      setBody(
        contacts.filter((data) => {
          if (
            (data.recordtype || "").toLowerCase() ===
            (event.target.value || "").toLowerCase()
          ) {
            return data;
          }
        })
      );
    }
  };

  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: "Employee Name",
      prop: "staffname",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/staff/" + row.id} state={row}>
          {row.staffname}
        </Link>
      ),
    },
    { title: "Street", prop: "street", isFilterable: true },
    { title: "City", prop: "city", isFilterable: true },
    {
      title: "Date of Birth",
      prop: "dateofbirth",
      isFilterable: true,
      cell: (row) => moment(row.dateofbirth).format("DD-MMM-YYYY"),
    },
    { title: "Phone", prop: "phone", isFilterable: true },
    { title: "Email", prop: "email", isFilterable: true },
    { title: "Employee Type", prop: "recordtype", isFilterable: true },
    // { title: "Department", prop: "department", isFilterable: true },
    // { title: 'RecordType', prop: 'recordtype', isFilterable: true },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " ",
  };

  const createContact = () => {
    navigate(`/staff/e`);
  };

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12}/> */}
      <Col lg={2} className="mx-3">
        <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> <strong>EmployeeList</strong></Link>
      </Col>
      <Row className="g-0">
        <Col lg={12} className="p-lg-4">

          {body ?
            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
              initialState: {
                rowsPerPage: 15,
                options: [5, 10, 15, 20]
              }
            }}>
              <Row className="mb-4">
                <Col lg={3}>
                  <Filter />
                </Col>
                <Col lg={3} >
                  <Form.Select aria-label="Employee Type" name="employeetype" onChange={onFilterType}>
                    <option value="">--Select Employee Type--</option>
                    <option value="Principal">Principal</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Driver">Driver</option>
                    <option value="Peon">Peon</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="PTI">PTI</option>
                  </Form.Select>
                </Col>
                <Col lg={1} style={{ 'margin-top': '-18px' }}>
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={3} style={{ 'margin-top': '-13px' }} >
                  <div >
                    <InfoPill left="Total Employees" right={body?.length} />
                  </div>
                </Col>
                <Col lg={2} style={{ 'margin-top': '2px' }} className="d-flex flex-col justify-content-end align-items-end">
                  <Button className="btn-sm" variant="outline-primary" onClick={() => createContact(true)}>New Employee</Button>
                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper> : <ShimmerTable row={10} col={8} />}
        </Col>
        <Col lg={2}></Col>
      </Row>
    </Main>
  );
};

export default StaffList;
