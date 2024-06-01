import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import schoolApi from '../../api/schoolApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RouteUpdate = ({ show, onHide, onSuccess, selectedVehicle, onUpdateRec }) => {

    const id = selectedVehicle.id
    console.log("updatedataarf", selectedVehicle)

    const [formData, setFormData] = useState({
        locationid: null,
        transportid: null,
        order_no: '',
    });

    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);


    useEffect(() => {
        if (selectedVehicle) {

            setFormData({
                transportid: {
                    value: selectedVehicle.transportid || "",
                    label: selectedVehicle.transport_name || "",
                },

                order_no: selectedVehicle.order_no || "",

                locationid: {
                    value: selectedVehicle.locationid || "",
                    label: selectedVehicle.location_name || "",
                },
            });
        }
    }, [selectedVehicle]);

    useEffect(() => {
        async function fetchVehicle() {
            try {
                const vehicleRoutes = await schoolApi.getAllVehicles();
                const routeOptions = vehicleRoutes.map((vehicle) => ({
                    value: vehicle.id,
                    label: vehicle.vehicle_no,
                }));
                routeOptions.unshift({ value: null, label: 'None' });
                setVehicleOptions(routeOptions);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        }

        fetchVehicle();
    }, []);



    useEffect(() => {
        async function fetchLocations() {
            try {
                const locations = await schoolApi.getAllLocation();
                const locationOptions = locations.map((location) => ({
                    value: location.id,
                    label: location.location,
                }));
                locationOptions.unshift({ value: null, label: 'None' });
                setLocationOptions(locationOptions);

            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }

        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.locationid === null || formData.transportid === null) {
            console.error('Please provide locationid and transportid');
            return;
        }

        try {
            const upRoutes = await schoolApi.updateRoute(id, {
                locationid: formData.locationid.value,
                transportid: formData.transportid.value,
                order_no: formData.order_no,

            });

            onSuccess();
            onHide();
            onUpdateRec();

            if (upRoutes.message) {
                toast.success(upRoutes.message, { style: { backgroundColor: '#1c8454', color: 'white' } });
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }

        } catch (error) {
            console.error('Error updating vehicle:', error, { style: { backgroundColor: '#f7040f', color: 'white' } });

            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors);
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return (
        <div>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>

                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Vehicle No.</Form.Label>

                                    <Select
                                        placeholder="Select vehicle no"
                                        name="transportid"
                                        value={formData.transportid}
                                        onChange={(selectedOption) =>
                                            setFormData({ ...formData, transportid: selectedOption })
                                        }
                                        options={vehicleOptions}
                                    />
                                </Form.Group>

                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Location Name</Form.Label>
                                    <Select
                                        placeholder="Select location name"
                                        name="locationid"
                                        value={formData.locationid}
                                        onChange={(selectedOption) =>
                                            setFormData({ ...formData, locationid: selectedOption })
                                        }
                                        options={locationOptions}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Order No</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="order_no"
                                        placeholder="Order no"
                                        value={formData.order_no}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-between mt-3">

                            <Button type="submit">Update</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
        </div>
    );
};

export default RouteUpdate;