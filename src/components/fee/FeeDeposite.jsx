/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate  } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { ShimmerTable } from "react-shimmer-effects";
import schoolApi from '../../api/schoolApi';
import InfoPill from "../InfoPill";
import Dropdown from 'react-bootstrap/Dropdown';

const FeeDeposite = (props) => {

  const [body, setBody] = useState([]);
  const [classRecords, setClassRecords] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function init() {
      const result = await schoolApi.getActiveClassRecords();
      const result2 = await schoolApi.fetchStudentAddmission();
      console.log('result2-->',result2);

      if(result2){
        setBody(result2);
      }
      else{
        setBody([]);
      }
      console.log('feesHead==>',result);
      if (result) {
        setClassRecords(result);
      } else {
        setClassRecords([]);
      }
    }
    init();
  }, []);

  console.log('classRecords-->',classRecords);

  const handleClassChange = async (e)=>{
    console.log('handleClassChange', e.target.value);

    const studentsByClassId = await schoolApi.fetchStudentAddmissionbyClassId(e.target.value);

    if(studentsByClassId){
      setBody(studentsByClassId);
    }
    else{
      setBody([]);
    }
  }
  console.log('body->',body);

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
    },{
      title: "Category",
      prop: "category",
      isFilterable: true,
    },
    {
      title: "Fee Type",
      prop: "fee_master_type",
      isFilterable: true,
    },
    {
      title: "Total Fees",
      prop: "total_fees",
      isFilterable: true,
    },
    {
      title: "Total Dues",
      prop: "total_dues",
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
    {
           title: 'Action', prop: '', isFilterable: true, cell: (row) => (
             <div>
               <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFeesClick(row)}>Fees</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDepositeHistoryClick(row)}>Deposite History</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
              </div>
            )
    },
      ];

  const labels = {
    beforeSelect: " ",
  };

  const handleFeesClick = (row) => {
    console.log('row data-->',row)
    navigate("/feedepositeedit/" + row.id, { state: {row} });
  };

  const handleDepositeHistoryClick = (row) => {
    console.log('row data-->',row)
    navigate("/feedepositehistory/" + row.id, { state: {row} });
  };

  console.log('body-->',body);

  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <Row className="g-0">
        <Col lg={2} className="mx-3">
          <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> FeesDepositList</Link>
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
                <Col lg={3} className='mt-3'>
                  <Filter />
                </Col>
                <Col lg={1} style={{ 'margin-top': '-6px' }}>
                  <PaginationOptions labels={labels} />
                </Col>
                <Col lg={3}>
                <Form.Group  className='mt-3'>
                      {/* <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicClass"
                      >
                        Class Name
                      </Form.Label> */}
                      <Form.Select
                        required
                        name="classid"
                        value={classRecords.id}
                        onChange={handleClassChange}
                      >
                        <option value="">-- Select Class Name --</option>
                        {classRecords.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.classname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                </Col>
                <Col lg={5} >
                  <div >
                    <InfoPill left="Total Students" right={body?.length} />
                  </div>
                </Col>
               
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper> : <ShimmerTable row={10} col={4} />}
        </Col>
        <Col lg={2}></Col> 
      </Row>

    </Main>
  )
}

export default FeeDeposite
