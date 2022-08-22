import React, { useState } from "react";
import { Fade, Backdrop, Modal } from "@mui/material";
import reactDom from "react-dom";
import { useStateValue } from "../../StateProvider";
import { useTranslation } from "react-i18next";
import IconButton from "../UI/Buttons/IconButton";
import { ExitToApp } from "@mui/icons-material";

import "./Error.css";
import { actionTypes } from "../../reducer";
import { removeUpperAccents } from "../../Helpers/Functions/functions";

const Error = (props) => {
  const [open] = useState(true);
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();

  // const [networkError, setNetworkError] = useState(false);
  // const [networkErrorMessage, setNetworkErrorMessage] = useState();

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
      .then(() => {
        if (props.onClick) return props.onClick();

        localStorage.clear();
        dispatch({
          type: actionTypes.REMOVE_JWT_TOKEN,
          authenticated: false,
          token: "",
          refreshToken: "",
        });
      })
      .catch((err) => err);
  };

  const message = props.errorMessage ? props.errorMessage : t("general_error");
  const btnText = props.errorButtonText
    ? props.errorButtonText
    : t("logout");

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
          <p>{message}</p>
          <form className="general-form">
            <IconButton
              text={removeUpperAccents(btnText)}
              icon={<ExitToApp className="mr-2" />}
              variant="contained"
              className="btn error-btn"
              onClick={submitHandler}
            />
          </form>
        </div>
      </Fade>
    </Modal>,
    document.getElementById("error-root")
  );
};

export default Error;
