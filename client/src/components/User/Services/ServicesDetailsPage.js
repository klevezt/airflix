import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ServicesDetailsPage.css";
import { PhoneAndroid, Email, LocationOn } from "@mui/icons-material";
import { fetchServiceWithParamasFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";
import { imageGetter } from "../../../Helpers/Const/constants";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../Error/Error";

const ServicesDetailsPage = () => {
  const { t } = useTranslation();
  
  const [serviceDetails, setServiceDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const params = useParams();

  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);
    
    const exec = async () => {
      try {
        const data = await fetchServiceWithParamasFromDB(
          "type=" + params.type,
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
  }, [params.type]);

  const allServiceDetails = serviceDetails.map((serviceDetail, i) => {
    return (
      <div className="user-services-details-wrapper" key={i}>
        <div className="user-services-details-img">
          <img src={serviceDetail.image} alt="service" />
        </div>
        <div className="user-services-details-content">
          <h2>{serviceDetail.name}</h2>
          <a href={`tel:0030${serviceDetail.phone}`}>
            <PhoneAndroid />
            <span>{"phone"}</span>
          </a>
          <a href={`mailto:${serviceDetail.email}`}>
            <Email />
            <span>{"email"}</span>
          </a>
          <a
            href={serviceDetail.location}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LocationOn />
            <span>{t("location")}</span>
          </a>
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
            <div className="user-home-general-headline-wrapper mb-4">
              <h2 className="user-home-general-headline">{params.type}</h2>
            </div>
            {allServiceDetails}
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesDetailsPage;
