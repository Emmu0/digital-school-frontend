import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import schoolApi from '../../api/schoolApi';
import { toast } from 'react-toastify';


const VehicleUpdate = ({ show, onHide, onSuccess, selectedVehicle, onUpdateRec }) => {
    
    console.log("selectedVehicleId", selectedVehicle);

    console.log("selectedVehicleId", selectedVehicle.id);
    const id = selectedVehicle.id
    const [formData, setFormData] = useState({
        driver_id: null,
        vehicle_no: '',
        type: '',
        seating_capacity: '',
        status: 'Active',
        end_point: null,
    });

    const [driverOptions, setDriverOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);


    useEffect(() => {
        if (selectedVehicle) {

            setFormData({
                driver_id: {
                    value: selectedVehicle.driver_id || "",
                    label: selectedVehicle.driver_name || "",
                },
                vehicle_no: selectedVehicle.vehicle_no || "",
                type: selectedVehicle.type || "",
                seating_capacity: selectedVehicle.seating_capacity || "",
                status: selectedVehicle.status || "",
                end_point: {
                    value: selectedVehicle.end_point|| "",
                    label: selectedVehicle.location_name || "",
                },
            });
        }
    }, [selectedVehicle]);
    console.log('setFormData=======????', formData);

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const drivers = await schoolApi.fetchDrivers();
                const driverOptions = drivers.map((driver) => ({
                    value: driver.id,
                    label: driver.firstname,
                }));
                driverOptions.unshift({ value: null, label: 'None' });
                setDriverOptions(driverOptions);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        }

        fetchDrivers();
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

        if (formData.end_point === null || formData.driver_id === null) {
            console.error('Please provide end_point and driver_id');
            return;
        }

        try {
            await schoolApi.updateVehicle(id, {
                driver_id: formData.driver_id.value,
                vehicle_no: formData.vehicle_no,
                type: formData.type,
                seating_capacity: formData.seating_capacity,
                status: formData.status,
                end_point: formData.end_point.value,
            }).then((result) => {

                console.log(result, 'result **');
                if (result.success) {
                toast.success(result.message,  {
                    position: toast.POSITION.TOP_CENTER,
                    hideProgressBar: true
                });
                    onSuccess();
                    onHide();
                    onUpdateRec();
                }else{
                    toast.error(result.message,
                        { style: { backgroundColor: '#fefdfe'} });
                }
            })




        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Vehicle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Form onSubmit={handleSubmit} noValidate>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Vehicle Type</Form.Label>
                                    <Form.Select
                                        //required
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="bus">Bus</option>
                                        <option value="van">Van</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Vehicle Driver</Form.Label>
                                    <Select
                                        placeholder="Select Driver"
                                        name="driver_id"
                                        value={formData.driver_id}
                                        onChange={(selectedOption) =>
                                            setFormData({ ...formData, driver_id: selectedOption })
                                        }
                                        options={driverOptions}
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Vehicle Number</Form.Label>
                                    <Form.Control
                                        //required
                                        type="text"
                                        name="vehicle_no"
                                        placeholder="Enter Vehicle Number"
                                        value={formData.vehicle_no}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>End Point</Form.Label>
                                    <Select
                                        placeholder="Select End point"
                                        name="end_point"
                                        value={formData.end_point}
                                        onChange={(selectedOption) =>
                                            setFormData({ ...formData, end_point: selectedOption })
                                        }
                                        options={locationOptions}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Vehicle Capacity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="seating_capacity"
                                        placeholder="Vehicle Capacity"
                                        value={formData.seating_capacity}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Active"
                                            name="status"
                                            value="Active"
                                            checked={formData.status === 'Active'}
                                            onChange={() => setFormData({ ...formData, status: 'Active' })}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Inactive"
                                            name="status"
                                            value="Inactive"
                                            checked={formData.status === 'Inactive'}
                                            onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default VehicleUpdate;