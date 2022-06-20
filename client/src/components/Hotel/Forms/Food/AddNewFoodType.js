import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { useHistory } from "react-router";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewFoodTypeForm = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const newFoodTypeName = useRef("");
  const newFoodTypeProperty = useRef("");
  const imageRef = useRef("");

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleAddNewFoodType(
          e,
          newFoodTypeName.current.value,
          newFoodTypeName.current.value.replace(/\s+/g, "-").toLowerCase(),
          // newFoodTypeProperty.current.value,
          imageRef.current.files[0]
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            history.goBack();
          }}
          text={removeUpperAccents(t("back"))}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />
        <h2 className="form-headline">{t("new_food_type")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="drink_type_name" className="col-sm-2 col-form-label">
            {t("type")}
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              name="drink_type_name"
              id="drink_type_name"
              className="form-control form-control-sm"
              ref={newFoodTypeName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">{t("image")}</label>
          <div className="col-sm-10">
            <input
              className="form-control form-control-sm"
              type="file"
              autoComplete="off"
              ref={imageRef}
            />
          </div>
        </div>
        {/* <div className="row mb-3">
          <label
            htmlFor="property_type_name"
            className="col-sm-2 col-form-label"
          >
            {t("Property")}
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              name="property_type_name"
              id="property_type_name"
              className="form-control form-control-sm"
              ref={newFoodTypeProperty}
              autoComplete="off"
              required
            />
          </div>
        </div> */}
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

export default AddNewFoodTypeForm;
