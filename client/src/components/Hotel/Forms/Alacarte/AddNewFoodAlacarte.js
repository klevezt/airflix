import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { AddCircleOutline } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { addAlacarte } from "../../../../api_requests/hotel_requests";
import { fetchFoodTypesAlacarteFromDB } from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";

const AddNewFoodForm = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const history = useHistory();

  const nameRef = useRef("");
  const typeRef = useRef("");
  const imageRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const newIngredientRef = useRef("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const [ingredients, setIngredients] = useState([]);
  const [alacartType, setAlacarteTypes] = useState();

  useEffect(() => {
    fetchFoodTypesAlacarteFromDB(state.token).then((data) => {
      setAlacarteTypes(data);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const alias = name.replace(/\s+/g, "-").toLowerCase();
    const type = typeRef.current.value;
    const images = imageRef.current.files;
    const description = descriptionRef.current.value;
    const price = priceRef.current.value;

    addAlacarte(
      name,
      alias,
      type,
      images,
      description,
      price,
      ingredients,
      state.token
    )
      .then(() => {
        history.replace("/alacarte");
      })
      .catch(() => {
        history.replace("/alacarte");
      });
  };

  const handleNewIngredient = () => {
    const arr = [];
    if (newIngredientRef.current.value !== "") {
      arr.push(newIngredientRef.current.value);
      setIngredients([...ingredients, arr[0]]);
      newIngredientRef.current.value = "";
    }
  };

  const handleRemoveIngredient = (index) => {
    const arr = ingredients.filter((_, i) => i !== index);
    setIngredients(arr);
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <form
          method="post"
          encType="multipart/form-data"
          className="general-form"
          onSubmit={handleFormSubmit}
        >
          <div className="form-header">
            <IconButton
              className="form-back-button"
              onClick={() => {
                history.goBack();
              }}
              text="Επιστροφη"
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{`${t("new_food")} - a la carte`}</h2>
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
                  ref={typeRef}
                  required
                >
                  <option value="">-</option>
                  {alacartType.map((foodType) => {
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
              <div className="col-sm-10 offset-sm-2">
                <div className="row">
                  <label className="col-sm-12 col-form-label">
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
                      id="alacarte-ingredients"
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
              <label className="col-sm-2 col-form-label">Εικόνες</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  multiple
                  ref={imageRef}
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
            <div className="row mb-3">
              <label htmlFor="drink_price" className="col-sm-2 col-form-label">
                Τιμή (€)
              </label>
              <div className="mb-3 col-sm-10">
                <input
                  type="text"
                  id="drink_price"
                  className="form-control"
                  aria-label="Dollar amount (with dot and two decimal places)"
                  autoComplete="off"
                  ref={priceRef}
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
      )}
    </>
  );
};

export default AddNewFoodForm;
