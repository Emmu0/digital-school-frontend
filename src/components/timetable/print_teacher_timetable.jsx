import { Table, Button } from "react-bootstrap";
import schoolApi from "../../api/schoolApi";
import React, { useEffect, useRef, useState } from "react";
import { convertTo12HourFormat } from "../../utils/helper";

export default function PrintTeacherTimetable({ teacher, tableRef }) {
  let [timeSlots, setTimeSlots] = useState([]);
  {console.log("Teacher View Loaded")}
  useEffect(() => {
    async function getTimeSlots() {
      const timeSlots = await schoolApi.fetchTimeSlot();
      console.log("timeSlots: ", timeSlots);
      if (timeSlots) {
        setTimeSlots(timeSlots);
      }
    }

    if (teacher && teacher.schedule) {
      getTimeSlots();
    }
  }, [teacher]);

  function PrintTimetable() {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (timeSlots && timeSlots.length > 0) {
      const timeTableData = timeSlots.map((ts, index) => {
        return (
          <tr style={{ textAlign: "center" }} key={index}>
            <td valign="middle" key={index + "td0"}>
              <div name="class" key={index + "div0"}>
                {convertTo12HourFormat(ts.start_time)} -{" "}
                {convertTo12HourFormat(ts.end_time)}
                <br /> <br />
                <p style={{ fontWeight: "bold" }}>(Period-{index + 1})</p>
              </div>
            </td>
            {days.map((day, index) => {
              const schedule = teacher.schedule.find(
                (record) => record.timeslot_id === ts.id && record.day === day
              );
              return getCloumn(schedule, index);
            })}
          </tr>
        );
      });
      return timeTableData;
    }
    return <></>;
  }

  function getCloumn(schedule, index) {
    return (
      <td
        style={{ textAlign: "center", padding: "5px" }}
        valign="middle"
        key={index}
      >
        {schedule ? (
          <>
            <div>{schedule.class + " (" + schedule.section + ")"}</div>
            <div>({schedule.subject})</div>
          </>
        ) : (
          <div style={{ color: "green" }}>Free Lecture</div>
        )}
      </td>
    );
  }

  return (
    <>
      <Table bordered className="printTimeTable" ref={tableRef}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>
          <PrintTimetable />
        </tbody>
      </Table>
    </>
  );
}
