import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServicesTypesFromDB } from "../../../api_requests/hotel_requests";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./ServicesLandingPage.css";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";

const ServicesLandingPage = () => {
  const { t } = useTranslation();

  const [catalog, setCatalog] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);
  const [state] = useStateValue();

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const services = await fetchServicesTypesFromDB(state.token);
      setCatalog(services);

      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 200);
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
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/Images/Services/${service.image}`}
              alt="service"
            />
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
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <div className="row">
          <div className="user-services-total-wrapper mb-5">{allServices}</div>
        </div>
      )}
    </>
  );
};

export default ServicesLandingPage;
