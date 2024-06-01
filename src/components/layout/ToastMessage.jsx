import React, { useEffect, useState } from "react";

import "./App.css";
import "./resources/css/Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PubSub from "pubsub-js";
import { Toast, ToastContainer } from "react-bootstrap";
import jwt_decode from "jwt-decode";
const ToastMessage = () =>{
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
        //dispatch(fetchAccounts());
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
 );
};