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

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  // All useEffect Hooks
  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);
    fetchServicesDetailsFromDB(params.alias, state.token).then((data) => {
      setServiceType(data[0]);
    });
    fetchServiceFromDB(state.token).then((data) => {
      setServices(data);
      setIsSpinnerLoading(false);
    });
    controller = null;
    return () => controller?.abort();
  }, []);

  // All handle events
  const handleDeleteService = async (id) => {
    setIsSpinnerLoading(true);
    await deleteService(id, state.token);
    fetchServiceFromDB(state.token).then((data) => {
      setServices(data);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    });
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
    const alias = name.replace(/\s+/g, "-").toLowerCase();

    await addService(
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
    fetchServiceFromDB(state.token).then((data) => {
      setServices(data);
      setAddNewService(false);
      setIsSpinnerLoading(false);
    });
  };

  const handleSubmitEditService = (id) => {
    getServiceEdit(id, state.token).then((data) => {
      customEditServices(data);
      setEditService(true);
    });
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
    const alias = name.replace(/\s+/g, "-").toLowerCase();

    await updateService(
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
    fetchServiceFromDB(state.token).then((data) => {
      setServices(data);
      setEditService(false);
      setIsSpinnerLoading(false);
    });
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
        <img
          src={`${process.env.REACT_APP_IMAGES_URL}/Images/Services/${service.image}`}
          alt="Service"
        />
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
              Τοποθεσία στον χάρτη
            </a>
          </div>
          <p>{truncateString(service.description, 500)}</p>
        </div>
      </div>
    );
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {showAddNewService && !showEditService && !isSpinnerLoading && (
        <AddNewService
          handleSubmitAddNewService={handleSubmitAddNewService}
          serviceType={serviceType}
          goBack={() => setAddNewService(false)}
        />
      )}
      {!showAddNewService && showEditService && !isSpinnerLoading && (
        <EditService
          goBack={() => setEditService(false)}
          handleUpdateService={handleUpdateService}
          editService={editService}
        />
      )}
      {!showAddNewService && !showEditService && !isSpinnerLoading && (
        <>
          <div className="service-wrapper">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text="Επιστροφη"
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
              {translate("Προσθήκη Υπηρεσίας")}
            </Button>
          </div>
          {allServices}
        </>
      )}
    </>
  );
};

export default ServicesDetails;
