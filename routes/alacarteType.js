const router = require("express").Router();

let AlacarteType = require("../models/alacarteType.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  AlacarteType.find()
    .then((alacartType) => {
      res.json(alacartType);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  AlacarteType.findById(req.params.id)
    .then((alacartType) => res.json(alacartType))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const images = req.body.images;

  const newAlacarteType = new AlacarteType({
    name,
    images,
  });

  newAlacarteType
    .save()
    .then(() => res.json("Alacarte Type added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  AlacarteType.findByIdAndUpdate(
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

router.route("/update/:id").put((req, res) => {
  AlacarteType.findByIdAndUpdate(
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

router.route("/delete/:id").delete((req, res) => {
  AlacarteType.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("AlacarteType Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
