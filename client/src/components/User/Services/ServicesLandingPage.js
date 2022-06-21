import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServicesTypesFromDB } from "../../../api_requests/user_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./ServicesLandingPage.css";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import { checkToken, imageGetter } from "../../../Helpers/Const/constants";
import { actionTypes } from "../../../reducer";
import ErrorComponent from "../../Error/Error";
import BackgroundImage from "../../UI/Image/BackgroundImage";

const ServicesLandingPage = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [catalog, setCatalog] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const { isExpired, dataaa } = await checkToken(
          state.token,
          state.refreshToken
        );
        const token = isExpired ? dataaa.accessToken : state.token;

        const services = await fetchServicesTypesFromDB(
          { status: true },
          token
        );
        // ---- Error Handler ---- //
        if (services.error) {
          setErrorMessage(services.error.msg);
          throw new Error(services.error.msg);
        }

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        const { myArr } = await imageGetter(services, "Services/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/ServicesLandingPage/useEffect => Services imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setCatalog(myArr);

        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token, state.refreshToken, dispatch]);

  const allServices = catalog.map((service, i) => {
    return (
      <Link
        to={`/services/${service.alias}/detail`}
        className="user-services-wrapper"
        key={i}
      >
        <div className="user-services-img">
          <BackgroundImage image={service.image} />

          {/* <img src={service.image} alt="service" /> */}
        </div>
        <div className="user-services-content">
          <h2>{t(service.name)}</h2>
        </div>
      </Link>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <div className="mt-3">
            <div className="user-home-general-headline-wrapper">
              <h2 className="user-home-general-headline">{t("services")}</h2>
            </div>
          </div>
          {allServices.length > 0 ? (
            <div className="user-services-total-wrapper">{allServices}</div>
          ) : (
            <div>
              <p className="text-center kp-warning">{t("no_services")}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ServicesLandingPage;
