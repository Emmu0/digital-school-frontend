/**
 * @author: Abdul Pathan
 */
import React, { useState, useEffect } from 'react'
import Main from "../layout/Main";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAttendanceLineItem = () => {
    const [atList, setAtList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    // const [studentShow, setStudentShow] = useState(true);
    const [atDate, setAtDate] = useState();
    const [studentList, setStudentList] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [attendanceLineItem, setAttendanceLineItems] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const [handelUpdate, setHandleUpdate] = useState(false);
    const [inputDisable, setInputDisable] = useState(false);
    const [attendanceMaster, setAttendanceMaster] = useState({
        id: "",
        class_id: "",
        class_name: "",
        section_id: "",
        section_name: "",
        session_id: "",
        session_year: "",
        type: "",
        month: "",
        year: ""
    });
    const [attendanceCount, setAttendanceCount] = useState([]);
    useEffect(() => {
        async function init() {
            if (location?.state?.id) {
                console.log('what is inside the location?.state==>',location?.state);
                setAttendanceMaster(location?.state)
                console.log('location ', location?.state)
                // console.log('##type ', location?.state?.type)
                // setTypeValue(location?.state?.type);
                // const attObj = {
                //     attendance_master_id: location?.state?.id
                // }
                // if(attObj){
                //     setAttendanceCount(attObj);
                // }
                const obj = {
                    class_id: location?.state?.class_id,
                    section_id: location?.state?.section_id,
                    status:"present" 
                }
                if (obj) {
                    setAttendanceLineItems(obj)
                   // fetchAttendanceLineItemRecords(obj);
                }
            }
            if(location?.state.type === 'monthly'){
                console.log('hey useGGG',location?.state)
                handleAttendanceLineItem(location?.state);
            }
        }
        init();
    }, []);

    // console.log('setTypeValue', typeValue)

    const fetchAttendanceLineItemRecords = async (obj) => {
        try {
        const result = await schoolApi.getStudentRecords(obj);
        if(attendanceMaster.type === 'daily'){
            result?.records?.forEach(record => {
                record.date = obj.date  
              });
                for(let i=0;i<result?.records?.length;i++){
                    result.records[i].status = "present";
                }
                if (result.success) {
                    setStudentList(result.records);
                    // setStudentShow(false)
                } else {
                    setStudentList([]);
                }
        }else if(attendanceMaster.type === 'monthly' && result.success){
            console.log('getStudentRecords', result.records)
            console.log('ress', result.records)
            setStudentList(result.records);
            let arr=[];
            for(let i=0;i<result.records.length;i++){
                let obj={
                    student_id:result.records[i].student_id,
                    attendance_master_id: location?.state?.id
                }
                arr.push(obj)
            }
            setAttendanceCount([ ...attendanceCount,...arr ]);
            console.log('attendanceCount***',[...attendanceCount,...arr]);
            // setStudentShow(false)
        }else if(result.success === false){
            alert('Please create class and section record first!');
        }
        else {
            console.log('inside the else****');
            setStudentList([]);
            setAttendanceCount([]);
        }
     ///   console.log('studentList99999999999',studentList)
        }catch (error) {
            // Handle errors here
            console.error('Error fetching data:', error);
          }
    }
    // 
    const handleChangeStudentAttendance = (index, student_id, target_name, target_value) => {
        console.log('index', index)
        console.log('student_id', student_id)
        console.log('target_name', target_name)
        console.log('target_value', target_value)

        if (target_name) {
            const updatedStudentlist = [...studentList];
            updatedStudentlist[index].status = 'present';
            setStudentList(updatedStudentlist)
            console.log('iterator1@@@@=>',studentList);
            for(let i=0;i<studentList.length;i++){
                if(studentList[i] && (!studentList[i].hasOwnProperty('status'))){
                    studentList[i].status = "absent";
                    //console.log('inside tne if',studentList[i]);
                }
               // console.log('arr=>',studentList[0]);
            }
        //    studentList.forEach(record => {
        //         if(!('state' in record)){
        //             console.log('hey records=>',record);
        //             // let obj = {
        //             //     state:"absent"
        //             // }
                    
        //            // setStudentList(obj)
        //         }
        //         // if (obj) {
        //         //    //  setStudentList(obj)
        //         //    // fetchAttendanceLineItemRecords(obj);
        //         // }
        //       });
              
             console.log('updatedStudentlist', studentList)
        } else {
            const updatedStudentlist = [...studentList];
            updatedStudentlist[index].status = 'absent';
            setStudentList(updatedStudentlist)
        }
        
        // console.log('studentListstudentList', studentList)

    };
      console.log('studentListstudentList', studentList)
    const handleButton = (e)=>{
        console.log('handleButton@@@@',attendanceLineItem);
        fetchAttendanceLineItemRecords(attendanceLineItem);
        console.log('inside te122=>',studentList)

    }
    console.log('inside attendanceCount%%%%=>',attendanceCount)
    //handle change
    const handleChange = (e) => {
        setAtDate(e.target.value);
        console.log('handleChange', e.target.value);
        console.log('attendanceLineItem****', attendanceLineItem);
        console.log('attendance LIst==>',attendanceMaster);
        let res = {
            ...attendanceLineItem,
            date: e.target.value,
        }
        if(attendanceMaster.type === 'daily'){
            handleAttendanceLineItem(res);
        }
        // }else{
        //     handleAttendanceLineItem(res);
        // }
        // if(attendanceMaster.type === 'monthly'){
        //     handleAttendanceLineItem(attendanceMaster);
        // }else{
        //     handleAttendanceLineItem(res);
        // }
    };
    console.log('attendanceLineItem2', attendanceLineItem);

    const handleAttendanceLineItem = async (res) => {
        console.log('handleAttendanceLineItem==>', res);
        if(res.type === 'monthly'){
            console.log('month==>', res);
            console.log('month==>', res);
            let response = await schoolApi.getAttendanceRecordByMonthAndYear(res);
            console.log('responce month=>',response);
            if(response.result.length>0){
                console.log('resSucc',response.success);
                let arr=[];
                for(let i=0;i<response.result.length;i++){
                    let obj={
                        student_name:response.result[i].student_name,
                        totalpresent:response.result[i].present,
                        totalabsent:response.result[i].absent
                    }
                    arr.push(obj);
                }
                console.log('arrAT=>',arr);
                console.log('attendanceCount***',[...studentList,...arr]);
                setStudentList([ ...studentList,...arr ]);
                setShowTable(true);
                setInputDisable(true);
            }else{
                console.log('inisde tge else&&&&&&&&')
                setStudentList([]);
                setShowTable(true);
                setShowButton(true);
                setHandleUpdate(false);
            }
            
        }else{
            let responce = await schoolApi.getAttendanceLineItemRecords(res);
            if (responce.success === true) {
                console.log('inside the if$$$$',responce);
                console.log('studentLIstIFFFF=>',attendanceLineItem)
                setShowTable(true);
                //setShowTables(true);
                setStudentList(responce.records);
                setAtList(responce.records);
                setHandleUpdate(true);
                setShowButton(false);
            } else {
                console.log('setHandleUpdate@@@=>');
                setAttendanceLineItems(res);
                console.log('studentList1', attendanceLineItem)
                setStudentList([]);
                setShowTable(true);
                setShowButton(true);
                setHandleUpdate(false);
            }
        }
       // console.log('getAttendanceLineItemRecords', responce.records)
    }
    console.log('studentList@@@@@', studentList)
    console.log('attendanceCount month=>',studentList);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('setAttendanceMaster', attendanceMaster)
        console.log('handleSubmit studentList', studentList);
        console.log('attendanceMaster.type_*******=>',attendanceMaster.type,handelUpdate);
        
        if (attendanceMaster.type === 'daily' && handelUpdate === false) {
             console.log('attendanceMaster daily')

            if (atDate && atDate.trim() !== "") {
                   console.log('in the loop',studentList);
                   console.log('attendanceMaster', attendanceMaster)
                for (let obj of studentList) {
                    console.log('in the loop',obj);
                    if ((obj.student_id && obj.student_id.trim() !== "") &&
                        (obj.date && obj.date.trim() !== "") && 
                        (obj.status && obj.status.trim() !== "")) {
                            console.log('inside the if%%%%%');
                        let atendanceRecord = {
                            attendance_master_id: attendanceMaster.id,
                            class_id: attendanceMaster.class_id,
                            section_id: attendanceMaster.section_id,
                            student_id: obj.student_id,
                            status: obj.status,
                            date: obj.date
                        }
                         console.log('atendanceRecord', atendanceRecord)

                        if (atendanceRecord) {
                            console.log('inside the atendanceRecord==>',atendanceRecord);
                            let attRecord = await schoolApi.addAttendanceRecords(atendanceRecord);
                            console.log('attRecord', attRecord)
                            if (attRecord.success) {
                                const alineItem = {
                                    attendance_id: attRecord.recordId,
                                    status: atendanceRecord.status,
                                    date: atendanceRecord.date
                                }

                                let lineItemsResult = await schoolApi.addAttendanceLineItemRecords(alineItem);
                                console.log('lineItemsResult111', lineItemsResult)
                                // START
                                if (lineItemsResult.success) {
                                    let updateAttendance = {};
                                    let attResult = await schoolApi.getAttendanceRecordById(lineItemsResult.recordId.attendance_id);
                                    if (attResult) {
                                        if (lineItemsResult.recordId.status === 'present') {
                                            updateAttendance = {
                                                id: attResult.id,
                                                present: isNaN(parseInt(attResult.present)) ? 1 : parseInt(attResult.present) + 1,
                                                absent: isNaN(parseInt(attResult.absent)) ? 0 : parseInt(attResult.absent)
                                            }
                                        } else {
                                            updateAttendance = {
                                                id: attResult.id,
                                                present: isNaN(parseInt(attResult.present)) ? 0 : parseInt(attResult.present),
                                                absent: isNaN(parseInt(attResult.absent)) ? 1 : parseInt(attResult.absent) + 1
                                            }
                                        }
                                        // console.log('updateAttendance', updateAttendance)
                                        if (updateAttendance.id) {
                                            let updateAttResponce = await schoolApi.updateAttendanceRecords(updateAttendance);
                                            console.log('updateAttResponce', updateAttResponce);
                                            // toast.success("Record created Successfully!", { position: toast.POSITION.TOP_RIGHT });
                                            navigate('/attendance_master');
                                        }
                                    }
                                }
                                // END
                            }
                            else {
                                const alineItem = {
                                    attendance_id: attRecord.id,
                                    status: atendanceRecord.status,
                                    date: atendanceRecord.date
                                }

                                const lineItemsResult = await schoolApi.addAttendanceLineItemRecords(alineItem);
                                console.log('lineItemsResult22', lineItemsResult)
                                if (lineItemsResult.success) {
                                    let updateAttendance = {};
                                    let attResult = await schoolApi.getAttendanceRecordById(lineItemsResult.recordId.attendance_id);
                                    if (attResult) {
                                        if (lineItemsResult.recordId.status === 'present') {
                                            updateAttendance = {
                                                id: attResult.id,
                                                present: isNaN(parseInt(attResult.present)) ? 1 : parseInt(attResult.present) + 1,
                                                absent: isNaN(parseInt(attResult.absent)) ? 0 : parseInt(attResult.absent)
                                            }
                                        } else {
                                            updateAttendance = {
                                                id: attResult.id,
                                                present: isNaN(parseInt(attResult.present)) ? 0 : parseInt(attResult.present),
                                                absent: isNaN(parseInt(attResult.absent)) ? 1 : parseInt(attResult.absent) + 1
                                            }
                                        }
                                        // console.log('updateAttendance', updateAttendance)
                                        if (updateAttendance.id) {
                                            let updateAttResponce = await schoolApi.updateAttendanceRecords(updateAttendance);
                                            console.log('updateAttResponce', updateAttResponce);
                                            // toast.success("Record created Successfully!", { position: toast.POSITION.TOP_RIGHT });
                                            navigate('/attendance_master');
                                        }
                                    }
                                }
                                else {
                                    console.log('Record allReady created!');
                                    // toast.error("Record allReady created!", { position: toast.POSITION.TOP_RIGHT });
                                    // navigate('/attendance_master');
                                }
                            }
                        }
                    }
                    else {
                        console.log('object')
                    }
                }
            }
            else {
                toast.error("Attendance Date Required!", { position: toast.POSITION.TOP_RIGHT });
            }
        }

        else if (attendanceMaster.type === 'monthly') {
            console.log('attendanceMaster monthly',attendanceCount)
            let attRec = await schoolApi.addAttendanceRecords(attendanceCount);
            console.log('attRec=>',attRec);
            if(attRec.success === true){
                console.log('attRec.success');
                toast.success("Record is created successfully!", { position: toast.POSITION.TOP_RIGHT });
                navigate('/Attendance_master');
            }
        }
        else if(handelUpdate === true){
            console.log('HHH322',studentList);
            let differentArray = [];
            for (let i = 0; i < studentList.length; i++) {
                let item = studentList[i];
                // let matchingItem = atList.find((atListItem) => atListItem.id === item.id && atListItem.status === item.status);
                // console.log('matchingItem==>',matchingItem)
                // if (!matchingItem) {// If there is no matching item in atList, add the item to differentArray
                    differentArray.push(item);
               // }
            }
            console.log('Objects with different id or status:', differentArray);
            if (differentArray.length) {
                console.log('diff1==>');
                for (let obj of differentArray) {
                    console.log('diff2==>');
                    if (obj.id && obj.id.trim() !== "") {
                        console.log('diff3==>');
                        let updateLineItem = {
                            id: obj.id,
                            attendance_id: obj.attendance_id,
                            status: obj.status
                        }
                        if (updateLineItem.id) {
                            console.log('inside the if11');
                             console.log('updateLineItem', updateLineItem)
                            const responce = await schoolApi.updateAttendanceLineItemRecords(updateLineItem);
                             console.log('responce', responce)
                            if (responce.success) {
                                let updateAttendance = {};
                                let attResult = await schoolApi.getAttendanceRecordById(responce.record.attendance_id);
                                if (attResult) {
                                    if (responce.record.status === 'present') {
                                        updateAttendance = {
                                            id: attResult.id,
                                            present: parseInt(attResult.present) + 1,
                                            absent: parseInt(attResult.absent) - 1
                                        }
                                    } else {
                                        updateAttendance = {
                                            id: attResult.id,
                                            present: parseInt(attResult.present) - 1,
                                            absent: parseInt(attResult.absent) + 1
                                        }
                                    }
                                    // console.log('updateAttendance', updateAttendance)
                                    if (updateAttendance.id) {
                                        let updateAttResponce = await schoolApi.updateAttendanceRecords(updateAttendance);
                                        console.log('update Attendance Responce', updateAttResponce);
                                         toast.success("Record updated Successfully!", { position: toast.POSITION.TOP_RIGHT });
                                        // navigate('/attendance_master');
                                    }
                                }
                            } else {
                                // console.log('Record not found!')
                            }
                        }
                    }
                }
            } else {
                toast.error("Please select one present/absent!", { position: toast.POSITION.TOP_RIGHT });
            }
        }
    }

    const handleCancel = () => {
        navigate('/attendance_master');
    }

    const handleChangePresent = (e) => {
        console.log('handleChangePresent', e.target.value)
    }

    const handleAbsentAndPresent =(e, index) =>{
        console.log('handleAbsentAndPresent@@@=>',e)
       const updatedAttendanceCount = [...attendanceCount];
        updatedAttendanceCount[index] = {
            ...updatedAttendanceCount[index],
            [e.target.name]: e.target.value,
        };
        setAttendanceCount(updatedAttendanceCount);
    }

    console.log('attendanceCount@@@',attendanceCount);
    return (
        <Main>

            <Row className="g-0 ">
                <Col lg={10} className="mx-4">
                    <Link className="nav-link" to="/attendance_master">Home <i className="fa-solid fa-chevron-right"></i> Attendance Master <i className="fa-solid fa-chevron-right"></i><strong> Add Attendance Line Item</strong> </Link>
                </Col>
                <Col lg={12} className="p-lg-5"></Col>
            </Row>

            <Container>
                <Row className="mx-5">
                    <Col></Col>
                    <Col lg={10}>
                        <Row className="view-form-header align-items-center">
                            <Col lg={3}>Add Attendance Line Items</Col>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Button className="btn-sm mx-2" variant="danger" onClick={handleCancel}>Cancel</Button>
                                <Button className="btn-sm mx-2" variant="success" onClick={handleSubmit}>Save</Button>
                                {showButton && (
                                    <Button className="btn-sm mx-2" variant="danger" onClick={handleButton}>New attendance line item</Button>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            <Container className="view-form">
                <Row className="my-4 mx-5">
                    <Col lg={12}>
                        <Form noValidate >
                            <Row className="pb-4 ms-5 ps-5">
                                <Col lg={3}>
                                    {attendanceMaster.type === 'daily' && (
                                        <Form.Group>
                                            <Form.Label className="form-view-label" htmlFor="formBasicEmail">Attendance Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="attandance_date"
                                                // value={moment(studentfilterValues.attandancedate).format('yyyy-MM-DD')}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    )}
                                    {/* {attendanceMaster.type === 'monthly' && (
                                        <Form.Group>
                                            <Form.Label className="form-view-label" htmlFor="formBasicEmail">Attendance Month</Form.Label>
                                            <Form.Control
                                                placeholder="mm-yyyy"
                                                type="month"
                                                name="attandance_month"
                                                // value={moment(studentfilterValues.attandancedate).format('yyyy-MM-DD')}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    )} */}
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            {/* <Container>
                <Row className="mt-3 mx-5">
                    <Col></Col>
                    <Col lg={10}>
                        <Row >
                            <Col lg={3}>
                                <Form.Group>
                                    <Form.Label className="form-view-label" htmlFor="formBasicEmail">Attendance Date</Form.Label>
                                    <Form.Control
                                        required
                                        type="date"
                                        name="attandance_date"
                                        // value={moment(studentfilterValues.attandancedate).format('yyyy-MM-DD')}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                </Row>
            </Container> */}


            {/* {studentShow && ( */}
            {console.log('showTableATT',showTable,attendanceMaster.type)}
            {attendanceMaster.type === 'daily' && (
                <Container>
                    {showTable && (
                        <Row className="my-3 mx-5">
                            <Col></Col>
                            <Col lg={10}>
                                <table className="table table-striped table-bordered table-hover"  >
                                    <thead style={{ textAlign: "center" }}>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Student Name</th>
                                            <th>Present/Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                    {console.log('studentList########=>',studentList)}
                                        {studentList && studentList.length > 0 ? (
                                            studentList.map((item, index) => (
                                                <tr key={item.student_id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.student_name}</td>
                                                    <td>
                                                        <Form>
                                                            <Form.Check
                                                                type="switch"
                                                                id={item.id}
                                                                name="status"
                                                                checked={item.status === 'present' ? true : false}
                                                                value={item.status}
                                                                onChange={(e) => handleChangeStudentAttendance(index, item.student_id, e.target.checked, e.target.value)}
                                                            />
                                                        </Form>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No records found</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </Col>
                            <Col></Col>
                        </Row>
                    )}
                   
                </Container>
            )}
             {console.log('studentList^^^^^=>',studentList)}                               
            {attendanceMaster.type === 'monthly' && (
                <Container>
                {showTable && (
                        <Row className="my-3 mx-5">
                            <Col></Col>
                            <Col lg={10}>
                                <table className="table table-striped table-bordered table-hover"  >
                                    <thead style={{ textAlign: "center" }}>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Student Name</th>
                                            <th>Present</th>
                                            <th>Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                    {console.log('studentList########=>',studentList)}
                                        {studentList && studentList.length > 0 ? (
                                            studentList.map((item, index) => (
                                                <tr key={item.student_id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.student_name}</td>
                                                    <td>
                                                        <input type="text" placeholder="Total Present" onChange={(e) => handleAbsentAndPresent(e, index)} name="present" value={item.totalpresent}  disabled={inputDisable ? true : false}/>
                                                    </td>
                                                    <td>
                                                        <input type="text" placeholder="Total Absent"  onChange={(e) => handleAbsentAndPresent(e, index)} name="absent" value={item.totalabsent} disabled={inputDisable ? true : false}/>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No records found</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            </Col>
                            <Col></Col>
                        </Row>
                    )}
                    {/* <Row className="my-3 mx-5">
                        <Col></Col>
                        <Col lg={10}>
                            <table className="table table-striped table-bordered table-hover"  >
                                <thead style={{ textAlign: "center" }}>
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Student Name</th>
                                        <th>Total Present</th>
                                        <th>Total Absent</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {studentList && studentList?.map((item, index) => (
                                        <tr key={item.student_id}>
                                            <td>{index + 1}</td>
                                            <td>{item.student_name}</td>
                                            <td>
                                                <Col lg={4} className="mx-auto">
                                                    <Form.Group>
                                                        <Form.Control
                                                            type="text"
                                                            name="number"
                                                            // value="12"
                                                            min="1" max="10" step="1"
                                                            onChange={handleChangePresent}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                            <td>
                                                <Col lg={4} className="mx-auto">
                                                    <Form.Group>
                                                        <Form.Control
                                                            type="text"
                                                            name="number"
                                                            // value="12"
                                                            onChange={handleChangePresent}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Col>
                        <Col></Col>
                    </Row> */}
                </Container>
                
            )}

            <ToastContainer />
        </Main>
    )
}

export default AddAttendanceLineItem
