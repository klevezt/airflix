import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import bcrypt from "bcryptjs";
import { roomTypes } from "../../../../Helpers/Const/constants";
import IconButton from "../../../UI/Buttons/IconButton";
import { Visibility } from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const AddNewCustomerForm = (props) => {
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const roomRef = useRef("");
  const roomTypeRef = useRef("");

  const togglePassword = () => {
    setPasswordShown((p) => !p);
  };

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) =>
        props.handleAddNewUser(
          e,
          usernameRef.current.value,
          bcrypt.hashSync(passwordRef.current.value, bcrypt.genSaltSync()),
          roomRef.current.value,
          roomTypeRef.current.value
        )
      }
    >
      <div className="form-header">
        <h2 className="form-headline">{t("Νέος Πελάτης")}</h2>
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="new_username" className="col-sm-4 col-form-label">
            {t("username")}
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter Username"
              name="new_username"
              id="new_username"
              ref={usernameRef}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="new_psw" className="col-sm-4 col-form-label">
            {t("password")}
          </label>
          <div className="col-sm-8 input-password-wrapper">
            <input
              className="form-control mt-2 mb-2 "
              type={passwordShown ? "text" : "password"}
              placeholder="Enter Password"
              name="new_psw"
              id="new_psw"
              ref={passwordRef}
              autoComplete="off"
              required
            />
            <div className="toggle-visibility-wrapper">
              <IconButton
                className=""
                onClick={togglePassword}
                icon={!passwordShown ? <Visibility /> : <VisibilityOffIcon />}
                color="warning"
                variant="contained"
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="room" className="col-sm-4 col-form-label">
            {t("room_number")}
          </label>
          <div className="col-sm-8">
            <input
              className="form-control mt-2 mb-2 "
              type="text"
              placeholder="Δωμάτιο"
              name="room"
              id="room"
              ref={roomRef}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="room_type" className="col-sm-4 col-form-label">
            {t("room_type")}
          </label>
          <div className="col-sm-8">
            <select
              className="form-select form-select-lg mt-2 mb-3"
              name="room_type"
              id="room_type"
              ref={roomTypeRef}
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
        <div className="row ">
          <div className="offset-sm-4 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              {t("add")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewCustomerForm;
