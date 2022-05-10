import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../../UI/Buttons/IconButton";
import { useHistory } from "react-router";
import { addFoodTypeAlacarte } from "../../../../api_requests/hotel_requests";
import { fetchFoodTypesAlacarteFromDB } from "../../../../api_requests/hotel_requests";
import LoadingSpinner from "../../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../../StateProvider";

const AddNewFoodTypeFormAlacarte = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const history = useHistory();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const newFoodTypeName = useRef("");
  const imageRef = useRef("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSpinnerLoading(true);

    const name = newFoodTypeName.current.value;
    const image = imageRef.current.files;

    await addFoodTypeAlacarte(name, image, state.token);
    await fetchFoodTypesAlacarteFromDB(state.token)
      .then(() => {
        setIsSpinnerLoading(false);
        history.replace("/alacarte/edit-food-type");
      })
      .catch(() => {
        history.replace("/alacarte/edit-food-type");
      });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <form
          method="post"
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

            <h2 className="form-headline">{`${t(
              "new_food_type"
            )} - a la carte`}</h2>
            <hr className="m-0" />
          </div>
          <div className="container">
            <div className="row mb-3">
              <label
                htmlFor="drink_type_name"
                className="col-sm-2 col-form-label"
              >
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
              <label className="col-sm-2 col-form-label">Εικόνα</label>
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

export default AddNewFoodTypeFormAlacarte;
