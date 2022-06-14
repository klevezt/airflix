import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "../../UI/Buttons/IconButton";
import { Add, Undo, DeleteOutline, Edit } from "@mui/icons-material";

import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import {
  fetchServicesDetailsFromDB,
  fetchServiceFromDB,
  deleteService,
  addService,
  getServiceEdit,
  updateService,
} from "../../../api_requests/hotel_requests";
import { PhoneAndroid, Email, LocationOn } from "@mui/icons-material";
import "./ServicesDetails.css";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { useTranslation } from "react-i18next";
import { truncateString } from "../../../Helpers/Functions/functions";

import AddNewService from "../Forms/Services/AddNewService";
import EditService from "../Forms/Services/EditService";
import { useStateValue } from "../../../StateProvider";

import ErrorComponent from "../../Error/Error";
import { imageGetter } from "../../../Helpers/Const/constants";

const ServicesDetails = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));
  const history = useHistory();

  const [services, setServices] = useState([]);
  const [editService, customEditServices] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [showAddNewService, setAddNewService] = useState(false);
  const [showEditService, setEditService] = useState(false);

  const params = useParams();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  // All useEffect Hooks
  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      setIsSpinnerLoading(true);
      try {
        const data = await fetchServicesDetailsFromDB(
          params.alias,
          state.token
        );
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setServiceType(data[0]);

        const services = await fetchServiceFromDB(state.token);
        // ---- Error Handler ---- //
        if (services.error) {
          setErrorMessage(services.error.msg);
          throw new Error(services.error.msg);
        }

        const { myArr } = await imageGetter(services, "Services/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null || myArr.length === 0) {
          let tmp_error =
            "Hotel/ServicesDetail/useEffect => Service Detail imageGetter Problem";
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
  }, []);

  // All handle events
  const handleDeleteService = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteService(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchServiceFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Services/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null || myArr.length === 0) {
        let tmp_error =
          "Hotel/ServicesDetail/useEffect => Service Detail imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setServices(myArr);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    }
  };

  const handleSubmitAddNewService = async (
    e,
    name,
    image,
    phone,
    email,
    location,
    description
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const alias = name.replace(/\s+/g, "-").toLowerCase();

      const result = await addService(
        name,
        serviceType.name,
        image,
        alias,
        phone,
        email,
        location,
        description,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchServiceFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Services/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null || myArr.length === 0) {
        let tmp_error =
          "Hotel/ServicesDetail/useEffect => Service Detail imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setServices(myArr);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    }
  };

  const handleSubmitEditService = async (id) => {
    setIsSpinnerLoading(true);

    try {
      const data = await getServiceEdit(id, state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      customEditServices(data);
      setEditService(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setEditService(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleUpdateService = async (
    e,
    name,
    image,
    phone,
    email,
    location,
    description
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const alias = name.replace(/\s+/g, "-").toLowerCase();

      const result = await updateService(
        editService._id,
        name,
        serviceType.name,
        alias,
        image,
        phone,
        email,
        location,
        description,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const data = await fetchServiceFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Services/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null || myArr.length === 0) {
        let tmp_error =
          "Hotel/ServicesDetail/useEffect => Service Detail imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setServices(myArr);
      setEditService(false);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const allServices = services.map((service, i) => {
    return (
      <div className="kp mb-4" key={i}>
        <div className="buttons-wrapper">
          <Button
            color="primary"
            variant="outlined"
            className="button__rounded"
            onClick={() => handleSubmitEditService(service._id)}
          >
            <Edit />
          </Button>
          <Button
            color="error"
            variant="outlined"
            className="button__rounded"
            onClick={() => handleDeleteService(service._id)}
          >
            <DeleteOutline />
          </Button>
        </div>
        <img src={service.image} alt="Service" />
        <div>
          <h2>{service.name}</h2>
          <div className="d-inline-block mb-2 mt-1">
            <a href={`tel:${service.phone}`}>
              <PhoneAndroid />
              {service.phone}
            </a>
            <a href={`mailto:${service.email}`} className="ms-5">
              <Email className="me-1" />
              {service.email}
            </a>
            <a
              href={service.location}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-5"
            >
              <LocationOn />
              {t("location")}
            </a>
          </div>
          <p>{truncateString(service.description, 500)}</p>
        </div>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}

      {!error && showAddNewService && !showEditService && !isSpinnerLoading && (
        <AddNewService
          handleSubmitAddNewService={handleSubmitAddNewService}
          serviceType={serviceType}
          goBack={() => setAddNewService(false)}
        />
      )}
      {!error && !showAddNewService && showEditService && !isSpinnerLoading && (
        <EditService
          goBack={() => setEditService(false)}
          handleUpdateService={handleUpdateService}
          editService={editService}
        />
      )}
      {!error && !showAddNewService && !showEditService && !isSpinnerLoading && (
        <>
          <div className="service-wrapper">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text={t("back")}
              icon={<Undo />}
              color="warning"
              variant="contained"
            />
            <Button
              variant="contained"
              color="primary"
              className="button__addUser mb-3"
              onClick={() => setAddNewService((s) => !s)}
            >
              <Add />
              {translate("add_service")}
            </Button>
          </div>
          {allServices}
        </>
      )}
    </>
  );
};

export default ServicesDetails;
