/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from "react";
import Main from "../layout/Main";
import { Button, Row, Col, Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import schoolApi from "../../api/schoolApi";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const AddAssignSubjectClass = () => {
    const navigate = useNavigate(); //navigation

    const [selectedClass, setSelectedClass] = useState(); //selected class name and id
    const [optionClass, setOptionClass] = useState([]); //All class names and ids

    const [allSubjects, setAllSubjects] = useState([]);

    const [rowRecord, setRowRecord] = useState([
        {
            id: uuidv4(),
            selectedSubject: {
                id: "",
                name: "",
                shortname: "",
                category: "",
                type: "",
            },
        },
    ]);

    

    let subjectOptions = allSubjects.map((subject) => ({
        value: subject.id,
        label: subject.name,
    }));


    useEffect(() => {
        async function init() {
            const result = await schoolApi.getSubjectRecord(); //fetch all subject
            if (result) {
                setAllSubjects(result);
                console.log("add subject", result);
            } else {
                setAllSubjects([]);
            }

            //const responce = await schoolApi.getClassRecords("active"); //fetch all class
            const responce = await schoolApi.getActiveClassRecords("active"); //fetch all class  // Add by Aamir khan
            console.log('Recresponce==>',responce);
            if (responce) {
                let ar = [];
                responce.map((item) => {
                     ar.push({ value: item.id, label: item.classname }); 
                });
                console.log('@#Array==>',ar);
                setOptionClass(ar);
            } else {
                setOptionClass([]);
            }
        }
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Select Class Name
    const selectedClassName = (e) => {
        setSelectedClass(e.target.value);
    };

    //addRows
    const addRows = () => {
        console.log('addRow');
        const lastRow = rowRecord[rowRecord.length - 1];
        const data = {
            id: uuidv4(),
            selectedSubject: {
                id: "",
                name: "",
                shortname: "",
                category: "",
                type: "",
            },
        };
      
       
        if (lastRow.selectedSubject.id) {
            setRowRecord([...rowRecord, data]);
        }
       
        else {
            toast.error("Subject name is required ");
            //alert("Subject name is required ");
        }
        
    };

    //Remove Rows
    const removeRows = (index, rowId, item) => {
        const updatedRowRecord = rowRecord.filter((rowItem) => rowItem.id !== rowId);

        if (rowRecord.length === 1) {
            toast.error("Cannot delete the last row.");
            //alert("Cannot delete the last row.");
        } else {
            setRowRecord(updatedRowRecord);
            if (item?.selectedSubject?.id) {
                setAllSubjects([...allSubjects, item.selectedSubject]);
            }
        }
    };

    const handleSubjectChange = (selectOption, rowId) => {

        console.log('CollingFunction');
        console.log("selectOption", selectOption);
        console.log("Selected Item ID:", rowId);

        const selectedSubject = allSubjects.find((subject) => subject.id === selectOption.value);

        const updatedRowRecords = rowRecord.map((record) => record.id === rowId ? { ...record, selectedSubject } : record);
      
        if(selectedSubject != null && updatedRowRecords != null){
                console.log('RecFil');
        }

        else{
            console.log('FillRecordData');
        }

        const updatedAllSubjects = allSubjects.filter((subject) => subject.id !== selectOption.value);

        setRowRecord(updatedRowRecords);
        setAllSubjects(updatedAllSubjects);
    };

    //Save Record

    //Add by Aamir khan 13-05-2024
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        let array = [];
        

        if (!rowRecord[0]?.selectedSubject.id) {
            toast.error("selectedSubject is empty or null. Record not saved.");
            return; // Do not proceed further
        }
        else if(!selectedClass){
            toast.error("selectedClass is empty or null. Record not saved.");
            return;
        }else{

          
        }
      
        if (selectedClass) {
            let isError = false
            rowRecord.forEach((item) => {
                if (item.selectedSubject.id) {
                    array.push({
                        subject_id: item.selectedSubject.id,
                        class_id: selectedClass,
                    });
                } else {
                    isError=true;
                   
                }
            });

            if(isError){
                toast.error(" Record not saved.");
                return;
            }
        }
        if(!rowRecord || rowRecord.length === 0){
              toast.error("Subject name is required!!");
              return
        }
        else{
             if (array && array.length) {
                    for (let obj of array) {
                        const response = await schoolApi.addAssignSubjectClassRecord(obj); //add records
                        console.log("response", response);
                        //----------------** code pawan----------------------------
                        if(response.success === false  && response.message === 'Record is already exist'){
                            toast.error('Record is already exist');
                            return;
                        }
                        else {
                            setTimeout(() => {
                            navigate('/assignsubjectclass');
                            }, 500);
                        }
                    }
                }else {
                    toast.error("Class name and subject name is required!!");
                }
            }
       
       
    };

    const handleCancel = () => {
        navigate(`/assignsubjectclass`);
    }


    return (
        <Main>
            <Row className="g-0">
                <Col lg={10} className="mx-4">
                <Link className="nav-link" to="/assignsubjectclass">Home <i className="fa-solid fa-chevron-right"></i> Subject <i className="fa-solid fa-chevron-right"></i>Add Assign Subject Class</Link>
                    {/* <Link className="nav-link" to="/assignsubjectclass">
                        Home <i className="fa-solid fa-chevron-right"></i> Subject
                         <i className="fa-solid fa-chevron-right"></i>
                        <strong> Add Assign Subject Class</strong>
                    </Link> */}
                </Col>
            </Row>

            <Container className="mt-5 pt-5">
                <Row className="mx-3">
                    <Col></Col>
                    <Col lg={10}>
                        <Row className="view-form-header align-items-center">
                            <Col lg={3}> Add Assign Subject Class</Col>
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
                                    {/* <Select
                                        required
                                        className="custom-select username"
                                        placeholder="Select Class Name"
                                        value={selectedClass}
                                        onChange={selectedClassName}
                                        options={optionClass}
                                    ></Select> */}
                                    <Form.Select
                                        name="class"
                                        required
                                        value={optionClass.label}
                                        onChange={selectedClassName}
                                        >
                                        <option value="">-- Select Class --</option>
                                        {optionClass.map((cls) => (
                                            <option key={cls.value} value={cls.value}>
                                                 {cls.label}
                                            </option>
                                        ))}
                                        </Form.Select>
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
                                <Button onClick={addRows} className="btn float-end mx-3" > Add Row</Button>
                            </Col>

                            <Form className="mt-3">
                                <div className="container">
                                    <div className="row clearfix">
                                        <div className="col-md-12 column">
                                            <table
                                                className="table table-bordered table-hover"
                                                id="tab_logic"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">S. No.</th>
                                                        <th className="text-center">Subject Name</th>
                                                        <th className="text-center">Short Name</th>
                                                        <th className="text-center">Category</th>
                                                        <th className="text-center">Type</th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                               
                                                <tbody>
                                                    {rowRecord &&
                                                        rowRecord.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td className="text-center">{index + 1}</td>
                                                                <td>
                                                                  
                                                                    <Select
                                                                       
                                                                        isDisabled={item?.selectedSubject?.id ? true : false}
                                                                        value={subjectOptions.find((option) => option.value === (item?.selectedSubject && item?.selectedSubject?.id))}
                                                                        onChange={(selectedOption) => handleSubjectChange(selectedOption, item.id)}
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
                                                                    <Button variant="danger" onClick={() => removeRows(index, item.id, item)} >  Remove  </Button>
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
                  theme="colored"
                  />                                                
            {/* <ToastContainer /> */}
        </Main>
    )
}

export default AddAssignSubjectClass
