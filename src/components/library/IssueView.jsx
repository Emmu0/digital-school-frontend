import React, { useState, useEffect } from "react";
import { Card, Button, Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNavigations from "../breadcrumbs/PageNavigations";
import moment from "moment";
import AddIssueBook from "./AddIssueBook";

const IssueView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();

  useEffect(() => {
    fetchIssue();
  }, []);

  const fetchIssue = () => {
    if (location.hasOwnProperty("pathname")) {
      issue.id = location.pathname.split("/")[2];
    }
    async function initBook() {
      let result = await schoolApi.getIsuueRecordsById(issue.id);
      if (result) {
        setIssue(result);
      } else {
        setIssue({});
      }
    }
    initBook();
  };

  const editIssue = () => {
    setModalShow(true);
    setRowRecords(issue);
  };

  const recordSaveSuccesfully = () => {
    setModalShow(false);
    fetchIssue();
  };
  const handleBack = () => {
    navigate(`/issue_book`);
  };

  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
        {issue && (
          <Container>
            {modalShow && (
              <AddIssueBook
                show={modalShow}
                parent={rowRecords}
                onHide={() => setModalShow(false)}
                recordSaveSuccesfully={recordSaveSuccesfully}
              />
            )}
            <PageNavigations
              listName="Issue Book"
              listPath="/issue_book"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />
            <Row className="view-form pt-5">
              <Col lg={12}>
                <Row>
                  <Col lg={12}>
                    <Col className="mx-3">
                      <Col className="section-header my-3">
                        <span style={{ color: "black" }}>
                          BOOK ISSUE INFORMATION
                        </span>
                      </Col>
                    </Col>
                  </Col>
                </Row>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={3}>
                    <h5>Details</h5>
                  </Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editIssue(true)}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                    <Button
                      className="btn-sm mx-2"
                      variant="danger"
                      onClick={handleBack}
                    >
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </Button>
                    <ToastContainer
                      position="top-center"
                      autoClose={2000}
                      hideProgressBar
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="colored"
                    />
                  </Col>
                </Row>
                <Row className="mx-3 mt-2">
                  <Card>
                    <Row className="mb-4 mt-2">
                      <Col lg={12}></Col>
                      <Row className="px-5">
                        <Col lg={6}>
                          <label className="fw-bold">Name</label>
                          <span>{issue.parent_name}</span>
                        </Col>
                        <Col lg={6}>
                          <label className="fw-bold">Registration Id</label>
                          <span>{issue.parent_eid}</span>
                        </Col>
                      </Row>
                      <Row className="px-5">
                        <Col lg={6}>
                          <label className="fw-bold">Type</label>
                          <span>{issue.parent_type}</span>
                        </Col>
                        <Col lg={6}>
                          <label className="fw-bold">Book Name</label>
                          <span>{issue.book_title}</span>
                        </Col>
                      </Row>
                      <Row className="px-5">
                        <Col lg={6}>
                          <label className="fw-bold">Checkout Date</label>
                          <span>
                            {moment(issue.checkout_date).format("DD-MM-YYYY")}
                          </span>
                        </Col>
                        <Col lg={6}>
                          <label className="fw-bold">Due Date</label>
                          <span>
                            {moment(issue.due_date).format("DD-MM-YYYY")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="px-5">
                        <Col lg={6}>
                          <label className="fw-bold">Return Date</label>
                          <span>
                            {issue?.return_date ? moment(issue?.return_date).format("DD-MM-YYYY") : '--'}
                          </span>
                        </Col>
                        <Col lg={6}>
                          <label className="fw-bold">Status</label>
                          <span>{issue?.status}</span>
                        </Col>
                      </Row>
                      <Row className="px-5">
                        <Col lg={6}>
                          <label className="fw-bold">Remark</label>
                          <span>
                            {issue.remark ? issue.remark : '--'}
                          </span>
                        </Col>
                      </Row>
                    </Row>
                  </Card>
                </Row>
                <Row></Row>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        )}
      </div>
    </Main>
  );
};
export default IssueView;