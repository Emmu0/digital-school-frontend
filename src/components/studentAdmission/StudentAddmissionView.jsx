import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Table, } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { Helmet } from 'react-helmet';
import Main from "../layout/Main";
import PageNavigations from "../breadcrumbs/PageNavigations";

import StudentAddRelatedList from "./studentAddRelatedList";
import { DatatableWrapper, TableBody, TableHeader } from "react-bs-datatable";
const StudentAddmissionView = (props) => {
  console.log('StudentAddmissionView', props)
  const location = useLocation();
  console.log('location.state on view-->', location?.state);
  const navigate = useNavigate();
  const [studentaddmission, setStudentAddmission] = useState(location?.state ? location.state : []);
  const [modalShow, setModalShow] = useState(false);
  const [discountRecords, setDiscountRecords] = useState();
  const [discountOptions, setDiscountOptions] = useState();
  const [studentInstallments, setStudentInstallments] = useState([]);

  useEffect(() => {
    fetchStudentAddmission();
    // fetchDiscountLineItems();
  }, [location?.state?.studentid]);


  const handleCancel = async (e) => {
    navigate('/studentaddmissions');
  }

  console.log('studentaddmission#@@!#=>', studentaddmission)
  // const fetchDiscountLineItems = async () => {
  //   try {
  //     let result = await schoolApi.fetchFeeDiscountLineItemsBySt(location?.state?.student_addmission_id);
  //     console.log('discount result-->', result);
  //     if (result) {
  //       result.map((res) => {
  //         setDiscountOptions((prevOptions) => {
  //           if (!prevOptions) {
  //             return [{ value: res.discountid, label: res.discount_name }]
  //           }
  //           if (!prevOptions.some(prev => prev.label === res.discount_name)) {
  //             return [...prevOptions, { value: res.discountid, label: res.discount_name }];
  //           }
  //           return prevOptions;
  //         });
  //       })
  //     }
  //   } catch (error) {

  //   }
  // }

  console.log('discountOptions-->', discountOptions);
  const fetchStudentAddmission = () => {
    // async function initStudent() {
    //   console.log('location?.state@@+>',location?.state)
    //   let result = await schoolApi.fetchStudentAddmissionById(location?.state?.student_addmission_id);
    //   console.log('what us in the rsult=>', result);
    //   if (result) {
    //     setStudentAddmission(result);
    //   } else {
    //     setStudentAddmission({});
    //   }
    // }
    // initStudent();
  };
  const deleteStudentAddmission = async () => {
    const result = await schoolApi.deleteStudentAddmission(studentaddmission.student_addmission_id);
    if (result) navigate(`/studentaddmissions/`);
  };

  const editStudentAddmision = () => {
    console.log('studentaddmission@@@=>', studentaddmission)
    navigate(`/studentaddmissions/${studentaddmission.student_addmission_id}/e`, {
      state: studentaddmission,
    });
  };
  // const refresh = () => {
  //   fetchStudentAddmission();
  // };

  // const handleDiscounts = () => {
  //   console.log('hanlde discoutn clicked');
  // }

  const header = [
    {
      title: 'Month',
      prop: 'month',
      isFilterable: true,

    },
    {
      title: 'Amount',
      prop: 'amount',

    },
    {
      title: 'Deposited amount',
      prop: 'deposit_amount',
      isFilterable: true,

    },
    {
      title: 'Due Date',
      prop: 'due_date',
      isFilterable: true,

    },
    {
      title: 'Status',
      prop: 'status',
      isFilterable: true,

    },
    {
      title: 'Transport Fee',
      prop: 'transport_fee',

    },
  ];
  return (
    <Main>
      <Helmet> <title>{props?.tabName}</title> </Helmet>
      <PageNavigations listName="Admissions List" listPath="/studentaddmissions" colLg={2} colClassName="d-flex mx-5 mb-4" extrColumn={12} />
      <div>
        {studentaddmission && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteStudent={deleteStudentAddmission}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="student"
              />
            )}
            <Row className="view-form">
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "black" }}>Student Admission</span>
                  </Col>
                </Col>
                <Row className="view-form-header align-items-center mx-3">
                <Col lg={11}>
                  <h5>{studentaddmission.studentname} ({studentaddmission.classname} {studentaddmission.section_name})</h5>
                </Col>
                <Col lg={1} className="d-flex justify-content-end">
                  <Button className="btn-sm mr-2 mx-2" onClick={() => editStudentAddmision(true)}>
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Button>
                  <Button className="btn-sm" variant="danger" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Col>
              </Row>

              </Col>
              <Col></Col>
              <div className="px-4 mt-2">
                <StudentAddRelatedList studentaddmission={studentaddmission} />
              </div>
            </Row>
          </Container>
        )}
      </div>
      {/* <Row className="mt-4 mb-3">
        <Col lg={12}>
          <Col className="mx-3">
            <Col className="section-header my-3">
              <span style={{ color: "black" }}>Fee Installments</span>
            </Col>
          </Col>
        </Col>
        <Col className="mx-3">
          <DatatableWrapper body={studentInstallments} headers={header} >
            <Table striped className="data-table">
              <TableHeader />
              <TableBody />
            </Table>
          </DatatableWrapper>
        </Col>
      </Row> */}
    </Main>
  );
};
export default StudentAddmissionView;
