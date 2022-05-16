const router = require("express").Router();

let Drink = require("../models/drink.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Drink.find(req.query)
    .then((drink) => {
      res.json(drink);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Drink.findById(req.params.id)
    .then((drink) => res.json(drink))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const alias = req.body.alias;
  const type = req.body.type;
  const images = req.body.images;
  const description = req.body.description;
  const price = req.body.price;
  const ingredients = req.body.ingredients;

  const newDrink = new Drink({
    name,
    alias,
    type,
    images,
    description,
    price,
    ingredients,
  });

  newDrink.save().then(() => res.json("Drink added!"));
  // .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Drink.findByIdAndUpdate(
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
  Drink.findByIdAndUpdate(
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

router.route("/update-drink-type").put((req, res) => {
  const myFilterQuery = { type: req.body.type };
  const changeValuesTo = { $set: { type: "-" } };
  Drink.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then(() => {
      res.json("Drink Successfully Updated!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/update-drink-type-statuses").put((req, res) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Drink.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then(() => {
      res.json("Drink Successfully Updated!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/delete/:id").delete((req, res) => {
  Drink.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Drink Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
