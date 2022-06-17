const router = require("express").Router();

let Event = require("../models/events.model");

router.route("/").get((req, res, next) => {
  Event.find(req.query)
    .then((events) => {
      if (!events) {
        const error = new Error("Could not find event.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(events);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Event.findById(req.params.id)
    .then((events) => {
      if (!events) {
        const error = new Error("Could not find event.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(events);
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
  const time = req.body.time;
  const image = req.file.filename;
  const description = req.body.description;

  const newEvent = new Event({
    name,
    alias,
    time,
    image,
    description,
  });

  newEvent
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add event.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Event successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Event database error.");
        throw error;
      }
      res.status(200).json({ message: "Event status successfully updated!" });
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
    time: req.body.time,
    ...(req.file && { image: req.file.filename }),
    description: req.body.description,
  };

  Event.findByIdAndUpdate(
    req.params.id,
    body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Event database error.");
        throw error;
      }
      res.status(200).json({ message: "Event successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find event.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Event successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
