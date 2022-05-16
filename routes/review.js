const router = require("express").Router();

let Review = require("../models/review.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Review.find(req.query)
    .then((review) => {
      res.json(review);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Review.findById(req.params.id)
    .then((review) => res.json(review))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const author = req.body.author;
  const image = req.body.image;
  const reviewFor = req.body.reviewFor;
  const rating = req.body.rating;
  const content = req.body.content;

  const newReview = new Review({ author, image, reviewFor, rating, content });

  newReview.save().then(() => res.json("Review added!"));
  // .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Review.findByIdAndUpdate(
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
  Review.findByIdAndUpdate(
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
  Review.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Review Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
