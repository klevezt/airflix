const router = require("express").Router();

let Staff = require("../models/staff.model");

router.route("/").get((req, res, next) => {
  Staff.find(req.query)
    .then((staff) => {
      if (!staff) {
        const error = new Error("Could not find staff.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(staff);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Staff.findById(req.params.id)
    .then((staff) => {
      if (!staff) {
        const error = new Error("Could not find staff.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(staff);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/add").post((req, res, next) => {
  const name = req.body.name;
  const alias = req.body.alias;
  const position = req.body.position;
  const image = req.body.image;
  const description = req.body.description;

  const newStaff = new Staff({
    name,
    alias,
    position,
    image,
    description,
  });

  newStaff
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add staff.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Staff successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Staff.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Staff database error.");
        throw error;
      }
      res.status(200).json({ message: "Staff status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  Staff.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Staff database error.");
        throw error;
      }
      res.status(200).json({ message: "Staff successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Staff.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find staff.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Staff successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
