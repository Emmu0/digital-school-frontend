import { Table, Button, Form } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditTimeTable({
  timeTableSlots,
  sessionId,
  sectionId,
  classId,
  changeView,
}) {
  console.log("Edit Loaded Data: ", timeTableSlots);
  let [teacherList, setTeacherList] = useState([]);

  let [subjectList, setSubjectList] = useState([]);
  let [timeTable, setTimeTable] = useState([]);
  async function initTeacherList() {
    teacherList = await schoolApi.getTeacherRecords();
    console.log("teacherList", teacherList);
    setTeacherList(teacherList);
  }

  async function initSubjectList() {
    subjectList = await schoolApi.fetchSubject();
    setSubjectList(subjectList);
  }

  useEffect(() => {
    async function init() {
      setTimeTable(timeTableSlots);
      initTeacherList();
      initSubjectList();
    }
    init();
  }, []);

  //handleChange
  const onChangeTeacher = async (e, ttIndex, sIndex) => {
    //console.log('handleChange@@@!=>',e.target.value,sIndex,day);
    setTimeTable((prevTimetable) => {
      const updatedTimetable = [...prevTimetable];
      const timeTable = updatedTimetable[ttIndex];
      //console.log("timeTable: ", timeTable);

      const data = updatedTimetable[ttIndex].data[sIndex];
      //console.log("data: ", data);
      if (data.timetable) {
        console.log("data.timetable --> ", data.timetable);
        data.timetable.contact_id = e.target.value;
        //updatedTimetable[ttIndex].data[sIndex] = data;
      } else {
        data.timetable = {
          id: null,
          contact_id: e.target.value,
          subject_id: data.timetable ? data.timetable.subject_id : "",
          time_slot_id: timeTable.time_slot.id,
          section_id: sectionId,
          class_id: classId,
          session_id: sessionId,
          day: data.day,
        };
      }

      return updatedTimetable;
    });
  };

  //handleChange
  const onChangeSubject = async (e, ttIndex, sIndex) => {
    //console.log('handleChange@@@!=>',e.target.value,sIndex,day);
    setTimeTable((prevTimetable) => {
      const updatedTimetable = [...prevTimetable];
      const timeTable = updatedTimetable[ttIndex];
      console.log("timeTable: ", timeTable);

      const data = updatedTimetable[ttIndex].data[sIndex];
      console.log("data: ", data);
      if (data.timetable) {
        console.log("data.timetable --> ", data.timetable);
        data.timetable.subject_id = e.target.value;
        //updatedTimetable[ttIndex].data[sIndex] = data;
      } else {
        data.timetable = {
          id: null,
          contact_id: data.timetable ? data.timetable.contact_id : "",
          subject_id: e.target.value,
          time_slot_id: timeTable.time_slot.id,
          section_id: sectionId,
          class_id: classId,
          session_id: sessionId,
          day: data.day,
        };
      }

      //console.log("updatedTimetable: ", updatedTimetable);
      return updatedTimetable;
    });
  };

  const onSave = async () => {
    let timeTableRecords = [];
    let isError = false;
    for (const tt of timeTable) {
      for (const data of tt.data) {
        if (data.timetable) {
          if (!data.timetable.subject_id || !data.timetable.contact_id) {
            isError = true;
            break;
          }
          timeTableRecords.push(data.timetable);
        }
      }
      if (isError) {
        break;
      }
    }

    if (isError) {
      toast.error("Required fields are missing, please select!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    let result = await schoolApi.upsertTimetable(timeTableRecords);
    console.log(result);
    if (result.success) {
      toast.success("Record udpated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      changeView("VIEW");
    } else {
      let error = "Something went wrong!";
      if (result.error) {
        error = result.error;
      }
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  };

  function TeacherOption({ teachRec, index, timeTableData, timeSlot }) {
    let displayTeacher = !(teachRec.schedule && teachRec.schedule.length > 0);
    /* console.log("teachRec.schedule: ", teachRec.schedule, teachRec.teachername);
    console.log("timeTableData: ", timeTableData);
    console.log("timeSlot: ", timeSlot);
    console.log("displayTeacher 1: ", displayTeacher); */
    if (!displayTeacher) {
      //check if teacher is occoupied for the same slot and skip
      let bookedSlots = teachRec.schedule.filter(
        (record) =>
          record.timeslot_id === timeSlot.time_slot.id &&
          record.day === timeTableData.day
      );
      //console.log("bookedSlots 1: ", bookedSlots);
      displayTeacher = bookedSlots.length === 0;
      //console.log("displayTeacher 2: ", displayTeacher);

      //For Editing Same Slot
      if (
        !displayTeacher &&
        timeTableData.timetable &&
        timeTableData.timetable.id
      ) {
        //For Editing Same Slot
        bookedSlots = teachRec.schedule.filter(
          (record) => record.id === timeTableData.timetable.id
        );
        displayTeacher = bookedSlots.length > 0;
        //console.log("bookedSlots 2: ", bookedSlots);
        //console.log("displayTeacher 3: ", displayTeacher);
      }
    }

    return displayTeacher ? (
      <option key={index} value={teachRec.id}>
        {teachRec.teachername}
      </option>
    ) : (
      <></>
    );
  }
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
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
        {timeTable && Object.keys(timeTable).length > 0
          ? timeTable.map((timeSlot, ttIndex) => (
              <React.Fragment key={ttIndex}>
                {console.log("tsObj", timeSlot.time_slot)}
                <tr style={{ textAlign: "center" }}>
                  <td style={{ paddingTop: "30px" }}>
                    {timeSlot.time_slot.start_time}
                  </td>
                  {timeSlot.data.map((slotData, sIndex) => (
                    <td>
                      {console.log(
                        "slotData.timetable.contact_id@=>",
                        slotData.timetable ? slotData.timetable.contact_id : ""
                      )}
                      <Form.Group className="mx-2">
                        <Form.Select
                          name="teacher"
                          value={
                            slotData.timetable
                              ? slotData.timetable.contact_id
                              : ""
                          }
                          onChange={(e) => onChangeTeacher(e, ttIndex, sIndex)}
                        >
                          <option value="">-Select Teacher-</option>
                          {teacherList.map((teachRec, index) => (
                            <TeacherOption
                              teachRec={teachRec}
                              index={index}
                              timeTableData={slotData}
                              timeSlot={timeSlot}
                            />
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mx-2 mt-3">
                        <Form.Select
                          name="subject"
                          value={
                            slotData.timetable
                              ? slotData.timetable.subject_id
                              : ""
                          }
                          onChange={(e) => onChangeSubject(e, ttIndex, sIndex)}
                        >
                          <option value="">-Select Subject-</option>
                          {subjectList.map((subjectObj, index) => (
                            <option key={index} value={subjectObj.id}>
                              {subjectObj.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      {slotData.timetable ? (
                        slotData.timetable.contact_id &&
                        !slotData.timetable.subject_id ? (
                          <p className="error-timetable">Select Subject!</p>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}

                      {slotData.timetable ? (
                        slotData.timetable.subject_id &&
                        !slotData.timetable.contact_id ? (
                          <p className="error-timetable">Select Teacher!</p>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))
          : null}
        <tr>
          <td colSpan={7} style={{ textAlign: "right" }}>
            <Button className="btn-md mx-2" onClick={onSave}>
              Save
            </Button>
            <Button className="btn-md mx-2" onClick={() => changeView("VIEW")}>
              Cancel
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
