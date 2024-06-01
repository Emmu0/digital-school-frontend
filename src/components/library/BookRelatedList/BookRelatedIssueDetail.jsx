import React, { useState, useEffect } from "react";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import { Table } from "react-bootstrap";
import schoolApi from "../../../api/schoolApi";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

function BookRelatedIssueDetail(props) {
  const [parentBody, setParentBody] = useState([]);

  const header = [
    { title: "Issued By", prop: "parent_name", isFilterable: true },
    { title: "Registration Id", prop: "parent_eid", isFilterable: true },
    { title: "Type", prop: "parent_type" },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: "Issued Date",
      prop: "checkout_date",
      isFilterable: true,
      cell: (row) => moment(row.checkout_date).format("DD-MMM-YYYY"),
    },
    {
      title: "Due Date",
      prop: "due_date",
      isFilterable: true,
      cell: (row) => moment(row.due_date).format("DD-MMM-YYYY"),
    },
  ];

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    const result = await schoolApi.getIssueRecordsByBookId(props.bookId);
    setParentBody(result);
  };

  return (
    <div>
      {parentBody ? (
        <DatatableWrapper body={parentBody} headers={header}>
          <Table striped className="data-table custom-table-subject-list">
            <TableHeader />
            <TableBody />
          </Table>
          <Pagination />
        </DatatableWrapper>
      ) : (
        <ShimmerTable row={10} col={8} />
      )}
    </div>
  );
}
export default BookRelatedIssueDetail;