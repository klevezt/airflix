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
import ErrorComponent from "../../../Error/Error";

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

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const [ingredients, setIngredients] = useState([]);
  const [alacartType, setAlacarteTypes] = useState();

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      setIsSpinnerLoading(true);

      try {
        const data = await fetchFoodTypesAlacarteFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setAlacarteTypes(data);
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
    setIsSpinnerLoading(true);

    try {
      const name = nameRef.current.value;
      const alias = name.replace(/\s+/g, "-").toLowerCase();
      const type = typeRef.current.value;
      const images = imageRef.current.files;
      const description = descriptionRef.current.value;
      const price = priceRef.current.value;

      const result = await addAlacarte(
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
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      history.replace("/alacarte");
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
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
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
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
              text={t("back")}
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
              <label className="col-sm-2 col-form-label">{t("image")}</label>
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
                {t("price")} (€)
              </label>
              <div className="mb-3 col-sm-10">
                <input
                  type="text"
                  id="drink_price"
                  className="form-control"
                  aria-label="Euro amount (with dot and two decimal places)"
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
