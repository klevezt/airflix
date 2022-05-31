const router = require("express").Router();

let Alacarte = require("../models/alacarte.model");

router.route("/").get((req, res) => {
  Alacarte.find(req.query)
    .then((alacarte) => {
      res.json(alacarte);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Alacarte.findById(req.params.id)
    .then((alacarte) => res.json(alacarte))
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

  const newAlacarte = new Alacarte({
    name,
    alias,
    type,
    images,
    description,
    price,
    ingredients,
  });

  newAlacarte.save().then(() => res.json("Alacarte added!"));
  // .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Alacarte.findByIdAndUpdate(
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
  Alacarte.findByIdAndUpdate(
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

router.route("/update-alacarte-type-statuses").put((req, res) => {
  const myFilterQuery = { type: req.body.type };

  const changeValuesTo = { $set: { status: req.body.status } };
  Alacarte.updateMany(myFilterQuery, changeValuesTo, () => {})
    .then(() => {
      res.json("Alacarte Successfully Updated!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/delete/:id").delete((req, res) => {
  Alacarte.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Alacarte Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
