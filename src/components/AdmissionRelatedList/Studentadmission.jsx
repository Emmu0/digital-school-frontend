import React, { useState, useEffect } from "react";
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import { Table, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

function Studentadmission(student_id) {
  console.log('props.stue b=>', student_id)
  const [admissionBody, setAdmissionBody] = useState([]);
  const navigate = useNavigate(); //navigation
  useEffect(() => {
    fetchAdmission();
  }, []);

  const fetchAdmission = async () => {
    console.log('student_id@!!@@=>', student_id)
    let studenId = student_id.student_id;
    if (studenId !== null) {
      const result = await schoolApi.fetchAdmissionByStudentId(studenId);
      if (result) {
        setAdmissionBody([result]);
      }
    }
  }
  const headerAdd = [
    {
      title: "Form No",
      prop: "formno",
      isFilterable: true,
    },
    {
      title: "Student Name",
      prop: "studentname",
      isFilterable: true,
    },
    {
      title: "Date of Admission",
      prop: "dateofaddmission",
      isFilterable: true,
      cell: (row) => {
        // Parse the date string
        const dateUTC = new Date(row.dateofaddmission);
        // Convert to local time zone
        const dateLocal = new Date(dateUTC.getTime() + dateUTC.getTimezoneOffset() * 60000);
        // Extract day, month, and year
        const day = String(dateLocal.getDate()).padStart(2, '0');
        const month = String(dateLocal.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = dateLocal.getFullYear();
        // Format the date as dd-mm-yyyy
        const formattedDate = `${day}-${month}-${year}`;
        // Render the formatted date
        return formattedDate;
      },

    },
    {
      title: "Current Class",
      prop: "current_class",
      isFilterable: true,
    },
    {
      title: "Fee Installment Type",
      prop: "fee_type",
      isFilterable: true,
    },
    {
      title: 'Actions',
      prop: 'id',
      cell: (row) => {
        return (
          <>
            <Button className="btn-sm mx-2 btnHover" variant="primary" onClick={() => handleFeeDeposit(row)}>
              Fee Deposit
            </Button>
          </>
        );
      },
    }
  ];

  const handleFeeDeposit = (row) => {
    navigate("/feedepositeedit/" + row.id, { state: { row } });
  }
  console.log('admissionBody@@@=>', admissionBody)
  return (
    <div>
      {admissionBody ? (
        <DatatableWrapper body={admissionBody.flat()} headers={headerAdd}>
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

export default Studentadmission;

