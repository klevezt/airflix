import React, { useState } from "react";
import { Fade, Backdrop, Modal } from "@mui/material";
import reactDom from "react-dom";
import { useStateValue } from "../../StateProvider";

import "./Error.css";

const Error = (props) => {
  const [open, setOpen] = useState(true);
  const [state, dispatch] = useStateValue();

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(props.errorMessage);
    fetch(process.env.REACT_APP_SERVER_URL + "/error/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": state.token,
      },
      body: JSON.stringify({
        content: props.errorMessage,
      }),
    })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="error-wrapper">
          {props.errorMessage}
          <form onSubmit={submitHandler}>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </Fade>
    </Modal>,
    document.getElementById("error-root")
  );
};

export default Error;
