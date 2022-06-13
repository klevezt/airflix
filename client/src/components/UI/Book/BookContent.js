import React, { useState } from "react";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { Api } from "@mui/icons-material";
import { Fade, Backdrop, Modal } from "@mui/material";
import Multistep from "../MuiltiStepForm/Multistep";
import { useTranslation } from "react-i18next";

import "./BookContent.css";
import reactDom from "react-dom";

function BookContent(props) {
  const { t } = useTranslation();
  const [openQuestions, setOpenQuestions] = useState(false);

  const handleOpen = () => {
    setOpenQuestions(true);
  };

  const handleClose = () => {
    setOpenQuestions(false);
  };
  const questionsModal = reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={openQuestions}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openQuestions}>
        <div className="modalDrinkSearch-container">
          <div className="row mb-3">
            <h3>Βρείτε το ποτό που ταιριάζει στις προτιμήσεις σας</h3>
          </div>
          <Multistep />
        </div>
      </Fade>
    </Modal>,
    document.getElementById("user-drink-questions-root")
  );

  return (
    <div className="d-flex flex-direction-column flex-wrap w-100">
      <div className="page-content">
        {props.loading && <LoadingSpinner />}
        {!props.loading && (
          <>
            <h1>{t(props.contentHeadline)}</h1>
            <img
              className="w-100 page-content-calligrafy-line"
              src="https://raw.githubusercontent.com/klevezt/cudia-images-server/5a69bc8d02aa4c840eb7f7aec6f3601664e61f9b/svg/custom.svg"
              alt="book-caligrafic"
            />
            <div className="page-content-listing">{props.details}</div>
          </>
        )}
        {/* {props.contentHeadline === "Cocktail" && (
        <>
          {openQuestions && questionsModal}
          <div className="drink-questions">
            <Api onClick={handleOpen} />
          </div>
        </>
      )} */}
      </div>
    </div>
  );
}

export default BookContent;
