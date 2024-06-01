import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import { DatatableWrapper, TableBody, TableHeader, } from "react-bs-datatable";
import schoolApi from "../../api/schoolApi";
import "../../resources/css/Student.css";
const SiblingTab = (props) => {
  const [student, setStudent] = useState('');
  const [showStudentTable, setshowStudentTable] = useState(false);
  useEffect(() => {
    async function init() {
      if (!(props.isParent === '')) {
        let allParentStudent = await schoolApi.fetchStudentByParentId(props.isParent);
        if (allParentStudent.length) {
          setStudent(allParentStudent);
          setshowStudentTable(!showStudentTable);
        } else {
          setshowStudentTable(false)
          setStudent([]);
        }
      }
    }
    init();
  }, []);
  const headerStudent = [
    {
      title: 'S.NO', prop: 'srno', isFilterable: true,
      cell: (row) => (
        <Link
          to={"/student/" + row.id}
          state={row}
        >
          {row.srno}
        </Link>
      )
    },
    { title: 'City', prop: 'city', isFilterable: true },
    { title: 'Date of Birth', prop: 'dateofbirth', isFilterable: true, cell: (row) => (moment(row.dateofbirth).format('DD-MMM-YYYY')) },
    { title: 'Class', prop: 'classname', isFilterable: true },
    { title: 'Section', prop: 'name', isFilterable: true }
  ];
  return (
    <>
      {showStudentTable ? (
        <DatatableWrapper body={student} headers={headerStudent}>
          <Table striped className="data-table">
            <TableHeader />
            <TableBody />
          </Table>
        </DatatableWrapper>
      ) : (
        <div style={{ fontSize: "20px", textAlign: "center" }}>
          No Siblings Found!!
        </div>
      )}
    </>
  );
}
export default SiblingTab;