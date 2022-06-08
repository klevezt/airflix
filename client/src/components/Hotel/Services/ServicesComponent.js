import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";

import "./ServicesComponent.css";
import {
  deleteServiceType,
  fetchServicesTypesFromDB,
  updateServiceType,
} from "../../../api_requests/hotel_requests";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import EditServiceType from "../Forms/Services/EditServiceType";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";


const ServicesComponent = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const [services, setServices] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState();
  const [showEdit, setShowEdit] = useState(false);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const data = await fetchServicesTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setServices(data);
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

  const handleDeleteServiceType = async (id) => {
    setIsSpinnerLoading(true);
    try {
      await deleteServiceType(id, state.token);
      const data = await fetchServicesTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setServices(data);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleUpdateServiceType = async (e, id, serviceTypeName) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const alias = serviceTypeName.replace(/\s+/g, "-").toLowerCase();
      await updateServiceType(id, serviceTypeName, alias, state.token);
      const data = await fetchServicesTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setServices(data);
      setShowEdit((s) => !s);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleEditServiceType = (selectedServiceType) => {
    setShowEdit((s) => !s);
    setSelectedServiceType(selectedServiceType);
  };

  const allServices = services.map((service, i) => {
    return (
      <Fragment key={i}>
        <div className="info-flex-three">
          <div className="w-100 buttons-wrapper">
            <Button
              color="primary"
              variant="outlined"
              className="button__rounded"
              onClick={() => handleEditServiceType(service)}
            >
              <Edit />
            </Button>
            <Button
              color="error"
              variant="outlined"
              className="button__rounded"
              onClick={() => handleDeleteServiceType(service._id)}
            >
              <DeleteOutline />
            </Button>
          </div>
          <Link
            to={`/services/view/${service.alias}`}
            className="info-avatar text-center"
          >
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/Images/Services/${service.image}`}
              alt="service"
            />
            <div className=" text-center info-description">
              <h2>{translate(service.name)}</h2>
            </div>
          </Link>
        </div>
      </Fragment>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && !showEdit && (
        <section className="info-wrapper">
          <div className="row mb-5">
            <Link to="/serviceType/add" className="text-center">
              <Button
                variant="contained"
                color="primary"
                className="button__addUser mb-3"
              >
                <AddIcon />
                {translate("Προσθήκη Υπηρεσίας")}
              </Button>
            </Link>
          </div>

          <div className={`col-12 info-box`}>{allServices}</div>
        </section>
      )}
      {!error && !isSpinnerLoading && showEdit && (
        <EditServiceType
          handleUpdateServiceType={handleUpdateServiceType}
          handleBackButton={() => setShowEdit((s) => !s)}
          serviceType={selectedServiceType}
        />
      )}
    </>
  );
};

export default ServicesComponent;
