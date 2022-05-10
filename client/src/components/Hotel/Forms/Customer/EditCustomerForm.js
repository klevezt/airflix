import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import IconButton from "../../../UI/Buttons/IconButton";
import { Visibility } from "@mui/icons-material";
import { roomTypes } from "../../../../Helpers/Const/constants";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import bcrypt from "bcryptjs";

const EditCustomerForm = (props) => {
  const { t } = useTranslation();

  const [editUsername, setEditUsername] = useState(props.editUsername);
  const [editPassword] = useState(props.editPassword);
  const [editRoom, setEditRoom] = useState(props.editRoom);
  const [editRoomType, setEditRoomType] = useState(props.editRoomType);

  const [usernameChanged, setUsernameChanged] = useState(false);
  const [roomChanged, setRoomChanged] = useState(false);
  const [roomTypeChanged, setRoomTypeChanged] = useState(false);

  const newPasswordRef = useRef("");
  const newPasswordConfirmRef = useRef("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleNewPasswordChange = (e) => {
    setPasswordError(false);
    setConfirmPasswordError(false);
  };
  const handleNewPasswordConfirmChange = (e) => {
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  const handleEditUsernameInput = (e) => {
    setUsernameChanged(true);
    setEditUsername(e.target.value);
  };
  const handleEditRoomInput = (e) => {
    setRoomChanged(true);
    setEditRoom(e.target.value);
  };
  const handleEditRoomTypeInput = (e) => {
    setRoomTypeChanged(true);
    setEditRoomType(e.target.value);
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
          props.handleSubmitEditCustomer(
            e,
            editUsername,
            bcrypt.hashSync(newPasswordRef.current.value, bcrypt.genSaltSync()),
            editRoom,
            editRoomType
          );
        } else if (roomChanged || usernameChanged || roomTypeChanged) {
          props.handleSubmitEditCustomer(
            e,
            editUsername,
            editPassword,
            editRoom,
            editRoomType
          );
        } else {
          e.preventDefault();
          setPasswordError(true);
          setConfirmPasswordError(true);
        }
      }}
    >
      <div className="form-header">
        <h2 className="form-headline">{t("Νέος Πελάτης")}</h2>
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="edit_uname" className="col-sm-4 col-form-label">
            Username
          </label>
          <div className="col-sm-8">
            <input
              className="form-control form-control-sm"
              type="text"
              name="edit_uname"
              id="edit_uname"
              value={editUsername}
              onChange={handleEditUsernameInput}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="edit_room" className="col-sm-4 col-form-label">
            Αριθμός Δωματίου
          </label>
          <div className="col-sm-8">
            <input
              className="form-control form-control-sm"
              type="text"
              name="edit_room"
              id="edit_room"
              value={editRoom}
              onChange={handleEditRoomInput}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="edit_room_type" className="col-sm-4 col-form-label">
            Τύπος Δωματίου
          </label>
          <div className="col-sm-8">
            <select
              className="form-select form-select-lg mt-2 mb-3"
              name="edit_room_type"
              id="edit_room_type"
              defaultValue={editRoomType}
              onChange={handleEditRoomTypeInput}
              required
            >
              <option value="">-</option>
              {roomTypes.map((type, i) => {
                return (
                  <option value={type} key={i} defaultValue={type}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="changePSW" className="col-sm-4 col-form-label">
            {t("Αλλαγή Κωδικού")}
          </label>
          <div className="col-sm-8 align-self-center">
            <input
              onChange={handleChangePassword}
              className="form-check-input "
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
                      ? "form-control mt-2 mb-2 input-error"
                      : "form-control mt-2 mb-2 "
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
                    className=""
                    onClick={togglePassword}
                    icon={
                      !passwordShown ? <Visibility /> : <VisibilityOffIcon />
                    }
                    color="warning"
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
                      ? "form-control mt-2 mb-2 input-error"
                      : "form-control mt-2 mb-2 "
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
          <div className="offset-sm-4 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              Ανανέωση Στοιχείων
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditCustomerForm;
