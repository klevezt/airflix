import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchBuffetWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./BuffetDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";

const BuffetDetailsPage = () => {
  const params = useParams();
  const [state] = useStateValue();

  const [buffetDetails, setBuffetDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    setIsSpinnerLoading(true);
    const exec = async () => {
      const data = await fetchBuffetWithParamasFromDB(
        "type=" + params.type,
        state.token
      );

      const { myArr } = await imageGetter(data, "Food/");

      setBuffetDetails(myArr);
      setTimeout(() => {
        setIsSpinnerLoading(false);
      }, 500);
    };
    exec();
  }, [params.type]);

  const allBuffetDetails = buffetDetails.map((buffet, i) => {
    return (
      <Fragment key={i}>
        <div className="drink-details-each-drink-wrapper d-flex justify-content-between align-items-start pb-4">
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Food/${buffet.images[0]}`}
            alt="buffet"
          />
          <div className="drink-details-each-drink-text text-end">
            <h3>{buffet.name}</h3>
            <p>
              {buffet.ingredients.map((ing, j) => (
                <Fragment key={j}>
                  <span>{ing}</span>
                  <br />
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </Fragment>
    );
  });

  return (
    <BookContent
      contentHeadline={params.type}
      details={allBuffetDetails}
      loading={isSpinnerLoading}
    />
  );
};

export default BuffetDetailsPage;
