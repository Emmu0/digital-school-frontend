import React, { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import schoolApi from '../../api/schoolApi';
import authApi from '../../api/authApi';

const CompanyModel = ({ show, Onhide }) => {
const [modules, setModules] = useState([])


    useEffect(() => {
        if(modules && authApi.companyDetail().companyid){
            schoolApi.getAllModules(authApi.companyDetail().companyid).then((result) => {
                if(result.length > 0){
                    setModules(result)
                }
             }).catch((err) => {
                console.log("company module hase some error =>",err);
             });;
        }
         
    }, [])
    
    return (
        <>
            <Modal
                show={show}
                backdrop="static"
                centered
                aria-labelledby="contained-modal-title-vcenter"
                onHide={() => Onhide()}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">
                        Create Company
                    </Modal.Title>
                </Modal.Header>
                <Form className="mt-3"
                //  onSubmit={()=>handleSubmit()}
                >
                    <Modal.Body>
                        <Row>
                            <Col lg={6} >
                                <Form.Group className="mx-3">
                                    <Form.Label className="form-view-label">Company Name</Form.Label>
                                    <Form.Select
                                        name="companyName"
                                        // onChange={handleChange}
                                    // required
                                    >
                                        <option key="default" value="">
                                            -- Select Company Name --
                                        </option>
                                        {/* {allModules &&
                                            allModules.map((res) => (
                                                <option key={res.id} value={res.id}>
                                                    {res.name}
                                                </option>
                                            ))} */}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col lg={6} className="mt-1">
                                <Form.Group>
                                    <Form.Label>Module Name</Form.Label>
                                    <Form.Select
                                        name="moduleName"
                                        // onChange={handleChange}
                                        // value={moduleData.parent_module}
                                    // required
                                    >
                                        <option key="default" value="">
                                            -- Select Module Name --
                                        </option>
                                        {modules &&
                                            modules.map((res) => (
                                                <option key={res.id} value={res.id}>
                                                    {res.name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary"
                        // onClick={() =>ApiHandler()}
                        >
                            Save
                        </Button>
                    </Modal.Footer>
                </Form >
            </Modal>
        </>
    )
}

export default CompanyModel