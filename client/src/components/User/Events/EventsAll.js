import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchEventsFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { truncateString } from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";
import { imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";

const EventsAll = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [state] = useStateValue();
  const [events, setEvents] = useState([]);

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

        const { myArr: eventArr } = await imageGetter(data, "Events/");

        // ---- Error Handler ---- //
        if (eventArr === undefined || eventArr === null) {
          let tmp_error =
            "User/EventsAll/useEffect => Events imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        eventArr.forEach((event) => {
          if (event.status)
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

  const allEvents = events.map((event, i) => {
    return (
      <div className="col-md-12 col-lg-6" key={i}>
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
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row justify-content-center kp-events mb-5">
          <div className="mt-3">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("all_events")}</h2>
            </div>
          </div>
          {allEvents}
          {events.length < 1 && (
            <p className="text-center kp-warning">
              {t("no_upcoming_events_message")}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default EventsAll;
