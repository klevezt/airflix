import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchDrinksWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./DrinksDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";

const DrinksDetailsPage = (props) => {
  const params = useParams();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [state] = useStateValue();

  const [drinkDetails, setDrinkDetails] = useState([]);

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchDrinksWithParamasFromDB(
        "type=" + params.type,
        state.token
      );

      const { myArr } = await imageGetter(data, "Drinks/");

      setDrinkDetails(myArr);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
  }, [params.type]);

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
            <h3>{drink.name}</h3>
            <p>
              {drink.ingredients.map((ing, j) => (
                <Fragment key={j}>
                  <span>{ing}</span>
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
