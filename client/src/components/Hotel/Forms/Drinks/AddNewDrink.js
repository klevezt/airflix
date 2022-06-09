import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { addDrink } from "../../../../api_requests/hotel_requests";
import { fetchDrinksTypesFromDB } from "../../../../api_requests/hotel_requests";

import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { AddCircleOutline } from "@mui/icons-material";
import { Chip } from "@mui/material";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";
import ErrorComponent from "../../../Error/Error";

const AddNewDrink = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  const history = useHistory();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef("");
  const typeRef = useRef("");
  const imageRef = useRef("");
  const descriptionRef = useRef("");
  const priceRef = useRef("");
  const newIngredientRef = useRef("");

  const [drinkType, setDrinkTypes] = useState();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      try {
        const data = await fetchDrinksTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setDrinkTypes(data);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = nameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const type = typeRef.current.value;
      const images = imageRef.current.files;
      const description = descriptionRef.current.value;
      const price = priceRef.current.value;

      const res = await addDrink(
        name,
        alias,
        type,
        images,
        description,
        price,
        ingredients,
        state.token
      );
      // ---- Error Handler ---- //
      if (res.error) {
        setErrorMessage(res.error.msg);
        throw new Error(res.error.msg);
      }
      history.replace("/bar");
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleNewIngredient = () => {
    if (newIngredientRef.current.value !== "") {
      const arr = [];
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
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <form
          method="POST"
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
              text={t("back")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />

            <h2 className="form-headline">{t("new_drink")}</h2>
          </div>
          <div className="container">
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
                {t("name")}
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputEmail3"
                  autoComplete="off"
                  ref={nameRef}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputEmail32" className="col-sm-2 col-form-label">
                {t("type")}
              </label>
              <div className="col-sm-10">
                <select
                  className="form-select form-select-lg mt-2 mb-3"
                  name="drink_type"
                  id="drink_type"
                  ref={typeRef}
                  required
                >
                  <option value="">-</option>
                  {drinkType.map((foodType, i) => {
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
            </div>

            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">{t("image")}</label>
              <div className="col-sm-10">
                <input
                  className="form-control form-control-sm"
                  type="file"
                  multiple
                  autoComplete="off"
                  ref={imageRef}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="col-sm-2 col-form-label"
              >
                {t("description")}
              </label>
              <div className="col-sm-10">
                <textarea
                  className="form-control form-control-sm"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  ref={descriptionRef}
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
                  autoComplete="off"
                  ref={priceRef}
                  required
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

export default AddNewDrink;
