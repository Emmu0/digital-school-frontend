import * as constants from "../constants/CONSTANT";
import authApi from "./authApi";
import axios from "axios";
import { getToken, getAxios, getAxiosMultipart } from "../utils/helper";

const schoolApi = {
  async handleUnauthorized(method) {
    console.log('method' , method)
    try {
      return await method();
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.errors === "Please authenticate"
      ) {
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("Error:", error);
        throw error;
      }
    }
  },

  //.......... Fetch All Users ..........................................
  async fetchUsers() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/auth/users/all"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //Show Image Logo on Print Priview
  async urlToDataUrl(img) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/files/company/logoimg`
      );
      return data;
    });
  },
  //.............. Fetch User By Id .............................
  async fetchStaffById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/auth/${id}`
      );
      return data;
    });
  },

  async saveStaffMember(staffMember) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL}/api/auth/${staffMember.id}`
      );
      return data;
    });
  },

  async deleteUser(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL}/api/auth/${id}`
      );
      return data;
    });
  },

  //************************ Contacts ***********************************//

  //................... Create Contact ................................
  async createContact(student) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL}/api/contacts`,
        student
      );
      return data;
    });
  },

  async createContactParent(parent) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL}/api/contacts`,
        parent
      );
      return data;
    });
  },
  //Update Student Record
  async updateStudent(student) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL}/api/students/${student.id}`,
        student
      );
      return data;
    });
  },
  //Update Parent Record
  async updateParentContact(parent) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL}/api/contacts/${parent.id}`,
        parent
      );
      return data;
    });
  },

  /* added by Ronak sharma */

  //************************ Student ***********************************//

  //************************ create student ***********************************//

  async createStudent(student) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/students/",
        student
      );
      return data;
    });
  },
  //session
  async createSession(sessionData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/sessions/session",
        sessionData
      );
      return data;
    });
  },

  async getAllSession() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();

      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/sessions/session"}`
      );
      if (data.length > 0) return data;
    });
  },

  async getAllSettings() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/settings/"}`
      );
      return data;
    });
  },

  async getSettingByKey(key) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/settings/" + key}`
      );
      return data;
    });
  },

  async createSettings(settingsRecord) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/settings/"}`,
        settingsRecord
      );
      return data;
    });
  },

  async updateSettings(id, settingsRecord) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/settings/" + id}`,
        settingsRecord
      );
      return data;
    });
  },

  async deleteSettings(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/settings/" + id}`
      );
      return data;
    });
  },
  // async getSessionById(id) {
  //   return await this.handleUnauthorized(async () => {
  //     const instance = getAxios();

  //     const { data } = await instance.get(
  //       `${constants.API_BASE_URL + "/api/sessions/session/"+id}`
  //     );
  //     if (data.length > 0) return data;
  //   });
  // },

  async getSessionById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/sessions/session/" + id}`
      );
      console.log('check kr -->', data);
      if (data.success) {
        return data;
      }
    });
  },

  async updateSession(id, sessionData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/sessions/session/" + id}`,
        sessionData
      );
      return data;
    });
  },

  async deleteSession(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/sessions/session/" + id}`
      );
      return data;
    });
  },

  //Update Student Record
  async saveContact(contact) {
    console.log("schoolApiContact", contact);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/contacts/" + contact.id}`,
        contact
      );
      console.log("SchoolApiData==>", data);
      return data;
    });
  },

  //................... Fetch All Staff Contacts ................................
  async fetchStaffContacts() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();

      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/staff"}`
      );
      console.log('dataRecord==>', data);
      if (data.length > 0) return data;
    });
  },

  //................... Fetch All Students ................................
  async fetchStudents() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //................... Fetch All Rte Students : Added by Shakib Khan ................................
  async fetchAllRteStudents() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/studentaddmissions/getrte"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //................... Fetch All Parents ................................
  async fetchParentContacts() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/parent"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //.............. Fetch Contact By Id .............................

  async fetchContact(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/" + id}`
      );
      return data;
    });
  },

  async fetchStudentbyId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/sibling/" + id}`
      );
      return data;
    });
  },
  async fetchStudentbyClassId(classid) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/class/" + classid}`
      );
      return data;
    });
  },
  async fetchStudentAddmissionbyClassId(classid) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/addmission/class/" + classid
        }`
      );
      return data;
    });
  },
  async fetchStudentbySRNumber(srnumber) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/srnumber/" + srnumber}`
      );
      return data;
    });
  },

  //Fetch Parents.
  async fetchStudentByParentId(contIds) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/parent/" + contIds}`
      );
      return data;
    });
  },
  //.............. Fetch Student Rte By Id .............................
  async fetchStudentRteId(id) {
    return await this.handleUnauthorized(async () => {
      console.log("fetchStudentRteId@@@@@@@=>", id);
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/students/rte/" + id}`
      );
      return data;
    });
  },
  // async fetchStudentByParentId(id) {
  //   const instance = getAxios();
  //   const { data } = await instance.get(
  //     `${constants.API_BASE_URL + "/api/contacts/parent/" + id}`
  //   );
  //   return data;
  // },
  // .......... Delete Contact Student .............................
  async deleteContactStudent(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/contacts/" + id}`
      );

      return data;
    });
  },

  //.............. Fetch Total Count of Student .............................
  async fetchCountOfStudents() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/total/students"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //.............. Fetch Total Count of Staff .............................
  async fetchCountOfStaffs() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/total/staff"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //.............. Fetch Total Count of Parent .............................
  async fetchCountOfParents() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/total/parents"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //.............. Fetch Total Count of Class .............................
  async fetchCountOfClasses() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/classes/total/class"}`
      );
      if (data.length > 0) {
        console.log("@@@ = ", data);
        return data;
      }
    });
  },

  // .......... Delete Contact .............................
  async deleteContact(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/contacts/" + id}`
      );
      return data;
    });
  },

  // .......... Delete Student .............................
  async deleteStudent(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/students/" + id}`
      );
      return data;
    });
  },

  /* ............................csv attendence upload........................... */

  async uploadCSVFile(formData) {
    const instance = getAxiosMultipart();
    try {
      const response = await instance.post(
        `${constants.API_BASE_URL + "/api/attendances/upload"}`,
        formData
      );
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.error("uploadCSVFile error => ", error);
    }
  },

  //* ................... Syllabus Module Added By Shakib Khan : Start ................... */

  async getAllSyllabus() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/syllabus/getallsyllabus"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createSyllabus(syllabus) {
    console.log('createSyllabus==>',syllabus);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/syllabus/"}`,
        syllabus
      );
      console.log('DataModel==>',data);
      return data;
    });
  },

  async updateSyllabus(id, syllabus) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, syllabus);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/syllabus/" + id}`,
        syllabus
      );
      return data;
    });
  },

  async deleteSyllabus(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/syllabus/" + id}`
      );
      return data;
    });
  },

  //* ................... Syllabus Module Added By Shakib Khan : End ................... */

  //********************* Subject ************************/

  //.............. Create Subject Class  .........................
  async createSubject(subject) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/subjects/"}`,
        subject
      );
      return data;
    });
  },

  // .................. Save Subject  ........................................
  async saveSubject(subject) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/subjects/" + subject.id}`,
        subject
      );
      return data;
    });
  },

  //.................. Fetch Subject .....................
  async fetchSubject() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/subjects/active"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  //........... Fetch Subject By Id.........................
  async fetchSubjectById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/subjects/" + id}`
      );
      return data;
    });
  },

  /*************************** ASSIGN SUBJECT CLASS START ********************************************* */
  // Added By Abdul Pathan
  async fetchAssignSubjectClass() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/assignsubjectclass"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  async createAssignSubjectClass(assignSubjectClass) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/assignsubjectclass"}`,
        assignSubjectClass
      );
      return data;
    });
  },

  async deleteAssignSubjectClass(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/assignsubjectclass/" + id}`
      );
      return data;
    });
  },

  async getAllRecords(classname) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL +
        "/api/assignsubjectclass/add/edit/" +
        classname
        }`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  /**************************** ASSIGN SUBJECT CLASS END ************************************************* */
  /*******************************SECTION START************************************************************** */
  // Added by Abdul Pathan
  //fetch Section Records
  async fetchSectionRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  // Add by Aamir khan 14-05-2024
  async fetchSectionRecordsWithClassId(ClassId) {
    console.log('enter in fetchSectionRecords', ClassId);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/"+ClassId}`
      );

      if (data.length > 0) {
        console.log('e3e23e23e23e23e=======>',data);
        return data;
      }
    });
  },

  // Add Section Record
  async addSectionRecord(body) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/section/add"}`,
        body
      );
      return data;
    });
  },

  // update section record
  async updateSectionRecord(sectionRecords) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/section/" + sectionRecords.id}`,
        sectionRecords
      );
      return data;
    });
  },

  //update Section Record active/inactive
  async updateSectionActiveRecord(sectionRecords) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL +
        "/api/section/active/" +
        sectionRecords.section_id
        }`,
        sectionRecords
      );
      return data;
    });
  },

  // fetch Record by Id
  async fetchRecordById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/" + id}`
      );
      return data;
    });
  },

  //Tecting fetch Section Records
  async fetchTeacherRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/teacher/abc"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  //fetch Section Recordssection
  async fetchSections() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  /*****************************SECTION END************************************************************** */

  //************************ files ***********************************//

  //****************** File Create *******************

  async createFile(parentId, selectedFiles) {
    const token = sessionStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + parentId,
      {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: token,
        },
        body: selectedFiles,
      }
    );
    const result = await response.json();
    return result;
  },

  async fetchFiles(pid) {
    const token = sessionStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + pid + "/all",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const result = await response.json();
    if (result.length > 0) {
      return result;
    }
    return null;
  },

  async downloadFiles(file) {
    const token = sessionStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + file.id + "/download",
      {
        method: "GET",
        //mode: "cors",

        headers: {
          Authorization: token,
        },
      }
    );
    const fileBody = await response.blob();
    return fileBody;
  },

  async saveFiles(file) {
    const token = sessionStorage.getItem("token");
    let response = await fetch(
      constants.API_BASE_URL + "/api/files/" + file.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(file),
      }
    );

    return await response.json();
  },

  async deleteFile(id) {
    const token = sessionStorage.getItem("token");
    let response = await fetch(constants.API_BASE_URL + "/api/files/" + id, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return await response.json();
  },

  async saveStudentAttendance(records, id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/studentattendances/" + id}`,
        records
      );
      return data;
    });
  },
  async fetchFilterdstudent(query) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      try {
        const { data } = await instance.get(
          `${constants.API_BASE_URL}/api/studentattendances/` + query
        );
        return data;
      } catch (error) {
        console.error("Error fetching filtered student data:", error);
        throw error;
      }
    });
  },
  async createstudentAttendance(attandanceRecord) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/studentattendances/"}`,
        attandanceRecord
      );
      return data;
    });
  },

  //********************* Lead ************************/

  //.............. Create lead .........................
  async createlead(lead) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/leads/"}`,
        lead
      );
      return data;
    });
  },

  // .................. Save lead  ........................................
  async savelead(lead) {
    console.log('leadd savelead ======>', lead);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/leads/" + lead.id}`,
        lead
      );
      return data;
    });
  },

  //.................. Fetch lead .....................
  async fetchlead() {
    return await this.handleUnauthorized(async () => {
      console.log("fetchlead@@@1211");
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/leads/"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  //........... Fetch Lead By Id.........................
  async fetchleadById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/leads/" + id}`
      );
      return data;
    });
  },

  //............ Delete lead  ..........................
  async deletelead(id) {
    console.log('deletelead======>', id);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/leads/" + id}`
      );
      return data;
    });
  },

  // *********************Added By Abdul Pathan***********START**************
  //Added by Abdul Pathan || fetch Contact Teacher Records
  async getTeacherRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/teacher"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  //END

  //Added by Abdul Pathan || Subjects || START
  async getSubjectRecord() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/subjects"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getSubjectRecordById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/subjects/" + id}`
      );
      return data;
    });
  },

  // async getSubjectRecordName(ObjFilter) {
  //   console.log("objNameSearchfliter==>", ObjFilter);
  //   const instance = getAxios();
  //   const { data } = await instance.get(
  //     `${constants.API_BASE_URL +
  //     "/api/subjects/search/" +
  //     ObjFilter?.status +
  //     "/" +
  //     ObjFilter?.type
  //     }`
  //   );

  //   console.log("dataresobj", data);
  //   if (data.length > 0) {
  //     return data;
  //   }
  // },

    // ==================  Add By Aamir khan getSubjectRecordName Code Start ==========================

    //Add by Aamir khan
    async getSubjectRecordName(ObjFilter) {   
      console.log('objNameSearchfliter==>',ObjFilter);
      console.log('ObjFilter.type==>',ObjFilter.type);
      let status = ObjFilter?.status ? ObjFilter?.status : 'undefined' // Add by Aamir khan 15-04-2024
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/subjects/search/" + status+ "/" + ObjFilter?.type }` // Add by Aamir khan 15-04-2024
      );
  
      console.log('dataresobj',data);
      if (data.length > 0) {
        return data;
      }
    },
  
    // ================== Aamir khan getSubjectRecordName Code End ==========================

  async addSubjectRecord(subject) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/subjects"}`, subject
      );
      return data;
    });
  },

  async updateSubjectRecord(subject) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/subjects/" + subject.id}`,
        subject
      );
      return data;
    });
  },

  async deleteSubjectRecord(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/subjects/" + id}`
      );
      return data;
    });
  }, // subjects || END
  //END

  //Added by Abdul Pathan || Assign Subject Class || START
  async getAssignSubjectClassRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/assignsubjectclass"}`
      );
      return data;
    });
  },

  async addAssignSubjectClassRecord(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/assignsubjectclass"}`,
        record
      );
      return data;
    });
  },

  // class recordId by records
  async getAssignSubjectClassIdByRecords(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/assignsubjectclass?class_id=" + id}`
      );

      return data;
    });
  },

  async deleteAssignSubjectClassRecord(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/assignsubjectclass/" + id}`
      );
      return data;
    });
  },
  //END

  //Added by Abdul Pathan || Section || START
  async getSectionRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async addSectionRecord(body) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/section/add"}`,
        body
      );
      return data;
    });
  },

  async updateSectionRecord(sectionRecords) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/section/" + sectionRecords.id}`,
        sectionRecords
      );
      return data;
    });
  },

  async updateSectionActiveRecord(sectionRecords) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL +
        "/api/section/active/" +
        sectionRecords.section_id
        }`,
        sectionRecords
      );
      return data;
    });
  },

  //Added by Abdul Pathan || Classes || START
  async getClassRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/classes"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  async getClassRecordsWithSections() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/class"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  async getActiveClassRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/classes/active"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async addClassRecord(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/classes/add"}`,
        records
      );
      return data;
    });
  },

  async updateClassRecord(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/classes/" + records.id}`,
        records
      );
      return data;
    });
  },

  //************************ Transport Module by Shivam Shrivastva ***********************************//

  //************** FareMaster by Shivam Shrivastva **************
  //-----------------Create FARE by shivam-----------------
  async createFaremaster(formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/faremaster/fare"}`,
        formData
      );
      return data;
    });
  },
  //-----------------Update FARE by shivam-----------------
  async updateFareMaster(fareIdToUpdate, updatedFareData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const url = `${constants.API_BASE_URL}/api/faremaster/fare/${fareIdToUpdate}`;

      const { data } = await instance.put(url, updatedFareData);
      return data;
    });
  },
  //-------------getAllFare by shivam-------------
  async getAllFares() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/faremaster/fare`
      );
      return data;
    });
  },
  //----------------fetchFareById by shivam-------------------------
  async fetchFareById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/faremaster/fare/" + id}`
      );
      return data;
    });
  },
  //............ Delete Fare  by shivam..........................
  async deleteFare(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/faremaster/fare/" + id}`
      );
      return data;
    });
  },

  //******************locationMaster* by shivam shrivastva******************
  //---------------create location by shivam--------------------
  async createLocationmaster(formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/locationmaster/location"}`,
        formData
      );
      return data;
    });
  },

  //-------------getAllLocation-- by shivam------------------
  async getAllLocation() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/locationmaster/location`
      );
      return data;
    });
  },

  //----------------fetchLocationById by shivam*----------------
  async fetchLocationById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/locationmaster/location/" + id}`
      );
      return data;
    });
  },

  //---------------- Delete Fare by shivam ----------------
  async deleteLocation(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/locationmaster/location/" + id}`
      );
      return data;
    });
  },
  //-------------Update Location by shivam ----------------
  async updateLocationMaster(locationMasterId, formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const url = `${constants.API_BASE_URL}/api/locationmaster/location/${locationMasterId}`;
      const { data } = await instance.put(url, formData);
      return data;
    });
  },

  //******************Vehicle* by shivam shrivastva******************
  //-------------Create VehicleList Transport by Shivam-------------
  async createVehicle(formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/transportation/vehicles"}`,
        formData
      );
      return data;
    });
  },
  //-------------getbyId Vehicle by shivam-------------
  async vehicleById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/transportation/vehicles/${id}`
      );
      return data;
    });
  },
  //-------------UPDATE vehicle by shivam*-------------
  async updateVehicle(vehicleId, formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const url = `${constants.API_BASE_URL}/api/transportation/vehicles/${vehicleId} `;
      const { data } = await instance.put(url, formData);
      return data;
    });
  },
  //-------------Create VehicleList Transport by Shivam-------------
  async getAllVehicles() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/transportation/vehicles"} `
      );
      return data;
    });
  },
  //-------------delete vehicle Transport by shivam-------------
  async deleteVehicle(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/transportation/vehicles/" + id} `
      );
      return data;
    });
  },

  // Driver
  async fetchDrivers() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/contacts/driver"}`
      );
      return data;
    });
  },

  //----------- Assign Transport **Code Pawan** 03-apr-2024 ------------------
  async createAssignTransport(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/assigntransport"}`,
        record
      );
      return data;
    });
  },

  async getAssignTransportByIdOrStudentid(record) {
    return await this.handleUnauthorized(async () => {
      const id = record?.studentid ? record.studentid : record.id;
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/assigntransport/id/" + id}`
      );
      return data;
    });
  },

  //***************Exam (including AddResult) and Session module by Pawan Singh Sisodiya***************

  //---------------- Fetch All Exam Titles ---------------------
  async fetchExamTitles() {
    console.log('fetchExamTitles');
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/exams/examtitle"}`
      );
      if (data.length > 0) {
        console.log("schoolApiSession-->", data);
        return data;
      }
    });
  },

  // ------------- Create New Exam Title ------------------------
  async createExamTitle(newTitle) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/exams/examtitle"}`,
        newTitle
      );
      return data;
    });
  },

  // ------------- Update Exam Title ------------------------
  async updateExamTitle(id, newTitle) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/exams/examtitle/" + id}`,
        newTitle
      );
      console.log("DataResult==>", data);
      return data;
    });
  },

  //---------------- Fetch All Sessions ---------------------
  async fetchSessions() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/sessions/session"}`
      );
      if (data.length > 0) {
        console.log("sessions get - ", data);
        return data;
      }
    });
  },

  //---------------- Fetch All Exams Schedules ---------------------
  async fetchExamSchedules() {
    console.log('fetchExamSchedules');
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/exams/examschedule"}`
      );
      if (data.length > 0) {
        console.log('@#Data==>', data);
        return data;
      }
    });
  },

  //---------------- Fetch Exams Schedules By Id---------------------
  async fetchExamSchedulesById(id) {
    return await this.handleUnauthorized(async () => {
      console.log("examScheduleId", id);
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + `/api/exams/examschedule/${id}`}`
      );
      console.log(" length data =====>", data);
      if (data) {
        return data;
      }
    });
  },

  // ------------- Create New Exam Schedule ------------------------
  async createExamSchedule(newSchedule) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/exams/examschedule"}`,
        newSchedule
      );
      console.log('createExamSchedule==>', data);
      return data;
    });
  },

  // ------------- Update Exam Schedule ------------------------
  async updateExamSchedule(id, updatedSchedule) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/exams/examschedule/" + id}`,
        updatedSchedule
      );
      return data;
    });
  },

  //------------ Fetch All Related Records For Create Schedule --------------
  async fetchRelatedRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/exams/relatedrecords"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  // --------------- Delete Schedule ---------------
  async deleteSchedule(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/exams/examschedule/" + id}`
      );
      return data;
    });
  },

  // --------------- Delete Title ---------------
  async deleteTitle(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/exams/examtitle/" + id}`
      );
      return data;
    });
  },

  //---------------- Create Result ---------------------
  async createResult(newResult) {
    return await this.handleUnauthorized(async () => {
      console.log("newResult update========> 1", newResult);
      const instance = getAxios();
      console.log("newResult update========> 2");
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/results/create_result"}`,
        newResult
      );
      console.log("data========>", data);
      return data;
    });
  },

  //---------------------- Update Result --------------------
  async updateResult(newResult) {
    return await this.handleUnauthorized(async () => {
      console.log("id,newResult============>", newResult);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/results/result"}`,
        newResult
      );
      return data;
    });
  },

  //---------------- get Result By ExamScheduleId ----------------
  async fetchStudentsByIds(ids) {
    return await this.handleUnauthorized(async () => {
      console.log("fetchStudentsByIds", ids);
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + `/api/results/students`}`,
        ids
      );
      return data;
    });
  },

  //********************* Event Module : Added by Shakib ************************

  //-------------- Create Event : Added by Shakib --------------
  async createEvent(event) {
    return await this.handleUnauthorized(async () => {
      console.log("createEvent called!!!!");
      console.log("createEvent params = ", event);
      const instance = getAxios();
      try {
        const { data } = await instance.post(
          `${constants.API_BASE_URL + "/api/events/"}`,
          event
        );
        return data;
      } catch (error) {
        console.error("Error creating event:", error);
        throw error;
      }
    });
  },

  //-------------- Get All Events : Added by Shakib --------------
  async getAllEvents() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/events/getallevents"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  //-------------- Update Event : Added by Shakib --------------
  async updateEvent(id, event) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, event);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/events/" + id}`,
        event
      );
      return data;
    });
  },

  //-------------- Delete Event : Added by Shakib --------------
  async deleteEvent(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/events/" + id}`
      );
      return data;
    });
  },
  ///////////////////////////////////////////////////////////////
  //Added by Abdul Pathan || attendance master || START
  async getAttendanceMasterRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/attendance_master"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async addAttendanceMasterRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/attendance_master"}`,
        record
      );
      return data;
    });
  },

  async updateAttendanceMasterRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/attendance_master/" + record.id}`,
        record
      );
      return data;
    });
  }, // attendance master || END

  //Added by Abdul Pathan || attendance || START
  async getAttendanceRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/attendance"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  //Pooja Vaishnav
  async getAttendanceRecordByMonthAndYear(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL +
        "/api/attendance/attInfo?month=" +
        record.month +
        "&year=" +
        record.year
        }`
      );

      return data;
    });
  },
  async addAttendanceRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/attendance"}`,
        record
      );
      return data;
    });
  },
  async getAttendanceRecordById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/attendance/"}` + id
      );
      return data;
    });
  },
  async updateAttendanceRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/attendance/" + record.id}`,
        record
      );
      return data;
    });
  }, //attendance || END

  //fetchAttendanceFilterByData
  async fetchAttendanceFilterByData(student_id, month) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL}/api/attendance_line_item/student_id/${student_id}/month/${month}`
    );
    return data;
  },

  //getAttendanceByStudentId
  async getAttendanceByStudentId(student_id) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL}/api/attendance/student_id/${student_id}`
    );
    return data;
  },
  //Added by Abdul Pathan || attendance Line Item|| START
  async getAttendanceLineItemRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL +
        "/api/attendance_line_item?class_id=" +
        record.class_id +
        "&section_id=" +
        record.section_id +
        "&date=" +
        record.date
        // "&startDate=" +
        // record.startDate +
        // "&endDate=" +
        // record.endDate
        }`
      );
      // if (data.length > 0) {
      return data;
      // }
    });
  },

  async addAttendanceLineItemRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/attendance_line_item"}`,
        record
      );
      return data;
    });
  },
  async updateAttendanceLineItemRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/attendance_line_item/" + record.id}`,
        record
      );

      return data;
    });
  },
  async getStudentRecords(record) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL +
        "/api/students/" +
        record.class_id +
        "?section_id=" +
        record.section_id
        }`
      );

      return data;
    });
  },
  async getSectionRecordById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/section/class/" + id}`
      );
      return data;
    });
  },
  async checkDuplicacy(student) {
    return await this.handleUnauthorized(async () => {
      console.log("checkDuplicacy");
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/students/dupli/",
        student
      );
      return data;
    });
  },
  /* Created By Pooja Vaishnav */
  //................... Create a Contact based on the record type................................
  async createContOnRecType(contact) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/contacts/parentsData"}`,
        contact
      );
      return data;
    });
  },
  //........... Fetch Student Addmission By Id.........................
  async fetchStudentAddmissionById(id) {
    return await this.handleUnauthorized(async () => {
      console.log("fetchStudentAddmissionById", id);
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/studentaddmissions/" + id}`
      );
      return data;
    });
  },
  //.................. Fetch Class .....................
  async fetchClasses() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/classes/"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  // .................. Save Student ........................................
  async saveStudentAddmission(studentaddmission) {
    return await this.handleUnauthorized(async () => {
      console.log("saveStudentAddmission@@@@=>", studentaddmission);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL +
        "/api/studentaddmissions/" +
        studentaddmission.student_addmission_id
        }`,
        studentaddmission
      );
      return data;
    });
  },
  //............ Delete Student Addmission ..........................
  async deleteStudentAddmission(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/studentaddmissions/" + id}`
      );
      return data;
    });
  },
  //................... Fetch All Vehicles Contacts ................................
  async fetchVehicles() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();

      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/transportation/vehiclesRte"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //.............. Create Student Addmission  .........................
  async createStudentAddmission(studentaddmission) {
    return await this.handleUnauthorized(async () => {
      console.log("createStudentAddmission@@@@", studentaddmission);
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/studentaddmissions/"}`,
        studentaddmission
      );
      return data;
    });
  },
  //................... Create Transport Vehicle ...........................
  async createTransportVehicle(vehicle) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/transportation/vehicle"}`,
        vehicle
      );
      return data;
    });
  },
  //.................... Fetch Student Addmissions .......................
  async fetchStudentAddmission(student_id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/studentaddmissions/admission/student_id/${student_id}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //.................... Fetch Student Addmissions .......................
  async fetchAdmissionByStudentId(student_id) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL}/api/studentaddmissions/student_id/${student_id}`
    );
    return data;
  },
  /* Created By Pooja Vaishnav */
  //................... Create Previous School Data ............................
  async createPreviousSchool(preSchool) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/previousSchool"}`,
        preSchool
      );
      return data;
    });
  },
  //checkDuplicatLead //Commented by Aamir
  // async checkDuplicatLead(lead) {
  //   return await this.handleUnauthorized(async () => {
  //     console.log('checkDuplicacy');
  //     const instance = getAxios();
  //     const { data } = await instance.post(
  //       constants.API_BASE_URL + "/api/leads/dupli/",
  //       lead
  //     );
  //     return data;
  //   });
  // },
  //checkDuplicatContact
  async checkDuplicatContact(contact) {
    return await this.handleUnauthorized(async () => {
      console.log("checkDuplicacy");
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/contacts/dupli/",
        contact
      );
      return data;
    });
  },
  //checkStudentDuplicacy
  async checkStudentDuplicacy(student) {
    return await this.handleUnauthorized(async () => {
      console.log("checkDuplicacy");
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/students/dupli/",
        student
      );
      return data;
    });
  },
  //checkContactDuplicacy
  async checkContactDuplicacy(familyInfo) {
    return await this.handleUnauthorized(async () => {
      console.log("checkDuplicacy");
      const instance = getAxios();
      const { data } = await instance.post(
        constants.API_BASE_URL + "/api/contacts/dupli/",
        familyInfo
      );
      return data;
    });
  },  

  /* *******************************Transport Module By Shivam************************************ */
  async getAllRoute() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/route/getroute"}`
      );
      return data;
    });
  },

  //--------------Route create Transport(Shivam)-Nov 9 2023-------------
  async createRoute(formData) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/route/createroute"}`,
        formData
      );
      return data;
    });
  },
  //--------------Route create Transport(Shivam)-Nov 20 2023-------------
  async deleteRoute(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/route/deleteroute/" + id} `
      );
      return data;
    });
  },

  async updateRoute(routeId, formData) {
    console.log('routeId, formData =====>', routeId, formData);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const url = `${constants.API_BASE_URL}/api/route/routeupdate/${routeId} `;
      const { data } = await instance.put(url, formData);
      return data;
    });
  },

  // async updateRoute(id, formData) {
  //   return await this.handleUnauthorized(async () => {
  //     console.log("id,event=====>", id, formData);
  //     const instance = getAxios();
  //     const { data } = await instance.put(
  //       `${constants.API_BASE_URL + "/api/route/routeupdate/" + id}`,
  //       formData
  //     );
  //     return data;
  //   });
  // },

  //********************* Start Assignment Module  (Shakib) ************************/

  async createAssignment(assignment) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/assignment/"}`,
        assignment
      );
      return data;
    });
  },

  async updateAssignment(id, assignment) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, assignment);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/assignment/" + id}`,
        assignment
      );
      return data;
    });
  },

  async getAllAssignment() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/assignment/assignments"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async deleteAssignment(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/assignment/" + id}`
      );
      return data;
    });
  },
  //********************* End Assignment Module (Shakib) ************************/

  //************************************** Fee Module ********************************/

  // added by shivam shrivastava 14/12/2023---------------------
  async deleteFeeMaster(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/feemasters/" + id} `
      );
      return data;
    });
  },

  async updateFeeMasterLine(id, newTitle) {
    const instance = getAxios();
    const { data } = await instance.put(
      `${constants.API_BASE_URL + "/api/feemasterline/" + id}`,
      newTitle
    );
    return data;
  },

  // ...added updateFee by shivam shrivastava 15/12/2023...
  async updateFee(Id, feeMaster) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const url = `${constants.API_BASE_URL}/api/feemasters/${Id} `;
      const { data } = await instance.put(url, feeMaster);
      return data;
    });
  },

  //...Fetch All fetchFeesHeadMaster,createFeeMaster,updateFeeMaster,fetchFeeMaster By Pooja Vaishnav : 27 Nov 2023...
  async fetchFeesHeadMaster() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();

      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/feesheadmaster/"}`
      );
      if (data.length > 0) return data;
    });
  },

  async createFeeMaster(feeMaster) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/feemasters"}`,
        feeMaster
      );
      return data;
    });
  },

  async updateFeeMaster(id, assignment) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, assignment);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/assignment/" + id}`,
        assignment
      );
      return data;
    });
  },

  async fetchFeeMaster(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      let query = `${constants.API_BASE_URL + "/api/feemasters/"}`;

      if (id) {
        query += `${id}`;
      }

      const { data } = await instance.get(query);
      if (data.length > 0) {
        return data;
      }
    });
  },

  async fetchFeeMasterByIdOrClassid(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/feemasters/" + id}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //...createFeeHeadMaster By Pawan Singh Sisodiya 01 December 2023...
  async createFeeHeadMaster(newfeeHeadMasterRecord) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/feesheadmaster/"}`,
        newfeeHeadMasterRecord
      );

      console.log("data inside school api", data);
      if (data) {
        return data;
      }
    });
  },

  //...updateFeeHeadMaster By Pawan Singh Sisodiya 01 December 2023...
  async updateFeeHeadMaster(id, newfeeHeadMasterRecord) {
    return await this.handleUnauthorized(async () => {
      console.log("id for record update in school api", id);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/feesheadmaster/" + id}`,
        newfeeHeadMasterRecord
      );

      console.log("data update inside school api", data);
      if (data) {
        return data;
      }
    });
  },
  //...getHeadMastersByStatus By Pawan Singh Sisodiya 01 December 2023...
  async getHeadMastersByStatus(status) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/feesheadmaster/status/" + status}`
      );
      return data;
    });
  },

  // ... deleteFeeHeadMaster By Pawan Singh Sisodiya 01 Dec 2023 ...
  async deleteFeeHeadMaster(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/feesheadmaster/" + id}`
      );
      return data;
    });
  },

  async deleteFeeMasterInstallment(id) {
    const instance = getAxios();
    const { data } = await instance.delete(
      `${constants.API_BASE_URL + "/api/feemasterline/" + id}`
    );
    return data;
  },
  async getMasterInstallmentByFeeMasterId(id) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/feemasterline/get/" + id}`
    );
    return data;
  },
  async fetchFeeMasterLineItem() {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/feemasterline"}`
    );
    if (data.length > 0) {
      return data;
    }
  },
  async createFeeMasterLineItem(feeMaster) {
    console.log("createFeeMasterLineItem@@+>", feeMaster);
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL + "/api/feemasterline"}`,
      feeMaster
    );
    return data;
  },

  async deleteFeeMasterLineItem(id) {
    const instance = getAxios();
    const { data } = await instance.delete(
      `${constants.API_BASE_URL + "/api/feeinstallineitems/" + id}`
    );
    return data;
  },
  async getLineItemsByFeeMasterId(id) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/feeinstallineitems/" + id}`
    );
    return data;
  },
  async fetchFeeInstallmentLineItems() {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/feeinstallineitems/"}`
    );
    return data;
  },
  //...Create Fee-Installment-Line-Item Records By Pawan Singh Sisodiya : 29 Nov 2023 ...
  async createFeeInstallmentLineItems(feeHeadLineItem) {
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL + "/api/feeinstallineitems/"}`,
      feeHeadLineItem
    );
    return data;
  },

  async updateFeeInstallmentLineItems(feeHeadLineItem) {
    const instance = getAxios();
    const { data } = await instance.put(
      `${constants.API_BASE_URL + "/api/feeinstallineitems/"}`,
      feeHeadLineItem
    );
    return data;
  },
  //........... Fetch Fee Deposit By  Id (Single Record).........................
  async fetchFeeInstallmentsByClassIdAndMonth(admissionid, sessionid) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL +"/api/feeinstallineitems/" +admissionid +"/" +sessionid}`
    );
    return data;
  },

  async getallIntsallment(admissionid, sessionid) {
    console.log('calling fee_master_id', admissionid, sessionid)
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL +"/api/studentfeeinstallments/installments/"+admissionid +"/" +sessionid}`
    );
    return data;
  },

  //........... Fetch Related Fee Installments .........................
  async fetchRelatedInstallments(classid, type) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL +
      "/api/feeinstallineitems/classid/" +
      classid +
      "/type/" +
      type
      }`
    );
    return data;
  },

  async createStudentFeeInstallments(installmentRecords) {
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL + "/api/studentfeeinstallments/"}`,
      installmentRecords
    );
    return data;
  },

  async fetchStudentFeeInstallments(id) {
    const instance = getAxios();

    let uri = `${constants.API_BASE_URL + "/api/studentfeeinstallments/" + id}`;

    const { data } = await instance.get(uri);
    return data;
  },

  //********************* Fee Deposit ************************/

  // .................. Save Fee Deposit  ........................................
  async saveFeeDeposit(feeDepositEdit) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/deposits/" + feeDepositEdit.id}`,
        feeDepositEdit
      );
      return data;
    });
  },

  //.................. Fetch Fee Deposit .....................
  async fetchFeeDeposit() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/deposits/"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  //........... Fetch Fee Deposit By StudentAddmission Id.........................
  async fetchFeeDepositByStudentAddmissionId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/deposits/studentaddmission/" + id}`
      );
      return data;
    });
  },

  //........... Fetch Fee Deposit By  Id (Array on Related List).........................
  async fetchFeeDepositById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/deposits/" + id}`
      );
      return data;
    });
  },

  //........... Fetch Fee Deposit By  Id (Single Record).........................
  async fetchFeeDepositByStudentId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/deposits/studentaddmission/" + id}`
      );
      return data;
    });
  },

  //.............. Create Fee Deposit  .........................
  async createFeeDeposit(feeDeposit) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/feedeposites/"}`,
        feeDeposit
      );
      return data;
    });
  },

  async fetchFeeDepositsByStudentId(studentAddmissionid) {
    return await this.handleUnauthorized(async () => {
      console.log("inside schoooool API", studentAddmissionid);
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL +
        "/api/feedeposites/studentaddmission/" +
        studentAddmissionid
        }`
      );
      return data;
    });
  },

  async fetchFeeDepositsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/feedeposites/" + id}`
      );
      return data;
    });
  },

  async updateFeeDepositsById(id, depositeRecord) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/feedeposites/" + id}`,
        depositeRecord
      );
      return data;
    });
  },

  async deleteFeeDeposite(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/feedeposites/" + id}`
      );
      return data;
    });
  },

  //* *********************Fee Discount**************************** */
  async fetchFeeDiscounts() {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/discount/"}`
    );
    return data;
  },
  async fetchFeeDiscountsById(id) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL + "/api/discount/" + id}`
    );
    return data;
  },

  async createFeeDiscounts(record) {
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL + "/api/discount/"}`,
      record
    );
    return data;
  },

  async updateFeeDiscounts(id, record) {
    const instance = getAxios();
    const { data } = await instance.put(
      `${constants.API_BASE_URL + "/api/discount/" + id}`,
      record
    );
    return data;
  },

  async deleteFeeDiscounts(id, record) {
    const instance = getAxios();
    const { data } = await instance.delete(
      `${constants.API_BASE_URL + "/api/discount/" + id}`
    );
    return data;
  },

  async createFeeDiscountLineItems(record) {
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL + "/api/discount-line-items"}`,
      record
    );
    return data;
  },

  async fetchPendingAmount(record) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL +
      "/api/feedeposites/dues/" +
      record?.studentAdmissionId
      }`
    );
    return data;
  },

  // async fetchPendingAmount(record) {
  //   const instance = getAxios();
  //   const { data } = await instance.get(
  //     `${constants.API_BASE_URL + "/api/feedeposites/dues/"+record?.studentAdmissionId +"/"+record?.sessionid}`
  //   );
  //   return data;
  // },

  async fetchFeeDiscountLineItemsBySt(studentAdmissionId) {
    const instance = getAxios();
    const { data } = await instance.get(
      `${constants.API_BASE_URL +
      "/api/discount-line-items/" +
      studentAdmissionId
      }`
    );
    return data;
  },


  async updateFeeDiscountLineItems(record) {
    const instance = getAxios();
    const { data } = await instance.put(
      `${constants.API_BASE_URL + "/api/discount-line-items/"}`,
      record
    );
    return data;
  },

  //-------------------------------------------module Api's shivam shrivastava---------------------------------------------------
  //All Module
  async getAllModules(id) {
    return await this.handleUnauthorized(async () => {
      console.log(id,' id he');
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/modulemaster/getmodule/"+id}`
      );
     console.log('data=======?????---->>>', data);
      if (data.length > 0) {
        return data;
      }
    });
  },

  // create Module
  async createModule(module) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/modulemaster/create"}`,
        module
      );
      return data;
    });
  },

  //delete Module
  async deleteModule(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/modulemaster/delete/" + id}`
      );
      return data;
    });
  },
  //update Module
  async updateModule(id, module) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, module);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/modulemaster/updatebyid/" + id}`,
        module
      );
      return data;
    });
  },

  //********************* Start permission Module (Shakib,shivam) ************************/
  //-------------------------------------------Permission Api's Shakib Khan------------------
  async createPermission(permission) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/permission/create"}`,
        permission
      );
      return data;
    });
  },

  //update role
  async updatePermission(id, permission) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, permission);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/permission/updatebyid/" + id}`,
        permission
      );
      return data;
    });
  },

  //delete role
  async deletePermission(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/permission/deletepermissionbyid/" + id
        }`
      );
      return data;
    });
  },
  //-------------------------------------------Role Api's shivam shrivastava---------------------------------------------------
  //create role
  async createRole(role) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/rolemaster/create"}`,
        role
      );
      return data;
    });
  },
  //All  role
  async getAllRoles() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/rolemaster/getrole"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },
  //delete role
  async deleteRoles(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/rolemaster/deleterolebyid/" + id}`
      );
      return data;
    });
  },
  async deleteRolePermission(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/rolepermission/deletebyid/" + id}`
      );
      return data;
    });
  },

  //update role
  async updateRole(id, role) {
    return await this.handleUnauthorized(async () => {
      console.log("id,event=====>", id, role);
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/rolemaster/updatebyid/" + id}`,
        role
      );
      return data;
    });
  },

  //****************************************Role Permission Shivam shrivastava*************************************************** */

  //created by Abdul Sir 19-04-2024
  async getRolePermission(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/permissions/${id}`
      );
      console.log("getRolePermission api data == ", data);
      if (data.length > 0) {
        return data;
      }
    });
  },

  //created by Abdul Sir 19-04-2024
  async upsertRolePermissions(rolePermissions) {
    const instance = getAxios();
    const { data } = await instance.post(
      `${constants.API_BASE_URL}/api/permissions/`,
      rolePermissions
    );
    console.log("#roledata == ", data);
    return data;
  },

  async getAllRolePermission() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/rolepermission/getrole_permission`
      );
      return data;
    });
  },

  async createRolePermission(rolePermission) {
    return await this.handleUnauthorized(async () => {
      console.log("tttttttt", rolePermission);
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL}/api/rolepermission/create`,
        rolePermission
      );
      return data;
    });
  },

  async updateRolePermission(rolePermission) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL}/api/rolepermission/updaterolepermissionbyid`,
        rolePermission
      );
      return data;
    });
  },

  async getAllPermission() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/rolepermission/getallpermission`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //********************* End permission Module (Shakib,shivam) ************************/

  /*************TimeTable Module Added By Pooja Vaishnav****************/

  /*************TimeSlot Added By Pooja Vaishnav****************/

  //createTimeSlot
  async createTimeSlot(timeslot) {
    return await this.handleUnauthorized(async () => {
      console.log("timeslot@@@=>", timeslot);
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/timeslots"}`,
        timeslot
      );
      return data;
    });
  },

  //fetchTimeSlot
  async fetchTimeSlot() {
    return await this.handleUnauthorized(async () => {
      console.log("fetchTimeSlot==>");
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/timeslots/"}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //updateTimeSlot
  async updateTimeSlot(timeSlot) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/timeslots/" + timeSlot.id}`,
        timeSlot
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  //deleteTimeSlot
  async deleteTimeSlot(id) {
    console.log("deleteTimeSlot@@@@");
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/timeslots/" + id}`
      );
      return data;
    });
  },

  //createTimetable
  async createTimetable(timetable) {
    console.log("createTimetable1111", timetable);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/timetable/"}`,
        timetable
      );
      return data;
    });
  },

  async upsertTimetable(timetables) {
    console.log("timetables: ", timetables);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/timetable/"}`,
        timetables
      );
      return data;
    });
  },

  async createTimetableOnEdit(timetable) {
    console.log("createTimetableOnEdit", timetable);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/timetable/onEditInsert"}`,
        timetable
      );
      return data;
    });
  },
  //fetchTimetable
  async fetchTimetable(type) {
    console.log("fetchTimetable==>");
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/${type}`
      );
      return data;
    });
  },
  //fetchTimetable
  async fetchTimetableByTeacher(contactId, currentYearId) {
    console.log("fetchTimetable==>");
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/teacher/${contactId}/${currentYearId}`
      );
      return data;
    });
  },

  //fetchTimetable
  async fetchTimetableByTeacherId(type, contactid, currentYearId) {
    console.log("fetchTimetableByTeacherId==>", type, contactid, currentYearId);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/teacher/${type}/${contactid}/${currentYearId}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //fetchTimetable according to the class
  async fetchTimetableByClassId(classid, currentYearId) {
    console.log("fetchTimetable==>");
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/${classid}/${currentYearId}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //fetchTimetableClassId
  async fetchTimetableRecords(classId = null, sectionId = null) {
    console.log("fetchTimetable==>");
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/classid/${classId}/sectionid/${sectionId}`
      );
      //if (data.length > 0) {
      return data;
      //}
    });
  },

  //fetchTimetable according to the class
  async fetchTimetableBySectionId(sectionid, currentYearId, type) {
    console.log("fetchTimetableBySectionId==>", sectionid, currentYearId, type);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/class/${sectionid}/${currentYearId}/${type}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //fetchTimetableByIds
  async fetchTimetableByIds(timeslot) {
    console.log("fetchTimetable==>", timeslot);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/timeslot/${timeslot}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },
  //getTimeTable
  async getTimeTable(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/timetable/" + id}`
      );
      return data;
    });
  },

  //getTimeTable by using contact_id
  async getTimeTableTeacherRec(contactId) {
    console.log("getTimeTableTeacherRec==>", contactId);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/teacher/${contactId}`
      );
      return data;
    });
  },

  //deletetimetable
  async deleteTimeTable(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/timetable/" + id}`
      );

      return data;
    });
  },

  async getTimeTableRecord(classId, sectionId) {
    console.log("classId", classId);
    console.log("sectionId", sectionId);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/timetable/class/${classId}/${sectionId}`
      );
      return data;
    });
  },

  //getTimeTableForStudent
  async getTimeTableForStudent(classId, month, sessionId, studentAdd) {
    // console.log("classId", classId);
    // console.log("month", month);
    // console.log("sessionId", sessionId);
    // console.log("studentAdd", studentAdd);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL}/api/attendance_line_item/${classId}/${month}/${sessionId}/${studentAdd}`
      );
      return data;
    });
  },
  //updateTimeTable
  async updateTimeTable(timetable) {
    console.log("updateTimeTable@@=>", timetable);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/timetable/update"}`,
        timetable
      );
      return data;
    });
  },
  /*********Quick Launcher added by Prince Parmar*********/
  //Create quick launcher
  async CreateQuickLauncher(vl) {
    return await this.handleUnauthorized(async () => {
      console.log(vl, "aaya he");
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/quicklaucher"}`,
        vl
      );
      return data;
    });
  },

  // Create quick launcher
  async getAllQuickLauncher() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/quicklaucher"}`
      );
      return data;
    });
  },

  // delete quick launcher
  async deletQuickLaucher(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/quicklaucher/" + id}`
      );
      return data;
    });
  },

  // **********books api***********

  async getBooksRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getBooksRecordsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books/" + id}`
      );
      return data;
    });
  },

  async addBookRecord(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/books"}`,
        records
      );
      return data;
    });
  },

  async updateBookRecord(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/books/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteBook(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/books/" + id}`
      );

      return data;
    });
  },

  // **********author api***********

  async getAuthorsRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/authors"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createAuthor(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/authors"}`,
        records
      );
      return data;
    });
  },

  async updateAuthor(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/authors/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteAuthor(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/authors/" + id}`
      );

      return data;
    });
  },

  // **********category api***********

  async getCategoryRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/category"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createCategory(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/category"}`,
        records
      );
      return data;
    });
  },

  async updateCategory(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/category/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteCategory(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/category/" + id}`
      );

      return data;
    });
  },

  // **********publisher api***********

  async getPublishersRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/publishers"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createPublisher(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/publishers"}`,
        records
      );
      return data;
    });
  },

  async updatePublisher(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/publishers/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deletePublisher(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/publishers/" + id}`
      );

      return data;
    });
  },
  // **********language api***********

  async getLanguagesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/languages"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createLanguage(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/languages"}`,
        records
      );
      return data;
    });
  },

  async updateLanguage(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/languages/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteLanguage(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/languages/" + id}`
      );

      return data;
    });
  },

  // **********Purchases api***********

  async getPurchasesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/purchases"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getPurchasesRecordsByBookId(book_id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/purchases/" + book_id}`
      );
      return data;
    });
  },

  async createPurchase(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/purchases"}`,
        records
      );
      return data;
    });
  },

  async updatePurchase(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/purchases/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deletePurchase(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/purchases/" + id}`
      );

      return data;
    });
  },

  // **********supplier api***********
  async getSupplierRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/suppliers"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createSupplier(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/suppliers"}`,
        records
      );
      return data;
    });
  },

  async updateSupplier(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/suppliers/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteSupplier(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/suppliers/" + id}`
      );

      return data;
    });
  },

  // **********Book Issues api***********
  async getIssuesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getIsuueRecordsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues/" + id}`
      );
      return data;
    });
  },

  async getIssueRecordsByBookId(book_id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues/bookid/" + book_id}`
      );
      return data;
    });
  },

  async createIssue(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/issues"}`,
        records
      );
      return data;
    });
  },

  async updateIssue(records) {
    console.log("records", records);
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/issues/" + records.id}`,
        records
      );
      return data;
    });
  },

  // // **********Members api***********
  // async getMembersRecords() {
  //   return await this.handleUnauthorized(async () => {
  //     const instance = getAxios();
  //     const { data } = await instance.get(
  //       `${constants.API_BASE_URL + "/api/members"}`
  //     );

  //     if (data.length > 0) {
  //       return data;
  //     }
  //   });
  // },

  // **********books api***********

  async getBooksRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getBooksRecordsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books/" + id}`
      );
      return data;
    });
  },

  async getBooksRecordsBylanguageId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books/languageId/" + id}`
      );
      return data;
    });
  },

  async getBooksRecordsBycategoryId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books/categoryId/" + id}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  async getBooksRecordsByPublisherId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/books/publisherId/" + id}`
      );
      if (data.length > 0) {
        return data;
      }
    });
  },

  async addBookRecord(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/books"}`,
        records
      );
      return data;
    });
  },

  async updateBookRecord(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/books/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteBook(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/books/" + id}`
      );

      return data;
    });
  },

  // **********author api***********

  async getAuthorsRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/authors"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createAuthor(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/authors"}`,
        records
      );
      return data;
    });
  },

  async updateAuthor(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/authors/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteAuthor(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/authors/" + id}`
      );

      return data;
    });
  },

  // Add by Abhishek 07-05-2024: To fetch Author Details
  async getAuthorById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/authors/" + id}`
      );
      return data;
    });
  },

  // Add by Abhishek 07-05-2024: To fetch Author Book's Details
  async getBooksByAuthorId(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/authors/books/" + id}`
      );
      return data;
    });
  },

  // **********category api***********

  async getCategoryRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/category"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createCategory(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/category"}`,
        records
      );
      return data;
    });
  },

  async updateCategory(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/category/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteCategory(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/category/" + id}`
      );

      return data;
    });
  },

  // **********publisher api***********

  async getPublishersRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/publishers"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createPublisher(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/publishers"}`,
        records
      );
      return data;
    });
  },

  async updatePublisher(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/publishers/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deletePublisher(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/publishers/" + id}`
      );

      return data;
    });
  },
  // **********language api***********

  async getLanguagesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/languages"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async createLanguage(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/languages"}`,
        records
      );
      return data;
    });
  },

  async updateLanguage(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/languages/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteLanguage(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/languages/" + id}`
      );

      return data;
    });
  },

  // **********Purchases api***********

  async getPurchasesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/purchases"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getPurchasesRecordsByBookId(book_id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/purchases/" + book_id}`
      );
      return data;
    });
  },


  async getPurchasesRecordsBysupplierId(supplierId) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/purchases/supplierId/" + supplierId}`
      );
      return data;
    });
  },

  async createPurchase(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/purchases"}`,
        records
      );
      return data;
    });
  },

  async updatePurchase(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/purchases/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deletePurchase(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/purchases/" + id}`
      );

      return data;
    });
  },

  // **********supplier api***********
  async getSupplierRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/suppliers"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getSupplierRecordsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/suppliers/" + id}`
      );
      return data;
    });
  },

  async createSupplier(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/suppliers"}`,
        records
      );
      return data;
    });
  },

  async updateSupplier(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/suppliers/" + records.id}`,
        records
      );
      return data;
    });
  },

  async deleteSupplier(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.delete(
        `${constants.API_BASE_URL + "/api/suppliers/" + id}`
      );

      return data;
    });
  },

  // **********Book Issues api***********
  async getIssuesRecords() {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues"}`
      );

      if (data.length > 0) {
        return data;
      }
    });
  },

  async getIsuueRecordsById(id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues/" + id}`
      );
      return data;
    });
  },

  async getIssueRecordsByBookId(book_id) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.get(
        `${constants.API_BASE_URL + "/api/issues/bookid/" + book_id}`
      );
      return data;
     
    });
  },

  async createIssue(records) {
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.post(
        `${constants.API_BASE_URL + "/api/issues"}`,
        records
      );
      return data;
    });
  },

  async updateIssue(records) {
    console.log('records' , records)
    return await this.handleUnauthorized(async () => {
      const instance = getAxios();
      const { data } = await instance.put(
        `${constants.API_BASE_URL + "/api/issues/" + records.id}`,
        records
      );
      return data;
    });
  },




  ///////////////////////
  /*   End */
};

export default schoolApi;
