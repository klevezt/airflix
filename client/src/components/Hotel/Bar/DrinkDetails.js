import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { fetchSingleDrinkFromDB } from "../../../api_requests/hotel_requests";
import { Chip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../UI/Buttons/IconButton";

import ErrorComponent from "../../Error/Error";

import "./DrinkDetails.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";
import { imageGetter } from "../../../Helpers/Const/constants";

function DrinkDetails() {
  const params = useParams();
  const [state] = useStateValue();
  const { t } = useTranslation();

  const history = useHistory();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [drink, setDrink] = useState();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);

    const exec = async () => {
      try {
        const data = await fetchSingleDrinkFromDB(
          { alias: params.drinkAlias },
          state.token
        );
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data[0], "Drinks/", true);
        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error = "Hotel/DrinkDetails/useEffect => Drink imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setDrink(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.drinkAlias]);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="d-flex align-items-center flex-wrap flex-direction-column">
          <div className="row w-100 mb-3">
            <IconButton
              className="w-auto"
              onClick={() => {
                history.goBack();
              }}
              text={t("back")}
              icon={<UndoIcon />}
              color="warning"
              variant="contained"
            />
          </div>
          <div className="row w-100 mb-3">
            <div className="max-width-50">
              <h1>{drink.name}</h1>
              <hr />
              <h6>{drink.description}</h6>
              {drink.ingredients.length !== 0 && (
                <>
                  <hr />
                  <h4>{t("ingredients")}:</h4>
                  {drink.ingredients.map((ingredient, i) => {
                    return (
                      <Chip
                        label={t(ingredient)}
                        color="primary"
                        className="my-2 mx-2 chip"
                        key={i}
                      />
                    );
                  })}
                </>
              )}
              <hr />
              <h4>
                {t("price")}: {drink.price}€
              </h4>
            </div>
            <div className="col-6 image-container">
              <img
                src={drink.image}
                alt={drink.name}
              />
            </div>
          </div>
          {/* <Reviews data={drink} /> */}
        </div>
      )}
    </>
  );
}

export default DrinkDetails;
