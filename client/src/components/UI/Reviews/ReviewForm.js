import React, { useState, useRef } from "react";
import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const ReviewForm = (props) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(null);
  const reviewContentRef = useRef("");

  const handleRating = (e, value) => {
    setRating(value);
  };

  return (
    <form
      method="post"
      className="general-form"
      onSubmit={(e) =>
        props.handleReviewSubmit(e, rating, reviewContentRef.current.value)
      }
    >
      <div className="container">
        <h2 className="text-center">Νέα Κριτική</h2>
        <hr />
        <div className="row mb-3">
          <label
            htmlFor="review_desc"
            className="col-sm-12 col-form-label text-center"
          >
            Σχόλια
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
            htmlFor="food_type"
            className="col-sm-12 col-form-label text-center"
          >
            Βαθμολογήστε μας!
          </label>
          <div className="col-sm-12 text-center">
            <Rating
              value={rating}
              onChange={(e, value) => handleRating(e, value)}
              precision={0.5}
              size="large"
              max={10}
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
        <button type="submit" className="btn btn-primary-theme">
          {t("submit")}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
