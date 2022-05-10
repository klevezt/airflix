import React, { useEffect, Fragment, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { fetchEventsFromDB } from "../../../api_requests/hotel_requests";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";

import "./EventsComponent.css";
import { truncateString } from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";

const EventsComponent = () => {
  const { t } = useTranslation();

  const [events, setEvents] = useState([]);
  const [state] = useStateValue();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();
    let timer;

    const exec = async () => {
      const arr = [];
      await fetchEventsFromDB(state.token).then((data) => {
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
        });
        setEvents(arr.sort((a, b) => new Date(a.time) - new Date(b.time)));
        setIsSpinnerLoading(false);
      });
    };
    exec();
    controller = null;
    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, []);

  const upcomingEvent = events.map((event, i) => {
    if (i !== 0) return;
    return (
      <Fragment key={i}>
        <div className="col-lg-6" key={i}>
          <div className="user-home-events latest-post-box">
            <NavLink to={`/events/view/${event.alias}`} className="post-img">
              <img src={event.img} alt="Upcoming Blog " />
            </NavLink>
            <div className="post-desc">
              <h4>
                <NavLink to={`/events/view/${event.alias}`}>
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
      </Fragment>
    );
  });

  const recentEvents = events.map((event, i) => {
    if (i === 0) return;
    return (
      <div className="col-lg-4" key={i}>
        <div className="user-home-events latest-post-box">
          <NavLink to={`/events/view/${event.alias}`} className="post-img">
            <img src={event.img} alt="Event" />
          </NavLink>
          <div className="post-desc">
            <h4>
              <NavLink to={`/events/view/${event.alias}`}>
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
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <>
          <div className="row">
            <div className="mt-4">
              <div className="user-home-general-headline-wrapper">
                <h2 className="user-home-general-headline">
                  Προσεχής Εκδήλωση
                </h2>
              </div>
              {upcomingEvent}
              {events.length < 1 && (
                <p className="text-center kp-warning">
                  Δεν υπάρχουν προσεχής εκδηλώσεις
                </p>
              )}
            </div>
            <div className="mt-4">
              <div className="user-home-general-headline-wrapper">
                <h2 className="user-home-general-headline">
                  Επόμενες Εκδηλώσεις
                </h2>
              </div>
              {recentEvents}
              {events.length <= 1 && (
                <p className="text-center kp-warning">
                  Δεν υπάρχουν εκδηλώσεις
                </p>
              )}
            </div>
            <Link to="/events/all" className="user-more-button">
              <IconButton
                text={t("all_events")}
                icon={<ReadMore className="mr-2" />}
                color="warning"
                variant="contained"
                className="my-2"
              />
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default EventsComponent;
