import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import moment from 'moment';
import InfoPill from "../InfoPill";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader
} from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";


const ContactList = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState();
  const [contacts, setContacts] = useState();
  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchClientContacts();
      if (result) {
        setBody(result);
        setContacts(result);
      } else {
        setBody([]);
        setContacts([]);

      }

    }
    init();

  }, []);

  const onFilterType = (event) => {
    if (event.target.value === '') {
      setBody(contacts);
    } else {
      setBody(
        contacts.filter((data) => {
          if ((data.recordtype || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
          if ((data.location || '').toLowerCase() === (event.target.value || '').toLowerCase()) {
            return data;
          }
        })
      );
    }
  };



  // Create table headers consisting of 4 columns.
  const header = [
    {
      title: 'Client Name', prop: 'fullname', isFilterable: true,
      cell: (row) => (
        <Link
          to={"/contacts/" + row.id}
          state={row}
        >
          {row.fullname}
        </Link>
      )
    },
    { title: 'Street', prop: 'street' },
    { title: 'City', prop: 'city', isFilterable: true },
    { title: 'Date of Birth', prop: 'dob', isFilterable: true, cell: (row) => (moment(row.dob).format('DD-MMM-YYYY')) },
    { title: 'Phone', prop: 'phone', isFilterable: true },
    { title: 'Alternate Phone', prop: 'phone2', isFilterable: true },
    { title: 'Email', prop: 'email', isFilterable: true },
    { title: 'Anniversary Date', prop: 'anniversarydate', cell: (row) => (moment(row.anniversarydate).format('DD-MMM-YYYY')) },
    { title: 'Location', prop: 'location', isFilterable: true },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.
  const labels = {
    beforeSelect: " "
  }

  const createContact = () => {
    navigate(`/contacts/Client/e`);
  }

  return (
   <Main>
     <Row className="g-0">
      <Col lg={2} className="mx-2">
        <Link className="nav-link" to="/">Home<i className="fa-solid fa-chevron-right"></i> Clients</Link>
      </Col>
      <Col lg={12} className="p-lg-4">

        {body ?
          <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
            initialState: {
              rowsPerPage: 15,
              options: [5, 10, 15, 20]
            }
          }}>
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
                <Form.Group className="mx-3 mt-4" controlId="formBasicStatus">
                  <Form.Select aria-label="Enter status" name="location" onChange={onFilterType}>
                      <option value="">--Select Location--</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Sikar">Sikar</option>
                      <option value="Noida">Noida</option>
                      <option value="Jodhpur">Jodhpur</option>
                      <option value="Jhunjhunu">Jhunjhunu</option>
                  </Form.Select>
              </Form.Group>
                <PaginationOptions labels={labels} />
                <div style={{ "marginTop": "5px" }}>
                  <InfoPill left="Total Clients" right={body?.length} />
                </div>
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Button className="btn-sm" variant="outline-primary" onClick={() => createContact(true)}>New Client</Button>
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

export default ContactList;