import { Table, Button } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import { toast } from "react-toastify";
import ConfirmationDialog from '../modal/confirmation_dialog';
import React, { useState } from "react";
import { convertTo12HourFormat } from "../../utils/helper";
/*
This component is being used in:

1. timetable.jsx
2. print_timetable.jsx
*/
export default function PrintClassTimeTable({
  timeTableSlots,
  changeView,
  showDeleteButton = false,
  tableRef,
}) {
  console.log("View Loaded!!!", showDeleteButton);

  const [openDialog, setOpenDialog] = useState(false);
  const [timeTableId, setTimeTableId] = useState("");

  const handleConfirm = () => {
    // Handle confirmation logic here
    console.log("Confirmed: ", timeTableId);
    if (timeTableId) {
      deleteTimetable(timeTableId);
    }
    setOpenDialog(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const deleteTimetable = async (id) => {
    try {
      const result = await schoolApi.deleteTimeTable(id);

      if (result.success) {
        toast.success("Record deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        changeView("VIEW");
      } else {
        toast.error("Record could not deleted!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        toast.error(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <div>
        <ConfirmationDialog
          open={openDialog}
          onClose={handleClose}
          onConfirm={handleConfirm}
          message="Are you sure you want to perform this action?"
        />
        ;
      </div>
      <Table bordered className="printTimeTable" ref={tableRef}>
        <thead>
          <tr className="timeTableEditRow">
            <th>Time Slot</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>
          {timeTableSlots && Object.keys(timeTableSlots).length > 0
            ? timeTableSlots.map((tsObj, index) => (
                <React.Fragment key={index}>
                  {console.log("tsObj", tsObj.time_slot)}
                  <tr style={{ textAlign: "center" }} key={index}>
                    <td key={index + "td0"} valign="middle">
                      {convertTo12HourFormat(tsObj.time_slot.start_time)} -{" "}
                      {convertTo12HourFormat(tsObj.time_slot.end_time)}
                      <br /> <br />
                      <p style={{ fontWeight: "bold" }}>(Period-{index + 1})</p>
                    </td>
                    {tsObj.data.map((slotData, index) => (
                      <td
                        style={{ textAlign: "center", padding: "5px" }}
                        valign="middle"
                        key={index}
                      >
                        {slotData.timetable ? (
                          <>
                            <div name="teacher">
                              {slotData.timetable.teacher}
                            </div>

                            <div name="subject">
                              {slotData.timetable.subject}
                            </div>
                            {showDeleteButton ? (
                              <div>
                                <Button
                                  className="btn btn-sm btn-danger mx-2"
                                  variant="danger"
                                  onClick={() => {
                                    setTimeTableId(slotData.timetable.id);
                                    setOpenDialog(true);
                                  }}
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            <div style={{ color: "green" }}>Free Lecture</div>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))
            : null}
          {changeView ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "right" }}>
                <Button
                  className="btn-md mx-2"
                  onClick={() => changeView("EDIT")}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
}
