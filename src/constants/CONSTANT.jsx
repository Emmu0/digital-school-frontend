//For working on local
export const API_BASE_URL = "http://localhost:3003";

//for pushing update on Git, I have to uncomment it
//export const API_BASE_URL = process.env.REACT_APP_BASEURL;
export const IMAGE_URL = "https://portal.kairakitchen.com";
export const VIEW_LEAD = "VIEW_LEAD";
export const VIEW_PROPERTY = "VIEW_PROPERTY";
export const EDIT_LEAD = "EDIT_LEAD";
export const DELETE_LEAD = "DELETE_LEAD";
export const VIEW_PRODUCT = "VIEW_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const MODIFY_ALL = "MODIFY_ALL";
export const VIEW_ALL = "VIEW_ALL";
export const VIEW_CONTACT = "VIEW_CONTACT";
export const VIEW_ORDER = "VIEW_ORDER";

//FILE TYPES
export const PDF = "pdf";
export const DOC = "doc";
export const DOCX = "docx";
export const XLS = "xls";
export const XLSX = "xlsx";
export const CSV = "csv";
export const PNG = "png";
export const JPG = "jpg";
export const JPEG = "jpeg";

export const TAB_NAME = {

    //.......Permission Elements........
    'rolepermissionList': 'Role Permission List',
    'roleList': 'Role List',
    'moduleList': 'Module List',
    'addRolePermission': 'Add Role Permission',

    //.......Staff Elements........
    'staffList': 'Staff List',
    'createStaff': 'Create Staff',
    'viewStaff': 'View Staff',
    'editStaff': 'Edit Staff',
    'staffAttendence': 'Staff Attendence',
    'staffLeave': 'Staff Leave',
    'createLeave': 'Create Leave',

    //..........Students Elements.........
    'studentsList': 'Students List',
    'createStudent': 'Create Student',
    'editStudent': 'Edit Student',
    'viewStudent': 'View Student',
    'viewStudentSibling': 'View Student',
    'studentAddmissionList': 'Student Registration List',
    'studentAddmission': 'Student New Registration',
    'viewStudentAddmission': 'View Student Registration',
    'editStudentAddmission': 'Edit Student Registration',
    'classList': 'Class List',
    'createClass': 'Create Class',
    'viewClass': 'View Class',
    'editClass': 'Edit Class',
    'studentAttendenceList': 'Student Attendence List',
    'studentsLeave': 'Students Leave',
    'createStudentsLeave': 'Create Students Leave',

    //.......Time Table Elements........
    'addtimetable': 'Add Time Table',
    'classtimetable': 'Class Time Table',
    'printtimetable': 'Print Time Table',

    //............Subject Elements..............
    'subjectList': 'Subject List',
    'assignedSubjectsList': 'Assigned Subjects List',
    'assignSubjectsToClass': 'Assign Subjects to class',
    'subjectTeachersList': 'Subject Teachers List',
    'newSubjectTeacher': 'Create New Subject Teacher',
    'editSubjectsToClass': 'Edit Subjects to class',
    'teacherView': 'View Subject Teacher',
    'editTeacher': 'Edit Subject Teacher',

    //........Fee Management........
    'feeHeadMasterList': 'Fee Head Master List',
    'feeMasterList': 'Fee Master List',
    'feeMasterAdd': 'Fee Master Add',
    'feeMasterLineItem': 'Fee Master Line Item',
    'feeDeposite': 'Fee Deposite',
    'feeDepositeEdit': 'Fee Deposite Edit',
    'feeDepositeHistory': 'Fee Deposite History',

    //............Leads.............
    'leadList': 'Lead List',
    'createLead': 'Create Lead',
    'editLead': 'Edit Lead',
    'viewLead': 'View Lead',

    //...........Transports............
    'registerDriver': 'Register Driver',
    'vehicleList': 'Vehicle List',
    'vehicleCreate': 'Create Vehicle',
    'vehicleView': 'View Vehicle',
    'vehicleEdit': 'Edit Vehicle',

    // shivam shrivastava code.

    'locationMaster': 'Location Master',
    'fareMaster': 'Fare Master',
    'locationList': 'Location List',
    'fareList': 'Fare List',
    'vehicles': 'Vehicles',
    'vehiclesadd': 'Vehicles Add',
    'vehiclesupdate': 'Vehicles Update',

    //........RTE Added By Shakib........
    'rte': 'Rte',

    //.............Exam..............
    'examTerm': 'Exam Term',
    'examTitle': 'Exam Title',
    'examSchedule': 'Exam Schedule',
    'examUploadMarks': 'Exam Upload Marks',
    'newExamTerm': 'New Exam Term',
    'scheduleEdit': 'Exam Schedule Edit',
    'routeadd': 'Route Add',// add Nov 9 2023
    'routeList': 'Route List',// add Nov 9 2023

    //******** Assignment Module(Shakib) ************
    'assignment': 'Assignment',
    'session': 'Session List',

        /********* Yamini Mishra ********/
        'createBookIssue': 'Create Book Issue',
        'viewBook': 'View Book',
        'viewIssueBook': 'View Issue Book',
        /********* Yamini Mishra ********/
        'viewPromotion':'View Promotion',

    /********* Yamini Mishra ********/
    'createBookIssue': 'Create Book Issue',
    'viewBook': 'View Book',
    'viewIssueBook': 'View Issue Book',
    'viewLanguage' : 'View Language',
    'viewSupplier' : 'View Supplier',
    'viewCategory' : 'View Category',
    'viewPublisher' : 'View Publisher',
    /********* Yamini Mishra ********/
    // Abhishek
    'viewAuthor' : "Author Details"
}

