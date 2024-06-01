
/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";

const ExamSchedule = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState();

  useEffect(() => {
    async function init() {
      const result = await schoolApi.fetchExamSchedules();
      console.log('result===>',result);
      if (result) {
        setBody(result);
      } else {
        setBody([]);
      }
    }
    init();

   
  }, []);

  console.log('body ',body);


  console.log('Exam Schedule records',body);

  const header = [
    {
      title: "Subject",
      prop: "subject_name",
      isFilterable: true,
      cell: (row) => (
        <Link to={"/examscheduleview/" + row.id}>
          {row.subject_name}
        </Link>
      ),
    },
    {
      title: "Class",
      prop: "class_name",
      isFilterable: true,
    },
    {
      title: "Scheduled Date",
      prop: "schedule_date",
      isFilterable: true,
    },
    {
      title: "Exam Title",
      prop: "exam_title_name",
      isFilterable: true,
    },
    {
      title: "Duration",
      prop: "duration",
      isFilterable: true,
    },
    {
      title: "Room No",
      prop: "room_no",
      isFilterable: true,
    },
    {
      title: "Examinor",
      prop: "examinor_info",
      isFilterable: true,
    },
    {
      title: "Status",
      prop: "status",
      isFilterable: true,
    },
    // {
    //        title: 'Action', prop: '', isFilterable: true, cell: (row) => (
    //          <div>
    //            <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
    //               <i className="fa-regular fa-pen-to-square"></i> Edit
    //           </button>
    //             <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
    //               <i className="fa-regular fa-trash"></i> Delete
    //             </button>
    //           </div>
    //         )
    //       },
      
      
  ];

  const labels = {
    beforeSelect: " ",
  };

  const scheduleNewExam = () => {
     navigate("/examschedule/e");
  };


  return (
   <Main>
    <Helmet> <title>{props?.tabName}</title> </Helmet>
    {/* <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12}/> */}
    <Col lg={2} className="mx-3">
        <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i>ExamSchedule</Link>
      </Col>
     <Row className="g-0">
      <Col lg={12} className="p-lg-4">

        {body ?
          <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
            initialState: {
              rowsPerPage: 15,
              options: [5, 10, 15, 20]
            }
          }}>
            <Row className="mb-4">
              <Col lg={3}>
                <Filter />
              </Col>
              <Col lg={1} style={{'margin-top': '-18px'}}>
                <PaginationOptions labels={labels} />
              </Col>
              <Col lg={3} style={{'margin-top': '-13px'}} >
                <div >
                  <InfoPill left="Total Exams" right={body?.length} />
                </div>
              </Col>
              <Col lg={5} style={{'margin-top': '2px'}} className="d-flex flex-col justify-content-end align-items-end">
                <Button className="btn-light" variant="outline-primary" onClick={() => scheduleNewExam(true)}>Schedule Exam</Button>
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

export default ExamSchedule;
