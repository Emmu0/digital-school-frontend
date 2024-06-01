import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Main from '../layout/Main';
import { Helmet } from 'react-helmet';
import { Col, Container, Row, ToastContainer, Form, Table, Button } from 'react-bootstrap';
import schoolApi from '../../api/schoolApi';

const Promotion = ({ props }) => {
    const location = useLocation()
    const [allSection, setAllsection] = useState([])
    const [stundets, setStundets] = useState([])
    const [promotionData, setPromotionData] = useState([])
    console.log(allSection, 'allSection');
    useEffect(() => {
        if (allSection.length == 0) {
            schoolApi.getSectionRecords().then((result) => {
                if (result.length > 0) {
                    setAllsection(result)
                    if (promotionData.length == 0) {
                        console.log("console 1");
                        schoolApi.fetchStudentAddmission(null).then((Studentres) => {
                            const updatedPromotionData = Studentres.map((student) => {
                                return {
                                    studentName: `${student.firstname} ${student.lastname}`,
                                    id: student.id,
                                    isCheck: true,
                                    isResult: "pass",
                                    nextSection: result?.find((vl) => vl?.class == incrementOrdinal(result?.find((vl) => vl?.section_id == location?.state?.section_id)?.class_name))
                                };
                            });

                            setPromotionData(updatedPromotionData);

                        })
                    }

                }

            })
        }
    }, [])
    const handleChange = (e) => {
        if (e.target.name == "promotedId") {
            const updatedPromotionData = promotionData.map((value) => {
                return {
                    ...value,
                    nextSection: allSection.find((vl) => vl.section_id == e.target.value)
                };
            });
            setPromotionData(updatedPromotionData);
        }
    }


    function incrementOrdinal(ordinal) {
        // Extract the number part and the suffix part from the ordinal string
        const match = ordinal.match(/^(\d+)(\D+)$/);
        if (!match) {
            throw new Error('Invalid ordinal format');
        }

        const number = parseInt(match[1], 10);
        const suffix = match[2];

        // Increment the number
        const newNumber = number + 1;

        // Determine the new suffix
        let newSuffix;
        if (newNumber % 10 === 1 && newNumber % 100 !== 11) {
            newSuffix = 'st';
        } else if (newNumber % 10 === 2 && newNumber % 100 !== 12) {
            newSuffix = 'nd';
        } else if (newNumber % 10 === 3 && newNumber % 100 !== 13) {
            newSuffix = 'rd';
        } else {
            newSuffix = 'th';
        }

        // Return the new ordinal string
        return `${newNumber}${newSuffix}`;
    }
    const [view, setView] = useState(false)
    const viewHandler = () => {
        setView(!view)
    }


    const onChangeHandler = (e,vl,index)=> {
        console.log(e.target.value,allSection.find((vl)=> vl.section_id ==e.target.value),'e.target ptaha ');
        const updatedPromotionData = promotionData.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    nextSection: e.target.name == "nextSection" ?  allSection.find((vl)=> vl.section_id ==e.target.value) : item.nextSection,
                    isCheck:e.target.name == "isCheck"  ? !vl.isCheck : true ,
                    isResult: e.target.name == "isResult" ? e.target.value :'Pass'
                };
            }
            return item;
        });

        setPromotionData(updatedPromotionData);

        console.log(vl, index, e.target.value, 'vl, index');
