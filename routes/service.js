const router = require("express").Router();

let Service = require("../models/service.model");

router.route("/").get((req, res, next) => {
  Service.find(req.query)
    .then((service) => {
      if (!service) {
        const error = new Error("Could not find service.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(service);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Service.findById(req.params.id)
    .then((service) => {
      if (!service) {
        const error = new Error("Could not find service.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(service);
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
  const type = req.body.type;
  const alias = req.body.alias;
  const phone = req.body.phone;
  const email = req.body.email;
  const location = req.body.location;
  const description = req.body.description;

  const newService = new Service({
    name,
    image,
    type,
    alias,
    phone,
    email,
    location,
    description,
  });

  newService
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add service.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Service successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Review database error.");
        throw error;
      }
      res.status(200).json({ message: "Review successfully updated!" });
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
    type: req.body.type,
    alias: req.body.alias,
    ...(req.file && { image: req.file.filename }),
    phone: req.body.phone,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description,
  };
  Service.findByIdAndUpdate(req.params.id, body, { new: true }, (err, todo) => {
    // Handle any possible database errors
    if (err) {
      const error = new Error("Review database error.");
      throw error;
    }
    res.status(200).json({ message: "Review status successfully updated!" });
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Service.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find service.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Service successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
