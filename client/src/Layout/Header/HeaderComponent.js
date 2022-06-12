import React from "react";
import { Link } from "react-router-dom";
import { Settings, ExitToApp } from "@mui/icons-material";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

import "./HeaderComponent.css";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useStateValue();

  const logoutHandler = () => {
    localStorage.clear();

    dispatch({
      type: actionTypes.REMOVE_JWT_TOKEN,
      authenticated: false,
      token: "",
    });
  };

  return (
    <div className="header">
      {state.authenticated && (
        <>
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Logo/logo.png`}
            alt="white-logo"
          />
          {state.user.role === "Customer" && (
            <div className="header-user-text ">
              <h3>{t("hotel_logo")}</h3>
              <p className="m-0">
                {t("room_number")}: {state.user.room_number}
                <br />
                {state.user.room_type}
              </p>
            </div>
          )}
        </>
      )}

      {state.authenticated && state.user.role !== "Customer" && (
        <div className="header__right">
          <ul>
            <li>
              <Link to="/settings">
                <Settings />
                <h5>{t("settings")}</h5>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={logoutHandler}>
                <ExitToApp />
                <h5>{t("logout")}</h5>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
