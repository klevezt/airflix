import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchDrinksWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./DrinksDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";
import { checkToken, imageGetter } from "../../../Helpers/Const/constants";
// import ErrorComponent from "../../Error/Error";
import { useTranslation } from "react-i18next";
import { actionTypes } from "../../../reducer";

const DrinksDetailsPage = (props) => {
  const params = useParams();
  const { t } = useTranslation();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [state, dispatch] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [drinkDetails, setDrinkDetails] = useState([]);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const { isExpired, dataaa } = await checkToken(
          state.token,
          state.refreshToken
        );
        const token = isExpired ? dataaa.accessToken : state.token;

        const data = await fetchDrinksWithParamasFromDB(
          { type: params.type },
          token
        );

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        const { myArr } = await imageGetter(data, "Drinks/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/DrinksDetails/useEffect => Drinks imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setDrinkDetails(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.type, state.token]);

  const allDrinkDetails = drinkDetails.map((drink, i) => {
    return (
      <Fragment key={i}>
        <div
          className={`drink-details-each-drink-wrapper d-flex justify-content-between align-items-start ${
            drinkDetails.length - 1 !== i && ""
          }`}
        >
          <img src={`${drink.image}`} alt="drink" />
          <div className="drink-details-each-drink-text text-end">
            <h3>{t(drink.name)}</h3>
            <p>
              {drink.ingredients.map((ing, j) => (
                <Fragment key={j}>
                  <span>{t(ing)}</span>
                  <br />
                </Fragment>
              ))}
            </p>
            <h2>{drink.price}€</h2>
          </div>
        </div>
      </Fragment>
    );
  });

  return (
    <>
      <BookContent
        contentHeadline={params.type}
        details={allDrinkDetails}
        loading={isSpinnerLoading}
      />
    </>
  );
};

export default DrinksDetailsPage;
