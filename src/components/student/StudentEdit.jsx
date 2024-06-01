import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Main from "../layout/Main";
import PageNavigations from "../breadcrumbs/PageNavigations";
import SiblingTab from "../tabNavigation/SiblingTab";
import ParentTab from "../tabNavigation/ParentTab";
import StudentTab from "../tabNavigation/StudentTab";
import schoolApi from "../../api/schoolApi";
import PreviousSchoolingTab from "../tabNavigation/PreviousSchoolingTab";
import { Helmet } from "react-helmet";
import "../../resources/css/Student.css";
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from "react-toastify";
const StudentEdit = (props) => {
  const location = useLocation();
  console.log('location data on final stage-->', location?.state);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [validatedForParent, setvalidatedForParent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isParent, setIsParent] = useState('');
  const [discountRecords, setDiscountRecords] = useState();
  const [assignTransportRecord, setAssignTransportRecord] = useState({});
  const [feeMasterId, setFeeMasterId] = useState();
  const [feeCategory, setFeeCategory] = useState();
  // const [studentCategory, setStudentCategory] = useState();
  const [lead, setLead] = useState(location?.state);
  const [student, setStudent] = useState({
    firstname: "",
    email: "",
    phone: "",
    classid: "",
    category: "",
    fee_type: ""
  });
  const [familyInfo, setFamilyInfo] = useState({
    fatherfirstname: "",
    fatherlastname: "",
    fatherphone: "",
    fatheremail: "",
    motherfirstname: "",
    motherlastname: "",
    motherphone: "",
    motheremail: "",
    guardianfirstname: "",
    guardianlastname: "",
    guardianphone: "",
    guardianemail: "",
    recordtype: ""
  });
  const [priviousSchool, setPriviousSchool] = useState({
    school_name: "",
    student_id: ""
  });
  console.log("hament bhai")


  const [validatedForPreSchool, setValidatedForPreSchool] = useState(false);
  const steps = [
    { stepName: "Student Information", component: StudentTab },
    { stepName: "Parent Information", component: ParentTab },
    { stepName: "Sibling Information", component: SiblingTab },
    { stepName: "Previous Schooling", component: PreviousSchoolingTab }
  ];

  const [isSearch, setIsSearch] = useState(false);
  const StepComponent = steps[activeStep].component;
  const handleParentsInfo = (data) => {
    console.log('handleParentsInfo@@=>', data);
    setIsParent(data)
  }
  const handleInsertedParents = (data) => {
    setFamilyInfo(data);
  }
  const handleParentData = (data) => {
    let obj = {
      firstname: data[0].firstname,
      lastname: data[0].lastname,
      phone: data[0].phone,
      email: data[0].email,
      recordtype: data[0].recordtype
    }
    setIsSearch(true)

    if (data[0].recordtype === 'Parent_Father') {
      setFamilyInfo({
        ...familyInfo,
        fatherfirstname: obj.firstname,
        fatherlastname: obj.lastname,
        fatherphone: obj.phone,
        fatheremail: obj.email,
        recordtype: obj.recordtype

      });
    } else if (data[0].recordtype === 'Parent_Mother') {
      setFamilyInfo({
        ...familyInfo,
        motherfirstname: obj.firstname,
        motherlastname: obj.lastname,
        motherphone: obj.phone,
        motheremail: obj.email,
        recordtype: obj.recordtype
      });
    } else if (data[0].recordtype === 'Parent_Guardian') {
      setFamilyInfo({
        ...familyInfo,
        guardianfirstname: obj.firstname,
        guardianlastname: obj.lastname,
        guardianphone: obj.phone,
        guardianemail: obj.email,
        recordtype: obj.recordtype

      });
    }
  }
  const handleStudentTab = (data) => {
    console.log('data--> on handleStudentTab-->', data);
    if (data?.assign_transport) {
      setAssignTransportRecord(data?.assign_transport)
    } else if (data?.discounts) {
      setDiscountRecords(data?.discounts);
    }
    else if (data?.fee_type) {
      setFeeMasterId(data?.fee_type);
      student.fee_type = data?.fee_type;
    }
    else if (data?.category) {
      setStudent(data);
      if (data?.category === "General") {
        setFeeCategory("general_fee");
      } else if (data?.category === "Obc") {
        setFeeCategory("obc_fee");
      } else if (data?.category === "Sc") {
        setFeeCategory("sc_fee");
      } else if (data?.category === "St") {
        setFeeCategory("st_fee");
      }
    }
    else {
      setStudent(data)
    }
  }
  console.log('assignTransportRecord has riched on parent-->', assignTransportRecord);

  console.log('disountrecords-->', discountRecords);

  const handlePreviousSchool = (data) => {
    setPriviousSchool(data)
  }



  ///---------HANDLE FINISH IS HERE --------------------
  const handleFinish = async (e) => {
    e.preventDefault();
    // const session_id = student?.session_id;
    console.log('session_id latest-->', student);
    const sessions = await schoolApi.fetchSessions();
    if (sessions) {

      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      const fetchSelectedSessionResult = sessions.find((res) => { return res.year === `${currentYear}-${nextYear}`; });
      console.log('fetchSelectedSessionResult--> xyz', fetchSelectedSessionResult);

      if (!fetchSelectedSessionResult) {
        return toast.error('Create session records first!!');
      }

      student.session_id = fetchSelectedSessionResult?.id;
    }
    if (!priviousSchool.school_name && activeStep === 3) {
      if (checkRequredFields2()) {
        setValidatedForPreSchool(true);
        toast.error("Fill all required fields!!!");
      }
    } else {
      if (student !== '' && familyInfo !== '' && priviousSchool !== '' && props.rteUrlName === 'rte') {
        student.isrte = true;
        const result = await schoolApi.createContOnRecType(familyInfo);
        const getParentCont = await schoolApi.fetchParentContacts();
        getParentCont.forEach((item) => {
          if (item.phone === student.phone) {
            student.parentId = item.id;
          }
        });
        const fee_type = student?.fee_type;
        //  const student_category = student?.category;
        // delete student?.fee_type

        const studentRec = await schoolApi.createStudent(student);
        console.log('studentRec-->rte', studentRec);
        priviousSchool.student_id = studentRec.result.id;
        priviousSchool.student_phone = studentRec.result.phone;

        const previousSchoolRec = await schoolApi.createPreviousSchool(priviousSchool);
        if (previousSchoolRec.message) {
          toast.error(previousSchoolRec.message, { position: toast.POSITION.TOP_RIGHT })
        } else {
          const arr = {
            studentid: studentRec.result.id,
            classid: studentRec.result.classid,
            parentid: studentRec.result.parentid,
            fee_type: fee_type,
            session_id: student?.session_id,
            dateofaddmission: '2023-02-04',
            year: '',
            isrte: true
          };

          const result2 = await schoolApi.createStudentAddmission(arr);
          PubSub.publish("RECORD_SAVED_TOAST", {
            title: "Record Create",
            message: "Record Created successfully",
          });
          if(lead.length>0){
            lead.status = 'Registered';
            result = await schoolApi.savelead(lead);
            if (result.success) {
              PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
              navigate(`/students/${result.lead.resultCon.id}`, { state: lead });
            }
          }
          if (result2.id) {
            navigate("/rte");
          }
        }
      } else if (student !== '' && familyInfo !== '' && priviousSchool !== '') {
        const result = await schoolApi.createContOnRecType(familyInfo);
        const getParentCont = await schoolApi.fetchParentContacts();
        getParentCont.forEach((item) => {
          if (item.phone === student.phone) {
            student.parentId = item.id;
          }
        });
        const student_fee_type = student?.fee_type;
        const studentRec = await schoolApi.createStudent(student);
        console.log('@@@studentRec-->', studentRec);
        priviousSchool.student_id = studentRec.result.id;
        priviousSchool.student_phone = studentRec.result.phone;
        const previousSchoolRec = await schoolApi.createPreviousSchool(priviousSchool);
        console.log('previousSchoolRec-->', previousSchoolRec);

        const arr = {
          studentid: studentRec.result.id,
          classid: studentRec.result.classid,
          parentid: studentRec.result.parentid,
          fee_type: student_fee_type,
          session_id: student?.session_id,
          dateofaddmission: '2023-02-04',
          year: '',
          isrte: false
        };
        const result2 = await schoolApi.createStudentAddmission(arr);
        if(lead?.length > 0){
          lead.status = 'Registered';
          const leadresult = await schoolApi.savelead(lead);
          if (leadresult.success) {
            PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Saved', message: 'Record saved successfully' });
            navigate(`/students/${leadresult.lead.resultCon.id}`, { state: lead });
          }
        }
        if (discountRecords && result2.id) {
          console.log('going to create discount records-->');
          let discountLineItemRecord = { student_addmission_id: result2.id, discounts: discountRecords }
          const discountLineItemsResult = await schoolApi.createFeeDiscountLineItems(discountLineItemRecord);
          console.log('discountLineItemsResult after create-->', discountLineItemsResult);

          //----------Transport creation api---------------------

          //-----------------------------------------------------
        }

        let resultCreateAssignTransport = {};
        if (assignTransportRecord && result2?.id) {
          let obj = { ...assignTransportRecord, student_addmission_id: result2.id, sessionid: student?.session_id }
          console.log('obj for creating assignTransport-->', obj);
          resultCreateAssignTransport = await schoolApi.createAssignTransport(obj);
          console.log('resultCreateAssignTransport-->', resultCreateAssignTransport)
        }

        if (feeMasterId && result2.id) {
          const feeMasterRecord = await schoolApi.getMasterInstallmentByFeeMasterId(feeMasterId);
          console.log('feeMaster installment Record-->', feeMasterRecord);
          // console.log('first student=>',student)
          // console.log('session record-->', student?.session_id);
          const fetchSelectedSessionResult = await schoolApi.getSessionById(student?.session_id);
          console.log('fetchSelectedSessionResult--> xyz', fetchSelectedSessionResult);

          let pendingDueResult = [];
          const ResultSettings = await schoolApi.getSettingByKey("pending_due_day");
          console.log('ResultSettings-->', ResultSettings);
          if (ResultSettings.success) {
            pendingDueResult.push(ResultSettings.data[0]);
          } else {
            pendingDueResult([]);
          }

          console.log('pendingDueResult-->', pendingDueResult);
          let transportFeeByInstall = 0;
          if (resultCreateAssignTransport) {
            transportFeeByInstall = parseInt(resultCreateAssignTransport?.result?.fare_amount) / feeMasterRecord.length
          }

          console.log('transportFeeByInstall-->', transportFeeByInstall);
          let recordsForStudentInstallment = [];
          if (feeMasterRecord) {
            const transportFee = Math.ceil(transportFeeByInstall || 0);
            console.log('transportFee-->', transportFee);


            feeMasterRecord.forEach((res, index) => {
              let splittedMonth = res?.month?.split(" ");
              const monthIndex = {
                'January': 0,
                'February': 1,
                'March': 2,
                'April': 3,
                'May': 4,
                'June': 5,
                'July': 6,
                'August': 7,
                'September': 8,
                'October': 9,
                'November': 10,
                'December': 11
              };

              let lastDate = new Date(fetchSelectedSessionResult?.result?.startdate);

              if (pendingDueResult[0].value) {
                lastDate.setDate(pendingDueResult[0].value);
              }

              lastDate.setMonth(monthIndex[splittedMonth[0]]);

              let installmentDate = lastDate.toISOString().slice(0, 10);

              console.log('installmentDate-->', installmentDate);

              recordsForStudentInstallment.push({
                student_addmission_id: result2?.id,
                fee_master_installment_id: res?.id,
                amount: res[feeCategory],
                status: 'pending',
                orderno: index + 1,
                due_date: installmentDate,
                session_id: student?.session_id,
                transport_fee: transportFee,
                assign_transport_id: resultCreateAssignTransport?.result?.id ? resultCreateAssignTransport?.result?.id : null,
                month: res?.month,
              });
            })

            console.log('student installments to be created-->', recordsForStudentInstallment);

            const resultStudentInstallments = await schoolApi.createStudentFeeInstallments(recordsForStudentInstallment);
            console.log('resultStudentInstallments', resultStudentInstallments);

            if (resultStudentInstallments) {
              console.log('student fee transport records created successfully', resultStudentInstallments);
            }
          }
        }


        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Create",
          message: "Record Created successfully",
        });
        if (result2.id) {
          navigate("/studentaddmissions");
        }
      }
    }
  }
  const handleNext = async (e) => {
    console.log('handle next', student, activeStep);
    e.preventDefault();
    if ((!student.firstname || (student?.class_id ? !student.class_id : !student.classid) || !student.category || !student.phone || !student.fee_type) && activeStep === 0) {
      console.log('handle next 1');
      if (checkRequredFields()) {
        console.log('first111')
        setValidated(true);
        toast.error("Fill all required fileds!!!");
      }
      console.log('Hey yes')
    } else if (((!familyInfo.fatherfirstname || !familyInfo.fatherlastname || !familyInfo.fatherphone ||
      !familyInfo.motherfirstname || !familyInfo.motherlastname || !familyInfo.motherphone ||
      !familyInfo.guardianfirstname || !familyInfo.guardianlastname || !familyInfo.guardianphone) &&
      (activeStep === 1))) {
      console.log('handle next 2', familyInfo);
      if (checkRequredFields1()) {
        setvalidatedForParent(true);
        toast.error("Fill all required fields!!!");
      }
    } else {
      console.log('handle next 3');
      const resultStuDup = await schoolApi.checkStudentDuplicacy(student);
      if (resultStuDup.message) {
        toast.error('This Student is already exist', { position: toast.POSITION.TOP_RIGHT })
      } else if (familyInfo.fatherfirstname !== '') {
        if (isSearch === false) {
          const resultContDup = await schoolApi.checkContactDuplicacy(familyInfo);
          if (resultContDup.message) {
            toast.error('The Contact is already exist', { position: toast.POSITION.TOP_RIGHT })
          } else {
            setActiveStep(activeStep + 1);
            setValidated(false);
            setvalidatedForParent(false);
          }
        } else {
          setActiveStep(activeStep + 1);
          setValidated(false);
          setvalidatedForParent(false);
        }
      } else {
        setActiveStep(activeStep + 1);
        setValidated(false);
        setvalidatedForParent(false);
      }

    }
  };
  const checkRequredFields = () => {
    console.log('checkRequredFields@@@=>', student)
    if (student && student.firstname && student.firstname.trim() !== '' && (student.class_id && student.class_id.trim() !== '' || student.classid && student.classid.trim() !== '') &&
      student.category && student.category.trim() !== '' && student.phone && student.phone.trim() !== '' && student.fee_type && student.fee_type.trim() !== '') {
      console.log('Yest')
      return false;
    }
    else {
      console.log('notee')
      return true;
    }
  }
  const checkRequredFields1 = () => {
    console.log('first familyInfo', familyInfo)
    if ((familyInfo.father_name && familyInfo.father_name.trim() !== '') && (familyInfo.father_qualification && familyInfo.father_qualification.trim() !== '')
      && (familyInfo.father_occupation && familyInfo.father_occupation.trim() !== '') && (familyInfo.mother_name && familyInfo.mother_name.trim() !== '')
      && (familyInfo.mother_qualification && familyInfo.mother_qualification.trim() !== '') && (familyInfo.mother_occupation && familyInfo.mother_occupation.trim() !== '')) {
      console.log('1111')
      return false;
    } else if ((familyInfo.fatherfirstname && familyInfo.fatherfirstname.trim() !== '') && (familyInfo.fatherlastname && familyInfo.fatherlastname.trim() !== '')
      && (familyInfo.fatheremail && familyInfo.fatheremail.trim() !== '') && (familyInfo.motherfirstname && familyInfo.motherfirstname.trim() !== '')
      && (familyInfo.motherlastname && familyInfo.motherlastname.trim() !== '') && (familyInfo.motheremail && familyInfo.motheremail.trim() !== '')
      && (familyInfo.guardianfirstname && familyInfo.guardianfirstname.trim() !== '') && (familyInfo.guardianlastname && familyInfo.guardianlastname.trim() !== '')
      && (familyInfo.guardianemail && familyInfo.guardianemail.trim() !== '')) {
      console.log('222')
      return false;
    }
    else {
      return true;
    }
  }
  const checkRequredFields2 = () => {
    if ((priviousSchool.school_name && priviousSchool.school_name.trim() !== '')) {
      return false;
    }
    else {
      return true;
    }
  }
  const handlePrevious = () => {
    if (student !== '' || familyInfo !== '') {
      if (activeStep > 0) {
        setActiveStep(activeStep - 1);
        setValidated(false);
      }
    }
    else {
      setValidated(true);
    }
  };
  return (
    <Main>
      <Helmet>
        <title>{props?.tabName}</title>
      </Helmet>
      <PageNavigations
        id={location.state?.id}
        listName="Student List"
        listPath="/studentaddmissions"
        viewName="Student View"
        viewPath={`/studentaddmissions/${location.state?.id}`}
        colLg={12}
        colClassName="d-flex px-4 py-0 pb-2"
        extrColumn={0}
      />
      <Card className="m-5 custom-card">
        <Container fluid style={{ marginTop: "15px" }}>
          <Row>
            <Col xs={12} md={12} className="mr-auto ml-auto">
              <div className="navigation-header">
                <h2 className="custom-heading pt-4">Student Registration</h2>
                <div className="step-navigation">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      className={`step-button ${index === activeStep ? "active" : ""
                        }`}
                    >
                      {step.stepName}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <StepComponent handleInsertedParents={handleInsertedParents} validatedForPreSchool={validatedForPreSchool} validatedForParent={validatedForParent} lead={lead} student={student} familyInfo={familyInfo} handleParentsInfo={handleParentsInfo} handleParentTab={handleParentData} isParent={isParent} validated={validated} handleStudentTab={handleStudentTab} handlePreviousSchool={handlePreviousSchool} />
              </div>
              <div className="text-center mt-3">
                {activeStep > 0 && (
                  <Button variant="primary" onClick={handlePrevious} style={{ margin: "5px", fontWeight: "bold" }}>
                    Previous
                  </Button>
                )}
                {activeStep < steps.length - 1 && (
                  <Button variant="primary" onClick={handleNext} style={{ height: "29px", width: "62px", fontWeight: "bold" }}>
                    Next
                  </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button variant="success" onClick={handleFinish} >
                    Finish
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          <ToastContainer />
        </Container>
      </Card>
    </Main>
  );
};
export default StudentEdit;