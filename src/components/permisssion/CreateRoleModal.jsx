import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CreateRoleModal = (props) => {
  console.log("roleData--======>", props.roleData);

  const [roleData, setRoleData] = useState({
    name: "",
    status: "",
  });

  useEffect(() => {
    if (props.roleData) {
      setRoleData({
        name: props.roleData.name,
        status: props.roleData.status,
      });
    } else {
      setRoleData({
        name: "",
        status: "",
      });
    }
  }, [props.roleData]);

  const handleChange = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    if (roleData.name) {
      if (!roleData.status) {
        return toast.error('Please select status',{ position: toast.POSITION.TOP_CENTER, 
          theme:"colored", 
          hideProgressBar:true});
      }
      if (props.roleData) {
        try {
          const result = await schoolApi.updateRole(
            props.roleData.id,
            roleData
          );

          if (result.success) {
            // PubSub.publish("RECORD_SAVED_TOAST", {
            //   title: "Role Update",
            //   message: result.message,
            // });
            toast.success(result.message);
            props.handleCloseModal();
            props.fetchAllRoles();
            setRoleData({
              name: "",
              status: "",
            });
          }else{
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error);
        }
      } else {
        try {
          const result = await schoolApi.createRole(roleData);
          console.log("result---------->", result);

          if (result.success) {
            // PubSub.publish("RECORD_SAVED_TOAST", {
            //   title: "Role Saved",
            //   message: result.message,
            // });
            toast.success(result.message);
            props.handleCloseModal();
            props.fetchAllRoles();
            setRoleData({
              name: "",
              status: "",
            });
          }else{
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error);
        }
      }
    } else {
      return toast.error('Please fill all the required fields.',{ position: toast.POSITION.TOP_CENTER, 
        theme:"colored", 
        hideProgressBar:true});
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
        setRoleData({
          name: props.roleData.name ? props.roleData.name : "",
          status: props.roleData.status ? props.roleData.status : "",
        });
      }}
    >
      <Modal.Header
        closeButton
        style={{
    
          maxHeight: "",
        }}
      >
        <Modal.Title>
          {props.roleData ? "Update Role" : "Create Role"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label className="form-view-label">Role Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Role name"
                  value={roleData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-1">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <div className="mt-1">
                  <Form.Check
                    inline
                    type="radio"
                    label="Active"
                    name="status"
                    value="Active"
                    checked={roleData.status === "Active"}
                    onChange={(e) =>
                      setRoleData({ ...roleData, status: "Active" })
                    }
                    required
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="Inactive"
                    checked={roleData.status === "Inactive"}
                    onChange={(e) =>
                      setRoleData({ ...roleData, status: "Inactive" })
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
            setRoleData({
              name: props.roleData.name ? props.roleData.name : "",
              status: props.roleData.status ? props.roleData.status : "",
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

export default CreateRoleModal;
