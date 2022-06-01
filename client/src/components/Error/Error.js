import React, { useState } from "react";
import { Fade, Backdrop, Modal } from "@mui/material";
import reactDom from "react-dom";
import { useStateValue } from "../../StateProvider";
import { useTranslation } from "react-i18next";
import IconButton from "../UI/Buttons/IconButton";

import "./Error.css";

const Error = (props) => {
  const [open, setOpen] = useState(true);
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
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
      .then((data) => {
        window.location.reload(false);
        console.log(data);
      })
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
          <p>{t("general_error")}</p>
          <form className="general-form">
            <IconButton
              className="btn error-btn"
              onClick={submitHandler}
              text="Ανανεώστε τη σελίδα"
              variant="contained"
            />
          </form>
        </div>
      </Fade>
    </Modal>,
    document.getElementById("error-root")
  );
};

export default Error;
