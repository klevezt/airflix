const router = require("express").Router();

let Rate = require("../models/rate.model");
const { validateToken } = require("../middleware/auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Rate.find(req.query)
    .then((review) => {
      res.json(review);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Rate.findById(req.params.id)
    .then((review) => res.json(review))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const author = req.body.author;
  const rating = req.body.rating;
  const content = req.body.content;

  const newRate = new Rate({ author, rating, content });

  newRate.save().then(() => res.json("Rate added!"));
  // .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Rate.findByIdAndUpdate(
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
  Rate.findByIdAndUpdate(
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
  Rate.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Rate Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
