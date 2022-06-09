const router = require("express").Router();

let StaffPosition = require("../models/staffPosition.model");

router.route("/").get((req, res, next) => {
  StaffPosition.find()
    .then((staff) => {
      if (!staff) {
        const error = new Error("Could not find staff position.");
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
  StaffPosition.findById(req.params.id)
    .then((staff) => {
      if (!staff) {
        const error = new Error("Could not find staff position.");
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

  const staffPosition = new StaffPosition({
    name: name,
  });

  staffPosition
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add staff position.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Staff position successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  StaffPosition.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Staff position database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Staff position status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  StaffPosition.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Staff position database error.");
        throw error;
      }
      res.status(200).json({ message: "Staff position successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  StaffPosition.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find staff position.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Staff position successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
