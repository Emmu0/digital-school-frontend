import React, { useEffect, useState } from 'react'
import Main from "../layout/Main";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import schoolApi from '../../api/schoolApi';
import { ShimmerTable } from 'react-shimmer-effects';
import {
    DatatableWrapper, Filter, Pagination,
    PaginationOptions, TableBody, TableHeader,
} from "react-bs-datatable";
import InfoPill from '../InfoPill';
import RouteAdd from './RouteAdd';
import Confirm from '../Confirm';
import { useNavigate } from 'react-router-dom';
import RouteUpdate from './RouteUpdate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RouteList = () => {
    const navigate = useNavigate();
    const [Route, setRoute] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState({});


    const fetchRoute = async () => {
        try {
            const routeData = await schoolApi.getAllRoute();
            if (routeData) {
                setRoute(routeData);
            }
        } catch (error) {
            console.error('Error fetching fare:', error);
        }
    };

    useEffect(() => {
        fetchRoute()
    }, []);

    const handleDeleteAndNavigate = async () => {
        if (selectedRouteId) {
            try {
                const response = await schoolApi.deleteRoute(selectedRouteId);

                if (response && response.message === "Route deleted successfully") {
                    const updatedRoute = Route.filter(fare => fare.id !== selectedRouteId);
                    setRoute(updatedRoute);
                    
                    setModalShow(false);
                    
                    fetchRoute();
                    toast.success(response.message, {
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


    const header = [
        { title: "Location Name", prop: "location_name", isFilterable: true },
        { title: "Vehicle No.", prop: "transport_name", isFilterable: true },
        { title: "Order No.", prop: "order_no", isFilterable: true },
        {
            title: 'Action', prop: '', isFilterable: true, cell: (row) => (
                <div>
                    <button className="btn btn-sm btn-primary mx-2"
                        onClick={() => handleEditButton(row)}

                    >
                        <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button className="btn btn-sm btn-danger mx-2"
                        onClick={() => handleDeleteButton(row)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            )
        },

    ];

    const handleDeleteButton = (row) => {
        setSelectedRouteId(row.id);
        setModalShow(true);
    };

    const handleEditButton = (row) => {
        setSelectedRoute(row);
        setAddModalShow(true);
    };

    const headerStyle = {
        backgroundColor: 'lightblue',
    };

    const labels = {
        beforeSelect: " ",
    };
    const openModal = () => {
        setSelectedRoute({});
        setAddModalShow(true);
    };

    return (
        <Main>
    
             {addModalShow && <RouteAdd
                show={addModalShow}
                handleCloseModal={() => setAddModalShow(false)}
                fetchRoute = {fetchRoute}
                selectedRoute = {selectedRoute}
            />}

            {modalShow && (
                <Confirm
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    handleDeleteButton={() => handleDeleteAndNavigate()}
                    title="Confirm delete?"
                    message="You are going to delete the record. Are you sure?"
                    table="RouteDelete"
                />
            )}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    {successMessage}
                </Alert>
            )}
            <Row className="g-0">
                <Col lg={12} className="px-lg-4">
                    {Route ? (
                        <DatatableWrapper
                            body={Route}
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
                                        <InfoPill left="Total Routes" right={Route?.length} />

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
                                        New Route
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
            <ToastContainer/>
        </Main>
    )
}

export default RouteList