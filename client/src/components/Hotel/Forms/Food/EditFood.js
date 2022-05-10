import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { Chip } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

const EditFoodForm = (props) => {
  const { t } = useTranslation();

  const [editFoodName, setEditFoodName] = useState(props.selectedFood.name);
  const [editFoodType, setEditFoodType] = useState(props.selectedFood.type);
  const [editFoodDescription, setEditFoodDescription] = useState(
    props.selectedFood.description
  );
  const newIngredientRef = useRef("");
  const newSpecialFeaturesRef = useRef("");

  const [ingredients, setIngredients] = useState(
    props.selectedFood.ingredients
  );
  const [specialFeatures, setSpecialFeatures] = useState(
    props.selectedFood.special_features
  );

  const handleEditFoodDescription = (e) => {
    setEditFoodDescription(e.target.value);
  };
  const handleEditFoodName = (e) => {
    setEditFoodName(e.target.value);
  };
  const handleEditFoodType = (e) => {
    setEditFoodType(e.target.value);
  };

  const [editFoodImage, setFoodImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const imageChangeHandler = (e) => {
    setFoodImage(e.target.files[0].name);
  };
  const changeImageHandler = () => {
    setImageChange((s) => !s);
  };

  const handleNewIngredient = () => {
    const arr = [];
    arr.push(newIngredientRef.current.value);
    setIngredients([...ingredients, arr[0]]);
    newIngredientRef.current.value = "";
  };

  const handleRemoveIngredient = (index) => {
    const arr = ingredients.filter((_, i) => i !== index);
    setIngredients(arr);
  };

  const handleNewSpecialFeatures = () => {
    const arr = [];
    arr.push(newSpecialFeaturesRef.current.value);
    setSpecialFeatures([...specialFeatures, arr[0]]);
    newSpecialFeaturesRef.current.value = "";
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
        props.handleUpdateFood(
          e,
          editFoodName,
          editFoodType,
          editFoodImage,
          editFoodDescription,
          ingredients,
          specialFeatures
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.handleBackButton();
          }}
          text="Επιστροφη"
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_food")}</h2>
        <hr className="m-0" />
      </div>
      <div className="container">
        <div className="row mb-3">
          <label htmlFor="food_name" className="col-sm-2 col-form-label">
            Ονομασία Φαγητού
          </label>
          <div className="col-sm-10">
            <input
              className="form-control form-control-sm"
              type="text"
              name="food_name"
              id="food_name"
              value={editFoodName}
              onChange={handleEditFoodName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="food_type" className="col-sm-2 col-form-label">
            Τύπος Φαγητού
          </label>
          <div className="col-sm-10">
            <select
              className="form-select mt-2 mb-3"
              name="food_type"
              id="food_type"
              onChange={handleEditFoodType}
              defaultValue={editFoodType}
              required
            >
              <option value="">-</option>
              {props.foodTypes.map((foodType) => {
                return (
                  foodType.status && (
                    <option
                      value={foodType.name}
                      key={foodType._id}
                      defaultChecked={editFoodType === foodType.name}
                    >
                      {foodType.name}
                    </option>
                  )
                );
              })}
            </select>
          </div>
          <div className="col-sm-10 offset-sm-2">
            <div className="row">
              <label htmlFor="ing" className="col-sm-12 col-form-label">
                Συστατικά:
                {ingredients.map((ingredient, i) => {
                  return (
                    <Chip
                      className="mx-2 my-1"
                      label={ingredient}
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
                  placeholder="Προσθήκη νέου συστατικού"
                  className="form-control form-control-sm"
                  id="ingr"
                  autoComplete="off"
                  ref={newIngredientRef}
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
                Ιδιαίτερα χαρακτηριστικά:
                {specialFeatures.map((features, i) => {
                  return (
                    <Chip
                      className="mx-2 my-1"
                      label={features}
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
                  placeholder="Προσθήκη νέου χαρακτηριστικού"
                  className="form-control form-control-sm"
                  id="feature"
                  autoComplete="off"
                  ref={newSpecialFeaturesRef}
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
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_images" className="col-sm-2 col-form-label">
            {t("Αλλαγή εικόνων")}
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
        <div className="row mb-3">
          <label htmlFor="food_desc" className="col-sm-2 col-form-label">
            Περιγραφή Φαγητού
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control mt-2 mb-2"
              name="food_desc"
              id="food_desc"
              rows="5"
              value={editFoodDescription}
              onChange={handleEditFoodDescription}
            ></textarea>
          </div>
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

export default EditFoodForm;
