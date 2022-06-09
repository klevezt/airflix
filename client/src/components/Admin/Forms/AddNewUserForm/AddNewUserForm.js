import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import bcrypt from "bcryptjs";

const AddNewUserForm = (props) => {
  const { t } = useTranslation();

  //   const [state, dispatch] = useStateValue();
  const [new_username, setNewUsername] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [new_role, setNewRole] = useState("");

  const handleUsernameInput = (e) => setNewUsername(e.target.value);
  const handlePasswordInput = (e) => setNewPassword(e.target.value);
  const handleRoleInput = (e) => setNewRole(e.target.value);

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) =>
        props.handleAddNewUser(
          e,
          new_username,
          bcrypt.hashSync(new_password, bcrypt.genSaltSync()),
          new_role
        )
      }
    >
      <div className="form-header">
        <h2 className="form-headline">{t("new_customer")}</h2>
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
              value={new_username}
              onChange={handleUsernameInput}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="new_psw" className="col-sm-4 col-form-label">
            {t("password")}
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              placeholder="Enter Password"
              name="new_psw"
              id="new_psw"
              value={new_password}
              onChange={handlePasswordInput}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary-theme">
          {t("add")}
        </button>
      </div>
    </form>
  );
};

export default AddNewUserForm;
