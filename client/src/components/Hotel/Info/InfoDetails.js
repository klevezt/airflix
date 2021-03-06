import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { MDBDataTableV5 } from "mdbreact";
import Button from "@mui/material/Button";
import IconButton from "../../UI/Buttons/IconButton";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  // getCustomerEdit,
  // deleteCustomer,
  // fetchCustomersFromDB,
  fetchInfoDetailsFromDB,
  setInfoContentStatus,
  updateInfoContent,
} from "../../../api_requests/hotel_requests";

import ErrorComponent from "../../Error/Error";

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

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [tableState, setTableState] = useState([]);
  const [allInfoData, setAllInfoData] = useState([]);
  const [showAddMoreInfoDetails, setShowAddMoreInfoDetails] = useState(false);

  // const [editUserId, setEditUserId] = useState("");
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
    const exec = async () => {
      setIsSpinnerLoading(true);
      try {
        const data = await fetchInfoDetailsFromDB(params.alias, state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }
        const content = data[0].content;

        const arr = [];

        content.forEach((c) => {
          arr.push(JSON.parse(c));
        });

        setAllInfoData(data);
        setTableState(arr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.alias, state.token]);

  useEffect(() => {
    let controller = new AbortController();

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
    controller = null;
    return () => controller?.abort();
  }, [showAddMoreInfoDetails, isSpinnerLoading, tableState]);

  // All handle events

  const handleAddNewInfoDetails = () => {
    setShowAddMoreInfoDetails(true);
    setIsSpinnerLoading(false);
  };

  const handleInfoStatus = async (name, stat) => {
    setIsSpinnerLoading(true);
    try {
      let temp = [...tableState];
       
      tableState.forEach((info,i) => {
        if (info.newInfoName === name) {
          temp[i]["newInfoStatus"] = stat;
        }
      });

      const arr = [];

      temp.forEach((t) => {
        arr.push(JSON.stringify(t));
      });

      const result = await setInfoContentStatus(
        allInfoData[0]._id,
        arr,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const info = await fetchInfoDetailsFromDB(params.alias, state.token);
      arr.length = 0;
      // ---- Error Handler ---- //
      if (info.error) {
        setErrorMessage(info.error.msg);
        throw new Error(info.error.msg);
      }
      const content = info[0].content;
      content.forEach((c) => {
        arr.push(JSON.parse(c));
      });

      setAllInfoData(info);
      setTableState(arr);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleSubmitForm = async (e, newInfo) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const arr = [];

      newInfo.forEach((t) => {
        arr.push(JSON.stringify(t));
      });
      const result = await updateInfoContent(params.alias, arr, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchInfoDetailsFromDB(params.alias, state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      arr.length = 0;
      const content = data[0].content;
      content.forEach((c) => {
        arr.push(JSON.parse(c));
      });

      setAllInfoData(data);
      setTableState(arr);
      setIsSpinnerLoading(false);
      setShowAddMoreInfoDetails(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
      setShowAddMoreInfoDetails(false);
    }
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && showAddMoreInfoDetails && !isSpinnerLoading && (
        <AddNewInfoDetailsForm
          info={tableState}
          handleSubmitForm={handleSubmitForm}
          goBack={() => setShowAddMoreInfoDetails(false)}
        />
      )}
      {!error && !showAddMoreInfoDetails && !isSpinnerLoading && (
        <>
          <div className="info-wrapper">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text={removeUpperAccents(t("back"))}
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
