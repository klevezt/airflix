import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchEventWithParamasFromDB } from "../../../api_requests/hotel_requests";
import { useStateValue } from "../../../StateProvider";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";

function EventsDetail() {
  const params = useParams();
  const [state] = useStateValue();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    let controller = new AbortController();
    let timer;

    const exec = async () => {
      const arr = [];
      await fetchEventWithParamasFromDB(
        "alias=" + params.eventAlias,
        state.token
      ).then((data) => {
        setEvent(data[0]);
      });
      setIsSpinnerLoading(false);
    };

    exec();
    controller = null;
    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, []);

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <div className="row mb-80">
          <div className="user-services-details-total-wrapper">
            <div className="user-home-general-headline-wrapper mb-4">
              <h2 className="user-home-general-headline">{event.name}</h2>
            </div>
            <img
              className="w-100 mb-4"
              src={
                process.env.REACT_APP_IMAGES_URL +
                "/Images/Events/" +
                event.images[0]
              }
              alt="event-image"
            />
            <p className="text-start">{event.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default EventsDetail;
