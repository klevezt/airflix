import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "../../../UI/Buttons/IconButton";
import { Visibility } from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./SettingsForm.css";
import bcrypt from "bcryptjs";

const SettingsForm = (props) => {
  const { t } = useTranslation();

  const [updateUsername, setUpdateUsername] = useState(props.user.username);
  const [passwordShown, setPasswordShown] = useState(false);

  const [oldPassword] = useState(props.user.password);
  const newPasswordRef = useRef("");
  const newPasswordConfirmRef = useRef("");
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleUpdateUsername = (e) => {
    setUpdateUsername(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setPasswordError(false);
    setConfirmPasswordError(false);
  };
  const handleNewPasswordConfirmChange = (e) => {
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown((p) => !p);
  };
  const toggleConfirmPassword = () => {
    setPasswordConfirmShown((p) => !p);
  };

  const handleChangePassword = () => {
    setPasswordChange((s) => !s);
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) => {
        if (
          passwordChange &&
          !passwordError &&
          !confirmPasswordError &&
          newPasswordRef.current.value ===
            newPasswordConfirmRef.current.value &&
          newPasswordRef.current.value !== "" &&
          newPasswordConfirmRef.current.value !== ""
        ) {
          props.handleUpdateUserInfo(
            e,
            updateUsername,
            newPasswordRef.current.value === "" ||
              newPasswordRef.current.value === undefined
              ? oldPassword
              : bcrypt.hashSync(
                  newPasswordRef.current.value,
                  bcrypt.genSaltSync()
                )
          );
        } else {
          e.preventDefault();
          setPasswordError(true);
          setConfirmPasswordError(true);
        }
      }}
    >
      <div className="form-header">
        <h2 className="form-headline">{t("edit_profile")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label
            htmlFor="uname"
            className="col-12 col-sm-5 col-md-4 col-form-label"
          >
            {t("username")}
          </label>
          <div className="col-12 col-sm-7 col-md-8">
            <input
              className="form-control form-control-sm"
              type="text"
              name="uname"
              id="uname"
              value={updateUsername}
              onChange={handleUpdateUsername}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label
            htmlFor="changePSW"
            className="col-10 col-sm-5 col-md-4 col-form-label"
          >
            {t("Αλλαγή Κωδικού")}
          </label>
          <div className="col-1 col-md-8 align-self-center">
            <input
              onChange={handleChangePassword}
              className="form-check-input"
              type="checkbox"
              id="changePSW"
              checked={passwordChange}
              autoComplete="off"
            />
          </div>
        </div>
        {passwordChange && (
          <>
            <div className="row mb-3">
              <label htmlFor="psw" className="col-sm-4 col-form-label">
                {t("Νέος Κωδικός")}
              </label>
              <div className="col-sm-8 input-password-wrapper">
                <input
                  type={passwordShown ? "text" : "password"}
                  className={
                    passwordError
                      ? "form-control form-control-sm mt-2 mb-2 input-error"
                      : "form-control form-control-sm mt-2 mb-2 "
                  }
                  name="psw"
                  id="psw"
                  defaultValue=""
                  ref={newPasswordRef}
                  onChange={handleNewPasswordChange}
                  autoComplete="off"
                />
                <div className="toggle-visibility-wrapper">
                  <IconButton
                    onClick={togglePassword}
                    icon={
                      !passwordShown ? <Visibility /> : <VisibilityOffIcon />
                    }
                    variant="contained"
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="psw_confirm" className="col-sm-4 col-form-label">
                {t("Επιβεβαίωση Νέου Κωδικού")}
              </label>
              <div className="col-sm-8 input-password-wrapper">
                <input
                  type={passwordConfirmShown ? "text" : "password"}
                  className={
                    confirmPasswordError
                      ? "form-control form-control-sm mt-2 mb-2 input-error"
                      : "form-control form-control-sm mt-2 mb-2 "
                  }
                  name="psw_confirm"
                  id="psw_confirm"
                  defaultValue=""
                  ref={newPasswordConfirmRef}
                  onChange={handleNewPasswordConfirmChange}
                  autoComplete="off"
                />
                <div className="toggle-visibility-wrapper">
                  <IconButton
                    className=""
                    onClick={toggleConfirmPassword}
                    icon={
                      !passwordConfirmShown ? (
                        <Visibility />
                      ) : (
                        <VisibilityOffIcon />
                      )
                    }
                    color="warning"
                    variant="contained"
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="row ">
          <div className="col-12 col-sm-4 offset-0 offset-sm-5 offset-md-4 ">
            <button type="submit" className="btn btn-primary-theme ">
              {t("update")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
