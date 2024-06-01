
import React, { useEffect, useState } from 'react';
import Main from '../layout/Main';
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import schoolApi from '../../api/schoolApi';
import { ShimmerTable } from 'react-shimmer-effects';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader, } from "react-bs-datatable";
import { useNavigate } from 'react-router-dom';
import Confirm from '../Confirm';
import LocationMaster from "./LocationMaster";
import InfoPill from '../InfoPill';
import PubSub from "pubsub-js"
const LocationMasterList = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [locations, setLocations] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [btnName, setBtnName] = useState('Create Location');
  const [title, setTitle] = useState('Create Location');

  const [locationToUpdate, setlocationToUpdate] = useState(null);

  const [selectedLocationId, setSelectedLocationId] = useState(null); // Add state to track the selected location ID
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const fetchUpdatedLocations = async () => {
    try {
      const locationData = await schoolApi.getAllLocation();
      if (locationData) {
        setLocations(locationData);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchUpdatedLocations()
  }, []);


  const handleEditButton = (row) => {
    setlocationToUpdate(row);
    setIsModal(true);

    setBtnName('Update Location');
    setTitle('Update Location');


  }
  const handleDeleteButton = (row) => {
    setSelectedLocationId(row.id);

    setModalShow(true);

  }
  const handleDeleteAndNavigate = async () => {
    if (selectedLocationId) {
      try {
        const response = await schoolApi.deleteLocation(selectedLocationId);

        if (response && response.message === "Location deleted successfully") {
          const updatedLocations = locations.filter(location => location.id !== selectedLocationId);
          setLocations(updatedLocations);

          setModalShow(false);
          navigate('/transportation/locationlist');

          // Set the success message
          PubSub.publish('RECORD_SAVED_TOAST', {
            title: 'Record Deleted',
            message: 'Record Deleted successfully'
          });
        } else {
          console.error('Deletion was not successful:', response);
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const header = [
    // { title: "ID", prop: "id", isFilterable: true },
    { title: "Locations", prop: "location", isFilterable: true },
    { title: "Distance", prop: "distance", isFilterable: true },
    { title: "Status", prop: "status", isFilterable: true },
    {
      title: 'Action', prop: '', isFilterable: true, cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary mx-2" onClick={() => handleEditButton(row)}>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button className="btn btn-sm btn-danger mx-2" onClick={() => handleDeleteButton(row)}>
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </div>
      )
    },
  ];
  const labels = {
    beforeSelect: " ",
  };

  const handleShowModal = () => {
    setIsUpdateMode(false); // Set isUpdateMode to false
    setBtnName('Create Location');
    setTitle('Create Location');
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
    fetchUpdatedLocations();

  };

  const handleLocationCreated = () => {
    // Close the modal and navigate to the farelist
    setIsModal(false);
    fetchUpdatedLocations();
    // navigate('/transportation/locationlist');
    // window.location.reload();
  };



  return (
    <Main>
      {modalShow && (
        <Confirm
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleDeleteButton={() => handleDeleteAndNavigate()}
          title="Confirm delete?"
          message="You are going to delete the record. Are you sure?"
          table="locationMaster"
        />
      )}

      {isModal && (
        <LocationMaster
          show={isModal}
          handleCloseModal={handleCloseModal}
          onLocationCreated={handleLocationCreated}
          locationData={locationToUpdate} // Pass the fare data to update
          isUpdateMode={isUpdateMode}
          btnName={btnName}
          title={title}
        ></LocationMaster>
      )
      }



      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          {locations ? (
            <DatatableWrapper
              body={locations}
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
                  <div style={{ "marginTop": "5px" }}>
                    <InfoPill left="Total Locations" right={locations?.length} />

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
                    onClick={() => handleShowModal()}
                  >
                    New Location
                  </Button>
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
    </Main>
  );
};

export default LocationMasterList;
