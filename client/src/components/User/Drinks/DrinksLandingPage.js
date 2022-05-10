import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import "./DrinksLandingPage.css";
import { fetchDrinksTypesFromDB } from "../../../api_requests/hotel_requests";
import { useStateValue } from "../../../StateProvider";

import BookCover from "../../UI/Book/BookCover";

const DrinksLandingPage = () => {
  const [state] = useStateValue();

  // const { t } = useTranslation();
  // const translate = (text) => removeUpperAccents(t(text));
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const drinks = await fetchDrinksTypesFromDB(state.token);
      setCatalog(drinks);

      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
  }, []);

  const drinkCatalog = catalog.map((drink, i) => {
    return (
      <Link
        to={`/drinks/${drink.name}/detail`}
        className="drinkTypes-user-box"
        key={i}
      >
        <div className="img-wrapper">
          <img
            className="w-100"
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Drinks/${drink.images[0]}`}
            alt="drink-img"
          />
        </div>
        <div className="drinkTypes-user-box__bookmark-text-wrapper">
          <h2>{drink.name}</h2>
        </div>
      </Link>
    );
  });

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
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
