import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const EditUserForm = (props) => {
  const { t } = useTranslation();

  const [editUsername, setEditUsername] = useState(props.editUsername);
  const [editPassword, setEditPassword] = useState(props.editPassword);
  const [editRole, setEditRole] = useState(props.editRole);

  const handleEditUsernameInput = (e) => setEditUsername(e.target.value);
  const handleEditPasswordInput = (e) => setEditPassword(e.target.value);
  const handleEditRoleInput = (e) => setEditRole(e.target.value);

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) =>
        props.handleSubmitEditUser(e, editUsername, editPassword, editRole)
      }
    >
      <div className="container">
        <label htmlFor="edit_uname">
          <b>{t("username")}</b>
        </label>
        <input
          type="text"
          placeholder="Enter Username"
          name="edit_uname"
          id="edit_uname"
          value={editUsername}
          onChange={handleEditUsernameInput}
          autoComplete="off"
          required
        />

        <label htmlFor="psw">
          <b>{t("password")}</b>
        </label>
        <input
          type="text"
          placeholder={t("password")}
          name="psw"
          value={editPassword}
          onChange={handleEditPasswordInput}
          autoComplete="off"
          required
        />

        <label htmlFor="role">
          <b>{t("role")}</b>
        </label>
        <select
          className="form-select form-select-lg mt-2 mb-3"
          name="role"
          onChange={handleEditRoleInput}
          value={editRole}
          required
        >
          <option value="">-</option>
          <option value="Hotel">Hotel</option>
          <option value="Customer">Customer</option>
        </select>

        <button type="submit" className="btn btn-primary-theme">
          {t("update")}
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
