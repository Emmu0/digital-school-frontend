
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

function Sibling(parentId, studenId) {
  const [parentSibling, setParentSibling] = useState([]);
  const header = [
    {
      title: "S.No",
      prop: "srno",
      isFilterable: true,
    },
    {
      title: "Student Name",
      prop: "studentname",
      isFilterable: true,
    },
    {
      title: "Class Name",
      prop: "classname",
      isFilterable: true,
      cell: (row) => row.classname,
    },
    {
      title: "Phone",
      prop: "phone",
      isFilterable: true,
    },
    {
      title: "Email",
      prop: "email",
      isFilterable: true,
    },
    {
      title: "Parent Name",
      prop: "parentname",
      isFilterable: true,
    },
  ];

  useEffect(() => {
    fetchStudentByParentId();
  }, []);

  const fetchStudentByParentId = async () => {
    console.log('parentId@@@=>', parentId)
    let parent_id = parentId.parentid;
    let studenId = parentId.studentid;
    console.log('fetchStudentByParentId@@+>', parent_id)
    console.log('studenId.studenId@@+>', studenId)
    if (parent_id !== null) {
      const result = await schoolApi.fetchStudentByParentId(parent_id);
      console.log("result ==> fetch ", result);
      if(result.success === true){
        const newResult = result.filter((res) => res.id !== studenId);
        if (newResult.length > 0) {
          console.log('HHHH')
          setParentSibling([newResult]);
        } else {
          console.log('hai in  ==>')  
          setParentSibling([]);
        }
      }
    }
  };
  console.log("parentSibling=>", parentSibling);
  return (
    <div>
      <Row className="mt-2">
        <Col lg={12}>
          {parentSibling ? (
            parentSibling.length > 0 ? (
              <DatatableWrapper body={parentSibling.flat()} headers={header}>
                <Table striped className="data-table custom-table-subject-list">
                  <TableHeader />
                  <TableBody />
                </Table>
                <Pagination />
              </DatatableWrapper>
            ) : (
              <div>
                {console.log("No records found")}
                <DatatableWrapper body={parentSibling.flat()} headers={header}>
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

export default Sibling;