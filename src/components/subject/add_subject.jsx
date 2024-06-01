/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubject = (props) => {
  const [rowRecord, setRowRecord] = useState({
    name: "",
    shortname: "",
    // category: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    if (props?.parent?.id) {
      setRowRecord(props?.parent);
    }
  }, []);

  //handleChange
  const handleChange = (e) => {
    setRowRecord({ ...rowRecord, [e.target.name]: e.target.value });
  };

  //==================  Add By Aamir khan Code Start =========
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    //const shortName = value.slice(0, 3).toUpperCase();

    const shortName = generateShortNam(value); // Generate short name based on subject name
    setRowRecord({
      ...rowRecord,
      [e.target.name]: e.target.value,
      shortname: shortName,
    });
  };

  //==================  Aamir khan Code End =================

  //======================== Add by Aamir khan Code Start ==========================
  const generateShortNam = (subjectName) => {
    const words = subjectName.split(" ");
    let shortName = "";

    if (words.length >= 2) {
      shortName = words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("");
    } else if (words.length === 1) {
      shortName = words[0].slice(0, 3);
    }
    return shortName.toUpperCase();
  };

  //======================== Aamir khan Code End ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shortName = generateShortNam(rowRecord.name);
    console.log("only shortName==>", shortName);
    // const shortName = generateShortName(rowRecord.name);
    if (shortName !== "Invalid") {
      rowRecord.shortname = shortName;

      if (props?.parent?.id) {
        const obj = {
          id: props?.parent?.id,
          name: rowRecord.name,
          shortname: rowRecord.shortname,
          // category: rowRecord.category,  //comant by Aamir khan
          type: rowRecord.type,
          status: rowRecord.status,
        };

        if (
          obj.id &&
          obj.id.trim() !== "" &&
          obj.name &&
          obj.name.trim() !== "" &&
          obj.shortname &&
          obj.shortname.trim() !== "" &&
          // obj.category &&                      //comant By Aamir khan
          // obj.category.trim() !== "" &&         //comant By Aamir khan
          obj.type &&
          obj.type.trim() !== ""
        ) {
          console.log('checkduplacteValue');
          console.log("@@SubjectUpdateRec", obj);
          let response = await schoolApi.updateSubjectRecord(obj); //updated record
          console.log("response", response);
          if (response.success) {
            toast.success(response.message, {
              position: toast.POSITION.TOP_CENTER,
              //position: toast.POSITION.TOP_RIGHT,
            });
            // PubSub.publish("RECORD_SAVED_TOAST", {
            //   title: "Record Saved",
            //   message: response.message,
            // });
            recordSavedSuccessfully();
          } else {
            toast.error("Required field missing! 1", {
              position: toast.POSITION.TOP_CENTER,
              //position: toast.POSITION.TOP_RIGHT,
            });
          }
        } else {
          toast.error("Required field missing! 2", {
            position: toast.POSITION.TOP_CENTER,
            //position: toast.POSITION.TOP_RIGHT,
          });
        }
        //editClass
      } else {
        if (
          rowRecord.name &&
          rowRecord.name.trim() !== "" &&
          rowRecord.shortname && //Add By Aamir kHAN
          rowRecord.shortname.trim() !== "" && //Add By Aamir kHAN
          // rowRecord.category &&                     //comant By Aamir khan
          // rowRecord.category.trim() !== "" &&       //comant By Aamir khan
          rowRecord.type &&
          rowRecord.type.trim() !== ""
        ) {
          let response = {};
          console.log('Checking');
          response = await schoolApi.addSubjectRecord(rowRecord); //add subject record
          console.log("response", response);
          if (response.success) {
            toast.success("Record save successfully!", {
              position: toast.POSITION.TOP_CENTER,
            });
            recordSavedSuccessfully();
          } else {
            toast.error(response.message, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        } else {
          toast.error("Required field missing! 3", {
            position: toast.POSITION.TOP_CENTER,
            //position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } else {
      toast.error("Subject name invalid", {
        position: toast.POSITION.TOP_CENTER,
        //  position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const recordSavedSuccessfully = () => {
    props.recordSavedSuccessfully();
  };

  return (
    <Modal
      show={props.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={props.onHide}>
        <Modal.Title id="contained-modal-title-vcenter">
          Subject Record
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="view-form">
          <Row>
            <Col lg={12}>
              <Form noValidate>
                <Row>
                  {/*===================== Add By Aamir khan Code Start =====================*/}
                  <Col lg={6}>
                     {/* Add by Aamir khan 09-05-2024   className="mx-3" */}
                    <Form.Group  className="mx-3">   
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Subject Name
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        placeholder="Enter Your Subject"
                        value={rowRecord.name}
                        onChange={handleChange1}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Short Name
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="shortname"
                        placeholder="Enter your short name"
                        disabled={!rowRecord.shortname}
                        value={rowRecord.shortname}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  {/*=====================Aamir khan Code End =====================*/}
                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Status
                      </Form.Label>
                      <Form.Select
                        required
                        name="status"
                        value={rowRecord.status}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Active">Active</option>
                        <option value="InActive">InActive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicFirstName"
                      >
                        Type Name
                      </Form.Label>
                      <Form.Select
                        required
                        name="type"
                        value={rowRecord.type}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Type --</option>
                        <option value="General">General</option>
                        <option value="Optional">Optional</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          Save
        </Button>
        <Button onClick={props.onHide} variant="light">
          Close
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default AddSubject;
