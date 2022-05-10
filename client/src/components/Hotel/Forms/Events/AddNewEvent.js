import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  addEvent,
  fetchDrinksTypesFromDB,
} from "../../../../api_requests/hotel_requests";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";

import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useStateValue } from "../../../../StateProvider";

import "./AddNewEvent.css";

const AddNewEvent = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const history = useHistory();

  const nameRef = useRef("");
  const imageRef = useRef("");
  const descriptionRef = useRef("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [value, setValue] = React.useState(new Date());

  useEffect(() => {
    fetchDrinksTypesFromDB(state.token).then((data) => {
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const alias = name.replace(/\s+/g, "-").toLowerCase();
    const time = value;
    const images = imageRef.current.files;
    const description = descriptionRef.current.value;
    addEvent(name, alias, time, images, description, state.token)
      .then(() => {
        history.replace("/events");
      })
      .catch(() => {
        history.replace("/events");
      });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
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
              text={t("back")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_event")}</h2>
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
              <label className="col-sm-2 col-form-label">Εικόνες</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  multiple
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

            <button type="submit" className="btn btn-primary-theme">
              {t("add")}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewEvent;