//         // vl.isResult = e.target.value
//         promotionData[index].isResult = e.target.value
// console.log(vl,index,e.target.value,'vl,index');
// return promotionData

    }
    console.log(promotionData,'vl,index 2');

    return (
        <>
            <Main>
                <Helmet>
                    {" "}
                    <title>{props?.tabName}</title>{" "}
                </Helmet>

                <Row className="g-0">
                    <Col lg={2} className="mx-3">
                        <Link className="nav-link mx-2" to="/">
                            Home <i className="fa-solid fa-chevron-right"></i> FeeDepositeCreate
                        </Link>
                    </Col>

                    <Container>
                        <Row className="view-form">
                            <Col lg={12} className="mx-3 d-flex mt-5">
                                <Col lg={6}>
                                    <Form.Group className="w-75">
                                        <Form.Label>Current Class</Form.Label>
                                        <Form.Select
                                            name="current_cls_id"
                                        >
                                            <option key={location.state.section_id} value={location.state.section_id} >
                                                {location.state.class_name + ' ' + location.state.section_name}
                                            </option>
                                            {allSection.map((vl) => vl.section_id !== location.state.section_id && (
                                                <option key={vl.section_id} value={vl.section_id}>
                                                    {vl.class_name + ' ' + vl.section_name}
                                                </option>
                                            ))}

                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="w-75">
                                        <Form.Label>Promoted class</Form.Label>
                                        <Form.Select
                                            name="promotedId"
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option value={allSection.find((vl) => vl.class == incrementOrdinal(allSection.find((vl) => vl.section_id == location.state.section_id)?.class_name))?.section_id}>{allSection.find((vl) => vl.class == incrementOrdinal(allSection.find((vl) => vl.section_id == location.state.section_id)?.class_name))?.class_name} {" "} {allSection.find((vl) => vl.class == incrementOrdinal(allSection.find((vl) => vl.section_id == location.state.section_id)?.class_name))?.section_name}</option>
                                            {allSection.map((vl) => (
                                                <option key={vl.section_id} value={vl.section_id}>
                                                    {vl.class_name + ' ' + vl.section_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                            </Col>
                        </Row>
                    </Container>

                    <Col lg={12} className="mx-3 mt-5 py-2 px-3 text-light fw-bold" style={{ background: "grey" }}>
                        <h5 className="mb-0">Student List</h5>
                    </Col>

                    {!view ?
                        <Container>
                            <div style={{ overflowX: "auto", width: "100%" }} className='mt-4'>
                                <Table striped bordered hover id="myTable">
                                    <thead>
                                        <tr style={{ backgroundColor: "#B8250E" }}>

                                            <th
                                                style={{
                                                    width: "10px",
                                                    maxWidth: "10px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Form.Check
                                                    name='check_std'
                                                    value={false}
                                                />

                                            </th>

                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Name

                                            </th>
                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Result

                                            </th>
                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Promoted Class

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {promotionData?.map((vl, ky) => (
                                            <tr key={vl.section_id}>
                                                <td
                                                    style={{
                                                        width: "30px",
                                                        maxWidth: "30px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    <Form.Check
                                                        name='isCheck'
                                                        onChange={(e) => onChangeHandler(e,vl,ky)}
                                                        value={vl.isCheck}
                                                        checked={vl.isCheck}
                                                    />
                                                </td>
                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={vl.section_id}
                                                >
                                                    {vl?.studentName}
                                                </td>

                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={"month"}
                                                >
                                                    <Form.Group className="w-75">
                                                        <Form.Select
                                                            name="isResult"
                                                        // value={
                                                        //     feeDeposite.sessionid === ""
                                                        //         ? currentSession && currentSession.id
                                                        //         : feeDeposite.sessionid && feeDeposite.sessionid
                                                        // }
                                                        onChange={(e)=> onChangeHandler(e,vl,ky)}
                                                        >
                                                            <option value={vl.isResult == "Pass" ? vl.isResult : "Pass"}>{vl.isResult == "Pass" ? vl.isResult : "Pass"}</option>
                                                            <option value="Fail">Fail</option>
                                                            <option value="Drop">Drop</option>

                                                        </Form.Select>
                                                    </Form.Group>
                                                </td>
                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={vl.nextSection?.section_id}
                                                >
                                                    <Form.Group className="w-75">
                                                        <Form.Select
                                                            name="nextSection"
                                                        // value={
                                                        //     feeDeposite.sessionid === ""
                                                        //         ? currentSession && currentSession.id
                                                        //         : feeDeposite.sessionid && feeDeposite.sessionid
                                                        // }
                                                        onChange={(e)=> onChangeHandler(e,vl,ky)}
                                                        >
                                                            <option value={vl.nextSection?.section_id}>{vl?.nextSection?.class_name}{' '}{vl?.nextSection?.section_name}</option>
                                                            {allSection.map((vl) => (
                                                                <option key={vl.section_id} value={vl.section_id}>
                                                                    {vl.class_name + ' ' + vl.section_name}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </Table>
                                <Button onClick={() => viewHandler()}>Next</Button>
                            </div>
                        </Container>
                        :
                        <Container>
                            <div style={{ overflowX: "auto", width: "100%" }} className='mt-4'>
                                <Table striped bordered hover id="myTable">
                                    <thead>
                                        <tr style={{ backgroundColor: "#B8250E" }}>
                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Name

                                            </th>
                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Result

                                            </th>
                                            <th
                                                style={{
                                                    width: "140px",
                                                    maxWidth: "140px",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#637384",
                                                    color: "white",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Promoted Class

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promotionData?.map((vl, ky) => (
                                            <tr key={vl.section_id}>
                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={vl.section_id}
                                                    className='text-center'
                                                >
                                                    {vl?.studentName}
                                                </td>

                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={"month"}
                                                >
                                                    <Form.Group className="w-75 text-center">
                                                        <span>
                                                            {vl.isResult}</span>
                                                    </Form.Group>
                                                </td>
                                                <td
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={vl.nextSection?.section_id}
                                                >
                                                    <Form.Group className="w-75 text-center">
                                                        <span>
                                                            {vl?.nextSection?.class_name}{' '}{vl?.nextSection?.section_name}

                                                        </span>
                                                    </Form.Group>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </Table>
                                <Button className='mx-3' onClick={() => viewHandler()}>Back</Button>
                                <Button onClick={() => viewHandler()}>Save</Button>
                            </div>
                        </Container>
                    }

                    {/* <Row className="my-3">
                        <Col lg={12}>
                            {showTable && (
                                <div style={{ overflowX: "auto", width: "100%" }}>
                                    <Table striped bordered hover id="myTable">
                                        <thead>
                                            <tr style={{ backgroundColor: "#B8250E" }}>
                                                <th
                                                    style={{
                                                        width: "140px",
                                                        maxWidth: "140px",
                                                        whiteSpace: "nowrap",
                                                        backgroundColor: "#637384",
                                                        color: "white",
                                                        paddingBottom: "17px",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Head Name
                                                </th>
                                                {console.log(depositedMonth, 'depositedMonth ==>')}
                                                {totalFees.map((value, index) => (
                                                    <th
                                                        style={{
                                                            width: "140px",
                                                            maxWidth: "140px",
                                                            whiteSpace: "nowrap",
                                                            backgroundColor: "#637384",
                                                            color: "white",
                                                            textAlign: "center",
                                                        }}
                                                        key={value.id}
                                                    >
                                                        {value.month}
                                                        <Form>
                                                            <Form.Check
                                                                inline
                                                                type="checkbox"
                                                                name={"checkedMonth"}
                                                                checked={depositedMonth?.find(
                                                                    (res) =>
                                                                        res.month === value.month &&
                                                                        res.status === 'completed'
                                                                ) || value.createdbyid}
                                                                style={{ fontSize: "18px" }}
                                                                onChange={(e) => handleChange(e, value.month, index)}
                                                                disabled={value.status == "completed" || !value.isdissable}
                                                            />
                                                        </Form>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {console.log(headNames, 'headNames')}
                                            {headNames.map((headName, index) => (
                                                <tr key={index}>
                                                    <td
                                                        style={{
                                                            width: "140px",
                                                            maxWidth: "140px",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {headName}
                                                    </td>
                                                    {selectedMonths.map((month, ky) => {

                                                        return (
                                                            <>
                                                                <td
                                                                    style={{
                                                                        width: "140px",
                                                                        maxWidth: "140px",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                    key={month}
                                                                >
                                                                    {totalFees
                                                                        ? totalFees[ky]?.heads?.find(
                                                                            (vl) => vl.label === headName
                                                                        ).value
                                                                        : ""}
                                                                </td>
                                                            </>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Col>
                    </Row> */}

                    {/* {totalAmount > 0 && (
                        <>
                            <Row>
                                <Col lg={1}></Col>
                                <Col lg={5} className="mb-3">
                                    <Row>
                                        <Form.Group className="mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicEmail"
                                            >
                                                Total Amount
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="totalAmount"
                                                placeholder="Enter Duration"
                                                value={totalAmount}
                                                onChange={(e) => handleChange(e, null, null)}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Discount
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                disabled
                                                value={feeDeposite?.discount}
                                                name="discount"
                                                placeholder="Enter Discount"
                                                onChange={(e) => handleChange(e, null, null)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Gross Payable
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                disabled
                                                value={grossPayabe}
                                                name="discount"
                                                placeholder="Enter Discount"
                                                onChange={(e) => handleChange(e, null, null)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className=" mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicEmail"
                                            >
                                                Prevoius Dues
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="totalAmount"
                                                placeholder="Total Dues"
                                                value={totalDues}
                                                onChange={(e) => handleChange(e, null, null)}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicEmail"
                                            >
                                                Net Payable Amount
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="totalAmount"
                                                placeholder="Net Payable Amount"
                                                value={netPayableAmount}
                                                onChange={(e) => handleChange(e, null, null)}
                                                disabled
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Due Amount
                                            </Form.Label>
                                            <Form.Control
                                                disabled
                                                type="number"
                                                value={feeDeposite.due_amount}
                                                name="due_amount"
                                                placeholder="Enter Due Amount"
                                                onChange={(e) => handleChange(e, null, null)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Late Fee
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={feeDeposite.late_fee}
                                                name="late_fee"
                                                placeholder="Enter Late Fee"
                                                onChange={(e) => handleChange(e, null, null)}
                                            />
                                        </Form.Group>
                                    </Row>
                                </Col>
                                <Col lg={5}>
                                    <Row>
                                        <Form.Group className=" mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Enter Amount
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                value={feeDeposite?.amount ?? netPayableAmount}
                                                name="amount"
                                                placeholder="Enter Deposite Amount"
                                                onChange={(e) => handleChange(e, null, null)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicLastName"
                                            >
                                                Deposite Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="payment_date"
                                                placeholder="Select Date"
                                                value={feeDeposite.payment_date ?? getCurrentDate()}
                                                onChange={(e) => handleChange(e, null, null)}
                                                required
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group className="mt-3 mx-3">
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicClass"
                                            >
                                                Payment Method
                                            </Form.Label>
                                            <Form.Select
                                                required
                                                name="payment_method"
                                                value={feeDeposite.paymet_method}
                                                onChange={(e) => handleChange(e, null, null)}
                                            // style={{ fontSize: "14px" }}
                                            >
                                                <option value="">-- Select Type --</option>
                                                <option value="Cash">Cash</option>
                                                <option value="NEFT">NEFT</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Paytm">Paytm</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Row>
                                    <Row style={{ height: "49%" }} className="mt-3 ms-2">
                                        <Form.Group>
                                            <Form.Label
                                                className="form-view-label"
                                                htmlFor="formBasicFirstName"
                                            >
                                                Remark
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                value={feeDeposite.remark}
                                                name="remark"
                                                placeholder="Enter Remark"
                                                onChange={(e) => handleChange(e, null, null)}
                                                style={{ height: "100%", width: "103%" }}
                                            />
                                        </Form.Group>
                                    </Row>

                                </Col>
                                <Col lg={1}></Col>
                            </Row>
                            <Row className={"justify-content-center"}>
                                <Col lg={2}>
                                    <Button
                                        className="mx-3 mt-3 mb-3"
                                        variant="secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="mx-3 mt-3 mb-3"
                                        variant="primary"
                                        onClick={handleSaveDeposites}
                                    >
                                        Save
                                    </Button>

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
                                </Col>
                            </Row>
                        </>
                    )} */}
                </Row>
            </Main>
        </>
    )
}

export default Promotion