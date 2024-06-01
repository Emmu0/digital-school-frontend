/* eslint-disable no-use-before-define */
/**
 * @author: Abdul Pathan
 */
import React from 'react'
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Alert } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import PubSub from "pubsub-js";

const ActiveandIncative = (props) => {
    console.log('enter in active class walaa====>', props);
    const classActiveAndInactive = async (event) => {

        if (event.id) {
            var myBoolean = (event.isactive === true) ? false : true;
            const classRecord = {
                id: event.id,
                isactive: myBoolean
            }
            const responce = await schoolApi.updateClassActiveAndInactiveRecord(classRecord);
            if (responce.success) {
                toast.success("Record updated successfully!", { position: toast.POSITION.TOP_RIGHT });
                updateActiveInactiveRecord();
            }
        }

    }

    const updateActiveInactiveRecord = () => {
        props.updateactiveinactiverecord();
    }
    return (
        <Modal show={props.show} size="ms" aria-labelledby="contained-modal-title-vcenter" centered  >
            <Alert variant="light" className="mb-0">
                <Alert.Heading>
                    {props?.parent?.isactive === true ? 'Confirm Inactive?' : props.title}
                </Alert.Heading>
                <hr />
                <p>{props?.parent?.isactive === true ? 'You are going to inactive the record. Are you sure?' : props.message}</p>
                <div className="d-flex justify-content-end">
                    {props.table === "classes" && (<Button onClick={() => classActiveAndInactive(props?.parent)} variant="danger" className="mx-2" > Yes </Button>)}
                    <Button onClick={props.onHide} variant="light" className="text-"> No  </Button>
                </div>
            </Alert>
            <ToastContainer />
        </Modal>
    )
}

export default ActiveandIncative
