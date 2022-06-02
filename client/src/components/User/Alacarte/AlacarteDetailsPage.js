import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchAlacarteWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./AlacarteDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";

const AlacarteDetailsPage = () => {
  const params = useParams();
  const [state] = useStateValue();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

  const [alacarteDetails, setAlacarteDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchAlacarteWithParamasFromDB(
        "type=" + params.type,
        state.token
      );
      const { myArr } = await imageGetter(data, "Alacarte/");

      setAlacarteDetails(myArr);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.type]);

  const allDrinkDetails = alacarteDetails.map((alacarte, i) => {
    return (
      <Fragment key={i}>
        <div className="drink-details-each-drink-wrapper d-flex justify-content-between align-items-start">
          <img src={`${alacarte.image}`} alt="alacarte" />
          <div className="drink-details-each-drink-text text-end">
            <h3>{alacarte.name}</h3>
            <p>
              {alacarte.ingredients.map((ing, j) => (
                <Fragment key={j}>
                  <span>{ing}</span>
                  <br />
                </Fragment>
              ))}
            </p>
            <h2>{alacarte.price}€</h2>
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

export default AlacarteDetailsPage;
