import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, ExitToApp } from "@mui/icons-material";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

import "./HeaderComponent.css";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../components/Error/Error";
import { imageGetter } from "../../Helpers/Const/constants";

const Header = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useStateValue();
  
  const [logo, setLogo] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <>
      {error && (
        <ErrorComponent
          errorMessage={errorMessage}
          onClick={() => setError(false)}
        />
      )}
      <div className="header">
        {state.authenticated && (
          <>
            <Link to="/">
              <img src={logo} alt="white-logo" />
            </Link>
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
    </>
  );
};

export default Header;
