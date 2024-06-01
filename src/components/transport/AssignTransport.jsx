/**
 * @author: Pawan Singh Sisodiya
 */

import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import schoolApi from "../../api/schoolApi";
import "react-toastify/dist/ReactToastify.css";

const AssignTransport = ({ assignTransportRecord, handleAssignTransport }) => {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [optionVehicals, setoptionVehicals] = useState([]);

  // const [assignTransportRecord, setAssignTransportReport] = useState({})

  useEffect(() => {
    async function init() {
      let vehicalList = await schoolApi.fetchVehicles();
      if (vehicalList) {
        let ar = [];
        vehicalList.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.vehicle_no + " " + item.type;
          ar.push(obj);
        });
        setoptionVehicals(ar);
      } else {
        setoptionVehicals([]);
      }
    }
    init();
  }, [reload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedRecord = { ...assignTransportRecord, [name]: value };
    handleAssignTransport(updatedRecord);
  };
  return (

    <Form className="mt-3">
      <Row>
        <Col lg={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-formatted">Vehicals</Form.Label>
              <Form.Select
                size="lg"
                name="transport_id"
                onChange={handleChange}
                value={assignTransportRecord?.transport_id}
              >
                <option value="">Select Vehical</option>
                {optionVehicals.map((vehicle, index) => (
                  <option key={index} value={vehicle.value}>
                    {vehicle.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Col>
        <Col lg={4}>
          <Form.Group>
            <Form.Label className="form-view-label">Status</Form.Label>
            {/* <Form.Control required type="text" value={newTitle.status}  name="status" placeholder="Enter Status"  onChange={handleChange} /> */}
            <Form.Select
              size="lg"
              name="route_direction"
              value={assignTransportRecord?.route_direction}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="One way">One way</option>
              <option value="Two way">Two way</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col lg={4}>
          <Form.Group>
            <Form.Label className="form-view-label">Distance</Form.Label>
            <Form.Control
              size="lg"
              type="number"
              name="distance"
              placeholder="Enter distance"
              value={assignTransportRecord?.distance}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Form.Group>
            <Form.Label className="form-view-label">Drop Location</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="drop_location"
              placeholder="Enter drop location"
              value={assignTransportRecord?.drop_location}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group>
            <Form.Label className="form-view-label">Fare Amount</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              name="fare_amount"
              placeholder="Enter fare amount"
              value={assignTransportRecord?.fare_amount}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default AssignTransport;
