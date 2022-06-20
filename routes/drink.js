const router = require("express").Router();

let Drink = require("../models/drink.model");

router.route("/").get((req, res, next) => {
  Drink.find(req.query)
    .then((drink) => {
      if (!drink) {
        const error = new Error("Could not find drink.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(drink);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Drink.findById(req.params.id)
    .then((drink) => {
      if (!drink) {
        const error = new Error("Could not find drink by id.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(drink);
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
  const type = req.body.type;
  const image = req.file.filename;
  const description = req.body.description;
  const price = req.body.price;
  const ingredients = req.body.ingredients;

  const newDrink = new Drink({
    name,
    alias,
    type,
    image,
    description,
    price,
    ingredients,
  });

  newDrink
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add drink.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Drink successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Drink.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Drink database error.");
        throw error;
      }
      res.status(200).json({ message: "Drink status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  const body = {
    name: req.body.name,
    alias: req.body.alias,
    type: req.body.type,
    ...(req.file && { image: req.file.filename }),
    description: req.body.description,
    price: req.body.price,
    ingredients: req.body.ingredients,
  };
  Drink.findByIdAndUpdate(
    req.params.id,
    body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Drink database error.");
        throw error;
      }
      res.status(200).json({ message: "Drink status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update-drink-type").put((req, res, next) => {
  const myFilterQuery = { type: req.body.type };
  const changeValuesTo = { $set: { type: "-" } };
  Drink.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add drink.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json("Drink successfully updated!");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/update-drink-type-statuses").put((req, res, next) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Drink.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add drink.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json("Drink successfully updated!");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/delete/:id").delete((req, res, next) => {
  Drink.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find drink.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json("Drink successfully deleted!");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
