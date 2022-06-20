const router = require("express").Router();

let AlacarteType = require("../models/alacarteType.model");

router.route("/").get((req, res, next) => {
  AlacarteType.find()
    .then((alacartType) => {
      if (!alacartType) {
        const error = new Error("Could not find alacarte type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(alacartType);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  AlacarteType.findById(req.params.id)
    .then((alacartType) => {
      if (!alacartType) {
        const error = new Error("Could not find alacarte type by id.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(alacartType);
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
  const image = req.file.filename;

  const newAlacarteType = new AlacarteType({
    name,
    image,
  });

  newAlacarteType
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add alacarte type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Alacarte type successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  AlacarteType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Alacarte type database error.");
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

router.route("/update/:id").put((req, res, next) => {
   const body = {
     name: req.body.name,
     ...(req.file && { image: req.file.filename }),
   };

  AlacarteType.findByIdAndUpdate(
    req.params.id,
    body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Alacarte type database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Alacarte type successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  AlacarteType.findByIdAndDelete(req.params.id)
    .then((alacarteType) => {
      if (!alacarteType) {
        const error = new Error("Could not find alacarte type.");
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Alacarte type successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
