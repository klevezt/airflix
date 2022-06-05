import React, { useState } from "react";
import { Fade, Backdrop, Modal } from "@mui/material";
import reactDom from "react-dom";
import { useStateValue } from "../../StateProvider";
import { useTranslation } from "react-i18next";
import IconButton from "../UI/Buttons/IconButton";
import { ExitToApp } from "@mui/icons-material";

import "./Error.css";

const Error = (props) => {
  const [open, setOpen] = useState(true);
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();


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
      })
      .catch((err) => console.log(err));
  };

  return reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="error-wrapper">
          {!props.loggout ? (
            <p>{t("general_error")}</p>
          ) : (
            <p>{props.errorMessage}</p>
          )}

          <form className="general-form">
            {!props.loggout ? (
              <IconButton
                className="btn error-btn"
                onClick={submitHandler}
                text="Ανανεώστε τη σελίδα"
                variant="contained"
              />
            ) : (
              <IconButton
                text={t("exit")}
                icon={<ExitToApp className="mr-2" />}
                variant="contained"
                className="btn error-btn"
                onClick={props.handleClose}
              />
            )}
          </form>
        </div>
      </Fade>
    </Modal>,
    document.getElementById("error-root")
  );
};

export default Error;
