const router = require("express").Router();

let Alacarte = require("../models/alacarte.model");

router.route("/").get((req, res, next) => {
  Alacarte.find(req.query)
    .then((alacarte) => {
      if (!alacarte) {
        const error = new Error("Could not find alacarte.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(alacarte);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Alacarte.findById(req.params.id)
    .then((alacarte) => {
      if (!alacarte) {
        const error = new Error("Could not find alacarte by id.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(alacarte);
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

  const newAlacarte = new Alacarte({
    name,
    alias,
    type,
    image,
    description,
    price,
    ingredients,
  });

  newAlacarte
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add alacarte.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Alacarte successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Alacarte.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Alacarte database error.");
        throw error;
      }
      res.send(todo);
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

  Alacarte.findByIdAndUpdate(
    req.params.id,
    body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Alacarte database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Alacarte type status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update-alacarte-type-statuses").put((req, res, next) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Alacarte.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then((alacarte) => {
      if (!alacarte) {
        const error = new Error("Could not find alacarte.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Alacarte successfully updated!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/delete/:id").delete((req, res, next) => {
  Alacarte.findByIdAndDelete(req.params.id)
    .then((alacarte) => {
      if (!alacarte) {
        const error = new Error("Could not find alacarte.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Alacarte successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
