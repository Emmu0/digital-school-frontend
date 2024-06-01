
import React, { useState, useEffect } from 'react'
import { ShimmerTable } from "react-shimmer-effects";
import moment from "moment";
import { Table, Button, Row, Col } from "react-bootstrap";
import schoolApi from '../../api/schoolApi';
import {
  DatatableWrapper,
  Pagination,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

function Fees(studenId) {
  const [fees, setFees] = useState([]);
  const header = [
    {
      title: "Student Name",
      prop: "studentname",
      isFilterable: true,
      // cell: (row) => (
      //   <Link to={"/examscheduleview/" + row.id}>
      //     {row.subject_name}
      //   </Link>
      // ),
    },
    // {
    //   title: "LastName",
    //   prop: "lastname",
    //   isFilterable: true,
    // },
    {
      title: "Class Name",
      prop: "classname",
      isFilterable: true,
    }, {
      title: "Category",
      prop: "category",
      isFilterable: true,
    },
    {
      title: "Fee Type",
      prop: "fee_type",
      isFilterable: true,
    },
    {
      title: "Total Fees",
      prop: "total_fees",
      isFilterable: true,
    },
    {
      title: "Total Dues",
      prop: "total_due_amount",
      isFilterable: true,
    },
    {
      title: "Date Of Birth",
      prop: "dateofbirth",
      isFilterable: true,
    },
    {
      title: "Phone",
      prop: "phone",
      isFilterable: true,
    },
    // {
    //        title: 'Action', prop: '', isFilterable: true, cell: (row) => (
    //          <div>
    //            <Dropdown>
    //             <Dropdown.Toggle variant="success" id="dropdown-basic">
    //               Action
    //             </Dropdown.Toggle>

    //             <Dropdown.Menu>
    //           <Dropdown.Item onClick={() => handleFeesClick(row)}>Fees</Dropdown.Item>
    //           <Dropdown.Item onClick={() => handleDepositeHistoryClick(row)}>Deposite History</Dropdown.Item>
    //         </Dropdown.Menu>
    //         </Dropdown>
    //           </div>
    //         )
    // },
  ];

  useEffect(() => {
    fetchFees();
  }, []);


  const fetchFees = async () => {
    console.log('fetchFees@@@=>', studenId)
    let student_id = studenId.studenId;
    console.log('Hey sudet=>', student_id)
    if (student_id !== null) {
      const result = await schoolApi.fetchStudentAddmission(student_id);
      console.log('result-deposit->', result);
      if (result) {
        setFees(result);
      } else {
        setFees([]);
      }
    }
  }

  return (
    <div>
      <Row className='mt-2'>
        <Col lg={12}>
          {fees ? (
            fees.length > 0 ? (
              <DatatableWrapper body={fees.flat()} headers={header}>
                <Table striped className="data-table custom-table-subject-list">
                  <TableHeader />
                  <TableBody />
                </Table>
                <Pagination />
              </DatatableWrapper>
            ) : (
              <div>
                {console.log('No records found')}
                <DatatableWrapper body={fees.flat()} headers={header}>
                  <Table striped className="data-table custom-table-subject-list">
                    <TableHeader />
                    <TableBody>
                      <tr>
                        <td colSpan={header.length} className="text-center">No Records Found!!!</td>
                      </tr>
                    </TableBody>
                  </Table>
                  <Pagination />
                </DatatableWrapper>
              </div>
            )
          ) : null}
        </Col>
      </Row>

    </div>
  )
}

export default Fees