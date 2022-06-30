import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditFoodFormType = (props) => {
  const { t } = useTranslation();

  const [editFoodTypeName, setEditFoodNameType] = useState(
    props.selectedFoodType.name
  );

  const handleEditFoodTypeName = (e) => {
    setEditFoodNameType(e.target.value);
  };

  const [editFoodImage, setFoodImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const imageChangeHandler = (e) => {
    setFoodImage(e.target.files[0].name);
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
        props.handleUpdateFoodType(e, editFoodTypeName, editFoodImage)
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.handleBackButton();
          }}
          text={removeUpperAccents(t("back"))}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_food")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="food_type_name" className="col-sm-2 col-form-label">
            {t("food_type")}
          </label>
          <div className="col-sm-10">
            <input
              className="form-control form-control-sm"
              type="text"
              placeholder={t("enter_new_food_name")}
              name="food_type_name"
              id="food_type_name"
              value={editFoodTypeName}
              onChange={handleEditFoodTypeName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_images" className="col-sm-2 col-form-label">
            {t("change_image")}
          </label>
          <div className="col-sm-10 align-self-center">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              autoComplete="off"
              id="drink_images"
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
              {t("update")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditFoodFormType;
