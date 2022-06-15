import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";

import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  fetchSingleEventFromDB,
  updateEvent,
} from "../../../../api_requests/hotel_requests";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditEvent = (props) => {
  const { t } = useTranslation();
  const params = useParams();
  const [state] = useStateValue();
  const history = useHistory();

  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        const data = await fetchSingleEventFromDB(
          { alias: params.eventAlias },
          state.token
        );
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }
        setEventId(data[0]._id);
        setEventName(data[0].name);
        setEventTime(data[0].time);
        setEventDescription(data[0].description);
        setEventImage(data[0].images);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.eventAlias, state.token]);

  const nameChangeHandler = (e) => {
    setEventName(e.target.value);
  };
  const timeChangeHandler = (e) => {
    setEventTime(e);
  };
  const descriptionChangeHandler = (e) => {
    setEventDescription(e.target.value);
  };
  const imageChangeHandler = (e) => {
    setEventImage(e.target.files[0].name);
  };
  const changeImageHandler = () => {
    setImageChange((s) => !s);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const alias = eventName.replace(/\s+/g, "-").toLowerCase();
    try {
      const result = await updateEvent(
        eventId,
        eventName,
        alias,
        eventImage,
        eventTime,
        eventDescription,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      history.push("/events");
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
          method="post"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => history.goBack()}
              text={removeUpperAccents(t("back"))}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("edit_event")}</h2>
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
                  value={eventName}
                  onChange={nameChangeHandler}
                  autoComplete="off"
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
                    format="DD/MM/YYYY HH:mm"
                    value={eventTime}
                    ampm={false}
                    onChange={timeChangeHandler}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="event_image" className="col-sm-2 col-form-label">
                {t("change_images")}
              </label>
              <div className="col-sm-10 align-self-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  autoComplete="off"
                  id="event_image"
                  checked={imageChange}
                  onChange={changeImageHandler}
                />
              </div>
              {imageChange && (
                <div className="col-sm-10 offset-sm-2">
                  <input
                    className="form-control form-control-sm"
                    type="file"
                    autoComplete="off"
                    onChange={imageChangeHandler}
                  />
                </div>
              )}
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
                  value={eventDescription}
                  onChange={descriptionChangeHandler}
                ></textarea>
              </div>
            </div>

            <div className="row ">
              <div className="offset-sm-2 offset-0 col-sm-4 col-12">
                <button type="submit" className="btn btn-primary-theme ">
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default EditEvent;
