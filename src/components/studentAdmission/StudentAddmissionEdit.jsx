import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "react-bootstrap-typeahead/css/Typeahead.css";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";
import moment from "moment";
import Main from "../layout/Main";
import { Helmet } from 'react-helmet';
import PageNavigations from "../breadcrumbs/PageNavigations";
import Select from "react-select";
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';
import { ShimmerTable } from "react-shimmer-effects";

const StudentAddmissionEdit = (props) => {
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  console.log('location.state on view-->', location?.state);

  const navigate = useNavigate();
  const [studentaddmission, setStudentAddmission] = useState({ fee_type_id: location?.state?.fee_type });
  const [student, setStudent] = useState();
  const [classes, setClasses] = useState();
  const [parent, setParent] = useState();
  const [discountRecords, setDiscountRecords] = useState();
  const [discountOptions, setDiscountOptions] = useState();
  const [studentInstallments, setStudentInstallments] = useState([]);
  const [feeTypeOptions, setFeeTypeOptions] = useState([]);
  let classList;

  useEffect(() => {
    async function related() {
      const student = await schoolApi.fetchStudents();
      const classes = await schoolApi.getActiveClassRecords();
      const parent = await schoolApi.fetchParentContacts();
      let feeMasterResult = await schoolApi.fetchFeeMasterByIdOrClassid(location?.state?.classid);
      console.log('feeMasterResult by classid-->', feeMasterResult);
      if (feeMasterResult) {
        let ar = [];
        feeMasterResult.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.type;
          ar.push(obj);
        })
        console.log('ar- fee master result->', ar);
        setFeeTypeOptions(ar);

      } else {
        setFeeTypeOptions([]);
      }

      console.log('parent==>', parent);
      if (student) {
        console.log('student=>', student)
        let ar = [];
        student.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.firstname + '' + item.lastname;
          ar.push(obj);
        })
        setStudent(ar);
      }
      if (classes) {
        setClasses(classes);
      }
      if (parent) {
        console.log('oparebj=>', parent)
        let ar = [];
        parent.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.firstname + '' + item.lastname;
          ar.push(obj);
        })
        setParent(ar);
      }

      fetchDiscountLineItems();
      studentFeeInstallment();
    }
    related();
  }, []);

  const studentFeeInstallment = async () => {
    try {
      let result = await schoolApi.fetchStudentFeeInstallments(location?.state?.student_addmission_id);
      console.log('result studentFeeInstallment ==>', result);
      if (result.success) {
        setStudentInstallments(result.result);
      }
      else {
        setStudentInstallments([]);
      }
    } catch (error) {
      console.error('Error fetching studentFeeInstallment:', error);
    }
  };

  console.log('studentInstallments-->', studentInstallments);

  const fetchDiscountLineItems = async () => {
    try {
      let result = await schoolApi.fetchFeeDiscountLineItemsBySt(location?.state?.id);
      console.log('discount result-->', result);
      if (result) {
        result.map((res) => {
          setDiscountOptions((prevOptions) => {
            if (!prevOptions) {
              return [{ value: res.discountid, label: res.discount_name }]
            }
            if (!prevOptions.some(prev => prev.label === res.discount_name)) {
              return [...prevOptions, { value: res.discountid, label: res.discount_name }];
            }
            return prevOptions;
          });
        })
      }

      let allDiscountResults = await schoolApi.fetchFeeDiscounts();
      if (allDiscountResults) {
        let ar = [];
        allDiscountResults.map((item) => {
          var obj = {};
          obj.value = item.id;
          obj.label = item.name;
          ar.push(obj);
        })
        setDiscountRecords(ar);
      } else {
        setDiscountRecords([]);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    //Added by Farhan Khan This is Using to show Select Class Section on Edit Time.
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.classid;
      temp2.label = location?.state.classname;
    }
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.parentid;
      temp2.label = location?.state.parentname;
    }
    if (location.state?.id) {
      let temp2 = {};
      temp2.value = location?.state.vehicleid;
      temp2.label = location?.state.vehicle_number;
    }
    if (location.state?.id) {
      console.log('inn tj loa=>', location.state?.id);
      console.log('inn tj loa%$%=>', location.state);
      setStudentAddmission(location?.state);
    }

  }, []);

  const handleChange = (e) => {
    console.log('inside the handleChange', e.target.value);
    setStudentAddmission({
      ...studentaddmission, [e.target.name]: e.target.value,
    });
  };
  const handleDiscounts = (selectedOption) => {
    console.log('selectedOption-->', selectedOption);
    setDiscountOptions(selectedOption);
  }

  // const handleFeeChange = (e)=>{
  //  }
  console.log('discountOptions-->', discountOptions);
  const handleStudent = (e) => {
    console.log('inside the handleChange', e.target.value);
    setStudentAddmission({
      ...studentaddmission, [e.target.name]: e.target.value,
    });
  };

  const checkRequredFields = () => {
    if (
      studentaddmission.student_addmission_id &&
      studentaddmission.student_addmission_id.trim() !== ""
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkRequredFields()) {
      setValidated(true);
      return;
    }
    //========= Logic to perform Create or Edit ======
    let result2 = {};
    // let updateDisRec = [];
    console.log('yffeh=>', studentaddmission);
    if (studentaddmission.student_addmission_id) {
      result2 = await schoolApi.saveStudentAddmission(studentaddmission);
      console.log('student addmission edit result-->', result2);
      if (result2.success) {

        let updateDisRec = { student_addmission_id: location?.state?.student_addmission_id, discounts: discountOptions }
        console.log('updateDisRec-->', updateDisRec);
        let updatedResult = await schoolApi.updateFeeDiscountLineItems(updateDisRec);

        console.log('updatedResult-->', updatedResult);

        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/studentaddmissions/${studentaddmission.student_addmission_id}`, {
          state: studentaddmission,
        });
      }
    } else {
      result2 = await schoolApi.createStudentAddmission(studentaddmission);

      if (result2) {
        PubSub.publish("RECORD_SAVED_TOAST", {
          title: "Record Saved",
          message: "Record saved successfully",
        });
        navigate(`/studentaddmissions/${result2.id}`, { state: result2 });
      }
    }
  };

  console.log('studentaddmission--->', studentaddmission);

  const handleCancel = () => {
    if (location?.state?.id) {
      navigate("/studentaddmissions/" + studentaddmission.student_addmission_id, {
        state: studentaddmission,
      });
    } else {
      navigate("/studentaddmissions/");
    }
  };

  const header = [
    {
      title: 'Month',
      prop: 'month',
      isFilterable: true,

    },
    {
      title: 'Amount',
      prop: 'amount',

    },
    {
      title: 'Deposited amount',
      prop: 'deposit_amount',
      isFilterable: true,

    },
    {
      title: 'Due Date',
      prop: 'due_date',
      isFilterable: true,

    },
    {
      title: 'Status',
      prop: 'status',
      isFilterable: true,

    },
    {
      title: 'Transport Fee',
      prop: 'transport_fee',

    },
  ];

  const handleInputChange = (e, rowIndex, propName) => {
    const { value } = e.target;
    const updatedInstallments = [...studentInstallments];
    console.log('updatedInstallments-->', updatedInstallments);
    updatedInstallments[rowIndex][propName] = value;

    console.log('updatedInstallments-->', updatedInstallments);

  };

  return (
    <Main>
      <Helmet><title>{props?.tabName}</title></Helmet>
      <PageNavigations id={location?.state?.id} listName="Addmissons List" listPath="/studentaddmissions"
        viewName="Addmission View" viewPath={"/studentaddmissions/" + location?.state?.student_addmission_id}
        colLg={12} colClassName="d-flex px-3 py-2" extrColumn={1} />
      <Container className="view-form">
        <Form>
          <Row>
            <Col lg={12}>
              <Form
                className="mt-3"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                <Row className="view-form-header align-items-center mx-3">
                  <Col lg={3}>Edit Student Addmission</Col>
                  <Col lg={9} className="d-flex justify-content-end">
                    <Button className="btn-sm mx-2" onClick={handleSubmit}>
                      Save
                    </Button>
                    <Button
                      className="btn-sm"
                      variant="danger"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
                <Row className="mx-3">
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                      >
                        Student Name
                      </Form.Label>
                      <Form.Select
                        name="studentid"
                        onChange={handleStudent}
                        required
                        value={studentaddmission.studentid}
                      >
                        <option value="">-- Select Student --</option>
                        {student && student.map((res) => (
                          <option key={res.value} value={res.value}>
                            {res.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                      >
                        Class Name
                      </Form.Label>
                      <Form.Select
                        name="classid"
                        onChange={handleChange}
                        required
                        value={studentaddmission.classid}
                      >
                        <option value="">-- Select Class --</option>
                        {classes && classes.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.classname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicAddmissionDate"
                      >
                        Form No
                      </Form.Label>
                      <Form.Control type="text" name="formno" placeholder="Enter Form Number" value={studentaddmission.formno} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label className="form-view-label"> Date Of Addmission </Form.Label>
                      <Form.Control
                        type="date"
                        name="dateofaddmission"
                        placeholder="Enter date of addmission"
                        value={
                          studentaddmission
                            ? moment(studentaddmission.dateofaddmission).format(
                              "YYYY-MM-DD"
                            )
                            : ""
                        }
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                        htmlFor="formBasicAddmissionDate"
                      >
                        Year
                      </Form.Label>
                      <Form.Control type="text" name="year" placeholder="Enter Year" value={studentaddmission.year} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mx-3">
                      <Form.Label
                        className="form-view-label"
                      >
                        Parent Name
                      </Form.Label>
                      <Form.Select
                        name="parentid"
                        onChange={handleChange}
                        required
                        value={studentaddmission.parentid}
                      >
                        <option value="">-- Select Parent --</option>
                        {parent && parent.map((res) => (
                          <option key={res.value} value={res.value}>
                            {res.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                </Row>
              </Form>
            </Col>
            <Col md={4}>
              <Form>
                <Form.Group className=" mx-2">
                  <Form.Label
                    className="text-formatted"
                  >
                    Fee Installment Type
                  </Form.Label>
                  <Form.Select
                    required
                    name="fee_type"
                    value={studentaddmission.fee_type}
                    onChange={handleChange}
                  // style={{ fontSize: "14px" }}
                  >
                    <option value="">-- Select Type --</option>
                    {feeTypeOptions.map((res) => (
                      <option key={res.value} value={res.value}>
                        {res.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>

          </Row>
        </Form>


        <Row className="mt-4 mb-3">
          <Col lg={12}>
            <Col className="mx-3">
              <Col className="section-header my-3">
                <span style={{ color: "black" }}>Fee Installments</span>
              </Col>
            </Col>
          </Col>
          <Col className="mx-3">
            <DatatableWrapper body={studentInstallments} headers={header} >
              <Table striped className="data-table">
                <TableHeader />
                <TableBody />
              </Table>
            </DatatableWrapper>
          </Col>
        </Row>
      </Container >
    </Main >
  );
};

export default StudentAddmissionEdit;
