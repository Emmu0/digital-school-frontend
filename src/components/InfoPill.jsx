import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InfoPill = ({left, right}) => {
 

  return (
    <div className="mx-3 mt-4">
      <span
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          padding: ".5rem .0rem .5rem 1rem",
          backgroundColor: "rgb(42 122 62)",
          borderRadius: ".5rem",
          color: "#fff"
        }}
      >
        {left}{" "}
        <span
          style={{
            color: "#fff",
            paddingTop: ".5rem",
            paddingBottom: ".5rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            fontSize: "1rem",
            fontWeight: "bold",
            marginLeft: "1rem",
            backgroundColor: "rgb(19 41 59)",
            borderTopRightRadius: ".5rem",
            borderBottomRightRadius: ".5rem",
          }}
        >
          {right}
        </span>
      </span>
    </div>
  );
};

export default InfoPill;