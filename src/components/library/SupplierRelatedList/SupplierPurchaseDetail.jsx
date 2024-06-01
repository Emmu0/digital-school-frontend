import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import schoolApi from "../../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import "react-toastify/dist/ReactToastify.css";
import {
    DatatableWrapper,
    Pagination,
    TableBody,
    TableHeader,
  } from "react-bs-datatable";
  import { Link } from "react-router-dom";
  import moment from "moment";

const SupplierPurchaseDetail = (props) => {

  const location = useLocation();
  const [supplier, setSupplier] = useState(location.state ? location.state : {});
  const [body, setBody] = useState([])

  const header = [
    { title: "S.No.", prop: "serial", isFilterable: true },
    { title: "Book", prop: "book_title", isFilterable: true, cell: (row) => (
        <Link to={"/books/" + row.book_id} state={row}>
          {row.book_title}
        </Link>
      ), },
    { title: "quantity", prop: "quantity", isFilterable: true },
    {title: "Date", prop: "date", isFilterable: true, cell: (row) => moment(row.date).format("DD-MMM-YYYY"),},    
  ];
  
  const fetchsupplier = () => {
    if (location.hasOwnProperty("pathname")) {
      supplier.id = location.pathname.split("/")[2];
    }
    async function initBook() {
      let result = await schoolApi.getPurchasesRecordsBysupplierId(supplier?.id);
        setSupplier(result);
        setBody(result)
    }
    initBook();
  };
 
  useEffect(() => {
    fetchsupplier();
  }, []);
  
  return (
            <div>
                {body ? (
                    <DatatableWrapper body={body} headers={header}>
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
};
export default SupplierPurchaseDetail;