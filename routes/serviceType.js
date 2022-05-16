const router = require("express").Router();

let ServiceType = require("../models/serviceType.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  ServiceType.find(req.query)
    .then((service) => {
      res.json(service);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  ServiceType.findById(req.params.id)
    .then((service) => res.json(service))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const content = req.body.content;
  const alias = req.body.alias;
  const featured = req.body.featured;

  const newService = new ServiceType({
    name,
    image,
    content,
    alias,
    featured,
  });

  newService
    .save()
    .then(() => res.json("ServiceType added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  ServiceType.findByIdAndUpdate(
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
  ServiceType.findByIdAndUpdate(
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
  ServiceType.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("ServiceType Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
