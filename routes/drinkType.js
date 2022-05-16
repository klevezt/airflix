const router = require("express").Router();

let DrinkType = require("../models/drinkType.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  DrinkType.find()
    .then((drink) => {
      res.json(drink);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  DrinkType.findById(req.params.id)
    .then((foodType) => res.json(foodType))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const images = req.body.images;

  const newDrinkType = new DrinkType({
    name,
    images,
  });

  newDrinkType
    .save()
    .then(() => res.json("DrinkType added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  DrinkType.findByIdAndUpdate(
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
  DrinkType.findByIdAndUpdate(
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
  DrinkType.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("DrinkType Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
