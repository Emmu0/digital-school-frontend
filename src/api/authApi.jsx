// import { useState } from "react";
// import * as constants from "../constants/CONSTANT";
// import jwtDecode from "jwt-decode";
// const authApi = {
//   async login(email, password) {
//     let response = await fetch(constants.API_BASE_URL + "/api/auth/login", {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email,
//         password: password,
//       }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       sessionStorage.setItem("token", result.authToken);
//       //localStorage.setItem("username", result.username);
//       //const arrayPermissions = [{ name: 'MODIFY_ALL' }, { name: 'VIEW_PRODUCT' }, { name: 'VIEW_CONTACT' }, { name: 'VIEW_ORDER' }, { name: 'VIEW_LEAD' }]; // result.permissions
//       /*  var string = result.permissions.map(function (obj) {
//                 return obj.name;
//             }).join(';')
//             sessionStorage.setItem("permissions", string); */
//     }
//     return result;
//   },

//   async fetchMyImage() {
//     //console.log("calling my image ");
//     const token = sessionStorage.getItem("token");
//     console.log('hey token===>', token);
//     let response = await fetch(constants.API_BASE_URL + "/api/auth/myimage", {
//       method: "GET",
//       //mode: "cors",

//       headers: {
//         Authorization: token,
//       },
//     });
//     //console.log('response:', response);
//     if (response.status === 200) {
//       const fileBody = await response.blob();
//       return fileBody;
//     } else {
//       return null;
//     }
//   },

//   logout() {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("permissions");
//     window.location.href = "/login";
//   },
//   companyDetail() {
//     let session = sessionStorage.getItem("token")
//     session = jwtDecode(sessionStorage.getItem("token"))

//     return session
//   }
// };

// export default authApi;
import * as constants from "../constants/CONSTANT";
import jwtDecode from "jwt-decode";

const authApi = {
  async login(email, password) {
    try {
      let response = await fetch(`${constants.API_BASE_URL}/api/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem("token", result.authToken);

      }
      return result;
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, error: error.message };
    }
  },

  async fetchMyImage() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage");
      }

      let response = await fetch(`${constants.API_BASE_URL}/api/auth/myimage`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const fileBody = await response.blob();
        return fileBody;
      } else {
        throw new Error("Failed to fetch image");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  },

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("permissions");
    window.location.href = "/login";
  },

  companyDetail() {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in session storage");
      }
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
};

export default authApi;