//******** Quick Launcher(Prince) ************
export const QuickArr = [
    {
        key: "Module", value: "module", Data: [
            { id: "1", iscore: false, sub_module_url: "/permissionlist", name: "Permission", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "2", iscore: false, sub_module_url: "/rolelist", name: "Role", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "3", iscore: false, sub_module_url: "/modulelist", name: "Module", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "4", iscore: false, sub_module_url: "/rolepermissionlist", name: "Role_Permission", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "5", iscore: false, sub_module_url: "/students", name: "Student_Enquiry", icon: "fa-solid fas fa-street-view mx-2", anothernode: '' },
            { id: "6", iscore: false, sub_module_url: "/student/e", name: "Students_Registration", icon: "fa-solid fas fa-chart-line mx-2", anothernode: '' },
            { id: "7", iscore: false, sub_module_url: "/rte", name: "RTE_Student", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "8", iscore: false, sub_module_url: "/syllabuslist", name: "Syllabus", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "9", iscore: false, sub_module_url: "/subjects", name: "Subject", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "10", iscore: false, sub_module_url: "/assignsubjectclass", name: "Assign_Subject_Class", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "11", iscore: false, sub_module_url: "/section", name: "Section", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "12", iscore: false, sub_module_url: "/classes", name: "Class", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "13", iscore: false, sub_module_url: "/staffs", name: "Employee", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "14", iscore: false, sub_module_url: "/driver/e", name: "Register_Driver", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "15", iscore: false, sub_module_url: "/transportation/locationlist", name: "Location", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "16", iscore: false, sub_module_url: "/transportation/farelist", name: "Fare", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "17", iscore: false, sub_module_url: "/transportation/routelist", name: "Route", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "18", iscore: false, sub_module_url: "/transportation/vehicles", name: "Vehicle", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "19", iscore: false, sub_module_url: "/examlist", name: "Exam", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "20", iscore: false, sub_module_url: "/examschedule", name: "Exam_Schedule", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "21", iscore: false, sub_module_url: "/feesheadmasterlist", name: "Fees_Head_Master", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "22", iscore: false, sub_module_url: "/feesmasterlist", name: "Fees_Master", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "23", iscore: false, sub_module_url: "/feedeposite", name: "Fee_Deposite", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "24", iscore: false, sub_module_url: "/addevent", name: "Add_Events", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "25", iscore: false, sub_module_url: "/eventscalender", name: "Events_Calendar", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "26", iscore: false, sub_module_url: "/assignmentlist", name: "Assignment", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "27", iscore: false, sub_module_url: "/Attendance_master", name: "Attendance_Master", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "28", iscore: false, sub_module_url: "/list_attendance", name: "Attendance", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "29", iscore: false, sub_module_url: "/timeslot", name: "Time_Slot", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "30", iscore: false, sub_module_url: "/timetable", name: "Time_Table", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
            { id: "31", iscore: false, sub_module_url: "/classwise", name: "Class_Wise_Time_Table", icon: "fa-solid fa-chart-simple mx-2", anothernode: '' },
        ]
    },
]