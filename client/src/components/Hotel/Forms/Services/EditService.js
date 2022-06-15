import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";
import {
  PhoneAndroid,
  Email,
  LocationOn,
  Description,
} from "@mui/icons-material";

const EditService = (props) => {
  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const [addNewImage, setAddNewImage] = useState(false);

  const [newServiceName, setNewServiceName] = useState(props.editService.name);
  const [newServicePhone, setNewServicePhone] = useState(
    props.editService.phone
  );
  const [newServiceEmail, setNewServiceEmail] = useState(
    props.editService.email
  );
  const [newServiceLocation, setNewServiceLocation] = useState(
    props.editService.location
  );
  const [newServiceDescription, setNewServiceDescription] = useState(
    props.editService.description
  );

  const handleServiceName = (e) => {
    setNewServiceName(e.target.value);
  };
  const handleServicePhone = (e) => {
    setNewServicePhone(e.target.value);
  };
  const handleServiceEmail = (e) => {
    setNewServiceEmail(e.target.value);
  };
  const handleServiceLocation = (e) => {
    setNewServiceLocation(e.target.value);
  };
  const handleServiceDescription = (e) => {
    setNewServiceDescription(e.target.value);
  };

  const handleChangeImage = () => {
    setAddNewImage((s) => !s);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleUpdateService(
          e,
          newServiceName,
          addNewImage ? "" : props.editService.image,
          newServicePhone,
          newServiceEmail,
          newServiceLocation,
          newServiceDescription
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.goBack();
          }}
          text={translate("back")}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_info")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="service_name" className="col-sm-3 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-9">
            <input
              type="text"
              className="form-control form-control-sm"
              name="service_name"
              id="service_name"
              value={newServiceName}
              onChange={handleServiceName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="changeImg" className="col-sm-3 col-form-label">
            {t("change_images")}
          </label>
          <div className="col-sm-3 align-self-center">
            <input
              onChange={handleChangeImage}
              className="form-check-input"
              type="checkbox"
              id="changeImg"
              checked={addNewImage}
              autoComplete="off"
            />
          </div>
        </div>
        {addNewImage && (
          <div className="row mb-3">
            <label htmlFor="service_image" className="col-sm-3 col-form-label">
              {t("new_image")}
            </label>
            <div className="col-sm-9">
              <input
                className="form-control form-control-sm"
                type="file"
                name="service_image"
                id="service_image"
                autoComplete="off"
              />
            </div>
          </div>
        )}
        <div className="row mb-3">
          <label className="col-sm-3 col-form-label">{t("info")}</label>
          <div className="d-flex align-items-center col-sm-4">
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
              value={newServicePhone}
              onChange={handleServicePhone}
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
              value={newServiceEmail}
              onChange={handleServiceEmail}
              autoComplete="off"
              required
            />
          </div>
          <div className="d-flex align-items-center offset-sm-3 col-sm-9 mb-2">
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
              value={newServiceLocation}
              onChange={handleServiceLocation}
              autoComplete="off"
              required
            />
          </div>
          <div className="d-flex offset-sm-3 col-sm-9">
            <label
              htmlFor="service_description"
              className="kp-input-group-prepend"
            >
              <span className="kp-input-group-text">
                <Description />
              </span>
            </label>
            <textarea
              rows={4}
              className="form-control form-control-sm"
              id="service_description"
              name="service_description"
              value={newServiceDescription}
              onChange={handleServiceDescription}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row ">
          <div className="offset-sm-3 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              {t("update")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditService;
