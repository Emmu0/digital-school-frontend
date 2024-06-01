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

function BookRelatedPurchaseDetail(props) {
  const [parentBody, setParentBody] = useState([]);

  const header = [
    { title: "Supplier Name", prop: "supplier_name", isFilterable: true },
    { title: "Quantity", prop: "quantity", isFilterable: true },
    {
      title: "Date",
      prop: "date",
      isFilterable: true,
      cell: (row) => moment(row.date).format("DD-MMM-YYYY"),
    },
    {
      title: "Contact Person",
      prop: "supplier_contact_person",
      isFilterable: true,
    },
    { title: "Phone", prop: "supplier_phone", isFilterable: true },
    { title: "Email", prop: "supplier_email", isFilterable: true },
    { title: "Address", prop: "supplier_address", isFilterable: true },
    { title: "Status", prop: "supplier_status", isFilterable: true },
  ];

  useEffect(() => {
    fetchPurchase();
  }, []);

  const fetchPurchase = async () => {
    const result = await schoolApi.getPurchasesRecordsByBookId(props?.bookId);
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
export default BookRelatedPurchaseDetail;