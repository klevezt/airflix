const router = require("express").Router();

let Err = require("../models/error.model");

router.route("/").get((req, res) => {
  Err.find(req.query)
    .then((food) => {
      res.json(food);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const content = req.body.content;

  const newError = new Err({
    content
  });

  newError
    .save()
    .then(() => res.json("Error added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Err.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Error Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
