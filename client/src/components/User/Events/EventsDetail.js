import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { fetchEventWithParamasFromDB } from "../../../api_requests/hotel_requests";
import { imageGetter } from "../../../Helpers/Const/constants";
import { useStateValue } from "../../../StateProvider";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import ErrorComponent from "../../Error/Error";

function EventsDetail() {
  const params = useParams();
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        const data = await fetchEventWithParamasFromDB(
          "alias=" + params.eventAlias,
          state.token
        );

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data, "Events/");

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/ServicesDetailPage/useEffect => Services imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setEvent(myArr[0]);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
      }
    };

    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row mb-80">
          <div className="user-services-details-total-wrapper">
            <div className="user-home-general-headline-wrapper mb-4">
              <h2 className="user-home-general-headline">{event.name}</h2>
            </div>
            <img className="w-100 mb-4" src={event.image} alt="event-image" />
            <p className="text-start">{event.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default EventsDetail;
