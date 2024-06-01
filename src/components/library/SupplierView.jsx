import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Confirm from "../Confirm";
import { useLocation, useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import Main from "../layout/Main";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddSupplier from "./AddSupplier";
import SupplierRelatedList from "./SupplierRelatedList";
import PageNavigations from "../breadcrumbs/PageNavigations";

const SupplierView = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(location.state ? location.state : {});
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [rowRecords, setRowRecords] = useState();

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = () => {
    if (location.hasOwnProperty("pathname")) {
      supplier.id = location.pathname.split("/")[2];
    }
    async function initSupplier() {
      let result = await schoolApi.getSupplierRecordsById(supplier.id);
      if (result) {
        setSupplier(result);
      } else {
        setSupplier({});
      }
    }
    initSupplier();
  };

  const deleteSupplier = async () => {
    try {
      const result = await schoolApi.deleteSupplier(supplier.id);
      if (result.success === false) {
        toast.error(result.message);
        return;
      } else if (result.success === true) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Deleted",
          message: "Record Deleted successfully",
        });
        navigate(`/supplier`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const editSupplier = () => {
    setEditModalShow(true);
    setRowRecords(supplier);
  };

  const recordSaveSuccesfully = () => {
    setEditModalShow(false);
    fetchSupplier();
  };
  const handleBack = () => {
    navigate(`/supplier`);
  };

  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <div>
        {supplier && (
          <Container>
            {modalShow && (
              <Confirm
                show={modalShow}
                onHide={() => setModalShow(false)}
                deleteSupplier={deleteSupplier}
                title="Confirm delete?"
                message="You are going to delete the record. Are you sure?"
                table="supplier"
              />
            )}
            <PageNavigations
              listName="Supplier"
              listPath="/suppliers"
              viewName=""
              viewPath=""
              colLg={2}
              colClassName="d-flex mx-3 mb-3"
              extrColumn={12}
            />
            <Row className="view-form pt-5">
              <Col lg={12}>
                <Col className="mx-3">
                  <Col className="section-header my-3">
                    <span style={{ color: "black" }}>Supplier Information</span>
                  </Col>
                </Col>
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={10}>
                    <h5>
                      {supplier.name}
                    </h5>
                  </Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <Button
                      className="btn-sm mx-2"
                      onClick={() => editSupplier(true)}
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
                  </Col>
                </Row>
              </Col>
              <Col></Col>
              <div className="px-4 mt-2">
                <SupplierRelatedList supplier={supplier} />
              </div>
            </Row>
          </Container>
        )}
      </div>
      {editModalShow && (
        <AddSupplier
          show={editModalShow}
          parent={rowRecords}
          onHide={() => setEditModalShow(false)}
          recordSaveSuccesfully={recordSaveSuccesfully}
        />
      )}
    </Main>
  );
};
export default SupplierView