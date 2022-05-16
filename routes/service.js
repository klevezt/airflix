const router = require("express").Router();

let Service = require("../models/service.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Service.find(req.query)
    .then((service) => {
      res.json(service);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Service.findById(req.params.id)
    .then((service) => res.json(service))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const type = req.body.type;
  const alias = req.body.alias;
  const phone = req.body.phone;
  const email = req.body.email;
  const location = req.body.location;
  const description = req.body.description;

  const newService = new Service({
    name,
    image,
    type,
    alias,
    phone,
    email,
    location,
    description,
  });

  newService
    .save()
    .then(() => res.json("Service added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Service.findByIdAndUpdate(
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
  Service.findByIdAndUpdate(
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
  Service.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Service Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
