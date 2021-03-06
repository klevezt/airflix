import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventWithParamasFromDB } from "../../../api_requests/hotel_requests";
import { checkToken, imageGetter } from "../../../Helpers/Const/constants";
import { useStateValue } from "../../../StateProvider";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import ErrorComponent from "../../Error/Error";
import "./EventsDetail.css";
import IconButton from "../../UI/Buttons/IconButton";
import { ReadMore } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { actionTypes } from "../../../reducer";

function EventsDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const [state, dispatch] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [event, setEvent] = useState([]);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      const { isExpired, dataaa } = await checkToken(
        state.token,
        state.refreshToken
      );
      const token = isExpired ? dataaa.accessToken : state.token;

      try {
        const data = await fetchEventWithParamasFromDB(
          {alias: params.eventAlias},
          token
        );

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        const { myArr } = await imageGetter(data, "Events/",true);

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
        setIsSpinnerLoading(false);
      }
    };

    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.eventAlias, dispatch, state.token, state.refreshToken]);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row mb-80">
          <div className="user-services-details-total-wrapper">
            <div className="user-home-general-headline-wrapper mb-4 mt-3">
              <h2 className="user-home-general-headline">{t(event.name)}</h2>
            </div>
            <div className="user-events-details-content-wrapper">
              <img className="w-100 mb-4" src={event.image} alt="event" />
              <p className="text-start">{t(event.description)}</p>
            </div>
          </div>
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
      )}
    </>
  );
}

export default EventsDetail;
