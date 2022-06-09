const router = require("express").Router();

let Err = require("../models/error.model");

router.route("/").get((req, res, next) => {
  Err.find(req.query)
    .then((customError) => {
      if (!customError) {
        const error = new Error("Could not find error.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(customError);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/add").post((req, res, next) => {
  const content = req.body.content;

  const newError = new Err({
    content,
  });

  newError
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add error.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json("Error added!");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/delete/:id").delete((req, res, next) => {
  Err.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find error.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Error successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
