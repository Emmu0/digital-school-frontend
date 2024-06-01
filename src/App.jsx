import React, { useEffect, useState } from "react";
import "./App.css";
import "./resources/css/Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Error from "./components/error/Error";
import Home from "./components/home/Home";
import AssignmentList from "./components/homework/AssignmentList";
import * as constants from "./constants/CONSTANT";
import {
  StudentList,
  StudentView,
  StudentEdit,
  StudentEnquiry,
  StudentSibling,
} from "./components/student";
import {
  StudentAddmissionEdit,
  StudentAddmissionList,
  StudentAddmissionView,
} from "./components/studentAdmission";
import PubSub from "pubsub-js";
import { Toast, ToastContainer } from "react-bootstrap";
import { PATHS } from "./constants/WebRouting";
import Auth from "./components/Auth/Auth";
import NoAccess from "./components/common/NoAccess";
import jwt_decode from "jwt-decode";
import {
  AddAssignSubjectClass,
  AssignSubjectClassList,
  EditAssignSubjectClass,
} from "./components/assignSubjectClass"; // Added By Abdul Pathan
import { SubjectList } from "./components/subject"; // Added By Abdul Pathan || 11 August 2023
import { SectionList } from "./components/section"; // Added By Abdul Pathan
import ClassList from "./components/classes/ClassList"; // Added By Abdul Pathan
import {
  StaffList,
  StaffView,
  StaffEdit,
  StaffAttendanceView,
} from "./components/employee"; // Added by Pawan Singh Sisodiya
import {
  LocationMaster,
  LocationMasterList,
  FareMasterList,
  FareMaster,
  VehicleAdd,
  VehicleList,
  VehicleUpdate,
  RouteList,
  RouteAdd,
} from "./components/transport"; // Added by Shivam Shrivastava
import {
  StudentRteList,
  StudentRteView,
  StudentRteEdit,
} from "./components/rte";
import {
  ExamSchedule,
  ExamScheduleEdit,
  ExamScheduleView,
} from "./components/exam"; //Added by Pawan Singh Sisodiya
import ExamList from "./components/exam/ExamList"; //Added by Pawan Singh Sisodiya
import AddEvent from "./components/event/AddEvent"; //Added by Shakib Khan
import Event from "./components/event/Event"; //Added by Shakib Khan
import { AttendanceMaster } from "./components/attendance_master";
import Attendance from "./components/attendance/Attendance";
import {
  AttendanceLineItem,
  AddAttendanceLineItem,
  ViewAttendanceLineItem,
} from "./components/attendance_line_item";
import FeesHeadMasterList from "./components/fee/FeesHeadMasterList ";
import FeeMasterList from "./components/fee/FeeMasterList";
import FeeMasterEdit from "./components/fee/FeeMasterEdit";
import FeeMasterLineItems from "./components/fee/FeeMasterLineItems";
import FeeMasterView from "./components/fee/FeeMasterView";
import FeeInstallmentLineItemsView from "./components/fee/FeeInstallmentLineItemsView";
import FeeDeposite from "./components/fee/FeeDeposite";
import FeeDepositeEdit from "./components/fee/FeeDepositeEdit";
import FeeDepositeHistory from "./components/fee/FeeDepositeHistory";
import FeeDiscount from "./components/fee/FeeDiscount";
import SessionList from "./components/session/SessionList";
import AssignTransport from "./components/transport/AssignTransport";
import {
  createRolePermissionModal,
  ModuleList,
  RoleList,
} from "./components/permisssion";
import PermissionList from "./components/permisssion/PermissionList";
import RolePermissionList from "./components/permisssion/RolePermissionList";
import { SyllabusList } from "./components/syllabus";
import SyllabusViewPage from "./components/syllabus/SyllabusViewPage";
import { TimeTable, PrintTimeTable } from "./components/timetable";
import { TimeSlotList } from "./components/timetableSlot";
import { QuickLauncher } from "./components/quickLauncher";
import { ListOfBook, PublisherList, SupplierList, AuthorLIst, CategoryList, LanguageList, PurchaseList, IssueBookList, AddIssueBook } from "./components/library";
import BookView from "./components/library/BookView";
import IssueView from "./components/library/IssueView";
import ViewLanguage from "./components/library/ViewLanguage";
import SupplierView from "./components/library/SupplierView";
import CategoryView from "./components/library/CategoryView";
import AuthorView from "./components/library/AuthorView";
import PublisherView from "./components/library/PublisherView";
import SectionView from "./components/section/SectionView";
import Company from "./components/company/index";
import { Promotion } from "./components/promotion";



