import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import { AddCircleOutline } from "@mui/icons-material";
import { Chip } from "@mui/material";
import IconButton from "../../../UI/Buttons/IconButton";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const AddNewFoodForm = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const nameRef = useRef("");
  const imageRef = useRef("");
  const descriptionRef = useRef("");
  const ingredientsRef = useRef("");
  const specialFeaturesRef = useRef("");

  const [newFoodType, setNewFoodType] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [specialFeatures, setSpecialFeatures] = useState([]);

  const handleNewFoodType = (e) => {
    setNewFoodType(e.target.value);
  };

  const handleNewIngredient = () => {
    if (ingredientsRef.current.value !== "") {
      const arr = [];
      arr.push(ingredientsRef.current.value);
      setIngredients([...ingredients, arr[0]]);
      ingredientsRef.current.value = "";
    }
  };

  const handleNewSpecialFeatures = () => {
    if (specialFeaturesRef.current.value !== "") {
      const arr = [];
      arr.push(specialFeaturesRef.current.value);
      setSpecialFeatures([...specialFeatures, arr[0]]);
      specialFeaturesRef.current.value = "";
    }
  };

  const handleRemoveIngredient = (index) => {
    const arr = ingredients.filter((_, i) => i !== index);
    setIngredients(arr);
  };

  const handleRemoveSpecialFeatures = (index) => {
    const arr = specialFeatures.filter((_, i) => i !== index);
    setSpecialFeatures(arr);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="general-form"
      onSubmit={(e) =>
        props.handleAddNewFood(
          e,
          nameRef.current.value,
          newFoodType,
          imageRef.current.files[0],
          ingredients,
          specialFeatures,
          descriptionRef.current.value
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

        <h2 className="form-headline">{t("new_food")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="food_name" className="col-sm-2 col-form-label">
            {t("name")}
          </label>

          <div className="col-sm-10">
            <input
              type="text"
              className="form-control form-control-sm"
              name="food_name"
              id="food_name"
              ref={nameRef}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="food_type" className="col-sm-2 col-form-label">
            {t("type")}
          </label>
          <div className="col-sm-10">
            <select
              className="form-select form-select-lg mt-2 mb-3"
              name="food_type"
              id="food_type"
              onChange={handleNewFoodType}
              required
            >
              <option value="">-</option>
              {props.tableFoodTypeState.map((foodType) => {
                return (
                  foodType.status && (
                    <option
                      value={foodType.name}
                      key={foodType._id}
                      defaultValue={foodType.name}
                    >
                      {foodType.name}
                    </option>
                  )
                );
              })}
            </select>
          </div>
        </div>

        <div className="col-sm-10 offset-sm-2">
          <div className="row">
            <label htmlFor="ingr" className="col-sm-12 col-form-label">
              {t("ingredients")}:
              {ingredients.map((ingredient, i) => {
                return (
                  <Chip
                    className="mx-2 my-1"
                    label={t(ingredient)}
                    onDelete={() => handleRemoveIngredient(i)}
                    color="primary"
                    key={i}
                  />
                );
              })}
            </label>

            <div className="col-sm-5">
              <input
                type="text"
                placeholder={t("add_new_ingredient")}
                className="form-control form-control-sm"
                id="ingr"
                ref={ingredientsRef}
                autoComplete="off"
              />
            </div>
            <div className="w-auto align-self-center">
              <IconButton
                className="justify-self-center"
                icon={<AddCircleOutline />}
                color="warning"
                variant="contained"
                onClick={handleNewIngredient}
              />
            </div>
            <hr />
          </div>
        </div>

        <div className="col-sm-10 offset-sm-2">
          <div className="row">
            <label htmlFor="feature" className="col-sm-12 col-form-label">
              {t("special_features")}:
              {specialFeatures.map((feature, i) => {
                return (
                  <Chip
                    className="mx-2 my-1"
                    label={t(feature)}
                    onDelete={() => handleRemoveSpecialFeatures(i)}
                    color="primary"
                    key={i}
                  />
                );
              })}
            </label>

            <div className="col-sm-5">
              <input
                type="text"
                placeholder={t("add_new_feature")}
                className="form-control form-control-sm"
                id="feature"
                ref={specialFeaturesRef}
                autoComplete="off"
              />
            </div>
            <div className="w-auto align-self-center">
              <IconButton
                className="justify-self-center"
                icon={<AddCircleOutline />}
                color="warning"
                variant="contained"
                onClick={handleNewSpecialFeatures}
              />
            </div>
            <hr />
          </div>
        </div>

        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">{t("image")}</label>
          <div className="col-sm-10">
            <input
              className="form-control form-control-sm"
              type="file"
              ref={imageRef}
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="food_desc" className="col-sm-2 col-form-label">
            {t("description")}
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control mt-2 mb-2"
              name="food_desc"
              id="food_desc"
              rows="5"
              ref={descriptionRef}
            ></textarea>
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

export default AddNewFoodForm;
