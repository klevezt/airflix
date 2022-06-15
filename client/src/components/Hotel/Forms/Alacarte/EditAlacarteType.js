import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditAlacarteType = (props) => {
  const { t } = useTranslation();

  const [editAlacarteTypeName, setEditAlacarteTypeName] = useState(
    props.selectedAlacartType.name
  );
  const [editAlacarteImages, setAlacarteImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const handleNewAlacarteTypeName = (e) => {
    setEditAlacarteTypeName(e.target.value);
  };

  const imageChangeHandler = (e) => {
    setAlacarteImage(e.target.files[0].name);
  };
  const changeImageHandler = () => {
    setImageChange((s) => !s);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleUpdateAlacarteType(
          e,
          editAlacarteTypeName,
          editAlacarteImages
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.toggleEditAlacarteType();
          }}
          text={removeUpperAccents(t("back"))}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{`${t("edit_food")} - a la carte`}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="drink_name" className="col-sm-2 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="drink_name"
              id="drink_name"
              value={editAlacarteTypeName}
              onChange={handleNewAlacarteTypeName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_images" className="col-sm-2 col-form-label">
            {t("change_images")}
          </label>
          <div className="col-sm-10 align-self-center">
            <input
              className="form-check-input"
              type="checkbox"
              id="drink_images"
              autoComplete="off"
              checked={imageChange}
              onChange={changeImageHandler}
            />
          </div>
          {imageChange && (
            <div className="col-sm-10 offset-sm-2">
              <input
                className="form-control form-control-sm"
                type="file"
                autoComplete="off"
                onChange={imageChangeHandler}
              />
            </div>
          )}
        </div>
        <div className="row ">
          <div className="offset-sm-2 offset-0 col-sm-4 col-12">
            <button type="submit" className="btn btn-primary-theme ">
              {t("save")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditAlacarteType;
