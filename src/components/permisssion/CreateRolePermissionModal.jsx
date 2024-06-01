import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from "react-toastify";
import authApi from "../../api/authApi";

const CreateRolePermissionModal = (props) => {
  console.log("props--======>", props);


  const [roleOptions, setRoleOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [rolePermissionData, setRolePermissionData] = useState({
    name: "",
    roleid: "",
    moduleid: "",
    permissionid: "",
    read: false,
    create_per: false,
    edit: false,
    delete: false,
    status: "",
  });

  useEffect(() => {
    if (props.rolePermissionData) {
      setRolePermissionData({
        name: props.rolePermissionData.name,
        roleid: props.rolePermissionData.roleid,
        moduleid: props.rolePermissionData.moduleid,
        permissionid: props.rolePermissionData.permissionid,
        read: props.rolePermissionData.read,
        create_per: props.rolePermissionData.create_per,
        edit: props.rolePermissionData.edit,
        delete: props.rolePermissionData.delete,
        status: props.rolePermissionData.status,
      });
    } else {
      setRolePermissionData({
        name: "",
        roleid: "",
        moduleid: "",
        permissionid: "",
        read: false,
        create_per: false,
        edit: false,
        delete: false,
        status: "",
      });
    }
  }, [props.rolePermissionData]);

  useEffect(() => {
    async function fetchAllRoles() {
      try {
        const allRoles = await schoolApi.getAllRoles();
        const roleOptions = allRoles.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        setRoleOptions(roleOptions);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllRoles();
  }, []);

  useEffect(() => {
    async function fetchAllModules() {
      try {
        const allModules = await schoolApi.getAllModules(authApi.companyDetail().companyid);
        const moduleOptions = allModules.map((module) => ({
          value: module.id,
          label: module.name,
        }));
        setModuleOptions(moduleOptions);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllModules();
  }, []);

  useEffect(() => {
    async function fetchAllPermission() {
      try {
        const allPermissions = await schoolApi.getAllPermission();
        const permissionOption = allPermissions.map((permission) => ({
          value: permission.id,
          label: permission.name,
        }));
        setPermissionOptions(permissionOption);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
    fetchAllPermission();
  }, []);

  const handleChange = (e) => {
    setRolePermissionData({
      ...rolePermissionData,
      [e.target.name]: e.target.value,
    });
  };
  console.log('rolepermission data -------->', rolePermissionData)

  const handleChangeCheck = (event) => {
    setRolePermissionData({
      ...rolePermissionData,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    if (rolePermissionData.roleid && rolePermissionData.moduleid && rolePermissionData.permissionid) {
      if (props.rolePermissionData) {
        try {
          const result = await schoolApi.updateRolePermission(props.rolePermissionData.id, rolePermissionData);
          if (result.message === 'Role permission updated successfully') {
            props.handleCloseModal();
            props.fetchAllRolePermissions();
            setRolePermissionData({
              name: "",
              roleid: "",
              moduleid: "",
              permissionid: "",
              read: false,
              create_per: false,
              edit: false,
              delete: false,
              status: "",
            });
          }
        } catch (error) {
          console.error("Error Updating assignment:", error);
        }
      } else {
        try {
          const result = await schoolApi.createRolePermission(rolePermissionData);
          if (result.message === 'role_permission created successfully') {
            console.log("result---------->", result.message);
            toast.success(result.message)
            props.handleCloseModal();
            props.fetchAllRolePermissions();
            setRolePermissionData({
              name: "",
              roleid: "",
              moduleid: "",
              permissionid: "",
              read: false,
              create_per: false,
              edit: false,
              delete: false,
              status: "",
            });
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
        setRolePermissionData({
          name: "",
          roleid: "",
          moduleid: "",
          permissionid: "",
          read: false,
          create_per: false,
          edit: false,
          delete: false,
          status: "",
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
          {props.rolePermissionData ? "Update Role Permission" : "Create Role Permission"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="mt-3">
          <Row>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label htmlFor="formBasicLastName">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  onChange={handleChange}
                  value={rolePermissionData.name}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mx-3">
                <Form.Label>Role Name</Form.Label>
                <Form.Select name="roleid"
                  onChange={handleChange}
                  value={rolePermissionData.roleid}
                  required
                >
                  <option key="default" value="">
                    -- Select role name --
                  </option>
                  {roleOptions &&
                    roleOptions.map((res) => (
                      <option key={res.value} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>


          <Row>
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label>Module Name</Form.Label>
                <Form.Select
                  name="moduleid"
                  required
                  onChange={handleChange}
                  value={rolePermissionData.moduleid}
                >
                  <option key="default" value="">
                    -- Select module name --
                  </option>
                  {moduleOptions &&
                    moduleOptions.map((res) => (
                      <option key={res.value} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label>Permission Name</Form.Label>
                <Form.Select
                  name="permissionid"
                  onChange={handleChange}
                  value={rolePermissionData.permissionid}
                  required
                >
                  <option key="default" value="">
                    -- Select permission name --
                  </option>
                  {permissionOptions &&
                    permissionOptions.map((res) => (
                      <option key={res.value} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>


          <Row>
            <Col lg={1} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label htmlFor="formBasicRead">Read</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="read"
                  checked={rolePermissionData.read}
                  onChange={handleChangeCheck}
                />
              </Form.Group>
            </Col>
            <Col lg={1} className="mt-3" >
              <Form.Group className="mx-3">
                <Form.Label htmlFor="formBasicCreate">Create</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="create_per"
                  checked={rolePermissionData.create_per}
                  onChange={handleChangeCheck}
                />
              </Form.Group>
            </Col>
            <Col lg={1} className="mt-3" style={{ marginLeft: "10px" }}>
              <Form.Group className="mx-3">
                <Form.Label htmlFor="formBasicEdit">Edit</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="edit"
                  checked={rolePermissionData.edit}
                  onChange={handleChangeCheck}
                />
              </Form.Group>
            </Col>
            <Col lg={1} className="mt-3">
              <Form.Group className="mx-3">
                <Form.Label htmlFor="formBasicDelete">Delete</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="delete"
                  checked={rolePermissionData.delete}
                  onChange={handleChangeCheck}
                />
              </Form.Group>
            </Col>

            <Col lg={6} className='mt-3 mb-2' style={{ marginLeft: "71px" }}>
              <Form.Group className="mx-3">
                <Form.Label>Status</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Active"
                    name="status"
                    value="Active"
                    checked={rolePermissionData.status === "Active"}
                    onChange={(e) =>
                      setRolePermissionData({
                        ...rolePermissionData,
                        status: "Active",
                      })
                    }
                    required
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Inactive"
                    name="status"
                    value="Inactive"
                    checked={rolePermissionData.status === "Inactive"}
                    onChange={(e) =>
                      setRolePermissionData({
                        ...rolePermissionData,
                        status: "Inactive",
                      })
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
        <Button variant="success"
          onClick={handleSubmit}
        >
          {props.btnName}
        </Button>
        <Button
          variant="light"
          onClick={() => {
            props.handleCloseModal();
            setRolePermissionData({
              name: "",
              roleid: "",
              moduleid: "",
              permissionid: "",
              read: false,
              create_per: false,
              edit: false,
              delete: false,
              status: "",
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

export default CreateRolePermissionModal;