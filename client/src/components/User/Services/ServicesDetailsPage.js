import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ServicesDetailsPage.css";
import { PhoneAndroid, Email, LocationOn } from "@mui/icons-material";
import {
  fetchServiceWithParamasFromDB,
  fetchServicesTypesFromDB,
} from "../../../api_requests/user_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

import { imageGetter } from "../../../Helpers/Const/constants";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../Error/Error";
import { truncateString } from "../../../Helpers/Functions/functions";
import BackgroundImage from "../../UI/Image/BackgroundImage";

const ServicesDetailsPage = () => {
  const { t } = useTranslation();
  const [state] = useStateValue();

  const [serviceDetails, setServiceDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [title, setTitle] = useState("");

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const params = useParams();

  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);

    const exec = async () => {
      try {
        const result = await fetchServicesTypesFromDB({ alias: params.type }, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }
        setTitle(result[0].name);

        const data = await fetchServiceWithParamasFromDB(
          {
            type: params.type,
            status: true,
          },
          state.token
        );

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data, "Services/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/ServicesDetailPage/useEffect => Services imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setServiceDetails(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.type, state.token]);

  const allServiceDetails = serviceDetails.map((serviceDetail, i) => {
    return (
      <div className="user-services-details-wrapper" key={i}>
        <div className="user-services-details-img">
          <BackgroundImage image={serviceDetail.image} />
          {/* <img src={serviceDetail.image} alt="service" /> */}
        </div>
        <div className="user-services-details-content">
          <h2>{t(serviceDetail.name)}</h2>
          {/* {serviceDetail.description && (
            <p className="text-start mb-2">{truncateString(t(serviceDetail.description),100)}</p>
          )} */}
          {serviceDetail.phone && (
            <a href={`tel:0030${serviceDetail.phone}`}>
              <PhoneAndroid />
              <span>{serviceDetail.phone}</span>
            </a>
          )}
          {serviceDetail.email && (
            <a href={`mailto:${serviceDetail.email}`}>
              <Email />
              <span>{serviceDetail.email}</span>
            </a>
          )}
          {serviceDetail.location && (
            <a
              href={serviceDetail.location}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LocationOn />
              <span>{t("location")}</span>
            </a>
          )}
        </div>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <div className="user-services-details-total-wrapper">
            <div className="mt-3">
              <div className="user-home-general-headline-wrapper mb-4">
                <h2 className="user-home-general-headline">{t(title)}</h2>
              </div>
            </div>
            {allServiceDetails}
            {allServiceDetails.length < 1 && (
              <div>
                <p className="text-center kp-warning">{t("no_services")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesDetailsPage;
