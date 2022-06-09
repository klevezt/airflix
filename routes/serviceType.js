const router = require("express").Router();

let ServiceType = require("../models/serviceType.model");

router.route("/").get((req, res) => {
  ServiceType.find(req.query)
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

router.route("/:id").get((req, res) => {
  ServiceType.findById(req.params.id)
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

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const content = req.body.content;
  const alias = req.body.alias;
  const featured = req.body.featured;

  const newService = new ServiceType({
    name,
    image,
    content,
    alias,
    featured,
  });

  newService
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add service type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Service type successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res) => {
  ServiceType.findByIdAndUpdate(
    req.params.name,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Service type database error.");
        throw error;
      }
      res
        .status(200)
        .json({ message: "Service type status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res) => {
  ServiceType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Service type database error.");
        throw error;
      }
      res.status(200).json({ message: "Service type successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res) => {
  ServiceType.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find service type.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Service type successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
