// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../Auth/AuthProvider";
// import jwt_decode from "jwt-decode";
// import React from "react";

// const Auth = ({ allowedRoles }) => {
//   const { auth, setAuth, accessToken } = useContext(AuthContext);
//   const location = useLocation();
//   let permissionArray = [];
//   if (accessToken) {
//     const decodedToken = jwt_decode(accessToken);
//     const permissions = decodedToken.permissions;

//     console.log(decodedToken);
//     permissions &&
//       permissions.map((vl) => {
//         permissionArray.push(vl.name);
//       });
//   }

//   console.log(allowedRoles, permissionArray);
//   return allowedRoles.find((role) => permissionArray.includes(role)) ? (
//     <Outlet />
//   ) : (
//     <Navigate to={"/no-access"} state={{ from: location }} replace />
//   );
// };

// export default Auth;
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Auth/AuthProvider";
import jwt_decode from "jwt-decode";
import React from "react";

const Auth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const [permissionArray, setPermissionArray] = useState([]);

  useEffect(() => {
    if (auth.accessToken) {
      try {
        const decodedToken = jwt_decode(auth.accessToken);
        const permissions = decodedToken.permissions || [];
        setPermissionArray(permissions.map(permission => permission.name));
      } catch (error) {
        console.error("Error decoding access token:", error);
      }
    }
  }, [auth.accessToken]);

  const hasAccess = allowedRoles.some(role => permissionArray.includes(role));

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate to="/no-access" state={{ from: location }} replace />
  );
};

export default Auth;
