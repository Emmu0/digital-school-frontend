//Add by Aamir khan
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import React, { useState } from "react";
import schoolApi from "../../api/schoolApi";

const FilterComponent = ({ setBody }) => {
  const [filterData, setFilterData] = useState({});
  const [flaterData, setflaterData] = useState({});

  const handleFilterChange = (event) => {
    setFilterData({
      ...filterData,
      [event.target.name]: event.target.value,
    });
  };

  const handlefilter = async (event) => {
    event.preventDefault();
    const text = event.target.value;
    setflaterData({
      ...flaterData,
      [event.target.name]: event.target.value,
    });
  };

  console.log('flaterDataflaterData-->', flaterData);


  //Add by Aamir khan 
  const SearchButton = async () => {

    try {
    
      const result = await schoolApi.getSubjectRecordName(flaterData);
      console.log('resultData', result);

      console.log('result Data ==>', result);

      if (result) {
        setBody(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // if (result) {
    //   setBody(result);
    // }
  };


  return (
    <Card className="filterCard">
      <Card.Body>
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid black",
            height: "2.6rem",
            display: "flex",
            width: "210px",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "-9px", marginBottom: "20px",

            boxShadow: "7 9px 9px rgba(931, 835, 238, 6.9)", // Example shadow values

          }}
        >
          <Form.Label className="form-view-label mb-2">FILTER</Form.Label>
        </div>
        <Form>
          <Form.Group as={Row} className="mt-3">
            <Form.Label column lg="6">
              Type Name
            </Form.Label>
            <Col lg="12">
              <Form.Select
                name="type"
                onChange={handlefilter}
                className="form-control"
              >
                <option value=''> --Select Type-- </option>
                <option value="General">General</option>
                <option value="Optional">Optional</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mt-3">
            <Form.Label column lg="6">
              Status
            </Form.Label>
            <Col lg="12">
              <Form.Select
                name="status"
                onChange={handlefilter}
                className="form-control"
              >
                <option value=''>-- Select Status --</option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <pawan_singh></pawan_singh>
          <Button
            className="filterButton mt-4"
            variant="outline-primary"
            onClick={SearchButton}
          >
            Search
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FilterComponent;