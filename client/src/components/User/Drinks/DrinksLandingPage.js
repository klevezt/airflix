import React, { useEffect, useState } from "react";
// import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./DrinksLandingPage.css";
import { fetchDrinksTypesFromDB } from "../../../api_requests/hotel_requests";
import { useStateValue } from "../../../StateProvider";

import BookCover from "../../UI/Book/BookCover";
import { checkToken, imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";
import { useTranslation } from "react-i18next";
import { actionTypes } from "../../../reducer";

const DrinksLandingPage = () => {
  const [state, dispatch] = useStateValue();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [catalog, setCatalog] = useState([]);

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

        const drinks = await fetchDrinksTypesFromDB(token);

        // ---- Error Handler ---- //
        if (drinks.error) {
          setErrorMessage(drinks.error.msg);
          throw new Error(drinks.error.msg);
        }

        dispatch({
          type: actionTypes.SET_NEW_JWT_TOKEN,
          token: token,
        });

        const { myArr } = await imageGetter(drinks, "Drinks/", true);

        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/DrinksLandingPage/useEffect => Drinks imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }
        setCatalog(myArr);

        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [dispatch, state.token, state.refreshToken]);

  const drinkCatalog = catalog.map((drink, i) => {
    return (
      <Link
        to={`/drinks/${drink.name}/detail`}
        className="drinkTypes-user-box"
        key={i}
      >
        <div className="img-wrapper">
          <img className="w-100" src={`${drink.image}`} alt="drink-img" />
        </div>
        <div className="drinkTypes-user-box__bookmark-text-wrapper">
          <h2>{t(drink.name)}</h2>
        </div>
      </Link>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <div className="row">
          <BookCover
            coverHeadline="Κατάλογος Ποτών"
            catalog={drinkCatalog}
            preferencesQuestions
          />
        </div>
      )}
    </>
  );
};

export default DrinksLandingPage;
