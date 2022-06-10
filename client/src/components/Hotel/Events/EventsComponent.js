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

        data.forEach((event) => {
          if (
            event.status &&
            new Date().getTime() < new Date(event.time).getTime()
          )
            arr.push({
              img:
                process.env.REACT_APP_IMAGES_URL +
                "/Images/Events/" +
                event.images[0],
              alias: event.alias,
              title: event.name,
              time: event.time,
              description: event.description,
            });
          setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));
          setIsSpinnerLoading(false);
        });
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
          <h4 className="text-center mb-5">
            {new Date(event.time).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h4>
          <div className="col-lg-6">
            <div className="latest-post-box">
              <NavLink to={`/events/edit/${event.alias}`} className="post-img">
                <img src={event.img} alt="Upcoming Blog" />
              </NavLink>
              <div className="post-desc">
                <h4>
                  <NavLink to={`/events/edit/${event.alias}`}>
                    {event.title}
                  </NavLink>
                </h4>
                <p>{truncateString(event.description, 150)}</p>
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
        <div className="col-lg-4" key={i}>
          <div className="latest-post-box">
            <NavLink to={`/events/edit/${event.alias}`} className="post-img">
              <img src={event.img} alt="Event" />
            </NavLink>
            <div className="post-desc">
              <h4>
                <NavLink to={`/events/edit/${event.alias}`}>
                  {event.title}
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
              <p>{truncateString(event.description, 150)}</p>
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
          <div className="row justify-content-center kp-events">
            <h2 className="text-center mt-3 mb-3">{t("upcoming_event")}</h2>
            {upcomingEvent}
            {events.length < 1 && (
              <p className="text-center kp-warning">
                {t("no_upcoming_events_message")}
              </p>
            )}
          </div>
          <div className="row justify-content-center kp-events">
            <h2 className="text-center mt-4 mb-3"> {t("next_events")} </h2>
            {recentEvents}
            {events.length <= 1 && (
              <p className="text-center kp-warning">{t("no_events")}</p>
            )}
          </div>
          <div className="row text-center">
            <Link to="/events/all" className=" more-button">
              <IconButton
                className="w-auto m-auto"
                text={t("")}
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
