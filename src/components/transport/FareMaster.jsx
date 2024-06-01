import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import schoolApi from '../../api/schoolApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FareMaster = (props) => {
    const [formData, setFormData] = useState({
        Fare: '',
        FromDistance: '',
        ToDistance: '',
        Status: '',
    });

    const [errors, setErrors] = useState({
        Fare: '',
        FromDistance: '',
        ToDistance: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    useEffect(() => {
        if (props.isUpdateMode && props.fareData) {
            setFormData({
                Fare: props.fareData.fare || '',
                FromDistance: props.fareData.fromdistance || '',
                ToDistance: props.fareData.todistance || '',
                Status: props.fareData.status || '',
            });
            setIsUpdateMode(true);
        } else {
            if (props.btnName === 'Create Fare') {
                setFormData({
                    Fare: '',
                    FromDistance: '',
                    ToDistance: '',
                    Status: '',
                });
                setIsUpdateMode(false);
            } else if (props.btnName === 'Update Fare') {
                setFormData({
                    Fare: props.fareData.fare || '',
                    FromDistance: props.fareData.fromdistance || '',
                    ToDistance: props.fareData.todistance || '',
                    Status: props.fareData.status || '',
                });
                setIsUpdateMode(true);
            }
        }
    }, [props.fareData, props.isUpdateMode, props.btnName]);

    const handleUpdate = async () => {
        const newErrors = { ...errors };
        let isValid = true;

        if (formData.Fare.trim() === '') {
            newErrors.Fare = 'Fare is required';
            isValid = false;
        } else {
            newErrors.Fare = '';
        }

        if (formData.FromDistance.trim() === '') {
            newErrors.FromDistance = 'From Distance is required';
            isValid = false;
        } else {
            newErrors.FromDistance = '';
        }

        if (formData.ToDistance.trim() === '') {
            newErrors.ToDistance = 'To Distance is required';
            isValid = false;
        } else {
            newErrors.ToDistance = '';
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        try {
            const fareIdToUpdate = props.fareData.id;
            const updatedFareData = { ...formData };
            const updatedFare = await schoolApi.updateFareMaster(
                fareIdToUpdate,
                updatedFareData
            );
            if (updatedFare.message) {
                toast.success(updatedFare.message, { style: { backgroundColor: '#1c8454', color: 'white' } });
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
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

        const newErrors = { ...errors };
        let isValid = true;

        if (formData.Fare.trim() === '') {
            newErrors.Fare = 'Fare is required';
            isValid = false;
        } else {
            newErrors.Fare = '';
        }

        if (formData.FromDistance.trim() === '') {
            newErrors.FromDistance = 'From Distance is required';
            isValid = false;
        } else {
            newErrors.FromDistance = '';
        }

        if (formData.ToDistance.trim() === '') {
            newErrors.ToDistance = 'To Distance is required';
            isValid = false;
        } else {
            newErrors.ToDistance = '';
        }

        if (!isValid) {
            setErrors(newErrors);
            return;
        }

        try {
            if (isUpdateMode) {
                handleUpdate();
            } else {
                const createdFare = await schoolApi.createFaremaster(formData);
                if (createdFare.message) {
                    console.log("sfsffea", createdFare.message)
                    toast.success(createdFare.message, { style: { backgroundColor: '#1c8454', color: 'white' } });
                } else {
                    toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
                }
                props.onFareCreated();
            }

            setFormData({
                Fare: '',
                FromDistance: '',
                ToDistance: '',
                Status: '',
            });
            setErrors({
                Fare: '',
                FromDistance: '',
                ToDistance: '',
            });

            // setTimeout(() => {
            //     setSuccessMessage('');
            // }, 3000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                toast.error(error.response.data.errors);
            } else {
                toast.error('Unknown error occurred. Please try again.', { style: { backgroundColor: '#f7040f', color: 'white' } });
            }
        }
    };

    return (
        <div>
            <Modal show={props?.show} centered aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton onClick={props?.handleCloseModal}>
                    <Modal.Title>
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && (
                        <div className="alert alert-success">{successMessage}</div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Fare</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="Fare"
                                        value={formData.Fare}
                                        onChange={(e) =>
                                            setFormData({ ...formData, Fare: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>From Distance</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="FromDistance"
                                        value={formData.FromDistance}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                FromDistance: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>To Distance</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="ToDistance"
                                        value={formData.ToDistance}
                                        onChange={(e) =>
                                            setFormData({ ...formData, ToDistance: e.target.value })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-3'>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Active"
                                            name="status"
                                            value="Active"
                                            checked={formData.Status === "Active"}
                                            onChange={(e) =>
                                                setFormData({ ...formData, Status: e.target.value })
                                            }
                                            required
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="InActive"
                                            name="status"
                                            value="InActive"
                                            checked={formData.Status === "Inactive"}
                                            onChange={(e) =>
                                                setFormData({ ...formData, Status: 'Inactive' })
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

export default FareMaster;
