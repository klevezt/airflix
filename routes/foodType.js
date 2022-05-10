const router = require("express").Router();

let FoodType = require("../models/foodType.model");
const { validateToken } = require("../middleware/auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  FoodType.find()
    .then((food) => {
      res.json(food);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  FoodType.findById(req.params.id)
    .then((foodType) => res.json(foodType))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const property = req.body.weekPropertyName;
  const image = req.body.image;

  const newFoodType = new FoodType({
    name,
    weekPropertyName: property,
    image,
  });

  newFoodType
    .save()
    .then(() => res.json("FoodType added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  FoodType.findByIdAndUpdate(
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
  FoodType.findByIdAndUpdate(
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
  FoodType.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("FoodType Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
