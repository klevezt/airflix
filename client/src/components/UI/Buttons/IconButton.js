import React from "react";
import Button from "@mui/material/Button";

const IconButton = (props) => {
  return (
    <Button
      onClick={props.onClick}
      size={props.size}
      color="primary"
      {...props}
    >
      {props.icon}
      <span>{props.text}</span>
    </Button>
  );
};

export default IconButton;
