import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card } from "react-bootstrap";
import {Box, Tab} from "@mui/material";
import {TabContext , TabList} from "@mui/lab";
import SupplierPurchaseDetail from "./SupplierRelatedList/SupplierPurchaseDetail";
import AddPurchase from "./AddPurchase";
import { ToastContainer } from "react-toastify";


const SupplierRelatedList = (props) => {
  const [selectedTab, setSelectedTab] = useState("Details");
  const [supplier, setSupplier] = useState(true);
  const tabs = ["Details", "Purchase Detail"];
  const [issueModalShow, setIssueModalShow] = useState(false);
  const [purchaseModalShow, setPurchaseModalShow] = useState(false);
  const [refreshTab, setRefreshTab] = useState(false);
  const [showNewButton , setShowNewButton] = useState(false);

  useEffect(() => {
    if (!issueModalShow && !purchaseModalShow) {
      setRefreshTab((prevRefreshTab) => !prevRefreshTab);
    }
  }, [issueModalShow, purchaseModalShow]);

  const handleMainTab = async (e, tabname) => {
    try {
      if (tabname === "Details") {
        setSupplier(true);
        setSelectedTab(tabname);
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
                  Add Purchase
                </Button>
              </Col>
              }
            </Row>
            {selectedTab === "Purchase Detail" && (
              <div>
                <SupplierPurchaseDetail
                  key={`${refreshTab}-${props.supplier.id}`}
                  bookId={props.supplier.id}
                />
              </div>
            )}
          </Box>
          {selectedTab === "Details" && supplier && (
            <>
              <Row className="mb-4 mt-2">
                <Col lg={12}></Col>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Name</label>
                    <span>{props.supplier.name ? props.supplier.name : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">
                    Contact Person
                    </label>
                    <span>{props.supplier.contact_person ? props.supplier.contact_person : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Email</label>
                    <span>{props.supplier.email ? props.supplier.email : '--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Phone</label>
                    <span>{props.supplier.phone ? props.supplier.phone : '--'}</span>
                  </Col>
                </Row>
                <Row className="px-5">
                  <Col lg={6}>
                    <label className="fw-bold">Address</label>
                    <span>{props.supplier.address ? props.supplier.address :'--'}</span>
                  </Col>
                  <Col lg={6}>
                    <label className="fw-bold">Status</label>
                    <span>{props.supplier.status ? props.supplier.status : '--'}</span>
                  </Col>
                </Row>
              </Row>
            </>
          )}
        </TabContext>
      </Card>
      {purchaseModalShow && (
        <AddPurchase
          show={purchaseModalShow}
          supplierId={props.supplier.id}
          onHide={() => setPurchaseModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )} 
      <ToastContainer />
    </>
  );
};
export default SupplierRelatedList
