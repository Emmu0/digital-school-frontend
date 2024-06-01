import React, { useState } from 'react'
import Main from '../layout/Main'
import { Helmet } from 'react-helmet'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable'
import InfoPill from '../InfoPill'
import CompanyModel from './companyModel'

const Index = ({ tabName }) => {
    const [body, setBody] = useState([]);
const [modelData, setModelData] = useState(false)
    const labels = {
        beforeSelect: " "
    }
    const header = [
        // {
        //   title: "Form No",
        //   prop: "formno",
        //   isFilterable: true,
        //   cell: (row) => (
        //     <Link to={"/rte/" + row.id} state={row}>
        //       {row.formno}
        //     </Link>
        //   ),
        // },

        // { title: "Student Name", prop: "studentname", isFilterable: true },
        // { title: "Class Name", prop: "classname", isFilterable: true },
        // {
        //   title: "Date of Addmission",
        //   prop: "dateofaddmission",
        //   isFilterable: true,
        //   cell: (row) => moment(row.dateofaddmission).format("DD-MMM-YYYY"),
        // },
        // { title: "Year", prop: "year", isFilterable: true },
        // { title: "Parent Name", prop: "parentname", isFilterable: true },
    ];

    const createCompany = (vl) => {
        setModelData(!modelData)
    }
    return (

        <>
            <Main>
                <Helmet>
                    <title>{tabName}</title>
                </Helmet>
                <Row className="g-0">
                    <Row>
                        <Col lg={10} className="mx-4">
                            <Link className="nav-link" to="/">
                                Home <i className="fa-solid fa-chevron-right"></i> Time Table
                            </Link>
                        </Col>
                    </Row>
                    <Row className="g-0">
                        <Col lg={12} className="px-lg-4">

                            {/* {body ? */}
                            <DatatableWrapper body={body} headers={header} paginationOptionsProps={{
                                initialState: {
                                    rowsPerPage: 15,
                                    options: [5, 10, 15, 20]
                                }
                            }}>
                                <Row className="mb-4">
                                    <Col
                                        xs={12}
                                        lg={2}
                                        className="d-flex flex-col justify-content-end align-items-end"
                                    >
                                        <Filter />

                                    </Col>
                                    <Col
                                        xs={12}
                                        sm={5}
                                        lg={6}
                                        className="d-flex flex-col justify-content-start align-items-start"
                                    >
                                        <PaginationOptions labels={labels} />
                                        <div style={{ "marginTop": "5px" }}>
                                            <InfoPill left="Total Students" right={body?.length} />
                                        </div>
                                    </Col>
                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={4}
                                        className="mb-2 d-flex flex-col justify-content-end align-items-end"
                                    >
                                        <Button className="btn-sm" variant="outline-primary" onClick={() => createCompany(true)}>New Company</Button>
                                    </Col>
                                </Row>
                                <Table striped className="data-table">
                                    <TableHeader />
                                    <TableBody />
                                </Table>
                                <Pagination />
                            </DatatableWrapper>
                            {/* //  : <ShimmerTable row={10} col={8} />} */}
                        </Col>
                        <Col lg={2}></Col>
                    </Row>
                    <Row>

                    </Row>
                    <Row>
                        <Col className="mx-4">

                        </Col>
                    </Row>
                </Row>

                          {modelData &&
                           <CompanyModel
                           show={modelData}
                           Onhide={()=>setModelData(false)}
                           />}  
            </Main>
        </>

    )
}

export default Index
