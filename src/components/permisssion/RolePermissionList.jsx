//Role Permission List Change by Shahir Hussain 22-04-2024

import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import { Button, Col, Row, Table, Form, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DatatableWrapper, TableBody, TableHeader } from "react-bs-datatable";
import { ShimmerTable } from "react-shimmer-effects";
import schoolApi from "../../api/schoolApi";
import CircularProgress from '@mui/material/CircularProgress';

import CreateRolePermissionModal from "./CreateRolePermissionModal";
import PubSub from "pubsub-js";
import authApi from "../../api/authApi";

const RolePermissionList = () => {
  const [body, setBody] = useState();

  const [modalShow, setModalShow] = useState(false);
  const [btnName, setBtnName] = useState("Save");
  const [rolePermissionData, setRolePermissionData] = useState();
  const [rolePermissions, setRolePermissions] = useState([]);
  const [upsertRolePermissions, setUpsertRolePermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllRoles();
  }, []);

  async function fetchAllRoles() {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    console.log('fetchAllRoles called')
    if(authApi.companyDetail().companyid){
      const rolePermissions = await schoolApi.getRolePermission(authApi.companyDetail().companyid);
      setRolePermissions(rolePermissions);
      console.log('rolePermissions == ', rolePermissions)
    }
  }
  useEffect(() => {
    console.log("#role upsertRolePermissions: ", upsertRolePermissions);
  }, [upsertRolePermissions]);

  //updated by Abdul Sir 19-04-2024
  const handleCheckBox = (columnName, row) => (e) => {
    console.log('#role row == ', row)

    setRolePermissions((oldRolePermissions) => {
      const updatedRolePermissions = [...oldRolePermissions];
      const roleData = updatedRolePermissions.find((record) => record.id === row.roleid);
      const rolePermission = roleData.permissions.find((record) => record.roleid === row.roleid && record.moduleid === row.moduleid);
      rolePermission[columnName] = e.target.checked;

      if (rolePermission.can_edit === null) rolePermission.can_edit = false;
      if (rolePermission.can_create === null) rolePermission.can_create = false;
      if (rolePermission.can_read === null) rolePermission.can_read = false;
      if (rolePermission.can_delete === null) rolePermission.can_delete = false;
      if (rolePermission.view_all === null) rolePermission.view_all = false;
      if (rolePermission.modify_all === null) rolePermission.modify_all = false;

      console.log("#role upsertRolePermissions: ", upsertRolePermissions);
      const upsertRecord = upsertRolePermissions.find(record => record.roleid === row.roleid && record.moduleid === row.moduleid);
      console.log("#role upsertRecord: ", upsertRecord);
      let newRolePermissions = upsertRolePermissions;

      newRolePermissions = upsertRolePermissions.filter(record => record.roleid !== row.roleid || record.moduleid !== row.moduleid);
      console.log("#role newRolePermissions: ", newRolePermissions);

      setUpsertRolePermissions([...newRolePermissions, rolePermission]);
      console.log("#role rolePermission: ", rolePermission);
      console.log("#role upsert: ", upsertRolePermissions);
      return updatedRolePermissions;

    });


  };

  const header = [
    { title: "Module", prop: "module_name", isFilterable: true },
    {
      title: "Read",
      prop: "can_read",
      isFilterable: true,
      cell: (row) => (
        <Form.Check
          type="checkbox"
          onChange={handleCheckBox("can_read", row)}
          checked={row.can_read}
        />
      ),
    },
    {
      title: "Create",
      prop: "can_create",
      isFilterable: true,
      cell: (row) => (
        <Form.Check
          type="checkbox"
          onChange={handleCheckBox("can_create", row)}
          checked={row.can_create}
        />
      ),
    },
    {
      title: "Edit",
      prop: "can_edit",
      isFilterable: true,
      cell: (row) => (
        <Form.Check type="checkbox" onChange={handleCheckBox("can_edit", row)} checked={row.can_edit} />
      ),
    },
    {
      title: "Delete",
      prop: "can_delete",
      isFilterable: true,
      cell: (row) => (
        <Form.Check
          type="checkbox"
          onChange={handleCheckBox("can_delete", row)}
          checked={row.can_delete}
        />
      ),
    },
    {
      title: "view all",
      prop: "view_all",
      isFilterable: true,
      cell: (row) => (
        <Form.Check
          type="checkbox"
          onChange={handleCheckBox("view_all", row)}
          checked={row.view_all}
        />
      ),
    },
    {
      title: "modify all",
      prop: "modify_all",
      isFilterable: true,
      cell: (row) => (
        <Form.Check
          type="checkbox"
          onChange={handleCheckBox("modify_all", row)}
          checked={row.modify_all}
        />
      ),
    },
  ];

  const createRolePermission = () => {
    setModalShow(true);
    setRolePermissionData("");
    setBtnName("Save");
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const handleSaveChanges = async (e) => {

    console.log('#role upsertRolePermissions 2 == ', upsertRolePermissions)

    const result = await schoolApi.upsertRolePermissions(upsertRolePermissions);
    console.log('result succes == ', result)
    if (result) {
      PubSub.publish('RECORD_SAVED_TOAST', {
        title: 'Record updated',
        message: 'Record updated successfully'
      });
    }
  }

  return (
    <Main>
      <CreateRolePermissionModal
        modalShow={modalShow}
        handleCloseModal={handleCloseModal}
        fetchAllRolePermissions={fetchAllRoles}
        rolePermissionData={rolePermissionData}
        btnName={btnName}
      />


      <Col lg={2} className="m-4">
        <Link className="nav-link" to="/">
          Home <i className="fa-solid fa-chevron-right"></i>
        </Link>
      </Col>

      <Row className="g-0">
        <Col lg={12} className="px-lg-4">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0" >
              <div style={{ backgroundColor: "#CFE2FF", padding: "15px" }}>
                <div style={{ fontSize: "15px", paddingLeft: "10px" }}>Role Permission</div>
                <Col
                  xs={12}
                  sm={6}
                  lg={11}
                  className="d-flex flex-col justify-content-end align-items-end"
                >
                </Col>
                {/*Change by shahir hussain 05 04 2024*/}
              </div>{isLoading ? <div className="loader"></div>
                :
                <div>
                  <Accordion.Body >
                    {/*<div className="row">
                  <div className="col-sm-6 col-md-11"></div>
                    <div className="col-6 col-md-1">
                      <Button className="btn-sm my-3 py-2 px-3  ms-4" variant="primary" onClick={handleSaveChanges} >
                        Save
                      </Button>
                    </div>
                    </div>*/}

                    {rolePermissions ? (
                      <Accordion defaultActiveKey="0" className="container" >
                        {rolePermissions?.map((role, index) => (
                          <Accordion.Item key={role.roleid} eventKey={index}>

                            {<Accordion.Header onClick={(e) => { }}>{role.name}</Accordion.Header>}
                            <Accordion.Body>

                              <DatatableWrapper headers={header} key={role.roleid} body={role.permissions}>
                                <Table className="data-table">
                                  <TableHeader />
                                  <TableBody />
                                </Table>
                              </DatatableWrapper>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    ) : (
                      <ShimmerTable row={10} col={8} />
                    )}
                    <div className="row">
                      <div className="col-sm-6 col-md-11"></div>
                      <div className="col-6 col-md-1">
                        <Button className="btn-sm my-3 py-2 px-3  ms-4" variant="primary" onClick={handleSaveChanges} >
                          Save
                        </Button>
                      </div>
                    </div>
                  </Accordion.Body>
                </div>}
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col lg={2}></Col>
      </Row>
    </Main>
  );
};

export default RolePermissionList;