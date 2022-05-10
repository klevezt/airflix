const router = require("express").Router();
const { validateToken } = require("../middleware/auth");

let Info = require("../models/info.model");

// router.all("*", [validateToken]);

router.route("/").get((req, res) => {
  Info.find(req.query)
    .then((info) => {
      res.json(info);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Info.findById(req.params.id)
    .then((info) => res.json(info))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const image = req.body.image;
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
    .then(() => res.json("Info added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Info.findByIdAndUpdate(
    req.params.name,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(todo);
    }
  ).catch((err) => {
    console.log(err.message);
  });
});

router.route("/update/:id").put((req, res) => {
  Info.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(todo);
    }
  ).catch((err) => {
    console.log(err.message);
  });
});

router.route("/content/update/:alias").put((req, res) => {
  Info.findOneAndUpdate(
    { alias: req.params.alias },
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(todo);
    }
  ).catch((err) => {
    console.log(err.message);
  });
});

router.route("/delete/:id").delete((req, res) => {
  Info.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Info Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
