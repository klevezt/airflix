import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { MDBDataTableV5 } from "mdbreact";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  fetchUsersFromDB,
  setUser,
  deleteUser,
  updateUser,
  setUserStatus,
  getUserEdit,
} from "../../../api_requests/admin_requests";
import AddIcon from "@mui/icons-material/Add";
import { Cancel, DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";

import "./UsersComponent.css";
import AddNewUserForm from "../Forms/AddNewUserForm/AddNewUserForm";
import EditUserForm from "../Forms/EditUserForm/EditUserForm";
import ErrorComponent from "../../Error/Error";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";

const Users = () => {
  const { t } = useTranslation();

  const [state] = useStateValue();
  const [tableState, setTableState] = useState([]);
  const [showModal, setShow] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  // The table of users
  let tableRows = [];
  const fetchTable = {
    columns: [
      {
        label: "Name",
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Role",
        field: "role",
      },

      {
        label: "Actions",
        field: "actions",
      },

      {
        label: "Status",
        field: "status",
      },
    ],
    rows: tableRows,
  };

  const openNewUserForm = () => {
    setShow(true);
  };

  const closeNewUserForm = () => {
    setShow(false);
  };
  const closeEditUserForm = () => {
    setShowEditUser(false);
  };

  // All useEffect Hooks
  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      try {
        const users = await fetchUsersFromDB(state.token);
        // ---- Error Handler ---- //
        if (users.error) {
          setErrorMessage(users.error.msg);
          throw new Error(users.error.msg);
        }

        setTableState(users);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  useEffect(() => {
    let controller = new AbortController();

    tableState.forEach((user) => {
      if (user.username !== state.user.username) {
        tableRows.push({
          name: user.username,
          role: user.role,
          status: (
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={user.status ? true : false}
                onChange={() => handleUserStatus(user._id, !user.status)}
                autoComplete="off"
              />
            </div>
          ),
          actions: (
            <div>
              <Link to="/users" onClick={() => handleEditUser(user._id)}>
                <Edit />
              </Link>
              <Link to="/users" onClick={() => handleDeleteUser(user._id)}>
                <DeleteForeverSharp />
              </Link>
            </div>
          ),
        });
      }
    });
    
    controller = null;
    return () => controller?.abort();
  }, [showModal, showEditUser, isSpinnerLoading, tableState]);

  // All handle events

  const handleAddNewUser = async (e, new_username, new_password, new_role) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await setUser(
        new_username,
        new_password,
        new_role,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const users = await fetchUsersFromDB(state.token);
      // ---- Error Handler ---- //
      if (users.error) {
        setErrorMessage(users.error.msg);
        throw new Error(users.error.msg);
      }

      setTableState(users);
      setIsSpinnerLoading(false);
      setShow(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
      setShow(false);
    }
  };

  const handleEditUser = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const user = await getUserEdit(id, state.token);
      // ---- Error Handler ---- //
      if (user.error) {
        setErrorMessage(user.error.msg);
        throw new Error(user.error.msg);
      }
      setEditUsername(user.username);
      setEditPassword(user.password);
      setEditRole(user.role);
      setIsSpinnerLoading(false);

      setEditUserId(id);
      setShowEditUser(true);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
      setShowEditUser(true);
    }
  };

  const handleUserStatus = async (id, stat) => {
    setIsSpinnerLoading(true);
    try {
      const result = await setUserStatus(id, stat, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const users = await fetchUsersFromDB(state.token);
      // ---- Error Handler ---- //
      if (users.error) {
        setErrorMessage(users.error.msg);
        throw new Error(users.error.msg);
      }
      setTableState(users);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteUser(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      setIsSpinnerLoading(false);
      const users = await fetchUsersFromDB(state.token);
      // ---- Error Handler ---- //
      if (users.error) {
        setErrorMessage(users.error.msg);
        throw new Error(users.error.msg);
      }

      setTableState(users);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleSubmitEditUser = async (
    e,
    editUsername,
    editPassword,
    editRole
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await updateUser(
        editUserId,
        editUsername,
        editPassword,
        editRole,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const users = await fetchUsersFromDB(state.token);
      // ---- Error Handler ---- //
      if (users.error) {
        setErrorMessage(users.error.msg);
        throw new Error(users.error.msg);
      }

      setTableState(users);
      setIsSpinnerLoading(false);
      setShowEditUser(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
      setShowEditUser(false);
    }
  };

  return (
    <>
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {!error && !showModal && !showEditUser && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={openNewUserForm}
        >
          <AddIcon />
          {removeUpperAccents(t("add_user"))}
        </Button>
      )}
      {!error && showModal && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={closeNewUserForm}
        >
          <Cancel />
          {removeUpperAccents(t("cancel"))}
        </Button>
      )}
      {!error && showEditUser && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={closeEditUserForm}
        >
          <Cancel />
          {removeUpperAccents(t("cancel"))}
        </Button>
      )}
      {!error && showEditUser && !isSpinnerLoading && (
        <EditUserForm
          handleSubmitEditUser={handleSubmitEditUser}
          editUsername={editUsername}
          editPassword={editPassword}
          editRole={editRole}
        />
      )}
      {!error && !showModal && !showEditUser && !isSpinnerLoading && (
        <MDBDataTableV5
          hover
          entriesOptions={[10, 20, 25]}
          entries={10}
          pagesAmount={4}
          data={fetchTable}
          searchBottom={true}
          barReverse
        />
      )}
      {!error && showModal && !showEditUser && !isSpinnerLoading && (
        <AddNewUserForm handleAddNewUser={handleAddNewUser} />
      )}
    </>
  );
};

export default Users;
