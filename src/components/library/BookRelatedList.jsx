import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card } from "react-bootstrap";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import moment from "moment";
import BookRelatedIssueDetail from "./BookRelatedList/BookRelatedIssueDetail";
import BookRelatedPurchaseDetail from "./BookRelatedList/BookRelatedPurchaseDetail";
import AddIssueBook from "./AddIssueBook";
import AddPurchase from "./AddPurchase";
import { ToastContainer, toast } from "react-toastify";

const BookRelatedList = (props) => {
  const [selectedTab, setSelectedTab] = useState("Details");
  const [book, setBook] = useState(true);
  const tabs = ["Details", "Issue Detail", "Purchase Detail"];
  const [issueModalShow, setIssueModalShow] = useState(false);
  const [purchaseModalShow, setPurchaseModalShow] = useState(false);
  const [refreshTab, setRefreshTab] = useState(false);
  const [showNewButton, setShowNewButton] = useState(false);

  useEffect(() => {
    if (!issueModalShow && !purchaseModalShow) {
      setRefreshTab((prevRefreshTab) => !prevRefreshTab);
    }
  }, [issueModalShow, purchaseModalShow]);

  const handleMainTab = async (e, tabname) => {
    try {
      if (tabname === "Details") {
        setBook(true);
        setSelectedTab(tabname);
        setShowNewButton(false);
      }
      if (tabname === "Issue Detail") {
        setSelectedTab(tabname);
        setShowNewButton(true);
      }
      if (tabname === "Purchase Detail") {
        setSelectedTab(tabname);
        setShowNewButton(true);
      }
    } catch (error) {
      console.log("error=>", error);
    }
  };

  const handleNewButtonClick = () => {
    if (selectedTab === "Issue Detail") {
      if (props.book.status === 'Active' && props.book.available > 0) {
        setIssueModalShow(true);
      } else {
        toast.error(`${props.book.title} Book is Not Available`, { position: toast.POSITION.TOP_RIGHT });
      }
    }
    if (selectedTab === "Purchase Detail") {
      setPurchaseModalShow(true);
    }
  };

  const recordSaveSuccesfully = () => {
    setIssueModalShow(false);
    setPurchaseModalShow(false);
  };

  return (
    <>
      <Card>
        <TabContext>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Row>
              <Col xs={9}>
                <TabList aria-label="lab API tabs example">
                  {tabs?.map((tab, index) => (
                    <Tab
                      label={tab}
                      key={index}
                      onClick={(e) => handleMainTab(e, tab)}
                      style={{ color: "black" }}
                      selected={selectedTab === tab}
                      sx={{
                        color: selectedTab === tab ? "blue" : "black",
                        borderBottom:
                          selectedTab === tab ? "2px solid blue" : "none",
                      }}
                    ></Tab>
                  ))}
                </TabList>
              </Col>
              {showNewButton &&
                <Col xs={3}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="my-3 float-end me-4"
                    onClick={handleNewButtonClick}
                  >
                    {selectedTab === "Issue Detail" ? 'Issue Book' : 'Add Purchase'}
                  </Button>
                </Col>
              }
            </Row>

            {selectedTab === "Issue Detail" && (
              <div>
                <BookRelatedIssueDetail
                  key={`${refreshTab}-${props.book.id}`}
                  bookId={props.book.id}
                />
              </div>
            )}
            {selectedTab === "Purchase Detail" && (
              <div>
                <BookRelatedPurchaseDetail
                  key={`${refreshTab}-${props.book.id}`}
                  bookId={props.book.id}
                />
              </div>
            )}
          </Box>
          {selectedTab === "Details" && book && (
            <>
              <Row className="mb-4 mt-2">
                <Col lg={12}></Col>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Title</label>
                    <span>{props.book.title}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">
                      International Standard Book Number
                    </label>
                    <span>{props.book.isbn ? props.book.isbn : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Publisher</label>
                    <span>{props.book.publisher_name ? props.book.publisher_name : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Publish Date</label>
                    <span>
                      {props?.book?.publish_date ?
                        <>{moment(props?.book?.publish_date).format("MMMM Do, YYYY")}</>
                        : '--'}
                    </span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Author</label>
                    <span>{props.book.author_name ? props.book.author_name : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Category</label>
                    <span>{props.book.category_name ? props.book.category_name : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Language</label>
                    <span>{props.book.language_name ? props.book.language_name : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Copies</label>
                    <span>{props.book.total_copies ? props.book.total_copies : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Issued</label>
                    <span>{props.book.issued ? props.book.issued : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Missing</label>
                    <span>{props.book.missing ? props.book.missing : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Available</label>
                    <span>{props.book.available ? props.book.available : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Status</label>
                    <span>{props.book.status ? props.book.status : '--'}</span>
                  </Col>
                </Row>
              </Row>
            </>
          )}
        </TabContext>
      </Card>
      {issueModalShow && (
        <AddIssueBook
          show={issueModalShow}
          bookId={props.book.id}
          onHide={() => setIssueModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
      {purchaseModalShow && (
        <AddPurchase
          show={purchaseModalShow}
          bookId={props.book.id}
          onHide={() => setPurchaseModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
      <ToastContainer />
    </>
  );
};
export default BookRelatedList;