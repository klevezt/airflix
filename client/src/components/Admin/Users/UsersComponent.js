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

import "./UsersComponent.css";
import AddNewUserForm from "../Forms/AddNewUserForm/AddNewUserForm";
import EditUserForm from "../Forms/EditUserForm/EditUserForm";

const Users = () => {
  const [state] = useStateValue();
  const [tableState, setTableState] = useState([]);
  const [showModal, setShow] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

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

    fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
    });
    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
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
  }, [showModal, showEditUser, isSpinnerLoading, tableState]);

  // All handle events

  const handleAddNewUser = async (e, new_username, new_password, new_role) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await setUser(new_username, new_password, new_role, state.token);
    await fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
      setIsSpinnerLoading(false);
    });
    setShow(false);
  };

  const handleEditUser = async (id) => {
    setIsSpinnerLoading(true);
    await getUserEdit(id, state.token).then((user) => {
      setEditUsername(user.username);
      setEditPassword(user.password);
      setEditRole(user.role);
      setIsSpinnerLoading(false);
    });
    setEditUserId(id);
    setShowEditUser(true);
  };

  const handleUserStatus = async (id, stat) => {
    setIsSpinnerLoading(true);
    await setUserStatus(id, stat, state.token);
    await fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
      setIsSpinnerLoading(false);
    });
  };

  const handleDeleteUser = async (id) => {
    setIsSpinnerLoading(true);
    await deleteUser(id, state.token);
    setIsSpinnerLoading(false);
    await fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
    });
  };

  const handleSubmitEditUser = async (
    e,
    editUsername,
    editPassword,
    editRole
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateUser(
      editUserId,
      editUsername,
      editPassword,
      editRole,
      state.token
    );
    await fetchUsersFromDB(state.token).then((users) => {
      setTableState(users);
      setIsSpinnerLoading(false);
    });
    setShowEditUser(false);
  };

  return (
    <div>
      {!showModal && !showEditUser && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={openNewUserForm}
        >
          <AddIcon />
          Προσθήκη Χρήστη
        </Button>
      )}
      {showModal && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={closeNewUserForm}
        >
          <Cancel />
          Ακύρωση
        </Button>
      )}
      {showEditUser && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={closeEditUserForm}
        >
          <Cancel />
          Ακύρωση
        </Button>
      )}
      {showEditUser && !isSpinnerLoading && (
        <EditUserForm
          handleSubmitEditUser={handleSubmitEditUser}
          editUsername={editUsername}
          editPassword={editPassword}
          editRole={editRole}
        />
      )}
      {!showModal && !showEditUser && !isSpinnerLoading && (
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
      {isSpinnerLoading && <LoadingSpinner />}
      {showModal && !showEditUser && !isSpinnerLoading && (
        <AddNewUserForm handleAddNewUser={handleAddNewUser} />
      )}
    </div>
  );
};

export default Users;
