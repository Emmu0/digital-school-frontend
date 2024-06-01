/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from "react";
import Main from "../layout/Main";
import { Button, Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import schoolApi from "../../api/schoolApi";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const EditAssignSubjectClass = () => {
    const location = useLocation(); //location
    const navigate = useNavigate(); //navigation

    const [deleteRecords, setDeleteRecords] = useState([]);

    const [allSubjects, setAllSubjects] = useState([]); //all subject records
    // const [rowRecords, setRowRecords] = useState([{ uuid: uuidv4(), selectedSubject: { id: "", subject_id: "", subjectname: "", shortname: "", category: "", type: "" } }]);
    const [rowRecords, setRowRecords] = useState([]);



    useEffect(() => {
        async function init() {
            const result = await schoolApi.getSubjectRecord(); //fetch subject records
            if (result) {
                console.log("set  AllSubjects", allSubjects);
                const updatedRowRecords = result.map((item) => ({
                    subject_id: item.id,
                    subjectname: item.name,
                    shortname: item.shortname,
                    category: item.category,
                    type: item.type,
                }));
                setAllSubjects(allSubjects.concat(updatedRowRecords));
            } else {
                setAllSubjects([]);
            }

            if (location?.state?.classId) {
                console.log('location?.state', location?.state?.subjectname)
                // setArrToRemove(location?.state?.subjectname)
                const responce = await schoolApi.getAssignSubjectClassIdByRecords(location?.state?.classId);
                if (responce.success) {
                    const updatedRowRecords = responce.records.map((item) => ({
                        uuid: uuidv4(),
                        selectedSubject: {
                            id: item.id,
                            subject_id: item.subject_id,
                            subjectname: item.subjectname,
                            shortname: item.shortname,
                            category: item.category,
                            type: item.type,
                        },
                    }));
                    setRowRecords(rowRecords.concat(updatedRowRecords));
                    console.log("responce", responce.records);
                } else {
                    setRowRecords([]);
                }
            }
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    let subjectOptions = allSubjects.map((element) => ({
        value: element.subject_id,
        label: element.subjectname,
    }));

    const addRows = () => {
        console.log('addRowsMethodColl');
        const lastRow = rowRecords[rowRecords.length - 1];
        console.log('lastRow', lastRow)
        const data = {
            uuid: uuidv4(),
            selectedSubject: {
                id: "",
                subject_id: "",
                subjectname: "",
                shortname: "",
                category: "",
                type: "",
            },
        };

        console.log('@#data==>',data);

        if (lastRow.selectedSubject.subject_id) {
            setRowRecords([...rowRecords, data]);
        } else {
            toast.error("Subject name is required ");
            ///alert("Subject name is required ");
        }

        const updatedAllSubjects = allSubjects.filter(subject => {
            return !rowRecords.some(item => item.selectedSubject.subject_id === subject.subject_id);
        });
        setAllSubjects(updatedAllSubjects);
    }

    //Remove Rows
    const removeRows = (rowId, item) => {
        const updatedRowRecord = rowRecords.filter((rowItem) => rowItem.uuid !== rowId);

        if (rowRecords.length === 1) {
            toast.error("Cannot delete the last row.");
            //alert("Cannot delete the last row.");
        }
        else {
            setRowRecords(updatedRowRecord);
            if (item?.selectedSubject?.subject_id) {
                setAllSubjects([...allSubjects, item.selectedSubject]);
            }
            if (item.selectedSubject.id) {
                setDeleteRecords([...deleteRecords, item.selectedSubject.id])
            }
        }
    }


    const handleSubjectChange = (selectOption, rowId) => {
        console.log("selectOption", selectOption);
        console.log("Selected Item ID:", rowId);

        const selectedSubject = allSubjects.find((element) => element.subject_id === selectOption.value);

        const updatedRowRecords = rowRecords.map((record) => record.uuid === rowId ? { ...record, selectedSubject } : record);

        const updatedAllSubjects = allSubjects.filter((item) => item.subject_id !== selectOption.value);

        setRowRecords(updatedRowRecords);
        setAllSubjects(updatedAllSubjects);
    }


    //Save Record
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit ", rowRecords);
    
        if (deleteRecords && deleteRecords.length) {
            for (let obj of deleteRecords) {
                if (obj) {
                    const result = await schoolApi.deleteAssignSubjectClassRecord(obj);
                    console.log("result", result);
                }
            }
        }

        let array = [];
        let isError = false; //add by Aamir khan 13-05-2024
        rowRecords.forEach((item) => {
            if (!item.selectedSubject.id) {
                
                if (item.selectedSubject.subject_id) {
                    array.push({
                        subject_id: item.selectedSubject.subject_id,
                        class_id: location?.state?.classId,
                    });
                }
                // Add by Aamir khan 13-05-2024
                else{
                    isError=true;
                }
            }
        })
        // Add by Aamir khan 13-05-2024
        if(isError){
            toast.error(" Record not saved.");
            return;
        }

        console.log('array', array)

        if (array && array.length) {
            for (let obj of array) {
                const response = await schoolApi.addAssignSubjectClassRecord(obj);
                console.log("response", response);
            }
        }

        toast.success("Record Saved Succesfully!", { position: toast.POSITION.TOP_RIGHT });
        navigate(`/assignsubjectclass`);
    }

    //handle Cancel
    const handleCancel = () => {
        navigate(`/assignsubjectclass`);
    }

    return (
        <Main>
            <Row>
                <Col lg={10} className="mx-4">
                <Link className="nav-link" to="/assignsubjectclass">Home <i className="fa-solid fa-chevron-right"></i> Assign Subject Class</Link>

                    {/* <Link className="nav-link" to="/assignsubjectclass">
                        Home <i className="fa-solid fa-chevron-right"></i>
                        <strong> Assign Subject Class</strong>
                    </Link> */}
                </Col>
            </Row>

            <Container className="mt-5 pt-5">
                <Row className="mx-3">
                    <Col></Col>
                    <Col lg={10}>
                        <Row className="view-form-header align-items-center">
                            <Col lg={3}>Assign Subject Class</Col>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Button className="btn-sm mx-2" variant="danger" onClick={handleCancel}>Cancel</Button>
                                <Button className="btn-sm" variant="success" onClick={handleSubmit}>Save</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            <Container>
                <Row className="mt-2 mx-3">
                    <Col></Col>
                    <Col lg={10}>
                        <Row>
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label> Class Name </Form.Label>
                                    <input
                                        required
                                        disabled
                                        className="form-control"
                                        type="text"
                                        name="classname"
                                        value={location?.state?.classname}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>


            <Container>
                <Row>
                    <Col></Col>
                    <Col lg={10}>
                        <Row>
                            <Col lg={12}>
                                <Button className="btn float-end mx-3" variant="primary" onClick={addRows}>Add Row</Button>
                            </Col>

                            <Form className="mt-3">
                                <div className="container">
                                    <div className="row clearfix">
                                        <div className="col-md-12 column">
                                            <table className="table table-bordered table-hover" id="tab_logic">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">S.No.</th>
                                                        <th className="text-center">Subject Name</th>
                                                        <th className="text-center">Short Name</th>
                                                        <th className="text-center">Category</th>
                                                        <th className="text-center">Type</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {rowRecords && rowRecords.map((item, index) => (
                                                        <tr key={item.uuid}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>
                                                                <Select
                                                                    isDisabled={item?.selectedSubject?.subject_id ? true : false}
                                                                    value={subjectOptions.find((option) => option.value === (item?.selectedSubject && item?.selectedSubject?.subject_id))}
                                                                    onChange={(selectedOption) => handleSubjectChange(selectedOption, item.uuid)}
                                                                    options={subjectOptions}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    disabled
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="shortname"
                                                                    value={item?.selectedSubject?.shortname || ""}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    disabled
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="category"
                                                                    value={item?.selectedSubject?.category || ""}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    disabled
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="type"
                                                                    value={item?.selectedSubject?.type || ""}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button variant="danger" onClick={() => removeRows(item.uuid, item)}>Remove</Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </Row>
                    </Col>

                    <Col></Col>
                </Row>
            </Container>
            <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                //   theme="colored"
                  />                                          
            {/* <ToastContainer /> */}
        </Main>
    )
}

export default EditAssignSubjectClass
