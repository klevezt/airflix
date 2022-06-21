const router = require("express").Router();

let FoodType = require("../models/foodType.model");

router.route("/").get((req, res, next) => {
  FoodType.find(req.query)
    .then((foodType) => {
      if (!foodType) {
        const error = new Error("Could not find food type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(foodType);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  FoodType.findById(req.params.id)
    .then((foodType) => {
      if (!foodType) {
        const error = new Error("Could not find food type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(foodType);
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
  const property = req.body.weekPropertyName;
  const image = req.file.filename;

  const newFoodType = new FoodType({
    name,
    weekPropertyName: property,
    image,
  });

  newFoodType
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add food type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Food type successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  FoodType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Food database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Food type status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  FoodType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Food database error.");
        throw error;
      }
      res.status(200).json({ message: "Food type successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  FoodType.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find food type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Food type successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
