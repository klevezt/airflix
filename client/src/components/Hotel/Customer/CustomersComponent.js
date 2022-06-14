import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { MDBDataTableV5 } from "mdbreact";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { setUserStatus } from "../../../api_requests/admin_requests";
import {
  updateCustomer,
  setCustomer,
  getCustomerEdit,
  deleteCustomer,
  fetchCustomersFromDB,
} from "../../../api_requests/hotel_requests";

import ErrorComponent from "../../Error/Error";

import AddIcon from "@mui/icons-material/Add";
import { Cancel, DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useStateValue } from "../../../StateProvider";

import "./CustomersComponent.css";
import AddNewCustomerForm from "../Forms/Customer/AddNewCustomerForm";
import EditCustomerForm from "../Forms/Customer/EditCustomerForm";
import { useTranslation } from "react-i18next";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";

const Customers = () => {
  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const [state] = useStateValue();
  const [tableState, setTableState] = useState([]);
  const [showModal, setShow] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editRoomType, setEditRoomType] = useState("");
  const [editUserId, setEditUserId] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  // The table of users
  let tableRows = [];
  const fetchTable = {
    columns: [
      {
        label: t("name"),
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: t("room_number"),
        field: "room",
      },
      {
        label: t("room_type"),
        field: "room_type",
      },
      {
        label: t("actions"),
        field: "actions",
      },

      {
        label: t("status"),
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
      setIsSpinnerLoading(true);
      try {
        const users = await fetchCustomersFromDB(state.token);
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

    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    let controller = new AbortController();

    tableState.forEach((user) => {
      if (user.username !== state.user.username) {
        tableRows.push({
          name: user.username,
          room: user.room_number,
          room_type: user.room_type,
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
              <Link to="/customers" onClick={() => handleEditUser(user._id)}>
                <Edit />
              </Link>
              <Link to="/customers" onClick={() => handleDeleteUser(user._id)}>
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

  const handleAddNewUser = async (
    e,
    new_username,
    new_password,
    room_number,
    room_type
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await setCustomer(
        new_username,
        new_password,
        room_number,
        room_type,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const users = await fetchCustomersFromDB(state.token);
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
      setShow(false);
      setIsSpinnerLoading(false);
    }
  };

  const handleEditUser = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const user = await getCustomerEdit(id, state.token);
      // ---- Error Handler ---- //
      if (user.error) {
        setErrorMessage(user.error.msg);
        throw new Error(user.error.msg);
      }

      setEditUsername(user.username);
      setEditPassword(user.password);
      setEditRoom(user.room_number);
      setEditRoomType(user.room_type);
      setIsSpinnerLoading(false);

      setEditUserId(id);
      setShowEditUser(true);
    } catch (err) {
      setError(true);
      setShowEditUser(true);
      setIsSpinnerLoading(false);
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

      const users = await fetchCustomersFromDB(state.token);
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
      const result = await deleteCustomer(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const users = await fetchCustomersFromDB(state.token);
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

  const handleSubmitEditCustomer = async (
    e,
    editUsername,
    editPassword,
    editRoom,
    editRoomType
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await updateCustomer(
        editUserId,
        editUsername,
        editPassword,
        editRoom,
        editRoomType,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }
      const users = await fetchCustomersFromDB(state.token);
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
      setShowEditUser(false);
      setIsSpinnerLoading(false);
    }
  };

  return (
    <>
      {!error && !showModal && !showEditUser && !isSpinnerLoading && (
        <Button
          variant="contained"
          color="primary"
          className="button__addUser mb-3"
          onClick={openNewUserForm}
        >
          <AddIcon />
          {translate("add_customer")}
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
          {translate("cancel")}
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
          {translate("cancel")}
        </Button>
      )}
      {!error && showEditUser && !isSpinnerLoading && (
        <EditCustomerForm
          handleSubmitEditCustomer={handleSubmitEditCustomer}
          editUsername={editUsername}
          editPassword={editPassword}
          editRoom={editRoom}
          editRoomType={editRoomType}
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
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && showModal && !showEditUser && !isSpinnerLoading && (
        <AddNewCustomerForm handleAddNewUser={handleAddNewUser} />
      )}
    </>
  );
};

export default Customers;
