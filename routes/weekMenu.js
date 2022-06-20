const router = require("express").Router();

let weekMenu = require("../models/weekMenu.model");

router.route("/").get((req, res, next) => {
  const obj = req.query;
  weekMenu
    .find({ month: obj.month, year: obj.year })
    .then((week) => {
      if (!week) {
        const error = new Error("Could not find week.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(week);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/getFullDay").get((req, res, next) => {
  const obj = req.query;
  weekMenu
    .find({ week: obj.week, month: obj.month, year: obj.year })
    .then((week) => {
      if (!week) {
        const error = new Error("Could not find week.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(week);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/add").post((req, res, next) => {
  const week = new weekMenu(req.body);

  week
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add week.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Week successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/update").put((req, res, next) => {
  const obj = req.query;
  weekMenu
    .findOneAndUpdate(
      { year: obj.year, month: obj.month, week: obj.week },
      req.body,
      { new: true },
      (err, todo) => {
        // Handle any possible database errors
        if (err) {
          const error = new Error("Week database error.");
          throw error;
        }
        res.status(200).json({ message: "Week status successfully updated!" });
      }
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/update/all").put((req, res, next) => {
  const obj = req.query;
  weekMenu
    .findOneAndUpdate(
      { year: obj.year, month: obj.month, week: obj.week },
      req.body,
      { new: true },
      (err, todo) => {
        // Handle any possible database errors
        if (err) {
          const error = new Error("Week database error.");
          throw error;
        }
        res.status(200).json({ message: "Week status successfully updated!" });
      }
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/delete").delete((req, res, next) => {
  const obj = req.query;
  weekMenu
    .deleteMany({ year: obj.year, month: obj.month })
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find week.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Week status successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
