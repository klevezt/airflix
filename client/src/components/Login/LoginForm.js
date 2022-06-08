import React, { useEffect, useState } from "react";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import IconButton from "../UI/Buttons/IconButton";
import ButtonLoadingSpinner from "../UI/Spinners/ButtonLoadingSpinner";
import { authenticateUserWithToken } from "../../api_requests/auth_requests";
import ErrorComponent from "../Error/Error";
import { useTranslation } from "react-i18next";

import "./LoginForm.css";

const LoginForm = () => {
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  // const [submitError, setSubmitError] = useState(false);
  const [isButtomSpinnerLoading, setIsButtonSpinnerLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorButtonText, setErrorButtonText] = useState("");

  const [state, dispatch] = useStateValue();

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
        console.log(err);
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
    if (username !== "" && password !== "") {
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
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/Images/Avatar/img_avatar.png`}
              alt="login_avatar"
            />
            <h2 className="form-headline">ΕΙΣΟΔΟΣ</h2>
          </div>
          <div className="container">
            <div className="row mb-3">
              <label htmlFor="uname" className="col-sm-2 col-form-label">
                {t("username")}
              </label>
              <div className="col-sm-10">
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
              <label htmlFor="psw" className="col-sm-2 col-form-label">
                Password
              </label>
              <div className="col-sm-10">
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
                text="Είσοδος"
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
          {/* {submitError && (
              <div className="row mb-3 text-center">
                <span style={{ color: "red" }}>
                  Δεν είναι σωστά τα στοιχεία εισόδου
                </span>
              </div>
            )} */}
        </form>
      </div>
    </>
  );
};

export default LoginForm;
