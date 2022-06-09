const router = require("express").Router();

let User = require("../models/user.model");

router.route("/").get((req, res, next) => {
  User.find()
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find users.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/all").get((req, res, next) => {
  User.find()
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find all users.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/customers").get((req, res, next) => {
  User.find({ role: "Customer" })
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find user-customer.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/:id").get((req, res, next) => {
  User.findById(req.params.id)
    .then((users) => {
      if (!users) {
        const error = new Error("Could not find user by id.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/settings/update/:id").get((req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const error = new Error(
          "Could not find user by id for settings update."
        );
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/add").post((req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const room_number = req.body.room_number ? req.body.room_number : "";
  const room_type = req.body.room_type ? req.body.room_type : "";

  const newUser = new User({
    username,
    password,
    role,
    room_number,
    room_type,
  });

  newUser
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("Could not add user.");
        error.statusCode = 404;
        throw error;
      }
      res.status(201).json({ message: "User successfully added!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

router.route("/status/:id").put((req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("User database error.");
        throw error;
      }
      res.status(200).json({ message: "User status successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/update/:id").put((req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) {
        const error = new Error("User database error.");
        throw error;
      }
      res.status(200).json({ message: "User successfully updated!" });
    }
  ).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
});

router.route("/delete/:id").delete((req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "User successfully deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
});

module.exports = router;
