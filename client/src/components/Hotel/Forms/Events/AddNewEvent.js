import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  addEvent,
  // fetchDrinksTypesFromDB,
} from "../../../../api_requests/hotel_requests";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";

import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";

import "./AddNewEvent.css";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewEvent = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const history = useHistory();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef("");
  const imageRef = useRef("");
  const descriptionRef = useRef("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    let controller = new AbortController();

    // const exec = async () => {
    //   try {
    //     const res = await fetchDrinksTypesFromDB(state.token);
    //     // ---- Error Handler ---- //
    //     if (res.error) {
    //       setErrorMessage(res.error.msg);
    //       throw new Error(res.error.msg);
    //     }
    //     setIsSpinnerLoading(false);
    //   } catch (err) {
    //     setError(true);
    //     setIsSpinnerLoading(false);
    //   }
    // };
    // exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = nameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const time = value;
      const images = imageRef.current.files;
      const description = descriptionRef.current.value;
      const result = await addEvent(
        name,
        alias,
        time,
        images,
        description,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      history.replace("/events");
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <form
          method="POST"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={handleFormSubmit}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text={removeUpperAccents(t("back"))}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_event")}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label
                htmlFor="inputEventName"
                className="col-sm-2 col-form-label"
              >
                {t("name")}
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputEventName"
                  autoComplete="off"
                  ref={nameRef}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label
                htmlFor="inputEventTime"
                className="col-sm-2 col-form-label"
              >
                {t("event_time")}
              </label>
              <div className="col-sm-10 datetime-picker" id="inputEventTime">
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  className="datetime-picker"
                >
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">{t("image")}</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  autoComplete="off"
                  ref={imageRef}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="col-sm-2 col-form-label"
              >
                {t("description")}
              </label>
              <div className="col-sm-10">
                <textarea
                  className="form-control form-control-sm"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  ref={descriptionRef}
                ></textarea>
              </div>
            </div>

            <div className="row ">
              <div className="offset-sm-2 offset-0 col-sm-4 col-12">
                <button type="submit" className="btn btn-primary-theme">
                  {t("add")}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewEvent;
