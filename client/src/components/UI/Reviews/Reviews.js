import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Rating, Fade, Backdrop, Modal } from "@mui/material";
import { ReadMore } from "@mui/icons-material";
import IconButton from "../../UI/Buttons/IconButton";
import { addReview } from "../../../api_requests/hotel_requests";
import { fetchReviewsFromDBWithParams } from "../../../api_requests/hotel_requests";
import CubeSpinner from "../Spinners/CubeSpinner";
import ReviewForm from "./ReviewForm";

import "./Review.css";
import FadeUpLong from "../../hoc/FadeUpLong";
import { truncateString } from "../../../Helpers/Functions/functions";
import ReviewDetails from "./ReviewDetails";
import { useStateValue } from "../../../StateProvider";

const Reviews = (props) => {
  const [state] = useStateValue();
  const [open, setOpen] = useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [viewReview, setViewReview] = useState([]);
  const [reviewDetails, setReviewDetails] = useState();

  const id = props.data._id;
  // const imagePath = process.env.REACT_APP_CLIENT_URL + "/assets/Images";

  useEffect(() => {
    let controller = new AbortController();
    let timer;
    
    setIsSpinnerLoading(true);
    const exec = () => {
      fetchReviewsFromDBWithParams({ reviewFor: id }, state.token).then(
        (data) => {
          const sortedData = data.sort((a, b) =>
            b.createdAt - a.createdAt ? 1 : -1
          );

          setReviews(sortedData);
          if (data.length !== 0) {
            timer = setTimeout(() => {
              setIsSpinnerLoading(false);
            }, 750);
          } else {
            setIsSpinnerLoading(false);
          }
        }
      );
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [id]);

  const handleReviewSubmit = (e, rating, content) => {
    e.preventDefault();
    addReview(
      {
        author: "Klevest Palucaj",
        image:
          process.env.REACT_APP_IMAGES_URL + "/Images/Avatar/img_avatar.png",
        reviewFor: id,
        rating: rating,
        content: content,
      },
      state.token
    ).then(() => {
      fetchReviewsFromDBWithParams({ reviewFor: id }, state.token)
        .then((data) => {
          const sortedData = data.sort((a, b) =>
            b.createdAt - a.createdAt ? 1 : -1
          );
          setReviews(sortedData);
          handleClose();
        })
        .then(() => {
          setIsSpinnerLoading(true);
          setTimeout(() => {
            setIsSpinnerLoading(false);
          }, 500);
        });
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setViewReview(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setViewReview(false);
    }, 500);
  };

  const handleReviewDetails = (rev) => {
    setOpen(true);
    setViewReview(true);
    setReviewDetails(rev);
  };

  const arrayHasSingleReview =
    reviews.length === 1 ? "justify-content-center" : "";

  return (
    <>
      {ReactDOM.createPortal(
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={"modalMenu"}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="modalReview-container">
              {!viewReview && (
                <ReviewForm handleReviewSubmit={handleReviewSubmit} />
              )}
              {viewReview && <ReviewDetails review={reviewDetails} />}
            </div>
          </Fade>
        </Modal>,
        document.getElementById("review-modal-root")
      )}
      <IconButton
        className="w-auto m-auto"
        text="Προσθήκη Κριτικής"
        color="warning"
        variant="contained"
        onClick={handleOpen}
      />
      <div className="row mt-3 w-100">
        <h1 className="reviews-headline">Κριτικές</h1>
        {isSpinnerLoading && <CubeSpinner />}
        {!isSpinnerLoading && (
          <section className="reviews mt-5">
            <FadeUpLong>
              <div className={`col-12 review-box ${arrayHasSingleReview}`}>
                {reviews.map((review, i) => {
                  return (
                    <div className="flex-three" key={i}>
                      <div className="review-avatar">
                        <img src={review.image} alt="" />
                      </div>
                      <div className="review-author">
                        <h4>{review.author}</h4>
                      </div>
                      <div className="text-center">
                        <p className="review-timestamp">
                          {new Date(review.createdAt).toUTCString()}
                        </p>
                        <Rating
                          name="read-only"
                          value={review.rating}
                          precision={0.5}
                          max={10}
                          size="large"
                          readOnly
                        />

                        <p>{truncateString(review.content, 90)}</p>
                        <IconButton
                          className="w-auto m-auto"
                          text="Προβολή Κριτικής"
                          color="warning"
                          variant="outlined"
                          onClick={() => handleReviewDetails(review)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {reviews.length !== 0 && (
                <div className="more-button">
                  <IconButton
                    className="w-auto m-auto"
                    text="Περισσότερες Κριτικές"
                    icon={<ReadMore className="mr-2" />}
                    color="warning"
                    variant="contained"
                  />
                </div>
              )}
            </FadeUpLong>
            {reviews.length === 0 && !isSpinnerLoading && (
              <p className="text-center">Δεν υπάρχουν διαθέσιμες κριτικές</p>
            )}
            {isSpinnerLoading && <CubeSpinner />}
          </section>
        )}
      </div>
    </>
  );
};

export default Reviews;
