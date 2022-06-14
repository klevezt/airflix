import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { fetchEventsFromDB } from "../../../api_requests/hotel_requests";
import { ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

import "./EventsComponent.css";
import { truncateString } from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";
import { imageGetter } from "../../../Helpers/Const/constants";

const EventsComponent = () => {
  const { t } = useTranslation();

  const [state] = useStateValue();
  const [events, setEvents] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      const arr = [];
      try {
        const data = await fetchEventsFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }


        const { myArr } = await imageGetter(data, "Events/");

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null ) {
          let tmp_error =
            "Hotel/EventsComponent/useEffect => Events imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        myArr.forEach((event) => {
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
  }, []);

  const upcomingEvent = events.map((event, i) => {
    if (i === 0) {
      return (
        <Fragment key={i}>
          <h4 className="mb-5">
            {new Date(event.time).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h4>
          <div className="col-md-12 col-lg-6">
            <div className="latest-post-box">
              <NavLink to={`/events/edit/${event.alias}`} className="post-img">
                <img src={event.img} alt="Upcoming Blog" />
              </NavLink>
              <div className="post-desc">
                <h4>
                  <NavLink to={`/events/edit/${event.alias}`}>
                    {t(event.title)}
                  </NavLink>
                </h4>
                <p>{truncateString(t(event.description), 150)}</p>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return "";
  });

  const recentEvents = events.map((event, i) => {
    if (i !== 0) {
      return (
        <div className="col-lg-6" key={i}>
          <div className="latest-post-box">
            <NavLink to={`/events/edit/${event.alias}`} className="post-img">
              <img src={event.img} alt="Event" />
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
              <p>{truncateString(t(event.description), 150)}</p>
            </div>
          </div>
        </div>
      );
    }
    return "";
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <>
          <div className="row kp-events">
            <h2 className="mt-3 mb-3">{t("upcoming_event")}</h2>
            {upcomingEvent}
            {upcomingEvent === "" && (
              <div>
                <p className="text-center kp-warning">
                  {t("no_upcoming_events_message")}
                </p>
              </div>
            )}
          </div>
          <div className="row kp-events">
            <h2 className="mt-4 mb-3"> {t("next_events")} </h2>
            {recentEvents}
            {events.length <= 1 && (
              <div>
                <p className="text-center kp-warning">{t("no_events")}</p>
              </div>
            )}
          </div>
          <div className="row text-center">
            <Link to="/events/all" className="user-more-button">
              <IconButton
                className="w-auto m-auto"
                text={t("all_events")}
                icon={<ReadMore className="mr-2" />}
                color="warning"
                variant="contained"
              />
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default EventsComponent;
