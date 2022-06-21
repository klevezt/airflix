const router = require("express").Router();

let Food = require("../models/food.model");

router.route("/").get((req, res, next) => {
  Food.find(req.query)
    .then((food) => {
      if (!food) {
        const error = new Error("Could not find food.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(food);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Food.findById(req.params.id)
    .then((food) => {
      if (!food) {
        const error = new Error("Could not find food.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(food);
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
  const type = req.body.type;
  const image = req.file.filename;
  const ingredients = req.body.ingredients;
  const special_features = req.body.special_features;
  const description = req.body.description;

  const newFood = new Food({
    name,
    type,
    special_features,
    ingredients,
    image,
    description,
  });

  newFood
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add food.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Food successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Food.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Food database error.");
        throw error;
      }
      res.status(200).json({ message: "Food status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update-food-type-statuses").put((req, res, next) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Food.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find food.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Food successfully updated!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/update/:id").put((req, res, next) => {
  Food.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Food database error.");
        throw error;
      }
      res.status(200).json({ message: "Food successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Food.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find food.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Food successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
