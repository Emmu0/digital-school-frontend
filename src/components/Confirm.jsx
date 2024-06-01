import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Confirm = (props) => {
  const [show, setShow] = useState(true);

  const deleteContact = () => {
    props.deleteContact();
  };

  const activeSection = () => {
    console.log("activeSection");
  };
  // const deleteLead = () => {
  //   props.deleteLead();
  // };
  const deleteStudent = () => {
    props.deleteStudent();
  };
  const deleteTimeSlot = () => {
    props.deleteTimeSlot();
  };
  const deleteTimeTable = () => {
    props.deleteTimeTable();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Alert show={show} variant="danger" className="mb-0">
        <Alert.Heading>{props.title}</Alert.Heading>
        <p>{props.message}</p>
        <hr />
        <div className="d-flex justify-content-end">
          {/* ========================= Permission (Module) Shakib ========================== */}
          {props.table === "deletePermission" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}

        
          {/* {props.table === "fee_master" && (
            <Button
              onClick={props.deleteFeeMaster}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )} */}

          {/* ========================= Permission (Module) Shakib ========================== */}
          {props.table === "deletePermission" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {/* =========== Session Module By Shakib : Start =========== */}
          {props.table === "deleteSession" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {/* =========== Permission Module By shivam : Start =========== */}
          {props.table === "deleteRole" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "deleteRolePermission" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "deleteModule" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDelete();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {/* =========== Permission Module By shivam : End =========== */}
          {props.table === "contact" && (
            <Button
              onClick={props.deleteContact}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "assign_subject" && (
            <Button
              onClick={props.deleteAssignSubjectClass}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "subject_teacher" && (
            <Button
              onClick={props.deleteSubjectTeacher}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* ========================= Syllabus (Module) Shakib ========================== */}
          {props.table === "deleteSyllabus" && (
            <Button
              variant="danger"
              onClick={() => {
                props.handleDeleteButton();
              }}
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* For Transport Module - for locationMaster and fareMaster table : Added by Shivam Shrivastava */}

          {props.table === "locationMaster" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton();
                props.onHide();
                // navigate('/transportation/locationlist');
              }}
            >
              Yes
            </Button>
          )}

          {props.table === "fareMaster" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton(); // Call the delete function passed from VehicleList
                props.onHide(); // Close the modal
              }}
            >
              Yes
            </Button>
          )}

          {props.table === "vehicleDelete" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton();
                props.onHide(); // Close the modal
              }}
            >
              Yes
            </Button>
          )}

          {props.table === "RouteDelete" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton();
                props.onHide(); // Close the modal
              }}
            >
              Yes
            </Button>
          )}


          {/* *** For RTE Module - To deleteRte table : Added by  Shakib Khan *** */}
          {props.table === "deleteRte" && (
            <Button
              variant="danger"
              onClick={() => { props.handleDeleteButton() }}
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* *** For Exam Module : Added by Pawan Singh Sisodiya ***  */}
          {props.table === "exam_title" && (
            <Button
              onClick={props.deleteTitle}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "exam_title_status_update" && (
            <Button
              onClick={props.changeStatus}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "exam_schedule" && (
            <Button
              onClick={props.deleteSchedule}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* *** For Event Module - To delete event : Added by  Shakib Khan *** */}
          {props.table === "deleteEvent" && (
            <Button
              variant="danger"
              onClick={() => { props.handleDeleteButton() }}
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {props.table === "pricebook" && (
            <Button
              onClick={props.deletePricebook}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "stock" && (
            <Button
              onClick={props.deletestock}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "payment" && (
            <Button
              onClick={props.deletePayment}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "file" && (
            <Button
              onClick={props.deleteFile}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {props.table === "staff" && (
            <Button
              onClick={props.handleDeactivate}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {/* Added by Abdul Pathan */}
          {props.table === "subjects" && (
            <Button
              onClick={props.deletesubjectrecord}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {props.table === "leave" && (
            <Button
              onClick={props.deleteStaffLeave}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "Class" && (
            <Button
              onClick={props.deleteClass}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "classList" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.changeClassStatus();
              }}
            >
              Yes
            </Button>
          )}
          {props.table === "studentaddmission" && (
            <Button
              onClick={props.deleteStudentAddmission}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "feeDeposit" && (
            <Button
              onClick={props.deleteFeeDeposit}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "fee" && (
            <Button
              onClick={props.deleteFee}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "vehicle" && (
            <Button
              onClick={props.deleteVehicle}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {props.table === "lead" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.deleteLead();
                props.onHide();
              }}
            >
              Yes
            </Button>
          )}
          {props.table === "student" && (
            <Button
              onClick={props.deleteStudent}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}
          {/* ========================= Assignment Module By Shakib Khan ========================== */}
          {props.table === "deleteAssignment" && (
            <Button
              variant="danger"
              onClick={() => { props.handleDeleteButton() }}
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/** Fee Module */}
          {/* ========================= Fee Module By Pawan Singh Sisodiya and Pooja Vaishnav ========================== */}
          {props.table === "fee_master_line_items" && (
            <Button
              onClick={props.deleteFeeMasterLineItem}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

        {props.table === "fee_master" && (
            <Button
              onClick={props.deleteFeeMaster}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* ========================= Fee head master update By Pawan Singh Sisodiya ========================== */}
          {props.titleupdate === "Confirm update?" && (
            <Button
              onClick={props.changeHeadStatus}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {/* ========================= Fee master delete By Shivam Shrivastva ========================== */}
          {props.table === "feeMasters" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton();
                props.onHide();
              }}
            >
              Yes
            </Button>
          )}

          {props.title === "Confirm remove?" && (
            <Button
              onClick={props.removeSelectedTab}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}


          {props.table === "feeInstallmentLineitemDelete" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.handleDeleteButton();
                props.onHide();
              }}
            >
              Yes
            </Button>
          )}

          {props.table === "fee_deposite" && (
            <Button
              onClick={props.deleteDeposite}
              variant="danger"
              className="mx-2"
            >
              Yes
            </Button>
          )}

          {props.table === "time_slot" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.deleteTimeSlot();
                props.onHide();
              }}
            >
              Yes
            </Button>
          )}
          {props.table === "timetable" && (
            <Button
              variant="danger"
              className="mx-2"
              onClick={() => {
                props.deleteTimeTable();
                props.onHide();
              }}
            >
              Yes
            </Button>
          )}

          <Button onClick={props.onHide} variant="light" className="text-">
            No
          </Button>

        </div>
      </Alert>
    </Modal>
  );
};

export default Confirm;
