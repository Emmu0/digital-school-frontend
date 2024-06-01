import React, { useState } from "react";
import { Button, Col, Container, Row,Form } from "react-bootstrap";
import dbApi from "../api/dbApi";

const ChangePassword = ({userId}) => {
    console.log('==',userId);
    userId = 'd7c04d66-7773-44c3-844c-eb2353dbcd88';

    const [user, setUser] = useState({"id":userId });


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };


    async function handleSubmit(e) {
        e.preventDefault();
        console.log('userId',userId);
        
        console.log('user',user)
        if(user.password === user.confirmpassword){
            const result = await dbApi.updateUser(user);
            console.log(result)
        }
        
}


  return (
    <div>
       <Container className="view-form">
            <Row>
                <Col></Col>
                <Col lg={8}>
                    <Form className="mt-3" onSubmit={handleSubmit}>
                    <Row className="view-form-header align-items-center">
                            <Col lg={3}>
                              Change Password
                            </Col>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Button className="btn-sm mx-2" onClick={handleSubmit}>
                                    Update
                                </Button>
                            </Col>
                        </Row>

                        <Row>
                            <Col >
                               
                                <Form.Group className="mx-3" controlId="formBasicFirstName">
                                    <Form.Label
                                        className="form-view-label"
                                        htmlFor="formBasicFirstName"
                                    >
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter Your password"
                                        onChange={handleChange} 
                                    />
                                </Form.Group>
                                </Col>
                               
                        </Row>
                        <Row>                           
                            <Col>
                                <Form.Group className="mx-3" controlId="formBasicPhone">
                                    <Form.Label
                                        className="form-view-label"
                                        htmlFor="formBasicPhone"
                                    >
                                       Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmpassword"
                                        placeholder="Enter confirm password"
                                       
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
           
            
        </Container>
        {/*<Container>
            <Row>
                <Col lg={12} className=" p-3 d-flex justify-content-center p">
                    <Button className="mx-2" onClick={handleSubmit}>
                        Save
                    </Button>
                                
                </Col>
            </Row>
  </Container>*/}
        
    </div>
  );
};

export default ChangePassword;