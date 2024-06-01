import React, { useState, useEffect } from "react";
import { Table, Button, Col, Container, Row  } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import "react-toastify/dist/ReactToastify.css";
import {
    DatatableWrapper,
    Pagination,
    TableBody,
    TableHeader,
  } from "react-bs-datatable";
  import Main from "../../layout/Main";
  import { Helmet } from "react-helmet";
  import { ToastContainer } from "react-toastify";
  import { Link } from "react-router-dom";
  import PageNavigations from "../../breadcrumbs/PageNavigations";
  import moment from "moment";


const SupplierDetail = (props) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(location.state ? location.state : {});
  const [body, setBody] = useState([])

  const header = [
    { title: "Book", prop: "book_title", isFilterable: true, cell: (row) => (
        <Link to={"/books/" + row.id} state={row}>
          {row.book_title}
        </Link>
      ), },
    { title: "quantity", prop: "quantity", isFilterable: true },
    {title: "Date", prop: "date", isFilterable: true, cell: (row) => moment(row.date).format("DD-MMM-YYYY"),},
   
    
  ];
  
  const fetchsupplier = () => {
    if (location.hasOwnProperty("pathname")) {
      supplier.id = location.pathname.split("/")[2];
      console.log('supplier.id' , supplier.id)
    }
    async function initBook() {
      let result = await schoolApi.getPurchasesRecordsBysupplierId(supplier.id);
      console.log('getPurchasesRecordsBysupplierId' , result)
        setSupplier(result);
        setBody(result)
    }
    initBook();
  };
 
  useEffect(() => {
    fetchsupplier();
  }, []);
  
  const handleBack = () => {
    navigate(`/supplier`);
  };

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
export default SupplierDetail
