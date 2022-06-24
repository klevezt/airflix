import React, { useState, useRef } from "react";
import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

import "./RateApp.css";
import IconButton from "../Buttons/IconButton";
import { Close, Publish } from "@mui/icons-material";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";

const RateApp = (props) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(null);
  const reviewContentRef = useRef("");
  const nameRef = useRef("");
  const [ratingError, setRatingError] = useState(false);

  const handleRating = (e, value) => {
    setRatingError(false);
    setRating(value);
  };

  return (
    <form
      method="post"
      className="rate-form"
      onSubmit={(e) => {
        if (rating !== null) {
          props.handleRateSubmit(
            e,
            nameRef.current.value,
            rating,
            reviewContentRef.current.value
          );
        } else {
          e.preventDefault();
          setRatingError(true);
        }
      }}
    >
      <h2 className="text-center">{t("rate_the_app")}</h2>
      <hr />
      <div className="row mb-3">
        <label
          htmlFor="inputEmail3"
          className="col-sm-12 col-form-label text-center"
        >
          {t("your_name")}
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control form-control-sm"
            id="inputEmail3"
            autoComplete="off"
            ref={nameRef}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label
          htmlFor="review_desc"
          className="col-sm-12 col-form-label text-center"
        >
          {t("feedback")}
        </label>
        <div className="col-sm-12">
          <textarea
            className="form-control mt-2 mb-2"
            name="review_desc"
            id="review_desc"
            rows="10"
            ref={reviewContentRef}
          ></textarea>
        </div>
      </div>
      <div className="row mb-3">
        <label
          htmlFor="rating"
          className={`col-sm-12 col-form-label text-center ${
            ratingError ? "text-error" : ""
          }`}
        >
          {t("rate_us")}
        </label>
        <div className="col-sm-12 text-center">
          <Rating
            value={rating}
            onChange={(e, value) => handleRating(e, value)}
            precision={0.5}
            size="large"
            aria-required
            max={10}
            className="rating-wrapper"
          />
          {rating && <p>{rating}/10</p>}
          {!rating && <p>0/10</p>}
          {rating >= 8 && (
            <p>{<SentimentVerySatisfiedIcon color="success" />}</p>
          )}
          {rating >= 6 && rating < 8 && (
            <p>{<SentimentSatisfiedAltIcon color="success" />}</p>
          )}
          {rating >= 4 && rating < 6 && (
            <p>{<SentimentSatisfiedIcon color="warning" />}</p>
          )}
          {rating >= 2 && rating < 4 && (
            <p>{<SentimentDissatisfiedIcon color="danger" />}</p>
          )}
          {rating < 2 && rating !== null && (
            <p>{<SentimentVeryDissatisfiedIcon color="danger" />}</p>
          )}
        </div>
      </div>
      <hr />
      <div className="row">
        <div className=" user-more-button w-auto">
          <IconButton
            text={removeUpperAccents(t("submit"))}
            icon={<Publish />}
            variant="contained"
            type="submit"
          />
        </div>
        <div className="col-4">
          <IconButton
            text={removeUpperAccents(t("close"))}
            icon={<Close />}
            variant="contained"
            onClick={props.close}
            color="error"
          />
        </div>
      </div>
    </form>
  );
};

export default RateApp;
