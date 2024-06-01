import React from 'react'
import Main from '../layout/Main'
import QL_Model from './QL_Model'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button, Col, Row, Table, ToastContainer } from 'react-bootstrap'
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable'
import InfoPill from '../InfoPill'
import { ShimmerTable } from 'react-shimmer-effects'
import { Link } from 'react-router-dom'
import schoolApi from '../../api/schoolApi'

const QuickLauncher = () => {
    const [QuickModel, setQuickModel] = useState(false);
    const [allLauncherData, setAllLauncherData] = useState();
    const labels = { beforeSelect: " ", };
const deleteHandler = (id)=>{
    schoolApi.deletQuickLaucher(id).then(()=>{
        setAllLauncherData();
    })
}
    const header = [
        {
            title: "Module Name",
            prop: "icon",
            isFilterable: true,
            cell: (row) => (
                <><i className={row.icon}></i>{row.name}</>
            ),
        },
        {
            title: "url",
            prop: "sub_module_url",
            isFilterable: true,
        },
        {
            title: 'Action', prop: '', isFilterable: true,
            cell: (row) => (
                <><i class="fa-solid fa-trash"  onClick={()=>deleteHandler(row.id)}></i></>
            ),
        },
    ];
    console.log(allLauncherData, 'allLauncherData');
    useEffect(() => {
        if (!allLauncherData) {
            schoolApi.getAllQuickLauncher().then((result) => {
                if (result.success) {
                    setAllLauncherData(result.records);
                } else {
                    setAllLauncherData([]);
                }
            })
        }

    }, [allLauncherData]);



    useEffect(() => {
        if (QuickModel) {
            setQuickModel(true)
        }
    }, [])


    return (
        <Main>
            <Row className="g-0">
                <Col lg={2} className="mx-3">
                    <Link className="nav-link mx-2" to="/">Home <i className="fa-solid fa-chevron-right"></i> Quick Launcher</Link>
                </Col>

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

                <Col lg={12} className="p-lg-4">

                    {allLauncherData ?
                        <DatatableWrapper body={allLauncherData} headers={header} paginationOptionsProps={{
                            initialState: {
                                rowsPerPage: 15,
                                options: [5, 10, 15, 20]
                            }
                        }}>
                            <Row className="mb-4">
                                <Col lg={3}>
                                    <Filter />
                                </Col>
                                <Col lg={1} style={{ 'margin-top': '-18px' }}>
                                    <PaginationOptions labels={labels} />
                                </Col>
                                <Col lg={3} style={{ 'margin-top': '-13px' }} >
                                    <div >
                                        <InfoPill left="Total Exams" right={allLauncherData?.length} />
                                    </div>
                                </Col>
                                <Col lg={5} style={{ 'margin-top': '2px' }} className="d-flex flex-col justify-content-end align-items-end">
                                    <Button className="btn-light" variant="outline-primary" onClick={() => setQuickModel(true)}>Manage Launcher</Button>
                                </Col>
                            </Row>
                            <Table striped className="data-table">
                                <TableHeader />
                                <TableBody />
                            </Table>
                            <Pagination />
                        </DatatableWrapper> : <ShimmerTable row={10} col={4} />}
                </Col>
                <Col lg={2}></Col>
            </Row>
            {QuickModel && <QL_Model show={QuickModel} hideModel={() => setQuickModel(false)} />}
        </Main>
    )
}

export default QuickLauncher