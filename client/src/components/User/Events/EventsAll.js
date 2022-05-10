import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchEventsFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { truncateString } from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";

const EventsAll = () => {
  const { t } = useTranslation();

  const [state] = useStateValue();
  const [events, setEvents] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();
    let timer;

    const exec = async () => {
      const arr = [];
      await fetchEventsFromDB(state.token).then((data) => {
        data.forEach((event) => {
          if (event.status)
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

  const allEvents = events.map((event, i) => {
    return (
      <div className="col-lg-6" key={i}>
        <div className="user-all-events latest-post-box">
          <NavLink to={`/events/view/${event.alias}`} className="post-img">
            <img src={event.img} alt="Upcoming Blog" />
          </NavLink>
          <div className="post-desc">
            <h4>
              <NavLink to={`/events/view/${event.alias}`}>
                {event.title}
              </NavLink>
            </h4>
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
        <div className="row justify-content-center kp-events mb-5">
          <div className="mt-3">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("all_events")}</h2>
            </div>
          </div>
          {allEvents}
          {events.length < 1 && (
            <p className="text-center kp-warning">
              Δεν υπάρχουν προσεχής εκδηλώσεις
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default EventsAll;
