/* eslint-disable array-callback-return */
// @author: Abdul Pathan
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Alert } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import PubSub from "pubsub-js";

const ActiveandIncative = (props) => {
 console.log('enter in active====>', props);
    const sectionActive = async (event) => {
        if (event.section_id) {
            var myBoolean = (event.isactive === true) ? false : true;
            const sectionRecord = {
                section_id: event.section_id,
                isactive: myBoolean
            }
            console.log('Colling this');
            const responce = await schoolApi.updateSectionActiveRecord(sectionRecord);
            console.log('DataResPoncive==>',responce);
            if (responce.success) {
                PubSub.publish("RECORD_SAVED_TOAST", {
                    title: "Record Saved",
                    message: "Record Updated successfully",
                });
            }
        }
    }
    return (
        <Modal  {...props} size="ms" aria-labelledby="contained-modal-title-vcenter" centered  >
            <Alert variant="light" className="mb-0">
                <Alert.Heading>
                    {props?.parent?.isactive === true ? 'Confirm Inactive?' : props.title}
                </Alert.Heading>
                <hr />
                <p>{props?.parent?.isactive === true ? 'You are going to inactive the record. Are you sure?' : props.message}</p>
                <div className="d-flex justify-content-end">
                    {props.table === "section" && (<Button onClick={() => sectionActive(props?.parent)} variant="danger" className="mx-2" > Yes </Button>)}
                    <Button onClick={props.onHide} variant="light" className="text-"> No  </Button>
                </div>
            </Alert>
        </Modal>
    );
}

export default ActiveandIncative
