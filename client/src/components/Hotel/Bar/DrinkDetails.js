import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { fetchSingleDrinkFromDB } from "../../../api_requests/hotel_requests";
import { Chip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../UI/Buttons/IconButton";

import "./DrinkDetails.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import { useTranslation } from "react-i18next";

function DrinkDetails() {
  const params = useParams();
  const [state] = useStateValue();
  const { t } = useTranslation();

  const history = useHistory();

  const [drink, setDrink] = useState();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    const exec = () => {
      fetchSingleDrinkFromDB({ alias: params.drinkAlias }, state.token).then(
        (data) => {
          setDrink(data[0]);
          setIsSpinnerLoading(false);
        }
      );
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, [params.drinkAlias]);

  const imagePath = process.env.REACT_APP_IMAGES_URL + "/Images";

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <div className="d-flex align-items-center flex-wrap flex-direction-column">
          <div className="row w-100 mb-3">
            <IconButton
              className="w-auto"
              onClick={() => {
                history.goBack();
              }}
              text="Επιστροφη"
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
                        label={ingredient}
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
                src={`${imagePath}/Drinks/${drink.images[0]}`}
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
