import axios from "axios";

export const getToken = () => {
    let token = sessionStorage.getItem("token");
    return token;
  };

  export const getAxios = () => {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    };
    return axios.create({ headers });
  };

  export const getAxiosMultipart = () => {
    const token = getToken();
    const headers = {Authorization: `${token}`};
    return axios.create({ headers });
  };
  export function convertTo12HourFormat(time24Hour) {
    const [hours, minutes] = time24Hour.split(":").map(Number); // Parse hours and minutes as integers
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
  }