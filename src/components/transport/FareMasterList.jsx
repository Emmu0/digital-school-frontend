
import React, { useEffect, useState } from 'react';
import Main from '../layout/Main';
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import schoolApi from '../../api/schoolApi';
import { ShimmerTable } from 'react-shimmer-effects';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader, } from "react-bs-datatable";
import { useNavigate } from 'react-router-dom';
import Confirm from '../Confirm';
import FareMaster from './FareMaster';
import InfoPill from '../InfoPill';
import PubSub from "pubsub-js"

const FareMasterList = () => {
    const navigate = useNavigate();
    const [Fares, setFares] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedFareId, setSelectedFareId] = useState(null);
    const [isModal, setIsModal] = useState(false);
    const [btnName, setBtnName] = useState('Create Fare');
    const [title, setTitle] = useState('Create Fare');

    const [fareToUpdate, setFareToUpdate] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const fetchUpdatedFare = async () => {
        try {
            const fareData = await schoolApi.getAllFares();
            if (fareData) {
                setFares(fareData);
            }
        } catch (error) {
            console.error('Error fetching fare:', error);
        }
    };

    useEffect(() => {
        fetchUpdatedFare()
    }, []);


    const handleEditButton = (row) => {
        setFareToUpdate(row); // Set the fare data you want to update
        setIsModal(true); // Open the modal
        setBtnName('Update Fare');
        setTitle('Update Fare');
    };


    const handleDeleteButton = (row) => {
        setSelectedFareId(row.id);
        setModalShow(true);
    };

    const handleDeleteAndNavigate = async () => {
        if (selectedFareId) {
            try {
                const response = await schoolApi.deleteFare(selectedFareId);

                if (response && response.message === "fare deleted successfully") {
                    const updatedFares = Fares.filter(fare => fare.id !== selectedFareId);
                    setFares(updatedFares);

                    setModalShow(false);

                    // Set the success message
                    PubSub.publish('RECORD_SAVED_TOAST', {
                        title: 'Record Deleted',
                        message: 'Record Deleted successfully'
                      });
                } else {
                    console.error('Deletion was not successful:', response);
                }
            } catch (error) {
                console.error('Error deleting fare:', error);
            }
        }
    };

    const header = [
        // { title: "ID", prop: "id", isFilterable: true },
        { title: "Fare", prop: "fare", isFilterable: true },
        { title: "FromDistance", prop: "fromdistance", isFilterable: true },
        { title: "ToDistance", prop: "todistance", isFilterable: true },
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
        setBtnName('Create Fare');
        setTitle('Create Fare');
        setIsModal(true);
    };

    const handleCloseModal = () => {
        setIsModal(false)
        fetchUpdatedFare()

    };

    const handleFareCreated = () => {
        // Close the modal and navigate to the farelist
        setIsModal(false);
        fetchUpdatedFare()
        //navigate('/transportation/farelist');
        //window.location.reload();
    };
    const headerStyle = {
        backgroundColor: 'lightblue',
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
                    table="fareMaster"
                />
            )}

            {isModal && (
                <FareMaster
                    show={isModal}
                    handleCloseModal={handleCloseModal}
                    onFareCreated={handleFareCreated}
                    fareData={fareToUpdate} // Pass the fare data to update
                    isUpdateMode={isUpdateMode}
                    btnName={btnName}
                    title={title}
                ></FareMaster>
            )
            }

            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    {successMessage}
                </Alert>
            )}

            <Row className="g-0">
                <Col lg={12} className="px-lg-4">
                    {Fares ? (
                        <DatatableWrapper
                            body={Fares}
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
                                        <InfoPill left="Total Fares" right={Fares?.length} />

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
                                        New Fare
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped className="data-table">
                                <TableHeader headerStyles={headerStyle} />
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

export default FareMasterList;


