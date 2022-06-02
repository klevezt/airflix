import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServicesTypesFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./ServicesLandingPage.css";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import { imageGetter } from "../../../Helpers/Const/constants";
import { actionTypes } from "../../../reducer";
import jwt from "jsonwebtoken";
import ErrorComponent from "../../Error/Error";

const ServicesLandingPage = () => {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [catalog, setCatalog] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [state, dispatch] = useStateValue();

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        var isExpired = false;
        var decodedToken = jwt.decode(state.token, { complete: true });
        var dateNow = new Date();

        if (decodedToken.payload.exp * 1000 < dateNow.getTime())
          isExpired = true;

        var services;

        if (isExpired) {
          const dataaa = await fetch(
            process.env.REACT_APP_SERVER_URL + "/auth/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": state.refreshToken,
              },
            }
          ).then((data) => data.json());

          // ---- Error Handler ---- //
          if (dataaa.error) {
            setErrorMessage(dataaa.error.msg);
            throw new Error(dataaa.error.msg);
          }

          services = await fetchServicesTypesFromDB(dataaa.accessToken);

          // ---- Error Handler ---- //
          if (services.error) {
            setErrorMessage(services.error.msg);
            throw new Error(services.error.msg);
          }
          dispatch({
            type: actionTypes.SET_NEW_JWT_TOKEN,
            token: dataaa.accessToken,
          });
        } else {
          services = await fetchServicesTypesFromDB(state.token);

          // ---- Error Handler ---- //
          if (services.error) {
            setErrorMessage(services.error.msg);
            throw new Error(services.error.msg);
          }
        }

        if (services.errors) {
          dispatch({
            type: actionTypes.REMOVE_JWT_TOKEN,
            authenticated: false,
            token: "",
          });
          localStorage.clear();
          return;
        }

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
      }
    };
    exec();
  }, []);

  const allServices = catalog.map((service, i) => {
    return (
      <Fragment key={i}>
        <div className="user-home-general-headline-wrapper">
          <h2 className="user-home-general-headline">{t("services")}</h2>
        </div>
        <Link
          to={`/services/${service.name}/detail`}
          className="user-services-wrapper"
          key={i}
        >
          <div className="user-services-img">
            <img src={service.image} alt="service" />
          </div>
          <div className="user-services-content">
            <h2>{service.name}</h2>
          </div>
        </Link>
      </Fragment>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <div className="user-services-total-wrapper mb-5">{allServices}</div>
        </div>
      )}
    </>
  );
};

export default ServicesLandingPage;
