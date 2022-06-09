const router = require("express").Router();

let Rate = require("../models/rate.model");

router.route("/").get((req, res, next) => {
  Rate.find(req.query)
    .then((rate) => {
      if (!rate) {
        const error = new Error("Could not find rate.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(rate);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Rate.findById(req.params.id)
    .then((rate) => {
      if (!rate) {
        const error = new Error("Could not find rate.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(rate);
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
  const rating = req.body.rating;
  const content = req.body.content;

  const newRate = new Rate({ author, rating, content });

  newRate
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add rate.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Rate successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Rate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Rate database error.");
        throw error;
      }
      res.status(200).json({ message: "Rate status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  Rate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Rate database error.");
        throw error;
      }
      res.status(200).json({ message: "Rate successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Rate.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find rate.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Rate successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
