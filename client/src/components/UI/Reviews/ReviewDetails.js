import React, { useState } from "react";
import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";

const ReviewDetails = (props) => {
  const { t } = useTranslation();

  const [reviewRating, setReviewRating] = useState(props.review.rating);
  const [reviewContent, setReviewContent] = useState(props.review.content);

  const handleReviewRating = (e) => {
    setReviewRating(e.target.value);
  };

  const handleReviewContent = (e) => {
    setReviewContent(e.target.value);
  };

  return (
    <div className="general-form">
      <div className="container">
        <div className="review-details-avatar">
          <img src={props.review.image} alt="" />
        </div>
        <div className="row mb-3">
          <h3 className="text-center">{props.review.author}</h3>
          <div className="col-sm-12">
            <h6 className="text-center review-timestamp">
              {new Date(props.review.createdAt).toUTCString()}
            </h6>
          </div>
        </div>
        <hr />

        <div className="row mb-3">
          <label
            htmlFor="review_desc"
            className="col-sm-12 col-form-label text-center"
          >
            {t("comments")}
          </label>
          <div className="col-sm-12">
            <textarea
              className="form-control mt-2 mb-2"
              name="review_desc"
              id="review_desc"
              rows="10"
              value={reviewContent}
              onChange={handleReviewContent}
              readOnly
            ></textarea>
          </div>
        </div>
        <div className="row mb-3">
          <label
            htmlFor="food_type"
            className="col-sm-12 col-form-label text-center"
          >
            {t("score")}
          </label>
          <div className="col-sm-12 text-center">
            <Rating
              value={reviewRating}
              onChange={(e) => handleReviewRating(e)}
              precision={0.5}
              size="large"
              max={10}
              readOnly
            />
            {reviewRating && <p>{reviewRating}/10</p>}
            {!reviewRating && <p>0/10</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
