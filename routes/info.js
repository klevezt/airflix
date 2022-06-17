const router = require("express").Router();

let Info = require("../models/info.model");

router.route("/").get((req, res, next) => {
  Info.find(req.query)
    .then((info) => {
      if (!info) {
        const error = new Error("Could not find info.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(info);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  Info.findById(req.params.id)
    .then((info) => {
      if (!info) {
        const error = new Error("Could not find info.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(info);
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
  const content = req.body.content;
  const alias = req.body.alias;

  const newInfo = new Info({
    name,
    image,
    content,
    alias,
  });

  newInfo
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add info.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "Info successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  Info.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Info database error.");
        throw error;
      }
      res.status(200).json({ message: "Info status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id/featured").put((req, res, next) => {
  Info.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("Info database error.");
        throw error;
      }
      res.status(200).json({ message: "Info status successfully updated!" });
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
    ...(req.file && { image: req.file.filename }),
  };

  Info.findByIdAndUpdate(req.params.id, body, { new: true }, (err, todo) => {
    // Handle any possible database errors
    if (err) {
      const error = new Error("Info database error.");
      throw error;
    }
    res.status(200).json({ message: "Info successfully updated!" });
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/content/update/:alias").put((req, res, next) => {
  Info.findOneAndUpdate(req.params.id, req.body, { new: true }, (err, todo) => {
    // Handle any possible database errors
    if (err) {
      const error = new Error("Info database error.");
      throw error;
    }
    res.status(200).json({ message: "Info content successfully updated!" });
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  Info.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find info.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Info successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
