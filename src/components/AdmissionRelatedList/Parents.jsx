// import React,{useState,useEffect} from 'react'
// import { ShimmerTable } from "react-shimmer-effects";
// import moment from "moment";
// import {Table,Button } from "react-bootstrap";
// import schoolApi from '../../api/schoolApi';
// import {
//   DatatableWrapper,
//   Pagination,
//   TableBody,
//   TableHeader,
// } from "react-bs-datatable";

// function Parents(parentId) {
//   console.log('parentId@@+>',parentId)
//   const [parentBody, setParentBody] = useState([]);
//   const header = [
//     {
//       title: 'Contact Name', prop: 'contactname', isFilterable: true
//     },
//     { title: 'Profession', prop: 'profession' },
//     { title: 'Qualification', prop: 'qualification', isFilterable: true },
//     { title: 'Date of Birth', prop: 'dateofbirth', isFilterable: true, cell: (row) => (moment(row.dob).format('DD-MMM-YYYY')) },
//     { title: 'Phone', prop: 'phone', isFilterable: true },
//     { title: 'Email', prop: 'email', isFilterable: true }
//   ];


//   useEffect(() => {
//     fetchContact();
//   }, []);

//   const fetchContact = async () => {
//     let parent_id = parentId.parentid;
//     const result = await schoolApi.fetchContact(parent_id);
//     console.log("result ==> fetch ", result);
//     setParentBody([result]);
//   }
//   console.log('contact@@+>',parentBody)
//   return (
//     <div>
//        {parentBody ? (
//         <DatatableWrapper body={parentBody} headers={header}>
//           <Table striped className="data-table custom-table-subject-list">
//             <TableHeader />
//             <TableBody />
//           </Table>
//           <Pagination />
//         </DatatableWrapper>
//       ) : (
//         <ShimmerTable row={10} col={8} />
//       )}
//     </div>
//   )
// }

// export default Parents

import React, { useState, useEffect } from "react";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import { Table, Button, Row, Col } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

function Parents(parentId) {
  console.log("parentId@@+>", parentId);
  const [parentBody, setParentBody] = useState([]);
  const header = [
    {
      title: "Contact Name",
      prop: "contactname",
      isFilterable: true,
    },
    { title: "Profession", prop: "profession" },
    { title: "Qualification", prop: "qualification", isFilterable: true },
    {
      title: "Date of Birth",
      prop: "dateofbirth",
      isFilterable: true,
      cell: (row) => moment(row.dob).format("DD-MMM-YYYY"),
    },
    { title: "Phone", prop: "phone", isFilterable: true },
    { title: "Email", prop: "email", isFilterable: true },
  ];

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    let parent_id = parentId.parentid;
    if (parent_id !== null) {
      const result = await schoolApi.fetchContact(parent_id);
      console.log("result ==> fetch ", result);
      if (result) {
        setParentBody([result]);
      } else {
        setParentBody([]);
      }
    }
  };
  console.log("contact@@+>", parentBody);
  return (
    <div>
      <Row className="mt-2">
        <Col lg={12}>
          {parentBody ? (
            parentBody.length > 0 ? (
              <DatatableWrapper body={parentBody} headers={header}>
                <Table striped className="data-table custom-table-subject-list">
                  <TableHeader />
                  <TableBody />
                </Table>
                <Pagination />
              </DatatableWrapper>
            ) : (
              <div>
                {console.log("No records found")}
                <DatatableWrapper body={parentBody} headers={header}>
                  <Table
                    striped
                    className="data-table custom-table-subject-list"
                  >
                    <TableHeader />
                    <TableBody>
                      <tr>
                        <td colSpan={header.length} className="text-center">
                          No Records Found!!!
                        </td>
                      </tr>
                    </TableBody>
                  </Table>
                  <Pagination />
                </DatatableWrapper>
              </div>
            )
          ) : (
            <ShimmerTable row={10} col={8} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Parents;