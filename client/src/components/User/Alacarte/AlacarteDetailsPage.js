import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchAlacarteWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./AlacarteDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";

const AlacarteDetailsPage = (props) => {
  const params = useParams();
  const [state] = useStateValue();

  const [alacarteDetails, setAlacarteDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchAlacarteWithParamasFromDB(
        "type=" + params.type,
        state.token
      );
      setAlacarteDetails(data);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
  }, [params.type]);

  const allDrinkDetails = alacarteDetails.map((alacarte, i) => {
    return (
      <Fragment key={i}>
        <div className="drink-details-each-drink-wrapper d-flex justify-content-between align-items-start">
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Alacarte/${alacarte.images[0]}`}
            alt="alacarte"
          />
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
      {/* <Book /> */}
      <BookContent
        contentHeadline={params.type}
        details={allDrinkDetails}
        loading={isSpinnerLoading}
      />
    </>
  );
};

export default AlacarteDetailsPage;
