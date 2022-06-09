const router = require("express").Router();

let Review = require("../models/review.model");

router.route("/").get((req, res, next) => {
  Review.find(req.query)
    .then((review) => {
      if (!review) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(review);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(review);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/add").post((req, res, next) => {
  const author = req.body.author;
  const image = req.body.image;
  const reviewFor = req.body.reviewFor;
  const rating = req.body.rating;
  const content = req.body.content;

  const newReview = new Review({ author, image, reviewFor, rating, content });

  newReview
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add review.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Review successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Review database error.");
        throw error;
      }
      res.status(200).json({ message: "Review status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Review database error.");
        throw error;
      }
      res.status(200).json({ message: "Review  successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Review.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Review successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
