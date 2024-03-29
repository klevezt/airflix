import React, { useEffect, useRef, useState } from "react";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import IconButton from "../UI/Buttons/IconButton";
import ButtonLoadingSpinner from "../UI/Spinners/ButtonLoadingSpinner";
import { authenticateUserWithToken } from "../../api_requests/auth_requests";
import ErrorComponent from "../Error/Error";
import { useTranslation } from "react-i18next";

import "./LoginForm.css";
import { imageGetter } from "../../Helpers/Const/constants";
import { removeUpperAccents } from "../../Helpers/Functions/functions";

const LoginForm = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isButtomSpinnerLoading, setIsButtonSpinnerLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorButtonText, setErrorButtonText] = useState("");

  const [loginAvatar, setLoginAvatar] = useState("");

  const [state, dispatch] = useStateValue();

  const hiddenRef = useRef("");

  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      try {
        const { myArr: avatar } = await imageGetter(
          [{ image: "avatar.png" }],
          "General/",
          true
        );
        // ---- Error Handler ---- //
        if (avatar === undefined || avatar === null) {
          let tmp_error = "Login/useEffect => Avatar imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setLoginAvatar(avatar[0].image);
      } catch (err) {
        setError(true);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const authenticateUser = (uname, psw) => {
    setIsButtonSpinnerLoading(true);

    authenticateUserWithToken(uname, psw)
      .then(({ user, accessToken, refreshToken }) => {
        setIsButtonSpinnerLoading(false);

        // ---- Error Handler ---- //
        if (!user) {
          setError(true);
          setErrorMessage("Δεν είναι σωστά τα στοιχεία εισόδου");
          setErrorButtonText("Προσπαθήστε ξανά!!!");
          throw new Error("Δεν είναι σωστά τα στοιχεία εισόδου");
        }
        localStorage.setItem("token", accessToken);
        localStorage.setItem("rToken", refreshToken);
        dispatch({
          type: actionTypes.SET_USER,
          user: user,
          authenticated: true,
          token: accessToken,
          rToken: refreshToken,
        });
      })
      .catch((err) => {
        // console.log(err);
        setError(true);
        setErrorMessage(
          "Υπάρχει πρόβλημα κατά την σύνδεση. Δοκιμάστε ξανά σε λίγο!"
        );
        setErrorButtonText("Προσπαθήστε ξανά!!!");
        setIsButtonSpinnerLoading(false);
      });
  };

  const loginFormSubmitHandler = (e) => {
    e.preventDefault();
    setError(false);
    if (username === "") setUsernameError(true);
    if (password === "") setPasswordError(true);
    if (username !== "" && password !== "" && hiddenRef.current.value === "") {
      authenticateUser(username, password);
    }
  };

  const usernameInputHandler = (e) => {
    if (usernameError) setUsernameError(false);
    setUsername(e.target.value);
  };

  const passwordInputHandler = (e) => {
    if (passwordError) setPasswordError(false);
    setPassword(e.target.value);
  };

  return (
    <>
      {error && (
        <ErrorComponent
          errorMessage={errorMessage}
          errorButtonText={errorButtonText}
          onClick={() => setError(false)}
        />
      )}
      <div className="container__form">
        <form
          method="post"
          onSubmit={(e) => loginFormSubmitHandler(e)}
          className="general-form login-form"
        >
          <div className="form-header">
            <img src={loginAvatar} alt="login_avatar" />
            <h2 className="form-headline">ΕΙΣΟΔΟΣ</h2>
          </div>
          <div className="container">
            <input type="text" className="hide" ref={hiddenRef} />
            <div className="row mb-3">
              <label htmlFor="uname" className="col-sm-3 col-form-label">
                {t("username")}
              </label>
              <div className="col-sm-9">
                <input
                  className={`form-control form-control-sm ${
                    usernameError ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="Enter Username"
                  name="uname"
                  id="uname"
                  value={username}
                  onChange={usernameInputHandler}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="psw" className="col-sm-3 col-form-label">
                {t("password")}
              </label>
              <div className="col-sm-9">
                <input
                  className={`form-control form-control-sm ${
                    passwordError ? "input-error" : ""
                  }`}
                  type="password"
                  placeholder="Enter Password"
                  name="psw"
                  value={password}
                  onChange={passwordInputHandler}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button type="submit" className=" d-none"></button>
            {!isButtomSpinnerLoading ? (
              <IconButton
                className="btn btn-primary-theme submit-btn"
                onClick={(e) => {
                  loginFormSubmitHandler(e);
                }}
                text={removeUpperAccents(t("Είσοδος"))}
                variant="contained"
              />
            ) : (
              <IconButton
                className="btn btn-primary-theme submit-btn"
                onClick={(e) => {
                  loginFormSubmitHandler(e);
                }}
                icon={<ButtonLoadingSpinner />}
                color="warning"
                variant="contained"
              />
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
