import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { deleteEvent, fetchEventsFromDB, toggleEventContentStatus } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../Error/Error";
import { imageGetter } from "../../../Helpers/Const/constants";
import Button from "@mui/material/Button";
import { DeleteOutline, Edit, ToggleOffOutlined, ToggleOn } from "@mui/icons-material";

const EventsAll = () => {
  const { t } = useTranslation();
  const history = useHistory();


  const [state] = useStateValue();
  const [events, setEvents] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const basicFetch = async () => {
    const arr = [];

    try {
      const data = await fetchEventsFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      
      const { myArr } = await imageGetter(data, "Events/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null) {
        let tmp_error =
          "Hotel/EventsComponent/useEffect => Events imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      myArr.forEach((event) => {
          arr.push({
            id: event._id,
            img: event.image,
            alias: event.alias,
            title: event.name,
            time: event.time,
            description: event.description,
            status: event.status,
          });
      });

      setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        await basicFetch();
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  const handleToggleEventStatus = async (id, newStatus) => {
    setIsSpinnerLoading(true);

    try {
      const result = await toggleEventContentStatus(id, newStatus, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }
      await basicFetch();
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteEvent(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      await basicFetch();

      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const allEvents = events.map((event, i) => {
    return (
      <div className="col-md-12 col-lg-6" key={i}>
        <div className="latest-post-box">
          <div className="kp-user">
            <div className="buttons-wrapper">
              <Button
                color="primary"
                variant="outlined"
                className="button__rounded"
                onClick={() => handleToggleEventStatus(event.id, !event.status)}
              >
                {event.status ? <ToggleOn /> : <ToggleOffOutlined />}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                className="button__rounded"
                onClick={() => history.push(`/events/edit/${event.alias}`)}
              >
                <Edit />
              </Button>
              <Button
                variant="outlined"
                color="error"
                className="button__rounded"
                onClick={() => handleDeleteEvent(event.id)}
              >
                <DeleteOutline />
              </Button>
            </div>
          </div>
          <NavLink to={`/events/edit/${event.alias}`} className="post-img">
            <img src={event.img} alt="Upcoming Blog" />
          </NavLink>
          <div className="post-desc">
            <h4>
              <NavLink to={`/events/edit/${event.alias}`}>
                {t(event.title)}
              </NavLink>
            </h4>
            <h6>
              {new Date(event.time).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h6>
            <p>{t(event.description)}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row kp-events">
          <h2 className="mt-3 mb-3">{t("all_events")}</h2>
          {allEvents}
          {events.length < 1 && (
            <div>
              <p className="text-center kp-warning">
                {t("no_upcoming_events_message")}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EventsAll;
