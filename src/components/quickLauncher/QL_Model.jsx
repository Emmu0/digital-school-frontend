import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { QuickArr } from '../../constants/CONSTANT';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';
import schoolApi from '../../api/schoolApi';
import { toast } from 'react-toastify';
import authApi from '../../api/authApi';

const QL_Model = ({ show, hideModel }) => {
    const [QuickIndex, setQuickIndex] = useState(0)
    const [selectedobj, setSelectedobj] = useState()
    const [selectedArr, setselectedArr] = useState([])
    const [leftBoxData, setleftBoxData] = useState()
    const [quickArr, setquickArr] = useState()
    const checkLaunchArr = selectedArr.filter((el, ky) => el)
    useEffect(() => {
        const arr = [];
        try {
            schoolApi.getAllModules(authApi.companyDetail().companyid).then((data) => {


                data.map((vl, ky) => {
                    if (vl.parent_module !== null) {
                        console.log(vl, 'vl ==>');
                        vl.sub_module_url = vl.url;
                        arr.push(vl)
                    }
                })
            })
        } catch (error) {
            console.error('Error fetching modules:', error);
        }

        setquickArr(arr)
    }, [])

    useEffect(() => {
        schoolApi.getAllQuickLauncher().then((result) => {
            if (result.success) {

                const filteredArray2 = quickArr?.filter(item2 => !result.records.find(item1 => item1.sub_module_url === item2.sub_module_url && item1.name === item2.name));
                setselectedArr(result.records)
                console.log('lello 1', leftBoxData, quickArr);
                setleftBoxData(filteredArray2?.length > 0 ? filteredArray2 : quickArr)
            } else {
                setleftBoxData(quickArr)
            }
        })
    }, [show, quickArr])

    console.log('lello 2', leftBoxData, quickArr);

    const ApiHandler = () => {
        if (checkLaunchArr?.length == 0) {
            return toast.error('Selected Item Require')
        }
        console.log(checkLaunchArr, 'checkLaunchArr');
        // const launhcerArr = selectedArr.filter((el, ky) => el)
        // return false
        schoolApi.CreateQuickLauncher(checkLaunchArr).then((res) => {
            if (res.success) {
                console.log(res, 'res =====');
                PubSub.publish('RECORD_SAVED_TOAST', { title: 'Record Create', message: res.message });
                hideModel()
            }
        })
    }


    const HandleNext = (val) => {
        if (val) {
            setQuickIndex(QuickIndex + 1)
        } else {
            setQuickIndex(QuickIndex - 1)
        }
    }


    const handleCloseModal = () => {
        hideModel()
    }


    const leftBoxHandler = (vl, index) => {
        vl.index = index
        setSelectedobj(vl)
    }

    const addRowHandler = () => {
        setSelectedobj()
        let abc = leftBoxData[selectedobj.index];
        selectedArr.splice(selectedobj.index, 0, abc);
        delete leftBoxData[selectedobj.index];
    }

    const removeRowHandler = () => {
        setSelectedobj()
        let abc = selectedArr[selectedobj.index];
        leftBoxData.splice(selectedobj.index, 0, abc);
        delete selectedArr[selectedobj.index];
    }
    console.log(QuickArr[QuickIndex]?.Data.length, selectedArr, 'bhala ho');


    return (
        <>
            <Modal
                show={show}
                backdrop="static"
                centered
                aria-labelledby="contained-modal-title-vcenter"
                onHide={handleCloseModal}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">
                        Quick Launcher
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className='row d-flex justify-content-around'>
                        <div className=" col-lg-5">
                            <span className='mb-3 fw-bolder'>Module</span>
                            <div className="card modulbox p-0 mt-2">
                                <div className="card-body">
                                    <ul className="list-group">
                                        {leftBoxData?.map((vl, key) => vl?.id && (
                                            <>
                                                {console.log(leftBoxData, 'leftBoxData ==>')}
                                                <li key={vl.id} onClick={() => leftBoxHandler(vl, key)} className={`list-group-item ${selectedobj?.name == vl?.name && "active"}`}> <i className={vl.icon}></i>{vl.name}</li>
                                            </>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-1 d-flex flex-column justify-content-center align-items-center">
                            <button type="button" className="btn btn-light" onClick={() => selectedobj?.id ? addRowHandler() : ''}><i className="fa-solid fa-caret-right"></i></button>
                            <button type="button" className="btn btn-light mt-2" onClick={() => selectedobj?.id ? removeRowHandler() : ''}><i className="fa-solid fa-caret-left"></i></button>
                        </div>
                        <div className="col-lg-5">
                            <span className='fw-bolder'>Selected Module</span>
                            <div className="card modulbox p-0 mt-2">
                                <div className="card-body">
                                    <ul className="list-group">
                                        {selectedArr.map((vl, ky) => (
                                            <li className={`list-group-item ${selectedobj?.name == vl?.name && "active"}`} key={vl?.id} onClick={() => leftBoxHandler(vl, ky)}> <i className={vl?.icon}></i>{vl?.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => QuickIndex < QuickArr.length - 1 ? HandleNext(true) : ApiHandler()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default QL_Model