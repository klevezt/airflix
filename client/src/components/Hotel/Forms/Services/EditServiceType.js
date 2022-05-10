import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditServiceType = (props) => {
  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const newImageRef = useRef("");

  const [selectedInfoName, setSelectedInfoName] = useState(
    props.serviceType.name
  );
  const [imageChange, setImageChange] = useState(false);

  const handleChangeInfoName = (e) => {
    setSelectedInfoName(e.target.value);
  };

  const handleChangeImage = () => {
    setImageChange((s) => !s);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleUpdateServiceType(
          e,
          props.serviceType._id,
          selectedInfoName
          // newImageRef.current.files !== "" ? newImageRef.current.files : ""
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.handleBackButton();
          }}
          text={`${translate("back")}`}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_service")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="info_name" className="col-sm-2 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="info_name"
              id="info_name"
              autoComplete="off"
              value={selectedInfoName}
              onChange={handleChangeInfoName}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="changePSW" className="col-sm-2 col-form-label">
            Νέα Εικόνα
          </label>
          <div className="col-sm-10 align-self-center">
            <input
              onChange={handleChangeImage}
              className="form-check-input"
              type="checkbox"
              id="changePSW"
              checked={imageChange}
              autoComplete="off"
            />
          </div>
        </div>
        {imageChange && (
          <div className="row mb-3">
            <label htmlFor="info_image" className="col-sm-2 col-form-label">
              Εικόνα
            </label>
            <div className="col-sm-10">
              <input
                className="form-control form-control-sm"
                type="file"
                name="info_image"
                id="info_image"
                ref={newImageRef}
                autoComplete="off"
                multiple
              />
            </div>
          </div>
        )}
        <div className="row ">
          <div className="offset-sm-2 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme">
              {t("update")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditServiceType;
