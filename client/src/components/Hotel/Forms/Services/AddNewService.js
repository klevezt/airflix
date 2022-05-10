import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import {
  PhoneAndroid,
  Email,
  LocationOn,
  Description,
} from "@mui/icons-material";
import "./AddNewService.css";

const AddNewService = (props) => {
  const { t } = useTranslation();

  const serviceNameRef = useRef("");
  const serviceImageRef = useRef("");
  const servicePhoneRef = useRef("");
  const serviceEmailRef = useRef("");
  const serviceLocationRef = useRef("");
  const serviceDescription = useRef("");

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleSubmitAddNewService(
          e,
          serviceNameRef.current.value,
          serviceImageRef.current.files,
          servicePhoneRef.current.value,
          serviceEmailRef.current.value,
          serviceLocationRef.current.value,
          serviceDescription.current.value
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.goBack();
          }}
          text="Επιστροφη"
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("Νέα Υπηρεσία")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="service_name" className="col-sm-2 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="service_name"
              id="service_name"
              ref={serviceNameRef}
              placeholder="Ονομασία Υπηρεσίας"
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="service_image" className="col-sm-2 col-form-label">
            Εικόνα
          </label>
          <div className="col-sm-10">
            <input
              className="form-control form-control-sm"
              type="file"
              name="service_image"
              id="service_image"
              ref={serviceImageRef}
              autoComplete="off"
              multiple
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">{t("info")}</label>
          <div className="d-flex align-items-center col-sm-5">
            <label htmlFor="service_phone" className="kp-input-group-prepend">
              <span className="kp-input-group-text">
                <PhoneAndroid />
              </span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="service_phone"
              name="service_phone"
              placeholder="Τηλέφωνο Επικοινωνίας"
              ref={servicePhoneRef}
              autoComplete="off"
              required
            />
          </div>
          <div className="d-flex align-items-center col-sm-5">
            <label htmlFor="service_email" className="kp-input-group-prepend">
              <span className="kp-input-group-text">
                <Email />
              </span>
            </label>
            <input
              type="email"
              className="form-control form-control-sm"
              id="service_email"
              name="service_email"
              placeholder="Email"
              ref={serviceEmailRef}
              autoComplete="off"
              required
            />
          </div>
          <div className="d-flex align-items-center offset-sm-2 col-sm-10 mb-2">
            <label
              htmlFor="service_location"
              className="kp-input-group-prepend"
            >
              <span className="kp-input-group-text">
                <LocationOn />
              </span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="service_location"
              name="service_location"
              placeholder="Σύνδεσμος Χάρτη"
              ref={serviceLocationRef}
              autoComplete="off"
              required
            />
          </div>
          <div className="d-flex offset-sm-2 col-sm-10">
            <label
              htmlFor="service_description"
              className="kp-input-group-prepend"
            >
              <span className="kp-input-group-text">
                <Description />
              </span>
            </label>
            <textarea
              rows={3}
              className="form-control form-control-sm"
              id="service_description"
              name="service_description"
              placeholder="Μια σύντομη περιγραφή..."
              ref={serviceDescription}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row ">
          <div className="offset-sm-2 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              {t("add")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewService;
