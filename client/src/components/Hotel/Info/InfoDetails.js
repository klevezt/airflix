import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";
import Button from "@mui/material/Button";
import IconButton from "../../UI/Buttons/IconButton";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  getCustomerEdit,
  deleteCustomer,
  fetchCustomersFromDB,
  fetchInfoDetailsFromDB,
  setInfoContentStatus,
  updateInfoContent,
} from "../../../api_requests/hotel_requests";

import { Edit, Undo } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import "./InfoDetails.css";
import i18next from "i18next";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import AddNewInfoDetailsForm from "../Forms/Info/AddNewInfoDetails";
import { useStateValue } from "../../../StateProvider";

const InfoDetails = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const history = useHistory();

  const translate = (text) => removeUpperAccents(t(text));

  const [tableState, setTableState] = useState([]);
  const [allInfoData, setAllInfoData] = useState([]);
  const [showAddMoreInfoDetails, setShowAddMoreInfoDetails] = useState(false);

  const [editUserId, setEditUserId] = useState("");
  const params = useParams();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  // The table of users
  let tableRows = [];
  const fetchTable = {
    columns: [
      {
        label: i18next.t("name"),
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: i18next.t("description"),
        field: "description",
      },
      {
        label: i18next.t("status"),
        field: "status",
      },
    ],
    rows: tableRows,
  };

  // All useEffect Hooks
  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);
    fetchInfoDetailsFromDB(params.alias, state.token).then((data) => {
      setAllInfoData(data);
      setTableState(data[0].content);
      setIsSpinnerLoading(false);
    });
    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    tableState.forEach((info) => {
      tableRows.push({
        name: info.newInfoName,
        description: info.newInfoDescription,
        status: (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={info.newInfoStatus ? true : false}
              onChange={() =>
                handleInfoStatus(info.newInfoName, !info.newInfoStatus)
              }
              autoComplete="off"
            />
          </div>
        ),
      });
    });
  }, [showAddMoreInfoDetails, isSpinnerLoading, tableState]);

  // All handle events

  const handleEditUser = async (id) => {
    setIsSpinnerLoading(true);
    await getCustomerEdit(id, state.token).then((user) => {
      setIsSpinnerLoading(false);
    });
    setEditUserId(id);
    setShowAddMoreInfoDetails(true);
  };

  const handleAddNewInfoDetails = async () => {
    setShowAddMoreInfoDetails(true);
    setIsSpinnerLoading(false);
  };

  const handleInfoStatus = async (name, stat) => {
    setIsSpinnerLoading(true);
    tableState.forEach((info) => {
      if (info.newInfoName === name) {
        info.newInfoStatus = stat;
      }
    });
    await setInfoContentStatus(allInfoData[0]._id, tableState, state.token);
    await fetchInfoDetailsFromDB(params.alias, state.token).then((info) => {
      setTableState(info[0].content);
      setIsSpinnerLoading(false);
    });
  };

  const handleDeleteUser = async (id) => {
    setIsSpinnerLoading(true);
    await deleteCustomer(id, state.token);
    await fetchCustomersFromDB(state.token).then((users) => {
      setTableState(users);
      setIsSpinnerLoading(false);
    });
  };

  const handleSubmitForm = async (e, newInfo) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateInfoContent(params.alias, newInfo, state.token);
    await fetchInfoDetailsFromDB(params.alias, state.token).then((data) => {
      setAllInfoData(data);
      setTableState(data[0].content);
      setIsSpinnerLoading(false);
      setShowAddMoreInfoDetails(false);
    });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {showAddMoreInfoDetails && !isSpinnerLoading && (
        <AddNewInfoDetailsForm
          info={tableState}
          handleSubmitForm={handleSubmitForm}
          goBack={() => setShowAddMoreInfoDetails(false)}
        />
      )}
      {!showAddMoreInfoDetails && !isSpinnerLoading && (
        <>
          <div className="info-wrapper">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text="Επιστροφη"
              icon={<Undo />}
              color="warning"
              variant="contained"
            />
            <Button
              variant="contained"
              color="primary"
              className="button__addUser mb-3"
              onClick={handleAddNewInfoDetails}
            >
              <Edit />
              {translate("edit")}
            </Button>
          </div>
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchTable}
            searchBottom={true}
            barReverse
          />
        </>
      )}
    </>
  );
};

export default InfoDetails;
