// import { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
// const AuthContext = createContext();
// export const AuthProvider = ({ children, accessToken }) => {
//   const [auth, setAuth] = useState({});
//   console.log(accessToken, "wait");

//   useEffect(() => {
//     if (accessToken) {
//       try {
//         if (accessToken) {
//           const decodedToken = jwt_decode(accessToken);
//           const permissions = decodedToken.permissions;

//           setAuth({
//             accessToken,
//             permissions,
//           });
//         }
//       } catch (error) {
//         console.error("Error decoding access token:", error);
//       }
//     }
//   }, [accessToken]);

//   return (
//     <AuthContext.Provider value={{ auth, accessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children, accessToken }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwt_decode(accessToken);
        const permissions = decodedToken.permissions;

        setAuth({
          accessToken,
          permissions,
        });
      } catch (error) {
        console.error("Error decoding access token:", error);
        setAuth({});
      }
    } else {
      setAuth({});
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
