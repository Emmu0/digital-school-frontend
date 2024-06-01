import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import { ShimmerTable } from "react-shimmer-effects";
import InfoPill from "../InfoPill";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader, } from "react-bs-datatable";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import Confirm from "../Confirm";
import VehicleAdd from "./VehicleAdd";
import VehicleUpdate from "./VehicleUpdate ";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VehicleList = (props) => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  const [addModalShow, setAddModalShow] = useState(false);
  const [body, setBody] = useState();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchUpdatedVehicle = async () => {
    try {
      const result = await schoolApi.getAllVehicles();
      if (result) {
        setBody(result);
      }
    } catch (error) {
      console.error('Error fetching fare:', error);
    }
  };

  useEffect(() => {
    fetchUpdatedVehicle()
  }, []);

  const handleDeleteAndNavigate = async () => {
    if (selectedVehicleId) {
      try {
        const response = await schoolApi.deleteVehicle(selectedVehicleId);

        if (response && response.message === "Transport deleted successfully") {
          const updatedVehicle = body.filter(vehicle => vehicle.id !== selectedVehicleId);
          setBody(updatedVehicle);

          setModalShow(false);
          fetchUpdatedVehicle();
          toast.success(response.message,  {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true
        });
        } else {
          console.error('Deletion was not successful:', response);
        }
      } catch (error) {
        console.error('Error deleting fare:', error);
      }
    }
  };

  const handleDeleteButton = (row) => {
    setSelectedVehicleId(row.id);
    setModalShow(true);
  };

  const handleEditButton = (row) => {
    setSelectedVehicle(row);
    setUpdateModalShow(true);
  };

  // Create table headers consisting of 4 columns.
  const header = [
    
    { title: "Vehicle No.", prop: "vehicle_no", isFilterable: true },
    { title: "Vehicle Type", prop: "type", isFilterable: true },
    { title: "Seating Capacity", prop: "seating_capacity", isFilterable: true },
    { title: "Driver Name", prop: 'driver_name', isFilterable: true },    
    { title: "End Point", prop: "location_name", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    { title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
            <i className="fa fa-trash-can"></i>
          </button>
        </div>
      )
    },
  ];

  const openModal = () => {
    setAddModalShow(true);
  };

  const labels = {
    beforeSelect: " ",
  };



  return (
    <Main>
      {updateModalShow && selectedVehicle && (
        <VehicleUpdate
          show={updateModalShow}
          onHide={() => setUpdateModalShow(false)}
          onSuccess={() => {
            setUpdateModalShow(false);

          }}
          selectedVehicle={selectedVehicle}
          onUpdateRec={fetchUpdatedVehicle}
        />
      )}

      {modalShow && (
        <Confirm
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleDeleteButton={() => handleDeleteAndNavigate()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="vehicleDelete"
        />
      )}

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <PageNavigations colLg={2} colClassName="d-flex mx-4" extrColumn={12} />
      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          {body ? (
            <DatatableWrapper
              body={body}
              headers={header}
              paginationOptionsProps={{
                initialState: {
                  rowsPerPage: 15,
                  options: [5, 10, 15, 20],
                },
              }}
            >
              <Row className="mb-4">
                <Col
                  xs={12}
                  lg={3}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                  <Filter />
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={5}
                  className="d-flex flex-col justify-content-start align-items-start"
                >
                  <PaginationOptions labels={labels} />
                  <div style={{ marginTop: "5px" }}>
                    <InfoPill left="Total Vehicle" right={body?.length} />
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={6}
                  lg={4}
                  className="d-flex flex-col justify-content-end align-items-end"
                >

                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    onClick={openModal}
                  >
                    New Vehicle
                  </Button>


                  <VehicleAdd
                    show={addModalShow}
                    onHide={() => setAddModalShow(false)}
                    onNewRecordCreated={fetchUpdatedVehicle}
                  />

                </Col>
              </Row>
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
              <Pagination />
            </DatatableWrapper>
          ) : (
            <ShimmerTable row={10} col={8} />
          )}
        </Col>
        <Col lg={2}></Col>
      </Row>
      <ToastContainer/>
    </Main>
  );
};

export default VehicleList;