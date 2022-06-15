import React, { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { Chip } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import { removeUpperAccents } from "../../../../Helpers/Functions/functions";

const EditDrink = (props) => {
  const { t } = useTranslation();

  const [ingredients, setIngredients] = useState(
    props.selectedDrink.ingredients
  );
  const newIngredientRef = useRef("");

  const [editDrinkName, setEditDrinkName] = useState(props.selectedDrink.name);
  const [editDrinkType, setEditDrinkType] = useState(props.selectedDrink.type);

  const [editDrinkDescription, setEditDrinkDescription] = useState(
    props.selectedDrink.description
  );

  const [editDrinkImages, setDrinkImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const [showIngredientOptions, setShowIngredientOptions] = useState(true);
  const [editPrice, setEditPrice] = useState(props.selectedDrink.price);

  const handleNewDrinkDescription = (e) => {
    setEditDrinkDescription(e.target.value);
  };
  const handleNewDrinkName = (e) => {
    setEditDrinkName(e.target.value);
  };
  const handleNewDrinkType = (e) => {
    setEditDrinkType(e.target.value);
    if (e.target.value === "Cocktail") {
      setShowIngredientOptions(true);
    } else {
      setShowIngredientOptions(false);
    }
  };
  const handleNewDrinkPrice = (e) => {
    setEditPrice(e.target.value);
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

  const imageChangeHandler = (e) => {
    setDrinkImage(e.target.files[0].name);
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
        props.handleUpdateDrink(
          e,
          editDrinkName,
          editDrinkType,
          editDrinkImages,
          editDrinkDescription,
          editPrice,
          ingredients
        )
      }
    >
      <div className="form-header">
        <IconButton
          className="form-back-button"
          onClick={() => {
            props.toggleEditDrink();
          }}
          text={removeUpperAccents(t("back"))}
          icon={<UndoIcon />}
          color="warning"
          variant="contained"
        />

        <h2 className="form-headline">{t("edit_drink")}</h2>
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
              value={editDrinkName}
              onChange={handleNewDrinkName}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_type" className="col-sm-2 col-form-label">
            {t("type")}
          </label>
          <div className="col-sm-10">
            <select
              className="form-select mt-2 mb-3"
              name="drink_type"
              id="drink_type"
              defaultValue={editDrinkType}
              onChange={handleNewDrinkType}
              required
            >
              <option value="">-</option>
              {props.drinkTypes.map((drinkType, i) => {
                return (
                  drinkType.status && (
                    <option
                      value={drinkType.name}
                      key={i}
                      defaultValue={drinkType.name}
                    >
                      {drinkType.name}
                    </option>
                  )
                );
              })}
            </select>
          </div>
          {showIngredientOptions && (
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
          )}
        </div>
        <div className="row mb-3">
          <label htmlFor="drink_images" className="col-sm-2 col-form-label">
            {t("change_images")}
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
        <div className="row mb-3">
          <label htmlFor="drink_desc" className="col-sm-2 col-form-label">
            {t("description")}
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control mt-2 mb-2"
              name="drink_desc"
              id="drink_desc"
              rows="5"
              value={editDrinkDescription}
              onChange={handleNewDrinkDescription}
            ></textarea>
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="drink_price" className="col-sm-2 col-form-label">
            {t("price")} (€)
          </label>
          <div className="mb-3 col-sm-10">
            <input
              type="text"
              id="drink_price"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              value={editPrice}
              onChange={handleNewDrinkPrice}
              autoComplete="off"
            />
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

export default EditDrink;
