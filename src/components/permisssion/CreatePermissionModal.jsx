import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";

const CreatePermissionModal = (props) => {

  const [permissionData, setPermissionData] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    if (props.permissionData) {
      setPermissionData({
        name: props.permissionData.name,
        status: props.permissionData.status,
      });
    } else {
      setPermissionData({
        name: "",
        status: "",
      });
    }
  }, [props.permissionData]);

  const handleChange = (e) => {
    setPermissionData({ ...permissionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (permissionData.name) {
      if (!permissionData.status) {
        return toast.error("Please select status");
      }
      if (props.permissionData) {
        try {
          const result = await schoolApi.updatePermission(props.permissionData.id,permissionData);
          if (result.message === 'Permission updated successfully') {
            props.handleCloseModal();
            props.fetchAllPermission();
            setPermissionData({
              name: "",
              status: "",
            });
          }else{
            toast.error(result.message)
          }
        } catch (error) {
          console.error("Error updating assignment:", error);
        }
      } else {
        try {
          const result = await schoolApi.createPermission(permissionData);
          if (result.message === 'Permission created successfully') {
            props.handleCloseModal();
            props.fetchAllPermission();
            setPermissionData({
              name: "",
              status: "",
            });
          }else{
            toast.error(result.message)
          }
        } catch (error) {
          console.error("Error creating assignment:", error);
        }
      }
    } else {
      return toast.error("Please fill all the required fields.");
    }
  };

  return (
    <Modal
      show={props.modalShow}
      centered
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      onHide={() => {
        props.handleCloseModal();
        setPermissionData({
          name: props.permissionData.name ? props.permissionData.name : "",
          status: props.permissionData.status ? props.permissionData.status : "",
        });
      }}
    >
      <Modal.Header
        closeButton
        style={{ maxHeight: "",}}
      >
        <Modal.Title>
          {props.permissionData ? "Update Permission" : "Create Permission"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Permission Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Permission name"
                  value={permissionData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-1">
              <Form.Group>
                <Form.Label>Status <span className=" text-danger">*</span></Form.Label>
                <div className="mt-1">
                  <Form.Check
                    inline
                    type="radio"
                    label="Active"
                    name="status"
                    value="Active"
                    checked={permissionData.status === "Active"}
                    onChange={(e) =>
                      setPermissionData({ ...permissionData, status: "Active" })
                    }
                    required
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="Inactive"
                    checked={permissionData.status === "Inactive"}
                    onChange={(e) =>
                      setPermissionData({ ...permissionData, status: "Inactive" })
                    }
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmit}>
          {props.btnName}
        </Button>
        <Button
          variant="light"
          onClick={() => {
            props.handleCloseModal();
            setPermissionData({
              name: props.permissionData.name ? props.permissionData.name : "",
              status: props.permissionData.status ? props.permissionData.status : "",
            });
          }}
        >
          Close
        </Button>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePermissionModal;
