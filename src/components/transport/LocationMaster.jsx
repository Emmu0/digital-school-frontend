import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import schoolApi from '../../api/schoolApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LocationMaster = (props) => {

    const [formData, setFormData] = useState({
        location: '',
        distance: '',
        status: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    useEffect(() => {
        if (props.isUpdateMode && props.locationData) {
            setFormData({
                location: props.locationData.location || '',
                distance: props.locationData.distance || '',
                status: props.locationData.status || '',
            });
            setIsUpdateMode(true);
        } else {
            // Reset the formData based on btnName
            if (props.btnName === 'Create Location') {
                setFormData({
                    location: '',
                    distance: '',
                    status: '',
                });
                setIsUpdateMode(false);
            } else if (props.btnName === 'Update Location') {
                // Fill the form with existing data if it's an update operation
                setFormData({
                    location: props.locationData.location || '',
                    distance: props.locationData.distance || '',
                    status: props.locationData.status || '',
                });
                setIsUpdateMode(true);
            }
        }
    }, [props.btnName, props.isUpdateMode, props.locationData]);

    const handleUpdate = async () => {
        try {
            const locationMasterIdToUpdate = props.locationData.id;
            const updatedLocationData = {
                ...formData,
            };
            if (!updatedLocationData.location.trim()) {
                throw new Error('Location cannot be empty');
            }

            if (updatedLocationData.distance === '') {
                throw new Error('Distance cannot be empty');
            }
            const updatedLocation = await schoolApi.updateLocationMaster(
                locationMasterIdToUpdate,
                updatedLocationData
            );
            if (updatedLocation.message) {
                toast.success(updatedLocation.message, { style: { backgroundColor: '#1c8454', color: 'white' } });
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            };
            setIsUpdateMode(false);
            props.handleCloseModal();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors);
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isUpdateMode) {
                handleUpdate();
            } else {
                const createdLocation = await schoolApi.createLocationmaster(formData);
                if (createdLocation.message) {
                    console.log("sfsffea", createdLocation.message)
                    toast.success(createdLocation.message, { style: { backgroundColor: '#1c8454', color: 'white' } });
                } else {
                    toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
                }
                props.onLocationCreated();
            }

            setFormData({
                location: '',
                distance: '',
                status: '',
            });

            // Clear the success message after 3 seconds
            // setTimeout(() => {
            //     setSuccessMessage('');
            // }, 3000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors);
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
            console.error('Error creating/updating Location:', error);
        }
    };

    return (


        <div>
            <Modal show={props?.show} centered aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton onClick={props?.handleCloseModal}>
                    <Modal.Title> {props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({ ...formData, location: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label> Distance</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="distance"
                                        value={formData.distance}
                                        onChange={(e) =>
                                            setFormData({ ...formData, distance: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>

                            <Col md={6} className='mt-4 mb-2'>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Active"
                                            name="status"
                                            value="Active"
                                            checked={formData.status === "Active"}
                                            onChange={(e) =>
                                                setFormData({ ...formData, status: 'Active' })
                                            }
                                            required
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Inactive"
                                            name="status"
                                            value="Inactive"
                                            checked={formData.status === "Inactive"}
                                            onChange={(e) =>
                                                setFormData({ ...formData, status: 'Inactive' })
                                            }
                                            required
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-right mt-4">
                            {isUpdateMode ? (
                                <Button variant="primary" onClick={handleUpdate}>
                                    Update
                                </Button>
                            ) : (
                                <Button type="submit" variant="primary">
                                    {props.btnName}
                                </Button>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
        </div>


    );
};

export default LocationMaster;
