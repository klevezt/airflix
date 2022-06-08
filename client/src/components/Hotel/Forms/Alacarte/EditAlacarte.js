import React, { useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { Chip } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

const EditAlacarte = (props) => {
  const { t } = useTranslation();

  const [ingredients, setIngredients] = useState(props.selected.ingredients);
  const newIngredientRef = useRef("");

  const [editDrinkName, setEditDrinkName] = useState(props.selected.name);
  const [editDrinkType, setEditDrinkType] = useState(props.selected.type);
  const [editDrinkDescription, setEditDrinkDescription] = useState(
    props.selected.description
  );
  const [editDrinkImages, setAlacarteImage] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const [editPrice, setEditPrice] = useState(props.selected.price);

  const handleNewDrinkDescription = (e) => {
    setEditDrinkDescription(e.target.value);
  };
  const handleNewDrinkName = (e) => {
    setEditDrinkName(e.target.value);
  };
  const handleNewDrinkType = (e) => {
    setEditDrinkType(e.target.value);
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
    setAlacarteImage(e.target.files[0].name);
  };
  const changeImageHandler = () => {
    setImageChange((s) => !s);
  };

  return (
    <>
      <form
        method="post"
        encType="multipart/form-data"
        className="general-form"
        onSubmit={(e) =>
          props.handleUpdateAlacarte(
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
              props.toggleEditAlacarte();
            }}
            text={t("Επιστροφη")}
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
                className="form-select  mt-2 mb-3"
                name="drink_type"
                id="drink_type"
                defaultValue={editDrinkType}
                onChange={handleNewDrinkType}
                required
              >
                <option value="">-</option>
                {props.alacarteTypes.map((drinkType, i) => {
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
            <div className="col-sm-10 offset-sm-2">
              <div className="row">
                <label htmlFor="ingr" className="col-sm-12 col-form-label">
                  {t("ingredients")}:
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
    </>
  );
};

export default EditAlacarte;
