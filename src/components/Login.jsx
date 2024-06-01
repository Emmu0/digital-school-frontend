import React, {useState} from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import authApi from "../api/authApi";
import home from "../resources/img/home.png"
import login from "../resources/img/login.png"


const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({email: "", password : ""});
  const [show, setShow] = React.useState(false);
  const [errorMessage,setErrorMessage] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(credentials)


    const result = await authApi.login(credentials.email, credentials.password)
    if (result.success) {
      sessionStorage.setItem("token", result.authToken);
      let data =  await authApi.fetchMyImage();
      console.log('data',data)
      if(data)
      sessionStorage.setItem("myimage", window.URL.createObjectURL(data));
      else
      sessionStorage.setItem("myimage", "https://www.w3schools.com/howto/img_avatar.png");
      navigate("/");
    }else {
      
      setShow(true);
      setErrorMessage(result.errors);

    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <Row className="login-form p-3 mt-5">
        <Col lg={6}>
          <img src="/login_banner.jpg" style={{display: "flex", alignItems: "center",marginTop: "105px"}} />
        </Col>
        <Col lg={6} className="login-section">
          <h3 className="text-center mb-2"></h3>
          <div className="p-5">
            <Form onSubmit={handleSubmit}>
              <div className="mb-2">
              <h3 className="text-center mb-2"> <img src="/comonLogoSchool.png" style={{width:"auto", height:"200px"}}/></h3>
              </div>
              <Alert variant="danger" show = {show}>{errorMessage}</Alert>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  value={credentials.email}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  value={credentials.password}
                />
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
      <center className="m-4"><img src="indicrm.png" /></center>
    </Container>
  );
};

export default Login;
