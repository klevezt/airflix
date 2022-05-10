import Button from "@mui/material/Button";
import React from "react";

const PrimaryButton = (props) => {
  return (
    <Button
      variant={props.show ? "contained" : "outlined"}
      color="primary"
      className={`button__addUser ${
        !props.className ? " mb-3" : props.className
      }`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.icon}
      {props.text}
    </Button>
  );
};

export default PrimaryButton;
