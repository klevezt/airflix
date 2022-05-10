import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ServicesDetailsPage.css";
import { PhoneAndroid, Email, LocationOn } from "@mui/icons-material";
import { fetchServiceWithParamasFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const ServicesDetailsPage = () => {
  const [serviceDetails, setServiceDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [state] = useStateValue();

  const params = useParams();

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchServiceWithParamasFromDB(
        "type=" + params.type,
        state.token
      );
      setServiceDetails(data);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
  }, [params.type]);

  const allServiceDetails = serviceDetails.map((serviceDetail, i) => {
    return (
      <div className="user-services-details-wrapper" key={i}>
        <div className="user-services-details-img">
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Services/${serviceDetail.image}`}
            alt="service"
          />
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
            <span>Τοποθεσία στον χάρτη</span>
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
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