function App() {
  const rteUrl = "rte";
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState("Confirmation");
  const [message, setMessage] = useState("");

  const [variant, setVariant] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [permissions, setPermissions] = useState();
  const mySubscriber = (msg, data) => {
    switch (msg) {
      case "RECORD_SAVED_TOAST":
        setTitle(data.title);
        setMessage(data.message);
        setModalShow(true);
        setVariant("success");
        break;
      case "RECORD_ERROR_TOAST":
        setTitle(data.title);
        setMessage(data.message);
        setModalShow(true);
        setVariant("danger");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    PubSub.subscribe("RECORD_SAVED_TOAST", mySubscriber);
    PubSub.subscribe("RECORD_ERROR_TOAST", mySubscriber);

    try {
      if (sessionStorage.getItem("token")) {
        let user = jwt_decode(sessionStorage.getItem("token"));
        setUserInfo(user);

        var perm = user.permissions
          .map(function (obj) {
            return obj.name;
          })
          .join(";");
        setPermissions(perm);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <React.Fragment key={Math.random()}>
      <ToastContainer className="p-3" position="top-center">
        <Toast
          show={modalShow}
          onClose={() => setModalShow(false)}
          delay={3000}
          bg={variant}
          className="text-white"
          autohide
        >
          {variant === "success" ? (
            <div
              className="p-1 m-1"
              style={{ backgroundColor: "#198754", color: "white" }}
            >
              <i className="fa-regular fa-circle-check text-white mx-2"></i>
              <strong className="me-auto">{title}</strong>
              <i
                className="fa-solid fa-xmark text-white float-right"
                style={{ float: "right" }}
                role="button"
                onClick={() => setModalShow(false)}
              ></i>
            </div>
          ) : (
            <div
              className="p-1 m-1"
              style={{ backgroundColor: "#DC3545", color: "white" }}
            >
              <i className="fa-regular fa-circle-check text-white mx-2"></i>
              <strong className="me-auto">{title}</strong>
              <i
                className="fa-solid fa-xmark text-white float-right"
                style={{ float: "right" }}
                role="button"
                onClick={() => setModalShow(false)}
              ></i>
            </div>
          )}

          <Toast.Body>
            {message instanceof Array ? (
              message.map((item) => {
                return <span>{item.msg}</span>;
              })
            ) : (
              <span>{message}</span>
            )}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path={PATHS.HOME} element={<Home tabName="Home" />} />
          <Route
            element={
              <Auth
                allowedRoles={[constants.VIEW_CONTACT, constants.MODIFY_ALL]}
              />
            }
          ></Route>
          <Route path="/no-access" element={<NoAccess />} />

          {/* *********** Permission Module By Shakib Khan and shivam start********** */}
          <Route
            path="/permissionlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <PermissionList tabName={constants.TAB_NAME.permissionList} />
            }
          />
          {/* *********** Session Module By Shakib Khan start********** */}
          <Route
            path="/sessionlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SessionList tabName={constants.TAB_NAME.session} />}
          />
          <Route
            path="/rolelist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<RoleList tabName={constants.TAB_NAME.roleList} />}
          />
          <Route
            path="/rolepermissionlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <RolePermissionList
                tabName={constants.TAB_NAME.rolepermissionList}
              />
            }
          />
          <Route
            path="/section/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SectionView />}
          />
          <Route
            path="/modulelist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ModuleList tabName={constants.TAB_NAME.moduleList} />}
          />
          <Route
            path="/addrolepermission"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <createRolePermissionModal
                tabName={constants.TAB_NAME.addRolePermission}
              />
            }
          />

          {/* ******* Syllabus Module added by Shakib ******* */}
          <Route
            path="/syllabuslist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SyllabusList tabName={constants.TAB_NAME.syllabus} />}
          />

          <Route
            path="/syllabusview/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <SyllabusViewPage tabName={constants.TAB_NAME.syllabusView} />
            }
          />

          {/************ Student Module By : Pooja Vaishnav ************/}
          <Route
            path="/studentenquiry"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentEnquiry />} //"Create Student"
          />
          <Route
            path="/student/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentSibling tabName={constants.TAB_NAME.viewStudentSibling} />
            } //"Student Attendence List"
          />
          <Route
            path="studentaddmissions/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentAddmissionEdit
                tabName={constants.TAB_NAME.editStudentAddmission}
              /> //"Edit Student Addmission"
            }
          />
          {/** Show All Students Addmission **/}
          <Route
            path="/studentaddmissions/"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentAddmissionList
                tabName={constants.TAB_NAME.studentAddmissionList}
              /> //"Student Addmission List"
            }
          />
          {/** Show a Student Addmission By Id **/}
          <Route
            path="studentaddmissions/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentAddmissionView
                tabName={constants.TAB_NAME.viewStudentAddmission}
              /> //"View Student Addmission"
            }
          />
          {/* Contact Student */}
          {/******** Crate a Contact Student *******/}
          <Route
            path="/student/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentEdit tabName={constants.TAB_NAME.createStudent} />} //"Create Student"
          />

          {/******** Show All Students Contacts *******/}
          <Route
            path="/students"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentList tabName={constants.TAB_NAME.studentsList} />} //"Students List"
          />
          <Route
            path="/assigntransport"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <AssignTransport tabName={constants.TAB_NAME.assigntransport} />
            }
          />

          {/******** Show a Student Contact By Id *******/}
          <Route
            path="/students/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentView tabName={constants.TAB_NAME.viewStudent} />} //"View Student"
          />
          {/******** Edit Student Contact By Id *******/}
          <Route
            path="/student/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentEdit tabName={constants.TAB_NAME.editStudent} />} //"Edit Student"
          />

          {/********Abdul Pathan***********************/}
          {/* ******* Subjects Module Added by Abdul Pathan ****** */}
          <Route
            path="/subjects"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SubjectList />}
          />
          <Route
            path="/assignsubjectclass" //assignsubjectclass
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AssignSubjectClassList />}
          />
          <Route
            path="/assignsubjectclass/add" //add assignsubjectclass
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AddAssignSubjectClass />}
          />
          <Route
            path="/assignsubjectclass/edit" //edit assignsubjectclass
            allowedRoles={[constants.MODIFY_ALL]}
            element={<EditAssignSubjectClass />}
          />

          {/* ******* Section Module Added by Abdul Pathan ****** */}
          <Route
            path="/section"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SectionList />}
          />

          {/* ******* Classes Module Added by Abdul Pathan ****** */}
          <Route
            path="/classes"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ClassList />}
          />

          {/* ********** Employee Module Added by Pawan Singh Sisodiya ********** */}
          <Route
            path={"/staff/e"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StaffEdit
                selectedRecordType="staff"
                tabName={constants.TAB_NAME.createStaff}
              />
            } //Create a Staff Contact
          />
          <Route
            path="/staffs"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StaffList tabName={constants.TAB_NAME.staffList} />} //Show All Staff Contacts
          />
          <Route
            path="/staff/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StaffView tabName={constants.TAB_NAME.viewStaff} />} //Show a Staff Contact By Id
          />
          <Route
            path="/staff/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StaffEdit tabName={constants.TAB_NAME.editStaff} />} //Edit Staff Contact By Id
          />
          <Route
            path="/attendances"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StaffAttendanceView
                tabName={constants.TAB_NAME.staffAttendence}
              />
            } //Staff Attendance
          />

          {/************ Transport Module Added By Shivam Shrivastava ***********/}
          <Route
            path="/transportation/locationmaster"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <LocationMaster tabName={constants.TAB_NAME.locationMaster} />
            }
          />
          <Route
            path="/transportation/locationlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <LocationMasterList tabName={constants.TAB_NAME.locationList} />
            }
          />
          <Route
            path="/transportation/faremaster"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<FareMaster tabName={constants.TAB_NAME.fareMaster} />}
          />
          <Route
            path="/transportation/farelist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<FareMasterList tabName={constants.TAB_NAME.fareList} />}
          />
          {/* vehicle */}
          <Route
            path="/transportation/vehicles"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<VehicleList tabName={constants.TAB_NAME.vehicles} />}
          />
          <Route
            path="/transportation/vehicle/add"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<VehicleAdd tabName={constants.TAB_NAME.vehiclesadd} />}
          />
          <Route
            path="/transportation/vehicle/update/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <VehicleUpdate tabName={constants.TAB_NAME.vehiclesupdate} />
            }
          />
          {/* driver */}
          <Route
            path={"/driver/e"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StaffEdit
                selectedRecordType="driver"
                tabName={constants.TAB_NAME.registerDriver}
              />
            }
          />
          <Route
            path={"/driver/:id"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StaffView />}
          />
          <Route
            path={"/driver/:id/e"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StaffEdit selectedRecordType="driver" />}
          />

          {/* *********** RTE Students Module By Shakib Khan ********** */}
          <Route
            path="/rte"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentRteList tabName={constants.TAB_NAME.rte} />}
          />
          <Route
            path="/rte/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentRteView tabName={constants.TAB_NAME.viewStudent} /> //"Student Addmission List"
            }
          />
          <Route
            path="studentRtes/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentRteEdit tabName={constants.TAB_NAME.StudentRteEdit} /> //"Edit Student Addmission"
            }
          />
          <Route
            path="/rte/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentEdit
                tabName={constants.TAB_NAME.createStudent}
                rteUrlName={rteUrl}
              />
            } //"Create RTE Student"
          />
          {/* <Route
            path="/rte/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentView tabName={constants.TAB_NAME.viewStudent} />}//"View rte Student"
          /> */}
          {/* <Route
            path="/rte/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentEdit tabName={constants.TAB_NAME.editStudent} />}//"Edit Student"
          /> */}

          {/* *********** Event Module By Shakib Khan ********** */}
          <Route
            path="/addevent"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AddEvent tabName={constants.TAB_NAME.event} />} // add event
          />
          <Route
            path="/eventscalender"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<Event tabName={constants.TAB_NAME.eventCalendar} />} // show event
          />

          {/* *********** Exam Module By Pawan Singh Sisodiya ********** */}
          <Route
            path="/examlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ExamList tabName={constants.TAB_NAME.examTerm} />} //Exam List
          />
          <Route
            path="/examschedule"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ExamSchedule tabName={constants.TAB_NAME.examSchedule} />} //Exam Schedule
          />
          <Route
            path="/examschedule/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <ExamScheduleEdit tabName={constants.TAB_NAME.examSchedule} />
            } //Create Exam Schedule
          />
          <Route
            path="/examschedule/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <ExamScheduleEdit tabName={constants.TAB_NAME.examSchedule} />
            } //Create Exam Schedule
          />
          <Route
            path="/examscheduleview/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <ExamScheduleView tabName={constants.TAB_NAME.examSchedule} />
            } //View Exam Schedule
          />
          {/* ATTENDANCE  START*/}
          <Route
            path="/attendance_master" //attendance_master
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AttendanceMaster />} //AttendanceMaster
          />

          <Route
            path="/update_attendance_line_item" //line_item_attendance
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AttendanceLineItem />}
          />

          <Route
            path="/add_attendance_line_item"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AddAttendanceLineItem />}
          />

          <Route
            path="/list_attendance"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<Attendance />} //attendance
          />

          <Route
            path="/view_attendance_line_item"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ViewAttendanceLineItem />} //attendance
          />
          {/******** Edit Student Contact By Id *******/}
          <Route
            path="/studentenquiry/:id/e"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <StudentEnquiry tabName={constants.TAB_NAME.editStudent} />
            } //"Edit Student"
          />
          {/* ATTENDANCE  END*/}
          <Route
            path="/transportation/routelist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<RouteList tabName={constants.TAB_NAME.routeList} />}
          />
          <Route
            path="/transportation/route/add"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<RouteAdd tabName={constants.TAB_NAME.routeadd} />}
          />
          {/********  Route Assignment Module(Shakib) *******/}
          <Route
            path="/assignmentlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AssignmentList tabName={constants.TAB_NAME.assignment} />}
          />
          {/********  Fee Module By Pooja Vaishnav & Pawan Singh Sisodiya *******/}
          <Route
            path="/feesheadmasterlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeesHeadMasterList
                tabName={constants.TAB_NAME.feeHeadMasterList}
              />
            }
          />
          <Route
            path="/feesmasterlist"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterList tabName={constants.TAB_NAME.feeMasterList} />
            }
          />
          <Route
            path="/feesmasterAdd"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterEdit tabName={constants.TAB_NAME.feeMasterAdd} />
            }
          />
          <Route
            path="/fmasterlineitem"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterLineItems
                tabName={constants.TAB_NAME.feeMasterLineItem}
              />
            }
          />
          {/* ---------------------- ** Added by Pawan Singh Sisodiya 08 Dec 2023 ------------------------ */}
          <Route
            path="/feemasterview/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterView tabName={constants.TAB_NAME.feeMasterList} />
            }
          />
          {/* ---------------------- ** Added by Pawan Singh Sisodiya 12 Dec 2023 ------------------------ */}
          <Route
            path="/feeinstallmentlineitems/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeInstallmentLineItemsView
                tabName={constants.TAB_NAME.feeMasterList}
              />
            }
          />
          {/* ---------------------- ** Added by Pawan Singh Sisodiya 23 Jan 2023 ------------------------ */}
          <Route
            path="/feedeposite"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<FeeDeposite tabName={constants.TAB_NAME.feeDeposite} />}
          />
          {/* ---------------------- ** Added by Pawan Singh Sisodiya 24 Jan 2023 ------------------------ */}
          <Route
            path="/feedepositeedit/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeDepositeEdit tabName={constants.TAB_NAME.feeDepositeEdit} />
            }
          />
          {/* ---------------------- ** Added by Pawan Singh Sisodiya 24 Jan 2023 ------------------------ */}
          <Route
            path="/feedepositehistory/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeDepositeHistory
                tabName={constants.TAB_NAME.feeDepositeHistory}
              />
            }
          />
          <Route
            path="/feesmastercreate"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterEdit tabName={constants.TAB_NAME.feeMasterAdd} />
            } // --- while add ---
          />
          <Route
            path="/feesmasteredit/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <FeeMasterEdit tabName={constants.TAB_NAME.feeMasterAdd} />
            } // --- while edit ---
          />
          <Route
            path="/feesdiscount"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<FeeDiscount tabName={constants.TAB_NAME.feeDiscount} />}
          />
          <Route
            path="/studentsiblings"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<StudentEdit tabName={constants.TAB_NAME.viewStudent} />}
          />

          {/*Timetable slot Added By Pooja Vaishnav */}
          <Route
            path="/timeslot"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <TimeSlotList tabName={constants.TAB_NAME.viewTimetable} />
            }
          />
          {/*Timetable Added By Pooja Vaishnav */}
          <Route
            path="/classtimetable"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<TimeTable tabName={constants.TAB_NAME.viewTimetable} />}
          />
          {/*Printtimetable Added By Pooja Vaishnav */}
          <Route
            path="/printtimetable"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <PrintTimeTable tabName={constants.TAB_NAME.viewTimetable} />
            }
          />
          {/* Start Added by Yamini Mishra */}
          <Route
            path="/books"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ListOfBook tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/books/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<BookView tabName={constants.TAB_NAME.viewBook} />}
          />

          <Route
            path="/publisher"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<PublisherList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/publisher/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<PublisherView tabName={constants.TAB_NAME.viewAuthor} />}
          />

          <Route
            path="/supplier"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SupplierList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/supplier/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SupplierView tabName={constants.TAB_NAME.viewSupplier} />}
          />

          <Route
            path="/author"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AuthorLIst tabName={constants.TAB_NAME.booklist} />}
          />

          {/* Add by Abhishek 07-05-2024 */}
          <Route
            path="/author/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AuthorView tabName={constants.TAB_NAME.viewAuthor} />}
          />

          <Route
            path="/category"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<CategoryList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/category/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<CategoryView tabName={constants.TAB_NAME.viewCategory} />}
          />

          <Route
            path="/language"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<LanguageList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/language/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ViewLanguage tabName={constants.TAB_NAME.viewLanguage} />}
          />

          <Route
            path="/purchase"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<PurchaseList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/issue_book"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<IssueBookList tabName={constants.TAB_NAME.booklist} />}
          />

          {/* <Route
            path={"/issue_book/e"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AddIssueBook selectedRecordType='issue_book' tabName={constants.TAB_NAME.createBookIssue} />}
          /> */}

          <Route
            path="/issue_book/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<IssueView tabName={constants.TAB_NAME.viewIssueBook} />}
          />

          {/* End Added by Yamini Mishra */}

          {/* Start Added by Yamini Mishra */}
          <Route
            path="/books"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<ListOfBook tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/books/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<BookView tabName={constants.TAB_NAME.viewBook} />}
          />

          <Route
            path="/publisher"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<PublisherList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/supplier"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<SupplierList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/author"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AuthorLIst tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/category"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<CategoryList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/language"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<LanguageList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/purchase"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<PurchaseList tabName={constants.TAB_NAME.booklist} />}
          />

          <Route
            path="/issue_book"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<IssueBookList tabName={constants.TAB_NAME.booklist} />}
          />

          {/* <Route
            path={"/issue_book/e"}
            allowedRoles={[constants.MODIFY_ALL]}
            element={<AddIssueBook selectedRecordType='issue_book' tabName={constants.TAB_NAME.createBookIssue} />}
          /> */}

          <Route
            path="/issue_book/:id"
            allowedRoles={[constants.MODIFY_ALL]}
            element={<IssueView tabName={constants.TAB_NAME.viewIssueBook} />}
          />

          {/* End Added by Yamini Mishra */}

          <Route
            path="/company"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <Company tabName={constants.TAB_NAME.viewTimetable} />
            }
          />

          <Route
            path="/promotion"
            allowedRoles={[constants.MODIFY_ALL]}
            element={
              <Promotion tabName={constants.TAB_NAME.viewPromotion} />
            }
          />

          <Route path="/404" element={<Error />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
