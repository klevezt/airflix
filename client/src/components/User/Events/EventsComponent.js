import React, { useEffect, Fragment, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { fetchEventsFromDB } from "../../../api_requests/hotel_requests";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";

import "./EventsComponent.css";
import {
  removeUpperAccents,
  truncateString,
} from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";
import { checkToken, imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";
import { actionTypes } from "../../../reducer";

const EventsComponent = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [events, setEvents] = useState([]);
  const [state, dispatch] = useStateValue();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      const arr = [];
      try {
        const { isExpired, dataaa } = await checkToken(
          state.token,
          state.refreshToken
        );
        const token = isExpired ? dataaa.accessToken : state.token;

        const data = await fetchEventsFromDB(token);

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        const { myArr: eventArr } = await imageGetter(data, "Events/", true);

        // ---- Error Handler ---- //
        if (eventArr === undefined || eventArr === null) {
          let tmp_error =
            "User/EventsComponent/useEffect => Events imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        eventArr.forEach((event) => {
          if (
            event.status &&
            new Date().getTime() < new Date(event.time).getTime()
          )
            arr.push({
              img: event.image,
              alias: event.alias,
              title: event.name,
              time: event.time,
              description: event.description,
            });
        });
        setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [dispatch, state.token, state.refreshToken]);

  const upcomingEvent = events.map((event, i) => {
    if (i !== 0) return "";
    return (
      <Fragment key={i}>
        <div className="col-md-12 col-lg-6" key={i}>
          <div className="user-home-events latest-post-box">
            <NavLink to={`/events/view/${event.alias}`} className="post-img">
              <img src={event.img} alt="Upcoming Blog " />
            </NavLink>
            <div className="post-desc">
              <h4>
                <NavLink to={`/events/view/${event.alias}`}>
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
              <p>{truncateString(t(event.description), 150)}</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  });

  const recentEvents = events.map((event, i) => {
    if (i === 0) return "";
    return (
      <div className="col-lg-6" key={i}>
        <div className="user-home-events latest-post-box">
          <NavLink to={`/events/view/${event.alias}`} className="post-img">
            <img src={event.img} alt="Event" />
          </NavLink>
          <div className="post-desc">
            <h4>
              <NavLink to={`/events/view/${event.alias}`}>
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
            <p>{truncateString(t(event.description), 150)}</p>
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
        <>
          <div className="row">
            <div className="mt-3 mb-5">
              <div className="user-home-general-headline-wrapper">
                <h2 className="user-home-general-headline">
                  {t("upcoming_event")}
                </h2>
                {upcomingEvent}
              </div>
              {events.length < 1 && (
                <div>
                  <p className="text-center kp-warning">
                    {t("no_upcoming_events_message")}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3 mb-3">
              <div className="user-home-general-headline-wrapper">
                <h2 className="user-home-general-headline">
                  {t("next_events")}
                </h2>
                {recentEvents}
              </div>
              {events.length <= 1 && (
                <div>
                  <p className="text-center kp-warning">{t("no_events")}</p>
                </div>
              )}
            </div>
            <div className="col-12">
              <Link to="/events/all" className="user-more-button">
                <IconButton
                  text={removeUpperAccents(t("all_events"))}
                  icon={<ReadMore className="mr-2" />}
                  color="warning"
                  variant="contained"
                  className="my-2"
                />
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventsComponent;
