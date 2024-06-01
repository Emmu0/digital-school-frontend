import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSection = (props) => {
    console.log('props======>', props);
    // eslint-disable-next-line no-unused-vars
    const [optionClass, setOptionClass] = useState([]);
    const [selectedClassName, setSelectedClassName] = useState();

    const [optionTeachers, setOptionTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState();
    const [editRecord, setEditRecord] = useState({
        section_id: "",
        section_name: "",
        strength: "",
        class_id: "",
        classname: "",
        contact_id: null,
        contactname: ""
    });


    useEffect(() => {
        async function init() {

            if (props?.parent?.section_id) {
                console.log('inside the useEffect====>', props);
                setEditRecord(props?.parent);

                let temp = {};
                temp.value = props?.parent?.contact_id;
                temp.label = props?.parent?.contact_name;
                setSelectedTeacher(temp);

                let selectClassName = {};
                selectClassName.value = props?.parent?.class_id;
                selectClassName.label = props?.parent?.class_name;
                setSelectedClassName(selectClassName)
            }
            else if (props?.parent?.class_id) {
                //Create This Statement By Shahir Hussain 13-05-2024
                let selectClassName = {};
                console.log('props?.parent?.class_id == ', props?.parent?.class_id);
                selectClassName.value = props?.parent?.class_id;
                selectClassName.label = props?.parent?.classname;
                console.log('ClassName == ', selectClassName);
                setEditRecord({ ...editRecord, classname: props?.parent?.classname, class_id: props?.parent?.class_id })
                // setSelectedClassName(selectClassName)
            }
            else {
                setEditRecord([]);
                setSelectedClassName()
                setSelectedTeacher()
            }
            console.log('dropdown==>')
            const result = await schoolApi.getActiveClassRecords(); //fetch class records
            console.log('class of result==>', result)
            if (result) {
                let ar = [];
                result.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.classname;
                    ar.push(obj);
                });
                setOptionClass(ar);
            } else {
                setOptionClass([]);
            }

            const teacher = await schoolApi.getTeacherRecords(); //fetch Teacher records
            console.log('teacher', teacher);

            if (teacher) {
                // let ar = [{ label: "--Select Teacher--", value: null }];
                let ar = [];
                teacher.map((item) => {
                    var obj = {};
                    obj.value = item.id;
                    obj.label = item.teachername;
                    ar.push(obj);
                });
                setOptionTeachers(ar);
            } else {
                setOptionTeachers([]);
            }
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleChange = (e) => {
        if (e.target.name === 'section_name') {
            // const str = e.target.value.toUpperCase();
            setEditRecord({ ...editRecord, [e.target.name]: e.target.value.toUpperCase()[0] });
        }
        else {
            setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
        }
    };

    const handleSelectClassName = (e) => {
        setSelectedClassName(e);
        setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
    };

    const handleSelectTeachers = (e) => {
        setSelectedTeacher(e);
        setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedClassName && selectedClassName.value) { }

        if (props?.parent?.section_id) {//edit section
            const obj = {
                id: props?.parent?.section_id,
                class_id: editRecord.class_id,
                strength: editRecord.strength,
                name: editRecord.section_name,
                contact_id: editRecord.contact_id
            }

            if (obj.id && obj.id.trim() !== "" && obj.class_id && obj.class_id.trim() !== "" &&
                obj.name && obj.name.trim() !== "" && obj.strength && obj.strength.trim() !== "") {
                let res = {};
                res = await schoolApi.updateSectionRecord(obj);

                if (res.success) {
                    toast.success(res.message, {
                        position: toast.POSITION.TOP_CENTER,
                        hideProgressBar: true
                    });
                    props.onHide();
                    props.sectionRecords();
                } else {
                    toast.error(res.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            } else {
                toast.error("Required field missing!", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: "colored",
                    hideProgressBar: true
                });
            }
        }
        else {//Add new section
            if ((editRecord.class_id && editRecord.class_id.trim() !== "") && (editRecord.section_name && editRecord.section_name.trim() !== "")
                && (editRecord.strength && editRecord.strength.trim() !== "")) {

                let addSection = {
                    class_id: editRecord.class_id,
                    name: editRecord.section_name,
                    strength: editRecord.strength,
                    contact_id: null
                }
                if (editRecord.contact_id && editRecord.contact_id.trim() !== "") {
                    addSection = {
                        class_id: editRecord.class_id,
                        name: editRecord.section_name,
                        strength: editRecord.strength,
                        contact_id: editRecord.contact_id
                    }
                }

                let response = {};
                response = await schoolApi.addSectionRecord(addSection);
                if (response.success) {
                    // PubSub.publish("RECORD_SAVED_TOAST", {
                    //     title: "Record Saved",
                    //     message: "Record saved successfully",
                    // });
                    toast.success('Section saved successfully');
                    props.onHide();
                    props.sectionRecords();
                } else {
                    toast.error(response.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            } else {
                toast.error("Required field missing!", {
                    position: toast.POSITION.TOP_CENTER,
                    theme: "colored",
                    hideProgressBar: true
                });
            }
        }
    };

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton onClick={props.onHide}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Class Section
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="view-form">
                    <Row>
                        <Col lg={12}>
                            <Form
                                className="mt-3"
                                noValidate
                                // validated={validated}
                                onSubmit={handleSubmit}
                            // controlId="FeeDeposit"
                            >
                                <Row>
                                    <Col lg={6}>
                                        {optionClass && (
                                            <Form.Group className="mx-3">
                                                <Form.Label className="form-view-label" htmlFor="formBasicClass" >Name</Form.Label>
                                                <Form.Select
                                                    name="class_id"
                                                    value={editRecord.class_id}
                                                    onChange={handleSelectClassName}
                                                    required
                                                    disabled={props.parent.class_id}
                                                >
                                                    <option value="">-- Select Class--</option>
                                                    {optionClass.map((cls) => (
                                                        <option key={cls.value} value={cls.value}>
                                                            {cls.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        )}
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicStrength"
                                            >
                                                Strength
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                name="strength"
                                                placeholder="Strength"
                                                value={editRecord.strength}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="pb-4 pt-3">
                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicSection"
                                            >
                                                Section
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="section_name"
                                                placeholder="Section Name"
                                                value={editRecord.section_name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6}>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                            >
                                                Class Teacher
                                            </Form.Label>
                                            {/* Changes made by shakib */}
                                            {/* <Select
                                                className="custom-select username"
                                                placeholder="Select Class Teacher"
                                                name="contact_id"
                                                onChange={handleSelectTeachers}
                                                value={selectedTeacher}
                                                options={optionTeachers}
                                            ></Select> */}
                                            <Form.Select
                                                name="contact_id"
                                                value={editRecord.contact_id}
                                                onChange={handleSelectTeachers}
                                            >
                                                <option value="">-- Select Teacher--</option>
                                                {optionTeachers.map((teacher) => (
                                                    <option key={teacher.value} value={teacher.value}>
                                                        {teacher.label}
                                                    </option>
                                                ))}
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
                    {props?.parent?.section_id ? "Update" : "Save"}
                </Button>
                <Button onClick={props.onHide} variant="light">
                    Close
                </Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>

    );
};

export default AddSection;
