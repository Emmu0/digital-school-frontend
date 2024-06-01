import React from "react";
import { Col, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="p-3 text-white">
      <Row className="g-0">
        <Col lg={4} className="pt-2">
          © 2023 Copyright
          <a className="text-white" href="https://ibirdsservices.com/">
            {" "}
            iBirds Services Pvt. Ltd.
          </a>
        </Col>
        <Col lg={4}></Col>
        <Col lg={4}>
          <div>
            <a
              className="btn btn-outline-light btn-floating m-1 text-white"
              role="button"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            <a className="btn btn-outline-light btn-floating m-1" role="button">
              <i className="fab fa-twitter"></i>
            </a>

            <a className="btn btn-outline-light btn-floating m-1" role="button">
              <i className="fab fa-google"></i>
            </a>

            <a className="btn btn-outline-light btn-floating m-1" role="button">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
