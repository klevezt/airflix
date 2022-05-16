const router = require("express").Router();

let Food = require("../models/food.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Food.find(req.query)
    .then((food) => {
      res.json(food);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Food.findById(req.params.id)
    .then((food) => res.json(food))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  const images = req.body.images;
  const ingredients = req.body.ingredients;
  const special_features = req.body.special_features;
  const description = req.body.description;

  const newFood = new Food({
    name,
    type,
    special_features,
    ingredients,
    images,
    description,
  });

  newFood
    .save()
    .then(() => res.json("Food added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Food.findByIdAndUpdate(
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

router.route("/update-food-type-statuses").put((req, res) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Food.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then(() => {
      res.json("Food Successfully Updated!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/update/:id").put((req, res) => {
  Food.findByIdAndUpdate(
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
  Food.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Food Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
