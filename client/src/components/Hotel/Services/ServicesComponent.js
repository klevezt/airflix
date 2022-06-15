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
import { imageGetter } from "../../../Helpers/Const/constants";

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

        const { myArr } = await imageGetter(data, "Services/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "Hotel/ServicesComponent/useEffect => Services imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setServices(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  const handleDeleteServiceType = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteServiceType(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchServicesTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Services/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null ) {
        let tmp_error =
          "Hotel/ServicesComponent/useEffect => Services imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setServices(myArr);
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
      const result = await updateServiceType(
        id,
        serviceTypeName,
        alias,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchServicesTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Services/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null ) {
        let tmp_error =
          "Hotel/ServicesComponent/useEffect => Services imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setServices(myArr);
      setShowEdit((s) => !s);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
      setShowEdit((s) => !s);
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
            <img src={service.image} alt="service" />
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
            <Link to="/serviceType/add">
              <Button
                variant="contained"
                color="primary"
                className="button__addUser mb-3"
              >
                <AddIcon />
                {translate("add_service")}
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
