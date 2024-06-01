import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import schoolApi from '../../api/schoolApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RouteAdd = (props) => {
    console.log('props=======>', props);
    const [formData, setFormData] = useState({
        transportid: '',
        order_no: '',
        locationid: null,
    });
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);

    useEffect(() => {
        if (props.selectedRoute) {
            setFormData({
                transportid: props.selectedRoute.transportid,
                order_no: props.selectedRoute.order_no,
                locationid: props.selectedRoute.locationid,
          });
        } else {
            setFormData({
                transportid: '',
                order_no: '',
                locationid: null,
            });
        }
      }, [props.selectedRoute]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.order_no) {
            return toast.error('Please fill in the Order Number fields.',{ position: toast.POSITION.TOP_CENTER, 
                theme:"colored", 
                hideProgressBar:true});
        }
        try {
            if( props.selectedRoute.id){
                const upRoutes = await schoolApi.updateRoute(props.selectedRoute.id,formData);
                props.handleCloseModal();
                setFormData({
                    transportid: '',
                    order_no: '',
                    locationid: null,
                });
                if (upRoutes.message) {
                    toast.success(upRoutes.message,{
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                    });
                    props.fetchRoute();
                } else {
                    toast.error('Unknown error occurred. Please try again.',{
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                    });
                }
            }else{
                const createdRouteData = await schoolApi.createRoute(formData);
                props.handleCloseModal();
                setFormData({
                    transportid: '',
                    order_no: '',
                    locationid: null,
                });
                if (createdRouteData.message) {
                    toast.success(createdRouteData.message, {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                    });
                    props.fetchRoute();
                } else {
                    toast.error('Unknown error occurred. Please try again.');
                }
            }
        } catch (error) {
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
        async function fetchVehicle() {
            try {
                const vehicleRoutes = await schoolApi.getAllVehicles();
                console.log('vehicleRoutes@@@=>', vehicleRoutes);
                const routeOptions = vehicleRoutes.map((vehicle) => ({
                    value: vehicle.id,
                    label: vehicle.vehicle_no,
                }));
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
                console.log('locations@@@=>', locations);
                const locationOptions = locations.map((location) => ({
                    value: location.id,
                    label: location.location,
                }));
                setLocationOptions(locationOptions);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        }
        fetchLocations();
    }, []);


    return (
        <div>
            <Modal 
              show={props.show} 
              centered
              backdrop="static"
              aria-labelledby="contained-modal-title-vcenter"
               onHide={() => {
                setFormData({
                    transportid: '',
                    order_no:'',
                    locationid:null,
                });
                props.handleCloseModal();
              }}
                   >
                <Modal.Header closeButton>
                    <Modal.Title>New Route</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <Form.Group>
                                    <Form.Label>Vehicle No</Form.Label>
                                     <Form.Select
                                        name="transportid"
                                        onChange={handleChange}
                                        value={formData.transportid || ''}
                                     >
                                    <option key="default" value="">
                                                 -- Select Vehicle --
                                    </option>
                                            {vehicleOptions &&
                                                vehicleOptions.map((res) => (
                                                <option key={res.value} value={res.value}>
                                                  {res.label}
                                            </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className='mt-4'>
                                    <Form.Label>Location Name</Form.Label>
                                     <Form.Select
                                        name="locationid"
                                        onChange={handleChange}
                                        value={formData.locationid || ''}
                                     >
                                    <option key="default" value="">
                                                 -- Select loaction name --
                                    </option>
                                            {locationOptions &&
                                                locationOptions.map((res) => (
                                                <option key={res.value} value={res.value}>
                                                  {res.label}
                                            </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col" >
                                <Form.Group>
                                    <Form.Label htmlFor="formBasicVehicleNumber">Order Number</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="order_no"
                                        placeholder="Enter Order Number"
                                        value={formData.order_no || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                         props.onHide();
                         setFormData({
                             transportid: '',
                             order_no: '',
                             locationid: null,
                         });
                    }}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        {props.selectedRoute.id ? "Update" : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer/>
        </div>

    )
}

export default RouteAdd