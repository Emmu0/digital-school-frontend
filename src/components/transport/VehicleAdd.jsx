import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import schoolApi from '../../api/schoolApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VehicleAdd = ({ show, onHide, onNewRecordCreated }) => {

    const initialFormData = {
        driver_id: '',
        vehicle_no: '',
        type: '',
        seating_capacity: '',
        status: null,
        end_point: null,
    };
    const [formData, setFormData] = useState(initialFormData);
    const [successMessage, setSuccessMessage] = useState(null);
    const [driverOptions, setDriverOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.type || !formData.vehicle_no) {
            toast.error('Please fill in the Type and Vehicle Number fields..',
            {
                position: toast.POSITION.TOP_CENTER,
                hideProgressBar: true,
                theme : 'colored'
            });
            return;
        }
        try {
             schoolApi.createVehicle(formData).then((result)=>{
                if (result.success) {
                    onHide();
                    onNewRecordCreated();
                    setFormData(initialFormData);
                    toast.success(result.message,  {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                    });
                } else {
                    toast.error(result.message, { style: { backgroundColor: '#ffffff'} });
                }
            })
            
            
        } catch (error) {
            console.error('Error creating vehicle:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors);
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const drivers = await schoolApi.fetchDrivers();
                const driverOptions = drivers.map((driver) => ({
                    value: driver.id,
                    label: driver.staffname,
                }));
                setDriverOptions(driverOptions);
                driverOptions.unshift({ value: null, label: 'None' });
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
                setLocationOptions(locationOptions);
                locationOptions.unshift({ value: null, label: 'Select End Point' });
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }

        fetchLocations();
    }, []);

    return (
        <>
            <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered onHide={() => {
                onHide();
                setFormData(initialFormData);
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>New Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* {error && <div className="alert alert-danger">{error}</div>} */}
                    <Container className="view-form">
                        {/* {successMessage && <div className="alert alert-success">{successMessage}</div>} */}
                        <Form onSubmit={handleSubmit}>
                            <Row name="row1">
                                <Col lg={6}>
                                    <Form.Group>
                                        <Form.Label>Vehicle Type</Form.Label>
                                        <Form.Select
                                            required
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Select Vehical Type--</option>
                                            <option value="bus">Bus</option>
                                            <option value="van">Van</option>
                                        </Form.Select>
                                    </Form.Group>


                                </Col>
                                <Col lg={6}>
                                    <Form.Group>
                                        <Form.Label>Vehicle Driver</Form.Label>
                                        <Select
                                            placeholder="Select Driver"
                                            name="driver_id"
                                            onChange={(selectedOption) =>
                                                setFormData({ ...formData, driver_id: selectedOption ? selectedOption.value : null })
                                            }
                                            options={driverOptions}
                                            value={driverOptions.find(option => option.value === formData.driver_id)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row name="row2">
                                <Col lg={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="formBasicVehicleNumber">Vehicle Number</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="vehicle_no"
                                            placeholder="Enter Vehicle Number"
                                            value={formData.vehicle_no}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                </Col>
                                <Col lg={6}>
                                    <Form.Group>
                                        <Form.Label>End Point</Form.Label>
                                        <Select
                                            placeholder="Select End point"
                                            name="end_point"
                                            onChange={(selectedOption) =>
                                                setFormData({ ...formData, end_point: selectedOption ? selectedOption.value : null })
                                            }
                                            options={locationOptions}
                                            value={locationOptions.find(option => option.value === formData.end_point)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row name="row3">
                                <Col lg={6}>
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
                                <Col lg={6}>
                                    <Form.Group>
                                        <Form.Label>Status</Form.Label>
                                        <Row lg={8}>
                                            <Col lg={4}>
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Active"
                                                    name="status"
                                                    value="Active"
                                                    checked={formData.status === 'Active'}
                                                    onChange={() => setFormData({ ...formData, status: 'Active' })}
                                                    required
                                                />
                                            </Col>
                                            <Col lg={4}>
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Inactive"
                                                    name="status"
                                                    value="Inactive"
                                                    checked={formData.status === 'Inactive'}
                                                    onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        onHide();
                        setFormData(initialFormData);
                    }}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </>
    );
};

export default VehicleAdd;