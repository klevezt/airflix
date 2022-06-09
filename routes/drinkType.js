const router = require("express").Router();

let DrinkType = require("../models/drinkType.model");

router.route("/").get((req, res, next) => {
  DrinkType.find()
    .then((drinkType) => {
      if (!drinkType) {
        const error = new Error("Could not find drink type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(drinkType);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  DrinkType.findById(req.params.id)
    .then((drinkType) => {
      if (!drinkType) {
        const error = new Error("Could not find drink type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(drinkType);
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
  const images = req.body.images;

  const newDrinkType = new DrinkType({
    name,
    images,
  });

  newDrinkType
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add drink type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json("Drink type added!");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  DrinkType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Drink type database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Drink type status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  DrinkType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Drink type database error.");
        throw error;
      }
      res.status(200).json({ message: "Drink type successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  DrinkType.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find drink type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Drink type successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
