import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  RestaurantMenu,
  ExitToApp,
  Info,
  DateRange,
  LocalActivity,
  LocalBar,
  ThumbsUpDown,
  Close,
} from "@mui/icons-material";
import { Fade, Backdrop, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { actionTypes } from "../../reducer";

import { useStateValue } from "../../StateProvider";
import LanguageSwitcher from "../../components/UI/LanguageSwitcher/LanguageSwitcher";

import "./MobileSidebarComponent.css";
import IconButton from "../../components/UI/Buttons/IconButton";
import RateAppForm from "../../components/UI/RateApp/RateForm";
import reactDom from "react-dom";

import { rateTheApp } from "../../api_requests/user_requests";
import { imageGetter } from "../../Helpers/Const/constants";
import ErrorComponent from "../../components/Error/Error";
import { removeUpperAccents } from "../../Helpers/Functions/functions";

const MobileSidebarComponent = (props) => {
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [successRate, setSuccessRate] = useState(false);
  const [logo, setLogo] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const menuClickHandler = () => {
    props.handleOpenMenu();
  };

  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      try {
        const { myArr: imageLogo } = await imageGetter(
          [{ image: "logo.png" }],
          "Logo/",
          true
        );
        // ---- Error Handler ---- //
        if (imageLogo === undefined || imageLogo === null) {
          let tmp_error = "Login/useEffect => Avatar imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setLogo(imageLogo[0].image);
        // document.body.style.overflow = "scroll";
      } catch (err) {
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const logoutHandler = () => {
    localStorage.clear();

    dispatch({
      type: actionTypes.REMOVE_JWT_TOKEN,
      authenticated: false,
      token: "",
      refreshToken: "",
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessRateClose = () => {
    setSuccessRate(false);
  };

  const handleRateSubmit = async (e, name, rating, content) => {
    e.preventDefault();
    await rateTheApp({ name, rating, content }, state.token);
    setSuccessRate(true);
    setOpen(false);
  };

  const rateModal = reactDom.createPortal(
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
        <div className="modalRate-container">
          <RateAppForm
            handleRateSubmit={handleRateSubmit}
            close={handleClose}
          />
        </div>
      </Fade>
    </Modal>,
    document.getElementById("user-rate-app-root")
  );

  const successRateModal = reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={successRate}
      onClose={handleSuccessRateClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={successRate}>
        <div className="modalRate-container p-4">
          <h2 className="text-center mb-4">{t("thanks_for_the_rating")}</h2>
          <IconButton
            text={removeUpperAccents(t("close"))}
            icon={<Close className="mr-2" />}
            color="warning"
            variant="contained"
            onClick={handleSuccessRateClose}
          />
        </div>
      </Fade>
    </Modal>,
    document.getElementById("user-rate-app-root")
  );

  return (
    <>
      {error && (
        <ErrorComponent
          errorMessage={errorMessage}
          onClick={() => setError(false)}
        />
      )}
      <div className="mobile__left__sidebar">
        <div>
          <div className="menu-img">
            <div>
              <Link to="/" onClick={menuClickHandler}>
                <img src={logo} alt="logo" />
              </Link>
              <div className="circular-close-button" onClick={menuClickHandler}>
                <Close />
              </div>
            </div>
          </div>
          <ul className="mobile__sidebar__list">
            <li>
              <NavLink
                exact
                to="/"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <Home />
                <h5> {t("sidebar_home")} </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/services"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <LocalActivity />
                <h5> {t("services")} </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/info"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <Info />
                <h5> {t("sidebar_info")} </h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/food"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <RestaurantMenu />
                <h5>{t("sidebar_food")}</h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/drinks"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <LocalBar />
                <h5>{t("sidebar_drinks")}</h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/events"
                className="mobile__navigation__link"
                onClick={menuClickHandler}
              >
                <DateRange />
                <h5>{t("sidebar_events")}</h5>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/"
                onClick={logoutHandler}
                className="mobile__navigation__link"
              >
                <ExitToApp />
                <h5>{t("logout")}</h5>
              </NavLink>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>

        {open && rateModal}
        {successRate && successRateModal}
        <div className="color-white d-flex justify-content-evenly align-items-center flex-wrap">
          <IconButton
            text={removeUpperAccents(t("rate_the_app"))}
            icon={<ThumbsUpDown className="mr-2" />}
            color="warning"
            variant="contained"
            className="w-auto mx-3"
            onClick={handleOpen}
          />
          <p className="my-3">© AirFlix {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
};

export default MobileSidebarComponent;
