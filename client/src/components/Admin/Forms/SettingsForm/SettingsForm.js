import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { Visibility } from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./SettingsForm.css";

const SettingsForm = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [updateUsername, setUpdateUsername] = useState(props.user.username);
  const [updatePassword, setUpdatePassword] = useState(props.user.password);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleUpdateUsername = (e) => {
    setUpdateUsername(e.target.value);
  };
  const handleUpdatePassword = (e) => {
    setUpdatePassword(e.target.value);
  };
  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) =>
        props.handleUpdateUserInfo(e, updateUsername, updatePassword)
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            history.goBack();
          }}
          text={t("back")}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_profile")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="uname" className="col-sm-2 col-form-label">
            {t("username")}
          </label>
          <div className="col-sm-10">
            <input
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
          <label htmlFor="psw" className="col-sm-2 col-form-label">
            {t("password")}
          </label>
          <div className="col-sm-10 input-password-wrapper">
            <input
              type={passwordShown ? "text" : "password"}
              className="form-control mt-2 mb-2"
              name="psw"
              id="psw"
              value={updatePassword}
              onChange={handleUpdatePassword}  
              autoComplete="off"
            />
            <div className="toggle-visibility-wrapper">
              <IconButton
                className=""
                onClick={() => {
                  togglePassword();
                }}
                icon={!passwordShown ? <Visibility /> : <VisibilityOffIcon />}
                color="warning"
                variant="contained"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary-theme">
          {t("update")}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;
