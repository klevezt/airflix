import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchBuffetWithParamasFromDB } from "../../../api_requests/hotel_requests";
import "./BuffetDetailsPage.css";
import BookContent from "../../UI/Book/BookContent";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";
import ErrorComponent from "../../Error/Error";
import { useTranslation } from "react-i18next";

const BuffetDetailsPage = () => {
  const { t } = useTranslation();

  const params = useParams();
  const [state] = useStateValue();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [buffetDetails, setBuffetDetails] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const data = await fetchBuffetWithParamasFromDB(
          "type=" + params.type,
          state.token
        );

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        const { myArr } = await imageGetter(data, "Food/");
        // ---- Error Handler ---- //
        if (myArr === undefined || myArr === null) {
          let tmp_error =
            "User/BuffetDetailsPage/useEffect => Food imageGetter Problem";
          setErrorMessage(tmp_error);
          throw new Error(tmp_error);
        }

        setBuffetDetails(myArr);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [params.type]);

  const allBuffetDetails = buffetDetails.map((buffet, i) => {
    return (
      <Fragment key={i}>
        <div className="drink-details-each-drink-wrapper d-flex justify-content-between align-items-start pb-4">
          <img src={buffet.image} alt="buffet" />
          <div className="drink-details-each-drink-text text-end">
            <h3>{t(buffet.name)}</h3>
            <p>
              {buffet.ingredients.map((ing, j) => (
                <Fragment key={j}>
                  <span>{t(ing)}</span>
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
